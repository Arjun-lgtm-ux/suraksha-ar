import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, VolumeX, Volume2 } from 'lucide-react'
import { useLang } from '../../contexts/LanguageContext'

export default function CompletionPopup({ courseName, onViewCertificate }) {
  const { T, lang } = useLang()
  const navigate = useNavigate()
  const [muted, setMuted] = useState(false)

  // Confetti particles
  const confetti = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.8}s`,
    color: ['#E05A00', '#2E8B57', '#FFD700', '#3498DB', '#E74C3C'][i % 5],
    size: `${8 + Math.random() * 8}px`,
  }))

  return (
    <div className="completion-overlay">
      {/* Confetti */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {confetti.map(c => (
          <div key={c.id} style={{
            position: 'absolute',
            top: '-20px',
            left: c.left,
            width: c.size,
            height: c.size,
            background: c.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confettiFall 2s ease-in ${c.delay} forwards`,
          }} />
        ))}
      </div>

      <div className="completion-box">
        {/* Mute button */}
        <button
          onClick={() => setMuted(m => !m)}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-text-muted)',
          }}
          aria-label="Toggle sound"
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        {/* Success icon */}
        <div className="animate-bounce-in" style={{ marginBottom: 20 }}>
          <div style={{
            width: 88, height: 88, background: 'var(--color-success-bg)',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto',
            border: '3px solid var(--color-success)',
          }}>
            <CheckCircle size={48} style={{ color: 'var(--color-success)' }} />
          </div>
        </div>

        {/* 100% badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--color-success-bg)',
          border: '1.5px solid var(--color-success)',
          borderRadius: 'var(--radius-pill)',
          padding: '4px 16px', marginBottom: 16,
          fontSize: 'var(--text-sm)', fontWeight: 800,
          color: 'var(--color-success)',
        }}>
          100% COMPLETE
        </div>

        <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 8 }}>
          ✓ COURSE COMPLETED!
        </h2>

        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 6 }}>
          You have successfully completed the course.
        </p>
        {lang === 'hi' && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 16 }}>
            आपने सफलतापूर्वक प्रशिक्षण पूरा कर लिया है।
          </p>
        )}
        <p style={{ fontWeight: 600, color: 'var(--color-brand)', marginBottom: 28 }}>
          {courseName}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button className="btn btn-success btn-lg btn-full" onClick={onViewCertificate}>
            🎓 {T('viewCertificate')}
          </button>
          <button
            className="btn btn-ghost btn-full"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
