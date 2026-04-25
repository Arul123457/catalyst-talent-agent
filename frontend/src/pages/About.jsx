function About() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* SECTION 1: HERO */}
      <div className="relative overflow-hidden">
        {/* Gradient orb */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side content */}
            <div>
              <div className="inline-block mb-6">
                <span className="px-4 py-1.5 bg-green-500/10 text-green-400 rounded-full text-xs font-semibold tracking-widest uppercase">
                  Technical Overview
                </span>
              </div>
              
              <h1 className="font-display text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
                From Job Description<br />to Hired — in Minutes.
              </h1>
              
              <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                Catalyst is an end-to-end AI recruitment agent. It reads a job description, finds the best-fit candidates using semantic search, engages them in natural conversation to measure genuine interest, and delivers a ranked shortlist — ready to act on.
              </p>
            </div>

            {/* Right side metrics */}
            <div className="space-y-4">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 border-l-4 border-l-green-500">
                <div className="text-4xl font-display font-bold text-green-400 mb-1">&lt; 60s</div>
                <div className="text-gray-400 text-sm">JD to candidates</div>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 border-l-4 border-l-green-500">
                <div className="text-4xl font-display font-bold text-green-400 mb-1">4-turn</div>
                <div className="text-gray-400 text-sm">AI conversation depth</div>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 border-l-4 border-l-green-500">
                <div className="text-4xl font-display font-bold text-green-400 mb-1">2-axis</div>
                <div className="text-gray-400 text-sm">Scoring dimensions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: HOW IT WORKS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="font-display text-4xl font-bold text-center mb-16">The Agent Pipeline</h2>
        
        <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Step 1 */}
          <div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
                <span className="font-display text-green-400 font-bold">01</span>
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold mb-3">Understand</h3>
                <h4 className="text-green-400 font-semibold mb-2">JD Intelligence</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Groq LLaMA 3.3 70B parses the raw job description into structured signals — required skills, seniority level, domain context, and culture indicators.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">Groq LLaMA 3.3 70B</span>
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">Structured Extraction</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
                <span className="font-display text-green-400 font-bold">02</span>
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold mb-3">Discover</h3>
                <h4 className="text-green-400 font-semibold mb-2">Semantic Matching</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Candidate profiles are embedded using all-MiniLM-L6-v2 and stored in MongoDB Atlas Vector Search. Cosine similarity surfaces the most semantically aligned candidates — not just keyword matches.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">384-dim Vectors</span>
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">Cosine Similarity</span>
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">MongoDB Atlas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
                <span className="font-display text-green-400 font-bold">03</span>
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold mb-3">Engage</h3>
                <h4 className="text-green-400 font-semibold mb-2">Conversational Scoring</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  The agent conducts a structured 4-turn conversation with each candidate persona, probing current situation, role fit, expectations, and enthusiasm. Groq analyzes the full transcript to produce an Interest Score.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">4-turn Dialogue</span>
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">Persona Simulation</span>
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">NLP Scoring</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
                <span className="font-display text-green-400 font-bold">04</span>
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold mb-3">Rank</h3>
                <h4 className="text-green-400 font-semibold mb-2">Weighted Shortlist</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Every candidate receives a Combined Score derived from Match Score and Interest Score. The recruiter gets a ranked, actionable shortlist with narrative summaries — not raw data.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">Weighted Scoring</span>
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">Recruiter Narratives</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: SCORING ENGINE */}
      <div className="bg-gray-800/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-3">Scoring Engine</h2>
            <p className="text-gray-400 text-lg">Two independent signals. One combined score.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* LEFT - Match Score */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="font-display text-2xl font-bold">Match Score</h3>
                <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-semibold">55% weight</span>
              </div>

              <div className="space-y-6">
                {/* Skill Overlap */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Skill Overlap</span>
                    <span className="text-green-400 font-bold">50%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                    <div className="bg-green-500 h-3 rounded-full" style={{width: '50%'}}></div>
                  </div>
                  <p className="text-gray-400 text-sm">JD required skills vs candidate skills</p>
                </div>

                {/* Seniority Fit */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Seniority Fit</span>
                    <span className="text-blue-400 font-bold">30%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                    <div className="bg-blue-500 h-3 rounded-full" style={{width: '30%'}}></div>
                  </div>
                  <p className="text-gray-400 text-sm">Experience years vs role level</p>
                </div>

                {/* Domain Match */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Domain Match</span>
                    <span className="text-purple-400 font-bold">20%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                    <div className="bg-purple-500 h-3 rounded-full" style={{width: '20%'}}></div>
                  </div>
                  <p className="text-gray-400 text-sm">Industry vertical alignment</p>
                </div>
              </div>
            </div>

            {/* RIGHT - Interest Score */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="font-display text-2xl font-bold">Interest Score</h3>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm font-semibold">45% weight</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold mb-1">Response Enthusiasm</p>
                    <p className="text-gray-400 text-sm">Detected from tone analysis</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold mb-1">Inbound Questions</p>
                    <p className="text-gray-400 text-sm">Candidate asks about role</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold mb-1">Availability Signals</p>
                    <p className="text-gray-400 text-sm">Notice period, timing</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold mb-1">Commitment Indicators</p>
                    <p className="text-gray-400 text-sm">Willingness to proceed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formula Display */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
            <div className="flex flex-wrap items-center justify-center gap-4 text-2xl font-display font-bold">
              <span className="text-white">Combined Score</span>
              <span className="text-gray-500">=</span>
              <span className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg border border-green-500/30">
                Match × 0.55
              </span>
              <span className="text-gray-500">+</span>
              <span className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/30">
                Interest × 0.45
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: TECH STACK */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="font-display text-4xl font-bold text-center mb-12">Built On</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Groq */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-green-500/50 transition">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="font-display text-xl font-semibold mb-2">Groq</h3>
            <p className="text-gray-400 text-sm mb-4">Inference engine for all LLM calls</p>
            <span className="inline-block px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
              LLaMA 3.3 70B · 300+ tok/s
            </span>
          </div>

          {/* MongoDB */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-green-500/50 transition">
            <div className="text-4xl mb-4">🍃</div>
            <h3 className="font-display text-xl font-semibold mb-2">MongoDB Atlas</h3>
            <p className="text-gray-400 text-sm mb-4">Operational database + vector search</p>
            <span className="inline-block px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
              Cosine similarity · 384 dims
            </span>
          </div>

          {/* FastAPI */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-green-500/50 transition">
            <div className="text-4xl mb-4">🐍</div>
            <h3 className="font-display text-xl font-semibold mb-2">FastAPI</h3>
            <p className="text-gray-400 text-sm mb-4">Async Python API layer</p>
            <span className="inline-block px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
              8 endpoints · Motor driver
            </span>
          </div>

          {/* React */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-green-500/50 transition">
            <div className="text-4xl mb-4">⚛️</div>
            <h3 className="font-display text-xl font-semibold mb-2">React + Vite</h3>
            <p className="text-gray-400 text-sm mb-4">Frontend application</p>
            <span className="inline-block px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
              Role-based · Real-time UI
            </span>
          </div>

          {/* Sentence Transformers */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-green-500/50 transition">
            <div className="text-4xl mb-4">🤗</div>
            <h3 className="font-display text-xl font-semibold mb-2">Sentence Transformers</h3>
            <p className="text-gray-400 text-sm mb-4">Local embedding generation</p>
            <span className="inline-block px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
              all-MiniLM-L6-v2 · CPU optimized
            </span>
          </div>

          {/* Deployment */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-green-500/50 transition">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="font-display text-xl font-semibold mb-2">HF Spaces + Vercel</h3>
            <p className="text-gray-400 text-sm mb-4">Production deployment</p>
            <span className="inline-block px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
              Auto-deploy · Global CDN
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 5: DESIGN DECISIONS */}
      <div className="bg-gray-800/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl font-bold text-center mb-12">Why These Choices</h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 border-t-2 border-t-green-500">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-display text-xl font-bold mb-4">Groq over OpenAI</h3>
              <p className="text-gray-400 leading-relaxed">
                Speed matters in recruitment. Groq's 300+ tokens/second makes candidate conversations feel instantaneous. LLaMA 3.3 70B handles structured extraction and persona simulation without quality compromise.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 border-t-2 border-t-green-500">
              <div className="text-4xl mb-4">🗄️</div>
              <h3 className="font-display text-xl font-bold mb-4">MongoDB over Pinecone</h3>
              <p className="text-gray-400 leading-relaxed">
                Operational data and vector embeddings in one system eliminates synchronization overhead. Atlas Vector Search scales from 60 to 60,000 candidates without architectural changes.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 border-t-2 border-t-green-500">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="font-display text-xl font-bold mb-4">Simulated over Live Outreach</h3>
              <p className="text-gray-400 leading-relaxed">
                Simulated personas let us demonstrate the full conversation pipeline without GDPR constraints or email deliverability dependencies. The scoring logic works identically with real candidates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-display text-2xl font-bold mb-2">Catalyst — AI Talent Scouting Agent</h3>
          <p className="text-gray-400 mb-4">Built by Arutselvan S for deccan.ai Catalyst Program</p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">Groq</span>
            <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">MongoDB</span>
            <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">FastAPI</span>
            <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">React</span>
            <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">HuggingFace</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
