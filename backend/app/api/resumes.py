import json
import tempfile
from pathlib import Path
from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File,
    Form,
)
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.database_models import Resume, Job, Recruiter
from app.schemas.pydantic_schemas import ResumeResponse, JobResponse

from app.services.ai_matcher import analyze_resume_file
from app.services.storage_service import save_resume_file
from app.services.resume_parser.parser import parse_resume
from app.services.resume_parser.extractor import ResumeExtractionError
from app.utils.security import get_current_recruiter


router = APIRouter(
    prefix="/api/resumes",
    tags=["Resumes"],
)


# ============================================================
# Constants
# ============================================================

ALLOWED_RESUME_EXTENSIONS = {".pdf", ".docx"}

MAX_RESUME_SIZE = 10 * 1024 * 1024  # 10 MB


# ============================================================
# GET /api/resumes
# Existing endpoint
# ============================================================

@router.get("")
def list_resumes(
    job_id: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    recruiter: Recruiter = Depends(get_current_recruiter),
):
    query = (
        db.query(Resume)
        .join(Job)
        .filter(Job.recruiter_id == recruiter.id)
    )

    if job_id and job_id != "All":
        query = query.filter(Resume.job_id == job_id)

    if search:
        s = f"%{search}%"

        query = query.filter(
            (Resume.candidate_name.ilike(s))
            | (Resume.email.ilike(s))
            | (Resume.extracted_skills.ilike(s))
        )

    resumes = query.order_by(
        Resume.upload_date.desc()
    ).all()

    result = []

    for resume in resumes:
        resume_data = ResumeResponse.model_validate(
            resume
        ).model_dump()

        if resume.job:
            resume_data["job"] = JobResponse.model_validate(
                resume.job
            ).model_dump()

        result.append(resume_data)

    return {
        "resumes": result
    }


# ============================================================
# POST /api/resumes/parse
# NEW PHASE 5 PARSING ENDPOINT
# ============================================================

@router.post("/parse")
async def parse_resume_endpoint(
    file: UploadFile = File(...),
):
    """
    Phase 5 resume parsing endpoint.

    This endpoint ONLY parses the uploaded resume.

    Pipeline:

        PDF/DOCX
            ↓
        Text extraction
            ↓
        Text cleaning
            ↓
        Section detection
            ↓
        Parsed resume JSON

    This endpoint does NOT:

        - create a Resume database record
        - store the resume permanently
        - run the existing AI matcher
        - calculate a job match score
        - require authentication

    It is intended for testing and developing
    the Phase 5 resume parsing pipeline.
    """

    # --------------------------------------------------------
    # Validate filename
    # --------------------------------------------------------

    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume filename is required.",
        )

    file_path = Path(file.filename)

    extension = file_path.suffix.lower()

    # --------------------------------------------------------
    # Validate file extension
    # --------------------------------------------------------

    if extension not in ALLOWED_RESUME_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Unsupported file format. "
                "Only PDF and DOCX files are allowed."
            ),
        )

    # --------------------------------------------------------
    # Read uploaded file
    # --------------------------------------------------------

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded resume is empty.",
        )

    # --------------------------------------------------------
    # Validate file size
    # --------------------------------------------------------

    if len(content) > MAX_RESUME_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds the maximum allowed limit of 10 MB.",
        )

    temp_path: Optional[Path] = None

    try:
        # ----------------------------------------------------
        # Create temporary file
        # ----------------------------------------------------

        with tempfile.NamedTemporaryFile(
            suffix=extension,
            delete=False,
        ) as temp_file:

            temp_file.write(content)
            temp_path = Path(temp_file.name)

        # ----------------------------------------------------
        # Run Phase 5 parser
        # ----------------------------------------------------

        parsed_resume = parse_resume(temp_path)

        # ----------------------------------------------------
        # Return parsed data
        # ----------------------------------------------------

        return {
            "success": True,
            "message": "Resume parsed successfully.",
            "data": parsed_resume,
        }

    except ResumeExtractionError as exc:

        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc

    except Exception as exc:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Resume parsing failed: {exc}",
        ) from exc

    finally:

        # ----------------------------------------------------
        # Always delete temporary file
        # ----------------------------------------------------

        if temp_path and temp_path.exists():

            try:
                temp_path.unlink()

            except OSError:
                pass


