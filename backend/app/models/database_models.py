import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database.db import Base


def generate_uuid():
    return str(uuid.uuid4())


class Recruiter(Base):
    __tablename__ = "recruiters"

    id = Column(String, primary_key=True, default=generate_uuid)
    full_name = Column("full_name", String(255), nullable=False)
    company_name = Column("company_name", String(255), nullable=False)
    email = Column("email", String(255), unique=True, index=True, nullable=False)
    password_hash = Column("password_hash", String(255), nullable=False)
    created_at = Column("created_at", DateTime, default=datetime.utcnow)
    updated_at = Column("updated_at", DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    jobs = relationship("Job", back_populates="recruiter", cascade="all, delete-orphan")

    # Property Aliases for camelCase & compatibility
    @property
    def fullName(self):
        return self.full_name

    @fullName.setter
    def fullName(self, value):
        self.full_name = value

    @property
    def companyName(self):
        return self.company_name

    @companyName.setter
    def companyName(self, value):
        self.company_name = value

    @property
    def password(self):
        return self.password_hash

    @password.setter
    def password(self, value):
        self.password_hash = value

    @property
    def createdAt(self):
        return self.created_at

    @property
    def updatedAt(self):
        return self.updated_at


class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, default=generate_uuid)
    recruiter_id = Column("recruiterId", String, ForeignKey("recruiters.id", ondelete="CASCADE"), nullable=False)
    title = Column("title", String(255), nullable=False)
    department = Column("department", String(100), nullable=False)
    location = Column("location", String(255), default="Remote")
    employment_type = Column("employmentType", String(50), default="Full-Time")
    experience_level = Column("experienceRequired", String(100), default="1-3 years")
    salary_range = Column("salaryRange", String(100), default="Competitive")
    salary_min = Column("salary_min", Float, nullable=True, default=0.0)
    salary_max = Column("salary_max", Float, nullable=True, default=0.0)
    description = Column("description", Text, nullable=False)
    requirements = Column("requirements", Text, nullable=True, default="")
    required_skills = Column("requiredSkills", Text, nullable=False, default="[]")
    deadline = Column("deadline", String(50), nullable=False, default="2026-12-31")
    status = Column("status", String(50), default="OPEN")  # OPEN, CLOSED, DRAFT
    created_at = Column("createdAt", DateTime, default=datetime.utcnow)
    updated_at = Column("updatedAt", DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    recruiter = relationship("Recruiter", back_populates="jobs")
    resumes = relationship("Resume", back_populates="job", cascade="all, delete-orphan")

    # Property Aliases for camelCase compatibility
    @property
    def recruiterId(self):
        return self.recruiter_id

    @recruiterId.setter
    def recruiterId(self, value):
        self.recruiter_id = value

    @property
    def employmentType(self):
        return self.employment_type

    @employmentType.setter
    def employmentType(self, value):
        self.employment_type = value

    @property
    def experienceRequired(self):
        return self.experience_level

    @experienceRequired.setter
    def experienceRequired(self, value):
        self.experience_level = value

    @property
    def salaryRange(self):
        return self.salary_range

    @salaryRange.setter
    def salaryRange(self, value):
        self.salary_range = value

    @property
    def requiredSkills(self):
        return self.required_skills

    @requiredSkills.setter
    def requiredSkills(self, value):
        self.required_skills = value

    @property
    def createdAt(self):
        return self.created_at

    @property
    def updatedAt(self):
        return self.updated_at


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String, primary_key=True, default=generate_uuid)
    job_id = Column("jobId", String, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    candidate_name = Column("candidateName", String(255), nullable=False)
    email = Column("email", String(255), nullable=False)
    phone = Column("phone", String(100), default="N/A")
    file_url = Column("fileUrl", String(1024), nullable=False)
    file_name = Column("fileName", String(255), nullable=False)
    file_type = Column("fileType", String(50), nullable=False)
    raw_text = Column("rawText", Text, nullable=True)
    ai_match_score = Column("aiMatchScore", Integer, default=0)
    ai_summary = Column("aiSummary", Text, nullable=True)
    extracted_skills = Column("extractedSkills", Text, nullable=False, default="[]")
    status = Column("status", String(50), default="Submitted")
    upload_date = Column("uploadDate", DateTime, default=datetime.utcnow)
    updated_at = Column("updatedAt", DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    job = relationship("Job", back_populates="resumes")

    # Property Aliases for camelCase compatibility
    @property
    def jobId(self):
        return self.job_id

    @jobId.setter
    def jobId(self, value):
        self.job_id = value

    @property
    def candidateName(self):
        return self.candidate_name

    @candidateName.setter
    def candidateName(self, value):
        self.candidate_name = value

    @property
    def fileUrl(self):
        return self.file_url

    @fileUrl.setter
    def fileUrl(self, value):
        self.file_url = value

    @property
    def fileName(self):
        return self.file_name

    @fileName.setter
    def fileName(self, value):
        self.file_name = value

    @property
    def fileType(self):
        return self.file_type

    @fileType.setter
    def fileType(self, value):
        self.file_type = value

    @property
    def rawText(self):
        return self.raw_text

    @rawText.setter
    def rawText(self, value):
        self.raw_text = value

    @property
    def aiMatchScore(self):
        return self.ai_match_score

    @aiMatchScore.setter
    def aiMatchScore(self, value):
        self.ai_match_score = value

    @property
    def aiSummary(self):
        return self.ai_summary

    @aiSummary.setter
    def aiSummary(self, value):
        self.ai_summary = value

    @property
    def extractedSkills(self):
        return self.extracted_skills

    @extractedSkills.setter
    def extractedSkills(self, value):
        self.extracted_skills = value

    @property
    def uploadDate(self):
        return self.upload_date

    @uploadDate.setter
    def uploadDate(self, value):
        self.upload_date = value
