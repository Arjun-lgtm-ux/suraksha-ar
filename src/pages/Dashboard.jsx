import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Trophy, Clock, Star, TrendingUp, ChevronRight, AlertTriangle, Flame, Wind, Cog, Lock, PlayCircle, ShieldCheck, Zap } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { mockGetScenarios, mockGetSessions } from '../lib/mockDb'
import { getScenarioText } from '../lib/i18n'
import { useAuth } from '../contexts/AuthContext'
import { useLang } from '../contexts/LanguageContext'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { scoreRating } from '../lib/scoring'
import VideoTutorialModal from '../components/ui/VideoTutorialModal'

const HAZARD_ICONS = {
  gas_leak: Wind,
  fire: Flame,
  machinery: Cog,
  ppe: ShieldCheck,
  electrical: Zap,
}
const SCENARIO_ORDER = [
  'a1b2c3d4-0001-0001-0001-000000000001', // Fire & Explosion Response
  'a1b2c3d4-0002-0002-0002-000000000002', // Gas Leak & Confined Space Protocol
  'a1b2c3d4-0003-0003-0003-000000000003', // Heavy Industrial Machinery & Nip-Point Guarding (WORKS)
  'a1b2c3d4-0005-0005-0005-000000000005', // High-Voltage Electrical Substation Safety (Coming Soon)
  'a1b2c3d4-0004-0004-0004-000000000004', // PPE & Industrial Hazard Baseline (Coming Soon)
]
const DIFFICULTY_COLORS = {
  beginner: 'var(--color-success)',
  intermediate: 'var(--color-warning)',
  advanced: 'var(--color-error)',
}

function getGreeting(name, T) {
  const h = new Date().getHours()
  const g = h < 12 ? T('goodMorning') : h < 17 ? T('goodAfternoon') : T('goodEvening')
  return `${g}, ${name} 👋`
}

function fmt(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
function fmtTime(ms) {
  if (!ms) return '—'
  const s = Math.round(ms / 1000)
  return s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`
}

export default function Dashboard() {
  const { user, profile } = useAuth()
  const { T, lang } = useLang()
  const navigate = useNavigate()
  const [showVideoTutorial, setShowVideoTutorial] = useState(false)

  const { data: scenarios, isLoading: loadingS } = useQuery({
    queryKey: ['scenarios'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockGetScenarios().data
      const { data, error } = await supabase.from('scenarios').select('*').order('created_at')
      if (error) throw error
      return data
    },
  })

  const { data: sessions, isLoading: loadingSess } = useQuery({
    queryKey: ['sessions', user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockGetSessions(user.id).data
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*, scenarios(title, hazard_type)')
        .eq('user_id', user.id).eq('status', 'completed')
        .order('completed_at', { ascending: false })
      if (error) throw error
      return data
    },
  })

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Trainee'
  const avgScore = sessions?.length
    ? Math.round(sessions.reduce((s, sess) => s + (sess.score ?? 0), 0) / sessions.length)
    : null
  const rating = avgScore !== null ? scoreRating(avgScore) : null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--navbar-height) + 16px)', paddingBottom: 'calc(96px + env(safe-area-inset-bottom, 0px))', width: '100%', boxSizing: 'border-box' }}>
        <div className="page-container">
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, var(--text-2xl))', marginBottom: 4 }}>{getGreeting(firstName, T)}</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', margin: 0 }}>
              Continue your safety training. Stay prepared, stay safe.
            </p>
          </div>

          {/* Stats — 2 columns on mobile, 4 on desktop */}
          <div className="dashboard-stats-grid">
            <StatCard icon={<Trophy size={20} style={{ color: 'var(--color-brand)' }} />}
              label={T('safetyReadiness')}
              value={avgScore !== null ? `${avgScore} pts` : '—'}
              sub={rating?.label ?? 'No sessions yet'}
              color={rating?.color ?? 'var(--color-text-muted)'}
              bg={rating?.bg ?? 'var(--color-surface-alt)'}
              loading={loadingSess} />
            <StatCard icon={<Star size={20} style={{ color: 'var(--color-warning)' }} />}
              label={T('sessionsCompleted')}
              value={loadingSess ? '…' : (sessions?.length ?? 0)}
              sub="training sessions" color="var(--color-warning)" bg="var(--color-warning-bg)" loading={loadingSess} />
            <StatCard icon={<TrendingUp size={20} style={{ color: '#6366f1' }} />}
              label={T('modulesAvailable')}
              value={loadingS ? '…' : (scenarios?.length ?? 0)}
              sub="safety modules" color="#6366f1" bg="#EDEDFF" loading={loadingS} />
            <StatCard icon={<Clock size={20} style={{ color: 'var(--color-text-muted)' }} />}
              label={T('lastTrained')}
              value={sessions?.[0] ? fmt(sessions[0].completed_at) : '—'}
              sub="most recent" color="var(--color-text-muted)" bg="var(--color-surface-alt)" loading={loadingSess} />
          </div>

          {/* How to Use / Video Tutorial Banner */}
          <div className="dashboard-how-to-use-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md, 12px)',
                  background: 'var(--color-brand, #E05A00)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(224, 90, 0, 0.25)',
                }}
              >
                <PlayCircle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--text-base, 1rem)', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
                  {T('howToUse') || 'How to Use SurakshaAR?'}
                </h3>
                <p style={{ fontSize: 'var(--text-xs, 0.8rem)', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
                  First time training? Watch the 2-minute video tutorial before starting AR simulation.
                </p>
              </div>
            </div>

            <button
              className="btn btn-primary dashboard-how-to-use-btn"
              onClick={() => setShowVideoTutorial(true)}
            >
              <PlayCircle size={17} /> {T('watchTutorial') || 'Watch Video Guide'}
            </button>
          </div>

          {/* Modules — 100% width 1 column on mobile, auto-fill on desktop */}
          <section style={{ marginBottom: 40 }}>
            <h2 className="section-title" style={{ marginBottom: 4 }}>{T('trainingModules')}</h2>
            <p className="section-subtitle" style={{ marginBottom: 20 }}>{T('selectModuleSubtitle')}</p>

            {loadingS ? (
              <div className="dashboard-modules-grid">
                {[0,1,2].map(i => <div key={i} className="card skeleton" style={{ height: 220 }} />)}
              </div>
            ) : !scenarios?.length ? (
              <div className="alert alert-warning">
                <AlertTriangle size={16} />{T('noScenariosYet')}
              </div>
            ) : (
              <div className="dashboard-modules-grid">
                {[...scenarios]
                  .sort((a, b) => {
                    const idxA = SCENARIO_ORDER.indexOf(a.id)
                    const idxB = SCENARIO_ORDER.indexOf(b.id)
                    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB)
                  })
                  .map(s => (
                    <ModuleCard key={s.id} scenario={s} sessions={sessions}
                      onStart={() => navigate(`/tutorial/${s.id}`)} T={T} lang={lang} />
                  ))}
              </div>
            )}
          </section>

          {/* Recent Sessions */}
          <section>
            <h2 className="section-title" style={{ marginBottom: 4 }}>{T('recentSessions')}</h2>
            <p className="section-subtitle" style={{ marginBottom: 20 }}>Your latest training performance</p>
            {loadingSess ? (
              <div className="card skeleton" style={{ height: 120 }} />
            ) : !sessions?.length ? (
              <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
                <Trophy size={40} style={{ margin: '0 auto 12px', color: 'var(--color-border-strong)' }} />
                <p style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>{T('noSessionsYet')}</p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 4 }}>
                  Complete a training module above to see your results here.
                </p>
              </div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr><th>Module</th><th>Score</th><th>Time</th><th>Date</th><th></th></tr>
                    </thead>
                    <tbody>
                      {sessions.slice(0, 10).map(sess => {
                        const r = scoreRating(sess.score ?? 0)
                        return (
                          <tr key={sess.id}>
                            <td style={{ fontWeight: 500 }}>{sess.scenarios?.title ?? '—'}</td>
                            <td>
                              <span style={{ fontWeight: 700, color: r.color }}>{sess.score ?? 0}</span>
                              <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>/105</span>
                            </td>
                            <td>{fmtTime(sess.reaction_time_ms)}</td>
                            <td>{fmt(sess.completed_at)}</td>
                            <td>
                              <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/results/${sess.id}`)}>
                                View <ChevronRight size={12} />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {/* In-Platform Video Tutorial Modal */}
          <VideoTutorialModal
            isOpen={showVideoTutorial}
            onClose={() => setShowVideoTutorial(false)}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}

