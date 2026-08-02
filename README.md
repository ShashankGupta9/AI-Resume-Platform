# AI Resume Platform 🚀

[![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0+-D70A53?style=flat-square&logo=python)](https://www.sqlalchemy.org/)
[![Docker](https://img.shields.io/badge/Docker-Supported-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

An enterprise-grade, full-stack AI platform designed for technical recruiters and hiring managers. Streamline job requisition creation, candidate resume ingestion (PDF/DOCX), automatic skill extraction, and AI-powered match scoring against target position requirements.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture & System Flow](#-architecture--system-flow)
- [Directory Structure](#-directory-structure)
- [AI Match Engine & Parsing](#-ai-match-engine--parsing)
- [Prerequisites](#-prerequisites)
- [Environment Variables](#-environment-variables)
- [Local Installation & Setup](#-local-installation--setup)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [Running with Docker](#-running-with-docker)
- [Database Setup & Migrations](#-database-setup--migrations)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Screenshots](#-screenshots)
- [Testing](#-testing)
- [Deployment Guide](#-deployment-guide)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)
- [Author & Acknowledgments](#-author--acknowledgments)

---

## 📌 Project Overview

Hiring teams often process hundreds of resumes per job requisition, spending dozens of manual hours reviewing qualifications and comparing candidate skills against position specs. 

The **AI Resume Platform** automates candidate evaluation by combining:
- **Instant Document Parsing**: Extracts text cleanly from `.pdf` and `.docx` candidate uploads using `pypdf` and `python-docx`.
- **Automated Skill Matching**: Analyzes extracted skills, candidate experience, and key qualifications against job requisition requirements to compute an objective **AI Match Score (0–100%)**.
- **Recruiter Workspace**: Offers an intuitive Next.js dashboard for recruiters to publish job postings, track applicant counts, filter candidates by match score, and update candidate hiring status.

---

## ✨ Key Features

- **🔒 Secure Recruiter Authentication**: JWT-based session security with bcrypt password hashing, HTTP-only cookie support, and demo account auto-provisioning for local testing.
- **💼 Job Requisition Management**: Full CRUD support for creating, editing, closing, and filtering job requisitions by department, location, employment type, and salary range.
- **📄 Multi-Format Resume Ingestion**: Fast client and server parsing of candidate resumes in `.pdf` and `.docx` formats.
- **🤖 AI Match Engine**: Calculates candidate qualification scores using skill set intersection algorithms, fuzzy keyword matching, and experience scoring.
- **📊 Analytics Dashboard**: Real-time analytics displaying total jobs, active requisitions, application volume, and recent candidate activity.
- **🐳 Containerized Orchestration**: Production-ready Docker container setup with `docker-compose` for unified front-to-back deployment.

---

## 🛠️ Tech Stack

### Frontend Architecture
| Technology | Role | Description |
| :--- | :--- | :--- |
| **Next.js 14** | Core Framework | App Router architecture with SSR & Client Components |
| **React 18** | UI Framework | Component-based interactive UI |
| **TypeScript** | Language | End-to-end type safety |
| **Tailwind CSS** | Styling | Custom glassmorphism, responsive dark-mode styling |
| **Lucide React** | Icons | Modern SVG UI icon suite |
| **React Hook Form + Zod** | Form Validation | Schema-based client-side form validation |

### Backend Architecture
| Technology | Role | Description |
| :--- | :--- | :--- |
| **FastAPI** | REST API Engine | High-performance asynchronous Python REST API |
| **SQLAlchemy 2.0** | ORM | Database abstraction and relational query builder |
| **Pydantic v2** | Data Validation | Request/Response schema validation and serialization |
| **PyJWT & Passlib** | Security | JSON Web Tokens and bcrypt password hashing |
| **PyPDF & Python-Docx** | Document Processing | Text extraction from PDF & Word resume files |

### Database & Storage
| Database | Mode | Description |
| :--- | :--- | :--- |
| **PostgreSQL / Supabase** | Production | Enterprise relational database storage |
| **SQLite (Auto-Migrate)** | Local Development | Zero-config local database fallback with auto schema migrations |

---

## 🏗️ Architecture & System Flow

```
[ Frontend: Next.js 14 (Port 3000) ]
        │
        │ HTTP REST API (JWT Bearer Header / Cookies)
        ▼
[ Backend: FastAPI (Port 8000) ]
        ├── Auth Router (/api/auth) ─────► Security & JWT Service (bcrypt)
        ├── Jobs Router (/api/jobs) ─────► Job Service & SQLAlchemy ORM
        └── Resumes Router (/api/resumes) ► AI Matcher Engine ──► PyPDF / Python-Docx
                                                   │
                                                   ▼
                                 [ Relational DB (PostgreSQL / SQLite) ]
```

### End-to-End Workflow

1. **Authentication**: Recruiter signs in or registers via `/login` or `/register`. The backend returns a signed JWT token stored in browser `localStorage` and HTTP-only cookie.
2. **Job Publishing**: Recruiter creates a new requisition at `/dashboard/jobs/create`. The backend indexes title, department, required skills, and salary constraints.
3. **Resume Ingestion**: Recruiter uploads candidate PDF/DOCX at `/resumes/upload`.
4. **AI Match Computation**: The `ai_matcher` service parses raw text, extracts technical skills, matches against required skills, and saves candidate match score (0–100%).

---

## 📁 Directory Structure

```
AI_resume/
├── backend/                    # FastAPI Backend Application
│   ├── app/
│   │   ├── api/                # REST Endpoint Controllers (auth, jobs, resumes)
│   │   ├── database/           # DB Connection, Session, and Auto-Migration
│   │   ├── models/             # SQLAlchemy Database Models (Recruiter, Job, Resume)
│   │   ├── schemas/            # Pydantic Schemas (Request/Response contracts)
│   │   ├── services/           # Business Logic (AI Matcher, Job, Auth, Storage)
│   │   ├── utils/              # Security Dependencies & JWT verification
│   │   └── main.py             # Application Entry Point & CORS Setup
│   └── requirements.txt        # Python Dependencies
│
├── frontend/                   # Next.js 14 Web Application
│   ├── app/                    # Next.js App Router Pages & API Routes
│   │   ├── (auth)/             # Login & Registration Pages
│   │   ├── dashboard/          # Analytics & Job Management Views
│   │   ├── jobs/               # Public Job List & Application Pages
│   │   ├── resumes/            # Candidate Resume Table & Upload Component
│   │   └── profile/            # Recruiter Profile & Settings
│   ├── components/             # Reusable UI & Layout Components
│   ├── context/                # Auth & Global Application Context
│   ├── hooks/                  # Custom React Hooks (useJobs, useAuth, useToast)
│   ├── lib/                    # Validation Schemas (Zod) & DB Helper Utilities
│   ├── services/               # API Service Layer (jobApi, authApi)
│   └── types/                  # TypeScript Interfaces
│
├── docker/                     # Container Configurations
│   ├── Dockerfile.backend      # Python 3.10 Container Build
│   ├── Dockerfile.frontend     # Node.js Next.js Container Build
│   └── docker-compose.yml      # Multi-Container Orchestration
│
├── docs/                       # Platform Documentation
│   ├── api_reference.md        # Comprehensive API Specs
│   └── architecture.md         # System Architecture Reference
│
├── .env.example                # Environment Variable Template
└── README.md                   # Project Documentation
```

---

## 🤖 AI Match Engine & Parsing

The AI Match Engine ([ai_matcher.py](file:///c:/Users/shashank%20gupta/Desktop/resources/AI_resume/backend/app/services/ai_matcher.py)) evaluates candidate resumes against job requisitions using a multi-factor calculation algorithm:

1. **Text Extraction**: Converts PDF streams via `pypdf` or DOCX documents via `python-docx` into normalized plain text.
2. **Skill Extraction**: Matches extracted text against a dictionary of technical competencies (e.g., Python, React, TypeScript, FastAPI, PostgreSQL, Docker, AWS).
3. **Score Calculation**:
   $$\text{Score} = \min\left(100, \left( \frac{|\text{Extracted Skills} \cap \text{Required Skills}|}{|\text{Required Skills}|} \times 70 \right) + \text{Text Bonus} \right)$$
4. **AI Summary Generation**: Generates automated feedback on matched skills, missing qualifications, and overall suitability.

---

## ⚙️ Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js**: `v18.17.0` or higher
- **npm**: `v9.0.0` or higher
- **Python**: `v3.10` or higher
- **Git**
- **Docker & Docker Compose** *(Optional, for containerized run)*

---

## 🔑 Environment Variables

Copy `.env.example` to create a `.env` file in the project root:

```bash
cp .env.example .env
```

### Configuration Parameters

| Parameter | Type | Required | Description | Default Value |
| :--- | :--- | :--- | :--- | :--- |
| `DATABASE_URL` | String | No | PostgreSQL / Supabase connection string. Falls back to SQLite if unset/unreachable. | `sqlite:///./ai_resume_local.db` |
| `JWT_SECRET` | String | Yes | Secret key used for signing JWT authentication tokens. | `ai-resume-platform-super-secret-jwt-key-2026` |
| `NEXT_PUBLIC_API_URL` | String | Yes | Base API URL called by the Next.js frontend. | `http://localhost:8000` |
| `NEXT_PUBLIC_SUPABASE_URL` | String | No | Optional Supabase storage endpoint URL. | `https://[PROJECT-REF].supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | String | No | Optional Supabase anonymous client key. | `your-anon-key` |

---

## 🚀 Local Installation & Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a Python virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI development server
uvicorn app.main:app --reload --port 8000
```
The backend API will be available at [http://localhost:8000](http://localhost:8000). Interactive Swagger docs will be hosted at [http://localhost:8000/docs](http://localhost:8000/docs).

---

### 2. Frontend Setup

In a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start Next.js development server
npm run dev
```
The application frontend will be live at [http://localhost:3000](http://localhost:3000).

---

## 🐳 Running with Docker

You can launch both frontend and backend services simultaneously using Docker Compose:

```bash
# Build and run containers in detached mode
docker-compose -f docker/docker-compose.yml up --build -d

# View container logs
docker-compose -f docker/docker-compose.yml logs -f

# Stop container services
docker-compose -f docker/docker-compose.yml down
```

---

## 🗄️ Database Setup & Migrations

### SQLite Auto-Migration (Default)
Out of the box, the backend connects to an embedded SQLite database (`ai_resume_local.db`). The `auto_migrate()` hook in [db.py](file:///c:/Users/shashank%20gupta/Desktop/resources/AI_resume/backend/app/database/db.py) inspects table definitions on startup and applies schema migrations automatically.

### PostgreSQL / Supabase Migration
To connect to an external PostgreSQL database:
1. Update `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ai_resume_db"
   ```
2. Start the FastAPI application. SQLAlchemy will automatically create all missing tables (`recruiters`, `jobs`, `resumes`).

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new recruiter account | No |
| `POST` | `/api/auth/login` | Authenticate recruiter & receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch active recruiter profile | Yes |
| `POST` | `/api/auth/logout` | Clear authentication session | Yes |

### Job Requisitions (`/api/jobs`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | List job requisitions (supports `search`, `status`, `page`, `limit`) | Yes |
| `POST` | `/api/jobs` | Create a new job posting | Yes |
| `GET` | `/api/jobs/stats` | Fetch recruiter dashboard analytics metrics | Yes |
| `GET` | `/api/jobs/{id}` | Fetch job requisition details | Yes |
| `PUT` | `/api/jobs/{id}` | Update existing job requisition | Yes |
| `DELETE` | `/api/jobs/{id}` | Delete job requisition and related resumes | Yes |

### Candidate Resumes (`/api/resumes`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/resumes` | List candidate resumes with filtering options | Yes |
| `POST` | `/api/resumes` | Upload resume file (`.pdf`/`.docx`) & compute AI match score | Yes |
| `DELETE` | `/api/resumes/{id}` | Delete candidate resume record | Yes |

Detailed API specifications are available in [docs/api_reference.md](file:///c:/Users/shashank%20gupta/Desktop/resources/AI_resume/docs/api_reference.md).

---

## 🖼️ Screenshots

| Dashboard Analytics | Job Requisition Creator |
| :---: | :---: |
| ![Dashboard Screenshot](https://via.placeholder.com/600x350/0f172a/6366f1?text=Dashboard+Analytics+View) | ![Job Form Screenshot](https://via.placeholder.com/600x350/0f172a/06b6d4?text=Job+Requisition+Creator) |

| Candidate Resume Parsing & AI Match | Candidate List View |
| :---: | :---: |
| ![Resume Upload Screenshot](https://via.placeholder.com/600x350/0f172a/10b981?text=AI+Resume+Upload+%26+Match+Score) | ![Candidate List Screenshot](https://via.placeholder.com/600x350/0f172a/8b5cf6?text=Candidate+Resumes+List) |

---

## 🧪 Testing

### Backend Import & Endpoint Tests

To verify backend modules and endpoint functionality:

```bash
cd backend
python -c "import pkgutil, importlib, app; [importlib.import_module(name) for _, name, _ in pkgutil.walk_packages(app.__path__, app.__name__ + '.')]"
```

### Frontend Type Checking & Build Verification

To verify Next.js TypeScript definitions and build configuration:

```bash
cd frontend
npm run build
```

---

## 🌐 Deployment Guide

### Vercel (Frontend)
1. Push your repository to GitHub.
2. Import the project into Vercel and select the `frontend/` directory as root.
3. Configure Environment Variables: Set `NEXT_PUBLIC_API_URL` to your production FastAPI server URL.
4. Deploy.

### Render / Railway / Fly.io (Backend)
1. Select **Docker** or **Python Runtime**.
2. Root Directory: `backend/` or repository root pointing to `docker/Dockerfile.backend`.
3. Set Environment Variables (`DATABASE_URL`, `JWT_SECRET`).
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`.

---

## 🔮 Future Improvements

- [ ] **LLM Vector Embeddings**: Integrate OpenAI / HuggingFace semantic embeddings for contextual candidate-to-job matching beyond keyword intersection.
- [ ] **Automated Candidate Interview Scheduling**: Calendar integration for top-matched candidates.
- [ ] **Bulk Resume Upload**: Drag-and-drop batch upload processing for folder-wide resume screening.
- [ ] **Role-Based Access Control (RBAC)**: Support for hiring manager sub-accounts and multi-recruiter organization workspaces.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the project repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

## 👤 Author & Acknowledgments

**Shashank Gupta**
- GitHub: [@ShashankGupta9](https://github.com/ShashankGupta9)
- Project Repository: [ShashankGupta9/AI-Resume-Platform](https://github.com/ShashankGupta9/AI-Resume-Platform)

*Built with Next.js, FastAPI, Tailwind CSS, and Python.*
