import json
import math
from typing import Optional, List, Dict
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from app.models.database_models import Job, Resume, Recruiter
from app.schemas.job_schema import JobCreate, JobUpdate, JobResponse

def format_job_response(job: Job, db: Session) -> JobResponse:
    # Parse required_skills JSON string or list
    skills_raw = job.requiredSkills or job.required_skills or "[]"
    if isinstance(skills_raw, str):
        try:
            skills = json.loads(skills_raw)
        except Exception:
            skills = [s.strip() for s in skills_raw.split(',') if s.strip()]
    elif isinstance(skills_raw, list):
        skills = skills_raw
    else:
        skills = []

    applicant_count = db.query(Resume).filter(Resume.jobId == job.id).count()

    sal_min = job.salary_min if job.salary_min is not None else 0.0
    sal_max = job.salary_max if job.salary_max is not None else 0.0
    sal_range = f"${sal_min:,.0f} - ${sal_max:,.0f}" if (sal_min or sal_max) else (job.salaryRange or "Competitive")

    return JobResponse(
        id=job.id,
        recruiter_id=job.recruiterId or job.recruiter_id,
        title=job.title,
        department=job.department,
        employment_type=job.employmentType or job.employment_type or "Full-Time",
        location=job.location or "Remote",
        experience_level=job.experienceRequired or job.experience_level or "1-3 years",
        salary_min=sal_min,
        salary_max=sal_max,
        salary_range=sal_range,
        description=job.description,
        requirements=job.requirements or "",
        required_skills=skills,
        deadline=job.deadline or "2026-12-31",
        status=job.status or "OPEN",
        created_at=job.createdAt or job.created_at,
        updated_at=job.updatedAt or job.updated_at,
        applicant_count=applicant_count
    )

def get_recruiter_jobs(
    db: Session,
    recruiter_id: str,
    search: Optional[str] = None,
    status: Optional[str] = None,
    page: int = 1,
    limit: int = 10
) -> Dict:
    query = db.query(Job).filter(Job.recruiterId == recruiter_id)

    if status and status.upper() != "ALL":
        query = query.filter(func.upper(Job.status) == status.upper())

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Job.title.ilike(search_term),
                Job.department.ilike(search_term),
                Job.location.ilike(search_term),
                Job.description.ilike(search_term)
            )
        )

    total = query.count()
    pages = math.ceil(total / limit) if limit > 0 else 1
    offset = (page - 1) * limit

    jobs = query.order_by(Job.createdAt.desc()).offset(offset).limit(limit).all()
    formatted_jobs = [format_job_response(j, db) for j in jobs]

    return {
        "jobs": formatted_jobs,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages
    }

def get_job_by_id(db: Session, job_id: str, recruiter_id: str) -> Optional[JobResponse]:
    job = db.query(Job).filter(Job.id == job_id, Job.recruiterId == recruiter_id).first()
    if not job:
        return None
    return format_job_response(job, db)

def create_job(db: Session, job_data: JobCreate, recruiter_id: str) -> JobResponse:
    skills_json = json.dumps(job_data.required_skills)
    sal_range = f"${job_data.salary_min:,.0f} - ${job_data.salary_max:,.0f}"

    job = Job(
        recruiterId=recruiter_id,
        title=job_data.title,
        department=job_data.department,
        location=job_data.location,
        employmentType=job_data.employment_type,
        experienceRequired=job_data.experience_level,
        salaryRange=sal_range,
        salary_min=job_data.salary_min,
        salary_max=job_data.salary_max,
        description=job_data.description,
        requirements=job_data.requirements,
        requiredSkills=skills_json,
        deadline=job_data.deadline or "2026-12-31",
        status=(job_data.status or "OPEN").upper()
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return format_job_response(job, db)

def update_job(db: Session, job_id: str, job_data: JobUpdate, recruiter_id: str) -> Optional[JobResponse]:
    job = db.query(Job).filter(Job.id == job_id, Job.recruiterId == recruiter_id).first()
    if not job:
        return None

    if job_data.title is not None:
        job.title = job_data.title
    if job_data.department is not None:
        job.department = job_data.department
    if job_data.employment_type is not None:
        job.employmentType = job_data.employment_type
    if job_data.location is not None:
        job.location = job_data.location
    if job_data.experience_level is not None:
        job.experienceRequired = job_data.experience_level
    if job_data.salary_min is not None:
        job.salary_min = job_data.salary_min
    if job_data.salary_max is not None:
        job.salary_max = job_data.salary_max
    if job_data.description is not None:
        job.description = job_data.description
    if job_data.requirements is not None:
        job.requirements = job_data.requirements
    if job_data.required_skills is not None:
        job.requiredSkills = json.dumps(job_data.required_skills)
    if job_data.deadline is not None:
        job.deadline = job_data.deadline
    if job_data.status is not None:
        job.status = job_data.status.upper()

    if job.salary_min is not None or job.salary_max is not None:
        sal_min = job.salary_min or 0.0
        sal_max = job.salary_max or 0.0
        job.salaryRange = f"${sal_min:,.0f} - ${sal_max:,.0f}"

    db.commit()
    db.refresh(job)
    return format_job_response(job, db)

def delete_job(db: Session, job_id: str, recruiter_id: str) -> bool:
    job = db.query(Job).filter(Job.id == job_id, Job.recruiterId == recruiter_id).first()
    if not job:
        return False
    db.delete(job)
    db.commit()
    return True

def get_dashboard_stats(db: Session, recruiter_id: str) -> Dict:
    jobs = db.query(Job).filter(Job.recruiterId == recruiter_id).all()
    total_jobs = len(jobs)
    open_jobs = sum(1 for j in jobs if (j.status or "").upper() == "OPEN" or (j.status or "").upper() == "ACTIVE")
    closed_jobs = sum(1 for j in jobs if (j.status or "").upper() == "CLOSED")

    job_ids = [j.id for j in jobs]
    total_applications = db.query(Resume).filter(Resume.jobId.in_(job_ids)).count() if job_ids else 0

    recent_resumes = (
        db.query(Resume)
        .filter(Resume.jobId.in_(job_ids))
        .order_by(Resume.uploadDate.desc())
        .limit(5)
        .all()
    ) if job_ids else []

    recent_activity = [
        {
            "id": r.id,
            "candidate_name": r.candidateName,
            "job_id": r.jobId,
            "match_score": r.aiMatchScore,
            "status": r.status,
            "time": r.uploadDate.isoformat()
        }
        for r in recent_resumes
    ]

    return {
        "total_jobs": total_jobs,
        "open_jobs": open_jobs,
        "closed_jobs": closed_jobs,
        "total_applications": total_applications,
        "recent_activity": recent_activity
    }
