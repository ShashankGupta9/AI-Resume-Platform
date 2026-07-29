# AI Resume Platform - System Architecture Specification

## Overview

The **AI Resume Platform** is an enterprise-grade web platform designed for recruiters to create job postings, manage incoming candidate applications, upload candidate resumes (PDF & DOCX), parse skills, and automatically compute AI match scores against job requirements.

---

## Architectural Layout

```
AI_resume/
├── frontend/             # Next.js 14 App Router (React + TypeScript + Tailwind CSS)
│   ├── app/              # Page routes & layouts ((auth), dashboard, jobs, resumes)
│   ├── components/       # Reusable UI & Navbar components
│   ├── hooks/            # Custom React hooks (useAuth, useToast)
│   ├── services/         # API Service client communicating with FastAPI
│   ├── types/            # TypeScript interfaces
│   └── public/           # Static assets & local upload store
│
├── backend/              # Python FastAPI Application
│   ├── app/
│   │   ├── api/          # REST Endpoint Controllers (auth, jobs, resumes)
│   │   ├── models/       # SQLAlchemy ORM Models (Recruiter, Job, Resume)
│   │   ├── schemas/      # Pydantic Request/Response Schemas
│   │   ├── services/     # AI Matcher Engine, Auth Service, Storage Service
│   │   ├── database/     # DB Connection & Session (Supabase PostgreSQL / SQLite)
│   │   ├── utils/        # Security dependencies & token verification
│   │   └── main.py       # FastAPI Application Entry Point
│   └── requirements.txt
│
├── docker/               # Container Orchestration
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
│
└── docs/                 # Platform Documentation
    ├── architecture.md
    └── api_reference.md
```

---

## Data Flow & System Interactions

1. **Recruiter Authentication Flow**:
   - Recruiter submits registration or login at Next.js frontend (`/login` or `/register`).
   - Frontend calls `POST /api/auth/login` or `POST /api/auth/register` on the FastAPI backend.
   - Backend hashes password with `bcrypt` / `passlib` and returns a signed JWT token.
   - Frontend stores the token and includes `Authorization: Bearer <token>` in subsequent requests.

2. **Job Requisition Creation**:
   - Recruiter submits job parameters at `/jobs/create`.
   - Backend validates payload via Pydantic (`JobCreate`), creates record in database, and indexes required skill tags.

3. **Resume Upload & AI Match Engine**:
   - Recruiter uploads candidate PDF or DOCX file at `/resumes/upload`.
   - Backend extracts text using `pypdf` or `python-docx`.
   - `ai_matcher` service compares candidate skills against target job skill tags and computes match score (0-100%).
   - Resume file is stored in **Supabase Storage** (or local file store fallback).
   - Candidate record and score breakdown are stored in PostgreSQL.
