import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Camera, CheckCircle, ArrowRight, Download } from 'lucide-react'
import { useLang } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

const VIDEO_CHAPTERS = [
  { time: '00:00', seconds: 0, label: 'Registration & OTP', icon: '🔐' },
  { time: '00:36', seconds: 36, label: 'Dashboard & Modules', icon: '📊' },
  { time: '00:59', seconds: 59, label: 'Camera AR Hazard', icon: '🔥' },
  { time: '01:25', seconds: 85, label: '3D Simulation Mode', icon: '🏢' },
  { time: '01:48', seconds: 109, label: 'Assessment Quiz', icon: '📝' },
  { time: '02:18', seconds: 138, label: 'Safety AI Assistant', icon: '💬' },
  { time: '02:43', seconds: 163, label: 'Verified Certificate', icon: '📜' },
  { time: '03:02', seconds: 183, label: 'Admin Compliance', icon: '🛡️' },
]

export default function Landing() {
  const { T, lang } = useLang()
  const { user } = useAuth()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const mobileVideoRef = useRef(null)
  const [activeChapter, setActiveChapter] = useState(0)

  const handleChapterClick = (seconds, idx) => {
    setActiveChapter(idx)
    if (videoRef.current) {
      videoRef.current.currentTime = seconds
      videoRef.current.play().catch(() => {})
    }
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    const cur = videoRef.current.currentTime
    for (let i = VIDEO_CHAPTERS.length - 1; i >= 0; i--) {
      if (cur >= VIDEO_CHAPTERS[i].seconds) {
        setActiveChapter(i)
        break
      }
    }
  }

  const HOW_IT_WORKS = [
    { step: T('step_learn'), desc: T('step_learn_desc'), icon: '📖', color: '#3498DB' },
    { step: T('step_experience'), desc: T('step_experience_desc'), icon: '📱', color: '#1D4ED8' },
    { step: T('step_act'), desc: T('step_act_desc'), icon: '⚡', color: '#E74C3C' },
    { step: T('step_assess'), desc: T('step_assess_desc'), icon: '📋', color: '#9B59B6' },
    { step: T('step_improve'), desc: T('step_improve_desc'), icon: '📈', color: '#27AE60' },
    { step: T('step_certify'), desc: T('step_certify_desc'), icon: '🏆', color: '#F39C12' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        paddingTop: 'calc(var(--navbar-height) + 60px)',
        paddingBottom: 80,
        padding: `calc(var(--navbar-height) + 60px) var(--space-4) 80px`,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Authentic Industrial Facility Photographic Background */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0,
        }}>
          {/* Real Documentary Photograph of Indian Manufacturing Plant */}
          <div
            style={{
              position: 'absolute', inset: -15,
              backgroundImage: `url(${import.meta.env.BASE_URL}images/industrial-facility.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'right 35%',
              filter: 'saturate(0.85) contrast(0.92) brightness(0.96)',
              transform: 'scale(1.02)',
              animation: 'subtleAmbientDrift 28s ease-in-out infinite alternate',
            }}
          />

          {/* Soft atmospheric haze with gentle daylight variation */}
          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at 80% 25%, rgba(255, 245, 220, 0.25) 0%, transparent 65%)',
              animation: 'subtleSunlightPulse 14s ease-in-out infinite alternate',
              mixBlendMode: 'screen',
            }}
          />

          {/* Natural Depth-of-Field & Legibility Scrim */}
          {/* Keeps left/center area clean and softly blurred so text is 100% readable, industrial details stay on right */}
          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, var(--color-bg) 0%, rgba(247,245,241,0.95) 40%, rgba(247,245,241,0.82) 65%, rgba(247,245,241,0.45) 85%, rgba(247,245,241,0.2) 100%)',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
            }}
          />

          {/* Subtle bottom blend into page body */}
          <div
            style={{
              position: 'absolute', left: 0, right: 0, bottom: 0, height: 100,
              background: 'linear-gradient(to top, var(--color-bg), transparent)',
            }}
          />
        </div>

        <div className="page-container" style={{ maxWidth: 800, position: 'relative' }}>
          {/* Safety badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--color-brand-50)',
            border: '1.5px solid var(--color-brand-100)',
            borderRadius: 'var(--radius-pill)',
            padding: '6px 16px',
            marginBottom: 24,
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--color-brand)',
          }}>
            <Shield size={15} />
            Smart India Hackathon 2026 · SIH26041
          </div>

          {/* Logo image */}
          <div style={{
            marginBottom: lang !== 'en' ? 12 : 24,
            display: 'flex',
            justifyContent: 'center',
          }}>
            <img
              src={`${import.meta.env.BASE_URL}images/surakshaar-logo.png`}
              alt="SurakshaAR — Immersive Training for a Safer Bharat"
              style={{
                height: 'clamp(90px, 16vw, 150px)',
                width: 'auto',
                maxWidth: '92%',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 4px 18px rgba(0,0,0,0.08))',
              }}
            />
          </div>

          {/* Regional tagline for non-English users */}
          {lang !== 'en' && (
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-muted)',
              fontWeight: 600,
              letterSpacing: '0.04em',
              marginBottom: 24,
            }}>
              {T('tagline')}
            </p>
          )}

          {/* Hero heading */}
          <h1 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            marginBottom: 20,
            lineHeight: 1.2,
          }}>
            {T('heroHeading')}
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: 'var(--color-text-secondary)',
            maxWidth: 600,
            margin: '0 auto 36px',
            lineHeight: 1.7,
          }}>
            {T('heroSubtitle')}
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/dashboard')}
              style={{ fontSize: '1.05rem', padding: '14px 30px' }}
            >
              <Camera size={20} />
              {T('startARTraining')}
              <ArrowRight size={18} />
            </button>
            <a
              href={`${import.meta.env.BASE_URL}SurakshaAR.apk`}
              download="SurakshaAR.apk"
              className="btn btn-secondary btn-lg"
              style={{
                fontSize: '1.02rem',
                padding: '14px 24px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                textDecoration: 'none',
                border: '1.5px solid var(--color-brand, #E05A00)',
                color: 'var(--color-brand, #E05A00)',
              }}
            >
              <Download size={19} />
              Download Android APK
            </a>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
              style={{ fontSize: '1.05rem', padding: '14px 26px' }}
            >
              {T('exploreTraining')}
            </button>
          </div>

          {/* Trust indicators */}
          <div style={{
            display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap',
            marginTop: 32,
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
            fontWeight: 600,
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={14} style={{ color: 'var(--color-success)' }} />
              Camera AR on Android
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={14} style={{ color: 'var(--color-success)' }} />
              Hindi · English · Santali
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={14} style={{ color: 'var(--color-success)' }} />
              Blockchain Verified Certificates
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={14} style={{ color: 'var(--color-success)' }} />
              Offline Capable
            </span>
          </div>
        </div>
      </section>

      {/* Visual AR Demo Block */}
      <section style={{
        background: '#1A1A1A',
        padding: '60px var(--space-4)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <style>{`
          @keyframes gasPlumeBillow {
            0% { transform: scale(0.7) translateY(0); opacity: 0.85; }
            50% { transform: scale(1.15) translateY(-14px); opacity: 0.6; }
            100% { transform: scale(1.4) translateY(-26px); opacity: 0.1; }
          }
          @keyframes gasPlumePuff2 {
            0% { transform: scale(0.6) translateY(2px); opacity: 0.9; }
            50% { transform: scale(1.1) translateY(-18px); opacity: 0.55; }
            100% { transform: scale(1.45) translateY(-32px); opacity: 0.08; }
          }
          @keyframes arHazardPulse {
            0%, 100% { transform: scale(0.96); opacity: 0.65; }
            50% { transform: scale(1.03); opacity: 0.95; }
          }
        `}</style>

        <div className="page-container" style={{ textAlign: 'center' }}>
          <p style={{
            color: '#888', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 24,
          }}>
            AR TRAINING PREVIEWS
          </p>

          {/* Responsive 2-Scenario Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
            gap: 24,
            maxWidth: 980,
            margin: '0 auto',
            textAlign: 'left',
          }}>

            {/* ── SCENARIO 1: FIRE HAZARD AR PREVIEW ── */}
            <div style={{
              position: 'relative',
              height: 280,
              background: 'linear-gradient(180deg, #2A2A2A 0%, #1A1A1A 100%)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid #333',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            }}>
              {/* Simulated camera feed background */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, #1E2A1E 0%, #2A1A0A 50%, #1A1A2A 100%)',
                opacity: 0.8,
              }} />

              {/* AR overlays simulation */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Fire effect */}
                <div style={{
                  position: 'absolute', bottom: 40, left: '35%',
                  width: 60, height: 80,
                  background: 'radial-gradient(ellipse at bottom, #FF4500, #FF8C00, transparent)',
                  borderRadius: '50% 50% 20% 20%',
                  animation: 'pulse 0.8s ease-in-out infinite alternate',
                  filter: 'blur(2px)',
                }} />

                {/* Hazard marker — bottom-left */}
                <div style={{
                  position: 'absolute', bottom: '18%', left: '8%',
                  background: 'rgba(255,69,0,0.9)',
                  borderRadius: 8, padding: '5px 10px',
                  color: 'white', fontSize: 'clamp(10px, 2.5vw, 13px)', fontWeight: 700,
                  boxShadow: '0 0 20px rgba(255,69,0,0.6)',
                  whiteSpace: 'nowrap',
                }}>
                  ⚠ FIRE HAZARD
                </div>

                {/* Exit marker — top-right corner */}
                <div style={{
                  position: 'absolute', top: '30%', right: '6%',
                  background: 'rgba(46,139,87,0.9)',
                  borderRadius: 8, padding: '5px 10px',
                  color: 'white', fontSize: 'clamp(10px, 2.5vw, 13px)', fontWeight: 700,
                  boxShadow: '0 0 20px rgba(46,139,87,0.6)',
                  whiteSpace: 'nowrap',
                }}>
                  🚪 FIRE EXIT →
                </div>

                {/* PPE marker — top-left */}
                <div style={{
                  position: 'absolute', top: '30%', left: '6%',
                  background: 'rgba(52,152,219,0.9)',
                  borderRadius: 8, padding: '5px 10px',
                  color: 'white', fontSize: 'clamp(10px, 2.5vw, 13px)', fontWeight: 700,
                  boxShadow: '0 0 20px rgba(52,152,219,0.6)',
                  whiteSpace: 'nowrap',
                }}>
                  🦺 PPE STATION
                </div>

                {/* AR Mode indicator */}
                <div style={{
                  position: 'absolute', top: 16, left: 16,
                  background: 'rgba(0,0,0,0.7)',
                  border: '1px solid #00FF88',
                  borderRadius: 'var(--radius-pill)',
                  padding: '4px 12px',
                  color: '#00FF88',
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.08em',
                }}>
                  📷 CAMERA AR MODE
                </div>

                {/* Scenario Module Pill */}
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'rgba(15,23,42,0.85)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '3px 10px',
                  color: '#CBD5E1',
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.04em',
                }}>
                  🔥 FIRE PROTOCOL
                </div>

                {/* Communication Flow Footer */}
                <div style={{
                  position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.6)',
                  borderRadius: 6, padding: '2px 10px',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 9.5, fontWeight: 600,
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                }}>
                  Camera AR → Flame Detection → PPE Donning → Safe Exit
                </div>

                {/* Scan lines overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)',
                  pointerEvents: 'none',
                }} />
              </div>
            </div>

            {/* ── SCENARIO 2: GAS LEAK & CONFINED SPACE PROTOCOL PREVIEW ── */}
            <div style={{
              position: 'relative',
              height: 280,
              background: 'linear-gradient(180deg, #2A2A2A 0%, #1A1A1A 100%)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid #333',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            }}>
              {/* Simulated camera feed background — industrial plant lighting */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, #14202A 0%, #1A2420 50%, #221A26 100%)',
                opacity: 0.85,
              }} />

              {/* AR overlays simulation */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                
                {/* Industrial Gas Pipe & Valve Assembly with Leak Point */}
                <svg
                  width="130"
                  height="95"
                  viewBox="0 0 130 95"
                  fill="none"
                  style={{
                    position: 'absolute',
                    bottom: 24,
                    right: '20%',
                    filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.6))',
                  }}
                >
                  {/* Base floor shadow */}
                  <ellipse cx="65" cy="88" rx="55" ry="6" fill="rgba(0,0,0,0.45)" />

                  {/* Main Steel Pipeline */}
                  <rect x="8" y="52" width="114" height="20" rx="3" fill="url(#steelPipeGrad)" stroke="#334155" strokeWidth="1.5" />
                  
                  {/* Flange Collar & Bolt Details */}
                  <rect x="22" y="47" width="9" height="30" rx="2" fill="#475569" stroke="#1E293B" strokeWidth="1" />
                  <rect x="99" y="47" width="9" height="30" rx="2" fill="#475569" stroke="#1E293B" strokeWidth="1" />
                  <circle cx="26.5" cy="52" r="1.8" fill="#94A3B8" />
                  <circle cx="26.5" cy="72" r="1.8" fill="#94A3B8" />
                  <circle cx="103.5" cy="52" r="1.8" fill="#94A3B8" />
                  <circle cx="103.5" cy="72" r="1.8" fill="#94A3B8" />

                  {/* Valve Riser & Bonnet */}
                  <rect x="56" y="34" width="18" height="20" rx="2" fill="#64748B" stroke="#1E293B" strokeWidth="1" />
                  <rect x="63" y="20" width="4" height="16" fill="#CBD5E1" stroke="#475569" strokeWidth="0.8" />

                  {/* Emergency Valve Handwheel */}
                  <ellipse cx="65" cy="18" rx="17" ry="6.5" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
                  <ellipse cx="65" cy="18" rx="11" ry="4" fill="#B91C1C" />
                  <circle cx="65" cy="18" r="2.8" fill="#FDE047" />

                  {/* Leak Emitter Joint Glow */}
                  <circle cx="65" cy="52" r="5.5" fill="#38BDF8" opacity="0.85" filter="blur(1px)" />

                  <defs>
                    <linearGradient id="steelPipeGrad" x1="8" y1="52" x2="8" y2="72" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#64748B" />
                      <stop offset="0.35" stopColor="#94A3B8" />
                      <stop offset="0.75" stopColor="#475569" />
                      <stop offset="1" stopColor="#1E293B" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Visible Semi-Transparent Grey/White AR Gas Plume (with subtle blue/grey tones) */}
                <div style={{
                  position: 'absolute', bottom: 55, right: '28%',
                  width: 75, height: 105,
                  pointerEvents: 'none',
                }}>
                  {/* Billowing Plume Puff 1 */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: '46%',
                    width: 48, height: 55,
                    borderRadius: '50% 50% 35% 35%',
                    background: 'radial-gradient(ellipse at bottom, rgba(241, 245, 249, 0.85) 0%, rgba(186, 230, 253, 0.5) 45%, rgba(148, 163, 184, 0.22) 75%, transparent 100%)',
                    filter: 'blur(3px)',
                    animation: 'gasPlumeBillow 2.2s ease-out infinite',
                  }} />

                  {/* Billowing Plume Puff 2 */}
                  <div style={{
                    position: 'absolute', bottom: 12, left: '38%',
                    width: 58, height: 66,
                    borderRadius: '50% 50% 40% 40%',
                    background: 'radial-gradient(ellipse at bottom, rgba(224, 242, 254, 0.8) 0%, rgba(203, 213, 225, 0.45) 50%, rgba(148, 163, 184, 0.15) 80%, transparent 100%)',
                    filter: 'blur(4px)',
                    animation: 'gasPlumePuff2 2.6s ease-out infinite 0.7s',
                  }} />

                  {/* Emitter source point */}
                  <div style={{
                    position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)',
                    width: 12, height: 12, borderRadius: '50%',
                    background: 'rgba(56, 189, 248, 0.95)',
                    boxShadow: '0 0 14px rgba(56, 189, 248, 0.85)',
                  }} />
                </div>

                {/* AR Danger Zone Ground Perimeter Ring */}
                <div style={{
                  position: 'absolute', bottom: 20, right: '16%',
                  width: 140, height: 42,
                  borderRadius: '50%',
                  border: '1.5px dashed rgba(239, 68, 68, 0.75)',
                  boxShadow: '0 0 15px rgba(239, 68, 68, 0.35), inset 0 0 10px rgba(239, 68, 68, 0.2)',
                  animation: 'arHazardPulse 2.2s ease-in-out infinite',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{
                    fontSize: 8, fontWeight: 800, color: '#FCA5A5', letterSpacing: '0.04em',
                    background: 'rgba(220, 38, 38, 0.8)', padding: '1px 6px', borderRadius: 4,
                  }}>
                    HAZARD ZONE: 10m
                  </span>
                </div>

                {/* Hazard marker — bottom-left, matching Fire marker styling */}
                <div style={{
                  position: 'absolute', bottom: '18%', left: '8%',
                  background: 'rgba(224, 90, 0, 0.94)', // SurakshaAR brand safety orange
                  borderRadius: 8, padding: '5px 10px',
                  color: 'white', fontSize: 'clamp(10px, 2.5vw, 13px)', fontWeight: 700,
                  boxShadow: '0 0 20px rgba(224, 90, 0, 0.65)',
                  whiteSpace: 'nowrap',
                }}>
                  ⚠ GAS LEAK HAZARD
                </div>

                {/* Direction marker — top-right corner, matching Exit marker */}
                <div style={{
                  position: 'absolute', top: '30%', right: '6%',
                  background: 'rgba(46,139,87,0.9)', // Safety emerald green
                  borderRadius: 8, padding: '5px 10px',
                  color: 'white', fontSize: 'clamp(10px, 2.5vw, 13px)', fontWeight: 700,
                  boxShadow: '0 0 20px rgba(46,139,87,0.6)',
                  whiteSpace: 'nowrap',
                }}>
                  🛡️ SAFE DISTANCE →
                </div>

                {/* AR Gas Detected indicator — top-left */}
                <div style={{
                  position: 'absolute', top: '30%', left: '6%',
                  background: 'rgba(14, 165, 233, 0.9)', // AR Cyan indicator
                  borderRadius: 8, padding: '5px 10px',
                  color: 'white', fontSize: 'clamp(10px, 2.5vw, 13px)', fontWeight: 700,
                  boxShadow: '0 0 20px rgba(14, 165, 233, 0.6)',
                  whiteSpace: 'nowrap',
                }}>
                  💨 GAS DETECTED
                </div>

                {/* AR Mode indicator */}
                <div style={{
                  position: 'absolute', top: 16, left: 16,
                  background: 'rgba(0,0,0,0.7)',
                  border: '1px solid #00FF88',
                  borderRadius: 'var(--radius-pill)',
                  padding: '4px 12px',
                  color: '#00FF88',
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.08em',
                }}>
                  📷 CAMERA AR MODE
                </div>

                {/* Scenario Module Pill */}
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'rgba(15,23,42,0.85)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '3px 10px',
                  color: '#CBD5E1',
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.04em',
                }}>
                  💨 GAS & CONFINED SPACE
                </div>

                {/* Communication Flow Footer */}
                <div style={{
                  position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.6)',
                  borderRadius: 6, padding: '2px 10px',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 9.5, fontWeight: 600,
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                }}>
                  Camera AR → Gas Leak Detection → Hazard Zone → Safe Evacuation
                </div>

                {/* Scan lines overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)',
                  pointerEvents: 'none',
                }} />
              </div>
            </div>

          </div>

          <p style={{
            color: '#888', fontSize: 'var(--text-xs)', marginTop: 18,
          }}>
            Real camera feed + AR hazard overlays + interactive safety tasks
          </p>
          <p style={{
            color: '#666', fontSize: 11, marginTop: 4,
          }}>
            ℹ️ Visual AR preview for training simulation demonstration • Does not measure actual gas concentration
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: '72px var(--space-4)' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 12 }}>
              {T('howItWorks')}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 500, margin: '0 auto' }}>
              A structured learning journey from theory to verified certification.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 'var(--space-4)',
          }}>
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64,
                  background: item.color + '18',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px',
                  fontSize: 28,
                  border: `2px solid ${item.color}30`,
                }}>
                  {item.icon}
                </div>
                <div style={{
                  width: 24, height: 24,
                  background: item.color,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: 'white',
                  margin: '0 auto 8px',
                }}>
                  {i + 1}
                </div>
                <h3 style={{ fontSize: 'var(--text-md)', marginBottom: 6 }}>{item.step}</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  {item.desc}
                </p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div style={{
                    display: 'none', // Hidden on mobile, shown on desktop via CSS
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learn How to Use SurakshaAR (Video Tutorial) */}
      <section id="learn-how-to-use" style={{
        padding: '64px var(--space-4)',
        background: 'var(--color-surface, #FFFFFF)',
        borderTop: '1px solid var(--color-border)',
      }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 999,
              background: 'var(--color-brand-50, #FFF3EB)',
              color: 'var(--color-brand, #E05A00)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}>
              <span>🎬</span> {T('videoTutorial') || 'Video Tutorial'}
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', marginBottom: 12, color: 'var(--color-text-primary)' }}>
              {T('learnHowToUse') || 'Learn How to Use SurakshaAR'}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 640, margin: '0 auto', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
              {T('learnHowToUseSubtitle') || 'Watch our complete video walkthrough to learn how to navigate the dashboard, interact with the safety assistant, scan hazards in AR, and earn verified certification.'}
            </p>
          </div>

          <style>{`
            .showcase-dual-container {
              display: flex;
              gap: 32px;
              align-items: flex-start;
              justify-content: center;
              max-width: 1220px;
              margin: 0 auto;
            }
            .showcase-desktop-col {
              flex: 1.6;
              min-width: 0;
            }
            .showcase-mobile-col {
              flex: 0 0 290px;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .video-timestamps-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 10px;
            }
            @media (max-width: 980px) {
              .showcase-dual-container {
                flex-direction: column;
                align-items: center;
                gap: 44px;
              }
              .showcase-desktop-col {
                width: 100%;
                max-width: 720px;
              }
              .video-timestamps-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
              }
            }
            .timestamp-card-btn {
              transition: all 0.18s ease;
            }
            .timestamp-card-btn:hover {
              border-color: var(--color-brand) !important;
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(224, 90, 0, 0.1) !important;
            }
          `}</style>

          <div className="showcase-dual-container">
            {/* Left Column: Desktop Web Platform Walkthrough */}
            <div className="showcase-desktop-col">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
                padding: '0 4px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.15rem' }}>💻</span>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                    Desktop Web Platform Walkthrough
                  </span>
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--color-text-muted)',
                  background: 'var(--color-surface-alt, #FAF8F5)',
                  border: '1px solid var(--color-border)',
                  padding: '3px 9px',
                  borderRadius: 6,
                }}>
                  16:9 HD
                </span>
              </div>

              <div style={{
                width: '100%',
                background: '#000000',
                borderRadius: 'var(--radius-lg, 16px)',
                overflow: 'hidden',
                boxShadow: '0 20px 48px rgba(0, 0, 0, 0.16)',
                border: '1px solid var(--color-border)',
                position: 'relative',
                aspectRatio: '16 / 9',
              }}>
                <video
                  ref={videoRef}
                  onTimeUpdate={handleTimeUpdate}
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

              {/* Chapters / Timeline Highlights - Minimal Original Design, Systematic Grid */}
              <div style={{ marginTop: 14 }} className="video-timestamps-grid">
                {VIDEO_CHAPTERS.map((ch, idx) => {
                  const isActive = activeChapter === idx
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleChapterClick(ch.seconds, idx)}
                      className="timestamp-card-btn"
                      style={{
                        padding: '12px 8px',
                        background: isActive ? 'var(--color-brand-50, #FFF3EB)' : 'var(--color-surface-alt, #FAF8F5)',
                        borderRadius: 'var(--radius-md, 8px)',
                        border: isActive ? '2px solid var(--color-brand, #E05A00)' : '1px solid var(--color-border)',
                        textAlign: 'center',
                        cursor: 'pointer',
                        outline: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div style={{ fontSize: '1.25rem', marginBottom: 2 }}>{ch.icon}</div>
                      <div style={{ fontWeight: 700, color: 'var(--color-brand)', fontSize: '0.85rem' }}>{ch.time}</div>
                      <div style={{ color: 'var(--color-text-secondary)', marginTop: 2, fontSize: '0.78rem', fontWeight: 600 }}>{ch.label}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right Column: Mobile App in Action (Inside Realistic Smartphone Frame) */}
            <div className="showcase-mobile-col">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                marginBottom: 12,
                padding: '0 4px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.15rem' }}>📱</span>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                    Mobile Screen View
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <a
                    href={`${import.meta.env.BASE_URL}SurakshaAR.apk`}
                    download="SurakshaAR.apk"
                    title="Download SurakshaAR Android APK (76 MB)"
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      background: 'var(--color-brand, #E05A00)',
                      padding: '4px 10px',
                      borderRadius: 6,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      boxShadow: '0 2px 6px rgba(224, 90, 0, 0.3)',
                    }}
                  >
                    <Download size={12} /> Get APK
                  </a>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--color-brand, #E05A00)',
                    background: 'var(--color-brand-50, #FFF3EB)',
                    border: '1px solid var(--color-brand-100, #FED7AA)',
                    padding: '3px 9px',
                    borderRadius: 6,
                  }}>
                    Live Android AR
                  </span>
                </div>
              </div>

              {/* Smartphone Mockup Chassis */}
              <div style={{
                width: 284,
                height: 576,
                background: '#121721',
                borderRadius: 44,
                padding: '12px 10px',
                boxShadow: '0 24px 55px -10px rgba(0, 0, 0, 0.35), 0 0 0 2px #263143, inset 0 0 0 1.5px rgba(255,255,255,0.08)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
              }}>
                {/* Speaker Notch / Dynamic Island */}
                <div style={{
                  position: 'absolute',
                  top: 14,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 76,
                  height: 12,
                  background: '#000000',
                  borderRadius: 8,
                  zIndex: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  pointerEvents: 'none',
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#1c2438' }} />
                  <div style={{ width: 24, height: 3, borderRadius: 2, background: '#252d3d' }} />
                </div>

                {/* Inner Screen Display */}
                <div style={{
                  flex: 1,
                  width: '100%',
                  height: '100%',
                  background: '#000000',
                  borderRadius: 34,
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  <video
                    ref={mobileVideoRef}
                    src={`${import.meta.env.BASE_URL}suraksha_ar_mobile_demo.mp4`}
                    controls
                    playsInline
                    preload="metadata"
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'block',
                      objectFit: 'cover',
                      borderRadius: 34,
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>

                  {/* Home Bar Indicator */}
                  <div style={{
                    position: 'absolute',
                    bottom: 6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 76,
                    height: 3.5,
                    background: 'rgba(255, 255, 255, 0.45)',
                    borderRadius: 2,
                    pointerEvents: 'none',
                    zIndex: 10,
                  }} />
                </div>
              </div>

              <div style={{
                marginTop: 14,
                textAlign: 'center',
                fontSize: '0.78rem',
                color: 'var(--color-text-muted)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <CheckCircle size={14} style={{ color: 'var(--color-success)' }} />
                <span>Live Camera AR · Android Screen Capture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        padding: '48px var(--space-4)',
      }}>
        <div className="page-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-6)',
          }}>
            {[
              { icon: '📱', title: 'Camera AR Mode', desc: 'Real environment + virtual hazards overlaid on your camera' },
              { icon: '🗣️', title: 'Voice Assessment', desc: 'Questions read aloud in Hindi and English. Listen, then answer.' },
              { icon: '🛡️', title: 'Blockchain Certificates', desc: 'SHA-256 verified digital certificates with QR code validation' },
              { icon: '📡', title: 'Offline Capable', desc: 'Train offline, sync progress automatically when reconnected' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <h3 style={{ fontSize: 'var(--text-md)', marginBottom: 4 }}>{f.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '72px var(--space-4)', textAlign: 'center' }}>
        <div className="page-container" style={{ maxWidth: 600 }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 16 }}>
            Ready to train safely?
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 32 }}>
            Join industrial workers from Jharkhand's mining, steel, and mica sectors.
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/dashboard')}
            style={{ fontSize: '1.05rem', padding: '16px 40px' }}
          >
            Launch AR Training Dashboard
            <ArrowRight size={18} />
          </button>
          {!user && (
            <p style={{ marginTop: 12, fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-brand)', fontWeight: 600 }}
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
