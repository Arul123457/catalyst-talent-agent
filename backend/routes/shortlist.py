from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from groq import Groq

from config import (
    GROQ_API_KEY,
    GROQ_MODEL,
    COLLECTION_CANDIDATES,
    COLLECTION_JD,
    COLLECTION_SHORTLISTS
)
from db import get_collection
from auth import require_admin

router = APIRouter()

# Initialize Groq client
groq_client = Groq(api_key=GROQ_API_KEY)


class NarrativeRequest(BaseModel):
    candidate_id: str
    jd_id: str
    match_score: float
    interest_score: float


class NarrativeResponse(BaseModel):
    candidate_id: str
    narrative: str
    match_score: float
    interest_score: float


class AddToShortlistRequest(BaseModel):
    candidate_id: str
    jd_id: str
    match_score: float
    interest_score: float
    narrative: str


class AddToShortlistResponse(BaseModel):
    shortlist_id: str
    candidate_id: str
    jd_id: str
    combined_score: float
    next_step: str
    message: str


class ShortlistCandidate(BaseModel):
    rank: int
    candidate_id: str
    name: str
    current_role: str
    location: Optional[str]
    match_score: float
    interest_score: float
    combined_score: float
    narrative: str
    next_step: str


class ShortlistResponse(BaseModel):
    jd_id: str
    total: int
    shortlist: List[ShortlistCandidate]


def calculate_combined_score(match_score: float, interest_score: float) -> float:
    """Calculate combined score with weighted formula"""
    return round((match_score * 0.55) + (interest_score * 0.45), 1)


def determine_next_step(combined_score: float) -> str:
    """Determine next action based on combined score"""
    if combined_score >= 80:
        return "Schedule Interview"
    elif combined_score >= 60:
        return "Send Assignment"
    elif combined_score >= 40:
        return "Nurture"
    else:
        return "Pass"


@router.post("/generate-narrative", response_model=NarrativeResponse)
async def generate_narrative(request: NarrativeRequest, current_user: dict = Depends(require_admin)):
    """
    Generate a recruiter-ready narrative for a candidate.
    Uses AI to create a concise 3-sentence summary.
    """
    # Step 1: Fetch candidate from MongoDB
    try:
        candidates_collection = get_collection(COLLECTION_CANDIDATES)
        candidate = await candidates_collection.find_one({"_id": ObjectId(request.candidate_id)})
        
        if not candidate:
            raise HTTPException(status_code=404, detail=f"Candidate with id {request.candidate_id} not found")
    except Exception as e:
        if "not found" in str(e):
            raise
        raise HTTPException(status_code=400, detail=f"Invalid candidate ID format: {str(e)}")
    
    # Step 2: Fetch JD parsed data
    try:
        jd_collection = get_collection(COLLECTION_JD)
        jd_doc = await jd_collection.find_one({"_id": ObjectId(request.jd_id)})
        
        if not jd_doc:
            raise HTTPException(status_code=404, detail=f"JD with id {request.jd_id} not found")
    except Exception as e:
        if "not found" in str(e):
            raise
        raise HTTPException(status_code=400, detail=f"Invalid JD ID format: {str(e)}")
    
    jd_parsed = jd_doc.get("parsed", {})
    
    # Step 3: Build prompt for narrative generation
    name = candidate.get("name", "Candidate")
    current_role = candidate.get("current_role", "professional")
    experience_years = candidate.get("experience_years", 0)
    skills = candidate.get("skills", [])
    domain = candidate.get("domain", "tech")
    personality_type = candidate.get("personality_type", "unknown")
    
    role_title = jd_parsed.get("role_title", "position")
    jd_domain = jd_parsed.get("domain", "tech")
    
    skills_str = ", ".join(skills[:5]) if skills else "various skills"
    
    user_prompt = f"""Write a 3-sentence recruiter-ready narrative for this candidate.

Sentence 1: Their background and top skills.
Sentence 2: How they showed interest and fit for this role.
Sentence 3: A clear recommendation action.

Candidate: {name}, {current_role}, {experience_years} years, skills: {skills_str}, domain: {domain}
Role: {role_title} at {jd_domain} company
Match Score: {request.match_score}/100
Interest Score: {request.interest_score}/100
Personality: {personality_type}

Write only the 3 sentences, no headers, no bullets."""
    
    # Step 4: Call Groq to generate narrative
    try:
        response = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are a senior recruiter writing concise candidate summaries."
                },
                {
                    "role": "user",
                    "content": user_prompt
                }
            ],
            temperature=0.7,
            max_tokens=300
        )
        
        narrative = response.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating narrative: {str(e)}")
    
    # Step 5: Return response
    return NarrativeResponse(
        candidate_id=request.candidate_id,
        narrative=narrative,
        match_score=request.match_score,
        interest_score=request.interest_score
    )


