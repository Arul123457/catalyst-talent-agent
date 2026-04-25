from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from db import get_db
from auth import hash_password, verify_password, create_access_token, get_current_user
from services.embedder import get_embedder

router = APIRouter(prefix="/api/auth", tags=["auth"])

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    current_role: str
    experience_years: int
    skills: List[str]
    domain: str
    location: str
    education: str
    notice_period: str
    expected_salary_lpa: float
    summary: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    current_role: Optional[str] = None
    domain: Optional[str] = None
    location: Optional[str] = None

class LoginResponse(BaseModel):
    token: str
    user: UserResponse

@router.post("/register", response_model=LoginResponse)
async def register(data: RegisterRequest):
    """Register a new candidate"""
    db = get_db()
    
    # Check if email already exists
    existing_user = db.users.find_one({"email": data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    password_hash = hash_password(data.password)
    
    # Generate embedding for profile
    embedder = get_embedder()
    profile_text = f"{data.current_role} {data.domain} {' '.join(data.skills)} {data.summary}"
    embedding = embedder.encode(profile_text).tolist()
    
    # Create user document
    user_doc = {
        "name": data.name,
        "email": data.email,
        "password_hash": password_hash,
        "role": "candidate",
        "current_role": data.current_role,
        "experience_years": data.experience_years,
        "skills": data.skills,
        "domain": data.domain,
        "location": data.location,
        "education": data.education,
        "notice_period": data.notice_period,
        "expected_salary_lpa": data.expected_salary_lpa,
        "summary": data.summary,
        "embedding": embedding,
        "personality_type": "actively_looking",
        "hidden_interest_level": 7,
        "engaged": False,
        "interest_score": None,
        "match_score": None,
        "created_at": datetime.utcnow()
    }
    
    # Insert into database
    result = db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Create JWT token
    token = create_access_token(data={"sub": user_id, "role": "candidate"})
    
    # Return response
    return LoginResponse(
        token=token,
        user=UserResponse(
            id=user_id,
            name=data.name,
            email=data.email,
            role="candidate",
            current_role=data.current_role,
            domain=data.domain,
            location=data.location
        )
    )

@router.post("/login", response_model=LoginResponse)
async def login(data: LoginRequest):
    """Login user"""
    db = get_db()
    
    # Find user by email
    user = db.users.find_one({"email": data.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create JWT token
    user_id = str(user["_id"])
    token = create_access_token(data={"sub": user_id, "role": user["role"]})
    
    # Return response
    return LoginResponse(
        token=token,
        user=UserResponse(
            id=user_id,
            name=user["name"],
            email=user["email"],
            role=user["role"],
            current_role=user.get("current_role"),
            domain=user.get("domain"),
            location=user.get("location")
        )
    )

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    return current_user
