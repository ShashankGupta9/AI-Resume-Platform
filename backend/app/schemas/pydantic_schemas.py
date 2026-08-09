import re
import json
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator

PASSWORD_REGEX = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$'

# Auth Schemas
class RecruiterRegister(BaseModel):
    full_name: str = Field(..., min_length=3, description="Full Name must be at least 3 characters")
    company_name: str = Field(..., min_length=1, description="Company Name is required")
    email: EmailStr
    password: str = Field(..., min_length=8)
    confirm_password: str

    # Also accept camelCase inputs from frontend
    fullName: Optional[str] = None
    companyName: Optional[str] = None

    @model_validator(mode='before')
    def map_camel_case(cls, values):
        if isinstance(values, dict):
            if 'fullName' in values and 'full_name' not in values:
                values['full_name'] = values['fullName']
            if 'companyName' in values and 'company_name' not in values:
                values['company_name'] = values['companyName']
        return values

    @field_validator('password')
    @classmethod
    def validate_password_complexity(cls, v: str) -> str:
        if not re.match(PASSWORD_REGEX, v):
            raise ValueError(
                "Password must be at least 8 characters long and include at least one uppercase letter, "
                "one lowercase letter, one number, and one special character."
            )
        return v

    @model_validator(mode='after')
    def check_passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError("Password and Confirm Password do not match.")
        return self

class RecruiterLogin(BaseModel):
    email: EmailStr
    password: str

class RecruiterResponse(BaseModel):
    id: str
    full_name: str
    company_name: str
    email: str
    created_at: Optional[datetime] = None

    # Serialization aliases for camelCase frontend
    fullName: Optional[str] = None
    companyName: Optional[str] = None

    @model_validator(mode='after')
    def sync_aliases(self):
        if not self.fullName:
            self.fullName = self.full_name
        if not self.companyName:
            self.companyName = self.company_name
        return self

    class Config:
        from_attributes = True

class AuthTokenResponse(BaseModel):
    message: str
    user: RecruiterResponse
    token: str

class TokenVerificationResponse(BaseModel):
    valid: bool
    user: Optional[RecruiterResponse] = None

# Job Schemas
class JobCreate(BaseModel):
    title: str
    department: str
    location: Optional[str] = "Remote"
    employmentType: Optional[str] = "Full-Time"
    experienceRequired: Optional[str] = "1-3 years"
    salaryRange: Optional[str] = "Competitive"
    description: str
    requiredSkills: str
    deadline: Optional[str] = "2026-12-31"

class JobResponse(BaseModel):
    id: str
    recruiterId: str
    title: str
    department: str
    location: str
    employmentType: str
    experienceRequired: str
    salaryRange: str
    description: str
    requiredSkills: str
    deadline: str
    status: str
    createdAt: datetime
    applicantCount: Optional[int] = 0

    # Snake case aliases
    recruiter_id: Optional[str] = None
    employment_type: Optional[str] = None
    experience_level: Optional[str] = None
    required_skills: Optional[List[str]] = None
    created_at: Optional[datetime] = None
    @field_validator('requiredSkills', mode='before')
    @classmethod
    def parse_required_skills_str(cls, v):
        if isinstance(v, list):
            return ", ".join(v)
        return v or ""

    @field_validator('required_skills', mode='before')
    @classmethod
    def parse_required_skills_list(cls, v):
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
    def sync_aliases(self):
        if not self.recruiter_id:
            self.recruiter_id = self.recruiterId
        if not self.employment_type:
            self.employment_type = self.employmentType
        if not self.experience_level:
            self.experience_level = self.experienceRequired
        if not self.created_at:
            self.created_at = self.createdAt
        if not self.required_skills:
            if isinstance(self.requiredSkills, str):
                self.required_skills = [s.strip() for s in self.requiredSkills.split(',') if s.strip()]
            else:
                self.required_skills = []
        return self

    class Config:
        from_attributes = True

# Resume Schemas
class ResumeResponse(BaseModel):
    id: str
    jobId: str
    candidateName: str
    email: str
    phone: str
    fileUrl: str
    fileName: str
    fileType: str
    rawText: Optional[str] = None
    aiMatchScore: int
    aiSummary: Optional[str] = None
    extractedSkills: str
    status: str
    uploadDate: datetime
    job: Optional[JobResponse] = None

    # Snake case aliases
    job_id: Optional[str] = None
    candidate_name: Optional[str] = None
    file_url: Optional[str] = None
    file_name: Optional[str] = None
    file_type: Optional[str] = None
    ai_match_score: Optional[int] = None
    ai_summary: Optional[str] = None
    extracted_skills: Optional[str] = None
    upload_date: Optional[datetime] = None

    @model_validator(mode='after')
    def sync_aliases(self):
        if not self.job_id:
            self.job_id = self.jobId
        if not self.candidate_name:
            self.candidate_name = self.candidateName
        if not self.file_url:
            self.file_url = self.fileUrl
        if not self.file_name:
            self.file_name = self.fileName
        if not self.file_type:
            self.file_type = self.fileType
        if self.ai_match_score is None:
            self.ai_match_score = self.aiMatchScore
        if not self.ai_summary:
            self.ai_summary = self.aiSummary
        if not self.extracted_skills:
            self.extracted_skills = self.extractedSkills
        if not self.upload_date:
            self.upload_date = self.uploadDate
        return self

    class Config:
        from_attributes = True
