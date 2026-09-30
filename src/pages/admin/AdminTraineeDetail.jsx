import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft, Trophy, Clock, CheckCircle, Shield, Award,
  Mail, Phone, MapPin, Building, Check
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { mockGetProfile, mockGetSessions, DEMO_SCENARIOS } from '../../lib/mockDb'
import { Navbar } from '../../components/layout/Navbar'
import { scoreRating } from '../../lib/scoring'

function fmtDate(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function fmtTime(ms) {
  if (!ms) return '—'
  const s = Math.round(ms / 1000)
  return s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`
}

export default function AdminTraineeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: profile } = useQuery({
    queryKey: ['admin-trainee', id],
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockGetProfile(id).data
      const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
      return data
    },
  })

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['admin-trainee-sessions', id],
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockGetSessions(id).data ?? []
      const { data } = await supabase
        .from('training_sessions')
        .select('*, scenarios(title, hazard_type)')
        .eq('user_id', id)
        .order('completed_at', { ascending: false })
      return data ?? []
    },
  })

  const { data: certs = [] } = useQuery({
    queryKey: ['admin-trainee-certs', id],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        const all = JSON.parse(localStorage.getItem('mock_certificates') ?? '[]')
        return all.filter(c => c.user_id === id)
      }
      const { data } = await supabase.from('certificates').select('*').eq('user_id', id)
      return data ?? []
    },
  })

  const completedSessions = sessions.filter(s => s.status === 'completed')
  const avgScore = completedSessions.length
    ? Math.round(completedSessions.reduce((s, sess) => s + (sess.score ?? 0), 0) / completedSessions.length)
    : null
  const bestScore = completedSessions.length
    ? Math.max(...completedSessions.map(s => s.score ?? 0))
    : null
  const rating = avgScore !== null ? scoreRating(avgScore) : null
  const latestSession = completedSessions[0] || null

  // Assigned modules
  const assignedModuleIds = profile?.assigned_modules || ['a1b2c3d4-0001-0001-0001-000000000001']
  const assignedScenarios = DEMO_SCENARIOS.filter(s => assignedModuleIds.includes(s.id))
  const completedIds = new Set(completedSessions.map(s => s.scenario_id))
  const progressPct = Math.min(100, Math.round((assignedModuleIds.filter(mid => completedIds.has(mid)).length / assignedModuleIds.length) * 100))

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--navbar-height) + 24px)', paddingBottom: 48 }}>
        <div className="page-container" style={{ maxWidth: 900 }}>
          
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginBottom: 20 }}
            onClick={() => navigate('/admin/trainees')}
          >
            <ArrowLeft size={16} /> Back to Trainee Directory
          </button>

          {/* Trainee Header Card */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 16,
              marginBottom: 20,
              flexWrap: 'wrap',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--color-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', fontWeight: 800, color: 'white', flexShrink: 0,
              }}>
                {(profile?.full_name ?? 'T')[0].toUpperCase()}
              </div>

              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                  <h1 style={{ fontSize: 'var(--text-xl)', margin: 0 }}>
                    {profile?.full_name ?? 'Trainee Record'}
                  </h1>
                  <span className="badge badge-brand">TRAINEE</span>
                  {certs.length > 0 && (
                    <span className="badge badge-success">
                      <CheckCircle size={12} style={{ marginRight: 4 }} /> Certified
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 8 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Mail size={13} style={{ color: 'var(--color-text-muted)' }} />
                    {profile?.email || '—'}
                  </span>
                  {profile?.mobile && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Phone size={13} style={{ color: 'var(--color-text-muted)' }} />
                      {profile.mobile}
                    </span>
                  )}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Building size={13} style={{ color: 'var(--color-text-muted)' }} />
                    {profile?.employee_id || 'TRN-2026'} ({profile?.department || 'Operations'})
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={13} style={{ color: 'var(--color-text-muted)' }} />
                    {profile?.site_location || 'Jharkhand Industrial Facility'}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
              <div style={{ textAlign: 'center', padding: '12px 8px', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}><Clock size={16} style={{ color: 'var(--color-brand)' }} /></div>
                <p style={{ fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)', lineHeight: 1.2 }}>{completedSessions.length}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Attempts</p>
              </div>

              <div style={{ textAlign: 'center', padding: '12px 8px', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}><Shield size={16} style={{ color: 'var(--color-brand)' }} /></div>
                <p style={{ fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--color-brand)', lineHeight: 1.2 }}>{progressPct}%</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>Training Progress</p>
              </div>

              <div style={{ textAlign: 'center', padding: '12px 8px', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}><Trophy size={16} style={{ color: rating?.color ?? 'var(--color-text-muted)' }} /></div>
                <p style={{ fontWeight: 800, fontSize: 'var(--text-lg)', color: rating?.color ?? 'var(--color-text-primary)', lineHeight: 1.2 }}>
                  {latestSession ? `${latestSession.score}/105` : '—'}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>Latest Score</p>
              </div>

              <div style={{ textAlign: 'center', padding: '12px 8px', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}><Trophy size={16} style={{ color: '#D97706' }} /></div>
                <p style={{ fontWeight: 800, fontSize: 'var(--text-lg)', color: '#D97706', lineHeight: 1.2 }}>
                  {bestScore !== null ? `${bestScore}/105` : '—'}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>Best Score</p>
              </div>

              <div style={{ textAlign: 'center', padding: '12px 8px', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}><Award size={16} style={{ color: 'var(--color-success)' }} /></div>
                <p style={{ fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--color-success)', lineHeight: 1.2 }}>{certs.length}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>Certificates</p>
              </div>
            </div>
          </div>

          {/* Assigned Modules Card */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 14 }}>
              Assigned Safety Training Modules
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {assignedScenarios.map(sc => {
                const isCleared = completedIds.has(sc.id)
                const moduleSess = completedSessions.filter(s => s.scenario_id === sc.id)
                const modBest = moduleSess.length ? Math.max(...moduleSess.map(s => s.score ?? 0)) : null

                return (
                  <div
                    key={sc.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      background: 'var(--color-surface-alt)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      gap: 12,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 'var(--radius-md)',
                        background: isCleared ? 'var(--color-success-bg)' : 'var(--color-brand-50)',
                        color: isCleared ? 'var(--color-success)' : 'var(--color-brand)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {isCleared ? <Check size={18} /> : <Shield size={18} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                          {sc.title}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                          Hazard Type: {sc.hazard_type.replace('_', ' ').toUpperCase()} · Benchmark: {Math.round(sc.benchmark_time_ms / 1000)}s
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {modBest !== null && (
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Best: </span>
                          <span style={{ fontWeight: 700, color: scoreRating(modBest).color }}>{modBest}/105</span>
                        </div>
                      )}
                      <span className={`badge ${isCleared ? 'badge-success' : 'badge-brand'}`}>
                        {isCleared ? 'Completed ✓' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Certificates Issued Section */}
          {certs.length > 0 && (
            <div className="card" style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 14 }}>
                Issued Digital Certificates
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {certs.map(c => (
                  <div
                    key={c.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      background: 'var(--color-success-bg)',
                      border: '1px solid var(--color-success-border)',
                      borderRadius: 'var(--radius-md)',
                      gap: 12,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Award size={22} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                          {c.course_name || 'Fire & Explosion Response'}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                          ID: <strong style={{ fontFamily: 'var(--font-mono)' }}>{c.certificate_number || c.cert_number || c.id.slice(0, 16)}</strong> · Issued {fmtDate(c.issued_at)}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="badge badge-success">Verified Authenticity</span>
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => navigate(`/certificate/${c.id}`)}
                      >
                        View Certificate →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Training Attempt History */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>Complete Training History</h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                Chronological list of all AR scenario executions and assessments
              </p>
            </div>

            {isLoading ? (
              <div style={{ padding: 32, textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto' }} />
              </div>
            ) : !sessions?.length ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                No training sessions recorded yet for this trainee.
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Module</th>
                      <th>Score</th>
                      <th>Time Taken</th>
                      <th>Result</th>
                      <th>Completed Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map(sess => {
                      const r = scoreRating(sess.score ?? 0)
                      const passed = (sess.score ?? 0) >= 63
                      return (
                        <tr key={sess.id}>
                          <td style={{ fontWeight: 500 }}>
                            {sess.scenarios?.title ?? 'Fire & Explosion Response'}
                          </td>
                          <td>
                            <span style={{ fontWeight: 700, color: r.color }}>{sess.score ?? 0}</span>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>/105</span>
                          </td>
                          <td>{fmtTime(sess.reaction_time_ms)}</td>
                          <td>
                            <span className={`badge ${passed ? 'badge-success' : 'badge-danger'}`}>
                              {passed ? '✓ Passed' : '✗ Failed'}
                            </span>
                          </td>
                          <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                            {fmtDate(sess.completed_at || sess.created_at)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
