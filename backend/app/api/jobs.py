from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.database_models import Recruiter
from app.schemas.job_schema import (
    JobCreate,
    JobUpdate,
    JobResponse,
    JobListResponse,
    DashboardStatsResponse
)
from app.services.job_service import (
    get_recruiter_jobs,
    get_job_by_id,
    create_job,
    update_job,
    delete_job,
    get_dashboard_stats
)
from app.utils.security import get_current_recruiter

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

@router.get("/stats", response_model=DashboardStatsResponse)
def get_stats(
    db: Session = Depends(get_db),
    recruiter: Recruiter = Depends(get_current_recruiter)
):
    """
    Fetch recruiter dashboard analytics metrics.
    """
    return get_dashboard_stats(db, recruiter.id)

@router.get("", response_model=JobListResponse)
def list_jobs(
    search: Optional[str] = Query(None, description="Search term for job title, department, or location"),
    status: Optional[str] = Query(None, description="Filter by status: OPEN, CLOSED, DRAFT, ALL"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    recruiter: Recruiter = Depends(get_current_recruiter)
):
    """
    List all job requisitions created by the authenticated recruiter.
    """
    res = get_recruiter_jobs(db, recruiter.id, search=search, status=status, page=page, limit=limit)
    return JobListResponse(**res)

@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_new_job(
    payload: JobCreate,
    db: Session = Depends(get_db),
    recruiter: Recruiter = Depends(get_current_recruiter)
):
    """
    Create a new job posting associated with the authenticated recruiter.
    """
    return create_job(db, payload, recruiter.id)

@router.get("/{job_id}", response_model=JobResponse)
def get_job_details(
    job_id: str,
    db: Session = Depends(get_db),
    recruiter: Recruiter = Depends(get_current_recruiter)
):
    """
    Retrieve job details by ID for the authenticated recruiter.
    """
    job = get_job_by_id(db, job_id, recruiter.id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job posting not found or access unauthorized."
        )
    return job

@router.put("/{job_id}", response_model=JobResponse)
def update_job_details(
    job_id: str,
    payload: JobUpdate,
    db: Session = Depends(get_db),
    recruiter: Recruiter = Depends(get_current_recruiter)
):
    """
    Update an existing job posting.
    """
    job = update_job(db, job_id, payload, recruiter.id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job posting not found or access unauthorized."
        )
    return job

@router.delete("/{job_id}", status_code=status.HTTP_200_OK)
def remove_job(
    job_id: str,
    db: Session = Depends(get_db),
    recruiter: Recruiter = Depends(get_current_recruiter)
):
    """
    Delete a job posting and its associated resumes.
    """
    success = delete_job(db, job_id, recruiter.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job posting not found or access unauthorized."
        )
    return {"message": "Job deleted successfully", "job_id": job_id}
