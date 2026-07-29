from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# Auth Schemas
class RecruiterRegister(BaseModel):
    fullName: str = Field(..., min_length=2)
    companyName: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=6)

class RecruiterLogin(BaseModel):
    email: EmailStr
    password: str

class RecruiterResponse(BaseModel):
    id: str
    fullName: str
    companyName: str
    email: str

    class Config:
        from_attributes = True

class AuthTokenResponse(BaseModel):
    message: str
    user: RecruiterResponse
    token: str

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
