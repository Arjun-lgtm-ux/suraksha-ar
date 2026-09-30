import { useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { QRCodeSVG } from 'qrcode.react'
import { toPng } from 'html-to-image'
import { Download, ArrowLeft, Shield, CheckCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Navbar } from '../components/layout/Navbar'
import { useLang } from '../contexts/LanguageContext'

function formatDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Certificate() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { T } = useLang()
  const certRef = useRef()
  const [downloading, setDownloading] = useState(false)

  const { data: cert, isLoading } = useQuery({
    queryKey: ['certificate', id],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        const certs = JSON.parse(localStorage.getItem('mock_certificates') ?? '[]')
        return certs.find(c => c.id === id) ?? null
      }
      const { data, error } = await supabase.from('certificates').select('*').eq('id', id).single()
      if (error) throw error
      return data
    },
  })

  async function handleDownload() {
    if (!certRef.current) return
    setDownloading(true)
    try {
      const dataUrl = await toPng(certRef.current, { quality: 0.95, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `SurakshaAR-Certificate-${cert?.cert_number ?? 'cert'}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Download failed:', err)
      alert('Could not download. Please try using your browser screenshot.')
    } finally {
      setDownloading(false)
    }
  }

  const verifyUrl = `${window.location.origin}/verify/${cert?.cert_number ?? ''}`

  if (isLoading) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  )

  if (!cert) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <main style={{ padding: `calc(var(--navbar-height) + 40px) var(--space-4)`, textAlign: 'center' }}>
        <h2 style={{ marginBottom: 16 }}>Certificate not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </main>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--navbar-height) + 24px)', paddingBottom: 48 }}>
        <div className="page-container" style={{ maxWidth: 700 }}>
          <div style={{ marginBottom: 24 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={16} /> Dashboard
            </button>
          </div>

          {/* Certificate card — this is what gets downloaded */}
          <div ref={certRef} className="cert-card" style={{ marginBottom: 28 }}>
            <div className="cert-watermark">SurakshaAR</div>

            {/* Top section */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ width: 56, height: 56, background: 'var(--color-brand)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={28} color="white" />
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
              {T('certifiedBy')}
            </p>

            <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-brand)', marginBottom: 20 }}>
              {T('certificateTitle')}
            </h1>

            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 8 }}>This certifies that</p>

            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, color: 'var(--color-text-primary)', marginBottom: 8, letterSpacing: '-0.02em' }}>
              {cert.trainee_name}
            </h2>

            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 6 }}>has successfully completed</p>

            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 20 }}>
              {cert.course_name}
            </h3>

            {/* Score badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--color-success-bg)',
              border: '1.5px solid var(--color-success)',
              borderRadius: 'var(--radius-pill)',
              padding: '6px 20px', marginBottom: 24,
            }}>
              <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />
              <span style={{ fontWeight: 700, color: 'var(--color-success)' }}>
                Score: {cert.score}% — Passed
              </span>
            </div>

            {/* Date + Cert ID */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28, textAlign: 'left' }}>
              <div style={{ padding: '10px 14px', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 2 }}>{T('issuedOn')}</p>
                <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{formatDate(cert.issued_at)}</p>
              </div>
              <div style={{ padding: '10px 14px', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 2 }}>{T('certId')}</p>
                <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>{cert.cert_number}</p>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 24 }} />

            {/* QR Code section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <QRCodeSVG
                value={verifyUrl}
                size={110}
                level="M"
                includeMargin
                style={{ borderRadius: 8 }}
              />
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                {T('verifyQR')}
              </p>
            </div>

            {/* Blockchain note */}
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 16 }}>
              🔐 SHA-256 Verified · {cert.blockchain_tx_id?.startsWith('LOCAL:') ? 'Demo integrity mode' : 'On-chain verified'}
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleDownload} disabled={downloading}>
              <Download size={18} /> {downloading ? 'Downloading…' : T('downloadCert')}
            </button>
            <button className="btn btn-ghost" onClick={() => navigate(`/verify/${cert.cert_number}`)}>
              Verify
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
