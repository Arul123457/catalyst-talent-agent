import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, X, Briefcase, MapPin, TrendingUp, MessageSquare, Sparkles } from 'lucide-react'
import API from '../api/client'

function Scout() {
  const [state, setState] = useState('input') // 'input' | 'matching' | 'results'
  const [jdText, setJdText] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [parsedJd, setParsedJd] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [engagedCandidate, setEngagedCandidate] = useState(null)

  const handleParseAndMatch = async () => {
    if (!jdText.trim()) {
      setError('Please paste a job description')
      return
    }

    setError('')
    setLoading(true)
    setState('matching')

    try {
      // Step 1: Parse JD
      const parseResponse = await API.post('/api/parse-jd', { jd_text: jdText })
      setParsedJd(parseResponse.data)
      
      // Save jd_id to localStorage
      localStorage.setItem('current_jd_id', parseResponse.data.jd_id)

      // Step 2: Match candidates
      const matchResponse = await API.post('/api/match-candidates', { 
        jd_id: parseResponse.data.jd_id 
      })
      setCandidates(matchResponse.data.candidates || [])
      
      setState('results')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process job description')
      setState('input')
    } finally {
      setLoading(false)
    }
  }

  const handleNewJd = () => {
    setState('input')
    setJdText('')
    setParsedJd(null)
    setCandidates([])
    setEngagedCandidate(null)
    setError('')
  }

  const handleEngageCandidate = (candidate) => {
    setEngagedCandidate(candidate)
  }

  const handleCloseEngagement = () => {
    setEngagedCandidate(null)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-8 px-4">
      {/* STATE 1: Input Form */}
      {state === 'input' && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 rounded-xl p-8 shadow-xl">
            <h1 className="text-3xl font-bold mb-6 text-center">Paste Your Job Description</h1>
            
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full job description here..."
              className="w-full min-h-[300px] bg-gray-900 text-white rounded-lg p-4 border border-gray-700 focus:border-green-400 focus:outline-none resize-y"
              rows={10}
            />

            {error && (
              <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                {error}
              </div>
            )}

            <button
              onClick={handleParseAndMatch}
              disabled={loading}
              className="mt-6 w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Parse & Scout Candidates'
              )}
            </button>
          </div>
        </div>
      )}

      {/* STATE 2: Loading */}
      {state === 'matching' && (
        <div className="max-w-3xl mx-auto text-center py-20">
          <Loader2 className="animate-spin w-16 h-16 text-green-400 mx-auto mb-4" />
          <p className="text-xl text-gray-400">Parsing JD and finding candidates...</p>
        </div>
      )}

      {/* STATE 3: Results */}
      {state === 'results' && parsedJd && (
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT COLUMN: JD Summary */}
            <div className="lg:w-1/3">
              <div className="bg-gray-800 rounded-xl p-6 sticky top-4">
                <h2 className="text-2xl font-bold mb-4">{parsedJd.role_title}</h2>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                    {parsedJd.domain}
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                    {parsedJd.seniority}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {parsedJd.required_skills?.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-700 text-gray-200 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {parsedJd.nice_to_have?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Nice to Have</h3>
                    <div className="flex flex-wrap gap-2">
                      {parsedJd.nice_to_have.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 border border-gray-600 text-gray-300 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {parsedJd.culture_signals?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Culture Signals</h3>
                    <div className="flex flex-wrap gap-2">
                      {parsedJd.culture_signals.map((signal, idx) => (
                        <span key={idx} className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm">
                          {signal}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-sm text-gray-400 mb-6">{parsedJd.role_summary}</p>

                <button
                  onClick={handleNewJd}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  ← New JD
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Candidates */}
            <div className="lg:w-2/3">
              <h2 className="text-2xl font-bold mb-4">
                {candidates.length} Candidate{candidates.length !== 1 ? 's' : ''} Found
              </h2>

              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div key={candidate.candidate_id}>
                    <CandidateCard
                      candidate={candidate}
                      onEngage={() => handleEngageCandidate(candidate)}
                      isEngaged={engagedCandidate?.candidate_id === candidate.candidate_id}
                    />
                    
                    {engagedCandidate?.candidate_id === candidate.candidate_id && (
                      <EngagementPanel
                        candidate={candidate}
                        jdId={parsedJd.jd_id}
                        jdParsed={parsedJd}
                        onClose={handleCloseEngagement}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CandidateCard({ candidate, onEngage, isEngaged }) {
  const getScoreColor = (score) => {
    if (score >= 70) return 'bg-green-500'
    if (score >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getSeniorityFitColor = (fit) => {
    if (fit === 'good') return 'bg-green-500/20 text-green-400'
    if (fit === 'partial') return 'bg-yellow-500/20 text-yellow-400'
    return 'bg-red-500/20 text-red-400'
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{candidate.name}</h3>
          <p className="text-gray-400">{candidate.current_role}</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {candidate.location}
          </span>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
            {candidate.domain}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold">Match Score</span>
          <span className="text-lg font-bold">{candidate.match_score}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getScoreColor(candidate.match_score)}`}
            style={{ width: `${candidate.match_score}%` }}
          />
        </div>
      </div>

      {candidate.matched_skills?.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Matched Skills</h4>
          <div className="flex flex-wrap gap-2">
            {candidate.matched_skills.map((skill, idx) => (
              <span key={idx} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {candidate.missing_skills?.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Missing Skills</h4>
          <div className="flex flex-wrap gap-2">
            {candidate.missing_skills.map((skill, idx) => (
              <span key={idx} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <span className={`px-3 py-1 rounded-full text-sm ${getSeniorityFitColor(candidate.seniority_fit)}`}>
          Seniority: {candidate.seniority_fit}
        </span>
        <button
          onClick={onEngage}
          className={`px-4 py-2 ${isEngaged ? 'bg-gray-600' : 'bg-green-500 hover:bg-green-600'} text-white font-semibold rounded-lg transition-colors flex items-center`}
        >
          {isEngaged ? 'Engaged' : 'Engage Candidate →'}
        </button>
      </div>
    </div>
  )
}

function EngagementPanel({ candidate, jdId, jdParsed, onClose }) {
  const [conversation, setConversation] = useState([])
  const [loading, setLoading] = useState(false)
  const [turnCount, setTurnCount] = useState(0)
  const [conversationComplete, setConversationComplete] = useState(false)
  const [interestScore, setInterestScore] = useState(null)
  const [narrative, setNarrative] = useState(null)
  const [addedToShortlist, setAddedToShortlist] = useState(false)
  const [error, setError] = useState('')

  const handleSendMessage = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await API.post('/api/engage-candidate', {
        candidate_id: candidate.candidate_id,
        jd_id: jdId,
        conversation_history: conversation
      })

      const newConversation = response.data.conversation_history || []
      setConversation(newConversation)
      setTurnCount(response.data.turn_count || turnCount + 1)
      setConversationComplete(response.data.conversation_complete || false)

      // Auto-score after turn 3
      if (response.data.conversation_complete) {
        await handleScoreInterest(newConversation)
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to engage candidate')
    } finally {
      setLoading(false)
    }
  }

  const handleScoreInterest = async (convHistory = conversation) => {
    setLoading(true)
    setError('')

    try {
      const response = await API.post('/api/score-interest', {
        candidate_id: candidate.candidate_id,
        jd_id: jdId,
        conversation_history: convHistory
      })

      setInterestScore(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to score interest')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateNarrative = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await API.post('/api/generate-narrative', {
        candidate_id: candidate.candidate_id,
        jd_id: jdId,
        match_score: candidate.match_score,
        interest_score: interestScore.interest_score
      })

      setNarrative(response.data.narrative)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate narrative')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToShortlist = async () => {
    setLoading(true)
    setError('')

    try {
      await API.post('/api/add-to-shortlist', {
        candidate_id: candidate.candidate_id,
        jd_id: jdId,
        match_score: candidate.match_score,
        interest_score: interestScore.interest_score,
        narrative: narrative
      })

      // Show success
      setAddedToShortlist(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add to shortlist')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="mt-4 bg-gray-900 border-2 border-green-500 rounded-xl p-6 shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-green-400" />
          Engaging {candidate.name}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {/* Chat Area */}
      <div className="mb-4 max-h-96 overflow-y-auto space-y-3 bg-gray-950 rounded-lg p-4">
        {conversation.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Click "Send Message" to start the conversation</p>
        ) : (
          conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'agent' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'agent'
                    ? 'bg-gray-700 text-white'
                    : 'bg-green-800 text-white'
                }`}
              >
                <p className="text-xs font-semibold mb-1 opacity-70">
                  {msg.role === 'agent' ? 'Agent' : candidate.name}
                </p>
                <p>{msg.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Actions */}
      {!conversationComplete && (
        <button
          onClick={handleSendMessage}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Sending...
            </>
          ) : (
            'Send Message →'
          )}
        </button>
      )}

      {/* Interest Score */}
      {conversationComplete && interestScore && (
        <div className="mt-4 bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-400">Interest Score</span>
            <span className={`text-3xl font-bold ${getScoreColor(interestScore.interest_score)}`}>
              {interestScore.interest_score}%
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-2">{interestScore.reasoning}</p>

          {!narrative && (
            <button
              onClick={handleGenerateNarrative}
              disabled={loading}
              className="mt-4 w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Narrative
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Narrative */}
      {narrative && (
        <div className="mt-4 bg-green-900/30 border border-green-500 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-400 mb-2">Candidate Narrative</h4>
          <p className="text-sm text-gray-300 whitespace-pre-line">{narrative}</p>

          {!addedToShortlist ? (
            <button
              onClick={handleAddToShortlist}
              disabled={loading}
              className="mt-4 w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                'Add to Shortlist'
              )}
            </button>
          ) : (
            <div className="mt-4">
              <div className="bg-green-500/20 border border-green-500 rounded-lg p-3 mb-3 text-center">
                <p className="text-green-400 font-semibold">✅ Added to Shortlist</p>
              </div>
              <Link
                to="/shortlist"
                className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-colors text-center"
              >
                View Shortlist →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Scout
