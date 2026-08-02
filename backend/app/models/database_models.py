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
    full_name = Column(String(255), nullable=False)
    company_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    jobs = relationship("Job", back_populates="recruiter", cascade="all, delete-orphan")

    # Property Aliases
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
    recruiterId = Column(String, ForeignKey("recruiters.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    department = Column(String(100), nullable=False)
    location = Column(String(255), default="Remote")
    employmentType = Column(String(50), default="Full-Time")
    experienceRequired = Column(String(100), default="1-3 years")
    salaryRange = Column(String(100), default="Competitive")
    salary_min = Column(Float, nullable=True, default=0.0)
    salary_max = Column(Float, nullable=True, default=0.0)
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=True, default="")
    requiredSkills = Column(Text, nullable=False, default="[]")
    deadline = Column(String(50), nullable=False, default="2026-12-31")
    status = Column(String(50), default="OPEN")  # OPEN, CLOSED, DRAFT
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    recruiter = relationship("Recruiter", back_populates="jobs")
    resumes = relationship("Resume", back_populates="job", cascade="all, delete-orphan")

    # Property Aliases for full snake_case and camelCase compatibility
    @property
    def recruiter_id(self):
        return self.recruiterId

    @recruiter_id.setter
    def recruiter_id(self, value):
        self.recruiterId = value

    @property
    def employment_type(self):
        return self.employmentType

    @employment_type.setter
    def employment_type(self, value):
        self.employmentType = value

    @property
    def experience_level(self):
        return self.experienceRequired

    @experience_level.setter
    def experience_level(self, value):
        self.experienceRequired = value

    @property
    def required_skills(self):
        return self.requiredSkills

    @required_skills.setter
    def required_skills(self, value):
        self.requiredSkills = value

    @property
    def created_at(self):
        return self.createdAt

    @property
    def updated_at(self):
        return self.updatedAt

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String, primary_key=True, default=generate_uuid)
    jobId = Column(String, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    candidateName = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(100), default="N/A")
    fileUrl = Column(String(1024), nullable=False)
    fileName = Column(String(255), nullable=False)
    fileType = Column(String(50), nullable=False)
    rawText = Column(Text, nullable=True)
    aiMatchScore = Column(Integer, default=0)
    aiSummary = Column(Text, nullable=True)
    extractedSkills = Column(Text, nullable=False, default="[]")
    status = Column(String(50), default="Submitted")
    uploadDate = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    job = relationship("Job", back_populates="resumes")
