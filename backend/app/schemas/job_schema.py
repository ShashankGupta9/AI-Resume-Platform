import json
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, field_validator, model_validator

class JobCreate(BaseModel):
    title: str = Field(..., min_length=3, description="Job title must be at least 3 characters")
    department: str = Field(..., min_length=1, description="Department is required")
    employment_type: str = Field(..., description="Employment type e.g. Full Time, Part Time, Remote")
    location: str = Field(..., min_length=1, description="Location is required")
    experience_level: str = Field(..., min_length=1, description="Experience level is required")
    salary_min: float = Field(default=0.0, ge=0, description="Minimum salary")
    salary_max: float = Field(default=0.0, ge=0, description="Maximum salary")
    description: str = Field(..., min_length=20, description="Description must be at least 20 characters")
    requirements: str = Field(..., min_length=1, description="Requirements are required")
    required_skills: List[str] = Field(..., min_length=1, description="At least one required skill is needed")
    deadline: Optional[str] = "2026-12-31"
    status: Optional[str] = "OPEN"  # OPEN, CLOSED, DRAFT

    # Accept camelCase inputs from frontend
    employmentType: Optional[str] = None
    experienceRequired: Optional[str] = None
    requiredSkills: Optional[List[str]] = None
    salaryRange: Optional[str] = None

    @model_validator(mode='before')
    def map_camel_case(cls, values):
        if isinstance(values, dict):
            if 'employmentType' in values and 'employment_type' not in values:
                values['employment_type'] = values['employmentType']
            if 'experienceRequired' in values and 'experience_level' not in values:
                values['experience_level'] = values['experienceRequired']
            if 'requiredSkills' in values and 'required_skills' not in values:
                req_skills = values['requiredSkills']
                if isinstance(req_skills, str):
                    values['required_skills'] = [s.strip() for s in req_skills.split(',') if s.strip()]
                else:
                    values['required_skills'] = req_skills
            if isinstance(values.get('required_skills'), str):
                values['required_skills'] = [s.strip() for s in values['required_skills'].split(',') if s.strip()]
        return values

    @model_validator(mode='after')
    def validate_salaries(self):
        if self.salary_max < self.salary_min:
            raise ValueError("Maximum salary must be greater than or equal to minimum salary")
        return self

class JobUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    employment_type: Optional[str] = None
    location: Optional[str] = None
    experience_level: Optional[str] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    required_skills: Optional[List[str]] = None
    deadline: Optional[str] = None
    status: Optional[str] = None

class JobResponse(BaseModel):
    id: str
    recruiter_id: str
    title: str
    department: str
    employment_type: str
    location: str
    experience_level: str
    salary_min: float
    salary_max: float
    salary_range: str
    description: str
    requirements: str
    required_skills: List[str]
    deadline: str
    status: str
    created_at: datetime
    updated_at: datetime
    applicant_count: int = 0

    # CamelCase compatibility fields
    recruiterId: Optional[str] = None
    employmentType: Optional[str] = None
    experienceRequired: Optional[str] = None
    salaryRange: Optional[str] = None
    requiredSkills: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    @field_validator('required_skills', mode='before')
    @classmethod
    def parse_required_skills(cls, v):
        if isinstance(v, str):
            try:
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return [str(item) for item in parsed]
            except Exception:
                pass
            return [s.strip() for s in v.split(',') if s.strip()]
        return v or []

    @model_validator(mode='after')
    def populate_camel_case_aliases(self):
        if not self.recruiterId:
            self.recruiterId = self.recruiter_id
        if not self.employmentType:
            self.employmentType = self.employment_type
        if not self.experienceRequired:
            self.experienceRequired = self.experience_level
        if not self.salaryRange:
            self.salaryRange = self.salary_range
        if not self.requiredSkills:
            self.requiredSkills = ", ".join(self.required_skills) if isinstance(self.required_skills, list) else (self.required_skills or "")
        if not self.createdAt:
            self.createdAt = self.created_at
        if not self.updatedAt:
            self.updatedAt = self.updated_at
        return self

    class Config:
        from_attributes = True

class JobListResponse(BaseModel):
    jobs: List[JobResponse]
    total: int
    page: int
    limit: int
    pages: int

class DashboardStatsResponse(BaseModel):
    total_jobs: int
    open_jobs: int
    closed_jobs: int
    total_applications: int
    recent_activity: List[dict]
