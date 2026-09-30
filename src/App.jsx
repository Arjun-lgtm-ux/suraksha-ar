import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Capacitor } from '@capacitor/core'
import { LanguageProvider } from './contexts/LanguageContext'
import { AccessibilityProvider } from './contexts/AccessibilityContext'
import { OfflineProvider } from './contexts/OfflineContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AdminRoute } from './components/auth/AdminRoute'
import OfflineBanner from './components/ui/OfflineBanner'
import SafetyChatbot from './components/chatbot/SafetyChatbot'
import React, { Component, useEffect } from 'react'

// Pages
import Landing     from './pages/Landing'
import Login       from './pages/Login'
import Signup      from './pages/Signup'
import AdminLogin  from './pages/AdminLogin'
import Dashboard   from './pages/Dashboard'
import Tutorial    from './pages/Tutorial'
import Scenario    from './pages/Scenario'
import Assessment  from './pages/Assessment'
import Results     from './pages/Results'
import Certificate from './pages/Certificate'
import MyCertificates from './pages/MyCertificates'
import Verify      from './pages/Verify'
import Profile     from './pages/Profile'
import SetupGuide  from './pages/SetupGuide'
import About       from './pages/About'
import Terms       from './pages/Terms'
import Privacy     from './pages/Privacy'
import Contact     from './pages/Contact'
import Copyright   from './pages/Copyright'
import SafetyTips  from './pages/SafetyTips'
import CookieConsentBanner from './components/ui/CookieConsentBanner'
import Admin       from './pages/admin/Admin'
import AdminTrainees from './pages/admin/AdminTrainees'
import AdminTraineeDetail from './pages/admin/AdminTraineeDetail'
import AdminCompliance from './pages/admin/AdminCompliance'
import AdminCertificates from './pages/admin/AdminCertificates'
import AdminLeaderboard from './pages/admin/AdminLeaderboard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 2, retry: 1 },
  },
})

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: '#F7F5F1', padding: 24,
        }}>
          <div style={{
            background: 'white', border: '1px solid #E3DDD5', borderRadius: 14,
            padding: 32, maxWidth: 480, width: '100%', textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ color: '#C0392B', marginBottom: 12 }}>Application Error</h2>
            <p style={{ color: '#4A4A4A', fontSize: '0.9rem', marginBottom: 20 }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
              <button
                onClick={() => {
                  this.setState({ hasError: false })
                  window.location.hash = '#/dashboard'
                  window.location.reload()
                }}
                style={{
                  background: '#E05A00', color: 'white', border: 'none',
                  borderRadius: 10, padding: '12px 24px', fontWeight: 700,
                  cursor: 'pointer', fontSize: '1rem', width: '100%',
                }}
              >
                Return to Dashboard
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'transparent', color: '#4A4A4A', border: '1px solid #E3DDD5',
                  borderRadius: 10, padding: '10px 20px', fontWeight: 600,
                  cursor: 'pointer', fontSize: '0.9rem', width: '100%',
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function RootRoute() {
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

  const isNative = Capacitor.isNativePlatform()

  // On Native Mobile App (Capacitor Android APK / iOS):
  if (isNative) {
    if (user) {
      return <Navigate to={profile?.role === 'admin' ? '/admin' : '/dashboard'} replace />
    }
    // Brand new user / unregistered / fresh mobile install -> show Login page first
    return <Navigate to="/login" replace />
  }

  // On Web Browser:
  if (user) {
    return <Navigate to={profile?.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }
  return <Navigate to="/landing" replace />
}

function AndroidBackHandler() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.__handleAndroidBack = () => {
      // 1. If chatbot is expanded, close it first!
      const chatbotPanel = document.querySelector('.safety-chatbot-panel, [data-testid="chatbot-panel"]')
      const chatbotCloseBtn = document.querySelector('[data-testid="chatbot-close-btn"], .chatbot-close')
      if (chatbotPanel && chatbotCloseBtn) {
        chatbotCloseBtn.click()
        return true
      }

      // 2. If any modal or popup is open, close it!
      const modalClose = document.querySelector('[data-testid="modal-close-btn"], .modal-close, [aria-label="Close modal"]')
      if (modalClose) {
        modalClose.click()
        return true
      }

      // 3. If navigation drawer is open, close it!
      const drawerClose = document.querySelector('[data-testid="drawer-close-btn"], .drawer-close')
      if (drawerClose) {
        drawerClose.click()
        return true
      }

      const path = location.pathname

      // 4. If in AR Scenario task (/scenario/:id), navigate back to /dashboard safely
      if (path.startsWith('/scenario')) {
        navigate('/dashboard', { replace: true })
        return true
      }

      // 5. If in Tutorial, Assessment, or Results, navigate back to /dashboard
      if (path.startsWith('/tutorial') || path.startsWith('/assessment') || path.startsWith('/results')) {
        navigate('/dashboard', { replace: true })
        return true
      }

      // 6. If in Profile, My Certificates, About, Safety Tips, etc., return to /dashboard
      if (['/profile', '/my-certificates', '/about', '/terms', '/privacy', '/contact', '/copyright', '/safety-tips', '/setup-guide'].includes(path)) {
        navigate('/dashboard', { replace: true })
        return true
      }

      // 7. If on Signup or Admin Login, back goes to /login
      if (path === '/signup' || path === '/admin-login') {
        navigate('/login', { replace: true })
        return true
      }

      // 8. If on Root screens (/dashboard, /login, /landing, /), return false to let native double-tap exit trigger
      if (path === '/dashboard' || path === '/login' || path === '/landing' || path === '/') {
        return false
      }

      // Fallback: try navigating backwards
      navigate(-1)
      return true
    }

    return () => {
      window.__handleAndroidBack = null
    }
  }, [navigate, location])

  return null
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AccessibilityProvider>
            <AuthProvider>
              <OfflineProvider>
                <HashRouter>
                  <AndroidBackHandler />
                  <OfflineBanner />

                  <Routes>
                    {/* ── Public ── */}
                    <Route path="/landing"      element={<Landing />} />
                    <Route path="/login"        element={<Login />} />
                    <Route path="/signup"       element={<Signup />} />
                    <Route path="/admin-login"  element={<AdminLogin />} />
                    <Route path="/verify/:certNumber" element={<Verify />} />
                    <Route path="/setup-guide"        element={<SetupGuide />} />
                    <Route path="/about"              element={<About />} />
                    <Route path="/terms"              element={<Terms />} />
                    <Route path="/privacy"            element={<Privacy />} />
                    <Route path="/contact"            element={<Contact />} />
                    <Route path="/copyright"          element={<Copyright />} />
                    <Route path="/safety-tips"        element={<SafetyTips />} />

                    {/* ── Trainee (protected) ── */}
                    <Route path="/dashboard"             element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/tutorial/:id"          element={<ProtectedRoute><Tutorial /></ProtectedRoute>} />
                    <Route path="/scenario/:id"          element={<ProtectedRoute><Scenario /></ProtectedRoute>} />
                    <Route path="/assessment/:id"        element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
                    <Route path="/results/:sessionId"    element={<ProtectedRoute><Results /></ProtectedRoute>} />
                    <Route path="/certificate/:id"       element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
                    <Route path="/my-certificates"       element={<ProtectedRoute><MyCertificates /></ProtectedRoute>} />
                    <Route path="/profile"               element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                    {/* ── Admin (role-gated) ── */}
                    <Route path="/admin"                 element={<AdminRoute><Admin /></AdminRoute>} />
                    <Route path="/admin/trainees"        element={<AdminRoute><AdminTrainees /></AdminRoute>} />
                    <Route path="/admin/trainees/:id"    element={<AdminRoute><AdminTraineeDetail /></AdminRoute>} />
                    <Route path="/admin/compliance"      element={<AdminRoute><AdminCompliance /></AdminRoute>} />
                    <Route path="/admin/certificates"    element={<AdminRoute><AdminCertificates /></AdminRoute>} />
                    <Route path="/admin/leaderboard"     element={<AdminRoute><AdminLeaderboard /></AdminRoute>} />

                    {/* ── Default / Dynamic Root Route ── */}
                    <Route path="/" element={<RootRoute />} />
                    <Route path="*" element={<RootRoute />} />
                  </Routes>

                  {/* Safety chatbot persists across all protected pages */}
                  <SafetyChatbot />

                  {/* Cookie & privacy consent banner */}
                  <CookieConsentBanner />
                </HashRouter>
              </OfflineProvider>
            </AuthProvider>
          </AccessibilityProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
