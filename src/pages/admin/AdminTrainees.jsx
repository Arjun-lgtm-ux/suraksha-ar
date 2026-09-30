import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  Users, ChevronRight, Search, UserPlus, CheckCircle,
  Clock, Shield, ArrowLeft, Trophy
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { mockGetLeaderboard } from '../../lib/mockDb'
import { Navbar } from '../../components/layout/Navbar'
import { scoreRating } from '../../lib/scoring'
import CreateTraineeModal from '../../components/admin/CreateTraineeModal'

function fmtDate(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function AdminTrainees() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const { data: trainees = [], isLoading } = useQuery({
    queryKey: ['admin-trainees-records'],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        const res = mockGetLeaderboard()
        return res.data ?? []
      }
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'trainee')
        .order('created_at', { ascending: false })
      const { data: sessions } = await supabase
        .from('training_sessions')
        .select('*')
        .eq('status', 'completed')
      const { data: certs } = await supabase
        .from('certificates')
        .select('*')
        .eq('status', 'valid')

      return (profiles ?? []).map(p => {
        const userSess = (sessions ?? []).filter(s => s.user_id === p.id)
        const userCerts = (certs ?? []).filter(c => c.user_id === p.id)
        const bestScore = userSess.length ? Math.max(...userSess.map(s => s.score ?? 0)) : 0
        const progress = userSess.length > 0 ? 100 : 0
        const status = progress === 100 ? 'Completed' : (userSess.length > 0 ? 'In Progress' : 'Not Started')
        return {
          id: p.id,
          name: p.full_name || 'Trainee',
          email: p.email,
          mobile: p.mobile || '—',
          employeeId: p.employee_id || 'TRN-2026',
          location: p.site_location || 'Jharkhand Plant',
          department: p.department || 'Operations',
          module: 'Fire & Explosion Response',
          score: bestScore,
          progress,
          status,
          isCertified: userCerts.length > 0,
          lastActive: userSess[0]?.completed_at || p.created_at,
        }
      })
    },
  })

  const filtered = trainees.filter(t =>
    !search ||
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.email?.toLowerCase().includes(search.toLowerCase()) ||
    t.employeeId?.toLowerCase().includes(search.toLowerCase()) ||
    t.location?.toLowerCase().includes(search.toLowerCase()) ||
    t.department?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--navbar-height) + 24px)', paddingBottom: 48 }}>
        <div className="page-container">

          {/* Navigation & Header */}
          <div style={{ marginBottom: 24 }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/admin')}
              style={{ marginBottom: 14 }}
            >
              <ArrowLeft size={16} /> Back to Admin Dashboard
            </button>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 16,
              flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <Users size={24} style={{ color: 'var(--color-brand)' }} />
                  <h1 style={{ fontSize: 'var(--text-2xl)' }}>Trainee Records</h1>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                  Complete registry of industrial trainees, assigned AR modules, and compliance metrics.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/admin/leaderboard')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Trophy size={16} /> Leaderboard
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setCreateModalOpen(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <UserPlus size={16} /> Create Trainee Account
                </button>
              </div>
            </div>
          </div>

          {/* Search bar & count summary */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            gap: 16,
            flexWrap: 'wrap',
          }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
              Showing {filtered.length} of {trainees.length} registered trainees
            </p>
            <div style={{ position: 'relative', minWidth: 260 }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50)',
                  color: 'var(--color-text-muted)',
                }}
              />
              <input
                className="form-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, email, employee ID, plant…"
                style={{ paddingLeft: 38, borderRadius: 'var(--radius-pill)', height: 38 }}
              />
            </div>
          </div>

          {/* Records Table */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <div className="spinner" style={{ margin: '0 auto' }} />
            </div>
          ) : !filtered.length ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
              <Users size={40} style={{ color: 'var(--color-border-strong)', margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--color-text-muted)' }}>
                {search ? 'No trainees match your search query.' : 'No trainees registered yet.'}
              </p>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Trainee Name</th>
                      <th>Email / Identifier</th>
                      <th>Assigned Module(s)</th>
                      <th>Progress</th>
                      <th>Score</th>
                      <th>Status</th>
                      <th>Certificate</th>
                      <th>Last Activity</th>
                      <th style={{ textAlign: 'right' }}>Record</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(t => {
                      const r = scoreRating(t.score || 0)
                      return (
                        <tr
                          key={t.id}
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/admin/trainees/${t.id}`)}
                        >
                          {/* Name + Avatar */}
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 34, height: 34, borderRadius: '50%',
                                background: 'var(--color-brand)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0,
                              }}>
                                {(t.name || 'T')[0].toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                                  {t.name}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                                  {t.employeeId}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                            {t.email}
                          </td>

                          {/* Module */}
                          <td style={{ fontSize: 'var(--text-xs)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <Shield size={13} style={{ color: 'var(--color-brand)', flexShrink: 0 }} />
                              <span>{t.module}</span>
                            </div>
                          </td>

                          {/* Progress */}
                          <td style={{ minWidth: 100 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{
                                flex: 1, height: 6, background: 'var(--color-border)',
                                borderRadius: 3, overflow: 'hidden',
                              }}>
                                <div style={{
                                  width: `${t.progress}%`, height: '100%',
                                  background: t.progress === 100 ? 'var(--color-success)' : 'var(--color-brand)',
                                  borderRadius: 3,
                                }} />
                              </div>
                              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                                {t.progress}%
                              </span>
                            </div>
                          </td>

                          {/* Score */}
                          <td>
                            <span style={{ fontWeight: 700, color: r.color }}>{t.score}</span>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>/105</span>
                          </td>

                          {/* Status */}
                          <td>
                            <span className={`badge ${
                              t.status === 'Completed'
                                ? 'badge-success'
                                : t.status === 'In Progress'
                                ? 'badge-brand'
                                : 'badge-neutral'
                            }`}>
                              {t.status}
                            </span>
                          </td>

                          {/* Certificate */}
                          <td>
                            {t.isCertified ? (
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                color: 'var(--color-success)', fontSize: 'var(--text-xs)', fontWeight: 700,
                              }}>
                                <CheckCircle size={13} /> Certified
                              </span>
                            ) : (
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)',
                              }}>
                                <Clock size={12} /> Pending
                              </span>
                            )}
                          </td>

                          {/* Last Activity */}
                          <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                            {fmtDate(t.lastActive)}
                          </td>

                          {/* Action */}
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={e => {
                                e.stopPropagation()
                                navigate(`/admin/trainees/${t.id}`)
                              }}
                            >
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

        </div>
      </main>

      <CreateTraineeModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['admin-trainees-records'] })
          queryClient.invalidateQueries({ queryKey: ['admin-all-profiles'] })
          queryClient.invalidateQueries({ queryKey: ['admin-leaderboard'] })
          queryClient.invalidateQueries({ queryKey: ['admin-overview'] })
        }}
      />
    </div>
  )
}