@router.post("/add-to-shortlist", response_model=AddToShortlistResponse)
async def add_to_shortlist(request: AddToShortlistRequest, current_user: dict = Depends(require_admin)):
    """
    Add a candidate to the shortlist with scoring and recommendation.
    Prevents duplicate entries for the same candidate-JD pair.
    """
    # Step 1: Calculate combined score
    combined_score = calculate_combined_score(request.match_score, request.interest_score)
    
    # Step 2: Determine next step
    next_step = determine_next_step(combined_score)
    
    # Step 3: Fetch candidate details
    try:
        candidates_collection = get_collection(COLLECTION_CANDIDATES)
        candidate = await candidates_collection.find_one({"_id": ObjectId(request.candidate_id)})
        
        if not candidate:
            raise HTTPException(status_code=404, detail=f"Candidate with id {request.candidate_id} not found")
    except Exception as e:
        if "not found" in str(e):
            raise
        raise HTTPException(status_code=400, detail=f"Invalid candidate ID format: {str(e)}")
    
    # Step 4: Check for duplicate entry
    shortlists_collection = get_collection(COLLECTION_SHORTLISTS)
    existing = await shortlists_collection.find_one({
        "candidate_id": request.candidate_id,
        "jd_id": request.jd_id
    })
    
    if existing:
        # Update existing entry instead of creating duplicate
        await shortlists_collection.update_one(
            {"_id": existing["_id"]},
            {
                "$set": {
                    "match_score": request.match_score,
                    "interest_score": request.interest_score,
                    "combined_score": combined_score,
                    "narrative": request.narrative,
                    "next_step": next_step,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        shortlist_id = str(existing["_id"])
        message = "Shortlist entry updated"
    else:
        # Step 5: Create new shortlist entry
        shortlist_doc = {
            "candidate_id": request.candidate_id,
            "jd_id": request.jd_id,
            "name": candidate.get("name", "Unknown"),
            "current_role": candidate.get("current_role", ""),
            "location": candidate.get("location"),
            "match_score": request.match_score,
            "interest_score": request.interest_score,
            "combined_score": combined_score,
            "narrative": request.narrative,
            "next_step": next_step,
            "created_at": datetime.utcnow()
        }
        
        try:
            result = await shortlists_collection.insert_one(shortlist_doc)
            shortlist_id = str(result.inserted_id)
            message = "Candidate added to shortlist"
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error storing shortlist: {str(e)}")
    
    # Step 6: Return response
    return AddToShortlistResponse(
        shortlist_id=shortlist_id,
        candidate_id=request.candidate_id,
        jd_id=request.jd_id,
        combined_score=combined_score,
        next_step=next_step,
        message=message
    )


@router.get("/shortlist/{jd_id}", response_model=ShortlistResponse)
async def get_shortlist(jd_id: str, current_user: dict = Depends(require_admin)):
    """
    Get ranked shortlist for a job description.
    Returns candidates sorted by combined score with rankings.
    """
    # Step 1: Fetch all shortlist entries for this JD
    try:
        shortlists_collection = get_collection(COLLECTION_SHORTLISTS)
        cursor = shortlists_collection.find({"jd_id": jd_id})
        shortlist_entries = await cursor.to_list(length=None)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching shortlist: {str(e)}")
    
    # Step 2: Sort by combined_score descending
    shortlist_entries.sort(key=lambda x: x.get("combined_score", 0), reverse=True)
    
    # Step 3: Add rank field
    ranked_shortlist = []
    for rank, entry in enumerate(shortlist_entries, start=1):
        ranked_shortlist.append(ShortlistCandidate(
            rank=rank,
            candidate_id=entry.get("candidate_id", ""),
            name=entry.get("name", "Unknown"),
            current_role=entry.get("current_role", ""),
            location=entry.get("location"),
            match_score=entry.get("match_score", 0.0),
            interest_score=entry.get("interest_score", 0.0),
            combined_score=entry.get("combined_score", 0.0),
            narrative=entry.get("narrative", ""),
            next_step=entry.get("next_step", "")
        ))
    
    # Step 4: Return response
    return ShortlistResponse(
        jd_id=jd_id,
        total=len(ranked_shortlist),
        shortlist=ranked_shortlist
    )
