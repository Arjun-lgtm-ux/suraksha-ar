import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Volume2, CheckCircle, XCircle, ArrowRight, RotateCcw, Award, AlertCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { mockGetQuestions, mockGetScenario } from '../lib/mockDb'
import { useAuth } from '../contexts/AuthContext'
import { useLang } from '../contexts/LanguageContext'
import { speak, isTTSSupported } from '../lib/voice'
import { issueCertificate } from '../lib/certificate'
import { assessmentRating } from '../lib/scoring'
import { SUPPORTED_LANGUAGES } from '../lib/i18n'
import { Navbar } from '../components/layout/Navbar'
import CompletionPopup from '../components/ui/CompletionPopup'

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export default function Assessment() {
  const { id: scenarioId } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { T, lang } = useLang()

  const [phase, setPhase] = useState('lang-pick') // lang-pick | question | result
  const [assessLang, setAssessLang] = useState(lang)
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [answers, setAnswers] = useState([])
  const [certId, setCertId] = useState(null)
  const [issuing, setIssuing] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [scenario, setScenario] = useState(null)
  const [attemptSeed, setAttemptSeed] = useState(() => Date.now())

  // Fetch questions — always fresh per attempt, never served from stale cache
  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions', scenarioId, attemptSeed],
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockGetQuestions(scenarioId).data ?? []
      const { data, error } = await supabase
        .from('assessment_questions')
        .select('*')
        .eq('scenario_id', scenarioId)
      if (error) throw error
      return data ?? []
    },
  })

  const [shuffledQuestions, setShuffledQuestions] = useState(null)

  /** Fisher-Yates shuffle — returns a new shuffled array */
  function shuffleArray(arr) {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  /**
   * Prepares randomized, jumbled questions:
   * 1. Shuffles all available questions in the question bank
   * 2. Takes 5 questions so every test session presents different questions
   * 3. Randomizes the A/B/C/D option ordering and updates correct_index accordingly
   */
  function prepareJumbledQuestions(rawQuestions) {
    if (!rawQuestions || !rawQuestions.length) return []
    const shuffledList = shuffleArray(rawQuestions)
    const selectedCount = Math.min(5, shuffledList.length)
    const picked = shuffledList.slice(0, selectedCount)

    return picked.map(q => {
      const numOptions = q.options_en?.length ?? 4
      const indices = Array.from({ length: numOptions }, (_, i) => i)
      const shuffledIndices = shuffleArray(indices)

      return {
        ...q,
        options_en: shuffledIndices.map(idx => q.options_en?.[idx]),
        options_hi: q.options_hi ? shuffledIndices.map(idx => q.options_hi?.[idx]) : undefined,
        options_sat: q.options_sat ? shuffledIndices.map(idx => q.options_sat?.[idx]) : undefined,
        correct_index: shuffledIndices.indexOf(q.correct_index),
      }
    })
  }

  /** Active questions list — shuffled on start/refresh, falls back to fetched order */
  const activeQuestions = shuffledQuestions ?? questions ?? []
  const currentQ = activeQuestions[qIndex]
  const totalQ = activeQuestions.length

  // Fetch scenario info
  useEffect(() => {
    async function fetchScenario() {
      if (!isSupabaseConfigured) {
        const { data } = mockGetScenario(scenarioId)
        setScenario(data)
      } else {
        const { data } = await supabase.from('scenarios').select('*').eq('id', scenarioId).single()
        setScenario(data)
      }
    }
    fetchScenario()
  }, [scenarioId])

  // Auto-generate fresh jumbled questions whenever questions data arrives or scenario changes
  useEffect(() => {
    if (questions && questions.length) {
      setShuffledQuestions(prepareJumbledQuestions(questions))
    }
  }, [questions])

  function handleStartAssessment() {
    const pool = (questions && questions.length) ? questions : (mockGetQuestions(scenarioId).data ?? [])
    if (!pool.length) return
    setShuffledQuestions(prepareJumbledQuestions(pool))
    setQIndex(0)
    setSelected(null)
    setShowFeedback(false)
    setAnswers([])
    setPhase('question')
  }

  function handleRetryAssessment() {
    setAttemptSeed(Date.now())
    const fresh = mockGetQuestions(scenarioId).data ?? questions ?? []
    if (fresh.length) {
      setShuffledQuestions(prepareJumbledQuestions(fresh))
    }
    setQIndex(0)
    setSelected(null)
    setShowFeedback(false)
    setAnswers([])
    setPhase('lang-pick')
  }

  function getQuestion(q) {
    if (assessLang === 'hi' && q.question_hi) return q.question_hi
    if (assessLang === 'sat' && q.question_sat) return q.question_sat
    return q.question_en
  }

  function getOptions(q) {
    if (assessLang === 'hi' && q.options_hi) return q.options_hi
    if (assessLang === 'sat' && q.options_sat) return q.options_sat
    return q.options_en ?? []
  }

  function getExplanation(q) {
    if (!q) return ''
    if (assessLang === 'sat' && q.explanation_sat) return q.explanation_sat
    if (assessLang === 'hi' && q.explanation_hi) return q.explanation_hi
    return q.explanation_en ?? ''
  }

  function handleListen() {
    if (!currentQ) return
    speak(getQuestion(currentQ), assessLang)
  }

  function handleSelect(idx) {
    if (showFeedback || selected !== null) return
    setSelected(idx)
    setShowFeedback(true)
  }

  function handleContinue() {
    const wasCorrect = selected === currentQ?.correct_index
    const newAnswers = [...answers, {
      questionId: currentQ.id,
      selectedIndex: selected,
      wasCorrect,
    }]
    setAnswers(newAnswers)
    setShowFeedback(false)
    setSelected(null)

    if (qIndex < totalQ - 1) {
      setQIndex(i => i + 1)
    } else {
      // Done — compute result
      finishAssessment(newAnswers)
    }
  }

  async function finishAssessment(finalAnswers) {
    setPhase('result')
    const correct = finalAnswers.filter(a => a.wasCorrect).length
    const passed = (correct / totalQ) >= 0.6

    if (passed && user) {
      setIssuing(true)
      try {
        const cert = await issueCertificate({
          userId: user.id,
          traineeName: profile?.full_name ?? 'Trainee',
          scenarioId,
          courseName: scenario?.title ?? 'Safety Training',
          score: Math.round((correct / totalQ) * 100),
          attemptId: crypto.randomUUID(),
        })
        setCertId(cert.id)
        setShowCompletion(true)
      } catch (err) {
        console.error('Certificate issue failed:', err)
      } finally {
        setIssuing(false)
      }
    }
  }

  const correctCount = answers.filter(a => a.wasCorrect).length
  const rating = totalQ > 0 ? assessmentRating(correctCount, totalQ) : null

  // ─── Phase: language picker ────────────────────────────────────────────────
  if (phase === 'lang-pick') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
        <Navbar />
        <main style={{ padding: `calc(var(--navbar-height) + 40px) var(--space-4) 40px`, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 460, textAlign: 'center' }}>
            <div style={{ fontSize: 52, marginBottom: 20 }}>📝</div>
            <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 8 }}>{T('assessmentTitle')}</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 32 }}>{T('chooseLanguage')}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {SUPPORTED_LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => setAssessLang(l.code)}
                  style={{
                    padding: '16px 24px',
                    border: `2px solid ${assessLang === l.code ? 'var(--color-brand)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    background: assessLang === l.code ? 'var(--color-brand-50)' : 'var(--color-surface)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 14,
                    fontSize: 'var(--text-base)', fontWeight: assessLang === l.code ? 700 : 500,
                    color: assessLang === l.code ? 'var(--color-brand)' : 'var(--color-text-primary)',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: 24 }}>{l.flag}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div>{l.nativeLabel}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 400, marginTop: 2 }}>
                      {l.code === 'sat' ? 'ᱚᱞ ᱪᱤᱠᱤ • ᱟᱲᱟᱝ ᱥᱟᱶᱛᱮ (Voice & Text)' : l.label}
                    </div>
                  </div>
                  {assessLang === l.code && <CheckCircle size={20} style={{ marginLeft: 'auto', color: 'var(--color-brand)' }} />}
                </button>
              ))}
            </div>

            <button
              className="btn btn-primary btn-lg btn-full"
              onClick={handleStartAssessment}
              disabled={isLoading || !questions?.length}
            >
              {isLoading ? <div className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> : <>Start Assessment <ArrowRight size={18} /></>}
            </button>
            {questions?.length === 0 && !isLoading && (
              <div className="alert alert-warning" style={{ marginTop: 16 }}>
                <AlertCircle size={14} />
                No questions available for this module yet.
              </div>
            )}
          </div>
        </main>
      </div>
    )
  }

  // ─── Phase: result ─────────────────────────────────────────────────────────
  if (phase === 'result') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
        <Navbar />
        {showCompletion && certId && (
          <CompletionPopup
            courseName={scenario?.title ?? 'Safety Training'}
            onViewCertificate={() => navigate(`/certificate/${certId}`)}
          />
        )}
        <main style={{ padding: `calc(var(--navbar-height) + 32px) var(--space-4) 48px`, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>
              {rating?.passed ? '🎉' : '📚'}
            </div>
            <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 8 }}>{T('assessmentResult')}</h1>
            <div style={{
              background: rating?.bg, border: `2px solid ${rating?.color}30`,
              borderRadius: 'var(--radius-xl)', padding: '28px 24px', marginBottom: 24,
            }}>
              <p style={{ fontSize: '3rem', fontWeight: 900, color: rating?.color, lineHeight: 1 }}>
                {correctCount}/{totalQ}
              </p>
              <p style={{ fontWeight: 700, color: rating?.color, marginTop: 8 }}>{rating?.label}</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: 4 }}>
                {T('passingScore')}
              </p>
              <div style={{ marginTop: 16 }}>
                <div className="progress-bar">
                  <div className="progress-bar-fill success" style={{ width: `${(correctCount / totalQ) * 100}%`, background: rating?.color }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {issuing && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                  <div className="spinner spinner-sm" /> Generating certificate…
                </div>
              )}
              {rating?.passed && certId && (
                <button className="btn btn-success btn-lg btn-full" onClick={() => navigate(`/certificate/${certId}`)}>
                  <Award size={18} /> {T('viewCertificate')}
                </button>
              )}
              {!rating?.passed && (
                <button className="btn btn-primary btn-lg btn-full" onClick={handleRetryAssessment}>
                  <RotateCcw size={16} /> {T('retryAssessment')}
                </button>
              )}
              <button className="btn btn-ghost btn-full" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ─── Phase: question ───────────────────────────────────────────────────────
  if (isLoading || !currentQ) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    )
  }

  const options = getOptions(currentQ)
  const wasCorrect = selected === currentQ.correct_index

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <main style={{ padding: `calc(var(--navbar-height) + 24px) var(--space-4) 48px`, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>

          {/* Progress */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                {T('questionOf', String(qIndex + 1), String(totalQ))}
              </span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-brand)' }}>
                {assessLang.toUpperCase()}
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${((qIndex + 1) / totalQ) * 100}%` }} />
            </div>
          </div>

          {/* Question */}
          <div className="card animate-slide-up" key={qIndex} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
              <p style={{ fontSize: 'var(--text-lg)', fontWeight: 600, lineHeight: 1.5, flex: 1 }}>
                {getQuestion(currentQ)}
              </p>
              {isTTSSupported(assessLang) && (
                <button onClick={handleListen} className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>
                  <Volume2 size={16} /> {T('listenQuestion')}
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {options.map((opt, i) => {
                let cls = 'answer-option'
                if (showFeedback && selected === i) cls += i === currentQ.correct_index ? ' correct' : ' incorrect'
                if (showFeedback && i === currentQ.correct_index && selected !== i) cls += ' correct'
                return (
                  <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={showFeedback}>
                    <span className="option-label">{OPTION_LABELS[i]}</span>
                    <span style={{ flex: 1, textAlign: 'left' }}>{opt}</span>
                    {showFeedback && i === currentQ.correct_index && <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />}
                    {showFeedback && selected === i && i !== currentQ.correct_index && <XCircle size={18} style={{ color: 'var(--color-error)' }} />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Feedback panel */}
          {showFeedback && (
            <div className={`alert animate-slide-up ${wasCorrect ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 16, flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {wasCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
                <strong>{wasCorrect ? T('correct') : T('incorrect')}</strong>
              </div>
              {!wasCorrect && (
                <p style={{ fontSize: 'var(--text-sm)' }}>
                  <strong>{T('correctAnswer')}:</strong> {options[currentQ.correct_index]}
                </p>
              )}
              <p style={{ fontSize: 'var(--text-sm)' }}>
                <strong>{T('explanation')}:</strong>{' '}
                {getExplanation(currentQ)}
              </p>
            </div>
          )}

          {showFeedback && (
            <button className="btn btn-primary btn-lg btn-full" onClick={handleContinue}>
              {qIndex < totalQ - 1 ? T('nextQuestion') : T('submitAnswer')}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
