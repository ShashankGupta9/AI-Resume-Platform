import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend.app.database.db import get_db
from backend.app.models.database_models import Resume, Job, Recruiter
from backend.app.schemas.pydantic_schemas import ResumeResponse, JobResponse
from backend.app.services.ai_matcher import analyze_resume_file
from backend.app.services.storage_service import save_resume_file
from backend.app.utils.security import get_current_recruiter

router = APIRouter(prefix="/api/resumes", tags=["Resumes"])

@router.get("")
def list_resumes(
    job_id: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    recruiter: Recruiter = Depends(get_current_recruiter)
):
    query = db.query(Resume).join(Job).filter(Job.recruiterId == recruiter.id)

    if job_id and job_id != "All":
        query = query.filter(Resume.jobId == job_id)

    if search:
        s = f"%{search}%"
        query = query.filter(
            (Resume.candidateName.ilike(s)) |
            (Resume.email.ilike(s)) |
            (Resume.extractedSkills.ilike(s))
        )

    resumes = query.order_by(Resume.uploadDate.desc()).all()

    result = []
    for r in resumes:
        r_data = ResumeResponse.model_validate(r).model_dump()
        if r.job:
            r_data["job"] = JobResponse.model_validate(r.job).model_dump()
        result.append(r_data)

    return {"resumes": result}

@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    jobId: str = Form(...),
    candidateName: Optional[str] = Form(""),
    email: Optional[str] = Form(""),
    phone: Optional[str] = Form(""),
    db: Session = Depends(get_db),
    recruiter: Recruiter = Depends(get_current_recruiter)
):
    file_name = file.filename
    ext = file_name.split(".")[-1].lower() if "." in file_name else ""

    if ext not in ["pdf", "docx"]:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Only PDF and DOCX files are allowed."
        )

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds maximum allowed 10MB limit."
        )

    job = db.query(Job).filter(Job.id == jobId).first()
    if not job:
        raise HTTPException(status_code=404, detail="Selected target job does not exist.")

    # Run AI Analysis
    ai_result = analyze_resume_file(content, ext, job.requiredSkills, job.title)

    final_name = candidateName.strip() if candidateName and candidateName.strip() else file_name.rsplit(".", 1)[0].replace("_", " ")
    final_email = email.strip() if email and email.strip() else (ai_result.get("extracted_email") or "applicant@example.com")
    final_phone = phone.strip() if phone and phone.strip() else (ai_result.get("extracted_phone") or "N/A")

    file_url = save_resume_file(content, file_name, file.content_type or "application/octet-stream")

    resume = Resume(
        jobId=jobId,
        candidateName=final_name,
        email=final_email,
        phone=final_phone,
        fileUrl=file_url,
        fileName=file_name,
        fileType=ext,
        rawText=ai_result["raw_text"],
        aiMatchScore=ai_result["match_score"],
        aiSummary=ai_result["summary"],
        extractedSkills=json.dumps(ai_result["extracted_skills"]),
        status="Submitted"
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    res_data = ResumeResponse.model_validate(resume).model_dump()
    res_data["job"] = JobResponse.model_validate(job).model_dump()

    return {
        "message": "Resume uploaded and analyzed successfully",
        "resume": res_data
    }

@router.delete("/{resume_id}")
def delete_resume(resume_id: str, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume record not found")

    db.delete(resume)
    db.commit()
    return {"message": "Resume deleted successfully"}
