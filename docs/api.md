# REST API Reference - AI Resume Platform Backend

Base API URL: `http://localhost:8000`

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
Create a new recruiter account.
- **Request Body**:
  ```json
  {
    "fullName": "Sarah Vance",
    "companyName": "TechTalent Inc.",
    "email": "sarah@techtalent.com",
    "password": "securepassword123"
  }
  ```
- **Response** `(201 Created)`:
  ```json
  {
    "message": "Registration successful",
    "user": {
      "id": "uuid-recruiter-id",
      "fullName": "Sarah Vance",
      "companyName": "TechTalent Inc.",
      "email": "sarah@techtalent.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```

### `POST /api/auth/login`
Authenticate recruiter.
- **Request Body**:
  ```json
  {
    "email": "sarah@techtalent.com",
    "password": "securepassword123"
  }
  ```

### `GET /api/auth/me`
Fetch currently authenticated recruiter profile.

---

## 2. Job Requisition Endpoints (`/api/jobs`)

### `GET /api/jobs`
List all job requisitions for logged-in recruiter.

### `POST /api/jobs`
Create a new job posting.
- **Request Body**:
  ```json
  {
    "title": "Senior Full Stack Engineer",
    "department": "Engineering",
    "location": "Remote / San Francisco",
    "employmentType": "Full-Time",
    "experienceRequired": "5+ years",
    "salaryRange": "$140,000 - $175,000",
    "description": "We are seeking a Full Stack Engineer...",
    "requiredSkills": "React, Next.js, Node.js, TypeScript, PostgreSQL, Tailwind CSS",
    "deadline": "2026-09-30"
  }
  ```

### `GET /api/jobs/{job_id}`
Fetch detailed job requisition information with applicant counters.

---

## 3. Resume & AI Parsing Endpoints (`/api/resumes`)

### `GET /api/resumes`
List candidate resumes. Accepts optional query parameters `job_id` and `search`.

### `POST /api/resumes`
Upload candidate resume file (`multipart/form-data`) and trigger AI skill parsing & match scoring.
- **Form Data**:
  - `file`: Resume document (`.pdf` or `.docx`)
  - `jobId`: Target job ID
  - `candidateName`: (Optional) Candidate full name
  - `email`: (Optional) Candidate email
  - `phone`: (Optional) Candidate phone

### `DELETE /api/resumes/{resume_id}`
Delete candidate resume record.
