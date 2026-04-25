function About() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* SECTION 1: Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800 rounded-lg p-8 sm:p-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">How Catalyst Works</h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            A 4-stage AI agent pipeline that transforms a Job Description into a ranked, engagement-verified shortlist
          </p>
        </div>

        {/* SECTION 2: Pipeline Flow Diagram */}
        <div className="mt-16">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-2">
            {/* Box 1 */}
            <div className="bg-gray-800 border-2 border-blue-500 rounded-lg p-6 w-full lg:w-48 text-center">
              <div className="text-4xl mb-2">📄</div>
              <h3 className="font-bold text-lg mb-2">JD Input</h3>
              <p className="text-sm text-gray-400">Raw job description text</p>
            </div>

            {/* Arrow 1 */}
            <div className="text-gray-500 text-3xl rotate-90 lg:rotate-0">→</div>

            {/* Box 2 */}
            <div className="bg-gray-800 border-2 border-purple-500 rounded-lg p-6 w-full lg:w-48 text-center">
              <div className="text-4xl mb-2">🧠</div>
              <h3 className="font-bold text-lg mb-2">JD Parser</h3>
              <p className="text-sm text-gray-400">Groq LLM extracts skills, seniority, domain, culture signals</p>
            </div>

            {/* Arrow 2 */}
            <div className="text-gray-500 text-3xl rotate-90 lg:rotate-0">→</div>

            {/* Box 3 */}
            <div className="bg-gray-800 border-2 border-green-500 rounded-lg p-6 w-full lg:w-48 text-center">
              <div className="text-4xl mb-2">🔍</div>
              <h3 className="font-bold text-lg mb-2">Semantic Matcher</h3>
              <p className="text-sm text-gray-400">MongoDB Vector Search finds top 15 candidates</p>
            </div>

            {/* Arrow 3 */}
            <div className="text-gray-500 text-3xl rotate-90 lg:rotate-0">→</div>

            {/* Box 4 */}
            <div className="bg-gray-800 border-2 border-yellow-500 rounded-lg p-6 w-full lg:w-48 text-center">
              <div className="text-4xl mb-2">💬</div>
              <h3 className="font-bold text-lg mb-2">AI Engager</h3>
              <p className="text-sm text-gray-400">4-turn conversation scores genuine interest</p>
            </div>

            {/* Arrow 4 */}
            <div className="text-gray-500 text-3xl rotate-90 lg:rotate-0">→</div>

            {/* Box 5 */}
            <div className="bg-gray-800 border-2 border-red-500 rounded-lg p-6 w-full lg:w-48 text-center">
              <div className="text-4xl mb-2">📊</div>
              <h3 className="font-bold text-lg mb-2">Ranked Shortlist</h3>
              <p className="text-sm text-gray-400">Combined score = Match(55%) + Interest(45%)</p>
            </div>
          </div>
        </div>

        {/* SECTION 3: Scoring Formula Card */}
        <div className="mt-16">
          <div className="bg-gray-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Scoring Formula</h2>
            
            {/* Formula */}
            <div className="bg-gray-700 rounded-lg p-6 mb-8 text-center">
              <p className="text-2xl font-mono">
                <span className="text-green-400">Combined Score</span> = 
                <span className="text-blue-400"> (Match Score × 0.55)</span> + 
                <span className="text-purple-400"> (Interest Score × 0.45)</span>
              </p>
            </div>

            {/* Match Score Breakdown */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-blue-400">Match Score Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="py-3 px-4 font-semibold">Component</th>
                      <th className="py-3 px-4 font-semibold">Weight</th>
                      <th className="py-3 px-4 font-semibold">How Calculated</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700">
                      <td className="py-3 px-4">Skill Overlap</td>
                      <td className="py-3 px-4">50%</td>
                      <td className="py-3 px-4">JD skills ∩ Candidate skills / total JD skills</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-3 px-4">Seniority Fit</td>
                      <td className="py-3 px-4">30%</td>
                      <td className="py-3 px-4">Years of experience vs JD level</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-3 px-4">Domain Match</td>
                      <td className="py-3 px-4">20%</td>
                      <td className="py-3 px-4">Same domain = 100, different = 0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interest Score Breakdown */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">Interest Score Breakdown</h3>
              <p className="text-gray-300 mb-3">Groq analyzes 4-turn conversation transcript and scores:</p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Response enthusiasm</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Questions asked back</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Willingness to proceed</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Tone and engagement level</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* SECTION 4: Tech Stack Grid */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Built With</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Groq */}
            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-xl font-bold mb-2">Groq API</h3>
              <p className="text-gray-400 text-sm">LLaMA 3.3 70B — JD parsing, candidate personas, narrative generation</p>
            </div>

            {/* MongoDB */}
            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition">
              <div className="text-4xl mb-3">🍃</div>
              <h3 className="text-xl font-bold mb-2">MongoDB Atlas</h3>
              <p className="text-gray-400 text-sm">Vector Search — semantic candidate matching with cosine similarity</p>
            </div>

            {/* FastAPI */}
            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition">
              <div className="text-4xl mb-3">🐍</div>
              <h3 className="text-xl font-bold mb-2">FastAPI</h3>
              <p className="text-gray-400 text-sm">Async Python backend — 8 REST endpoints, Motor driver</p>
            </div>

            {/* React */}
            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition">
              <div className="text-4xl mb-3">⚛️</div>
              <h3 className="text-xl font-bold mb-2">React + Vite</h3>
              <p className="text-gray-400 text-sm">Frontend — dark UI, role-based access, real-time engagement</p>
            </div>

            {/* Sentence Transformers */}
            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition">
              <div className="text-4xl mb-3">🤗</div>
              <h3 className="text-xl font-bold mb-2">Sentence Transformers</h3>
              <p className="text-gray-400 text-sm">all-MiniLM-L6-v2 — 384-dim embeddings for JD and candidates</p>
            </div>

            {/* Deployment */}
            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="text-xl font-bold mb-2">Railway + Vercel</h3>
              <p className="text-gray-400 text-sm">CI/CD — auto-deploy on git push to main</p>
            </div>
          </div>
        </div>

        {/* SECTION 5: Agent Decisions */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why These Trade-offs?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-blue-400">Groq over OpenAI</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                300+ tokens/sec makes conversation feel real-time. Free tier is generous enough for hackathon scale. 
                LLaMA 3.3 70B is powerful enough for structured extraction.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-green-400">MongoDB Vector over Pinecone</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Single database for operational data + vectors eliminates sync complexity. Atlas free tier handles 
                60-candidate pool with room to scale to thousands.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-purple-400">Simulated Outreach over Real Email</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Real email outreach would require candidate consent and deliverability setup. Simulation lets us 
                demonstrate the full conversation logic without infrastructure overhead.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 6: What's Next */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">If We Had More Time</h2>
          <div className="bg-gray-800 rounded-lg p-8">
            <ul className="space-y-4 max-w-3xl mx-auto">
              <li className="flex items-start">
                <span className="text-green-400 text-2xl mr-4">✓</span>
                <span className="text-gray-300 text-lg">Real LinkedIn/GitHub profile ingestion via API</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 text-2xl mr-4">✓</span>
                <span className="text-gray-300 text-lg">Email outreach integration with SendGrid</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 text-2xl mr-4">✓</span>
                <span className="text-gray-300 text-lg">Bias detection flag on shortlists</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 text-2xl mr-4">✓</span>
                <span className="text-gray-300 text-lg">Multi-JD campaign management for recruiters</span>
              </li>
            </ul>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-16 pb-12 text-center">
          <p className="text-gray-400 text-lg mb-2">
            Built for Catalyst Hackathon by <span className="text-white font-semibold">Arutselvan S</span> — deccan.ai 2025
          </p>
          <p className="text-gray-500">
            Stack: Groq + MongoDB Atlas + FastAPI + React
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
