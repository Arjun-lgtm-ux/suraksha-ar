import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, isSupabaseConfigured, friendlyAuthError } from '../lib/supabase'
import { mockSignIn, mockGetProfile } from '../lib/mockDb'

export default function AdminLogin() {
  const { refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!isSupabaseConfigured) {
        const { data, error: err } = await mockSignIn({ email, password })
        if (err) { setError(err.message); return }
        const { data: profile } = mockGetProfile(data.user.id)
        if (!profile || profile.role !== 'admin') {
          setError('This account does not have admin access. Contact your system administrator.')
          return
        }
        await refreshProfile()
        navigate('/admin', { replace: true })
      } else {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) { setError(friendlyAuthError(err)); return }
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
        if (!profile || profile.role !== 'admin') {
          await supabase.auth.signOut()
          setError('This account does not have admin access. Contact your system administrator.')
          return
        }
        navigate('/admin', { replace: true })
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1A1A1A', display: 'flex', flexDirection: 'column' }}>
      {/* Admin-distinctive top bar */}
      <div style={{
        background: '#0D0D0D', padding: '16px 24px',
        borderBottom: '2px solid var(--color-brand)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="Suraksha AR"
          style={{ height: 30, width: 'auto', objectFit: 'contain' }}
        />
        <span style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>SurakshaAR</span>
        <span className="badge badge-brand" style={{ marginLeft: 8 }}>ADMIN PORTAL</span>
      </div>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 60, height: 60, background: 'var(--color-brand)',
              borderRadius: 14, display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 14px',
            }}>
              <Lock size={28} color="white" />
            </div>
            <h1 style={{ color: 'white', fontSize: 'var(--text-xl)', marginBottom: 4 }}>Admin Login</h1>
            <p style={{ color: '#888', fontSize: 'var(--text-sm)' }}>Authorized personnel only</p>
          </div>

          <div style={{
            background: '#242424', border: '1px solid #333',
            borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)',
          }}>
            <div className="alert" style={{
              background: '#1A1000', border: '1px solid #4A3000',
              color: '#FFB347', marginBottom: 20, borderRadius: 'var(--radius-md)', padding: '12px 14px',
            }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 'var(--text-xs)' }}>
                Admin accounts are created by system administrators. No public registration.
              </span>
            </div>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: 20 }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 'var(--text-sm)' }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-email" style={{ color: '#CCC' }}>Admin Email</label>
                <input id="admin-email" type="email" className="form-input"
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="admin@example.com" required autoComplete="email"
                  style={{ background: '#1A1A1A', color: 'white', borderColor: '#444' }} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-pw" style={{ color: '#CCC' }}>Password</label>
                <div className="form-input-group">
                  <input id="admin-pw" type={showPw ? 'text' : 'password'} className="form-input"
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" required autoComplete="current-password"
                    style={{ background: '#1A1A1A', color: 'white', borderColor: '#444' }} />
                  <button type="button" className="form-input-icon" onClick={() => setShowPw(v => !v)} style={{ color: '#888' }}>
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
                {loading
                  ? <><div className="spinner spinner-sm" style={{ borderTopColor: 'white' }} />&nbsp;Authenticating…</>
                  : <><Lock size={16} /> Access Admin Portal</>
                }
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/login" style={{ color: '#888', fontSize: 'var(--text-xs)' }}>← Return to Trainee Login</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
