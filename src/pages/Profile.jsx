import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Save, Award, LogOut, AlertCircle, CheckCircle, Camera, RefreshCw } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLang } from '../contexts/LanguageContext'
import { SUPPORTED_LANGUAGES } from '../lib/i18n'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { mockUpdateProfile, mockGetSessions } from '../lib/mockDb'
import { scoreRating } from '../lib/scoring'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { UserAvatar } from '../components/ui/UserAvatar'

function fmtDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Profile() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const { T } = useLang()
  const navigate = useNavigate()

  const [fullName, setFullName]         = useState('')
  const [siteLocation, setSiteLocation] = useState('')
  const [prefLang, setPrefLang]         = useState('en')
  const [saving, setSaving]             = useState(false)
  const [saveMsg, setSaveMsg]           = useState('')
  const fileInputRef                    = useRef(null)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '')
      setSiteLocation(profile.site_location ?? '')
      setPrefLang(profile.preferred_language ?? 'en')
    }
  }, [profile])

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas')
          const maxDim = 256
          let w = img.width, h = img.height
          if (w > h) { if (w > maxDim) { h = Math.round((h * maxDim) / w); w = maxDim } }
          else { if (h > maxDim) { w = Math.round((w * maxDim) / h); h = maxDim } }
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, w, h)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85)

          if (!isSupabaseConfigured) {
            await mockUpdateProfile(user.id, { avatar_url: dataUrl })
          } else {
            await supabase.from('profiles').update({ avatar_url: dataUrl }).eq('id', user.id)
          }
          await refreshProfile()
          setSaveMsg('Profile photo updated successfully!')
          setTimeout(() => setSaveMsg(''), 3000)
        } catch (err) {
          console.error('[Profile] Photo upload failed:', err)
          setSaveMsg('Failed to update photo.')
        }
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  async function handleResetGmailPhoto() {
    try {
      if (!isSupabaseConfigured) {
        await mockUpdateProfile(user.id, { avatar_url: null })
      } else {
        await supabase.from('profiles').update({ avatar_url: null }).eq('id', user.id)
      }
      await refreshProfile()
      setSaveMsg('Reset to default avatar!')
      setTimeout(() => setSaveMsg(''), 3000)
    } catch {
      setSaveMsg('Failed to reset photo.')
    }
  }

  const { data: sessions } = useQuery({
    queryKey: ['profile-sessions', user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockGetSessions(user.id).data ?? []
      const { data } = await supabase.from('training_sessions').select('*, scenarios(title)')
        .eq('user_id', user.id).eq('status', 'completed')
        .order('completed_at', { ascending: false }).limit(10)
      return data ?? []
    },
  })

  const { data: certs } = useQuery({
    queryKey: ['profile-certs', user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        const all = JSON.parse(localStorage.getItem('mock_certificates') ?? '[]')
        return all.filter(c => c.user_id === user.id)
      }
      const { data } = await supabase.from('certificates').select('*')
        .eq('user_id', user.id).eq('status', 'valid')
        .order('issued_at', { ascending: false })
      return data ?? []
    },
  })

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaveMsg('')
    try {
      if (!isSupabaseConfigured) {
        mockUpdateProfile(user.id, { full_name: fullName, site_location: siteLocation, preferred_language: prefLang })
      } else {
        await supabase.from('profiles').update({
          full_name: fullName, site_location: siteLocation, preferred_language: prefLang,
        }).eq('id', user.id)
      }
      await refreshProfile()
      setSaveMsg('Profile updated successfully!')
      setTimeout(() => setSaveMsg(''), 3000)
    } catch {
      setSaveMsg('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--navbar-height) + 24px)', paddingBottom: 48 }}>
        <div className="page-container" style={{ maxWidth: 720 }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 4 }}>{T('profile')}</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Manage your training profile and view your history</p>
          </div>

          {/* Profile form */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <UserAvatar user={user} profile={profile} size={64} style={{ border: '2.5px solid var(--color-brand)' }} />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload / Change Photo"
                  style={{
                    position: 'absolute', bottom: -4, right: -4,
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'var(--color-brand)', color: '#FFFFFF',
                    border: '2px solid var(--color-surface)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  }}
                >
                  <Camera size={13} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </div>

              <div style={{ minWidth: 0, flex: 1, wordBreak: 'break-word' }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{profile?.full_name ?? 'Trainee'}</span>
                  <span className="badge badge-brand" style={{ fontSize: '0.65rem' }}>TRAINEE</span>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', wordBreak: 'break-all', marginTop: 2 }}>
                  {user?.email}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      background: 'var(--color-surface-alt)', border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm, 6px)', padding: '4px 10px',
                      fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-primary)',
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
                    }}
                  >
                    <Camera size={12} color="var(--color-brand)" /> Change Photo
                  </button>
                  {profile?.avatar_url && (
                    <button
                      type="button"
                      onClick={handleResetGmailPhoto}
                      style={{
                        background: 'transparent', border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm, 6px)', padding: '4px 10px',
                        fontSize: '0.72rem', fontWeight: 500, color: 'var(--color-text-muted)',
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <RefreshCw size={11} /> Reset Photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {saveMsg && (
              <div className={`alert ${saveMsg.includes('Failed') ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: 20 }}>
                {saveMsg.includes('Failed') ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
                {saveMsg}
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">{T('fullName')}</label>
                <input type="text" className="form-input" value={fullName}
                  onChange={e => setFullName(e.target.value)} placeholder="Your full name" />
              </div>
              <div className="form-group">
                <label className="form-label">Site / Plant Location</label>
                <input type="text" className="form-input" value={siteLocation}
                  onChange={e => setSiteLocation(e.target.value)}
                  placeholder="e.g., Jharia Coalfields, Bokaro Steel Plant" />
              </div>
              <div className="form-group">
                <label className="form-label">{T('preferredLanguage')}</label>
                <select className="form-select" value={prefLang} onChange={e => setPrefLang(e.target.value)}>
                  {SUPPORTED_LANGUAGES.map(l => (
                    <option key={l.code} value={l.code}>{l.flag} {l.nativeLabel}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <div className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> : <Save size={16} />}
                  {saving ? 'Saving…' : T('save')}
                </button>
                <button type="button" className="btn btn-danger" onClick={async () => { await signOut(); navigate('/login') }}>
                  <LogOut size={16} /> {T('logout')}
                </button>
              </div>
            </form>
          </div>

          {/* Certificates */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 16 }}>
              <Award size={18} style={{ display: 'inline', marginRight: 8, color: 'var(--color-brand)', verticalAlign: 'middle' }} />
              My Certificates
            </h2>
            {!certs?.length ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                No certificates yet. Complete a training module and pass the assessment to earn your first certificate.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {certs.map(c => (
                  <div key={c.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', background: 'var(--color-success-bg)',
                    border: '1px solid var(--color-success-border)', borderRadius: 'var(--radius-md)',
                  }}>
                    <Award size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{c.course_name}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                        {c.cert_number} · {fmtDate(c.issued_at)}
                      </div>
                    </div>
                    <button className="btn btn-sm btn-ghost" onClick={() => navigate(`/certificate/${c.id}`)}>View</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Session history */}
          <div className="card">
            <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 16 }}>Session History</h2>
            {!sessions?.length ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>No completed sessions yet.</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead><tr><th>Module</th><th>Score</th><th>Date</th></tr></thead>
                  <tbody>
                    {sessions.map(s => {
                      const r = scoreRating(s.score ?? 0)
                      return (
                        <tr key={s.id}>
                          <td style={{ fontWeight: 500 }}>{s.scenarios?.title ?? s.scenario?.title ?? s.course_name ?? 'Industrial Safety Scenario'}</td>
                          <td>
                            <span style={{ fontWeight: 700, color: r.color }}>{s.score ?? 0}</span>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>/105</span>
                          </td>
                          <td>{fmtDate(s.completed_at || s.created_at || s.started_at)}</td>
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

      <Footer />
    </div>
  )
}
