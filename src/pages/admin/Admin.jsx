/**
 * Admin Dashboard — overview of platform compliance metrics
 */
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  Users, Award, TrendingUp, BarChart2, Shield, ChevronRight,
  AlertTriangle, Trophy, UserPlus, CheckCircle, Clock
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { mockGetAllProfiles, mockGetAllSessions, mockGetAdminOverview } from '../../lib/mockDb'
import { Navbar } from '../../components/layout/Navbar'
import { scoreRating } from '../../lib/scoring'
import CreateTraineeModal from '../../components/admin/CreateTraineeModal'

function fmtDate(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Admin() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const { data: overview } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockGetAdminOverview().data
      return null
    },
  })

  const { data: profiles, isLoading: loadP } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockGetAllProfiles().data ?? []
      const { data } = await supabase.from('profiles').select('*').eq('role', 'trainee')
      return data ?? []
    },
  })

  const { data: sessions, isLoading: loadS } = useQuery({
    queryKey: ['admin-sessions'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockGetAllSessions().data ?? []
      const { data } = await supabase
        .from('training_sessions')
        .select('*, profiles(full_name), scenarios(title, hazard_type)')
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(100)
      return data ?? []
    },
  })

  const { data: certs } = useQuery({
    queryKey: ['admin-certs-count'],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        const all = JSON.parse(localStorage.getItem('mock_certificates') ?? '[]')
        return all.length
      }
      const { count } = await supabase.from('certificates').select('*', { count: 'exact', head: true }).eq('status', 'valid')
      return count ?? 0
    },
  })

  const totalTrainees = overview?.totalTrainees ?? (profiles?.length ?? 0)
  const completedTraining = overview?.completedTraining ?? 0
  const inProgress = overview?.inProgress ?? 0
  const notStarted = overview?.notStarted ?? 0
  const certifiedCount = overview?.certified ?? (certs ?? 0)
  const _totalSessions = overview?.totalSessions ?? (sessions?.length ?? 0)
  const avgScore = overview?.avgScore ?? (sessions?.length
    ? Math.round(sessions.reduce((s, sess) => s + (sess.score ?? 0), 0) / sessions.length)
    : null)
  const passRate = overview?.passRate ?? (sessions?.length
    ? Math.round((sessions.filter(s => (s.score ?? 0) >= 63).length / sessions.length) * 100)
    : null)
  const rating = avgScore !== null ? scoreRating(avgScore) : null

  const QUICK_LINKS = [
    { label: 'Leaderboard', icon: <Trophy size={18} />, path: '/admin/leaderboard' },
    { label: 'Trainees', icon: <Users size={18} />, path: '/admin/trainees' },
    { label: 'Compliance Report', icon: <BarChart2 size={18} />, path: '/admin/compliance' },
    { label: 'Certificates', icon: <Award size={18} />, path: '/admin/certificates' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--navbar-height) + 24px)', paddingBottom: 48 }}>
        <div className="page-container">

          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 28,
            gap: 16,
            flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <Shield size={22} style={{ color: 'var(--color-brand)' }} />
                <h1 style={{ fontSize: 'var(--text-2xl)' }}>Admin Dashboard</h1>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                Industrial Safety Compliance Overview · Jharkhand Mining & Manufacturing
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setCreateModalOpen(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <UserPlus size={16} /> Create Trainee Account
            </button>
          </div>

          {/* Quick links */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
            {QUICK_LINKS.map(l => (
              <button key={l.path} className="btn btn-secondary" onClick={() => navigate(l.path)}>
                {l.icon} {l.label} <ChevronRight size={14} />
              </button>
            ))}
          </div>

          {/* Stat cards: Metrics grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 36 }}>
            <AdminStat
              icon={<Users size={20} style={{ color: '#6366f1' }} />}
              label="Total Trainees"
              value={loadP ? '…' : totalTrainees}
              bg="#EDEDFF"
              color="#6366f1"
              sub="Registered workers"
            />
            <AdminStat
              icon={<CheckCircle size={20} style={{ color: 'var(--color-success)' }} />}
              label="Completed Training"
              value={completedTraining}
              bg="var(--color-success-bg)"
              color="var(--color-success)"
              sub="All modules cleared"
            />
            <AdminStat
              icon={<TrendingUp size={20} style={{ color: 'var(--color-brand)' }} />}
              label="In Progress"
              value={inProgress}
              bg="var(--color-brand-50)"
              color="var(--color-brand)"
              sub="Active training sessions"
            />
            <AdminStat
              icon={<Clock size={20} style={{ color: '#7A7A7A' }} />}
              label="Pending / Not Started"
              value={notStarted}
              bg="var(--color-surface-alt)"
              color="var(--color-text-secondary)"
              sub="Awaiting first attempt"
            />
            <AdminStat
              icon={<Award size={20} style={{ color: '#D97706' }} />}
              label="Certified Trainees"
              value={certifiedCount}
              bg="#FEF3C7"
              color="#D97706"
              sub="Valid QR certificates"
            />
            <AdminStat
              icon={<BarChart2 size={20} style={{ color: rating?.color ?? 'var(--color-text-muted)' }} />}
              label="Platform Avg Score"
              value={avgScore !== null ? `${avgScore} pts` : '—'}
              bg={rating?.bg ?? 'var(--color-surface-alt)'}
              color={rating?.color ?? 'var(--color-text-muted)'}
              sub={rating?.label}
            />
            {passRate !== null && (
              <AdminStat
                icon={<Shield size={20} style={{ color: passRate >= 60 ? 'var(--color-success)' : 'var(--color-warning)' }} />}
                label="Pass Rate"
                value={`${passRate}%`}
                bg={passRate >= 60 ? 'var(--color-success-bg)' : 'var(--color-warning-bg)'}
                color={passRate >= 60 ? 'var(--color-success)' : 'var(--color-warning)'}
                sub="≥ 63 pts threshold"
              />
            )}
          </div>

          {/* Compliance alert if pass rate < 60 */}
          {passRate !== null && passRate < 60 && (
            <div className="alert alert-warning" style={{ marginBottom: 24 }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <div>
                <strong>Compliance Alert:</strong> Platform pass rate is {passRate}%, below the 60% target.
                Review trainees who have failed multiple attempts and consider supplementary training sessions.
              </div>
            </div>
          )}

          {/* Recent sessions table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: 'var(--text-lg)' }}>Recent Training Activity</h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                Last 20 completed sessions across all trainees
              </p>
            </div>
            {loadS ? (
              <div style={{ padding: 32, textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto' }} />
              </div>
            ) : !sessions?.length ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                No sessions yet. Trainees will appear here after completing training modules.
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr><th>Trainee</th><th>Module</th><th>Score</th><th>Date</th><th></th></tr>
                  </thead>
                  <tbody>
                    {sessions.slice(0, 20).map(sess => {
                      const r = scoreRating(sess.score ?? 0)
                      return (
                        <tr key={sess.id}>
                          <td style={{ fontWeight: 500 }}>{sess.profiles?.full_name ?? sess.user_id?.slice(0, 8)}</td>
                          <td>{sess.scenarios?.title ?? '—'}</td>
                          <td>
                            <span style={{ fontWeight: 700, color: r.color }}>{sess.score ?? 0}</span>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>/105</span>
                          </td>
                          <td>{fmtDate(sess.completed_at)}</td>
                          <td>
                            <button className="btn btn-ghost btn-sm"
                              onClick={() => navigate(`/admin/trainees/${sess.user_id}`)}>
                              View <ChevronRight size={12} />
                            </button>
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

      <CreateTraineeModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['admin-overview'] })
          queryClient.invalidateQueries({ queryKey: ['admin-profiles'] })
          queryClient.invalidateQueries({ queryKey: ['admin-sessions'] })
          queryClient.invalidateQueries({ queryKey: ['admin-leaderboard'] })
        }}
      />
    </div>
  )
}

function AdminStat({ icon, label, value, bg, color, sub }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ width: 44, height: 44, background: bg, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
      <div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
        <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color, lineHeight: 1.2, marginTop: 2 }}>{value}</p>
        {sub && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>{sub}</p>}
      </div>
    </div>
  )
}
