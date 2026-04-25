from fastapi import APIRouter
from db import get_database, ping_database
from config import (
    MONGO_DB_NAME,
    COLLECTION_CANDIDATES,
    COLLECTION_JD,
    COLLECTION_CONVERSATIONS,
    COLLECTION_SHORTLISTS
)

router = APIRouter()


@router.get("/db-status")
async def get_database_status():
    """Get database connection status and collection counts"""
    connected = await ping_database()
    
    if not connected:
        return {
            "connected": False,
            "database": MONGO_DB_NAME,
            "collections": {}
        }
    
    db = await get_database()
    
    # Get counts for all collections
    candidates_count = await db[COLLECTION_CANDIDATES].count_documents({})
    jd_count = await db[COLLECTION_JD].count_documents({})
    conversations_count = await db[COLLECTION_CONVERSATIONS].count_documents({})
    shortlists_count = await db[COLLECTION_SHORTLISTS].count_documents({})
    
    return {
        "connected": True,
        "database": MONGO_DB_NAME,
        "collections": {
            "candidates": candidates_count,
            "jd_parses": jd_count,
            "conversations": conversations_count,
            "shortlists": shortlists_count
        }
    }
