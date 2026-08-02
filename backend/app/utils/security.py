from typing import Optional
from fastapi import Request, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.services.auth_service import decode_jwt_token
from app.models.database_models import Recruiter

security = HTTPBearer(auto_error=False)

def get_current_recruiter(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Recruiter:
    token = None

    # 1. Try reading token from HttpOnly Cookie first
    if "access_token" in request.cookies:
        token = request.cookies.get("access_token")
    # 2. Try Bearer header fallback
    elif credentials and credentials.credentials:
        token = credentials.credentials

    if token and token not in ("null", "undefined", "Bearer null", "Bearer undefined"):
        payload = decode_jwt_token(token)
        if payload and "recruiterId" in payload:
            recruiter_id = payload.get("recruiterId")
            recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
            if recruiter:
                return recruiter

    # Demo recruiter fallback for local preview & instant testing
    recruiter = db.query(Recruiter).filter(Recruiter.email == "demo@recruiter.com").first()
    if not recruiter:
        recruiter = Recruiter(
            id="demo-recruiter",
            full_name="Sarah Vance",
            company_name="TechTalent Inc.",
            email="demo@recruiter.com",
            password_hash="demo_hashed_password"
        )
        db.add(recruiter)
        db.commit()
        db.refresh(recruiter)

    return recruiter
