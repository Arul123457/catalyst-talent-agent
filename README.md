# ⚡ Catalyst — AI-Powered Talent Scouting & Engagement Agent

> Built for the Catalyst Hackathon by deccan.ai  
> Submitted by: Arutselvan S

---

## 🎯 Problem Statement

Recruiters spend hours manually sifting through candidate profiles and chasing interest signals that never come. The process is slow, biased toward keyword matching, and produces shortlists that reflect availability — not genuine fit or interest.

**Catalyst solves this in three ways:**

1. Understands job descriptions semantically, not literally
2. Matches candidates using vector similarity across skills, seniority, and domain — not keyword overlap
3. Engages candidates conversationally and scores their genuine interest before the recruiter ever picks up the phone

The output is a ranked, engagement-verified shortlist with AI-generated narratives the recruiter can act on immediately.

---

## 🏗️ Architecture

```
JD Text Input
│
▼
┌─────────────────┐
│   JD Parser     │  ← Groq LLaMA 3.3 70B extracts:
│                 │    required_skills, nice_to_have,
│                 │    seniority, domain, culture_signals
└────────┬────────┘
│ embedding (all-MiniLM-L6-v2, 384-dim)
▼
┌─────────────────┐
│ Semantic Matcher│  ← MongoDB Atlas Vector Search
│                 │    cosine similarity → top 15 candidates
│                 │    + weighted Match Score computation
└────────┬────────┘
│ top candidates
▼
┌─────────────────┐
│  AI Engager     │  ← Groq runs 4-turn conversation
│                 │    agent plays recruiter,
│                 │    LLM plays candidate persona
│                 │    → Interest Score 0-100
└────────┬────────┘
│ scores + transcript
▼
┌─────────────────┐
│ Shortlist Ranker│  ← Combined Score formula:
│                 │    (Match × 0.55) + (Interest × 0.45)
│                 │    + Groq narrative generation
└────────┬────────┘
│
▼
Ranked Shortlist
with narratives
```

---

## ✅ What We Built

### Backend (FastAPI + Python)

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | Service health check |
| `/api/parse-jd` | POST | Parse JD → structured JSON + embedding |
| `/api/match-candidates` | POST | Vector search → top 15 + Match Score |
| `/api/engage-candidate` | POST | Single conversation turn |
| `/api/score-interest` | POST | Analyze transcript → Interest Score |
| `/api/generate-narrative` | POST | 3-line recruiter narrative |
| `/api/add-to-shortlist` | POST | Store + compute Combined Score |
| `/api/shortlist/{jd_id}` | GET | Ranked shortlist retrieval |
| `/api/auth/register` | POST | Candidate registration |
| `/api/auth/login` | POST | JWT login |
| `/api/auth/me` | GET | Current user profile |
| `/api/candidate/profile` | GET/PUT | Candidate profile management |
| `/api/candidate/applications` | GET | Engagement history |
| `/api/db-status` | GET | MongoDB connection status |

### Frontend (React + Vite)

| Page | Route | Access |
|---|---|---|
| Landing | `/` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Scout | `/scout` | Admin only |
| Shortlist | `/shortlist` | Admin only |
| Architecture | `/about` | Public |
| Candidate Dashboard | `/candidate/dashboard` | Candidate only |

---

## 🧠 How Each Agent Brain Works

### 1. JD Parser Brain

Takes raw job description text and calls Groq LLaMA 3.3 70B with a structured extraction prompt. Returns a typed JSON object containing required skills, nice-to-have skills, seniority level, domain, culture signals, and a role summary. The parsed output is then embedded using sentence-transformers all-MiniLM-L6-v2 to produce a 384-dimensional vector stored in MongoDB.

### 2. Semantic Matcher Brain

Uses MongoDB Atlas Vector Search with cosine similarity to find the top 15 candidates whose profile embeddings are closest to the JD embedding. Each candidate then receives a weighted Match Score:

