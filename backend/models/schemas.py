from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class CandidateModel(BaseModel):
    """Candidate profile model"""
    id: Optional[str] = Field(None, alias="_id")
    name: str
    email: str
    phone: Optional[str] = None
    skills: List[str] = []
    experience_years: float = 0.0
    current_role: Optional[str] = None
    current_company: Optional[str] = None
    education: Optional[str] = None
    location: Optional[str] = None
    resume_text: Optional[str] = None
    embedding: Optional[List[float]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


class JDModel(BaseModel):
    """Job Description model"""
    id: Optional[str] = Field(None, alias="_id")
    title: str
    company: str
    description: str
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    experience_required: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    embedding: Optional[List[float]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


class ConversationModel(BaseModel):
    """Conversation history model"""
    id: Optional[str] = Field(None, alias="_id")
    session_id: str
    user_message: str
    agent_response: str
    context: Optional[dict] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


class ShortlistModel(BaseModel):
    """Shortlisted candidates model"""
    id: Optional[str] = Field(None, alias="_id")
    jd_id: str
    candidate_ids: List[str] = []
    match_scores: Optional[dict] = None
    notes: Optional[str] = None
    created_by: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
