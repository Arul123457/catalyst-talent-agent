from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from bson import ObjectId

from config import (
    COLLECTION_JD,
    COLLECTION_CANDIDATES,
    VECTOR_INDEX_NAME
)
from db import get_collection
from auth import require_admin

router = APIRouter()


# Seniority to years mapping
SENIORITY_RANGES = {
    "junior": (0, 2),
    "mid": (3, 5),
    "senior": (6, 9),
    "lead": (10, 12),
    "principal": (13, 100)
}


class MatchRequest(BaseModel):
    jd_id: str


class CandidateMatch(BaseModel):
    candidate_id: str
    name: str
    current_role: str
    experience_years: float
    location: Optional[str]
    domain: str
    skills: List[str]
    match_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    seniority_fit: str
    vector_score: float
    personality_type: str


class MatchResponse(BaseModel):
    jd_id: str
    total_matched: int
    candidates: List[CandidateMatch]


def calculate_skill_score(jd_skills: List[str], candidate_skills: List[str]) -> float:
    """Calculate skill overlap score"""
    if not jd_skills:
        return 100.0
    
    jd_skills_set = set(skill.lower() for skill in jd_skills)
    candidate_skills_set = set(skill.lower() for skill in candidate_skills)
    
    overlap = len(jd_skills_set & candidate_skills_set)
    skill_overlap = overlap / len(jd_skills_set)
    return skill_overlap * 100


def calculate_seniority_score(jd_seniority: str, candidate_years: float) -> tuple[float, str]:
    """Calculate seniority fit score and label"""
    if jd_seniority not in SENIORITY_RANGES:
        return 50.0, "unknown"
    
    min_years, max_years = SENIORITY_RANGES[jd_seniority]
    
    # Perfect fit
    if min_years <= candidate_years <= max_years:
        return 100.0, "good"
    
    # Within 2 years of range
    if (min_years - 2 <= candidate_years < min_years) or (max_years < candidate_years <= max_years + 2):
        return 70.0, "partial"
    
    # Outside range
    return 30.0, "poor"


def calculate_domain_score(jd_domain: str, candidate_domain: str) -> float:
    """Calculate domain match score"""
    if jd_domain.lower() == candidate_domain.lower():
        return 100.0
    return 0.0


def get_skill_gaps(jd_skills: List[str], candidate_skills: List[str]) -> tuple[List[str], List[str]]:
    """Get matched and missing skills"""
    jd_skills_lower = {skill.lower(): skill for skill in jd_skills}
    candidate_skills_lower = set(skill.lower() for skill in candidate_skills)
    
    matched = [jd_skills_lower[skill] for skill in jd_skills_lower if skill in candidate_skills_lower]
    missing = [jd_skills_lower[skill] for skill in jd_skills_lower if skill not in candidate_skills_lower]
    
    return matched, missing


@router.post("/match-candidates", response_model=MatchResponse)
async def match_candidates(request: MatchRequest, current_user: dict = Depends(require_admin)):
    """
    Match candidates to a job description using vector search and scoring.
    Returns top 15 candidates ranked by match score.
    """
    # Step 1: Fetch JD from database
    try:
        jd_collection = get_collection(COLLECTION_JD)
        jd_doc = await jd_collection.find_one({"_id": ObjectId(request.jd_id)})
        
        if not jd_doc:
            raise HTTPException(status_code=404, detail=f"JD with id {request.jd_id} not found")
    except Exception as e:
        if "not found" in str(e):
            raise
        raise HTTPException(status_code=400, detail=f"Invalid JD ID format: {str(e)}")
    
    # Step 2: Get JD embedding and parsed data
    jd_embedding = jd_doc.get("embedding")
    parsed_jd = jd_doc.get("parsed", {})
    
    if not jd_embedding:
        raise HTTPException(status_code=500, detail="JD embedding not found")
    
    jd_required_skills = parsed_jd.get("required_skills", [])
    jd_seniority = parsed_jd.get("seniority", "mid")
    jd_domain = parsed_jd.get("domain", "")
    
    # Step 3: Run MongoDB Atlas Vector Search
    candidates_collection = get_collection(COLLECTION_CANDIDATES)
    
    pipeline = [
        {
            "$vectorSearch": {
                "index": VECTOR_INDEX_NAME,
                "path": "embedding",
                "queryVector": jd_embedding,
                "numCandidates": 50,
                "limit": 15
            }
        },
        {
            "$addFields": {
                "vector_score": {"$meta": "vectorSearchScore"}
            }
        }
    ]
    
    try:
        cursor = candidates_collection.aggregate(pipeline)
        candidates = await cursor.to_list(length=15)
    except Exception as e:
        # Handle case where vector search is not available or returns empty
        print(f"Vector search error: {e}")
        candidates = []
    
    # Step 4: Calculate match scores for each candidate
    matched_candidates = []
    
    for candidate in candidates:
        # Extract candidate data
        candidate_skills = candidate.get("skills", [])
        candidate_years = candidate.get("experience_years", 0)
        candidate_domain = candidate.get("domain", "")
        vector_score = candidate.get("vector_score", 0.0)
        
        # Calculate individual scores
        skill_score = calculate_skill_score(jd_required_skills, candidate_skills)
        seniority_score, seniority_fit = calculate_seniority_score(jd_seniority, candidate_years)
        domain_score = calculate_domain_score(jd_domain, candidate_domain)
        
        # Calculate overall match score
        match_score = (skill_score * 0.50) + (seniority_score * 0.30) + (domain_score * 0.20)
        match_score = round(match_score, 1)
        
        # Get skill gaps
        matched_skills, missing_skills = get_skill_gaps(jd_required_skills, candidate_skills)
        
        # Build candidate match object
        matched_candidates.append(CandidateMatch(
            candidate_id=str(candidate["_id"]),
            name=candidate.get("name", "Unknown"),
            current_role=candidate.get("current_role", ""),
            experience_years=candidate_years,
            location=candidate.get("location"),
            domain=candidate_domain,
            skills=candidate_skills,
            match_score=match_score,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            seniority_fit=seniority_fit,
            vector_score=round(vector_score, 3),
            personality_type=candidate.get("personality_type", "unknown")
        ))
    
    # Step 5: Sort by match_score descending
    matched_candidates.sort(key=lambda x: x.match_score, reverse=True)
    
    return MatchResponse(
        jd_id=request.jd_id,
        total_matched=len(matched_candidates),
        candidates=matched_candidates
    )
