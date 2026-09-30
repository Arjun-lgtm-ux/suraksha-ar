import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function AdminRoute({ children }) {
  const { user, profile, loading } = useAuth()

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

  // Not logged in → to login
  if (!user) return <Navigate to="/admin-login" replace />
  // Logged in but not admin → sign out is handled by AdminLogin, just redirect
  if (profile && profile.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}
