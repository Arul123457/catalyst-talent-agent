from sentence_transformers import SentenceTransformer
from config import EMBEDDING_MODEL

# Load model once at module level (singleton pattern)
print(f"Loading embedding model: {EMBEDDING_MODEL}...")
_embedding_model = SentenceTransformer(EMBEDDING_MODEL)
print(f"✓ Embedding model loaded: {EMBEDDING_MODEL}")


def get_embedder():
    """Get the embedding model instance"""
    return _embedding_model


def get_embedding(text: str) -> list[float]:
    """
    Generate embedding vector for given text.
    Uses pre-loaded sentence-transformer model.
    
    Args:
        text: Input text to embed
        
    Returns:
        List of floats representing the embedding vector (384 dimensions)
    """
    embedding = _embedding_model.encode(text).tolist()
    return embedding
