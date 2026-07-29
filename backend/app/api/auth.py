from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database.db import get_db
from backend.app.models.database_models import Recruiter
from backend.app.schemas.pydantic_schemas import RecruiterRegister, RecruiterLogin, AuthTokenResponse, RecruiterResponse
from backend.app.services.auth_service import hash_password, verify_password, create_jwt_token
from backend.app.utils.security import get_current_recruiter

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=AuthTokenResponse, status_code=status.HTTP_201_CREATED)
def register_recruiter(payload: RecruiterRegister, db: Session = Depends(get_db)):
    existing = db.query(Recruiter).filter(Recruiter.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists."
        )

    recruiter = Recruiter(
        fullName=payload.fullName,
        companyName=payload.companyName,
        email=payload.email.lower(),
        password=hash_password(payload.password)
    )
    db.add(recruiter)
    db.commit()
    db.refresh(recruiter)

    token = create_jwt_token({
        "recruiterId": recruiter.id,
        "email": recruiter.email,
        "fullName": recruiter.fullName,
        "companyName": recruiter.companyName
    })

    return AuthTokenResponse(
        message="Registration successful",
        user=RecruiterResponse.model_validate(recruiter),
        token=token
    )

@router.post("/login", response_model=AuthTokenResponse)
def login_recruiter(payload: RecruiterLogin, db: Session = Depends(get_db)):
    email_lower = payload.email.lower()

    # Demo fallback
    if email_lower == "demo@recruiter.com" and payload.password == "password123":
        recruiter = db.query(Recruiter).filter(Recruiter.email == email_lower).first()
        if not recruiter:
            recruiter = Recruiter(
                id="demo-recruiter",
                fullName="Sarah Vance",
                companyName="TechTalent Inc.",
                email=email_lower,
                password=hash_password("password123")
            )
            db.add(recruiter)
            db.commit()
            db.refresh(recruiter)

        token = create_jwt_token({
            "recruiterId": recruiter.id,
            "email": recruiter.email,
            "fullName": recruiter.fullName,
            "companyName": recruiter.companyName
        })
        return AuthTokenResponse(
            message="Demo login successful",
            user=RecruiterResponse.model_validate(recruiter),
            token=token
        )

    recruiter = db.query(Recruiter).filter(Recruiter.email == email_lower).first()
    if not recruiter or not verify_password(payload.password, recruiter.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_jwt_token({
        "recruiterId": recruiter.id,
        "email": recruiter.email,
        "fullName": recruiter.fullName,
        "companyName": recruiter.companyName
    })

    return AuthTokenResponse(
        message="Login successful",
        user=RecruiterResponse.model_validate(recruiter),
        token=token
    )

@router.get("/me")
def get_me(recruiter: Recruiter = Depends(get_current_recruiter)):
    return {
        "authenticated": True,
        "user": RecruiterResponse.model_validate(recruiter)
    }

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}
