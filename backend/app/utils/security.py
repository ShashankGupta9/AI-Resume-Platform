from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from backend.app.database.db import get_db
from backend.app.services.auth_service import decode_jwt_token
from backend.app.models.database_models import Recruiter

security = HTTPBearer(auto_error=False)

def get_current_recruiter(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Recruiter:
    if not credentials:
        # For local demo ease, return or create a default demo recruiter if not authenticated
        recruiter = db.query(Recruiter).filter(Recruiter.email == "demo@recruiter.com").first()
        if not recruiter:
            recruiter = Recruiter(
                id="demo-recruiter",
                fullName="Sarah Vance",
                companyName="TechTalent Inc.",
                email="demo@recruiter.com",
                password="hashed_demo_password"
            )
            db.add(recruiter)
            db.commit()
            db.refresh(recruiter)
        return recruiter

    token = credentials.credentials
    payload = decode_jwt_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token"
        )

    recruiter = db.query(Recruiter).filter(Recruiter.id == payload.get("recruiterId")).first()
    if not recruiter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recruiter user not found"
        )

    return recruiter
