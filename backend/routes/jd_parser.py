from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime
import json
from groq import Groq

from config import GROQ_API_KEY, GROQ_MODEL, COLLECTION_JD
from db import get_collection
from services.embedder import get_embedding
from auth import require_admin

router = APIRouter()

# Initialize Groq client
groq_client = Groq(api_key=GROQ_API_KEY)


class JDRequest(BaseModel):
    jd_text: str


class JDResponse(BaseModel):
    jd_id: str
    parsed: dict
    message: str


@router.post("/parse-jd", response_model=JDResponse)
async def parse_jd(request: JDRequest, current_user: dict = Depends(require_admin)):
    """
    Parse job description using Groq LLM and generate embeddings.
    Stores parsed JD in MongoDB with vector embeddings.
    """
    # Validate input
    if not request.jd_text or request.jd_text.strip() == "":
        raise HTTPException(status_code=400, detail="jd_text cannot be empty")
    
    jd_text = request.jd_text.strip()
    
    # Step 1: Call Groq to parse JD
    try:
        response = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are a JD parser. Extract structured info from job descriptions. Return ONLY valid JSON, no markdown, no extra text."
                },
                {
                    "role": "user",
                    "content": f"""Parse this JD and return JSON with exactly these fields:
required_skills: array of strings,
nice_to_have: array of strings,
seniority: one of [junior, mid, senior, lead, principal],
domain: one of [fintech, healthtech, edtech, ecommerce, saas, devtools],
culture_signals: array of strings (values like ownership, fast-paced etc),
role_summary: string (1 sentence),
role_title: string

JD: {jd_text}"""
                }
            ],
            temperature=0.3,
            max_tokens=2000
        )
        
        content = response.choices[0].message.content.strip()
        
        # Remove markdown code blocks if present
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        content = content.strip()
        
        # Parse JSON
        parsed_jd = json.loads(content)
        
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse Groq response as JSON: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calling Groq API: {str(e)}"
        )
    
    # Step 2: Generate embedding for the JD
    try:
        embedding_text = f"{parsed_jd.get('role_title', '')} {parsed_jd.get('domain', '')} {' '.join(parsed_jd.get('required_skills', []))} {parsed_jd.get('role_summary', '')}"
        embedding = get_embedding(embedding_text)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating embedding: {str(e)}"
        )
    
    # Step 3: Store in MongoDB
    try:
        jd_collection = get_collection(COLLECTION_JD)
        
        jd_document = {
            "jd_text": jd_text,
            "parsed": parsed_jd,
            "embedding": embedding,
            "created_at": datetime.utcnow()
        }
        
        result = await jd_collection.insert_one(jd_document)
        jd_id = str(result.inserted_id)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error storing JD in database: {str(e)}"
        )
    
    # Step 4: Return response
    return JDResponse(
        jd_id=jd_id,
        parsed=parsed_jd,
        message="JD parsed successfully"
    )
