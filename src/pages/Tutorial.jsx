import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Volume2, VolumeX, SkipForward, PlayCircle, Globe } from 'lucide-react'
import { useLang } from '../contexts/LanguageContext'
import { speak, stopSpeech, isTTSSupported } from '../lib/voice'
import { Navbar } from '../components/layout/Navbar'
import VideoTutorialModal from '../components/ui/VideoTutorialModal'

const STEP_ICONS = ['📷', '🎯', '🦺', '📋', '✅']

export default function Tutorial() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { T, tutorialSteps, lang, setLang, SUPPORTED_LANGUAGES, currentLang } = useLang()
  const [current, setCurrent] = useState(0)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const total = tutorialSteps.length

  // Stop speech if navigating between steps or unmounting
  useEffect(() => {
    stopSpeech()
    setIsSpeaking(false)
    return () => {
      stopSpeech()
    }
  }, [current, lang])

  function handleNext() {
    stopSpeech()
    if (current < total - 1) setCurrent(i => i + 1)
    else navigate(`/scenario/${id}`)
  }

  function handleBack() {
    stopSpeech()
    if (current > 0) setCurrent(i => i - 1)
  }

  function handleSkip() {
    stopSpeech()
    navigate(`/scenario/${id}`)
  }

  function handleListen() {
    if (isSpeaking) {
      stopSpeech()
      setIsSpeaking(false)
      return
    }

    const step = tutorialSteps[current]
    if (!step) return

    setIsSpeaking(true)
    const success = speak(`${step.title}. ${step.body}`, lang, () => {
      setIsSpeaking(false)
    })

    if (!success) {
      setIsSpeaking(false)
    }
  }

  const step = tutorialSteps[current] || { title: '', body: '' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <main style={{
        padding: `calc(var(--navbar-height) + 32px) var(--space-4) 48px`,
        display: 'flex', justifyContent: 'center',
      }}>
        <div style={{ width: '100%', maxWidth: 520 }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 8 }}>{T('howItWorksTitle')}</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 14 }}>
              {lang === 'hi'
                ? 'AR ट्रेनिंग शुरू करने से पहले, यहाँ समझें कि कैसे काम करता है।'
                : lang === 'sat'
                ? 'AR ᱥᱤᱠᱷᱟᱣ ᱮᱦᱚᱵ ᱞᱟᱦᱟ, ᱱᱚᱰᱮ ᱵᱩᱡᱷᱟᱹᱣ ᱢᱮ ᱪᱮᱫ ᱞᱮᱠᱟ ᱠᱟᱹᱢᱤᱭᱟ᱾'
                : "Before you begin AR training, here's what to expect."}
            </p>
            <button
              onClick={() => setShowVideoModal(true)}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.82rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-md, 8px)',
                padding: '6px 14px',
              }}
            >
              <PlayCircle size={15} style={{ color: 'var(--color-brand)' }} />
              {T('watchTutorial') || 'Watch Video Walkthrough'} (2:34)
            </button>
          </div>

          {/* ── 3-Language Selector Bar (English / हिंदी / ᱥᱟᱱᱛᱟᱲᱤ) ── */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginBottom: 20,
            background: 'var(--color-card, #FFFFFF)',
            border: '1px solid var(--color-border, #E5E7EB)',
            borderRadius: 24,
            padding: '4px 6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 6px', color: 'var(--color-text-muted)', fontSize: '0.74rem', fontWeight: 600 }}>
              <Globe size={13} />
              <span>Language:</span>
            </div>
            {SUPPORTED_LANGUAGES.map(l => {
              const active = lang === l.code
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    stopSpeech()
                    setLang(l.code)
                  }}
                  style={{
                    border: 'none',
                    background: active ? 'var(--color-brand, #E05A00)' : 'transparent',
                    color: active ? '#FFFFFF' : 'var(--color-text, #374151)',
                    padding: '5px 12px',
                    borderRadius: 18,
                    fontSize: '0.78rem',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    transition: 'all 0.15s ease',
                    boxShadow: active ? '0 2px 6px rgba(224, 90, 0, 0.35)' : 'none',
                  }}
                >
                  <span>{l.flag}</span>
                  <span>{l.nativeLabel || l.label}</span>
                </button>
              )
            })}
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
            {tutorialSteps.map((_, i) => (
              <div key={i} style={{
                width: i === current ? 32 : 10, height: 10,
                borderRadius: 5,
                background: i < current
                  ? 'var(--color-success)'
                  : i === current ? 'var(--color-brand)' : 'var(--color-border)',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>

          {/* Step card */}
          <div className="card animate-slide-up" key={`${current}-${lang}`} style={{
            textAlign: 'center', padding: '36px 28px',
            marginBottom: 24, minHeight: 310,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <div style={{ fontSize: 64, marginBottom: 16, lineHeight: 1 }}>
              {STEP_ICONS[current]}
            </div>
            <span style={{
              fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-brand)',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10,
            }}>
              {T('stepOf', String(current + 1), String(total))}
            </span>
            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 12, lineHeight: 1.25, color: 'var(--color-text)' }}>
              {step.title}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.94rem', lineHeight: 1.65, maxWidth: 390, margin: '0 0 18px' }}>
              {step.body}
            </p>

            {/* Audio Listen / Stop Button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <button
                type="button"
                onClick={handleListen}
                style={{
                  background: isSpeaking ? 'rgba(239, 68, 68, 0.12)' : 'rgba(224, 90, 0, 0.10)',
                  border: `1.5px solid ${isSpeaking ? '#EF4444' : 'var(--color-brand)'}`,
                  color: isSpeaking ? '#DC2626' : 'var(--color-brand)',
                  borderRadius: 20,
                  padding: '7px 18px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  transition: 'all 0.2s ease',
                }}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX size={16} />
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={16} />
                    <span>{T('listen')} ({currentLang?.label || 'Voice'})</span>
                  </>
                )}
              </button>

              {lang === 'sat' && (
                <span style={{ fontSize: '0.70rem', color: 'var(--color-text-muted)', letterSpacing: '0.02em' }}>
                  🌿 ᱥᱟᱱᱛᱟᱲᱤ ᱟᱲᱟᱝ (Phonetic Voice Assist)
                </span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary" onClick={handleBack} disabled={current === 0} style={{ flex: 1 }}>
              <ChevronLeft size={18} /> {T('tutorialBack')}
            </button>
            <button className="btn btn-primary" onClick={handleNext} style={{ flex: 2 }}>
              {current === total - 1
                ? <>{T('startTrainingNow')} →</>
                : <>{T('tutorialNext')} <ChevronRight size={18} /></>
              }
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button onClick={handleSkip} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <SkipForward size={14} /> {T('skipTutorial')}
            </button>
          </div>

          <VideoTutorialModal
            isOpen={showVideoModal}
            onClose={() => setShowVideoModal(false)}
          />
        </div>
      </main>
    </div>
  )
}
