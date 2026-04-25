import { Link } from 'react-router-dom'
import { FileText, Target, MessageSquare, TrendingUp, Users, Zap } from 'lucide-react'

function Landing() {
  return (
    <div className="bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            AI-Powered Talent Scouting
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
            From Job Description to Ranked Shortlist in minutes
          </p>

          {/* Stats Cards */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 min-w-[240px]">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-green-400 mr-2" />
                <span className="text-4xl font-bold text-white">60+</span>
              </div>
              <p className="text-gray-400">Candidates Indexed</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 min-w-[240px]">
              <div className="flex items-center justify-center mb-2">
                <MessageSquare className="w-8 h-8 text-green-400 mr-2" />
                <span className="text-4xl font-bold text-white">4-Turn</span>
              </div>
              <p className="text-gray-400">AI Engagement</p>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            to="/scout"
            className="inline-flex items-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors text-lg shadow-lg shadow-green-500/20"
          >
            Start Scouting
            <Zap className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-green-400/50 transition-colors">
            <div className="bg-green-400/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">JD Parsing</h3>
            <p className="text-gray-400">
              Automatically extract key requirements and skills from job descriptions
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-green-400/50 transition-colors">
            <div className="bg-green-400/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Semantic Matching</h3>
            <p className="text-gray-400">
              Vector-based search finds candidates beyond keyword matching
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-green-400/50 transition-colors">
            <div className="bg-green-400/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Engagement</h3>
            <p className="text-gray-400">
              Multi-turn conversations assess cultural fit and soft skills
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-green-400/50 transition-colors">
            <div className="bg-green-400/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Ranking</h3>
            <p className="text-gray-400">
              Weighted scoring combines technical match with engagement quality
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing
