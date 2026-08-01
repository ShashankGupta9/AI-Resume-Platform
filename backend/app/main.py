from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.db import Base, engine
from app.api.auth import router as auth_router
from app.api.jobs import router as jobs_router
from app.api.resumes import router as resumes_router

# Create DB tables automatically on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Resume Platform API",
    description="Enterprise REST API for recruiter authentication, job requisitions, PDF/DOCX resume parsing, and AI match scoring.",
    version="1.0.0"
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router)
app.include_router(jobs_router)
app.include_router(resumes_router)

@app.get("/", tags=["Health Check"])
def health_check():
    return {
        "status": "online",
        "service": "AI Resume Platform FastAPI Backend",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
