import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database.db import Base

def generate_uuid():
    return str(uuid.uuid4())

class Recruiter(Base):
    __tablename__ = "recruiters"

    id = Column(String, primary_key=True, default=generate_uuid)
    fullName = Column(String(255), nullable=False)
    companyName = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    jobs = relationship("Job", back_populates="recruiter", cascade="all, delete-orphan")

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
    description = Column(Text, nullable=False)
    requiredSkills = Column(Text, nullable=False)
    deadline = Column(String(50), nullable=False)
    status = Column(String(50), default="Active")
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    recruiter = relationship("Recruiter", back_populates="jobs")
    resumes = relationship("Resume", back_populates="job", cascade="all, delete-orphan")

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