```
Skill Overlap  → 50% weight
= (JD skills ∩ Candidate skills) / total JD skills × 100

Seniority Fit  → 30% weight
= 100 if experience_years fits JD seniority range
  70  if within 2 years of range
  30  if outside range

Domain Match   → 20% weight
= 100 if candidate domain == JD domain
  0   otherwise

Match Score = (skill × 0.50) + (seniority × 0.30) + (domain × 0.20)
```

Every match includes explainability: matched skills, missing skills, and seniority fit label (good / partial / poor).

### 3. Conversational Engagement Brain

The agent conducts a structured 4-turn conversation with each candidate. Groq LLM plays the candidate persona using their personality_type (actively_looking / passively_open / not_looking) to guide response tone. The recruiter agent asks:

- Turn 1: Current situation and openness to opportunities
- Turn 2: Role alignment and skill fit discussion  
- Turn 3: Availability, notice period, salary expectations
- Turn 4: Enthusiasm close — willingness to take next step

After all 4 turns, the full transcript is analyzed by Groq to produce an Interest Score (0-100) with reasoning and signals.

### 4. Narrative Generator Brain

For each shortlisted candidate, Groq generates a 3-sentence recruiter-ready narrative:

- Sentence 1: Background and top skills
- Sentence 2: How they engaged with this specific role
- Sentence 3: Clear recommendation action

### 5. Shortlist Ranker Brain

Combines both scores using a weighted formula and sorts descending. Each entry gets a next step recommendation:

```
Combined Score = (Match × 0.55) + (Interest × 0.45)

≥ 80 → Schedule Interview
≥ 60 → Send Assignment
≥ 40 → Nurture
<  40 → Pass
```

---

## 🔐 Role-Based Access

| Role | Access | Created Via |
|---|---|---|
| Admin | Scout, Shortlist, all API endpoints | Seeded on startup (`admin@deccan.ai`) |
| Candidate | Dashboard, profile, applications | Self-registration |

Default admin credentials:

```
Email:    admin@deccan.ai
Password: Admin@123
```

JWT tokens expire after 24 hours. All admin routes are protected with Bearer token authentication.

---

## 📊 Candidate Pool

60 synthetic candidates are pre-generated using Groq and stored in MongoDB with the following diversity:

- Domains: fintech, healthtech, edtech, ecommerce, saas, devtools
- Experience: 2–15 years
- Locations: Bangalore, Mumbai, Chennai, Pune, Hyderabad, Noida
- Personality types: actively_looking, passively_open, not_looking
- Skills: 5–8 skills per candidate across full stack, backend, data engineering, ML, devops

Each candidate profile is embedded and indexed for vector search.

---

## 🛠️ Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| LLM | Groq LLaMA 3.3 70B | 300+ tok/s, free tier, structured extraction |
| Embeddings | sentence-transformers/all-MiniLM-L6-v2 | 384-dim, CPU-optimized, local |
| Vector DB | MongoDB Atlas Vector Search | Single DB for data + vectors |
| Backend | FastAPI + Motor (async) | Fast, typed, async MongoDB driver |
| Frontend | React + Vite + TailwindCSS | Fast build, component-based |
| Auth | JWT + bcrypt | Stateless, secure, role-based |
| Backend Host | HuggingFace Spaces (Docker) | Supports PyTorch, no image size limit |
| Frontend Host | Vercel | Auto-deploy, global CDN |
| CI/CD | GitHub Actions | Lint + build checks on push to main |

---

## ⚖️ Trade-offs & Decisions

**Groq over OpenAI**

Speed was the deciding factor. At 300+ tokens/second, Groq makes the 4-turn conversation feel real-time. LLaMA 3.3 70B handles both structured JSON extraction and free-form persona simulation without quality compromise.

**MongoDB Atlas over Pinecone**

