from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import ALLOWED_ORIGINS
from db import connect_to_mongo, close_mongo_connection
from routes.health import router as health_router
from routes.database import router as database_router
from routes.jd_parser import router as jd_router
from routes.matching import router as matching_router
from routes.engagement import router as engagement_router
from routes.shortlist import router as shortlist_router
from routes.auth_routes import router as auth_router
from routes.candidate_routes import router as candidate_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    await connect_to_mongo()
    print("🚀 Catalyst Backend Running")
    yield
    # Shutdown
    await close_mongo_connection()


app = FastAPI(
    title="Catalyst Talent Scouting Agent",
    description="AI-powered talent scouting backend",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
# Hardcoded origins for common development and production environments
hardcoded_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://catalyst-talent-agent.vercel.app"
]

# Merge with environment variable origins if they exist
allowed_origins = list(set(hardcoded_origins + ALLOWED_ORIGINS))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router, tags=["Health"])
app.include_router(database_router, prefix="/api", tags=["Database"])
app.include_router(auth_router, tags=["Auth"])
app.include_router(candidate_router, tags=["Candidate"])
app.include_router(jd_router, prefix="/api", tags=["JD Parser"])
app.include_router(matching_router, prefix="/api", tags=["Matching"])
app.include_router(engagement_router, prefix="/api", tags=["Engagement"])
app.include_router(shortlist_router, prefix="/api", tags=["Shortlist"])


@app.get("/health")
async def root_health():
    """Root health check"""
    return {
        "status": "ok",
        "service": "catalyst-backend",
        "version": "1.0.0"
    }