function StatCard({ icon, label, value, sub, color, bg, loading }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ width: 44, height: 44, background: bg, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
      <div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
        {loading
          ? <div className="skeleton" style={{ height: 28, width: 60, marginTop: 4 }} />
          : <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color, lineHeight: 1.2, marginTop: 2 }}>{value}</p>
        }
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>{sub}</p>
      </div>
    </div>
  )
}

function ModuleCard({ scenario, sessions, onStart, T, lang }) {
  const best = sessions?.filter(s => s.scenario_id === scenario.id).sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0]
  const rating = best ? scoreRating(best.score ?? 0) : null
  const isComingSoon = scenario.coming_soon

  // Resolve from i18n table — always reactive to lang changes, bypasses cache
  const localTitle = getScenarioText(scenario.id, lang, 'title') || scenario.title
  const localDesc = getScenarioText(scenario.id, lang, 'description') || scenario.description

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14, opacity: isComingSoon ? 0.75 : 1 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span className="badge" style={{ background: DIFFICULTY_COLORS[scenario.difficulty] + '18', color: DIFFICULTY_COLORS[scenario.difficulty] }}>
          {scenario.difficulty}
        </span>
        {isComingSoon && <span className="badge badge-neutral"><Lock size={9} /> COMING SOON</span>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-brand)', flexShrink: 0 }}>
          {(() => {
            const Icon = HAZARD_ICONS[scenario.hazard_type] || AlertTriangle
            return <Icon size={18} />
          })()}
        </div>
        <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>{localTitle}</h3>
      </div>

      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.55, flex: 1 }}>{localDesc}</p>

      <div style={{ display: 'flex', gap: 14, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
        {!isComingSoon && <span>📋 {scenario.steps?.length ?? 0} {T('steps')}</span>}
        <span>⏱ {Math.round((scenario.benchmark_time_ms ?? 90000) / 60000)}m {T('benchmark')}</span>
        {best && <span style={{ color: rating?.color, fontWeight: 600 }}>🏆 {T('bestScore')}: {best.score}</span>}
      </div>

      {best && (
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${Math.min(100, ((best.score ?? 0) / 105) * 100)}%`, background: rating?.color }} />
        </div>
      )}

      <button className={`btn btn-full ${isComingSoon ? 'btn-ghost' : 'btn-primary'}`}
        onClick={!isComingSoon ? onStart : undefined} disabled={isComingSoon}>
        {isComingSoon ? <><Lock size={15} /> Coming Soon</> : best
          ? <>{T('retryScenario')} <ChevronRight size={16} /></>
          : <>{T('startTraining')} <ChevronRight size={16} /></>}
      </button>
    </div>
  )
}
