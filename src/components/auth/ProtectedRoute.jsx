import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { isSupabaseConfigured } from '../../lib/supabase'
import { mockGetAuthSession } from '../../lib/mockDb'

export function ProtectedRoute({ children }) {
  const { user, profile, loading } = useAuth()

  // Guard against transient state sync delay in demo/mock mode
  if (!user && !isSupabaseConfigured) {
    const { data } = mockGetAuthSession()
    if (data?.session) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'var(--color-bg)', gap: 16,
        }}>
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="Suraksha AR"
            style={{ width: 72, height: 72, objectFit: 'contain', filter: 'drop-shadow(0 4px 14px rgba(224,90,0,0.18))' }}
          />
          <div className="spinner" style={{ borderTopColor: 'var(--color-brand)' }} />
        </div>
      )
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-bg)', gap: 16,
      }}>
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="Suraksha AR"
          style={{ width: 72, height: 72, objectFit: 'contain', filter: 'drop-shadow(0 4px 14px rgba(224,90,0,0.18))' }}
        />
        <div className="spinner" style={{ borderTopColor: 'var(--color-brand)' }} />
      </div>
    )
  }

  // Not logged in -> redirect to trainee login
  if (!user) return <Navigate to="/login" replace />

  // Admin trying to access trainee private dashboard/session -> redirect to admin dashboard
  if (profile?.role === 'admin') return <Navigate to="/admin" replace />

  return children
}
