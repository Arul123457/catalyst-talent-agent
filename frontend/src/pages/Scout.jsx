import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, X, Briefcase, MapPin, Sparkles, MessageSquare, ArrowRight, FileText } from 'lucide-react';
import API from '../api/client';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Avatar from '../components/Avatar';
import { Textarea } from '../components/Input';
import Reveal from '../components/Reveal';

function Scout() {
  const [state, setState] = useState('input'); // 'input' | 'matching' | 'results'
  const [jdText, setJdText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [parsedJd, setParsedJd] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [engagedCandidate, setEngagedCandidate] = useState(null);

  const handleParseAndMatch = async () => {
    if (!jdText.trim()) {
      setError('Please paste a job description');
      return;
    }

    setError('');
    setLoading(true);
    setState('matching');

    try {
      // Step 1: Parse JD
      const parseResponse = await API.post('/api/parse-jd', { jd_text: jdText });
      setParsedJd(parseResponse.data);
      
      // Save jd_id to localStorage
      localStorage.setItem('current_jd_id', parseResponse.data.jd_id);

      // Step 2: Match candidates
      const matchResponse = await API.post('/api/match-candidates', { 
        jd_id: parseResponse.data.jd_id 
      });
      setCandidates(matchResponse.data.candidates || []);
      
      setState('results');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process job description');
      setState('input');
    } finally {
      setLoading(false);
    }
  };

  const handleNewJd = () => {
    setState('input');
    setJdText('');
    setParsedJd(null);
    setCandidates([]);
    setEngagedCandidate(null);
    setError('');
  };

  const handleEngageCandidate = (candidate) => {
    setEngagedCandidate(candidate);
  };

  const handleCloseEngagement = () => {
    setEngagedCandidate(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white py-8 px-4">
      {/* STATE 1: Input Form */}
      {state === 'input' && (
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-8">
              <Badge variant="primary" dot size="md" className="mb-4">
                AI-Powered Scouting
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="text-white">Paste Your </span>
                <span className="text-gradient">Job Description</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Our AI will parse requirements, match candidates, and rank them by fit
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Job Description</h2>
                  <p className="text-sm text-gray-400">Paste the full text below</p>
                </div>
              </div>

              <Textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the full job description here...

Example:
We're looking for a Senior Full-Stack Engineer with 5+ years of experience in React, Node.js, and AWS. You'll be building scalable SaaS products..."
                className="min-h-[300px] font-mono text-sm"
                rows={12}
              />

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button
                onClick={handleParseAndMatch}
                loading={loading}
                variant="primary"
                size="lg"
                icon={Sparkles}
                className="w-full mt-6"
              >
                {loading ? 'Processing...' : 'Parse & Scout Candidates'}
              </Button>
            </Card>
          </Reveal>
        </div>
      )}

      {/* STATE 2: Loading */}
      {state === 'matching' && (
        <div className="max-w-3xl mx-auto text-center py-20">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-12 h-12 text-green-400 animate-spin" />
            </div>
            <div className="absolute inset-0 bg-green-400 blur-3xl opacity-20 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Analyzing Job Description</h2>
          <p className="text-gray-400 mb-8">
            Extracting requirements and matching candidates using AI...
          </p>
          <div className="flex flex-col gap-2 max-w-md mx-auto">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Parsing job requirements</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <span>Generating semantic embeddings</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              <span>Ranking candidates by match score</span>
            </div>
          </div>
        </div>
      )}

      {/* STATE 3: Results */}
      {state === 'results' && parsedJd && (
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT COLUMN: JD Summary */}
            <div className="lg:w-1/3">
              <div className="lg:sticky lg:top-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Job Summary</h2>
                    <Button
                      onClick={handleNewJd}
                      variant="ghost"
                      size="sm"
                    >
                      New JD
                    </Button>
                  </div>

                  <h3 className="text-2xl font-bold mb-4">{parsedJd.role_title}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="primary" size="sm">{parsedJd.domain}</Badge>
                    <Badge variant="info" size="sm">{parsedJd.seniority}</Badge>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {parsedJd.required_skills?.map((skill, idx) => (
                        <Badge key={idx} variant="success" size="sm">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  {parsedJd.nice_to_have?.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-400 mb-3">Nice to Have</h4>
                      <div className="flex flex-wrap gap-2">
                        {parsedJd.nice_to_have.map((skill, idx) => (
                          <Badge key={idx} variant="muted" size="sm">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {parsedJd.culture_signals?.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-400 mb-3">Culture Signals</h4>
                      <div className="flex flex-wrap gap-2">
                        {parsedJd.culture_signals.map((signal, idx) => (
                          <Badge key={idx} variant="warning" size="sm">{signal}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-gray-700">
                    <p className="text-sm text-gray-400 leading-relaxed">{parsedJd.role_summary}</p>
                  </div>
                </Card>
              </div>
            </div>

            {/* RIGHT COLUMN: Candidates */}
            <div className="lg:w-2/3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  {candidates.length} Candidate{candidates.length !== 1 ? 's' : ''} Found
                </h2>
                <p className="text-gray-400">Ranked by AI match score</p>
              </div>

              <div className="space-y-4">
                {candidates.map((candidate, index) => (
                  <Reveal key={candidate.candidate_id} delay={index * 50}>
                    <div>
                      <CandidateCard
                        candidate={candidate}
                        rank={index + 1}
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
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CandidateCard({ candidate, rank, onEngage, isEngaged }) {
  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400 bg-green-500';
    if (score >= 50) return 'text-yellow-400 bg-yellow-500';
    return 'text-red-400 bg-red-500';
  };

  const getSeniorityFitVariant = (fit) => {
    if (fit === 'good') return 'success';
    if (fit === 'partial') return 'warning';
    return 'danger';
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <Card hover={!isEngaged} className={`p-6 ${isEngaged ? 'border-green-500/50' : ''}`}>
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <Avatar name={candidate.name} size="lg" />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 border-2 border-gray-700 rounded-full flex items-center justify-center text-xs font-bold">
            {getRankEmoji(rank)}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold mb-1">{candidate.name}</h3>
          <p className="text-gray-400 mb-2">{candidate.current_role}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="muted" size="sm">
              <MapPin className="w-3 h-3 mr-1" />
              {candidate.location}
            </Badge>
            <Badge variant="info" size="sm">{candidate.domain}</Badge>
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold mb-1">
            <span className={getScoreColor(candidate.match_score).split(' ')[0]}>
              {candidate.match_score}%
            </span>
          </div>
          <div className="text-xs text-gray-400">Match Score</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full ${getScoreColor(candidate.match_score).split(' ')[1]} transition-all`}
            style={{ width: `${candidate.match_score}%` }}
          />
        </div>
      </div>

      {candidate.matched_skills?.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Matched Skills</h4>
          <div className="flex flex-wrap gap-2">
            {candidate.matched_skills.map((skill, idx) => (
              <Badge key={idx} variant="success" size="sm">{skill}</Badge>
            ))}
          </div>
        </div>
      )}

      {candidate.missing_skills?.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Missing Skills</h4>
          <div className="flex flex-wrap gap-2">
            {candidate.missing_skills.map((skill, idx) => (
              <Badge key={idx} variant="danger" size="sm">{skill}</Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <Badge variant={getSeniorityFitVariant(candidate.seniority_fit)} size="sm">
          Seniority: {candidate.seniority_fit}
        </Badge>
        <Button
          onClick={onEngage}
          variant={isEngaged ? 'ghost' : 'primary'}
          size="sm"
          icon={MessageSquare}
        >
          {isEngaged ? 'Engaged' : 'Engage Candidate'}
        </Button>
      </div>
    </Card>
  );
}

function EngagementPanel({ candidate, jdId, jdParsed, onClose }) {
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [conversationComplete, setConversationComplete] = useState(false);
  const [interestScore, setInterestScore] = useState(null);
  const [narrative, setNarrative] = useState(null);
  const [addedToShortlist, setAddedToShortlist] = useState(false);
  const [error, setError] = useState('');

  const handleSendMessage = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await API.post('/api/engage-candidate', {
        candidate_id: candidate.candidate_id,
        jd_id: jdId,
        conversation_history: conversation
      });

      const newConversation = response.data.conversation_history || [];
      setConversation(newConversation);
      setTurnCount(response.data.turn_count || turnCount + 1);
      setConversationComplete(response.data.conversation_complete || false);

      if (response.data.conversation_complete) {
        await handleScoreInterest(newConversation);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to engage candidate');
    } finally {
      setLoading(false);
    }
  };

  const handleScoreInterest = async (convHistory = conversation) => {
    setLoading(true);
    setError('');

    try {
      const response = await API.post('/api/score-interest', {
        candidate_id: candidate.candidate_id,
        jd_id: jdId,
        conversation_history: convHistory
      });

      setInterestScore(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to score interest');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNarrative = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await API.post('/api/generate-narrative', {
        candidate_id: candidate.candidate_id,
        jd_id: jdId,
        match_score: candidate.match_score,
        interest_score: interestScore.interest_score
      });

      setNarrative(response.data.narrative);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate narrative');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToShortlist = async () => {
    setLoading(true);
    setError('');

    try {
      await API.post('/api/add-to-shortlist', {
        candidate_id: candidate.candidate_id,
        jd_id: jdId,
        match_score: candidate.match_score,
        interest_score: interestScore.interest_score,
        narrative: narrative
      });

      setAddedToShortlist(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add to shortlist');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="mt-4 p-6 border-2 border-green-500/50 bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold">AI Engagement</h3>
            <p className="text-sm text-gray-400">Assessing interest and cultural fit</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Chat Area */}
      <div className="mb-4 max-h-96 overflow-y-auto space-y-3 bg-gray-950 rounded-xl p-4 border border-gray-800">
        {conversation.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">Click "Send Message" to start the conversation</p>
          </div>
        ) : (
          conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'agent' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-xl ${
                  msg.role === 'agent'
                    ? 'bg-gray-800 text-white'
                    : 'bg-green-500/20 text-white border border-green-500/30'
                }`}
              >
                <p className="text-xs font-semibold mb-1 opacity-70">
                  {msg.role === 'agent' ? 'AI Agent' : candidate.name}
                </p>
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Actions */}
      {!conversationComplete && (
        <Button
          onClick={handleSendMessage}
          loading={loading}
          variant="primary"
          size="md"
          icon={ArrowRight}
          iconPosition="right"
          className="w-full"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </Button>
      )}

      {/* Interest Score */}
      {conversationComplete && interestScore && (
        <Card className="p-4 bg-gray-800 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-400">Interest Score</span>
            <span className={`text-3xl font-bold ${getScoreColor(interestScore.interest_score)}`}>
              {interestScore.interest_score}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${interestScore.interest_score}%` }}
            />
          </div>
          <p className="text-sm text-gray-400">{interestScore.reasoning}</p>

          {!narrative && (
            <Button
              onClick={handleGenerateNarrative}
              loading={loading}
              variant="outline"
              size="sm"
              icon={Sparkles}
              className="w-full mt-4"
            >
              {loading ? 'Generating...' : 'Generate Narrative'}
            </Button>
          )}
        </Card>
      )}

      {/* Narrative */}
      {narrative && (
        <Card className="p-4 bg-green-500/10 border border-green-500/30 mb-4">
          <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Candidate Narrative
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line mb-4">{narrative}</p>

          {!addedToShortlist ? (
            <Button
              onClick={handleAddToShortlist}
              loading={loading}
              variant="primary"
              size="md"
              className="w-full"
            >
              {loading ? 'Adding...' : 'Add to Shortlist'}
            </Button>
          ) : (
            <div>
              <div className="bg-green-500/20 border border-green-500 rounded-lg p-3 mb-3 text-center">
                <p className="text-green-400 font-semibold">✓ Added to Shortlist</p>
              </div>
              <Link to="/shortlist">
                <Button variant="primary" size="md" className="w-full">
                  View Shortlist
                </Button>
              </Link>
            </div>
          )}
        </Card>
      )}
    </Card>
  );
}

export default Scout;
