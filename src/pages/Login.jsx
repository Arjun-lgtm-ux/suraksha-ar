import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLang } from '../contexts/LanguageContext'
import { supabase, isSupabaseConfigured, friendlyAuthError } from '../lib/supabase'
import { mockSignIn } from '../lib/mockDb'
import GoogleAccountModal from '../components/auth/GoogleAccountModal'
import { Navbar } from '../components/layout/Navbar'

export default function Login() {
  const { user, profile, refreshProfile, loginWithGoogle, loading: authLoading } = useAuth()
  const { T } = useLang()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && user) {
      navigate(profile?.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
    }
  }, [user, profile, authLoading, navigate])

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [showGoogleModal, setShowGoogleModal] = useState(false)

  async function handleGoogleSignIn() {
    setError('')
    if (isSupabaseConfigured) {
      setLoading(true)
      try {
        const { error: err } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/SurakshaAR/dashboard`,
          },
        })
        if (err) setError(friendlyAuthError(err))
      } catch {
        setError('Google Sign-in failed. Please try again.')
      } finally {
        setLoading(false)
      }
    } else {
      setShowGoogleModal(true)
    }
  }

  async function handleSelectGoogleAccount({ name, email: accEmail, avatarUrl }) {
    setShowGoogleModal(false)
    setLoading(true)
    setError('')
    try {
      const cleanEmail = accEmail.trim().toLowerCase()
      const res = await loginWithGoogle({
        email: cleanEmail,
        fullName: name,
        avatarUrl: avatarUrl || null,
        language: 'en',
      })
      if (res?.error) {
        setError(res.error.message || 'Google Sign-in failed. Please try again.')
        setLoading(false)
        return
      }
      navigate('/dashboard', { replace: true })
    } catch (e) {
      console.error('[Google Sign-in error]', e)
      setError('Google Sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!isSupabaseConfigured) {
        const { data, error: err } = await mockSignIn({ email, password })
        if (err) { setError(err.message); setLoading(false); return }
        if (data?.session?.role === 'admin') {
          // Reject admin login on trainee portal
          setError('This portal is for Trainees only. Admin personnel must sign in via the Admin Login page (/admin-login).')
          setLoading(false)
          return
        }
        await refreshProfile()
        navigate('/dashboard', { replace: true })
      } else {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) { setError(friendlyAuthError(err)); setLoading(false); return }
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
        if (profile?.role === 'admin') {
          await supabase.auth.signOut()
          setError('This portal is for Trainees only. Admin personnel must sign in via the Admin Login page (/admin-login).')
          setLoading(false)
          return
        }
        navigate('/dashboard', { replace: true })
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <main style={{
        padding: `calc(var(--navbar-height) + 40px) var(--space-4) 40px`,
        display: 'flex', justifyContent: 'center',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <img
                src={`${import.meta.env.BASE_URL}images/surakshaar-logo.png`}
                alt="SurakshaAR"
                style={{
                  height: 60,
                  width: 'auto',
                  maxWidth: 260,
                  objectFit: 'contain',
                  display: 'block',
                  filter: 'drop-shadow(0 4px 16px rgba(224, 90, 0, 0.15))',
                }}
              />
            </Link>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 6 }}>Welcome Back</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              Sign in to continue your safety training
            </p>
          </div>

          <div className="card">
            {error && (
              <div className="alert alert-error" style={{ marginBottom: 20 }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* 1-Click Connect with Google / Gmail */}
            <button
              type="button"
              className="btn btn-secondary btn-full"
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{
                marginBottom: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                background: 'var(--color-surface)',
                border: '1.5px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                fontWeight: 600,
                padding: '10px 16px',
                borderRadius: 'var(--radius-md, 10px)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{T('signInWithGoogle') || 'Sign in with Google / Gmail'}</span>
            </button>

            <div className="divider-with-text" style={{ margin: '14px 0 16px' }}>
              {T('orLoginWith') || 'or sign in with email'}
            </div>

            {/* 1-Click Demo Login for Hackathon & Quick Evaluation */}
            <button
              type="button"
              className="btn btn-secondary btn-full"
              style={{
                marginBottom: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                borderColor: 'var(--color-brand)',
                color: 'var(--color-brand)',
                fontWeight: 700,
                background: 'rgba(224, 90, 0, 0.08)',
              }}
              onClick={async () => {
                setLoading(true)
                await mockSignIn({ email: 'trainee@suraksha.demo', password: 'demo' })
                await refreshProfile()
                navigate('/dashboard', { replace: true })
              }}
            >
              ⚡ 1-Click Quick Demo Sign In
            </button>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">{T('email')}</label>
                <input
                  id="email" type="email" className="form-input"
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">{T('password')}</label>
                <div className="form-input-group">
                  <input
                    id="password" type={showPw ? 'text' : 'password'}
                    className="form-input" value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" required autoComplete="current-password"
                  />
                  <button type="button" className="form-input-icon"
                    onClick={() => setShowPw(v => !v)}
                    aria-label={showPw ? T('hidePassword') : T('showPassword')}
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <button type="button" style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--color-brand)', fontSize: 'var(--text-sm)', fontWeight: 600,
                }}
                  onClick={() => alert('Password reset: Contact your site administrator or Safety Officer.')}
                >
                  {T('forgotPassword')}
                </button>
              </div>

              <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
                {loading
                  ? <><div className="spinner spinner-sm" style={{ borderTopColor: 'white' }} />&nbsp;Signing in…</>
                  : <><LogIn size={18} /> {T('signIn')}</>
                }
              </button>
            </form>

            <div className="divider-with-text" style={{ margin: '24px 0 20px' }}>{T('or')}</div>

            <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              {T('dontHaveAccount')}{' '}
              <Link to="/signup" style={{ color: 'var(--color-brand)', fontWeight: 700 }}>{T('register')}</Link>
            </p>
          </div>

          <p style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/admin-login" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              Admin Portal Login →
            </Link>
          </p>

          {!isSupabaseConfigured && (
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary btn-full"
                onClick={async () => {
                  setEmail('trainee@suraksha.demo')
                  setPassword('Demo@1234')
                  setLoading(true)
                  const { error: err } = await mockSignIn({ email: 'trainee@suraksha.demo', password: 'Demo@1234' })
                  if (!err) {
                    await refreshProfile()
                    navigate('/dashboard', { replace: true })
                  }
                  setLoading(false)
                }}
                style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}
              >
                ⚡ 1-Click Demo Trainee Login
              </button>

              <div className="alert alert-info" style={{ marginTop: 4 }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 'var(--text-xs)' }}>
                  <strong>Demo Mode Active:</strong> You can sign in with any email, or click the 1-click button above!
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      <GoogleAccountModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSelectAccount={handleSelectGoogleAccount}
      />
    </div>
  )
}
