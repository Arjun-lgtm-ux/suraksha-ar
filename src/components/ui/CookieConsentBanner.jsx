import { useState, useEffect } from 'react'
import { ShieldCheck, Cookie, X, Check } from 'lucide-react'

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState({
    essential: true, // Always required for app state, auth, and offline storage
    analytics: false,
    preferences: true,
  })

  useEffect(() => {
    try {
      const consent = localStorage.getItem('sar_cookie_consent')
      if (!consent) {
        // Small delay so it animates in smoothly without jarring the initial load
        const timer = setTimeout(() => setVisible(true), 800)
        return () => clearTimeout(timer)
      }
    } catch {
      // Ignore storage errors in private browsing
    }
  }, [])

  if (!visible) return null

  function handleAcceptAll() {
    try {
      localStorage.setItem('sar_cookie_consent', JSON.stringify({
        essential: true,
        analytics: true,
        preferences: true,
        timestamp: new Date().toISOString(),
      }))
    } catch {
      // storage unavailable
    }
    setVisible(false)
  }

  function handleSavePreferences() {
    try {
      localStorage.setItem('sar_cookie_consent', JSON.stringify({
        ...preferences,
        essential: true,
        timestamp: new Date().toISOString(),
      }))
    } catch {
      // storage unavailable
    }
    setVisible(false)
  }

  return (
    <aside
      aria-label="Privacy and Cookie Consent"
      style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        right: 20,
        maxWidth: 620,
        margin: '0 auto',
        zIndex: 9999,
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border-strong, var(--color-border))',
        borderRadius: 'var(--radius-lg, 14px)',
        boxShadow: 'var(--shadow-xl)',
        padding: '16px 20px',
        animation: 'slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-brand-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-brand)',
            flexShrink: 0,
          }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: 1.3,
            }}>
              Cookies & Local Safety Data
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              SurakshaAR Industrial Safety Compliance
            </span>
          </div>
        </div>

        <button
          onClick={handleAcceptAll}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            padding: 4,
            borderRadius: 4,
          }}
          aria-label="Dismiss cookie notice"
        >
          <X size={18} />
        </button>
      </div>

      <p style={{
        margin: 0,
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.55,
      }}>
        SurakshaAR uses essential local browser storage and cookies to record your training module progress, retain offline hazard models, store verifiable safety certificates, and remember accessibility preferences. No personally identifiable tracking is shared with third parties.
      </p>

      {showPreferences && (
        <div style={{
          background: 'var(--color-surface-alt)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          fontSize: 'var(--text-xs)',
        }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'not-allowed' }}>
            <span><strong>Essential Storage</strong> (Safety progress & offline AR cache)</span>
            <input type="checkbox" checked disabled style={{ accentColor: 'var(--color-brand)' }} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span><strong>Preferences</strong> (Language selection & Dark Mode)</span>
            <input
              type="checkbox"
              checked={preferences.preferences}
              onChange={e => setPreferences(p => ({ ...p, preferences: e.target.checked }))}
              style={{ accentColor: 'var(--color-brand)' }}
            />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span><strong>Performance Telemetry</strong> (Frame-rate & latency monitoring)</span>
            <input
              type="checkbox"
              checked={preferences.analytics}
              onChange={e => setPreferences(p => ({ ...p, analytics: e.target.checked }))}
              style={{ accentColor: 'var(--color-brand)' }}
            />
          </label>
        </div>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 10,
        flexWrap: 'wrap',
        marginTop: 2,
      }}>
        {!showPreferences ? (
          <button
            type="button"
            onClick={() => setShowPreferences(true)}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '7px 14px',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              transition: 'background var(--transition-fast)',
            }}
          >
            Manage Preferences
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSavePreferences}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '7px 14px',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
            }}
          >
            Save Choices
          </button>
        )}

        <button
          type="button"
          onClick={handleAcceptAll}
          style={{
            background: 'var(--color-brand)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '7px 16px',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Check size={14} />
          Accept All
        </button>
      </div>
    </aside>
  )
}
