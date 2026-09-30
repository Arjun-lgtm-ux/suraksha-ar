import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Award, ArrowRight, ShieldCheck, Calendar, CheckCircle2, FileText, ExternalLink } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLang } from '../contexts/LanguageContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { scoreRating } from '../lib/scoring'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

function fmtDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function MyCertificates() {
  const { user, profile } = useAuth()
  const { T } = useLang()
  const navigate = useNavigate()

  const { data: certs = [], isLoading } = useQuery({
    queryKey: ['my-certificates', user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        const all = JSON.parse(localStorage.getItem('mock_certificates') ?? '[]')
        return all.filter(c => c.user_id === user.id)
      }
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'valid')
        .order('issued_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="main-content page-container" style={{ paddingBottom: 'var(--space-12)', flex: 1 }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          marginTop: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-brand-50)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-brand)',
            }}>
              <Award size={24} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                My Safety Certificates
              </h1>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                Digitally verified credentials issued upon passing industrial safety assessments
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {[1, 2].map(n => (
              <div
                key={n}
                className="card"
                style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Loading credentials...</div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && certs.length === 0 && (
          <div
            className="card"
            style={{
              padding: 'var(--space-8) var(--space-6)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: 540,
              margin: 'var(--space-4) auto',
            }}
          >
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--color-surface-alt)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-muted)',
              marginBottom: 16,
            }}>
              <Award size={32} />
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              No Certificates Earned Yet
            </h2>
            <p style={{
              margin: '0 0 20px',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.5,
              maxWidth: 420,
            }}>
              Complete any AR training module (Fire Response, Gas Leak Protocol, or Confined Space Safety) and pass the assessment with a score of 70% or higher to earn a verifiable digital certificate.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/dashboard')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <span>Explore Training Modules</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Certificates Grid */}
        {!isLoading && certs.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20,
          }}>
            {certs.map(cert => {
              const rating = scoreRating(cert.score ?? 80)
              return (
                <div
                  key={cert.id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 16,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: rating.color,
                  }} />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.7rem' }}>
                          <CheckCircle2 size={12} />
                          VERIFIED
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {cert.cert_number}
                        </span>
                      </div>
                      <span
                        className="badge"
                        style={{
                          background: `${rating.color}18`,
                          color: rating.color,
                          fontWeight: 700,
                          fontSize: '0.75rem',
                        }}
                      >
                        {cert.score}% · {rating.label}
                      </span>
                    </div>

                    <h3 style={{ margin: '0 0 6px', fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      {cert.course_name}
                    </h3>
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                      Recipient: <strong>{cert.trainee_name || profile?.full_name || 'Trainee'}</strong>
                    </p>
                  </div>

                  <div style={{
                    background: 'var(--color-surface-alt)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={13} />
                      <span>Issued: <strong>{fmtDate(cert.issued_at)}</strong></span>
                    </div>
                    {cert.hash_sha256 && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        <ShieldCheck size={13} color="var(--color-success)" />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                          SHA-256: {cert.hash_sha256.substring(0, 16)}...
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    className="btn btn-primary btn-sm btn-full"
                    onClick={() => navigate(`/certificate/${cert.id}`)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    <FileText size={15} />
                    <span>View & Download Certificate</span>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
