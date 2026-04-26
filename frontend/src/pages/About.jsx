import { Zap, Target, MessageSquare, TrendingUp, CheckCircle, Code, Database, Cpu, Globe } from 'lucide-react';
import Reveal from '../components/Reveal';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Footer from '../components/Footer';

function About() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Gradient orb */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side content */}
            <Reveal>
              <div>
                <Badge variant="primary" size="md" className="mb-6">
                  Technical Overview
                </Badge>
                
                <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
                  <span className="text-white">From Job Description</span>
                  <br />
                  <span className="text-gradient">to Hired — in Minutes</span>
                </h1>
                
                <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                  Catalyst is an end-to-end AI recruitment agent. It reads a job description, finds the best-fit candidates using semantic search, engages them in natural conversation to measure genuine interest, and delivers a ranked shortlist — ready to act on.
                </p>
              </div>
            </Reveal>

            {/* Right side metrics */}
            <div className="space-y-4">
              <Reveal delay={100}>
                <Card className="p-6 border-l-4 border-l-green-500">
                  <div className="text-4xl font-bold text-green-400 mb-1">&lt; 60s</div>
                  <div className="text-gray-400 text-sm">JD to candidates</div>
                </Card>
              </Reveal>
              
              <Reveal delay={200}>
                <Card className="p-6 border-l-4 border-l-green-500">
                  <div className="text-4xl font-bold text-green-400 mb-1">4-turn</div>
                  <div className="text-gray-400 text-sm">AI conversation depth</div>
                </Card>
              </Reveal>
              
              <Reveal delay={300}>
                <Card className="p-6 border-l-4 border-l-green-500">
                  <div className="text-4xl font-bold text-green-400 mb-1">2-axis</div>
                  <div className="text-gray-400 text-sm">Scoring dimensions</div>
                </Card>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS */}
      <section className="py-20 lg:py-32 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-4xl font-bold text-center mb-16">The Agent Pipeline</h2>
          </Reveal>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <Reveal delay={0}>
              <Card className="p-6 relative overflow-hidden group hover:border-green-500/40">
                <div className="absolute top-0 right-0 text-8xl font-bold text-gray-800/10 select-none">01</div>
                <div className="relative">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border-2 border-green-500/30 mb-4">
                    <span className="text-xl font-bold text-green-400">01</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Understand</h3>
                  <h4 className="text-green-400 font-semibold mb-2">JD Intelligence</h4>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Groq LLaMA 3.3 70B parses the raw job description into structured signals — required skills, seniority level, domain context, and culture indicators.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="muted" size="sm">Groq LLaMA 3.3</Badge>
                    <Badge variant="muted" size="sm">Structured Extraction</Badge>
                  </div>
                </div>
              </Card>
            </Reveal>

            {/* Step 2 */}
            <Reveal delay={100}>
              <Card className="p-6 relative overflow-hidden group hover:border-green-500/40">
                <div className="absolute top-0 right-0 text-8xl font-bold text-gray-800/10 select-none">02</div>
                <div className="relative">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border-2 border-green-500/30 mb-4">
                    <span className="text-xl font-bold text-green-400">02</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Discover</h3>
                  <h4 className="text-green-400 font-semibold mb-2">Semantic Matching</h4>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Candidate profiles are embedded using all-MiniLM-L6-v2 and stored in MongoDB Atlas Vector Search. Cosine similarity surfaces the most semantically aligned candidates.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="muted" size="sm">384-dim Vectors</Badge>
                    <Badge variant="muted" size="sm">MongoDB Atlas</Badge>
                  </div>
                </div>
              </Card>
            </Reveal>

            {/* Step 3 */}
            <Reveal delay={200}>
              <Card className="p-6 relative overflow-hidden group hover:border-green-500/40">
                <div className="absolute top-0 right-0 text-8xl font-bold text-gray-800/10 select-none">03</div>
                <div className="relative">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border-2 border-green-500/30 mb-4">
                    <span className="text-xl font-bold text-green-400">03</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Engage</h3>
                  <h4 className="text-green-400 font-semibold mb-2">Conversational Scoring</h4>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    The agent conducts a structured 4-turn conversation with each candidate persona, probing current situation, role fit, expectations, and enthusiasm.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="muted" size="sm">4-turn Dialogue</Badge>
                    <Badge variant="muted" size="sm">NLP Scoring</Badge>
                  </div>
                </div>
              </Card>
            </Reveal>

            {/* Step 4 */}
            <Reveal delay={300}>
              <Card className="p-6 relative overflow-hidden group hover:border-green-500/40">
                <div className="absolute top-0 right-0 text-8xl font-bold text-gray-800/10 select-none">04</div>
                <div className="relative">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border-2 border-green-500/30 mb-4">
                    <span className="text-xl font-bold text-green-400">04</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Rank</h3>
                  <h4 className="text-green-400 font-semibold mb-2">Weighted Shortlist</h4>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Every candidate receives a Combined Score derived from Match Score and Interest Score. The recruiter gets a ranked, actionable shortlist with narrative summaries.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="muted" size="sm">Weighted Scoring</Badge>
                    <Badge variant="muted" size="sm">AI Narratives</Badge>
                  </div>
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SECTION 3: SCORING ENGINE */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-3">Scoring Engine</h2>
              <p className="text-gray-400 text-lg">Two independent signals. One combined score.</p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* LEFT - Match Score */}
            <Reveal delay={100}>
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-green-400" />
                  <h3 className="text-2xl font-bold">Match Score</h3>
                  <Badge variant="success" size="sm">55% weight</Badge>
                </div>

                <div className="space-y-6">
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
              </Card>
            </Reveal>

            {/* RIGHT - Interest Score */}
            <Reveal delay={200}>
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                  <h3 className="text-2xl font-bold">Interest Score</h3>
                  <Badge variant="info" size="sm">45% weight</Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Response Enthusiasm</p>
                      <p className="text-gray-400 text-sm">Detected from tone analysis</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Inbound Questions</p>
                      <p className="text-gray-400 text-sm">Candidate asks about role</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Availability Signals</p>
                      <p className="text-gray-400 text-sm">Notice period, timing</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Commitment Indicators</p>
                      <p className="text-gray-400 text-sm">Willingness to proceed</p>
                    </div>
                  </div>
                </div>
              </Card>
            </Reveal>
          </div>

          {/* Formula Display */}
          <Reveal delay={300}>
            <Card className="p-8 text-center">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xl lg:text-2xl font-bold">
                <span className="text-white">Combined Score</span>
                <span className="text-gray-500">=</span>
                <Badge variant="success" size="lg" className="text-lg">
                  Match × 0.55
                </Badge>
                <span className="text-gray-500">+</span>
                <Badge variant="info" size="lg" className="text-lg">
                  Interest × 0.45
                </Badge>
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* SECTION 4: TECH STACK */}
      <section className="py-20 lg:py-32 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-4xl font-bold text-center mb-12">Built On</h2>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Reveal delay={0}>
              <Card hover className="p-6">
                <Cpu className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Groq</h3>
                <p className="text-gray-400 text-sm mb-4">Inference engine for all LLM calls</p>
                <Badge variant="muted" size="sm">LLaMA 3.3 70B · 300+ tok/s</Badge>
              </Card>
            </Reveal>

            <Reveal delay={50}>
              <Card hover className="p-6">
                <Database className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">MongoDB Atlas</h3>
                <p className="text-gray-400 text-sm mb-4">Operational database + vector search</p>
                <Badge variant="muted" size="sm">Cosine similarity · 384 dims</Badge>
              </Card>
            </Reveal>

            <Reveal delay={100}>
              <Card hover className="p-6">
                <Code className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">FastAPI</h3>
                <p className="text-gray-400 text-sm mb-4">Async Python API layer</p>
                <Badge variant="muted" size="sm">8 endpoints · Motor driver</Badge>
              </Card>
            </Reveal>

            <Reveal delay={150}>
              <Card hover className="p-6">
                <Zap className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">React + Vite</h3>
                <p className="text-gray-400 text-sm mb-4">Frontend application</p>
                <Badge variant="muted" size="sm">Role-based · Real-time UI</Badge>
              </Card>
            </Reveal>

            <Reveal delay={200}>
              <Card hover className="p-6">
                <TrendingUp className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sentence Transformers</h3>
                <p className="text-gray-400 text-sm mb-4">Local embedding generation</p>
                <Badge variant="muted" size="sm">all-MiniLM-L6-v2 · CPU optimized</Badge>
              </Card>
            </Reveal>

            <Reveal delay={250}>
              <Card hover className="p-6">
                <Globe className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Hugging Face Spaces</h3>
                <p className="text-gray-400 text-sm mb-4">Production deployment platform</p>
                <Badge variant="muted" size="sm">Auto-deploy · GPU support</Badge>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SECTION 5: DESIGN DECISIONS */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-4xl font-bold text-center mb-12">Why These Choices</h2>
          </Reveal>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <Reveal delay={0}>
              <Card className="p-8 border-t-2 border-t-green-500">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-4">Groq over OpenAI</h3>
                <p className="text-gray-400 leading-relaxed">
                  Speed matters in recruitment. Groq's 300+ tokens/second makes candidate conversations feel instantaneous. LLaMA 3.3 70B handles structured extraction and persona simulation without quality compromise.
                </p>
              </Card>
            </Reveal>

            <Reveal delay={100}>
              <Card className="p-8 border-t-2 border-t-green-500">
                <div className="text-4xl mb-4">🗄️</div>
                <h3 className="text-xl font-bold mb-4">MongoDB over Pinecone</h3>
                <p className="text-gray-400 leading-relaxed">
                  Operational data and vector embeddings in one system eliminates synchronization overhead. Atlas Vector Search scales from 60 to 60,000 candidates without architectural changes.
                </p>
              </Card>
            </Reveal>

            <Reveal delay={200}>
              <Card className="p-8 border-t-2 border-t-green-500">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-bold mb-4">Simulated over Live Outreach</h3>
                <p className="text-gray-400 leading-relaxed">
                  Simulated personas let us demonstrate the full conversation pipeline without GDPR constraints or email deliverability dependencies. The scoring logic works identically with real candidates.
                </p>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;
