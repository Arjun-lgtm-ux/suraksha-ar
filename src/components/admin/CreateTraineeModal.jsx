import { useState } from 'react'
import { X, UserPlus, Eye, EyeOff, AlertCircle, CheckCircle, Shield } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { mockCreateTraineeByAdmin } from '../../lib/mockDb'
import { isSupabaseConfigured, supabase } from '../../lib/supabase'

export default function CreateTraineeModal({ isOpen, onClose, onSuccess }) {
  const { user } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('Trainee@123')
  const [showPassword, setShowPassword] = useState(false)
  const [language, setLanguage] = useState('hi')
  const [assignedModules, setAssignedModules] = useState(['a1b2c3d4-0001-0001-0001-000000000001'])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  if (!isOpen) return null

  const MODULE_OPTIONS = [
    { id: 'a1b2c3d4-0001-0001-0001-000000000001', title: 'Fire & Explosion Response (Core Industrial Safety)' },
    { id: 'a1b2c3d4-0002-0002-0002-000000000002', title: 'Gas Leak & Confined Space Protocol (Mining Safety)' },
  ]

  function toggleModule(id) {
    if (assignedModules.includes(id)) {
      if (assignedModules.length > 1) {
        setAssignedModules(assignedModules.filter(m => m !== id))
      }
    } else {
      setAssignedModules([...assignedModules, id])
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setLoading(true)

    try {
      if (!isSupabaseConfigured) {
        const res = await mockCreateTraineeByAdmin({
          adminUserId: user?.id || 'demo-admin-00000000-0000-0000-0000',
          fullName,
          email,
          mobile,
          password,
          language,
          assignedModuleIds: assignedModules,
        })

        if (res.error) {
          setError(res.error.message || 'Failed to create trainee account.')
          return
        }

        setSuccessMsg(`Trainee account created successfully for ${fullName || email}!`)
        setTimeout(() => {
          onSuccess?.(res.data)
          onClose()
        }, 1200)
      } else {
        // Supabase implementation
        const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name: fullName, role: 'trainee' },
        })

        if (authErr) {
          setError(authErr.message)
          return
        }

        const { error: profileErr } = await supabase.from('profiles').insert({
          id: authData.user.id,
          full_name: fullName,
          email,
          mobile,
          role: 'trainee',
          preferred_language: language,
        })

        if (profileErr) {
          setError(profileErr.message)
          return
        }

        setSuccessMsg(`Trainee account created successfully!`)
        setTimeout(() => {
          onSuccess?.()
          onClose()
        }, 1200)
      }
    } catch (err) {
      setError(err?.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 'var(--z-overlay)',
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: 520,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--color-surface-alt)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-brand-50)',
                color: 'var(--color-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserPlus size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 700, margin: 0 }}>
                Create Trainee Account
              </h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                Register industrial worker for safety AR training modules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: 6, color: 'var(--color-text-muted)' }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div className="alert alert-error" style={{ padding: '10px 14px', fontSize: 'var(--text-xs)' }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success" style={{ padding: '10px 14px', fontSize: 'var(--text-xs)' }}>
              <CheckCircle size={14} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-input"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. Ramesh Chandra Verma"
              required
            />
          </div>

          {/* Email / Username */}
          <div className="form-group">
            <label className="form-label">Work Email / Unique Username *</label>
            <input
              type="text"
              className="form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. ramesh.verma@bokarosteel.in"
              required
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
              Used by trainee to sign in on the Trainee Login page.
            </span>
          </div>

          {/* Mobile */}
          <div className="form-group">
            <label className="form-label">Mobile Number (Optional)</label>
            <input
              type="tel"
              className="form-input"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Initial Password *</label>
            <div className="form-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Initial password"
                required
              />
              <button
                type="button"
                className="form-input-icon"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Language Selection */}
          <div className="form-group">
            <label className="form-label">Preferred Training Language</label>
            <select
              className="form-select"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              <option value="hi">🇮🇳 हिंदी (Hindi) - Recommended for field workers</option>
              <option value="sat">🌿 ᱥᱟᱱᱛᱟᱲᱤ (Santali / Ol Chiki)</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>

          {/* Assigned Modules */}
          <div className="form-group">
            <label className="form-label">Assigned Training Module(s) *</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              {MODULE_OPTIONS.map(mod => {
                const checked = assignedModules.includes(mod.id)
                return (
                  <label
                    key={mod.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      background: checked ? 'var(--color-brand-50)' : 'var(--color-surface-alt)',
                      border: checked ? '1.5px solid var(--color-brand)' : '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      fontSize: 'var(--text-xs)',
                      fontWeight: checked ? 600 : 400,
                      color: checked ? 'var(--color-brand-dark)' : 'var(--color-text-primary)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleModule(mod.id)}
                      style={{ accentColor: 'var(--color-brand)', width: 16, height: 16 }}
                    />
                    <Shield size={14} style={{ flexShrink: 0 }} />
                    <span>{mod.title}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !email.trim() || !password.trim()}
            >
              {loading ? 'Creating...' : 'Create Trainee Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
