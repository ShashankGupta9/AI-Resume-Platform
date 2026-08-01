from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.database_models import Recruiter
from app.schemas.pydantic_schemas import (
    RecruiterRegister,
    RecruiterLogin,
    AuthTokenResponse,
    RecruiterResponse,
    TokenVerificationResponse
)
from app.services.auth_service import hash_password, verify_password, create_jwt_token
from app.utils.security import get_current_recruiter

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

COOKIE_MAX_AGE = 60 * 60 * 24 * 7  # 7 days

@router.post("/register", response_model=AuthTokenResponse, status_code=status.HTTP_201_CREATED)
def register_recruiter(payload: RecruiterRegister, response: Response, db: Session = Depends(get_db)):
    email_clean = payload.email.lower().strip()
    existing = db.query(Recruiter).filter(Recruiter.email == email_clean).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists. Please sign in."
        )

    recruiter = Recruiter(
        full_name=payload.full_name,
        company_name=payload.company_name,
        email=email_clean,
        password_hash=hash_password(payload.password)
    )
    db.add(recruiter)
    db.commit()
    db.refresh(recruiter)

    token = create_jwt_token({
        "recruiterId": recruiter.id,
        "email": recruiter.email,
        "fullName": recruiter.full_name,
        "companyName": recruiter.company_name
    })

    # Set Secure HttpOnly Cookie
    response.set_cookie(
        key="access_token",
        value=token,
        max_age=COOKIE_MAX_AGE,
        httponly=True,
        samesite="lax",
        secure=False  # Set to True in production HTTPS
    )

    return AuthTokenResponse(
        message="Registration successful",
        user=RecruiterResponse.model_validate(recruiter),
        token=token
    )

@router.post("/login", response_model=AuthTokenResponse)
def login_recruiter(payload: RecruiterLogin, response: Response, db: Session = Depends(get_db)):
    email_clean = payload.email.lower().strip()

    # Demo Recruiter Account Auto-Provisioning
    if email_clean == "demo@recruiter.com" and payload.password == "password123":
        recruiter = db.query(Recruiter).filter(Recruiter.email == email_clean).first()
        if not recruiter:
            recruiter = Recruiter(
                id="demo-recruiter",
                full_name="Sarah Vance",
                company_name="TechTalent Inc.",
                email=email_clean,
                password_hash=hash_password("password123")
            )
            db.add(recruiter)
            db.commit()
            db.refresh(recruiter)

        token = create_jwt_token({
            "recruiterId": recruiter.id,
            "email": recruiter.email,
            "fullName": recruiter.full_name,
            "companyName": recruiter.company_name
        })

        response.set_cookie(
            key="access_token",
            value=token,
            max_age=COOKIE_MAX_AGE,
            httponly=True,
            samesite="lax",
            secure=False
        )

        return AuthTokenResponse(
            message="Demo login successful",
            user=RecruiterResponse.model_validate(recruiter),
            token=token
        )

    recruiter = db.query(Recruiter).filter(Recruiter.email == email_clean).first()
    
    # Generic security error message to prevent user enumeration
    if not recruiter or not verify_password(payload.password, recruiter.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials."
        )

    token = create_jwt_token({
        "recruiterId": recruiter.id,
        "email": recruiter.email,
        "fullName": recruiter.full_name,
        "companyName": recruiter.company_name
    })

    response.set_cookie(
        key="access_token",
        value=token,
        max_age=COOKIE_MAX_AGE,
        httponly=True,
        samesite="lax",
        secure=False
    )

    return AuthTokenResponse(
        message="Login successful",
        user=RecruiterResponse.model_validate(recruiter),
        token=token
    )

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token", path="/", httponly=True)
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=dict)
def get_me(recruiter: Recruiter = Depends(get_current_recruiter)):
    return {
        "authenticated": True,
        "user": RecruiterResponse.model_validate(recruiter)
    }

@router.get("/verify", response_model=TokenVerificationResponse)
def verify_token(recruiter: Recruiter = Depends(get_current_recruiter)):
    return TokenVerificationResponse(
        valid=True,
        user=RecruiterResponse.model_validate(recruiter)
    )
