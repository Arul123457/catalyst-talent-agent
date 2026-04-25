import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { List, Download, Loader2, X, TrendingUp, Target, MessageSquare } from 'lucide-react'
import API from '../api/client'

function Shortlist() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const [state, setState] = useState('loading') // 'loading' | 'empty' | 'results'
  const [shortlist, setShortlist] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedNarrative, setSelectedNarrative] = useState(null)
  const [regeneratingId, setRegeneratingId] = useState(null)

  useEffect(() => {
    loadShortlist()
  }, [])

  const loadShortlist = async () => {
    // Check URL params first, then localStorage
    const jdIdFromUrl = searchParams.get('jd_id')
    const jdIdFromStorage = localStorage.getItem('current_jd_id')
    const jdId = jdIdFromUrl || jdIdFromStorage

    if (!jdId) {
      setState('empty')
      return
    }

    setLoading(true)
    setState('loading')

    try {
      const response = await API.get(`/api/shortlist/${jdId}`)
      const candidates = response.data.shortlist || []
      
      if (candidates.length === 0) {
        setState('empty')
      } else {
        setShortlist(candidates)
        setState('results')
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load shortlist')
      setState('empty')
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    const headers = ['Rank', 'Name', 'Role', 'Location', 'Match Score', 'Interest Score', 'Combined Score', 'Next Step', 'Narrative']
    const rows = shortlist.map((candidate, idx) => [
      idx + 1,
      candidate.name || '',
      candidate.current_role || '',
      candidate.location || '',
      candidate.match_score?.toFixed(1) || '0',
      candidate.interest_score?.toFixed(1) || '0',
      candidate.combined_score?.toFixed(1) || '0',
      candidate.next_step || '',
      `"${(candidate.narrative || '').replace(/"/g, '""')}"` // Escape quotes
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'talent-shortlist.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleRegenerateNarrative = async (candidate) => {
    setRegeneratingId(candidate.candidate_id)
    setError('')

    try {
      const response = await API.post('/api/generate-narrative', {
        candidate_id: candidate.candidate_id,
        jd_id: candidate.jd_id,
        match_score: candidate.match_score,
        interest_score: candidate.interest_score
      })

      // Update the shortlist with new narrative
      setShortlist(prev => prev.map(c => 
        c.candidate_id === candidate.candidate_id 
          ? { ...c, narrative: response.data.narrative }
          : c
      ))
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to regenerate narrative')
    } finally {
      setRegeneratingId(null)
    }
  }

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return rank
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400 bg-green-500'
    if (score >= 50) return 'text-yellow-400 bg-yellow-500'
    return 'text-red-400 bg-red-500'
  }

  const getCombinedScoreColor = (score) => {
    if (score >= 75) return 'text-green-400'
    if (score >= 55) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getNextStepColor = (step) => {
    if (step === 'Schedule Interview') return 'bg-green-500/20 text-green-400'
    if (step === 'Send Assignment') return 'bg-blue-500/20 text-blue-400'
    if (step === 'Nurture') return 'bg-yellow-500/20 text-yellow-400'
    if (step === 'Pass') return 'bg-red-500/20 text-red-400'
    return 'bg-gray-500/20 text-gray-400'
  }

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin w-16 h-16 text-green-400 mx-auto mb-4" />
          <p className="text-xl text-gray-400">Loading shortlist...</p>
        </div>
      </div>
    )
  }

  if (state === 'empty') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="bg-gray-800 rounded-xl p-12 text-center max-w-md">
          <List className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No shortlist yet</h2>
          <p className="text-gray-400 mb-6">
            Go to Scout page, engage candidates and add them to shortlist
          </p>
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
          <button
            onClick={() => navigate('/scout')}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Go to Scout →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Ranked Shortlist</h1>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
              {shortlist.length} {shortlist.length === 1 ? 'Candidate' : 'Candidates'}
            </span>
          </div>
          <button
            onClick={handleExportCSV}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full bg-gray-800 rounded-xl overflow-hidden">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Rank</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Candidate</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Match</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Interest</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Combined</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Narrative</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Next Step</th>
              </tr>
            </thead>
            <tbody>
              {shortlist.map((candidate, idx) => (
                <tr key={candidate.candidate_id} className="border-t border-gray-700 hover:bg-gray-750">
                  <td className="px-4 py-4 text-2xl">
                    {getRankEmoji(idx + 1)}
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-bold">{candidate.name}</p>
                      <p className="text-sm text-gray-400">{candidate.current_role}</p>
                      <p className="text-xs text-gray-500">{candidate.location}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className={`font-semibold mb-1 ${getScoreColor(candidate.match_score).split(' ')[0]}`}>
                        {candidate.match_score?.toFixed(1)}%
                      </p>
                      <div className="w-20 bg-gray-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${getScoreColor(candidate.match_score).split(' ')[1]}`}
                          style={{ width: `${candidate.match_score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className={`font-semibold mb-1 ${getScoreColor(candidate.interest_score).split(' ')[0]}`}>
                        {candidate.interest_score?.toFixed(1)}%
                      </p>
                      <div className="w-20 bg-gray-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${getScoreColor(candidate.interest_score).split(' ')[1]}`}
                          style={{ width: `${candidate.interest_score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className={`text-2xl font-bold ${getCombinedScoreColor(candidate.combined_score)}`}>
                      {candidate.combined_score?.toFixed(1)}
                    </p>
                  </td>
                  <td className="px-4 py-4 max-w-xs">
                    <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                      {candidate.narrative?.substring(0, 100)}...
                    </p>
                    <button
                      onClick={() => setSelectedNarrative(candidate)}
                      className="text-green-400 hover:text-green-300 text-sm font-semibold"
                    >
                      View Full
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getNextStepColor(candidate.next_step)}`}>
                        {candidate.next_step}
                      </span>
                      <button
                        onClick={() => handleRegenerateNarrative(candidate)}
                        disabled={regeneratingId === candidate.candidate_id}
                        className="block mt-2 text-xs text-gray-400 hover:text-green-400 disabled:text-gray-600"
                      >
                        {regeneratingId === candidate.candidate_id ? 'Regenerating...' : 'Regenerate Narrative'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {shortlist.map((candidate, idx) => (
            <div key={candidate.candidate_id} className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getRankEmoji(idx + 1)}</span>
                  <div>
                    <h3 className="font-bold text-lg">{candidate.name}</h3>
                    <p className="text-sm text-gray-400">{candidate.current_role}</p>
                    <p className="text-xs text-gray-500">{candidate.location}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Match</p>
                  <p className={`text-xl font-bold ${getScoreColor(candidate.match_score).split(' ')[0]}`}>
                    {candidate.match_score?.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Interest</p>
                  <p className={`text-xl font-bold ${getScoreColor(candidate.interest_score).split(' ')[0]}`}>
                    {candidate.interest_score?.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Combined</p>
                  <p className={`text-xl font-bold ${getCombinedScoreColor(candidate.combined_score)}`}>
                    {candidate.combined_score?.toFixed(1)}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-300 line-clamp-3 mb-2">
                  {candidate.narrative}
                </p>
                <button
                  onClick={() => setSelectedNarrative(candidate)}
                  className="text-green-400 hover:text-green-300 text-sm font-semibold"
                >
                  View Full Narrative
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getNextStepColor(candidate.next_step)}`}>
                  {candidate.next_step}
                </span>
                <button
                  onClick={() => handleRegenerateNarrative(candidate)}
                  disabled={regeneratingId === candidate.candidate_id}
                  className="text-xs text-gray-400 hover:text-green-400 disabled:text-gray-600"
                >
                  {regeneratingId === candidate.candidate_id ? 'Regenerating...' : 'Regenerate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Narrative Modal */}
      {selectedNarrative && (
        <NarrativeModal
          candidate={selectedNarrative}
          onClose={() => setSelectedNarrative(null)}
        />
      )}
    </div>
  )
}

function NarrativeModal({ candidate, onClose }) {
  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getCombinedScoreColor = (score) => {
    if (score >= 75) return 'text-green-400'
    if (score >= 55) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getNextStepColor = (step) => {
    if (step === 'Schedule Interview') return 'bg-green-500/20 text-green-400'
    if (step === 'Send Assignment') return 'bg-blue-500/20 text-blue-400'
    if (step === 'Nurture') return 'bg-yellow-500/20 text-yellow-400'
    if (step === 'Pass') return 'bg-red-500/20 text-red-400'
    return 'bg-gray-500/20 text-gray-400'
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-1">{candidate.name}</h2>
            <p className="text-gray-400">{candidate.current_role}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Scores */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <p className="text-xs text-gray-400 mb-1">Match Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(candidate.match_score)}`}>
                {candidate.match_score?.toFixed(1)}%
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <p className="text-xs text-gray-400 mb-1">Interest Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(candidate.interest_score)}`}>
                {candidate.interest_score?.toFixed(1)}%
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <p className="text-xs text-gray-400 mb-1">Combined</p>
              <p className={`text-2xl font-bold ${getCombinedScoreColor(candidate.combined_score)}`}>
                {candidate.combined_score?.toFixed(1)}
              </p>
            </div>
          </div>

          {/* Next Step */}
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-2">Recommended Next Step</p>
            <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${getNextStepColor(candidate.next_step)}`}>
              {candidate.next_step}
            </span>
          </div>

          {/* Full Narrative */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Candidate Narrative</h3>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                {candidate.narrative}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shortlist
