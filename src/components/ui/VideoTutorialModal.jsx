import { useEffect, useRef } from 'react'
import { X, PlayCircle } from 'lucide-react'
import { useLang } from '../../contexts/LanguageContext'

export default function VideoTutorialModal({ isOpen, onClose }) {
  const { T } = useLang()
  const videoRef = useRef(null)

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Pause video whenever modal is closed
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={T('howToUse') || 'How to Use SurakshaAR'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          background: 'var(--color-surface, #FFFFFF)',
          borderRadius: 'var(--radius-lg, 16px)',
          width: '100%',
          maxWidth: '860px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--color-border, #E3DDD5)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderBottom: '1px solid var(--color-border, #E3DDD5)',
            background: 'var(--color-surface-alt, #FAF8F5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--color-brand-50, #FFF3EB)',
                color: 'var(--color-brand, #E05A00)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PlayCircle size={18} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: 'var(--text-md, 1rem)',
                  fontWeight: 700,
                  margin: 0,
                  color: 'var(--color-text-primary, #1A1A1A)',
                }}
              >
                {T('learnHowToUse') || 'Learn How to Use SurakshaAR'}
              </h3>
              <p
                style={{
                  fontSize: 'var(--text-xs, 0.75rem)',
                  color: 'var(--color-text-muted, #767676)',
                  margin: 0,
                }}
              >
                In-Platform Video Walkthrough • Stage Demo (2:34)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 6,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-secondary, #4A4A4A)',
            }}
            aria-label="Close tutorial"
          >
            <X size={20} />
          </button>
        </div>

        {/* Video Player */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            background: '#000000',
            aspectRatio: '16 / 9',
          }}
        >
          <video
            ref={videoRef}
            src={`${import.meta.env.BASE_URL}suraksha_ar_final_demo.mp4`}
            controls
            playsInline
            preload="metadata"
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              objectFit: 'contain',
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Chapters / Key Highlights Footer */}
        <div
          style={{
            padding: '12px 18px',
            background: 'var(--color-surface, #FFFFFF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
            fontSize: 'var(--text-xs, 0.75rem)',
            color: 'var(--color-text-muted, #767676)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-text-primary, #1A1A1A)' }}>Key Steps:</span>
            <span>1. Dashboard</span>
            <span>•</span>
            <span>2. Safety Assistant</span>
            <span>•</span>
            <span>3. AR Camera</span>
            <span>•</span>
            <span>4. Assessment</span>
            <span>•</span>
            <span>5. Certificate</span>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '4px 12px', fontSize: '0.8rem' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
