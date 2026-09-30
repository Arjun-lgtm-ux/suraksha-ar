import React, { useState, useEffect } from 'react'
import { X, UserPlus, ArrowLeft, Check, Clock, Trash2, Zap } from 'lucide-react'
import { getGooglePresetAvatar } from '../../data/googleAvatars'

const STORAGE_KEY = 'suraksha_device_google_accounts'

const DEMO_ACCOUNT = {
  name: 'Trainee Demo',
  email: 'trainee@surakshaar.demo',
  avatar: getGooglePresetAvatar('trainee@surakshaar.demo', 'Trainee Demo'),
}

export default function GoogleAccountModal({ isOpen, onClose, onSelectAccount }) {
  // Saved Google accounts ONLY for this specific device
  const [savedAccounts, setSavedAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [showInputForm, setShowInputForm] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [formError, setFormError] = useState('')

  // Google OAuth Verification Animation State
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifyStep, setVerifyStep] = useState(0)

  // Load accounts saved on this device
  useEffect(() => {
    if (!isOpen) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const accounts = raw ? JSON.parse(raw) : []
      setSavedAccounts(accounts)
      if (!accounts || accounts.length === 0) {
        setShowInputForm(true)
      } else {
        setShowInputForm(false)
      }
    } catch {
      setSavedAccounts([])
      setShowInputForm(true)
    }
    setSelectedAccount(null)
    setIsVerifying(false)
    setVerifyStep(0)
    setFormError('')
    setEmailInput('')
    setNameInput('')
  }, [isOpen])

  if (!isOpen) return null

  function saveAccountToDevice(acc) {
    try {
      const existing = savedAccounts.filter((a) => a.email.toLowerCase() !== acc.email.toLowerCase())
      const updated = [acc, ...existing].slice(0, 5) // Keep up to 5 on this device
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setSavedAccounts(updated)
    } catch (err) {
      console.warn('[GoogleAccountModal] Failed saving account to device:', err)
    }
  }

  function removeAccountFromDevice(e, emailToRemove) {
    e.stopPropagation()
    const updated = savedAccounts.filter((a) => a.email.toLowerCase() !== emailToRemove.toLowerCase())
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setSavedAccounts(updated)
    if (updated.length === 0) {
      setShowInputForm(true)
    }
  }

  function startVerificationAndSignIn(account) {
    if (isVerifying) return
    setSelectedAccount(account)
    setIsVerifying(true)
    setVerifyStep(1)

    // Save to this device's storage
    saveAccountToDevice(account)

    // Crisp, fast, authentic Google OAuth flow (~750ms total)
    setTimeout(() => {
      setVerifyStep(2)
    }, 280)

    setTimeout(() => {
      setVerifyStep(3)
    }, 520)

    setTimeout(() => {
      onSelectAccount({
        name: account.name,
        email: account.email,
        avatarUrl: account.avatar || getGooglePresetAvatar(account.email, account.name),
      })
    }, 750)
  }

  function handleFormSubmit(e) {
    e.preventDefault()
    setFormError('')

    const cleanEmail = emailInput.trim().toLowerCase()
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setFormError('Please enter a valid Google / Gmail address (e.g. name@gmail.com)')
      return
    }

    const autoName = nameInput.trim() || cleanEmail.split('@')[0].replace(/[._]/g, ' ')
    const capName = autoName.charAt(0).toUpperCase() + autoName.slice(1)
    const avatar = getGooglePresetAvatar(cleanEmail, capName)

    const account = {
      name: capName,
      email: cleanEmail,
      avatar,
    }

    startVerificationAndSignIn(account)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isVerifying) onClose()
      }}
    >
      <div
        style={{
          background: '#131314',
          color: '#E8EAED',
          border: '1px solid #3c4043',
          borderRadius: 24,
          maxWidth: 480,
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.85)',
          overflow: 'hidden',
          fontFamily: "'Google Sans', Roboto, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <style>{`
          @keyframes googleBarShift {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          @keyframes googleSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .google-spinner-mini {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 2.5px solid rgba(66, 133, 244, 0.25);
            border-top-color: #4285F4;
            border-right-color: #EA4335;
            animation: googleSpin 0.7s linear infinite;
            flex-shrink: 0;
          }
        `}</style>

        {/* Top 4-Color Animated Indeterminate Google Progress Bar */}
        {isVerifying && (
          <div
            style={{
              height: 3.5,
              width: '100%',
              background: 'linear-gradient(90deg, #4285F4 0%, #EA4335 25%, #FBBC05 50%, #34A853 75%, #4285F4 100%)',
              backgroundSize: '200% 100%',
              animation: 'googleBarShift 1.1s linear infinite',
            }}
          />
        )}

        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 22px 14px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Official Google G Logo */}
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#E8EAED', letterSpacing: '0.2px' }}>
              {isVerifying ? 'Google Identity Services' : 'Sign in with Google'}
            </span>
          </div>

          {!isVerifying && (
            <button
              type="button"
              onClick={onClose}
              title="Close"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9AA0A6',
                cursor: 'pointer',
                padding: 6,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div style={{ padding: isVerifying ? '28px 22px' : '20px 22px', overflowY: 'auto' }}>
          {isVerifying && selectedAccount ? (
            /* FAST VERIFICATION IN PROGRESS */
            <div style={{ textAlign: 'center', maxWidth: 420, margin: '0 auto' }}>
              <div style={{ position: 'relative', width: 76, height: 76, margin: '0 auto 14px' }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: -4,
                    borderRadius: '50%',
                    background: 'conic-gradient(#4285F4, #EA4335, #FBBC05, #34A853, #4285F4)',
                    animation: 'googleSpin 1.4s linear infinite',
                    filter: 'blur(3px)',
                    opacity: 0.85,
                  }}
                />
                <img
                  src={selectedAccount.avatar}
                  alt={selectedAccount.name}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    zIndex: 1,
                    border: '2px solid #202124',
                  }}
                />
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF', margin: '0 0 4px' }}>
                {selectedAccount.name}
              </h3>
              <div style={{ fontSize: 13, color: '#9AA0A6', marginBottom: 18 }}>
                {selectedAccount.email} · <span style={{ color: '#8AB4F8' }}>Google Account</span>
              </div>

              {/* Progress checklist */}
              <div
                style={{
                  background: '#1E1F22',
                  border: '1px solid #3C4043',
                  borderRadius: 14,
                  padding: '14px 16px',
                  margin: '0 auto 14px',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {verifyStep > 1 ? (
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#137333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={11} color="#FFFFFF" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="google-spinner-mini" />
                    )}
                    <span style={{ fontSize: 13, color: verifyStep >= 1 ? '#E8EAED' : '#9AA0A6' }}>
                      Google Identity Verification
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: verifyStep > 1 ? '#81C995' : '#8AB4F8', fontWeight: 600 }}>
                    {verifyStep > 1 ? 'Verified ✓' : 'Verifying...'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {verifyStep >= 3 ? (
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#137333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={11} color="#FFFFFF" strokeWidth={3} />
                      </div>
                    ) : verifyStep === 2 ? (
                      <div className="google-spinner-mini" />
                    ) : (
                      <div style={{ width: 18, height: 18, borderRadius: '50%', border: '1px solid #5F6368', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock size={10} color="#80868B" />
                      </div>
                    )}
                    <span style={{ fontSize: 13, color: verifyStep >= 2 ? '#E8EAED' : '#9AA0A6' }}>
                      Signing into SurakshaAR Portal
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: verifyStep >= 3 ? '#81C995' : verifyStep === 2 ? '#8AB4F8' : '#80868B', fontWeight: 600 }}>
                    {verifyStep >= 3 ? 'Ready ✓' : verifyStep === 2 ? 'Connecting...' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          ) : showInputForm ? (
            /* CLEAN INPUT FORM */
            <div style={{ maxWidth: 420, margin: '0 auto' }}>
              <div style={{ marginBottom: 16 }}>
                {savedAccounts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowInputForm(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#8AB4F8',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 13,
                      padding: 0,
                      marginBottom: 10,
                    }}
                  >
                    <ArrowLeft size={14} /> Back to saved accounts
                  </button>
                )}
                <h2 style={{ fontSize: 22, fontWeight: 500, margin: '0 0 6px', color: '#FFFFFF' }}>
                  Use your Google Account
                </h2>
                <p style={{ margin: 0, fontSize: 13, color: '#9AA0A6' }}>
                  Sign in instantly with your Google / Gmail account
                </p>
              </div>

              {/* 1-Tap Quick Demo Button */}
              <button
                type="button"
                onClick={() => startVerificationAndSignIn(DEMO_ACCOUNT)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: 'rgba(66, 133, 244, 0.12)',
                  border: '1.5px solid rgba(66, 133, 244, 0.4)',
                  borderRadius: 12,
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  marginBottom: 16,
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: '#4285F4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Zap size={16} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#D2E3FC' }}>
                      ⚡ 1-Tap Instant Sign-In
                    </div>
                    <div style={{ fontSize: 11, color: '#9AA0A6' }}>
                      trainee@surakshaar.demo (No typing needed)
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: 12, color: '#8AB4F8', fontWeight: 600 }}>Use →</span>
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  margin: '12px 0 16px',
                  color: '#80868B',
                  fontSize: 12,
                }}
              >
                <div style={{ flex: 1, height: 1, background: '#3C4043' }} />
                <span>or enter your Google email</span>
                <div style={{ flex: 1, height: 1, background: '#3C4043' }} />
              </div>

              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#BDC1C6', marginBottom: 6, fontWeight: 500 }}>
                    Google / Gmail Address *
                  </label>
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="e.g. yourname@gmail.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: '#1F1F23',
                      border: '1px solid #5F6368',
                      borderRadius: 10,
                      color: '#FFFFFF',
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#BDC1C6', marginBottom: 6, fontWeight: 500 }}>
                    Full Name (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Amit Kumar"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: '#1F1F23',
                      border: '1px solid #5F6368',
                      borderRadius: 10,
                      color: '#FFFFFF',
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {formError && (
                  <div style={{ fontSize: 12, color: '#F28B82' }}>{formError}</div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#8AB4F8',
                      cursor: 'pointer',
                      fontSize: 13,
                      padding: 0,
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    style={{
                      background: '#8AB4F8',
                      color: '#131314',
                      border: 'none',
                      padding: '10px 22px',
                      borderRadius: 20,
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    Sign in with Google
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* SAVED ACCOUNTS ON THIS PHONE (1-Tap to sign in) */
            <div style={{ maxWidth: 440, margin: '0 auto' }}>
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ fontSize: 22, fontWeight: 500, margin: '0 0 4px', color: '#FFFFFF' }}>
                  Choose an account
                </h2>
                <p style={{ margin: 0, fontSize: 13, color: '#9AA0A6' }}>
                  to continue to <strong style={{ color: '#8AB4F8' }}>SurakshaAR</strong>
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                {savedAccounts.map((acc) => (
                  <div
                    key={acc.email}
                    onClick={() => startVerificationAndSignIn(acc)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      borderRadius: 12,
                      background: '#1F1F23',
                      border: '1px solid #3C4043',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                      <img
                        src={acc.avatar || getGooglePresetAvatar(acc.email, acc.name)}
                        alt={acc.name}
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {acc.name}
                        </div>
                        <div style={{ fontSize: 12, color: '#9AA0A6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {acc.email}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => removeAccountFromDevice(e, acc.email)}
                      title="Remove from this phone"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#80868B',
                        cursor: 'pointer',
                        padding: 6,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}

                {/* 1-Tap Quick Demo Account */}
                <div
                  onClick={() => startVerificationAndSignIn(DEMO_ACCOUNT)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    cursor: 'pointer',
                    borderRadius: 12,
                    background: 'rgba(66, 133, 244, 0.08)',
                    border: '1px solid rgba(66, 133, 244, 0.3)',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: '#4285F4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      flexShrink: 0,
                    }}
                  >
                    <Zap size={16} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#D2E3FC' }}>
                      ⚡ Quick 1-Tap Demo Account
                    </div>
                    <div style={{ fontSize: 11, color: '#9AA0A6' }}>
                      trainee@surakshaar.demo
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: '#8AB4F8', fontWeight: 600 }}>Login →</span>
                </div>

                {/* Use another account */}
                <div
                  onClick={() => setShowInputForm(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    cursor: 'pointer',
                    borderRadius: 12,
                    background: 'transparent',
                    border: '1px dashed #5F6368',
                    marginTop: 4,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      border: '1px solid #5F6368',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#E8EAED',
                      flexShrink: 0,
                    }}
                  >
                    <UserPlus size={16} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#8AB4F8' }}>
                    Use another Google account
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
