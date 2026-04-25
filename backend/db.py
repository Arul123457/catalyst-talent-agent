from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase, AsyncIOMotorCollection
from pymongo import MongoClient
from config import (
    MONGO_URI, 
    MONGO_DB_NAME, 
    COLLECTION_CANDIDATES,
    COLLECTION_JD,
    COLLECTION_CONVERSATIONS,
    COLLECTION_SHORTLISTS
)

client: AsyncIOMotorClient = None
database: AsyncIOMotorDatabase = None

# Synchronous client for auth operations
sync_client: MongoClient = None
sync_database = None


async def connect_to_mongo():
    """Connect to MongoDB on startup"""
    global client, database, sync_client, sync_database
    client = AsyncIOMotorClient(MONGO_URI)
    database = client[MONGO_DB_NAME]
    
    # Initialize synchronous client for auth operations
    sync_client = MongoClient(MONGO_URI)
    sync_database = sync_client[MONGO_DB_NAME]
    
    # Ping database to verify connection
    is_connected = await ping_database()
    
    if is_connected:
        print("MongoDB Connected ✅")
        # Print candidate count on first connection
        candidate_count = await database[COLLECTION_CANDIDATES].count_documents({})
        print(f"✓ Candidates in collection: {candidate_count}")
    else:
        print("MongoDB Failed ❌")


async def close_mongo_connection():
    """Close MongoDB connection on shutdown"""
    global client, sync_client
    if client:
        client.close()
        print("✓ MongoDB connection closed")
    if sync_client:
        sync_client.close()
        print("✓ Sync MongoDB connection closed")


async def get_database() -> AsyncIOMotorDatabase:
    """Get the database instance"""
    return database


def get_collection(name: str) -> AsyncIOMotorCollection:
    """Get a collection by name"""
    return database[name]


def get_db():
    """Get synchronous database instance for auth operations"""
    if sync_database is None:
        raise RuntimeError("Database not initialized. Make sure the application has started up properly.")
    return sync_database


async def ping_database() -> bool:
    """Ping database to check connection status"""
    try:
        await client.admin.command('ping')
        return True
    except Exception as e:
        print(f"Database ping failed: {e}")
        return False
