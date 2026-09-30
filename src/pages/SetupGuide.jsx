import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Printer, ArrowLeft, Shield, AlertTriangle, Flame, Bell,
  DoorOpen, MapPin, Compass, Info, CheckCircle2, QrCode
} from 'lucide-react'
import { Navbar } from '../components/layout/Navbar'

const MARKERS = [
  {
    id: 'MARKER_FIRE',
    title: 'STATION 1: HAZARD ZONE (FIRE)',
    roomLocation: 'Electrical Control Panel (Corner A)',
    coordinates: 'X: +3.0m, Y: 1.2m, Z: +3.0m',
    color: '#DC2626',
    icon: Flame,
    stepDescription: 'Identifies the electrical panel fire origin. Trainee must point camera here first.',
    pattern: [
      [1,1,1,1,1,1,1, 0, 1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1, 0, 1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1, 0, 1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1, 0, 1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1, 0, 1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1, 0, 1,1,1,1,1,1,1],
      [0,0,0,0,0,0,0, 0, 0,0,0,0,0,0,0],
      [1,0,1,1,0,1,0, 1, 0,1,0,1,1,0,1],
      [0,1,0,0,1,0,1, 0, 1,0,1,0,0,1,0],
      [1,1,1,1,1,1,1, 0, 1,1,0,1,0,1,1],
      [1,0,0,0,0,0,1, 0, 0,1,1,0,1,0,0],
      [1,0,1,1,1,0,1, 0, 1,0,1,1,0,1,1],
      [1,0,0,0,0,0,1, 0, 1,1,0,0,1,0,1],
      [1,1,1,1,1,1,1, 0, 0,0,1,1,0,1,0],
    ]
  },
  {
    id: 'MARKER_ALARM',
    title: 'STATION 2: EMERGENCY ALARM CALL POINT',
    roomLocation: 'Main Corridor Wall / Near Doorway',
    coordinates: 'X: +2.5m, Y: 2.0m, Z: -2.0m',
    color: '#EA580C',
    icon: Bell,
    stepDescription: 'Wall-mounted manual call point station. Trainee activates facility siren.',
    pattern: [
      [1,1,1,1,1,1,1, 0, 1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1, 0, 1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1, 0, 1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1, 0, 1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1, 0, 1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1, 0, 1,1,1,1,1,1,1],
      [0,0,0,0,0,0,0, 0, 0,0,0,0,0,0,0],
      [0,1,1,0,1,0,1, 1, 1,0,1,0,0,1,1],
      [1,0,0,1,0,1,0, 0, 0,1,0,1,1,0,0],
      [1,1,1,1,1,1,1, 0, 1,0,1,1,0,1,0],
      [1,0,0,0,0,0,1, 0, 1,1,0,0,1,0,1],
      [1,0,1,1,1,0,1, 0, 0,0,1,1,1,0,1],
      [1,0,0,0,0,0,1, 0, 1,0,1,0,0,1,0],
      [1,1,1,1,1,1,1, 0, 1,1,0,1,1,0,1],
    ]
  },
  {
    id: 'MARKER_PPE',
    title: 'STATION 3: SAFETY LOCKER / PPE POINT',
    roomLocation: 'Equipment Bay / Locker Storage',
    coordinates: 'X: -4.0m, Y: 0.9m, Z: +1.0m',
    color: '#0284C7',
    icon: Shield,
    stepDescription: 'Mandatory PPE locker. Trainee dons fire-rated gloves, helmet, and goggles.',
    pattern: [
      [1,1,1,1,1,1,1, 0, 1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1, 0, 1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1, 0, 1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1, 0, 1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1, 0, 1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1, 0, 1,1,1,1,1,1,1],
      [0,0,0,0,0,0,0, 0, 0,0,0,0,0,0,0],
      [1,1,0,1,0,0,1, 1, 0,1,1,0,1,0,1],
      [0,0,1,0,1,1,0, 0, 1,0,0,1,0,1,0],
      [1,1,1,1,1,1,1, 0, 1,1,0,0,1,1,0],
      [1,0,0,0,0,0,1, 0, 0,1,1,0,0,1,1],
      [1,0,1,1,1,0,1, 0, 1,0,0,1,1,0,1],
      [1,0,0,0,0,0,1, 0, 1,1,1,0,0,1,0],
      [1,1,1,1,1,1,1, 0, 0,1,0,1,1,0,1],
    ]
  },
  {
    id: 'MARKER_EXTINGUISHER',
    title: 'STATION 4: CO₂ EXTINGUISHER POST',
    roomLocation: 'Support Pillar 2 / Workshop Stand',
    coordinates: 'X: +1.5m, Y: 0.8m, Z: +2.0m',
    color: '#059669',
    icon: AlertTriangle,
    stepDescription: 'Industrial CO₂ extinguisher rack. Trainee picks up extinguisher to fight flames.',
    pattern: [
      [1,1,1,1,1,1,1, 0, 1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1, 0, 1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1, 0, 1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1, 0, 1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1, 0, 1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1, 0, 1,1,1,1,1,1,1],
      [0,0,0,0,0,0,0, 0, 0,0,0,0,0,0,0],
      [1,0,1,0,1,1,0, 1, 1,1,0,0,1,0,1],
      [0,1,0,1,0,0,1, 0, 0,0,1,1,0,1,0],
      [1,1,1,1,1,1,1, 0, 1,0,1,0,1,1,0],
      [1,0,0,0,0,0,1, 0, 1,1,0,1,0,0,1],
      [1,0,1,1,1,0,1, 0, 0,1,1,0,1,1,0],
      [1,0,0,0,0,0,1, 0, 1,0,0,1,1,0,1],
      [1,1,1,1,1,1,1, 0, 1,1,1,0,0,1,1],
    ]
  },
  {
    id: 'MARKER_EXIT',
    title: 'STATION 5: EMERGENCY FIRE EXIT',
    roomLocation: 'North Wall Fire Exit Double Doors',
    coordinates: 'X: -6.0m, Y: 1.5m, Z: -5.0m',
    color: '#16A34A',
    icon: DoorOpen,
    stepDescription: 'Designated fire evacuation doorway. Trainee exits hazard area through green doors.',
    pattern: [
      [1,1,1,1,1,1,1, 0, 1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1, 0, 1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1, 0, 1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1, 0, 1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1, 0, 1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1, 0, 1,1,1,1,1,1,1],
      [0,0,0,0,0,0,0, 0, 0,0,0,0,0,0,0],
      [0,1,0,1,1,0,1, 1, 0,1,0,1,1,1,0],
      [1,0,1,0,0,1,0, 0, 1,0,1,0,0,0,1],
      [1,1,1,1,1,1,1, 0, 1,1,1,0,1,0,1],
      [1,0,0,0,0,0,1, 0, 0,0,1,1,0,1,0],
      [1,0,1,1,1,0,1, 0, 1,1,0,0,1,1,1],
      [1,0,0,0,0,0,1, 0, 1,0,1,1,0,0,1],
      [1,1,1,1,1,1,1, 0, 0,1,0,1,1,1,0],
    ]
  },
  {
    id: 'MARKER_MUSTER',
    title: 'STATION 6: SAFE MUSTER ASSEMBLY POINT',
    roomLocation: 'Outdoor Assembly Ground / Open Area',
    coordinates: 'X: 0.0m, Y: 1.0m, Z: +10.0m',
    color: '#9333EA',
    icon: MapPin,
    stepDescription: 'Safe outdoor roll-call area. Trainee completes evacuation and confirms survival.',
    pattern: [
      [1,1,1,1,1,1,1, 0, 1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1, 0, 1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1, 0, 1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1, 0, 1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1, 0, 1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1, 0, 1,1,1,1,1,1,1],
      [0,0,0,0,0,0,0, 0, 0,0,0,0,0,0,0],
      [1,1,1,0,0,1,0, 1, 1,0,0,1,1,0,1],
      [0,0,0,1,1,0,1, 0, 0,1,1,0,0,1,0],
      [1,1,1,1,1,1,1, 0, 1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1, 0, 1,1,0,0,0,1,1],
      [1,0,1,1,1,0,1, 0, 0,0,1,1,1,0,0],
      [1,0,0,0,0,0,1, 0, 1,1,0,1,0,1,1],
      [1,1,1,1,1,1,1, 0, 1,0,1,0,1,0,1],
    ]
  },
]

