import { useState } from 'react'
import {
  Volume2, CheckCircle2, AlertTriangle, Flame, Wind, Zap, Shield, Target,
  ArrowRight, Monitor, X, Printer, Compass, ChevronLeft, ChevronRight,
  RotateCcw, MapPin, Bell, DoorOpen, Navigation, Cog, Lock, Activity,
  Sliders, ChevronDown, ChevronUp, Info
} from 'lucide-react'
import { speak } from '../../lib/voice'

// Visual icon lookup for spatial station steps
const STATION_ICONS = {
  0: Flame,       // Step 0: Hazard / Fire
  1: Bell,        // Step 1: Alarm Call Point
  2: Shield,      // Step 2: PPE Locker
  3: AlertTriangle,// Step 3: Extinguisher / Action
  4: DoorOpen,    // Step 4: Fire Exit
  5: MapPin,      // Step 5: Muster Point
}

const MACHINERY_STATION_ICONS = {
  0: Cog,           // Step 0: Nip-Point Hazard
  1: AlertTriangle, // Step 1: E-Stop Button
  2: Lock,          // Step 2: LOTO Padlock
  3: Zap,           // Step 3: Zero Energy Verification
  4: Shield,        // Step 4: Safety Guard
  5: MapPin,        // Step 5: Supervisor Sign-Off
}

export function getStepObjectName(stepIndex, hazardType = 'fire', lang = 'en') {
  const isMachinery = hazardType === 'machinery'
  const names = {
    en: isMachinery ? [
      'Machinery Hazard',
      'Emergency Stop Button',
      'LOTO Station',
      'Zero Energy Point',
      'Safety Guard',
      'Supervisor Sign-Off',
    ] : [
      'Fire Hazard',
      'Fire Alarm Call Point',
      'PPE Safety Station',
      'CO₂ Extinguisher',
      'Fire Exit',
      'Muster Point',
    ],
    hi: isMachinery ? [
      'मशीनरी का खतरा',
      'इमरजेंसी स्टॉप बटन',
      'LOTO सुरक्षा स्टेशन',
      'शून्य ऊर्जा जांच बिंदु',
      'मशीन सुरक्षा गार्ड',
      'पर्यवेक्षक साइन-ऑफ',
    ] : [
      'आग का खतरा',
      'फायर अलार्म',
      'पीपीई स्टेशन',
      'अग्निशामक यंत्र',
      'फायर एग्जिट',
      'मस्टर पॉइंट',
    ],
    sat: isMachinery ? [
      'ᱠᱟᱹᱨᱜᱟᱲ ᱵᱚᱛᱚᱨ',
      'ᱤ-ᱥᱴᱚᱯ ᱵᱚᱴᱚᱱ',
      'LOTO ᱥᱴᱮᱥᱚᱱ',
      'ᱡᱤᱨᱳ ᱮᱱᱟᱨᱡᱤ ᱴᱷᱟᱶ',
      'ᱥᱮᱯᱷᱴᱤ ᱜᱟᱨᱰ',
      'ᱥᱩᱯᱟᱨᱵᱷᱟᱭᱤᱡᱟᱨ ᱴᱷᱟᱶ',
    ] : [
      'ᱥᱮᱸᱜᱮᱞ ᱵᱚᱛᱚᱨ',
      'ᱯᱷᱟᱭᱟᱨ ᱟᱞᱟᱨᱢ',
      'PPE ᱥᱴᱮᱥᱚᱱ',
      'ᱯᱷᱟᱭᱟᱨ ᱮᱠᱥᱴᱤᱝᱜᱩᱭᱤᱥᱟᱨ',
      'ᱯᱷᱟᱭᱟᱨ ᱮᱠᱡᱤᱴ',
      'ᱢᱟᱥᱴᱟᱨ ᱯᱚᱭᱮᱱᱴ',
    ],
  }
  const langList = names[lang] || names.en
  return langList[stepIndex] || `Safety Object ${stepIndex + 1}`
}

