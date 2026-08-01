import re
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

    # Serialization aliases
    @property
    def fullName(self) -> str:
        return self.full_name

    @property
    def companyName(self) -> str:
        return self.company_name

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

    class Config:
        from_attributes = True
