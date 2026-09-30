import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  CheckCircle, XCircle, Clock, Trophy, AlertTriangle,
  RefreshCw, LayoutDashboard, Lightbulb, Award,
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { mockGetSession, mockGetFeedbackLogs } from '../lib/mockDb'
import { Navbar } from '../components/layout/Navbar'
import { scoreRating, generateFeedbackTips } from '../lib/scoring'
import { useLang } from '../contexts/LanguageContext'

function fmtTime(ms) {
  if (!ms) return '—'
  const s = Math.round(ms / 1000)
  return s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`
}

export default function Results() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { T } = useLang()
  const passedState = location.state

  const { data: sessionData, isLoading } = useQuery({
    queryKey: ['session-result', sessionId],
    enabled: !!sessionId && !passedState?.score,
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        const { data: sess } = mockGetSession(sessionId)
        const { data: logs } = mockGetFeedbackLogs(sessionId)
        return { session: sess, logs: logs ?? [] }
      }
      const { data: sess, error } = await supabase
        .from('training_sessions').select('*, scenarios(*)').eq('id', sessionId).single()
      if (error) throw error
      const { data: logs } = await supabase
        .from('feedback_logs').select('*').eq('session_id', sessionId).order('step_index')
      return { session: sess, logs: logs ?? [] }
    },
  })

  const score      = passedState?.score ?? sessionData?.session?.score ?? 0
  const breakdown  = passedState?.breakdown ?? null
  const scenario   = passedState?.scenario ?? sessionData?.session?.scenarios
  const allLogs    = passedState?.allLogs ?? sessionData?.logs ?? []
  const totalTimeMs = passedState?.totalTime ?? sessionData?.session?.reaction_time_ms
  const rating = scoreRating(score)
  const PASS_THRESHOLD = 63 // ~60% of 105

  const tips = scenario ? generateFeedbackTips(
    breakdown ?? { missedSteps: allLogs.filter(l => !l.was_correct).length, timePenalty: 0, allPPECorrect: allLogs.filter(l => l.is_ppe_step).every(l => l.was_correct) },
    scenario.hazard_type ?? 'hazard'
  ) : []

  if (isLoading && !passedState) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--navbar-height) + 24px)', paddingBottom: 48 }}>
        <div className="page-container" style={{ maxWidth: 700 }}>

          {/* Score hero */}
          <div className="card animate-fade-in" style={{
            textAlign: 'center', padding: '2.5rem 2rem', marginBottom: 24,
            background: `linear-gradient(135deg, ${rating.bg} 0%, white 70%)`,
          }}>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              SESSION RESULT
            </p>
            {/* SVG score ring */}
            <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 20px' }}>
              <svg viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border)" strokeWidth="10" />
                <circle cx="60" cy="60" r="52" fill="none"
                  stroke={rating.color} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(score / 105) * 326} 326`} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: rating.color, lineHeight: 1 }}>{score}</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>/ 105</span>
              </div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 'var(--radius-pill)', background: rating.bg, border: `1.5px solid ${rating.color}30`, marginBottom: 12 }}>
              <Trophy size={14} style={{ color: rating.color }} />
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: rating.color }}>{rating.label}</span>
            </div>
            <h1 style={{ fontSize: 'var(--text-xl)', marginBottom: 4 }}>{scenario?.title ?? 'Training Complete'}</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Here's how you performed</p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
            <MiniStat icon={<Clock size={18} style={{ color: 'var(--color-brand)' }} />} label="Total Time" value={fmtTime(totalTimeMs)} />
            <MiniStat icon={<CheckCircle size={18} style={{ color: 'var(--color-success)' }} />} label="Correct Steps" value={`${allLogs.filter(l => l.was_correct).length}/${allLogs.length}`} />
            <MiniStat icon={<Trophy size={18} style={{ color: 'var(--color-warning)' }} />} label="PPE Bonus" value={breakdown?.allPPECorrect ? '+5 pts' : '0 pts'} />
          </div>

          {/* Breakdown */}
          {breakdown && (
            <div className="card animate-fade-in" style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 16 }}>Score Breakdown</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Row label="Base score" value="+100" color="var(--color-text-primary)" />
                {breakdown.stepPenalty > 0 && <Row label={`Missed steps (${breakdown.missedSteps} × 10)`} value={`−${breakdown.stepPenalty}`} color="var(--color-error)" />}
                {breakdown.timePenalty > 0 && <Row label="Slow response time" value={`−${breakdown.timePenalty}`} color="var(--color-warning)" />}
                {breakdown.allPPECorrect && <Row label="PPE all correct bonus" value="+5" color="var(--color-success)" />}
                <div style={{ height: 1, background: 'var(--color-border)', margin: '4px 0' }} />
                <Row label="Final score" value={`${score} pts`} color={rating.color} bold />
              </div>
            </div>
          )}

          {/* Step review */}
          {allLogs.length > 0 && (
            <div className="card animate-fade-in" style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 16 }}>Step-by-Step Review</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {allLogs.map((log, i) => {
                  const stepDef = scenario?.steps?.[log.step_index]
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 14px', borderRadius: 'var(--radius-md)',
                      background: log.was_correct ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
                      border: `1px solid ${log.was_correct ? 'var(--color-success-border)' : 'var(--color-error-border)'}`,
                    }}>
                      {log.was_correct
                        ? <CheckCircle size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                        : <XCircle size={18} style={{ color: 'var(--color-error)', flexShrink: 0 }} />
                      }
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                          Step {log.step_index + 1}: {stepDef?.label ?? `Step ${log.step_index + 1}`}
                        </p>
                        {stepDef?.is_ppe_step && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand)', fontWeight: 600 }}>🦺 PPE Step</span>}
                      </div>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', flexShrink: 0 }}>{fmtTime(log.time_taken_ms)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Tips */}
          {tips.length > 0 && (
            <div className="card animate-fade-in" style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
                <Lightbulb size={18} style={{ color: 'var(--color-warning)' }} />
                <h2 style={{ fontSize: 'var(--text-lg)' }}>Improvement Tips</h2>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none' }}>
                {tips.map((tip, i) => (
                  <li key={i} style={{
                    display: 'flex', gap: 10, padding: '10px 12px',
                    background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
                  }}>
                    <AlertTriangle size={14} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: 2 }} />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {score >= PASS_THRESHOLD && scenario && (
              <button className="btn btn-success btn-lg btn-full"
                onClick={() => navigate(`/assessment/${scenario.id}`, { state: { sessionId } })}>
                <Award size={18} /> Take Safety Assessment →
              </button>
            )}
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary btn-lg" style={{ flex: 1 }}
                onClick={() => navigate(`/scenario/${scenario?.id ?? ''}`)}>
                <RefreshCw size={16} /> {T('retry')}
              </button>
              <button className="btn btn-ghost btn-lg" style={{ flex: 1 }}
                onClick={() => navigate('/dashboard')}>
                <LayoutDashboard size={16} /> {T('dashboard')}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function MiniStat({ icon, label, value }) {
  return (
    <div className="card-sm" style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>{icon}</div>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{label}</p>
      <p style={{ fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)' }}>{value}</p>
    </div>
  )
}
function Row({ label, value, color, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: bold ? 700 : 400 }}>{label}</span>
      <span style={{ fontSize: bold ? 'var(--text-base)' : 'var(--text-sm)', fontWeight: 700, color }}>{value}</span>
    </div>
  )
}
