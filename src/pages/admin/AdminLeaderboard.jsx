import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Trophy, Search, CheckCircle, Clock, ChevronRight,
  Shield, ArrowLeft,
} from 'lucide-react'
import { Navbar } from '../../components/layout/Navbar'
import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import { mockGetLeaderboard } from '../../lib/mockDb'
import { scoreRating } from '../../lib/scoring'

function fmtDate(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function AdminLeaderboard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL') // ALL | Completed | In Progress | Not Started

  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ['admin-leaderboard'],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        const res = mockGetLeaderboard()
        return res.data ?? []
      }
      // Supabase fallback query if configured
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'trainee')
      const { data: sessions } = await supabase
        .from('training_sessions')
        .select('*')
        .eq('status', 'completed')
      const { data: certs } = await supabase
        .from('certificates')
        .select('*')
        .eq('status', 'valid')

      // Rank profiles
      const list = (profiles ?? []).map(p => {
        const userSess = (sessions ?? []).filter(s => s.user_id === p.id)
        const userCerts = (certs ?? []).filter(c => c.user_id === p.id)
        const bestScore = userSess.length ? Math.max(...userSess.map(s => s.score ?? 0)) : 0
        const avgScore = userSess.length ? Math.round(userSess.reduce((a, s) => a + (s.score ?? 0), 0) / userSess.length) : 0
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
          language: p.preferred_language || 'en',
          module: 'Fire & Explosion Response',
          score: bestScore,
          avgScore,
          progress,
          status,
          isCertified: userCerts.length > 0,
          certificateNumber: userCerts[0]?.cert_number || null,
          lastActive: userSess[0]?.completed_at || p.created_at,
        }
      })

      list.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return b.progress - a.progress
      })

      return list.map((item, idx) => ({ ...item, rank: idx + 1 }))
    },
  })

  // Filtered leaderboard
  const filtered = leaderboard.filter(item => {
    const matchesSearch =
      !search ||
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.employeeId?.toLowerCase().includes(search.toLowerCase()) ||
      item.department?.toLowerCase().includes(search.toLowerCase()) ||
      item.location?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'ALL' || item.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Aggregate stats
  const totalRanked = leaderboard.length
  const topPerformer = leaderboard[0]
  const avgOverallScore = leaderboard.length
    ? Math.round(leaderboard.reduce((sum, t) => sum + (t.score || 0), 0) / leaderboard.length)
    : 0
  const certifiedCount = leaderboard.filter(t => t.isCertified).length

  function getRankBadge(rank) {
    if (rank === 1) {
      return (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: '#FFF9E6', color: '#B7791F', border: '1px solid #F6E05E',
          borderRadius: 'var(--radius-pill)', padding: '3px 10px',
          fontWeight: 800, fontSize: '0.82rem',
        }}>
          🥇 1st
        </span>
      )
    }
    if (rank === 2) {
      return (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1',
          borderRadius: 'var(--radius-pill)', padding: '3px 10px',
          fontWeight: 800, fontSize: '0.82rem',
        }}>
          🥈 2nd
        </span>
      )
    }
    if (rank === 3) {
      return (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: '#FFF3EB', color: '#C05621', border: '1px solid #FBD38D',
          borderRadius: 'var(--radius-pill)', padding: '3px 10px',
          fontWeight: 800, fontSize: '0.82rem',
        }}>
          🥉 3rd
        </span>
      )
    }
    return (
      <span style={{
        fontWeight: 700, color: 'var(--color-text-secondary)',
        fontSize: '0.88rem', paddingLeft: 6,
      }}>
        #{rank}
      </span>
    )
  }

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
              style={{ marginBottom: 16 }}
            >
              <ArrowLeft size={16} /> Back to Admin Dashboard
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 'var(--radius-md)',
                background: '#FFF3EB', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: 'var(--color-brand)',
              }}>
                <Trophy size={22} />
              </div>
              <h1 style={{ fontSize: 'var(--text-2xl)' }}>Trainee Performance Leaderboard</h1>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              Real-time rankings based on actual AR scenario completions, assessment scores, and safety compliance.
            </p>
          </div>

          {/* Metric Overview Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: 16,
            marginBottom: 28,
          }}>
            <div className="card" style={{ padding: '16px 20px' }}>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Total Trainees
              </p>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: 4 }}>
                {totalRanked}
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                Enrolled in industrial safety
              </p>
            </div>

            <div className="card" style={{ padding: '16px 20px' }}>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Top Performer
              </p>
              <p style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-brand)', marginTop: 4 }}>
                {topPerformer ? topPerformer.name : '—'}
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                {topPerformer ? `${topPerformer.score}/105 pts (${topPerformer.location})` : 'No trainees'}
              </p>
            </div>

            <div className="card" style={{ padding: '16px 20px' }}>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Platform Avg Score
              </p>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: '#2E8B57', marginTop: 4 }}>
                {avgOverallScore} <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>/105</span>
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                Across all completed attempts
              </p>
            </div>

            <div className="card" style={{ padding: '16px 20px' }}>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Certified Trainees
              </p>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-brand)', marginTop: 4 }}>
                {certifiedCount} <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>/ {totalRanked}</span>
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                {totalRanked ? `${Math.round((certifiedCount / totalRanked) * 100)}% certified` : '0%'}
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            gap: 16,
            flexWrap: 'wrap',
          }}>
            {/* Status Tabs */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['ALL', 'Completed', 'In Progress', 'Not Started'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    borderRadius: 'var(--radius-pill)',
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                  }}
                >
                  {status === 'ALL' ? 'All Trainees' : status}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: 260 }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                }}
              />
              <input
                className="form-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search trainee, employee ID, location…"
                style={{ paddingLeft: 38, borderRadius: 'var(--radius-pill)', height: 38 }}
              />
            </div>
          </div>

          {/* Leaderboard Table Card */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <div className="spinner" style={{ margin: '0 auto' }} />
            </div>
          ) : !filtered.length ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
              <Trophy size={42} style={{ color: 'var(--color-border-strong)', margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-md)' }}>
                {search ? 'No trainees match your filter criteria.' : 'No trainees currently registered.'}
              </p>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: 80 }}>Rank</th>
                      <th>Trainee Details</th>
                      <th>Assigned Module</th>
                      <th style={{ textAlign: 'center' }}>Score</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th>Certificate</th>
                      <th>Last Active</th>
                      <th style={{ textAlign: 'right' }}>Record</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(item => {
                      const r = scoreRating(item.score || 0)
                      return (
                        <tr
                          key={item.id}
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/admin/trainees/${item.id}`)}
                        >
                          {/* Rank */}
                          <td>{getRankBadge(item.rank)}</td>

                          {/* Trainee */}
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{
                                width: 36, height: 36, borderRadius: '50%',
                                background: item.rank <= 3 ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0,
                              }}>
                                {(item.name || 'T')[0].toUpperCase()}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                                  {item.name}
                                </div>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                                  {item.employeeId} · {item.email}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                                  📍 {item.location} ({item.department})
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Module */}
                          <td style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Shield size={14} style={{ color: 'var(--color-brand)', flexShrink: 0 }} />
                              <span>{item.module}</span>
                            </div>
                          </td>

                          {/* Score */}
                          <td style={{ textAlign: 'center' }}>
                            <span style={{ fontWeight: 800, fontSize: '1rem', color: r.color }}>
                              {item.score}
                            </span>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                              /105
                            </span>
                          </td>

                          {/* Progress */}
                          <td style={{ minWidth: 120 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{
                                flex: 1, height: 6, background: 'var(--color-border)',
                                borderRadius: 3, overflow: 'hidden',
                              }}>
                                <div style={{
                                  width: `${item.progress}%`, height: '100%',
                                  background: item.progress === 100 ? 'var(--color-success)' : 'var(--color-brand)',
                                  borderRadius: 3,
                                }} />
                              </div>
                              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, minWidth: 32 }}>
                                {item.progress}%
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td>
                            <span className={`badge ${
                              item.status === 'Completed'
                                ? 'badge-success'
                                : item.status === 'In Progress'
                                ? 'badge-brand'
                                : 'badge-neutral'
                            }`}>
                              {item.status}
                            </span>
                          </td>

                          {/* Certificate */}
                          <td>
                            {item.isCertified ? (
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                color: 'var(--color-success)', fontSize: 'var(--text-xs)', fontWeight: 700,
                              }}>
                                <CheckCircle size={14} /> Certified
                              </span>
                            ) : (
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)',
                              }}>
                                <Clock size={13} /> Pending
                              </span>
                            )}
                          </td>

                          {/* Last Active */}
                          <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                            {fmtDate(item.lastActive)}
                          </td>

                          {/* Action */}
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={e => {
                                e.stopPropagation()
                                navigate(`/admin/trainees/${item.id}`)
                              }}
                            >
                              View <ChevronRight size={14} />
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
    </div>
  )
}
