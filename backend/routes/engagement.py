from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from bson import ObjectId
import json
from groq import Groq

from config import GROQ_API_KEY, GROQ_MODEL, COLLECTION_CANDIDATES, COLLECTION_JD
from db import get_collection

router = APIRouter()

# Initialize Groq client
groq_client = Groq(api_key=GROQ_API_KEY)


class ConversationMessage(BaseModel):
    role: str
    content: str


class EngageRequest(BaseModel):
    candidate_id: str
    jd_id: str
    conversation_history: List[ConversationMessage] = []


class EngageResponse(BaseModel):
    candidate_id: str
    turn: int
    agent_message: str
    candidate_response: str
    conversation_history: List[ConversationMessage]
    conversation_complete: bool
    next_action: str


class ScoreInterestRequest(BaseModel):
    candidate_id: str
    jd_id: str
    conversation_history: List[ConversationMessage]


class ScoreInterestResponse(BaseModel):
    interest_score: int
    reasoning: str
    signals: List[str]
    recommendation: str


def build_system_prompt(candidate: dict, jd_parsed: dict) -> str:
    """Build system prompt for candidate persona"""
    name = candidate.get("name", "Candidate")
    current_role = candidate.get("current_role", "professional")
    experience_years = candidate.get("experience_years", 0)
    domain = candidate.get("domain", "tech")
    personality_type = candidate.get("personality_type", "passively_open")
    role_title = jd_parsed.get("role_title", "position")
    
    base_prompt = f"""You are {name}, a {current_role} with {experience_years} years of experience in {domain}. Your personality: {personality_type}.
You are responding to a recruiter reaching out about a {role_title} role.
Respond naturally as this candidate would. Keep responses to 2-3 sentences.
"""
    
    if personality_type == "actively_looking":
        base_prompt += "Show enthusiasm and eagerness. You're actively seeking new opportunities."
    elif personality_type == "passively_open":
        base_prompt += "Show mild interest with some hesitation. You're open but need convincing."
    elif personality_type == "not_looking":
        base_prompt += "Show polite disinterest. You're happy in your current role."
    else:
        base_prompt += "Show cautious interest."
    
    return base_prompt


def get_agent_question(turn: int, candidate: dict, jd_parsed: dict) -> str:
    """Generate agent question based on turn number"""
    name = candidate.get("name", "there")
    role_title = jd_parsed.get("role_title", "position")
    domain = jd_parsed.get("domain", "tech")
    role_summary = jd_parsed.get("role_summary", "an exciting opportunity")
    required_skills = jd_parsed.get("required_skills", [])
    
    if turn == 0:
        return f"Hi {name}! I came across your profile and think you'd be a great fit for a {role_title} role at a {domain} company. Are you currently open to exploring new opportunities?"
    elif turn == 1:
        skills_str = ", ".join(required_skills[:5]) if required_skills else "various technical skills"
        return f"Great to know! The role involves {role_summary}. Key skills needed: {skills_str}. How does this align with your current work?"
    elif turn == 2:
        return "What are your expectations in terms of notice period and compensation for the right opportunity?"
    elif turn == 3:
        return "If everything aligns, would you be open to a quick call with our hiring team this week?"
    else:
        return "Thank you for your time!"


@router.post("/engage-candidate", response_model=EngageResponse)
async def engage_candidate(request: EngageRequest):
    """
    Engage with a candidate through conversational AI.
    Simulates candidate responses based on their personality and profile.
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
    
    # Step 2: Fetch JD parsed data from MongoDB
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
    
    # Step 3: Determine current turn
    current_turn = len(request.conversation_history) // 2
    
    # Step 4: Build system prompt
    system_prompt = build_system_prompt(candidate, jd_parsed)
    
    # Step 5: Get agent question for this turn
    agent_question = get_agent_question(current_turn, candidate, jd_parsed)
    
    # Step 6: Call Groq to generate candidate response
    messages = [{"role": "system", "content": system_prompt}]
    
    # Add conversation history
    for msg in request.conversation_history:
        messages.append({"role": msg.role, "content": msg.content})
    
    # Add current agent question
    messages.append({"role": "user", "content": agent_question})
    
    try:
        response = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            temperature=0.8,
            max_tokens=150
        )
        
        candidate_response = response.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating candidate response: {str(e)}")
    
    # Step 7: Update conversation history
    updated_history = list(request.conversation_history)
    updated_history.append(ConversationMessage(role="user", content=agent_question))
    updated_history.append(ConversationMessage(role="assistant", content=candidate_response))
    
    # Step 8: Determine if conversation is complete
    conversation_complete = current_turn >= 3
    next_action = "score_interest" if conversation_complete else "continue"
    
    return EngageResponse(
        candidate_id=request.candidate_id,
        turn=current_turn,
        agent_message=agent_question,
        candidate_response=candidate_response,
        conversation_history=updated_history,
        conversation_complete=conversation_complete,
        next_action=next_action
    )


@router.post("/score-interest", response_model=ScoreInterestResponse)
async def score_interest(request: ScoreInterestRequest):
    """
    Score candidate's interest level based on conversation history.
    Updates candidate record with engagement status and interest score.
    """
    # Step 1: Validate candidate exists
    try:
        candidates_collection = get_collection(COLLECTION_CANDIDATES)
        candidate = await candidates_collection.find_one({"_id": ObjectId(request.candidate_id)})
        
        if not candidate:
            raise HTTPException(status_code=404, detail=f"Candidate with id {request.candidate_id} not found")
    except Exception as e:
        if "not found" in str(e):
            raise
        raise HTTPException(status_code=400, detail=f"Invalid candidate ID format: {str(e)}")
    
    # Step 2: Format conversation for analysis
    conversation_text = "\n".join([
        f"{'Recruiter' if msg.role == 'user' else 'Candidate'}: {msg.content}"
        for msg in request.conversation_history
    ])
    
    # Step 3: Call Groq to analyze interest
    analysis_prompt = f"""Analyze this recruiter-candidate conversation and score the candidate's genuine interest level.

Conversation:
{conversation_text}

Return ONLY valid JSON with these fields:
{{
  "interest_score": integer 0-100,
  "reasoning": string (2 sentences explaining the score),
  "signals": array of strings (positive/negative signals observed),
  "recommendation": one of [strong_yes, yes, maybe, no]
}}"""
    
    try:
        response = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert recruiter analyzing candidate interest. Return only valid JSON."
                },
                {
                    "role": "user",
                    "content": analysis_prompt
                }
            ],
            temperature=0.3,
            max_tokens=500
        )
        
        content = response.choices[0].message.content.strip()
        
        # Remove markdown code blocks if present
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        content = content.strip()
        
        # Parse JSON
        analysis = json.loads(content)
        
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse interest analysis as JSON: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing interest: {str(e)}"
        )
    
    # Step 4: Update candidate in MongoDB
    try:
        await candidates_collection.update_one(
            {"_id": ObjectId(request.candidate_id)},
            {
                "$set": {
                    "engaged": True,
                    "interest_score": analysis.get("interest_score", 0)
                }
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error updating candidate: {str(e)}"
        )
    
    # Step 5: Return analysis
    return ScoreInterestResponse(
        interest_score=analysis.get("interest_score", 0),
        reasoning=analysis.get("reasoning", ""),
        signals=analysis.get("signals", []),
        recommendation=analysis.get("recommendation", "maybe")
    )