# ============================================================
# POST /api/resumes
# EXISTING RESUME UPLOAD + AI MATCHING ENDPOINT
# ============================================================

@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
async def upload_resume(
    file: UploadFile = File(...),
    jobId: str = Form(...),
    candidateName: Optional[str] = Form(""),
    email: Optional[str] = Form(""),
    phone: Optional[str] = Form(""),
    db: Session = Depends(get_db),
    recruiter: Recruiter = Depends(get_current_recruiter),
):
    file_name = file.filename

    if not file_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume filename is required.",
        )

    file_path = Path(file_name)

    ext = file_path.suffix.lower().lstrip(".")

    # --------------------------------------------------------
    # Validate extension
    # --------------------------------------------------------

    if ext not in {"pdf", "docx"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Unsupported file format. "
                "Only PDF and DOCX files are allowed."
            ),
        )

    # --------------------------------------------------------
    # Read file
    # --------------------------------------------------------

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded resume is empty.",
        )

    # --------------------------------------------------------
    # Validate file size
    # --------------------------------------------------------

    if len(content) > MAX_RESUME_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds maximum allowed 10 MB limit.",
        )

    # --------------------------------------------------------
    # Find target job
    # --------------------------------------------------------

    job = (
        db.query(Job)
        .filter(Job.id == jobId)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Selected target job does not exist.",
        )

    # --------------------------------------------------------
    # Existing AI analysis
    # --------------------------------------------------------

    ai_result = analyze_resume_file(
        content,
        ext,
        job.required_skills,
        job.title,
    )

    # --------------------------------------------------------
    # Candidate information
    # --------------------------------------------------------

    final_name = (
        candidateName.strip()
        if candidateName and candidateName.strip()
        else file_name.rsplit(".", 1)[0].replace("_", " ")
    )

    final_email = (
        email.strip()
        if email and email.strip()
        else (
            ai_result.get("extracted_email")
            or "applicant@example.com"
        )
    )

    final_phone = (
        phone.strip()
        if phone and phone.strip()
        else (
            ai_result.get("extracted_phone")
            or "N/A"
        )
    )

    # --------------------------------------------------------
    # Save resume file
    # --------------------------------------------------------

    file_url = save_resume_file(
        content,
        file_name,
        file.content_type or "application/octet-stream",
    )

    # --------------------------------------------------------
    # Create database record
    # --------------------------------------------------------

    resume = Resume(
        job_id=jobId,
        candidate_name=final_name,
        email=final_email,
        phone=final_phone,
        file_url=file_url,
        file_name=file_name,
        file_type=ext,
        raw_text=ai_result["raw_text"],
        ai_match_score=ai_result["match_score"],
        ai_summary=ai_result["summary"],
        extracted_skills=json.dumps(
            ai_result["extracted_skills"]
        ),
        status="Submitted",
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    # --------------------------------------------------------
    # Build response
    # --------------------------------------------------------

    resume_data = ResumeResponse.model_validate(
        resume
    ).model_dump()

    resume_data["job"] = JobResponse.model_validate(
        job
    ).model_dump()

    return {
        "message": "Resume uploaded and analyzed successfully.",
        "resume": resume_data,
    }


# ============================================================
# DELETE /api/resumes/{resume_id}
# Existing endpoint
# ============================================================

@router.delete("/{resume_id}")
def delete_resume(
    resume_id: str,
    db: Session = Depends(get_db),
):
    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id)
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume record not found",
        )

    db.delete(resume)
    db.commit()

    return {
        "message": "Resume deleted successfully"
    }