Having operational data and vector embeddings in one system eliminates synchronization complexity. Atlas Vector Search scales from our 60-candidate pool to tens of thousands without any architectural changes.

**Simulated Outreach over Live Email**

Live email outreach requires candidate consent, deliverability infrastructure, and GDPR compliance. Persona simulation lets us demonstrate the full conversation scoring pipeline with identical logic — ready to swap in real outreach when needed.

**HuggingFace Spaces over Railway/Render**

Railway has a 4GB Docker image limit which PyTorch exceeds. HuggingFace Spaces is purpose-built for ML workloads and supports our sentence-transformers dependency natively.

**sentence-transformers over HuggingFace Inference API**

Local embeddings eliminate network latency and API rate limits during candidate generation and matching. The all-MiniLM-L6-v2 model is only 80MB and runs efficiently on CPU.

---

## 🚀 Local Setup

### Prerequisites

```
Python 3.11+
Node.js 18+
MongoDB Atlas account (free tier)
Groq API key (free tier)
```

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt

# Copy and fill env file
cp .env.example .env

# Generate candidate pool (run once)
python generate_candidates.py

# Start server
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install

# Copy and fill env file
cp .env.example .env

npm run dev
```

Backend runs on: `http://localhost:8000`  
Frontend runs on: `http://localhost:3000`

---

## 🧪 Test the Full Flow

1. Open `http://localhost:3000`
2. Login as admin: `admin@deccan.ai` / `Admin@123`
3. Go to Scout page
4. Paste this sample JD:

```
We are hiring a Senior Python Backend Engineer with 5+ years
experience in FastAPI, MongoDB, and distributed systems.
Fintech startup. We value ownership and fast delivery.
```

5. Click "Parse & Scout Candidates"
6. View 15 ranked candidates with match scores
7. Click "Engage Candidate" on any card
8. Click "Send Message" 4 times
9. View Interest Score + Generate Narrative
10. Add to Shortlist
11. Navigate to Shortlist page
12. View ranked table + Export CSV

---

## 📁 Project Structure

```
catalyst-talent-agent/
├── backend/
│   ├── main.py                 # FastAPI app + CORS + startup
│   ├── config.py               # All env constants
│   ├── db.py                   # MongoDB Motor connection
│   ├── auth.py                 # JWT + bcrypt utilities
│   ├── generate_candidates.py  # One-time candidate seeder
│   ├── requirements.txt
│   ├── Dockerfile              # HuggingFace Spaces deploy
│   ├── railway.toml
│   ├── Procfile
│   ├── .env.example
│   ├── /routes/
│   │   ├── health.py
│   │   ├── jd_parser.py
│   │   ├── matching.py
│   │   ├── engagement.py
│   │   ├── shortlist.py
│   │   ├── auth_routes.py
│   │   └── candidate_routes.py
│   ├── /models/
│   │   └── schemas.py
│   └── /services/
│       └── embedder.py
├── frontend/
│   ├── /src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── /api/
│   │   │   └── client.js
│   │   ├── /context/
│   │   │   └── AuthContext.jsx
│   │   ├── /components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   └── /pages/
│   │       ├── Landing.jsx
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── Scout.jsx
│   │       ├── Shortlist.jsx
│   │       ├── About.jsx
│   │       └── CandidateDashboard.jsx
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
├── .github/
│   └── workflows/
│       ├── backend-ci.yml
│       └── frontend-ci.yml
└── README.md
```

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| Frontend | https://catalyst-talent-agent.vercel.app |
| Backend | https://arul1081-catalyst-talent-agent.hf.space |
| Health Check | https://arul1081-catalyst-talent-agent.hf.space/health |

---

## 📹 Demo Video

[Watch 4-minute walkthrough → Loom Link]

---

## 👤 Author

**Arutselvan S**  
Built for the Catalyst Hiring Challenge — deccan.ai  
GitHub: [@Arul123457](https://github.com/Arul123457)
