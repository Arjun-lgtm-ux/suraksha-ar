import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { mockGetAllSessions } from '../../lib/mockDb'
import { Navbar } from '../../components/layout/Navbar'
import { scoreRating } from '../../lib/scoring'

const MODULES = [
  { id: 'a1b2c3d4-0001-0001-0001-000000000001', title: 'Fire & Explosion Response', hazard: 'fire' },
  { id: 'a1b2c3d4-0002-0002-0002-000000000002', title: 'Gas Leak & Confined Space', hazard: 'gas_leak' },
]

export default function AdminCompliance() {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['compliance-sessions'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockGetAllSessions().data ?? []
      const { data } = await supabase
        .from('training_sessions')
        .select('*, profiles(full_name, site_location)')
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
      return data ?? []
    },
  })

  if (isLoading) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 120 }}>
        <div className="spinner" />
      </main>
    </div>
  )

  const totalSessions = sessions?.length ?? 0
  const avgScore = totalSessions ? Math.round(sessions.reduce((s, sess) => s + (sess.score ?? 0), 0) / totalSessions) : 0
  const passCount = sessions?.filter(s => (s.score ?? 0) >= 63).length ?? 0
  const passRate = totalSessions ? Math.round((passCount / totalSessions) * 100) : 0

  // Per-module breakdown
  const byModule = MODULES.map(mod => {
    const modSessions = sessions?.filter(s => s.scenario_id === mod.id) ?? []
    const count = modSessions.length
    const avg = count ? Math.round(modSessions.reduce((s, sess) => s + (sess.score ?? 0), 0) / count) : 0
    const pass = count ? Math.round((modSessions.filter(s => (s.score ?? 0) >= 63).length / count) * 100) : 0
    return { ...mod, count, avg, pass }
  })

  // Per-site breakdown
  const bySite = {}
  sessions?.forEach(sess => {
    const site = sess.profiles?.site_location ?? 'Unknown Location'
    if (!bySite[site]) bySite[site] = { sessions: 0, totalScore: 0, pass: 0 }
    bySite[site].sessions++
    bySite[site].totalScore += (sess.score ?? 0)
    if ((sess.score ?? 0) >= 63) bySite[site].pass++
  })
  const siteRows = Object.entries(bySite).map(([site, d]) => ({
    site,
    sessions: d.sessions,
    avg: Math.round(d.totalScore / d.sessions),
    passRate: Math.round((d.pass / d.sessions) * 100),
  })).sort((a, b) => b.sessions - a.sessions)

  // Score distribution
  const ranges = [
    { label: '90–105 (Excellent)', min: 90, max: 105, color: '#2E8B57' },
    { label: '75–89 (Good)', min: 75, max: 89, color: '#0E7C7B' },
    { label: '55–74 (Fair)', min: 55, max: 74, color: '#D4882A' },
    { label: '0–54 (Needs Work)', min: 0, max: 54, color: '#C0392B' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--navbar-height) + 24px)', paddingBottom: 48 }}>
        <div className="page-container">
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 4 }}>Compliance Report</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              Jharkhand Industrial Safety Training · All Sites
            </p>
          </div>

          {/* Compliance alert */}
          {totalSessions > 0 && passRate < 60 && (
            <div className="alert alert-warning" style={{ marginBottom: 24 }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <div>
                <strong>Compliance Risk:</strong> Platform pass rate ({passRate}%) is below the 60% target.
                Immediate remedial training is recommended.
              </div>
            </div>
          )}
          {totalSessions > 0 && passRate >= 80 && (
            <div className="alert alert-success" style={{ marginBottom: 24 }}>
              <CheckCircle size={16} style={{ flexShrink: 0 }} />
              <div>
                <strong>Good Compliance:</strong> Pass rate of {passRate}% meets the 60% regulatory threshold.
              </div>
            </div>
          )}

          {/* Top stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
            {[
              { label: 'Total Sessions', value: totalSessions, color: 'var(--color-brand)', bg: 'var(--color-brand-50)' },
              { label: 'Platform Avg Score', value: `${avgScore}/105`, color: scoreRating(avgScore).color, bg: scoreRating(avgScore).bg },
              { label: 'Pass Rate', value: `${passRate}%`, color: passRate >= 60 ? 'var(--color-success)' : 'var(--color-error)', bg: passRate >= 60 ? 'var(--color-success-bg)' : 'var(--color-error-bg)' },
              { label: 'Passed Sessions', value: passCount, color: 'var(--color-success)', bg: 'var(--color-success-bg)' },
            ].map(s => (
              <div key={s.label} className="card">
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>{s.label}</p>
                <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Per-module breakdown */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 16 }}>Module Breakdown</h2>
            {!byModule.some(m => m.count > 0) ? (
              <p style={{ color: 'var(--color-text-muted)' }}>No session data yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {byModule.map(mod => {
                  const r = scoreRating(mod.avg)
                  return (
                    <div key={mod.id} style={{ padding: '16px', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div>
                          <p style={{ fontWeight: 700, marginBottom: 2 }}>{mod.title}</p>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{mod.count} sessions</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: 800, color: r.color, fontSize: 'var(--text-lg)' }}>{mod.avg}<span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>/105</span></p>
                          <p style={{ fontSize: 'var(--text-xs)', color: mod.pass >= 60 ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 600 }}>
                            {mod.pass}% pass rate
                          </p>
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${(mod.avg / 105) * 100}%`, background: r.color }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Score distribution */}
          {totalSessions > 0 && (
            <div className="card" style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 16 }}>Score Distribution</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ranges.map(r => {
                  const count = sessions?.filter(s => s.score >= r.min && s.score <= r.max).length ?? 0
                  const pct = totalSessions ? Math.round((count / totalSessions) * 100) : 0
                  return (
                    <div key={r.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{r.label}</span>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: r.color }}>{count} ({pct}%)</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: r.color }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* By site breakdown */}
          {siteRows.length > 0 && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
                <h2 style={{ fontSize: 'var(--text-lg)' }}>By Site / Location</h2>
              </div>
              <div className="table-container">
                <table>
                  <thead><tr><th>Site</th><th>Sessions</th><th>Avg Score</th><th>Pass Rate</th></tr></thead>
                  <tbody>
                    {siteRows.map(row => {
                      const r = scoreRating(row.avg)
                      return (
                        <tr key={row.site}>
                          <td style={{ fontWeight: 500 }}>{row.site}</td>
                          <td>{row.sessions}</td>
                          <td><span style={{ fontWeight: 700, color: r.color }}>{row.avg}</span><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>/105</span></td>
                          <td>
                            <span style={{ fontWeight: 700, color: row.passRate >= 60 ? 'var(--color-success)' : 'var(--color-error)' }}>
                              {row.passRate}%
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
