from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database.db import get_db
from backend.app.models.database_models import Job, Recruiter, Resume
from backend.app.schemas.pydantic_schemas import JobCreate, JobResponse
from backend.app.utils.security import get_current_recruiter

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

@router.get("", response_model=dict)
def list_jobs(
    db: Session = Depends(get_db),
    recruiter: Recruiter = Depends(get_current_recruiter)
):
    jobs = db.query(Job).filter(Job.recruiterId == recruiter.id).order_by(Job.createdAt.desc()).all()
    
    result = []
    for job in jobs:
        applicant_count = db.query(Resume).filter(Resume.jobId == job.id).count()
        job_data = JobResponse.model_validate(job)
        job_dict = job_data.model_dump()
        job_dict["_count"] = {"resumes": applicant_count}
        result.append(job_dict)

    return {"jobs": result}

@router.post("", status_code=status.HTTP_201_CREATED)
def create_job(
    payload: JobCreate,
    db: Session = Depends(get_db),
    recruiter: Recruiter = Depends(get_current_recruiter)
):
    job = Job(
        recruiterId=recruiter.id,
        title=payload.title,
        department=payload.department,
        location=payload.location,
        employmentType=payload.employmentType,
        experienceRequired=payload.experienceRequired,
        salaryRange=payload.salaryRange,
        description=payload.description,
        requiredSkills=payload.requiredSkills,
        deadline=payload.deadline,
        status="Active"
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    return {"message": "Job created successfully", "job": JobResponse.model_validate(job)}

@router.get("/{job_id}")
def get_job_details(job_id: str, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job requisition not found")

    applicant_count = db.query(Resume).filter(Resume.jobId == job.id).count()
    job_data = JobResponse.model_validate(job).model_dump()
    job_data["_count"] = {"resumes": applicant_count}

    return {"job": job_data}
