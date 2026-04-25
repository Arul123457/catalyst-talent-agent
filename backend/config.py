import os
from dotenv import load_dotenv

load_dotenv()

# API Configuration
GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

# MongoDB Configuration
MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME", "catalyst_db")

# Collection Names
COLLECTION_CANDIDATES: str = os.getenv("COLLECTION_CANDIDATES", "candidates")
COLLECTION_JD: str = os.getenv("COLLECTION_JD", "job_descriptions")
COLLECTION_CONVERSATIONS: str = os.getenv("COLLECTION_CONVERSATIONS", "conversations")
COLLECTION_SHORTLISTS: str = os.getenv("COLLECTION_SHORTLISTS", "shortlists")

# Vector Search Configuration
VECTOR_INDEX_NAME: str = os.getenv("VECTOR_INDEX_NAME", "candidate_vector_index")
TOP_K_CANDIDATES: int = int(os.getenv("TOP_K_CANDIDATES", "10"))

# Matching Weights
MATCH_WEIGHT: float = float(os.getenv("MATCH_WEIGHT", "0.7"))
INTEREST_WEIGHT: float = float(os.getenv("INTEREST_WEIGHT", "0.3"))

# Embedding Configuration
EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
VECTOR_DIMENSIONS: int = int(os.getenv("VECTOR_DIMENSIONS", "384"))

# CORS Configuration
ALLOWED_ORIGINS: list[str] = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

# JWT Configuration
JWT_SECRET: str = os.getenv("JWT_SECRET", "catalyst_secret_key_2024_deccan_ai")
JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES: int = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))
