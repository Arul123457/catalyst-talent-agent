import asyncio
import json
from datetime import datetime
from groq import Groq
from sentence_transformers import SentenceTransformer
from config import GROQ_API_KEY, GROQ_MODEL, EMBEDDING_MODEL, COLLECTION_CANDIDATES
from db import connect_to_mongo, close_mongo_connection, get_collection


# Initialize Groq client
groq_client = Groq(api_key=GROQ_API_KEY)

# Initialize embedding model
print("Loading embedding model...")
embedding_model = SentenceTransformer(EMBEDDING_MODEL)
print(f"✓ Loaded {EMBEDDING_MODEL}")


GENERATION_PROMPT = """Generate 10 realistic job candidate profiles for the Indian tech industry.
Return ONLY a JSON array with no markdown or extra text.
Each candidate must have these exact fields:
{
  name: string (Indian name),
  current_role: string,
  experience_years: integer (2-15),
  skills: array of 5-8 strings,
  domain: one of [fintech, healthtech, edtech, ecommerce, saas, devtools],
  location: string (Indian city),
  personality_type: one of [actively_looking, passively_open, not_looking],
  hidden_interest_level: integer (1-10),
  education: string,
  notice_period: one of [immediate, 30_days, 60_days, 90_days],
  expected_salary_lpa: integer (8-60),
  summary: string (2 sentence profile summary)
}"""


def generate_batch_with_groq(batch_num: int) -> list:
    """Generate a batch of 10 candidates using Groq"""
    print(f"\n🤖 Generating batch {batch_num}/6...")
    
    try:
        response = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": "You are a data generator. Return only valid JSON arrays with no markdown formatting."},
                {"role": "user", "content": GENERATION_PROMPT}
            ],
            temperature=0.9,
            max_tokens=4000
        )
        
        content = response.choices[0].message.content.strip()
        
        # Remove markdown code blocks if present
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        content = content.strip()
        
        # Parse JSON
        candidates = json.loads(content)
        print(f"✓ Generated {len(candidates)} candidates")
        return candidates
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON parse error: {e}")
        print(f"Response content: {content[:200]}...")
        
        # Retry once
        print("🔄 Retrying...")
        try:
            response = groq_client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[
                    {"role": "system", "content": "You are a data generator. Return only valid JSON arrays with no markdown formatting."},
                    {"role": "user", "content": GENERATION_PROMPT}
                ],
                temperature=0.8,
                max_tokens=4000
            )
            content = response.choices[0].message.content.strip()
            if content.startswith("```"):
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]
            content = content.strip()
            candidates = json.loads(content)
            print(f"✓ Retry successful: {len(candidates)} candidates")
            return candidates
        except Exception as retry_error:
            print(f"❌ Retry failed: {retry_error}")
            return []
    
    except Exception as e:
        print(f"❌ Groq API error: {e}")
        return []


def generate_embedding(candidate: dict) -> list:
    """Generate embedding for a candidate"""
    text = f"{candidate['current_role']} {candidate['domain']} {' '.join(candidate['skills'])} {candidate['summary']}"
    embedding = embedding_model.encode(text).tolist()
    return embedding


async def main():
    """Main function to generate and store candidates"""
    print("=" * 60)
    print("🚀 Catalyst Candidate Generator")
    print("=" * 60)
    
    # Connect to MongoDB
    await connect_to_mongo()
    
    # Check if candidates already exist
    candidates_collection = get_collection(COLLECTION_CANDIDATES)
    existing_count = await candidates_collection.count_documents({})
    
    if existing_count >= 60:
        print(f"\n✓ Already generated: {existing_count} candidates in database")
        print("Skipping generation.")
        await close_mongo_connection()
        return
    
    print(f"\nCurrent candidates in DB: {existing_count}")
    print("Starting generation of 60 candidates...\n")
    
    all_candidates = []
    
    # Generate 6 batches of 10 candidates each
    for batch_num in range(1, 7):
        batch_candidates = generate_batch_with_groq(batch_num)
        
        if not batch_candidates:
            print(f"⚠️  Skipping batch {batch_num} due to errors")
            continue
        
        # Generate embeddings and add metadata
        for candidate in batch_candidates:
            try:
                # Generate embedding
                embedding = generate_embedding(candidate)
                
                # Add required fields
                candidate['embedding'] = embedding
                candidate['created_at'] = datetime.utcnow()
                candidate['engaged'] = False
                candidate['interest_score'] = None
                candidate['match_score'] = None
                
                all_candidates.append(candidate)
                
            except Exception as e:
                print(f"❌ Error processing candidate {candidate.get('name', 'Unknown')}: {e}")
                continue
        
        # Insert batch into MongoDB
        if batch_candidates:
            try:
                result = await candidates_collection.insert_many(batch_candidates)
                print(f"✓ Inserted {len(result.inserted_ids)} candidates into MongoDB")
            except Exception as e:
                print(f"❌ MongoDB insert error: {e}")
        
        # Small delay between batches
        if batch_num < 6:
            await asyncio.sleep(1)
    
    # Final count
    final_count = await candidates_collection.count_documents({})
    print("\n" + "=" * 60)
    print(f"✅ Generation complete!")
    print(f"📊 Total candidates in database: {final_count}")
    print("=" * 60)
    
    await close_mongo_connection()


if __name__ == "__main__":
    asyncio.run(main())
