import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { getCertificateByNumber } from '../lib/certificate'
import { verifyCertificate } from '../lib/blockchain'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

function formatDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Verify() {
  const { certNumber } = useParams()
  const [status, setStatus]   = useState('loading') // loading | valid | invalid | tampered | notfound
  const [cert, setCert]       = useState(null)
  const [hashResult, setHashResult] = useState(null)

  useEffect(() => {
    async function doVerify() {
      try {
        const data = await getCertificateByNumber(certNumber)
        if (!data) { setStatus('notfound'); return }

        if (data.status === 'revoked') { setStatus('invalid'); setCert(data); return }

        // Hash verification
        const result = await verifyCertificate(data)
        setHashResult(result)
        setCert(data)

        // Log verification
        if (isSupabaseConfigured) {
          await supabase.from('certificate_verifications').insert({
            cert_id: data.id,
            verified_at: new Date().toISOString(),
            result: result.valid ? 'valid' : 'tampered',
          }).catch(() => {}) // Non-blocking
        }

        setStatus(result.valid ? 'valid' : 'tampered')
      } catch (err) {
        console.error('Verify error:', err)
        setStatus('invalid')
      }
    }
    if (certNumber) doVerify()
  }, [certNumber])

  const STATUS_CONFIG = {
    valid: {
      icon: <CheckCircle size={64} style={{ color: '#2E8B57' }} />,
      headline: 'Certificate Verified ✓',
      sub: 'This certificate is authentic and has not been tampered with.',
      bg: '#E6F4EC', border: '#2E8B57', color: '#2E8B57',
    },
    invalid: {
      icon: <XCircle size={64} style={{ color: '#C0392B' }} />,
      headline: 'Certificate Invalid ✕',
      sub: 'This certificate is not recognized or has been revoked.',
      bg: '#FCEAEA', border: '#C0392B', color: '#C0392B',
    },
    tampered: {
      icon: <AlertTriangle size={64} style={{ color: '#D4882A' }} />,
      headline: 'Integrity Check Failed ⚠',
      sub: 'The certificate data does not match its stored hash. It may have been tampered with.',
      bg: '#FDF3E3', border: '#D4882A', color: '#D4882A',
    },
    notfound: {
      icon: <XCircle size={64} style={{ color: '#C0392B' }} />,
      headline: 'Certificate Not Found',
      sub: `No certificate found with ID: ${certNumber}`,
      bg: '#FCEAEA', border: '#C0392B', color: '#C0392B',
    },
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F5F1', display: 'flex', flexDirection: 'column' }}>
      {/* Simple header — no auth required */}
      <header style={{
        background: 'white', borderBottom: '1px solid #E3DDD5',
        padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="Suraksha AR"
          style={{ width: 36, height: 36, objectFit: 'contain' }}
        />
        <div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1C1C1E' }}>SurakshaAR</div>
          <div style={{ fontSize: '0.72rem', color: '#7A7A7A', fontWeight: 600 }}>Certificate Verification</div>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        <div style={{ width: '100%', maxWidth: 520 }}>

          {status === 'loading' ? (
            <div style={{ textAlign: 'center' }}>
              <div className="spinner spinner-lg" style={{ margin: '0 auto 16px', borderTopColor: '#E05A00' }} />
              <p style={{ color: '#7A7A7A' }}>Verifying certificate integrity…</p>
            </div>
          ) : (
            <>
              {/* Status banner */}
              {STATUS_CONFIG[status] && (
                <div style={{
                  background: STATUS_CONFIG[status].bg,
                  border: `2px solid ${STATUS_CONFIG[status].border}`,
                  borderRadius: 16, padding: '32px 24px',
                  textAlign: 'center', marginBottom: 24,
                }}>
                  <div style={{ marginBottom: 16 }}>{STATUS_CONFIG[status].icon}</div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: STATUS_CONFIG[status].color, marginBottom: 8 }}>
                    {STATUS_CONFIG[status].headline}
                  </h1>
                  <p style={{ color: '#4A4A4A', fontSize: '0.9rem' }}>{STATUS_CONFIG[status].sub}</p>
                </div>
              )}

              {/* Certificate details */}
              {cert && (
                <div style={{ background: 'white', border: '1px solid #E3DDD5', borderRadius: 14, padding: 24, marginBottom: 24 }}>
                  <h2 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1rem', color: '#1C1C1E' }}>Certificate Details</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { label: 'Certificate ID', value: cert.cert_number, mono: true },
                      { label: 'Trainee Name', value: cert.trainee_name },
                      { label: 'Course', value: cert.course_name },
                      { label: 'Score', value: `${cert.score}% — Passed` },
                      { label: 'Issue Date', value: formatDate(cert.issued_at) },
                      { label: 'Status', value: cert.status === 'valid' ? '✓ Valid' : '✕ Revoked',
                        color: cert.status === 'valid' ? '#2E8B57' : '#C0392B' },
                    ].map(({ label, value, mono, color }) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, paddingBottom: 10, borderBottom: '1px solid #E3DDD5' }}>
                        <span style={{ fontSize: '0.84rem', color: '#7A7A7A', fontWeight: 600, flexShrink: 0 }}>{label}</span>
                        <span style={{
                          fontSize: '0.84rem', fontWeight: 700, textAlign: 'right',
                          fontFamily: mono ? 'monospace' : undefined,
                          color: color ?? '#1C1C1E',
                        }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hash verification details */}
              {hashResult && (
                <div style={{
                  background: hashResult.valid ? '#E6F4EC' : '#FDF3E3',
                  border: `1px solid ${hashResult.valid ? '#A3D4B8' : '#F0CF96'}`,
                  borderRadius: 10, padding: 16, marginBottom: 24,
                }}>
                  <p style={{ fontWeight: 700, fontSize: '0.84rem', color: hashResult.valid ? '#2E8B57' : '#D4882A', marginBottom: 8 }}>
                    🔐 {hashResult.valid ? 'SHA-256 Hash Verified' : 'SHA-256 Hash Mismatch'}
                  </p>
                  <div style={{ fontSize: '0.72rem', color: '#4A4A4A', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.6 }}>
                    <p><strong>Stored hash:</strong> {hashResult.storedHash?.substring(0, 32)}…</p>
                    <p><strong>Computed:</strong> {hashResult.computedHash?.substring(0, 32)}…</p>
                    {cert?.blockchain_tx_id?.startsWith('LOCAL:') && (
                      <p style={{ marginTop: 6, color: '#7A7A7A', fontFamily: 'inherit' }}>
                        ℹ Verified via SurakshaAR local integrity store (Demo mode).
                        Architecture supports real blockchain provider.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#7A7A7A' }}>
                <p>Verified by SurakshaAR · Jharkhand Industrial Safety Council</p>
                <p style={{ marginTop: 4 }}>Scan timestamp: {new Date().toLocaleString('en-IN')}</p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