export default function VirtualARHUD({
  scenario,
  currentStep,
  completedSteps,
  steps,
  lang,
  onStepClick,
  stepFeedback,
  allDone,
  saving,
  onToggleMode,
  onExit,
  isOnline,
  spatialDirectionCue,
  demoMode = true,
  onToggleDemoMode,
  timerSeconds,
  timerMaxSeconds,
  consequenceFailure,
  onRetryStep,
  positiveSuccess,
  onDecisionChoice,
  isPlaced = true,
  onPlaceObject,
  onResetPlacement,
  xrTrackingType = 'orientation',
  sensorDebug = null,
  surfaceDetection = null,
}) {
  const [showDebugHUD, setShowDebugHUD] = useState(false)
  const [instructionExpanded, setInstructionExpanded] = useState(false)
  const [trackerExpanded, setTrackerExpanded] = useState(false)

  const isSurfaceDetected = surfaceDetection?.detected ?? false
  const surfaceDist = surfaceDetection?.distance ?? 2.0
  const isWebXR = xrTrackingType === 'webxr'

  const activeStep = steps[currentStep]
  const objectName = getStepObjectName(currentStep, scenario?.hazard_type, lang)
  const isFire = scenario?.hazard_type === 'fire'
  const isGas = scenario?.hazard_type === 'gas_leak'
  const isMachinery = scenario?.hazard_type === 'machinery'

  // Hazard details and interactive AR marker badge
  const hazardMarker = isFire
    ? {
        label: '⚠ CLASS C ELECTRICAL FIRE',
        subtext: 'Live 415V Control Cabinet · In Danger Zone',
        color: '#EF4444',
        icon: <Flame size={16} color="#EF4444" />,
      }
    : isGas
    ? {
        label: '⚠ TOXIC GAS LEAK DETECTED',
        subtext: 'High Pressure Pipe Rupture · Evacuation Area',
        color: '#84CC16',
        icon: <Wind size={16} color="#84CC16" />,
      }
    : isMachinery
    ? {
        label: '⚠ ROTATING MACHINERY NIP-POINT',
        subtext: 'Live High-Torque Rollers · LOTO Required',
        color: '#F59E0B',
        icon: <Cog size={16} color="#F59E0B" />,
      }
    : {
        label: '⚠ INDUSTRIAL PPE REQUIRED',
        subtext: 'High-Risk Machinery Area · Mandatory Compliance',
        color: '#F59E0B',
        icon: <Shield size={16} color="#F59E0B" />,
      }

  function getStepText(step, field) {
    if (!step) return ''
    if (lang === 'sat' && step[`${field}_sat`]) return step[`${field}_sat`]
    if (lang === 'hi' && step[`${field}_hi`]) return step[`${field}_hi`]
    return step[field] ?? ''
  }

  const stepLabel = getStepText(activeStep, 'label')
  const stepInstruction = getStepText(activeStep, 'instruction')

  const inView = spatialDirectionCue?.inView ?? true
  const turnDirection = spatialDirectionCue?.turnDirection ?? 'in-front'
  const angleDeg = spatialDirectionCue?.angleDeg ?? 0
  const distanceMeters = spatialDirectionCue?.distanceMeters ?? '2.0'

  return (
    <div
      aria-label="Virtual AR Heads-Up Display"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'env(safe-area-inset-top, 10px) 12px env(safe-area-inset-bottom, 14px)',
        boxSizing: 'border-box',
      }}
    >
      {/* ── MINIMAL TOP BAR: Only Essential Corner Anchors (100% Uncluttered View) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pointerEvents: 'auto', zIndex: 30 }}>
        {/* Top-Left: Minimal Station & Object Chip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(15, 20, 30, 0.88)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '20px',
            padding: '5px 10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
            maxWidth: '46%',
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 8px #10B981',
              flexShrink: 0,
            }}
          />
          <span style={{
            fontSize: '0.70rem',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            STATION {currentStep + 1}/{steps.length} · {objectName.toUpperCase()}
          </span>
        </div>

        {/* Top-Center: Minimal Countdown Timer */}
        {!allDone && timerSeconds !== undefined && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: 'rgba(15, 20, 30, 0.90)',
              backdropFilter: 'blur(8px)',
              border: `1.5px solid ${timerSeconds > 7 ? '#10B981' : timerSeconds > 3 ? '#F59E0B' : '#EF4444'}`,
              borderRadius: '20px',
              padding: '4px 10px',
              boxShadow: `0 2px 10px ${timerSeconds > 7 ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.5)'}`,
              animation: timerSeconds <= 3 ? 'sarUrgentPulse 0.6s ease-in-out infinite' : 'none',
            }}
          >
            <span style={{ fontSize: '0.72rem' }}>⏱</span>
            <span
              style={{
                color: timerSeconds > 7 ? '#10B981' : timerSeconds > 3 ? '#F59E0B' : '#EF4444',
                fontSize: '0.76rem',
                fontWeight: 800,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {timerSeconds}s
            </span>
          </div>
        )}

        {/* Top-Right: Direct 3D Sim Mode Toggle & Exit Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {onToggleMode && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onToggleMode()
              }}
              title="Switch to 3D Simulation Mode"
              style={{
                background: 'rgba(14, 124, 123, 0.45)',
                border: '1.5px solid #0E7C7B',
                color: '#5EEAD4',
                borderRadius: '20px',
                padding: '5px 12px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                backdropFilter: 'blur(8px)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
                touchAction: 'manipulation',
                pointerEvents: 'auto',
              }}
            >
              <Monitor size={13} color="#5EEAD4" />
              <span>3D Sim</span>
            </button>
          )}

          {/* Exit Button */}
          {onExit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onExit()
              }}
              title="Exit Training"
              aria-label="Exit Training"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(220, 38, 38, 0.25)',
                border: '1.5px solid #DC2626',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                touchAction: 'manipulation',
                pointerEvents: 'auto',
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>



      {/* ── Off-Screen Perimeter Directional Indicators (Only when placed & not in view) ── */}
      {!allDone && isPlaced && !inView && (
        <>
          {turnDirection === 'left' && (
            <div
              style={{
                position: 'absolute',
                left: 10,
                top: '46%',
                transform: 'translateY(-50%)',
                background: 'rgba(224, 90, 0, 0.92)',
                color: 'white',
                borderRadius: '24px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 800,
                fontSize: '0.8rem',
                boxShadow: '0 0 20px rgba(224, 90, 0, 0.8)',
                animation: 'pulse 1s infinite alternate',
                pointerEvents: 'none',
              }}
            >
              <ChevronLeft size={20} />
              <span>{angleDeg}° LEFT</span>
            </div>
          )}

          {turnDirection === 'right' && (
            <div
              style={{
                position: 'absolute',
                right: 10,
                top: '46%',
                transform: 'translateY(-50%)',
                background: 'rgba(224, 90, 0, 0.92)',
                color: 'white',
                borderRadius: '24px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 800,
                fontSize: '0.8rem',
                boxShadow: '0 0 20px rgba(224, 90, 0, 0.8)',
                animation: 'pulse 1s infinite alternate',
                pointerEvents: 'none',
              }}
            >
              <span>{angleDeg}° RIGHT</span>
              <ChevronRight size={20} />
            </div>
          )}
        </>
      )}

      {/* ── Center Reticle Target (Dynamic Surface Feedback) ── */}
      <div
        style={{
          position: 'absolute',
          top: '48%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        {/* Floating Reticle Status Pill */}
        <div
          style={{
            marginBottom: 8,
            background: !isPlaced
              ? isSurfaceDetected
                ? 'rgba(16, 185, 129, 0.92)'
                : 'rgba(55, 65, 81, 0.88)'
              : inView
              ? 'rgba(16, 185, 129, 0.90)'
              : 'rgba(20, 24, 33, 0.85)',
            backdropFilter: 'blur(6px)',
            border: `1.5px solid ${
              !isPlaced
                ? isSurfaceDetected
                  ? '#10B981'
                  : '#9CA3AF'
                : inView
                ? '#10B981'
                : hazardMarker.color
            }`,
            borderRadius: '16px',
            padding: '4px 12px',
            fontSize: '0.66rem',
            fontWeight: 800,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: `0 0 16px ${
              !isPlaced
                ? isSurfaceDetected
                  ? 'rgba(16, 185, 129, 0.5)'
                  : 'rgba(0, 0, 0, 0.4)'
                : inView
                ? 'rgba(16, 185, 129, 0.5)'
                : hazardMarker.color + '44'
            }`,
            whiteSpace: 'nowrap',
          }}
        >
          <Target size={12} color="#FFFFFF" />
          <span>
            {!isPlaced
              ? isSurfaceDetected
                ? (lang === 'hi'
                    ? `✓ सतह मिली (${surfaceDist.toFixed(1)}m) — "${objectName} यहाँ स्थापित करें" दबाएं`
                    : lang === 'sat'
                    ? `✓ ᱚᱛ ᱧᱟᱢᱮᱱᱟ (${surfaceDist.toFixed(1)}m) — ᱱᱚᱸᱰᱮ ᱫᱚᱦᱚᱭ ᱢᱮ`
                    : `✓ SURFACE DETECTED (${surfaceDist.toFixed(1)}m) — READY TO PLACE`)
                : (lang === 'hi'
                    ? '⚪ कोई सतह नहीं मिली — फर्श या मेज की ओर इशारा करें'
                    : lang === 'sat'
                    ? '⚪ ᱡᱟᱦᱟᱸ ᱚᱛ ᱵᱟᱹᱱᱩᱜᱼᱟ — ᱚᱛ ᱥᱮᱫ ᱩᱫᱩᱜ ᱢᱮ'
                    : '⚪ NO SURFACE DETECTED — POINT AT FLOOR OR DESK')
              : inView
              ? `✓ ${objectName.toUpperCase()} ANCHORED (${distanceMeters}m)`
              : `SCAN ROOM FOR ${objectName.toUpperCase()}`}
          </span>
        </div>

        {/* Tracking Engine Chip */}
        {!isPlaced && (
          <div
            style={{
              marginBottom: 6,
              background: 'rgba(0, 0, 0, 0.65)',
              border: `1px solid ${isSurfaceDetected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.15)'}`,
              borderRadius: '10px',
              padding: '2px 8px',
              fontSize: '0.58rem',
              color: isSurfaceDetected ? '#6EE7B7' : '#9CA3AF',
              letterSpacing: '0.04em',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            {isWebXR
              ? isSurfaceDetected
                ? '⚡ WebXR Surface Plane Lock'
                : '⚡ WebXR Hit-Test Searching...'
              : isSurfaceDetected
              ? '📍 Surface Ready (Tap Place Below)'
              : '📍 Point at Floor or Desk...'}
          </div>
        )}

        {/* Precision Industrial Reticle */}
        <div
          style={{
            width: 76,
            height: 76,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Outer Corner Brackets */}
          {(() => {
            const reticleColor = !isPlaced
              ? isSurfaceDetected
                ? '#10B981'
                : '#9CA3AF'
              : inView
              ? '#10B981'
              : hazardMarker.color

            return (
              <>
                <div style={{ position: 'absolute', top: 0, left: 0, width: 15, height: 15, borderTop: `2.5px solid ${reticleColor}`, borderLeft: `2.5px solid ${reticleColor}` }} />
                <div style={{ position: 'absolute', top: 0, right: 0, width: 15, height: 15, borderTop: `2.5px solid ${reticleColor}`, borderRight: `2.5px solid ${reticleColor}` }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: 15, height: 15, borderBottom: `2.5px solid ${reticleColor}`, borderLeft: `2.5px solid ${reticleColor}` }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 15, height: 15, borderBottom: `2.5px solid ${reticleColor}`, borderRight: `2.5px solid ${reticleColor}` }} />

                {/* Reticle Circle */}
                {!isPlaced && (
                  <div
                    style={{
                      position: 'absolute',
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      border: isSurfaceDetected
                        ? '2px solid rgba(16, 185, 129, 0.9)'
                        : '1.5px dashed rgba(156, 163, 175, 0.6)',
                      background: isSurfaceDetected ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                    }}
                  />
                )}

                {/* Center Crosshair Dot */}
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: reticleColor,
                    boxShadow: `0 0 10px ${reticleColor}`,
                  }}
                />
              </>
            )
          })()}
        </div>
      </div>

      {/* ── Bottom Guided Training HUD Card (Minimal, Uncluttered, Max Viewport) ── */}
      <div
        style={{
          width: '100%',
          maxWidth: 580,
          margin: '0 auto',
          background: 'rgba(15, 18, 24, 0.94)',
          backdropFilter: 'blur(12px)',
          border: '1.5px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '18px',
          padding: '10px 14px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {/* Thin Progress Bar */}
        <div style={{ display: 'flex', gap: 5 }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                background: completedSteps.includes(i)
                  ? '#10B981'
                  : i === currentStep
                  ? 'var(--color-brand)'
                  : 'rgba(255, 255, 255, 0.18)',
                transition: 'background 0.3s ease',
              }}
            />
          ))}
        </div>

        {!allDone && activeStep && (
          <>
            {/* When NOT placed: Render Place Object Action Button + Prompt (unless it's a decision step!) */}
            {!isPlaced && !activeStep?.is_decision_step ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                <button
                  type="button"
                  data-testid="ar-place-object-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (isSurfaceDetected && onPlaceObject) onPlaceObject()
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  disabled={!isSurfaceDetected}
                  style={{
                    background: isSurfaceDetected
                      ? 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'
                      : 'rgba(255, 255, 255, 0.08)',
                    color: isSurfaceDetected ? '#FFFFFF' : '#9CA3AF',
                    border: isSurfaceDetected ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    padding: '11px 16px',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    cursor: isSurfaceDetected ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: isSurfaceDetected ? '0 4px 16px rgba(234, 88, 12, 0.5)' : 'none',
                    letterSpacing: '0.02em',
                    transition: 'all 0.2s ease',
                    touchAction: 'manipulation',
                    pointerEvents: 'auto',
                  }}
                  onMouseDown={e => { if (isSurfaceDetected) e.currentTarget.style.transform = 'scale(0.98)' }}
                  onMouseUp={e => { if (isSurfaceDetected) e.currentTarget.style.transform = 'scale(1)' }}
                >
                  <MapPin size={18} />
                  <span>
                    {isSurfaceDetected
                      ? (lang === 'hi'
                          ? `${objectName} यहाँ स्थापित करें`
                          : lang === 'sat'
                          ? `${objectName} ᱱᱚᱸᱰᱮ ᱫᱚᱦᱚᱭ ᱢᱮ`
                          : `Place ${objectName} Here`)
                      : (lang === 'hi'
                          ? 'सतह खोजें (फर्श या मेज)'
                          : lang === 'sat'
                          ? 'ᱚᱛ ᱥᱮᱸᱫᱽᱨᱟᱭ ᱢᱮ'
                          : 'Aim at Floor or Desk Surface')}
                  </span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.68rem', color: isSurfaceDetected ? '#10B981' : '#9CA3AF' }}>
                    <Target size={11} color={isSurfaceDetected ? '#10B981' : '#9CA3AF'} />
                    <span>
                      {isSurfaceDetected
                        ? `Surface detected at ${surfaceDist.toFixed(1)}m — ready`
                        : 'Tilt camera downward towards floor or desk plane'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.64rem', color: '#9CA3AF' }}>
                    Step {currentStep + 1}: {stepLabel}
                  </span>
                </div>
              </div>
            ) : (
              /* When PLACED: Minimized Clean Strip with Expand Toggle for Full Description */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                {/* Minimized 1-line Step Strip with Expand Chevron */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                    <span
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10B981',
                        border: '1px solid #10B98155',
                        padding: '1px 6px',
                        borderRadius: '6px',
                        fontSize: '0.64rem',
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      ✓ {objectName}
                    </span>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {stepLabel}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <button
                      type="button"
                      onClick={() => speak(`${stepLabel}. ${stepInstruction}`, lang)}
                      title="Listen audio instruction"
                      style={{
                        background: 'rgba(224, 90, 0, 0.28)',
                        border: '1px solid rgba(224, 90, 0, 0.7)',
                        borderRadius: '6px',
                        padding: '3px 8px',
                        color: '#FFA05C',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        boxShadow: '0 0 10px rgba(224, 90, 0, 0.25)',
                      }}
                    >
                      <Volume2 size={13} color="#FFA05C" />
                      <span>{lang === 'hi' ? 'आवाज़' : lang === 'sat' ? 'ᱥᱟᱰᱮ' : 'Voice'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setInstructionExpanded(prev => !prev)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        borderRadius: '6px',
                        padding: '3px 6px',
                        color: '#D1D5DB',
                        fontSize: '0.66rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                      }}
                    >
                      <span>{instructionExpanded ? 'Less' : 'Details'}</span>
                      {instructionExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                    </button>

                    {onResetPlacement && (
                      <button
                        type="button"
                        onClick={onResetPlacement}
                        title="Reposition object in space"
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.16)',
                          borderRadius: '6px',
                          padding: '3px 6px',
                          color: '#D1D5DB',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          fontSize: '0.66rem',
                        }}
                      >
                        <RotateCcw size={10} />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Collapsible Details Body */}
                {instructionExpanded && (
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.35)',
                      borderRadius: '10px',
                      padding: '8px 10px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <p style={{ margin: 0, fontSize: '0.76rem', color: '#D1D5DB', lineHeight: 1.45 }}>
                      {stepInstruction}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                      <button
                        type="button"
                        onClick={() => speak(stepInstruction, lang)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#F97316',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: '0.68rem',
                          fontWeight: 700,
                        }}
                      >
                        <Volume2 size={12} />
                        <span>Listen Audio</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Primary Action / Decision Buttons */}
                {activeStep?.is_decision_step ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', marginTop: 2 }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--color-brand)', textAlign: 'center', letterSpacing: '0.04em' }}>
                      SAFETY DECISION POINT · EVALUATE HAZARD SEVERITY
                    </div>
                    <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                      <button
                        type="button"
                        data-testid="ar-decision-small-safe"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (onDecisionChoice) onDecisionChoice('small_safe')
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #10B981, #059669)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '11px',
                          padding: '11px 8px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 5,
                          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                          touchAction: 'manipulation',
                          pointerEvents: 'auto',
                        }}
                      >
                        <span>🧯 Small &amp; Safe (Extinguish)</span>
                      </button>

                      <button
                        type="button"
                        data-testid="ar-decision-not-safe"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (onDecisionChoice) onDecisionChoice('not_safe')
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '11px',
                          padding: '11px 8px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 5,
                          boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                          touchAction: 'manipulation',
                          pointerEvents: 'auto',
                        }}
                      >
                        <span>🏃 Not Safe / Spreading (Evacuate)</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onStepClick(currentStep)
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    style={{
                      background: 'var(--color-brand)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '11px',
                      padding: '12px 16px',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 4px 16px rgba(224, 90, 0, 0.45)',
                      transition: 'transform 0.1s ease, filter 0.15s ease',
                      marginTop: 2,
                      touchAction: 'manipulation',
                      pointerEvents: 'auto',
                    }}
                    onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
                    onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <CheckCircle2 size={16} />
                    <span>Perform Action: {stepLabel}</span>
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>
            )}
          </>
        )}


        {allDone && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px',
              }}
            >
              <CheckCircle2 size={26} />
            </div>
            <h3 style={{ color: '#10B981', fontSize: '1rem', fontWeight: 800, margin: '0 0 4px' }}>
              Spatial AR Training Completed!
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '0.78rem', margin: 0 }}>
              {saving ? 'Evaluating response times and saving score...' : 'Preparing safety readiness certificate...'}
            </p>
          </div>
        )}
      </div>

      {/* ── Real-Time Correct / Incorrect Feedback Toast ── */}
      {stepFeedback && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 40,
            background: stepFeedback.correct ? 'rgba(16, 185, 129, 0.96)' : 'rgba(239, 68, 68, 0.96)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '16px 24px',
            textAlign: 'center',
            color: '#FFFFFF',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
            pointerEvents: 'none',
            animation: 'scaleIn 0.2s ease-out',
          }}
        >
          {stepFeedback.correct ? (
            <CheckCircle2 size={32} style={{ margin: '0 auto 6px' }} />
          ) : (
            <AlertTriangle size={32} style={{ margin: '0 auto 6px' }} />
          )}
          <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 2 }}>
            {stepFeedback.label}
          </div>
          <div style={{ fontSize: '0.78rem', opacity: 0.95 }}>
            {stepFeedback.correct ? 'Correct Safety Station Reached! ✓' : 'Action Out of Sequence — Follow Protocol Order'}
          </div>
        </div>
      )}

      {/* Positive Action Confirmation Badge Pulse */}
      {positiveSuccess && (
        <div
          style={{
            position: 'fixed',
            top: '24%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9998,
            background: 'rgba(16, 185, 129, 0.96)',
            backdropFilter: 'blur(10px)',
            borderRadius: 20,
            padding: '12px 22px',
            color: '#FFFFFF',
            boxShadow: '0 12px 32px rgba(16, 185, 129, 0.55)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            animation: 'sarScaleUp 0.25s ease-out',
            pointerEvents: 'none',
          }}
        >
          <CheckCircle2 size={24} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Correct Protocol Action! ✓</div>
            <div style={{ fontSize: '0.72rem', opacity: 0.9 }}>Executed within safety response window</div>
          </div>
        </div>
      )}

      {/* Consequence Overlay Modal on Failure or Timeout */}
      {consequenceFailure && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 18, 24, 0.90)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20,
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              maxWidth: 480,
              width: '100%',
              background: '#181D26',
              border: '2px solid #EF4444',
              borderRadius: 22,
              padding: '26px 22px',
              boxShadow: '0 20px 50px rgba(239, 68, 68, 0.45), 0 8px 24px rgba(0,0,0,0.8)',
              textAlign: 'center',
              color: '#FFFFFF',
              animation: 'sarScaleUp 0.25s ease-out',
            }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)',
              border: '2px solid #EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px', color: '#EF4444'
            }}>
              <AlertTriangle size={32} />
            </div>

            <div style={{
              fontSize: '0.72rem', fontWeight: 800, color: '#EF4444',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6
            }}>
              Critical Safety Consequence
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 10px', color: '#FFFFFF' }}>
              {consequenceFailure.title}
            </h2>

            <div style={{
              background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 14, padding: '12px 14px', marginBottom: 20, textAlign: 'left'
            }}>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#FCA5A5', lineHeight: 1.55 }}>
                {consequenceFailure.explanation}
              </p>
            </div>

            <button
              type="button"
              onClick={onRetryStep}
              style={{
                background: '#E05A00',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '13px 20px',
                fontSize: '0.94rem',
                fontWeight: 700,
                cursor: 'pointer',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 18px rgba(224, 90, 0, 0.45)',
              }}
            >
              <RotateCcw size={18} />
              <span>Retry This Step</span>
            </button>
          </div>
        </div>
      )}

      {/* Global Injected Keyframes */}
      <style>{`
        @keyframes sarUrgentPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.06); box-shadow: 0 0 20px rgba(239, 68, 68, 0.85); }
          100% { transform: scale(1); }
        }
        @keyframes sarScaleUp {
          0% { transform: scale(0.92); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
