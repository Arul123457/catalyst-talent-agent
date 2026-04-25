from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from bson import ObjectId
from db import get_db
from auth import get_current_user, require_candidate
from services.embedder import get_embedder
from config import COLLECTION_JD, COLLECTION_SHORTLISTS

router = APIRouter(prefix="/api/candidate", tags=["candidate"])

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    current_role: Optional[str] = None
    experience_years: Optional[int] = None
    skills: Optional[List[str]] = None
    domain: Optional[str] = None
    location: Optional[str] = None
    education: Optional[str] = None
    notice_period: Optional[str] = None
    expected_salary_lpa: Optional[float] = None
    summary: Optional[str] = None

@router.get("/profile")
async def get_profile(current_user: dict = Depends(require_candidate)):
    """Get candidate profile"""
    return current_user

@router.put("/profile")
async def update_profile(
    data: UpdateProfileRequest,
    current_user: dict = Depends(require_candidate)
):
    """Update candidate profile"""
    db = get_db()
    
    # Build update document
    update_doc = {}
    if data.name is not None:
        update_doc["name"] = data.name
    if data.current_role is not None:
        update_doc["current_role"] = data.current_role
    if data.experience_years is not None:
        update_doc["experience_years"] = data.experience_years
    if data.skills is not None:
        update_doc["skills"] = data.skills
    if data.domain is not None:
        update_doc["domain"] = data.domain
    if data.location is not None:
        update_doc["location"] = data.location
    if data.education is not None:
        update_doc["education"] = data.education
    if data.notice_period is not None:
        update_doc["notice_period"] = data.notice_period
    if data.expected_salary_lpa is not None:
        update_doc["expected_salary_lpa"] = data.expected_salary_lpa
    if data.summary is not None:
        update_doc["summary"] = data.summary
    
    if not update_doc:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    # Regenerate embedding if profile content changed
    if any(k in update_doc for k in ["current_role", "skills", "domain", "summary"]):
        # Get current values
        user = db.users.find_one({"_id": ObjectId(current_user["id"])})
        
        current_role = update_doc.get("current_role", user.get("current_role", ""))
        skills = update_doc.get("skills", user.get("skills", []))
        domain = update_doc.get("domain", user.get("domain", ""))
        summary = update_doc.get("summary", user.get("summary", ""))
        
        # Generate new embedding
        embedder = get_embedder()
        profile_text = f"{current_role} {domain} {' '.join(skills)} {summary}"
        embedding = embedder.encode(profile_text).tolist()
        update_doc["embedding"] = embedding
    
    # Update user in database
    db.users.update_one(
        {"_id": ObjectId(current_user["id"])},
        {"$set": update_doc}
    )
    
    # Get updated user
    updated_user = db.users.find_one({"_id": ObjectId(current_user["id"])})
    updated_user["id"] = str(updated_user["_id"])
    del updated_user["_id"]
    if "password_hash" in updated_user:
        del updated_user["password_hash"]
    
    return updated_user

@router.get("/applications")
async def get_applications(current_user: dict = Depends(require_candidate)):
    """Get candidate applications"""
    db = get_db()
    
    # Find all shortlist entries for this candidate
    applications = list(db[COLLECTION_SHORTLISTS].find({"candidate_id": current_user["id"]}))
    
    # Enrich with JD details
    result = []
    for app in applications:
        jd = db[COLLECTION_JD].find_one({"_id": ObjectId(app["jd_id"])})
        
        # Get parsed JD data
        parsed = jd.get("parsed", {}) if jd else {}
        
        result.append({
            "id": str(app["_id"]),
            "jd_id": str(app["jd_id"]),
            "role": parsed.get("role_title", "Unknown"),
            "company": parsed.get("company", "Unknown"),
            "match_score": app.get("match_score"),
            "interest_score": app.get("interest_score"),
            "combined_score": app.get("combined_score"),
            "status": app.get("status", "pending"),
            "created_at": app.get("created_at")
        })
    
    return result