export default function SetupGuide() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')

  const filteredMarkers = activeTab === 'all'
    ? MARKERS
    : MARKERS.filter(m => m.id === activeTab)

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', color: '#1E293B' }}>
      <div className="no-print">
        <Navbar />
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; padding: 0 !important; }
          .page-break { page-break-after: always; break-after: page; }
          .marker-card {
            border: 4px solid black !important;
            box-shadow: none !important;
            page-break-inside: avoid;
            margin: 20px auto !important;
            max-width: 90% !important;
          }
        }
      `}</style>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px 80px' }}>
        {/* Header Breadcrumb & Actions */}
        <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'white', border: '1px solid #CBD5E1', borderRadius: 8,
                padding: '8px 14px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                Spatial Multi-Location AR Setup Guide
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#64748B' }}>
                Print high-contrast AR station markers and affix them around your training room.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => window.print()}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#E05A00', color: 'white', border: 'none', borderRadius: 8,
                padding: '10px 18px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(224, 90, 0, 0.3)'
              }}
            >
              <Printer size={18} /> Print All Station Markers
            </button>
          </div>
        </div>

        {/* How It Works Explainer Box */}
        <div className="no-print" style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: 16, padding: '24px', color: 'white', marginBottom: 32,
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ background: '#E05A00', padding: 8, borderRadius: 10, display: 'flex' }}>
              <Compass size={20} color="white" />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
              How Spatial Multi-Location AR Works in SurakshaAR
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, fontSize: '0.88rem', color: '#CBD5E1', lineHeight: 1.5 }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
              <strong style={{ color: '#F8FAFC', display: 'block', marginBottom: 4 }}>
                1. True Physical Separation (Not Floating With Screen)
              </strong>
              Each training station sits at a fixed 3D world vector relative to the room origin. When the trainee walks or turns their phone, objects stay anchored to their real-world location.
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
              <strong style={{ color: '#F8FAFC', display: 'block', marginBottom: 4 }}>
                2. Step-by-Step Wayfinding Guidance
              </strong>
              Only the active step's target and beacon are highlighted. Off-screen compass cues (e.g. <em>"Turn 90° right toward Alarm Call Point"</em>) guide the trainee physically to the next station.
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
              <strong style={{ color: '#F8FAFC', display: 'block', marginBottom: 4 }}>
                3. Marker-Based Room Anchoring (Path B)
              </strong>
              Print the markers below on standard A4 paper. Tape them at chest height (~1.2m to 1.8m) at each respective station in the room.
            </div>
          </div>
        </div>

        {/* Station Filter Tabs */}
        <div className="no-print" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 20 }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 600,
              background: activeTab === 'all' ? '#0F172A' : '#E2E8F0',
              color: activeTab === 'all' ? 'white' : '#475569',
              border: 'none', cursor: 'pointer'
            }}
          >
            All Stations ({MARKERS.length})
          </button>
          {MARKERS.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveTab(m.id)}
              style={{
                padding: '6px 14px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 600,
                background: activeTab === m.id ? m.color : '#E2E8F0',
                color: activeTab === m.id ? 'white' : '#475569',
                border: 'none', cursor: 'pointer', whiteSpace: 'nowrap'
              }}
            >
              {m.id}
            </button>
          ))}
        </div>

        {/* Printable Markers Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {filteredMarkers.map((marker, idx) => {
            const IconComponent = marker.icon
            return (
              <div
                key={marker.id}
                className="marker-card page-break"
                style={{
                  background: 'white',
                  borderRadius: 16,
                  border: `3px solid ${marker.color}`,
                  padding: 32,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  position: 'relative'
                }}
              >
                {/* Station Tag & Coordinates */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px dashed #E2E8F0', paddingBottom: 16, marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ background: marker.color, color: 'white', borderRadius: 12, padding: 12, display: 'flex' }}>
                      <IconComponent size={32} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: marker.color, letterSpacing: '0.06em' }}>
                        SURAKSHA-AR ANCHOR FIDUCIAL
                      </div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '2px 0 0', color: '#0F172A' }}>
                        {marker.title}
                      </h3>
                      <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: 2 }}>
                        📍 Suggested Room Placement: <strong>{marker.roomLocation}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-block', background: '#F1F5F9', borderRadius: 8, padding: '6px 12px', fontSize: '0.82rem', fontFamily: 'monospace', fontWeight: 700, color: '#334155' }}>
                      World Vector: {marker.coordinates}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: 4 }}>
                      Tape at ~1.4m height from floor
                    </div>
                  </div>
                </div>

                {/* Central Fiducial Marker Pattern */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0' }}>
                  <div style={{
                    border: `12px solid ${marker.color}`,
                    padding: 16,
                    background: '#FFFFFF',
                    borderRadius: 16,
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
                  }}>
                    {/* Matrix Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${marker.pattern[0].length}, 16px)`,
                      gridTemplateRows: `repeat(${marker.pattern.length}, 16px)`,
                      gap: 2,
                      background: '#000000',
                      padding: 12,
                      border: '6px solid #000000'
                    }}>
                      {marker.pattern.map((row, r) =>
                        row.map((val, c) => (
                          <div
                            key={`${r}-${c}`}
                            style={{
                              width: 16,
                              height: 16,
                              background: val === 1 ? '#000000' : '#FFFFFF',
                            }}
                          />
                        ))
                      )}
                    </div>

                    <div style={{ marginTop: 14, textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.1em', color: '#0F172A' }}>
                        {marker.id}
                      </div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B' }}>
                        SURAKSHA INDUSTRIAL SPATIAL ANCHOR
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructions footer on card */}
                <div style={{
                  marginTop: 24,
                  paddingTop: 16,
                  borderTop: '1px solid #E2E8F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.82rem',
                  color: '#475569',
                  flexWrap: 'wrap',
                  gap: 8
                }}>
                  <div>
                    <strong>Purpose:</strong> {marker.stepDescription}
                  </div>
                  <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                    SurakshaAR Standard Field Training Marker v2.0
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
