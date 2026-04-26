import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { List, Download, Loader2, X, TrendingUp, Target, MessageSquare, Sparkles, ArrowLeft } from 'lucide-react';
import API from '../api/client';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Avatar from '../components/Avatar';
import Reveal from '../components/Reveal';

function Shortlist() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [state, setState] = useState('loading'); // 'loading' | 'empty' | 'results'
  const [shortlist, setShortlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedNarrative, setSelectedNarrative] = useState(null);
  const [regeneratingId, setRegeneratingId] = useState(null);

  useEffect(() => {
    loadShortlist();
  }, []);

  const loadShortlist = async () => {
    const jdIdFromUrl = searchParams.get('jd_id');
    const jdIdFromStorage = localStorage.getItem('current_jd_id');
    const jdId = jdIdFromUrl || jdIdFromStorage;

    if (!jdId) {
      setState('empty');
      return;
    }

    setLoading(true);
    setState('loading');

    try {
      const response = await API.get(`/api/shortlist/${jdId}`);
      const candidates = response.data.shortlist || [];
      
      if (candidates.length === 0) {
        setState('empty');
      } else {
        setShortlist(candidates);
        setState('results');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load shortlist');
      setState('empty');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Rank', 'Name', 'Role', 'Location', 'Match Score', 'Interest Score', 'Combined Score', 'Next Step', 'Narrative'];
    const rows = shortlist.map((candidate, idx) => [
      idx + 1,
      candidate.name || '',
      candidate.current_role || '',
      candidate.location || '',
      candidate.match_score?.toFixed(1) || '0',
      candidate.interest_score?.toFixed(1) || '0',
      candidate.combined_score?.toFixed(1) || '0',
      candidate.next_step || '',
      `"${(candidate.narrative || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `talent-shortlist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRegenerateNarrative = async (candidate) => {
    setRegeneratingId(candidate.candidate_id);
    setError('');

    try {
      const response = await API.post('/api/generate-narrative', {
        candidate_id: candidate.candidate_id,
        jd_id: candidate.jd_id,
        match_score: candidate.match_score,
        interest_score: candidate.interest_score
      });

      setShortlist(prev => prev.map(c => 
        c.candidate_id === candidate.candidate_id 
          ? { ...c, narrative: response.data.narrative }
          : c
      ));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to regenerate narrative');
    } finally {
      setRegeneratingId(null);
    }
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400 bg-green-500';
    if (score >= 50) return 'text-yellow-400 bg-yellow-500';
    return 'text-red-400 bg-red-500';
  };

  const getCombinedScoreColor = (score) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 55) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getNextStepVariant = (step) => {
    if (step === 'Schedule Interview') return 'success';
    if (step === 'Send Assignment') return 'info';
    if (step === 'Nurture') return 'warning';
    if (step === 'Pass') return 'danger';
    return 'muted';
  };

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-10 h-10 text-green-400 animate-spin" />
            </div>
            <div className="absolute inset-0 bg-green-400 blur-3xl opacity-20 animate-pulse" />
          </div>
          <p className="text-xl text-gray-400">Loading shortlist...</p>
        </div>
      </div>
    );
  }

  if (state === 'empty') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <Card className="p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <List className="w-10 h-10 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No shortlist yet</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Go to Scout page, engage candidates and add them to your shortlist
          </p>
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          <Button
            onClick={() => navigate('/scout')}
            variant="primary"
            size="lg"
            icon={ArrowLeft}
          >
            Go to Scout
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">Ranked Shortlist</h1>
                <Badge variant="primary" size="lg">
                  {shortlist.length} {shortlist.length === 1 ? 'Candidate' : 'Candidates'}
                </Badge>
              </div>
              <p className="text-gray-400">Sorted by combined match and interest scores</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate('/scout')}
                variant="ghost"
                size="md"
                icon={ArrowLeft}
                iconPosition="left"
              >
                Back to Scout
              </Button>
              <Button
                onClick={handleExportCSV}
                variant="primary"
                size="md"
                icon={Download}
              >
                Export CSV
              </Button>
            </div>
          </div>
        </Reveal>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden lg:block">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Candidate</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Match</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Interest</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Combined</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Narrative</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Next Step</th>
                  </tr>
                </thead>
                <tbody>
                  {shortlist.map((candidate, idx) => (
                    <Reveal key={candidate.candidate_id} delay={idx * 30}>
                      <tr className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-2xl">{getRankEmoji(idx + 1)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={candidate.name} size="md" />
                            <div>
                              <p className="font-bold text-white">{candidate.name}</p>
                              <p className="text-sm text-gray-400">{candidate.current_role}</p>
                              <p className="text-xs text-gray-500">{candidate.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className={`font-semibold mb-2 ${getScoreColor(candidate.match_score).split(' ')[0]}`}>
                              {candidate.match_score?.toFixed(1)}%
                            </p>
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getScoreColor(candidate.match_score).split(' ')[1]}`}
                                style={{ width: `${candidate.match_score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className={`font-semibold mb-2 ${getScoreColor(candidate.interest_score).split(' ')[0]}`}>
                              {candidate.interest_score?.toFixed(1)}%
                            </p>
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getScoreColor(candidate.interest_score).split(' ')[1]}`}
                                style={{ width: `${candidate.interest_score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`text-3xl font-bold ${getCombinedScoreColor(candidate.combined_score)}`}>
                            {candidate.combined_score?.toFixed(1)}
                          </p>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                            {candidate.narrative?.substring(0, 100)}...
                          </p>
                          <button
                            onClick={() => setSelectedNarrative(candidate)}
                            className="text-green-400 hover:text-green-300 text-sm font-semibold transition-colors"
                          >
                            View Full →
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={getNextStepVariant(candidate.next_step)} size="sm" className="mb-2">
                            {candidate.next_step}
                          </Badge>
                          <button
                            onClick={() => handleRegenerateNarrative(candidate)}
                            disabled={regeneratingId === candidate.candidate_id}
                            className="block text-xs text-gray-400 hover:text-green-400 disabled:text-gray-600 transition-colors"
                          >
                            {regeneratingId === candidate.candidate_id ? (
                              <span className="flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Regenerating...
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Regenerate
                              </span>
                            )}
                          </button>
                        </td>
                      </tr>
                    </Reveal>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {shortlist.map((candidate, idx) => (
            <Reveal key={candidate.candidate_id} delay={idx * 50}>
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{getRankEmoji(idx + 1)}</div>
                    <Avatar name={candidate.name} size="md" />
                    <div>
                      <h3 className="font-bold text-lg text-white">{candidate.name}</h3>
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
                    className="text-green-400 hover:text-green-300 text-sm font-semibold transition-colors"
                  >
                    View Full Narrative →
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <Badge variant={getNextStepVariant(candidate.next_step)} size="sm">
                    {candidate.next_step}
                  </Badge>
                  <button
                    onClick={() => handleRegenerateNarrative(candidate)}
                    disabled={regeneratingId === candidate.candidate_id}
                    className="text-xs text-gray-400 hover:text-green-400 disabled:text-gray-600 transition-colors flex items-center gap-1"
                  >
                    {regeneratingId === candidate.candidate_id ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        Regenerate
                      </>
                    )}
                  </button>
                </div>
              </Card>
            </Reveal>
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
  );
}

function NarrativeModal({ candidate, onClose }) {
  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCombinedScoreColor = (score) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 55) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getNextStepVariant = (step) => {
    if (step === 'Schedule Interview') return 'success';
    if (step === 'Send Assignment') return 'info';
    if (step === 'Nurture') return 'warning';
    if (step === 'Pass') return 'danger';
    return 'muted';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Avatar name={candidate.name} size="lg" />
            <div>
              <h2 className="text-2xl font-bold mb-1">{candidate.name}</h2>
              <p className="text-gray-400">{candidate.current_role}</p>
            </div>
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
            <Card className="p-4 text-center bg-gray-900">
              <Target className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <p className="text-xs text-gray-400 mb-1">Match Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(candidate.match_score)}`}>
                {candidate.match_score?.toFixed(1)}%
              </p>
            </Card>
            <Card className="p-4 text-center bg-gray-900">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <p className="text-xs text-gray-400 mb-1">Interest Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(candidate.interest_score)}`}>
                {candidate.interest_score?.toFixed(1)}%
              </p>
            </Card>
            <Card className="p-4 text-center bg-gray-900">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <p className="text-xs text-gray-400 mb-1">Combined</p>
              <p className={`text-2xl font-bold ${getCombinedScoreColor(candidate.combined_score)}`}>
                {candidate.combined_score?.toFixed(1)}
              </p>
            </Card>
          </div>

          {/* Next Step */}
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-2">Recommended Next Step</p>
            <Badge variant={getNextStepVariant(candidate.next_step)} size="md">
              {candidate.next_step}
            </Badge>
          </div>

          {/* Full Narrative */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-400" />
              Candidate Narrative
            </h3>
            <Card className="p-4 bg-gray-900">
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                {candidate.narrative}
              </p>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Shortlist;
