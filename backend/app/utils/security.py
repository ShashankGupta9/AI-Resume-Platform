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

    if not token:
        # Check if demo recruiter exists in DB for instant local testing fallback
        recruiter = db.query(Recruiter).filter(Recruiter.email == "demo@recruiter.com").first()
        if recruiter:
            return recruiter
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token missing or session expired."
        )

    payload = decode_jwt_token(token)
    if not payload or "recruiterId" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication session."
        )

    recruiter_id = payload.get("recruiterId")
    recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recruiter user profile not found."
        )

    return recruiter
