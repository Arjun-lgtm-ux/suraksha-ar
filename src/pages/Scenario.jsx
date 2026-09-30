/**
 * SurakshaAR — AR & 3D Industrial Safety Simulator
 *
 * Designed for workers in Jharkhand's mining, steel, and manufacturing sectors.
 *
 * Features:
 *   1. 🖥️ 3D Simulation Mode:
 *      - Full 360° OrbitControls (drag to rotate, pinch/wheel to zoom)
 *      - On-screen touch D-pad & zoom buttons for mobile accessibility
 *      - "🎯 Focus Target" camera auto-aim button
 *      - Bright industrial lighting with safety-striped warehouse floor
 *      - Realistic industrial props (Control panel fire, PPE station, Alarm, Extinguisher, Exit, Muster point)
 *      - High-visibility vertical beacon light beams + floating step badges
 *   2. 📷 Camera AR Mode:
 *      - Live camera feed (environment facing) with transparent 3D overlay
 *      - Device orientation tracking (gyro/compass) with off-screen target pointer
 *   3. Dual Interaction:
 *      - Tap directly on 3D object in scene
 *      - OR tap the large on-screen action button in HUD
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  X, Camera, Monitor, CheckCircle, WifiOff,
  Compass, ZoomIn, ZoomOut, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Target, Volume2, RotateCw, AlertTriangle, RotateCcw, CheckCircle2
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLang } from '../contexts/LanguageContext'
import { useOffline } from '../contexts/OfflineContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { mockGetScenario, mockCreateSession, mockUpdateSession, mockInsertFeedbackLog } from '../lib/mockDb'
import { calculateScore } from '../lib/scoring'
import { queueOfflineAction } from '../lib/indexeddb'
import { speak, stopSpeech } from '../lib/voice'
import VirtualARHUD from '../components/ar/VirtualARHUD'
import { competencyTracker } from '../lib/competencyTracker'

// ─── Floating Canvas Text Sprite Helper ────────────────────────────────────────
function createStepBadgeSprite(stepNumber, label, color = '#E05A00') {
  const canvas = document.createElement('canvas')
  canvas.width = 640
  canvas.height = 120
  const ctx = canvas.getContext('2d')

  // Background pill
  ctx.fillStyle = 'rgba(15, 18, 26, 0.94)'
  ctx.strokeStyle = color
  ctx.lineWidth = 5
  const r = 48, x = 5, y = 5, w = 630, h = 110
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Circular step number badge
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(60, 60, 38, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#FFFFFF'
  ctx.font = '900 40px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(stepNumber), 60, 62)

  // Title text with industrial marker icon
  const markerPrefixes = ['⚠ HAZARD: ', '🚨 ALARM: ', '🦺 PPE: ', '🧯 ACTION: ', '🚪 EVACUATE: ', '📍 MUSTER: ']
  const prefix = markerPrefixes[stepNumber - 1] || '🎯 STEP: '
  const displayText = prefix + label

  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(displayText, 114, 60)

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false })
  const sprite = new THREE.Sprite(material)
  // Human-scaled: 0.72m wide x 0.14m tall (occupies ~25% of mobile screen width at 2m distance)
  sprite.scale.set(0.72, 0.14, 1)
  return sprite
}

// ─── Procedural Web Audio Ambient Fire Sound Synthesizer ─────────────────────
class ProceduralFireAudio {
  constructor() {
    this.ctx = null
    this.gainNode = null
    this.noiseSource = null
    this.filter = null
    this.isPlaying = false
    this.intervalId = null
    this.isEscalated = false
  }

  start() {
    if (this.isPlaying) return
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return
      if (!this.ctx) {
        this.ctx = new AudioCtx()
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {})
      }

      this.gainNode = this.ctx.createGain()
      this.gainNode.gain.setValueAtTime(0.01, this.ctx.currentTime)
      const targetGain = this.isEscalated ? 0.38 : 0.18
      this.gainNode.gain.exponentialRampToValueAtTime(targetGain, this.ctx.currentTime + 0.8)
      this.gainNode.connect(this.ctx.destination)

      // Low frequency fire roar (pink/brown noise generator buffer)
      const bufferSize = Math.floor(this.ctx.sampleRate * 2)
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      let b0 = 0, b1 = 0, b2 = 0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        b0 = 0.99 * b0 + white * 0.05
        b1 = 0.95 * b1 + white * 0.10
        b2 = 0.85 * b2 + white * 0.25
        output[i] = (b0 + b1 + b2) * 0.22
      }

      this.noiseSource = this.ctx.createBufferSource()
      this.noiseSource.buffer = noiseBuffer
      this.noiseSource.loop = true

      this.filter = this.ctx.createBiquadFilter()
      this.filter.type = 'lowpass'
      this.filter.frequency.setValueAtTime(this.isEscalated ? 520 : 360, this.ctx.currentTime)

      this.noiseSource.connect(this.filter)
      this.filter.connect(this.gainNode)
      this.noiseSource.start()

      // Randomized crisp crackle / pop bursts
      this.intervalId = setInterval(() => {
        if (!this.isPlaying || !this.ctx || this.ctx.state !== 'running') return
        const chance = this.isEscalated ? 0.85 : 0.65
        if (Math.random() < chance) {
          const osc = this.ctx.createOscillator()
          const popGain = this.ctx.createGain()
          const burstDur = 0.010 + Math.random() * 0.025
          osc.type = Math.random() < 0.5 ? 'triangle' : 'sawtooth'
          const freq = this.isEscalated ? 500 + Math.random() * 1500 : 400 + Math.random() * 1200
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
          osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + burstDur)

          const gainLvl = this.isEscalated ? 0.09 + Math.random() * 0.12 : 0.05 + Math.random() * 0.08
          popGain.gain.setValueAtTime(gainLvl, this.ctx.currentTime)
          popGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + burstDur)

          osc.connect(popGain)
          popGain.connect(this.gainNode)
          osc.start()
          osc.stop(this.ctx.currentTime + burstDur)
        }
      }, 70)

      this.isPlaying = true
    } catch (e) {
      console.warn('[SurakshaAR] Fire sound initialization deferred:', e)
    }
  }

  setEscalated(escalated) {
    this.isEscalated = !!escalated
    if (!this.gainNode || !this.ctx || this.ctx.state !== 'running') return
    try {
      const targetGain = this.isEscalated ? 0.40 : 0.18
      this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime)
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime)
      this.gainNode.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.4)
      if (this.filter) {
        this.filter.frequency.linearRampToValueAtTime(this.isEscalated ? 520 : 360, this.ctx.currentTime + 0.4)
      }
    } catch {}
  }

  playCO2Discharge() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return
      if (!this.ctx) this.ctx = new AudioCtx()
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {})

      const now = this.ctx.currentTime
      const dur = 1.6

      // White noise buffer for pressurized gas discharge
      const bufSize = Math.floor(this.ctx.sampleRate * dur)
      const buffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1)
      }

      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      // High-pressure gas hiss filter (Bandpass around 1800 Hz)
      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(1800, now)
      filter.Q.setValueAtTime(1.6, now)

      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(0.01, now)
      gain.gain.linearRampToValueAtTime(0.42, now + 0.06) // Sudden pressurized blast
      gain.gain.exponentialRampToValueAtTime(0.32, now + 0.8)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur) // Decaying hiss

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      noise.start(now)
      noise.stop(now + dur)
    } catch (e) {
      console.warn('[SurakshaAR] CO2 audio discharge failed:', e)
    }
  }

  playEvacuationAlarm() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return
      if (!this.ctx) this.ctx = new AudioCtx()
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {})

      const now = this.ctx.currentTime
      // 3 urgent industrial two-tone siren pulses
      for (let p = 0; p < 3; p++) {
        const tStart = now + p * 0.42
        const osc = this.ctx.createOscillator()
        const g = this.ctx.createGain()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(880, tStart)
        osc.frequency.setValueAtTime(660, tStart + 0.16)

        g.gain.setValueAtTime(0.24, tStart)
        g.gain.linearRampToValueAtTime(0.24, tStart + 0.32)
        g.gain.exponentialRampToValueAtTime(0.0001, tStart + 0.38)

        osc.connect(g)
        g.connect(this.ctx.destination)
        osc.start(tStart)
        osc.stop(tStart + 0.38)
      }
    } catch (e) {
      console.warn('[SurakshaAR] Evacuation alarm audio failed:', e)
    }
  }

  stop() {
    if (!this.isPlaying) return
    try {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
      if (this.gainNode && this.ctx && this.ctx.state === 'running') {
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime)
        this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3)
        setTimeout(() => {
          if (this.noiseSource) {
            try { this.noiseSource.stop() } catch {}
          }
          this.isPlaying = false
        }, 350)
      } else {
        this.isPlaying = false
      }
    } catch {
      this.isPlaying = false
    }
  }
}

// ─── Procedural Web Audio Subtle Countdown Ticking Synthesizer ───────────────
class ProceduralTickAudio {
  constructor() {
    this.ctx = null
  }

  playTick(isCritical = false) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return
      if (!this.ctx) this.ctx = new AudioCtx()
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {})
      }
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const dur = 0.038
      osc.type = isCritical ? 'triangle' : 'sine'
      osc.frequency.setValueAtTime(isCritical ? 1050 : 750, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(isCritical ? 380 : 260, this.ctx.currentTime + dur)

      // Subtle, non-annoying volume
      gain.gain.setValueAtTime(isCritical ? 0.16 : 0.10, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + dur)
    } catch {}
  }
}

// ─── Procedural Canvas Textures for Signage & Labels (Zero 404s) ───────────────
function createAlarmFaceTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256; canvas.height = 320
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#DC2626'
  ctx.fillRect(0, 0, 256, 320)

  // White header banner
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(14, 14, 228, 56)
  ctx.fillStyle = '#DC2626'
  ctx.font = '900 26px -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('FIRE ALARM', 128, 52)

  // Break glass window outline
  ctx.fillStyle = '#F8FAFC'
  ctx.fillRect(36, 90, 184, 115)
  ctx.strokeStyle = '#1E293B'
  ctx.lineWidth = 4
  ctx.strokeRect(36, 90, 184, 115)

  ctx.fillStyle = '#DC2626'
  ctx.font = 'bold 16px sans-serif'
  ctx.fillText('BREAK GLASS', 128, 140)
  ctx.fillText('PULL LEVER', 128, 170)

  // Bottom pull down arrow
  ctx.fillStyle = '#FACC15'
  ctx.beginPath()
  ctx.moveTo(128, 275)
  ctx.lineTo(95, 235)
  ctx.lineTo(161, 235)
  ctx.closePath()
  ctx.fill()

  const tex = new THREE.CanvasTexture(canvas)
  return tex
}

function createExtinguisherLabelTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  // Dark industrial vinyl backing
  ctx.fillStyle = '#11141A'
  ctx.fillRect(0, 0, 1024, 512)

  // Outer safety border line
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 6
  ctx.strokeRect(8, 8, 1008, 496)

  // 1. Top Header: Bold High-Contrast Industrial Crimson
  ctx.fillStyle = '#DC2626'
  ctx.fillRect(16, 16, 992, 100)

  ctx.fillStyle = '#FFFFFF'
  ctx.font = '900 46px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('CARBON DIOXIDE (CO₂)', 512, 70)

  ctx.fillStyle = '#FEE2E2'
  ctx.font = '700 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText('5 KG STORED PRESSURE · IS:15683 COMPLIANT · CLASS B & C', 512, 102)

  // 2. PASS Operating Instructions (4 column blocks)
  const passSteps = [
    { num: '1', title: 'PULL', desc: 'Pull Safety Pin\nBreak seal tag' },
    { num: '2', title: 'AIM', desc: 'Aim Horn Nozzle\nAt base of fire' },
    { num: '3', title: 'SQUEEZE', desc: 'Squeeze Lever\nDischarge gas' },
    { num: '4', title: 'SWEEP', desc: 'Sweep Horn\nSide to side' },
  ]

  const boxW = 232
  const gap = 16
  const startX = 24
  const startY = 130

  passSteps.forEach((st, i) => {
    const x = startX + i * (boxW + gap)
    ctx.fillStyle = '#1E2430'
    ctx.fillRect(x, startY, boxW, 150)
    ctx.strokeStyle = '#475569'
    ctx.lineWidth = 3
    ctx.strokeRect(x, startY, boxW, 150)

    // Number circle badge
    ctx.fillStyle = '#DC2626'
    ctx.beginPath()
    ctx.arc(x + 36, startY + 36, 22, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#FFFFFF'
    ctx.font = '900 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(st.num, x + 36, startY + 44)

    // Action Header
    ctx.fillStyle = '#38BDF8'
    ctx.font = '900 24px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(st.title, x + 72, startY + 44)

    // Description text
    ctx.fillStyle = '#E2E8F0'
    ctx.font = '600 17px sans-serif'
    const lines = st.desc.split('\n')
    lines.forEach((line, li) => {
      ctx.fillText(line, x + 16, startY + 90 + li * 26)
    })
  })

  // 3. Fire Hazard Class Badges
  // Class B (Flammable Liquids)
  ctx.fillStyle = '#1D4ED8'
  ctx.fillRect(24, 296, 480, 72)
  ctx.strokeStyle = '#60A5FA'
  ctx.lineWidth = 3
  ctx.strokeRect(24, 296, 480, 72)

  ctx.fillStyle = '#FFFFFF'
  ctx.font = '900 26px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('CLASS B : FLAMMABLE LIQUIDS', 46, 342)

  // Class C (Energized Electrical Equipment)
  ctx.fillStyle = '#B45309'
  ctx.fillRect(520, 296, 480, 72)
  ctx.strokeStyle = '#FBBF24'
  ctx.lineWidth = 3
  ctx.strokeRect(520, 296, 480, 72)

  ctx.fillStyle = '#FFFFFF'
  ctx.font = '900 26px sans-serif'
  ctx.fillText('CLASS C : ENERGIZED ELECTRICAL', 542, 342)

  // 4. Yellow Safety Caution Warning Banner (Frostbite Hazard)
  ctx.fillStyle = '#EAB308'
  ctx.fillRect(24, 384, 976, 56)

  // Warning text
  ctx.fillStyle = '#000000'
  ctx.font = '900 21px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('⚠️ CAUTION: CO₂ DISCHARGE EXPANDS AT -78.5°C — HOLD FROST-FREE INSULATED GRIP ONLY', 512, 420)

  // 5. Maintenance / Hydrostatic stamp info
  ctx.fillStyle = '#64748B'
  ctx.font = '600 16px monospace'
  ctx.textAlign = 'left'
  ctx.fillText('HYDROSTATIC TEST: 250 BAR · CAPACITY: 5.0 KG · FACTORY TESTED 2026', 30, 475)

  ctx.fillStyle = '#22C55E'
  ctx.font = 'bold 16px sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('✔ SURAKSHA INSPECTION VERIFIED', 990, 475)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.generateMipmaps = true
  return tex
}

function createExitSignTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512; canvas.height = 256
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#15803D'
  ctx.fillRect(0, 0, 512, 256)
  ctx.strokeStyle = '#22C55E'
  ctx.lineWidth = 12
  ctx.strokeRect(6, 6, 500, 244)

  // Running man silhouette
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(115, 68, 22, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(112, 92)
  ctx.lineTo(132, 136)
  ctx.lineTo(118, 170)
  ctx.lineTo(100, 145)
  ctx.lineTo(92, 102)
  ctx.closePath()
  ctx.fill()

  // Door outline
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 8
  ctx.strokeRect(45, 58, 44, 132)

  // "EXIT" text
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '900 80px -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('EXIT', 310, 144)

  // Right arrow
  ctx.beginPath()
  ctx.moveTo(415, 128)
  ctx.lineTo(460, 128)
  ctx.lineTo(445, 113)
  ctx.moveTo(460, 128)
  ctx.lineTo(445, 143)
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 8
  ctx.stroke()

  const tex = new THREE.CanvasTexture(canvas)
  return tex
}

function createMusterSignTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 384; canvas.height = 384
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#15803D'
  ctx.fillRect(0, 0, 384, 384)
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 10
  ctx.strokeRect(8, 8, 368, 368)

  // 4 corner inward arrows
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath(); ctx.moveTo(45, 45); ctx.lineTo(105, 45); ctx.lineTo(45, 105); ctx.closePath(); ctx.fill()
  ctx.beginPath(); ctx.moveTo(339, 45); ctx.lineTo(279, 45); ctx.lineTo(339, 105); ctx.closePath(); ctx.fill()
  ctx.beginPath(); ctx.moveTo(45, 339); ctx.lineTo(105, 339); ctx.lineTo(45, 279); ctx.closePath(); ctx.fill()
  ctx.beginPath(); ctx.moveTo(339, 339); ctx.lineTo(279, 339); ctx.lineTo(339, 279); ctx.closePath(); ctx.fill()

  // Center figures
  ctx.beginPath(); ctx.arc(192, 135, 22, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(145, 155, 18, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(239, 155, 18, 0, Math.PI * 2); ctx.fill()

  ctx.fillRect(174, 162, 36, 75)
  ctx.fillRect(132, 178, 26, 60)
  ctx.fillRect(226, 178, 26, 60)

  ctx.font = '900 28px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('ASSEMBLY POINT', 192, 310)

  const tex = new THREE.CanvasTexture(canvas)
  return tex
}

// ─── Procedural Canvas Textures for Realistic Fire & Smoke Particles ─────────
let _flameTex = null
function getFlameParticleTexture() {
  if (_flameTex) return _flameTex
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')

  // Smooth radial gradient with white-hot core, vivid orange mid, and soft red feathered edge
  const grad = ctx.createRadialGradient(64, 76, 4, 64, 64, 60)
  grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)')
  grad.addColorStop(0.18, 'rgba(255, 240, 140, 0.95)')
  grad.addColorStop(0.42, 'rgba(255, 130, 20, 0.88)')
  grad.addColorStop(0.70, 'rgba(235, 45, 5, 0.55)')
  grad.addColorStop(0.90, 'rgba(180, 15, 0, 0.18)')
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)')

  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(64, 64, 60, 0, Math.PI * 2)
  ctx.fill()

  _flameTex = new THREE.CanvasTexture(canvas)
  return _flameTex
}

let _smokeTex = null
function getSmokeParticleTexture() {
  if (_smokeTex) return _smokeTex
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')

  // Soft billowing smoke puff with feathered edges
  const grad = ctx.createRadialGradient(64, 64, 6, 64, 64, 60)
  grad.addColorStop(0.0, 'rgba(55, 60, 70, 0.65)')
  grad.addColorStop(0.38, 'rgba(48, 52, 60, 0.40)')
  grad.addColorStop(0.72, 'rgba(40, 44, 50, 0.15)')
  grad.addColorStop(1.0, 'rgba(20, 22, 25, 0.0)')

  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(64, 64, 60, 0, Math.PI * 2)
  ctx.fill()

  _smokeTex = new THREE.CanvasTexture(canvas)
  return _smokeTex
}

// ─── Realistic 3D Fire Object Generator (Step 0 Station Prop) ────────────────
function createFireSourceProp() {
  const propGroup = new THREE.Group()

  // 1. Heavy industrial charred steel electrical junction box
  const boxBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.52, 0.22, 0.36),
    new THREE.MeshStandardMaterial({ color: '#161920', metalness: 0.75, roughness: 0.45 })
  )
  boxBase.position.y = 0.11
  propGroup.add(boxBase)

  // Open charred enclosure door panel angled outward
  const doorPanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.30, 0.02),
    new THREE.MeshStandardMaterial({ color: '#1E232B', metalness: 0.65, roughness: 0.55 })
  )
  doorPanel.position.set(-0.28, 0.15, 0.12)
  doorPanel.rotation.y = 0.82
  propGroup.add(doorPanel)

  // Burnt industrial wiring and severed copper cable ends
  const wireMatRed = new THREE.MeshStandardMaterial({ color: '#991B1B', roughness: 0.4 })
  const wireMatChar = new THREE.MeshStandardMaterial({ color: '#18181B', roughness: 0.9 })
  const wireMatCop = new THREE.MeshStandardMaterial({ color: '#B45309', metalness: 0.6, roughness: 0.3 })
  for (let w = 0; w < 5; w++) {
    const mat = w % 2 === 0 ? wireMatRed : (w === 1 ? wireMatChar : wireMatCop)
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.16, 8), mat)
    wire.position.set(-0.12 + w * 0.06, 0.18, 0.02 + (w % 2) * 0.04)
    wire.rotation.z = (w - 2) * 0.22
    propGroup.add(wire)
  }

  // Yellow & black safety hazard warning chevron stripe
  const stripe = new THREE.Mesh(
    new THREE.PlaneGeometry(0.46, 0.045),
    new THREE.MeshStandardMaterial({ color: '#F59E0B', emissive: '#B45309', emissiveIntensity: 0.6, roughness: 0.4 })
  )
  stripe.position.set(0, 0.08, 0.182)
  propGroup.add(stripe)

  // Charred coal rocks & glowing embers around the base
  const coalMat = new THREE.MeshStandardMaterial({ color: '#18181B', roughness: 0.9 })
  const glowMat = new THREE.MeshStandardMaterial({ color: '#FF3B00', emissive: '#FF2200', emissiveIntensity: 3.5 })
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const dist = 0.22 + (i % 3) * 0.03
    const coal = new THREE.Mesh(new THREE.DodecahedronGeometry(0.032 + (i % 2) * 0.015), coalMat)
    coal.position.set(Math.cos(angle) * dist, 0.03, Math.sin(angle) * dist)
    coal.rotation.set(i, i * 1.5, i * 0.7)
    propGroup.add(coal)

    const ember = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), glowMat)
    ember.position.set(Math.cos(angle + 0.3) * (dist * 0.9), 0.035, Math.sin(angle + 0.3) * (dist * 0.9))
    propGroup.add(ember)
  }

  // 2. Procedural Canvas Textures for Flame & Smoke Billboards
  const flameTex = getFlameParticleTexture()
  const smokeTex = getSmokeParticleTexture()

  // 3. Flame Billboard Sprites (28 particles for organic, volumetric fire)
  const flameCount = 28
  const flameParticles = []
  const flameGroup = new THREE.Group()
  propGroup.add(flameGroup)

  for (let i = 0; i < flameCount; i++) {
    const mat = new THREE.SpriteMaterial({
      map: flameTex,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    })
    const sprite = new THREE.Sprite(mat)
    const particle = {
      sprite,
      mat,
      life: (i / flameCount),
      speed: 0.55 + (i % 5) * 0.12,
      baseRadius: 0.04 + (i % 4) * 0.03,
      angle: i * 2.39996, // golden angle spiral
      wobbleSpeed: 8 + (i % 6) * 3,
      wobblePhase: i * 1.5,
      baseScale: 0.30 + (i % 3) * 0.09,
    }
    flameGroup.add(sprite)
    flameParticles.push(particle)
  }

  // 4. Rising Smoke Particles (14 particles)
  const smokeCount = 14
  const smokeParticles = []
  const smokeGroup = new THREE.Group()
  propGroup.add(smokeGroup)

  for (let i = 0; i < smokeCount; i++) {
    const mat = new THREE.SpriteMaterial({
      map: smokeTex,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    })
    const sprite = new THREE.Sprite(mat)
    const particle = {
      sprite,
      mat,
      life: i / smokeCount,
      speed: 0.32 + (i % 3) * 0.08,
      baseRadius: 0.07 + (i % 3) * 0.04,
      angle: i * 1.7,
      driftX: ((i % 5) - 2) * 0.05,
      driftZ: (((i + 2) % 5) - 2) * 0.05,
      baseScale: 0.36 + (i % 4) * 0.12,
    }
    smokeGroup.add(sprite)
    smokeParticles.push(particle)
  }

  // 5. White-Hot Central Flame Core & Inner Flame Body (Volumetric Particle Sprites)
  const coreMat = new THREE.SpriteMaterial({
    map: flameTex,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
  })
  const flameCore = new THREE.Sprite(coreMat)
  flameCore.position.set(0, 0.28, 0)
  flameCore.scale.set(0.38, 0.52, 1)
  propGroup.add(flameCore)

  const innerFlameMat = new THREE.SpriteMaterial({
    map: flameTex,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
  })
  const innerFlame = new THREE.Sprite(innerFlameMat)
  innerFlame.position.set(0, 0.34, 0)
  innerFlame.scale.set(0.48, 0.65, 1)
  propGroup.add(innerFlame)

  // 6. Dynamic Flickering PointLight (Synchronized to Fire)
  const fireLight = new THREE.PointLight('#FF5500', 4.5, 4.5)
  fireLight.position.set(0, 0.42, 0)
  propGroup.add(fireLight)

  // 7. Dynamic Per-Frame Animation Update Routine
  function updateFire(elapsed, isEscalated) {
    const scaleMult = isEscalated ? 2.25 : 1.0

    // Animate Inner Flame Sprites
    const coreBreath = (1.0 + Math.sin(elapsed * 9.0) * 0.08) * scaleMult
    flameCore.scale.set(
      0.38 * coreBreath * (1.0 + Math.sin(elapsed * 17.0) * 0.10),
      0.52 * coreBreath * (1.0 + Math.cos(elapsed * 14.0) * 0.12),
      1
    )
    innerFlame.scale.set(
      0.48 * coreBreath * (1.0 + Math.cos(elapsed * 15.0) * 0.10),
      0.65 * coreBreath * (1.0 + Math.sin(elapsed * 12.0) * 0.14),
      1
    )

    // Animate Flame Billboard Particles
    for (let i = 0; i < flameParticles.length; i++) {
      const p = flameParticles[i]
      p.life += 0.016 * p.speed
      if (p.life > 1.0) p.life -= 1.0

      // Height rises from top of box (y = 0.22) to y = 0.76 * scaleMult
      const curY = 0.22 + p.life * (0.54 * scaleMult)

      // Radius tapers as it rises to tip
      const taper = (1.0 - p.life * 0.7)
      const rad = p.baseRadius * taper * scaleMult
      const wobble = Math.sin(elapsed * p.wobbleSpeed + p.wobblePhase) * 0.035 * scaleMult
      const curX = Math.cos(p.angle) * rad + wobble
      const curZ = Math.sin(p.angle) * rad + Math.cos(elapsed * p.wobbleSpeed) * 0.03 * scaleMult

      p.sprite.position.set(curX, curY, curZ)

      // Scale grows in mid-flame and tapers at tip
      const sizeCurve = Math.sin(p.life * Math.PI)
      const curScale = p.baseScale * (0.5 + sizeCurve * 0.8) * scaleMult
      p.sprite.scale.set(curScale, curScale * 1.35, 1)

      // Opacity fades smoothly near the flame top
      p.mat.opacity = (1.0 - Math.pow(p.life, 2.5)) * (isEscalated ? 0.95 : 0.82)
    }

    // Animate Rising Smoke Particles
    for (let i = 0; i < smokeParticles.length; i++) {
      const p = smokeParticles[i]
      p.life += 0.012 * p.speed
      if (p.life > 1.0) p.life -= 1.0

      // Rises above flames from y = 0.48 to y = 1.35 * scaleMult
      const curY = 0.48 + p.life * (0.85 * scaleMult)
      const driftMult = p.life * 1.2
      const curX = Math.cos(p.angle) * p.baseRadius + p.driftX * driftMult + Math.sin(elapsed * 2.5 + i) * 0.05
      const curZ = Math.sin(p.angle) * p.baseRadius + p.driftZ * driftMult + Math.cos(elapsed * 2.0 + i) * 0.05

      p.sprite.position.set(curX, curY, curZ)

      // Smoke billows and expands as it rises
      const curScale = p.baseScale * (0.7 + p.life * 1.4) * scaleMult
      p.sprite.scale.set(curScale, curScale, 1)

      // Smoke opacity fades out smoothly
      const alpha = Math.sin(p.life * Math.PI) * (isEscalated ? 0.45 : 0.28)
      p.mat.opacity = Math.max(0, alpha)
    }

    // Dynamic Flickering Light
    const flicker = Math.sin(elapsed * 21.0) * 0.5 + Math.sin(elapsed * 13.0) * 0.35 + Math.cos(elapsed * 31.0) * 0.25
    fireLight.intensity = (isEscalated ? 9.6 : 4.6) + flicker * (isEscalated ? 2.4 : 1.2)
    fireLight.distance = isEscalated ? 8.5 : 4.5
    fireLight.color.set(isEscalated ? '#FF1500' : '#FF5500')
  }

  propGroup.userData = {
    flames: [flameCore, innerFlame, ...flameParticles.map(p => p.sprite)],
    smoke: smokeParticles.map(p => p.sprite),
    fireLight,
    updateFire,
  }

  return propGroup
}

function createHazardPadProp() {
  const propGroup = new THREE.Group()
  const pad = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.27, 0.04, 24),
    new THREE.MeshStandardMaterial({ color: '#EAB308', metalness: 0.2, roughness: 0.4 })
  )
  pad.position.y = 0.02
  propGroup.add(pad)
  return propGroup
}

// ─── 3D Props for Training Station Steps ───────────────────────────────────────
function createAlarmBoxProp() {
  const propGroup = new THREE.Group()

  // Red wall box
  const alarmBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.26, 0.32, 0.09),
    new THREE.MeshStandardMaterial({ color: '#DC2626', roughness: 0.3, metalness: 0.2 })
  )
  propGroup.add(alarmBox)

  // Faceplate with FIRE ALARM canvas texture
  const faceTex = createAlarmFaceTexture()
  const faceplate = new THREE.Mesh(
    new THREE.PlaneGeometry(0.24, 0.30),
    new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.4 })
  )
  faceplate.position.set(0, 0, 0.048)
  propGroup.add(faceplate)

  // Pull lever handle
  const lever = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.03, 0.04),
    new THREE.MeshStandardMaterial({ color: '#1E293B', metalness: 0.8 })
  )
  lever.position.set(0, -0.06, 0.07)
  propGroup.add(lever)

  // Pulsing Emergency Amber/Red Strobe on top
  const strobeBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.035, 0.03, 16),
    new THREE.MeshStandardMaterial({ color: '#334155', metalness: 0.8 })
  )
  strobeBase.position.set(0, 0.175, 0)
  propGroup.add(strobeBase)

  const strobe = new THREE.Mesh(
    new THREE.SphereGeometry(0.028, 16, 16),
    new THREE.MeshStandardMaterial({ color: '#F59E0B', emissive: '#D97706', emissiveIntensity: 2.5 })
  )
  strobe.position.set(0, 0.20, 0)
  propGroup.add(strobe)

  const strobeLight = new THREE.PointLight('#F59E0B', 1.8, 2.5)
  strobeLight.position.set(0, 0.22, 0)
  propGroup.add(strobeLight)

  propGroup.userData = { strobe, strobeLight }
  return propGroup
}

function createPPEStationProp() {
  const propGroup = new THREE.Group()

  // Brushed aluminum stand & circular base
  const standBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.18, 0.03, 24),
    new THREE.MeshStandardMaterial({ color: '#475569', metalness: 0.8, roughness: 0.3 })
  )
  standBase.position.y = -0.16
  propGroup.add(standBase)

  const standPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.38, 16),
    new THREE.MeshStandardMaterial({ color: '#64748B', metalness: 0.8, roughness: 0.2 })
  )
  standPole.position.y = 0.03
  propGroup.add(standPole)

  // Industrial Yellow Safety Helmet (IS 2925)
  const helmetDome = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.58),
    new THREE.MeshStandardMaterial({ color: '#FACC15', metalness: 0.2, roughness: 0.3, side: THREE.DoubleSide })
  )
  helmetDome.position.set(0, 0.16, 0)
  propGroup.add(helmetDome)

  // Helmet brim
  const helmetBrim = new THREE.Mesh(
    new THREE.TorusGeometry(0.125, 0.016, 12, 24),
    new THREE.MeshStandardMaterial({ color: '#EAB308', roughness: 0.3 })
  )
  helmetBrim.rotation.x = Math.PI / 2
  helmetBrim.position.set(0, 0.15, 0)
  propGroup.add(helmetBrim)

  // Safety Goggles with Cyan reflective visor
  const gogglesFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.045, 0.03),
    new THREE.MeshStandardMaterial({ color: '#0F172A', roughness: 0.6 })
  )
  gogglesFrame.position.set(0, 0.10, 0.08)
  propGroup.add(gogglesFrame)

  const gogglesLens = new THREE.Mesh(
    new THREE.BoxGeometry(0.13, 0.038, 0.01),
    new THREE.MeshStandardMaterial({ color: '#38BDF8', emissive: '#0284C7', emissiveIntensity: 0.6, transparent: true, opacity: 0.85 })
  )
  gogglesLens.position.set(0, 0.10, 0.095)
  propGroup.add(gogglesLens)

  // Heavy duty safety gloves (pair)
  const gloveMat = new THREE.MeshStandardMaterial({ color: '#16A34A', roughness: 0.6 })
  const gloveL = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.12, 0.03), gloveMat)
  gloveL.position.set(-0.09, -0.02, 0.04)
  propGroup.add(gloveL)

  const gloveR = gloveL.clone()
  gloveR.position.x = 0.09
  propGroup.add(gloveR)

  return propGroup
}

function createExtinguisherProp() {
  const propGroup = new THREE.Group()

  // 1. Heavy-duty black molded rubber impact boot / base ring
  const baseBoot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.082, 0.084, 0.055, 32),
    new THREE.MeshStandardMaterial({
      color: '#18181B',
      roughness: 0.88,
      metalness: 0.08,
    })
  )
  baseBoot.position.y = -0.19
  propGroup.add(baseBoot)

  // 2. High-pressure forged steel cylinder body (Satin powder-coated Safety Red)
  const cyl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.078, 0.078, 0.44, 32),
    new THREE.MeshStandardMaterial({
      color: '#B91C1C',
      roughness: 0.38,
      metalness: 0.32,
    })
  )
  cyl.position.y = 0.05
  propGroup.add(cyl)

  // 3. Smooth domed cylinder shoulder
  const shoulder = new THREE.Mesh(
    new THREE.SphereGeometry(0.078, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.46),
    new THREE.MeshStandardMaterial({
      color: '#B91C1C',
      roughness: 0.38,
      metalness: 0.32,
    })
  )
  shoulder.position.y = 0.27
  propGroup.add(shoulder)

  // 4. Machined brass neck collar ring
  const neckRing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.034, 0.040, 0.032, 24),
    new THREE.MeshStandardMaterial({
      color: '#C29B38',
      metalness: 0.85,
      roughness: 0.22,
    })
  )
  neckRing.position.y = 0.325
  propGroup.add(neckRing)

  // 5. Screen-printed Vinyl PASS & Hazard Classification Label (wrapped around cylinder)
  const labelTex = createExtinguisherLabelTexture()
  const labelMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.079, 0.079, 0.26, 32, 1, true, 0, Math.PI * 1.15),
    new THREE.MeshStandardMaterial({
      map: labelTex,
      roughness: 0.42,
      metalness: 0.1,
    })
  )
  labelMesh.position.set(0, 0.04, 0)
  labelMesh.rotation.y = Math.PI * 0.425
  propGroup.add(labelMesh)

  // 6. Forged Brass Valve Manifold Assembly
  const valve = new THREE.Mesh(
    new THREE.BoxGeometry(0.045, 0.055, 0.044),
    new THREE.MeshStandardMaterial({
      color: '#D97706',
      metalness: 0.88,
      roughness: 0.24,
    })
  )
  valve.position.set(0, 0.36, 0)
  propGroup.add(valve)

  // 7. Brushed Stainless Steel Carry Handle (Lower fixed grip)
  const carryHandle = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.016, 0.026),
    new THREE.MeshStandardMaterial({
      color: '#94A3B8',
      metalness: 0.90,
      roughness: 0.18,
    })
  )
  carryHandle.position.set(-0.055, 0.365, 0)
  propGroup.add(carryHandle)

  // 8. Stainless Steel Operating Squeeze Lever (Upper hinged trigger)
  const squeezeLever = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.014, 0.024),
    new THREE.MeshStandardMaterial({
      color: '#CBD5E1',
      metalness: 0.92,
      roughness: 0.14,
    })
  )
  squeezeLever.position.set(-0.05, 0.395, 0)
  squeezeLever.rotation.z = -0.16
  propGroup.add(squeezeLever)

  // 9. Chrome Hinge Pivot Rivet
  const pivotPin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.007, 0.007, 0.032, 12),
    new THREE.MeshStandardMaterial({ color: '#F1F5F9', metalness: 0.95, roughness: 0.1 })
  )
  pivotPin.position.set(0.01, 0.38, 0)
  pivotPin.rotation.x = Math.PI / 2
  propGroup.add(pivotPin)

  // 10. Polished Chrome Safety Pull Pin with Split Wire Ring
  const ringGeo = new THREE.TorusGeometry(0.018, 0.0035, 12, 24)
  const ringMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', metalness: 0.98, roughness: 0.08 })
  const pullRing = new THREE.Mesh(ringGeo, ringMat)
  pullRing.position.set(-0.01, 0.375, 0.028)
  pullRing.rotation.y = 0.35
  propGroup.add(pullRing)

  // 11. Bright Yellow Tamper Indicator Seal Tag
  const seal = new THREE.Mesh(
    new THREE.BoxGeometry(0.010, 0.022, 0.008),
    new THREE.MeshStandardMaterial({ color: '#FACC15', roughness: 0.45 })
  )
  seal.position.set(-0.01, 0.362, 0.025)
  propGroup.add(seal)

  // 12. Flexible Reinforced High-Pressure Rubber Discharge Hose
  const hosePoints = [
    new THREE.Vector3(0.024, 0.36, 0),
    new THREE.Vector3(0.075, 0.32, 0.03),
    new THREE.Vector3(0.095, 0.22, 0.06),
    new THREE.Vector3(0.090, 0.14, 0.06),
  ]
  const hoseCurve = new THREE.CatmullRomCurve3(hosePoints)
  const hose = new THREE.Mesh(
    new THREE.TubeGeometry(hoseCurve, 16, 0.009, 10, false),
    new THREE.MeshStandardMaterial({ color: '#1E293B', roughness: 0.78, metalness: 0.1 })
  )
  propGroup.add(hose)

  // Brass Hose Coupler
  const coupler = new THREE.Mesh(
    new THREE.CylinderGeometry(0.011, 0.011, 0.022, 12),
    new THREE.MeshStandardMaterial({ color: '#C29B38', metalness: 0.85, roughness: 0.25 })
  )
  coupler.position.set(0.025, 0.36, 0)
  coupler.rotation.z = Math.PI / 2
  propGroup.add(coupler)

  // 13. Flared CO2 Trumpet Discharge Horn Nozzle
  const hornGroup = new THREE.Group()
  // Insulated Frost-Free Ribbed Handle Grip
  const grip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.019, 0.019, 0.075, 16),
    new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.92 })
  )
  grip.position.set(0, 0.09, 0)
  hornGroup.add(grip)

  // Conical Discharge Horn
  const hornCone = new THREE.Mesh(
    new THREE.CylinderGeometry(0.046, 0.018, 0.20, 24, 1, true),
    new THREE.MeshStandardMaterial({ color: '#0F172A', roughness: 0.68, metalness: 0.12, side: THREE.DoubleSide })
  )
  hornCone.position.set(0, -0.04, 0)
  hornGroup.add(hornCone)

  // Horn Lip Ring
  const hornLip = new THREE.Mesh(
    new THREE.TorusGeometry(0.046, 0.0035, 10, 24),
    new THREE.MeshStandardMaterial({ color: '#1E293B', roughness: 0.7 })
  )
  hornLip.position.set(0, 0.06, 0)
  hornLip.rotation.x = Math.PI / 2
  hornGroup.add(hornLip)

  hornGroup.position.set(0.095, 0.06, 0.06)
  hornGroup.rotation.z = -0.32
  hornGroup.rotation.x = 0.18
  propGroup.add(hornGroup)

  // 14. Soft Contact Shadow Disc on Floor
  const shadowCanvas = document.createElement('canvas')
  shadowCanvas.width = 128
  shadowCanvas.height = 128
  const sCtx = shadowCanvas.getContext('2d')
  const sGrad = sCtx.createRadialGradient(64, 64, 8, 64, 64, 62)
  sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)')
  sGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)')
  sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
  sCtx.fillStyle = sGrad
  sCtx.beginPath()
  sCtx.arc(64, 64, 62, 0, Math.PI * 2)
  sCtx.fill()
  const shadowTex = new THREE.CanvasTexture(shadowCanvas)

  const shadowDisc = new THREE.Mesh(
    new THREE.PlaneGeometry(0.38, 0.38),
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.85, depthWrite: false })
  )
  shadowDisc.rotation.x = -Math.PI / 2
  shadowDisc.position.y = -0.215
  propGroup.add(shadowDisc)

  // 15. Generous mobile touch hitbox (invisible)
  const hitBox = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.80, 12),
    new THREE.MeshBasicMaterial({ visible: false })
  )
  hitBox.position.y = 0.15
  propGroup.add(hitBox)

  propGroup.userData = {
    isExtinguisher: true,
    hornGroup,
  }

  return propGroup
}

function createExitSignProp() {
  const propGroup = new THREE.Group()

  // Sign housing
  const casing = new THREE.Mesh(
    new THREE.BoxGeometry(0.44, 0.24, 0.05),
    new THREE.MeshStandardMaterial({ color: '#0F172A', roughness: 0.5 })
  )
  propGroup.add(casing)

  // Glowing faceplate with Running Man & EXIT text
  const exitTex = createExitSignTexture()
  const faceplate = new THREE.Mesh(
    new THREE.PlaneGeometry(0.42, 0.22),
    new THREE.MeshStandardMaterial({
      map: exitTex,
      emissive: '#15803D',
      emissiveIntensity: 0.95,
      roughness: 0.2,
    })
  )
  faceplate.position.set(0, 0, 0.027)
  propGroup.add(faceplate)

  // Subtle emergency green glow light
  const exitLight = new THREE.PointLight('#22C55E', 1.6, 2.5)
  exitLight.position.set(0, 0, 0.12)
  propGroup.add(exitLight)

  return propGroup
}

function createMusterPointProp() {
  const propGroup = new THREE.Group()

  // Aluminum support pole
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.65, 16),
    new THREE.MeshStandardMaterial({ color: '#64748B', metalness: 0.7, roughness: 0.3 })
  )
  post.position.y = -0.05
  propGroup.add(post)

  // ISO 7010 Muster Sign Board
  const musterTex = createMusterSignTexture()
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.36, 0.035),
    new THREE.MeshStandardMaterial({ color: '#0F172A' })
  )
  board.position.y = 0.22
  propGroup.add(board)

  const faceplate = new THREE.Mesh(
    new THREE.PlaneGeometry(0.34, 0.34),
    new THREE.MeshStandardMaterial({
      map: musterTex,
      emissive: '#15803D',
      emissiveIntensity: 0.9,
      roughness: 0.2,
    })
  )
  faceplate.position.set(0, 0.22, 0.02)
  propGroup.add(faceplate)

  // Safe floor muster ring on ground
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.35, 0.42, 32),
    new THREE.MeshBasicMaterial({ color: '#22C55E', side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
  )
  ring.rotation.x = -Math.PI / 2
  ring.position.y = -0.37
  propGroup.add(ring)

  return propGroup
}

// ─── Machinery Scenario 3D Props & Textures ──────────────────────────────────
function createNipPointWarningTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 384; canvas.height = 160
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#F59E0B'
  ctx.fillRect(0, 0, 384, 160)

  // Top & bottom hazard diagonal warning stripes
  ctx.fillStyle = '#0F172A'
  for (let i = -160; i < 400; i += 28) {
    ctx.beginPath()
    ctx.moveTo(i, 0); ctx.lineTo(i + 14, 0); ctx.lineTo(i - 6, 24); ctx.lineTo(i - 20, 24); ctx.closePath(); ctx.fill()
    ctx.beginPath()
    ctx.moveTo(i, 136); ctx.lineTo(i + 14, 136); ctx.lineTo(i - 6, 160); ctx.lineTo(i - 20, 160); ctx.closePath(); ctx.fill()
  }

  ctx.fillStyle = '#0F172A'
  ctx.font = '900 24px -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('⚠ DANGER ⚠', 192, 58)
  ctx.font = '800 20px -apple-system, sans-serif'
  ctx.fillText('PINCH / NIP POINT', 192, 88)
  ctx.font = '700 14px -apple-system, sans-serif'
  ctx.fillText('KEEP HANDS & CLOTHING CLEAR', 192, 116)

  return new THREE.CanvasTexture(canvas)
}

function createEStopFaceTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256; canvas.height = 256
  const ctx = canvas.getContext('2d')

  // Yellow legend ring
  ctx.fillStyle = '#FACC15'
  ctx.beginPath()
  ctx.arc(128, 128, 124, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#CA8A04'
  ctx.lineWidth = 6
  ctx.stroke()

  // Legend text
  ctx.fillStyle = '#0F172A'
  ctx.font = '900 22px -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('EMERGENCY', 128, 44)
  ctx.fillText('STOP', 128, 230)

  ctx.font = '900 16px sans-serif'
  ctx.fillText('◀ PUSH', 46, 134)
  ctx.fillText('STOP ▶', 210, 134)

  return new THREE.CanvasTexture(canvas)
}

function createLOTOTagTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256; canvas.height = 384
  const ctx = canvas.getContext('2d')

  // White tag background
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, 256, 384)
  ctx.strokeStyle = '#DC2626'
  ctx.lineWidth = 8
  ctx.strokeRect(4, 4, 248, 376)

  // Red DANGER banner
  ctx.fillStyle = '#DC2626'
  ctx.beginPath()
  if (ctx.roundRect) {
    ctx.roundRect(12, 14, 232, 68, 8)
  } else {
    ctx.rect(12, 14, 232, 68)
  }
  ctx.fill()

  ctx.fillStyle = '#FFFFFF'
  ctx.font = '900 32px -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('DANGER', 128, 58)

  // Text details
  ctx.fillStyle = '#0F172A'
  ctx.font = '900 22px -apple-system, sans-serif'
  ctx.fillText('DO NOT', 128, 122)
  ctx.fillText('OPERATE', 128, 150)

  ctx.strokeStyle = '#CBD5E1'
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(24, 172); ctx.lineTo(232, 172); ctx.stroke()

  ctx.font = '800 15px -apple-system, sans-serif'
  ctx.fillStyle = '#DC2626'
  ctx.fillText('EQUIPMENT LOCKED OUT', 128, 202)

  ctx.fillStyle = '#475569'
  ctx.font = '600 13px -apple-system, sans-serif'
  ctx.fillText('BY: SURAKSHA TRAINEE', 128, 236)
  ctx.fillText('DEPT: ROTATING MACHINERY', 128, 266)
  ctx.fillText('STATUS: LOCKED / TAGGED', 128, 296)

  // Bottom warning stripe
  ctx.fillStyle = '#DC2626'
  ctx.fillRect(12, 332, 232, 34)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '800 14px -apple-system, sans-serif'
  ctx.fillText('LIFE DEPENDS ON IT', 128, 355)

  return new THREE.CanvasTexture(canvas)
}

function createZeroEnergyGaugeTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 384; canvas.height = 192
  const ctx = canvas.getContext('2d')

  // Digital dark screen
  ctx.fillStyle = '#051A0E'
  ctx.fillRect(0, 0, 384, 192)
  ctx.strokeStyle = '#10B981'
  ctx.lineWidth = 4
  ctx.strokeRect(4, 4, 376, 184)

  // Header status
  ctx.fillStyle = '#34D399'
  ctx.font = '700 16px -apple-system, monospace'
  ctx.textAlign = 'left'
  ctx.fillText('ISO 14118 ZERO-ENERGY TEST', 18, 32)

  // Digital reading
  ctx.fillStyle = '#10B981'
  ctx.font = '900 52px -apple-system, monospace'
  ctx.fillText('0.00 V', 22, 98)

  // Safe badge
  ctx.fillStyle = '#064E3B'
  ctx.beginPath()
  if (ctx.roundRect) {
    ctx.roundRect(238, 58, 128, 46, 6)
  } else {
    ctx.rect(238, 58, 128, 46)
  }
  ctx.fill()
  ctx.fillStyle = '#6EE7B7'
  ctx.font = '800 18px -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0.0V SAFE', 302, 88)

  ctx.textAlign = 'left'
  ctx.font = '700 15px -apple-system, monospace'
  ctx.fillStyle = '#34D399'
  ctx.fillText('RESIDUAL PRESSURE: 0.00 BAR [SAFE]', 18, 144)
  ctx.fillText('ISOLATION STATUS: VERIFIED ZERO', 18, 168)

  return new THREE.CanvasTexture(canvas)
}

function createMachineryNipPointProp() {
  const propGroup = new THREE.Group()

  // 1. Cast iron machinery bed base
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(0.44, 0.05, 0.28),
    new THREE.MeshStandardMaterial({ color: '#334155', metalness: 0.8, roughness: 0.3 })
  )
  base.position.y = -0.05
  propGroup.add(base)

  // 2. Front caution warning decal
  const warnTex = createNipPointWarningTexture()
  const warnPlate = new THREE.Mesh(
    new THREE.PlaneGeometry(0.36, 0.15),
    new THREE.MeshStandardMaterial({ map: warnTex, roughness: 0.4 })
  )
  warnPlate.position.set(0, 0.06, 0.142)
  propGroup.add(warnPlate)

  // 3. Side bearing blocks
  const blockMat = new THREE.MeshStandardMaterial({ color: '#475569', metalness: 0.7, roughness: 0.35 })
  const blockL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.18), blockMat)
  blockL.position.set(-0.19, 0.08, 0)
  propGroup.add(blockL)

  const blockR = blockL.clone()
  blockR.position.x = 0.19
  propGroup.add(blockR)

  // 4. Counter-rotating steel nip rollers
  const rollerMat = new THREE.MeshStandardMaterial({ color: '#CBD5E1', metalness: 0.9, roughness: 0.18 })
  const roller1 = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.32, 24), rollerMat)
  roller1.rotation.z = Math.PI / 2
  roller1.position.set(0, 0.13, -0.04)
  propGroup.add(roller1)

  const roller2 = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.32, 24), rollerMat)
  roller2.rotation.z = Math.PI / 2
  roller2.position.set(0, 0.05, 0.04)
  propGroup.add(roller2)

  // 5. Nip pinch point warning light
  const pinchLight = new THREE.PointLight('#F59E0B', 2.8, 3.0)
  pinchLight.position.set(0, 0.09, 0)
  propGroup.add(pinchLight)

  propGroup.userData = { rollers: [roller1, roller2], pinchLight }
  return propGroup
}

function createEStopButtonProp() {
  const propGroup = new THREE.Group()

  // 1. Industrial yellow push-button enclosure
  const casing = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.28, 0.10),
    new THREE.MeshStandardMaterial({ color: '#EAB308', metalness: 0.25, roughness: 0.4 })
  )
  propGroup.add(casing)

  // 2. Yellow circular legend faceplate
  const faceTex = createEStopFaceTexture()
  const faceplate = new THREE.Mesh(
    new THREE.PlaneGeometry(0.22, 0.22),
    new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.35 })
  )
  faceplate.position.set(0, 0, 0.052)
  propGroup.add(faceplate)

  // 3. E-Stop Button stem & red mushroom head
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.032, 0.032, 0.04, 16),
    new THREE.MeshStandardMaterial({ color: '#0F172A', metalness: 0.8 })
  )
  stem.rotation.x = Math.PI / 2
  stem.position.set(0, 0, 0.07)
  propGroup.add(stem)

  const mushroomCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.075, 0.065, 0.038, 24),
    new THREE.MeshStandardMaterial({
      color: '#DC2626',
      emissive: '#B91C1C',
      emissiveIntensity: 0.5,
      metalness: 0.3,
      roughness: 0.25,
    })
  )
  mushroomCap.rotation.x = Math.PI / 2
  mushroomCap.position.set(0, 0, 0.095)
  propGroup.add(mushroomCap)

  // 4. Red status glow light
  const eLight = new THREE.PointLight('#EF4444', 2.0, 2.5)
  eLight.position.set(0, 0, 0.15)
  propGroup.add(eLight)

  return propGroup
}

function createLOTOStationProp() {
  const propGroup = new THREE.Group()

  // 1. Steel disconnect breaker enclosure
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.36, 0.10),
    new THREE.MeshStandardMaterial({ color: '#334155', metalness: 0.75, roughness: 0.35 })
  )
  propGroup.add(box)

  // 2. Disconnect rotary switch handle in OFF position
  const handle = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.035, 0.04),
    new THREE.MeshStandardMaterial({ color: '#0F172A', metalness: 0.9 })
  )
  handle.position.set(0, 0.04, 0.07)
  propGroup.add(handle)

  // 3. Red Steel Lockout Hasp
  const hasp = new THREE.Mesh(
    new THREE.TorusGeometry(0.04, 0.008, 12, 24),
    new THREE.MeshStandardMaterial({ color: '#DC2626', metalness: 0.5 })
  )
  hasp.position.set(0, 0.02, 0.09)
  propGroup.add(hasp)

  // 4. MasterLock Safety Padlock
  const padBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.07, 0.03),
    new THREE.MeshStandardMaterial({ color: '#DC2626', metalness: 0.3, roughness: 0.3 })
  )
  padBody.position.set(0, -0.04, 0.10)
  propGroup.add(padBody)

  const padShackle = new THREE.Mesh(
    new THREE.TorusGeometry(0.022, 0.005, 8, 16, Math.PI),
    new THREE.MeshStandardMaterial({ color: '#E2E8F0', metalness: 0.95, roughness: 0.1 })
  )
  padShackle.position.set(0, -0.005, 0.10)
  propGroup.add(padShackle)

  // 5. Hanging DANGER DO NOT OPERATE Tag
  const tagTex = createLOTOTagTexture()
  const tagMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.12, 0.18),
    new THREE.MeshStandardMaterial({ map: tagTex, roughness: 0.4, side: THREE.DoubleSide })
  )
  tagMesh.position.set(0.03, -0.16, 0.11)
  tagMesh.rotation.z = -0.08
  propGroup.add(tagMesh)

  const lotoLight = new THREE.PointLight('#DC2626', 1.8, 2.5)
  lotoLight.position.set(0, -0.04, 0.16)
  propGroup.add(lotoLight)

  return propGroup
}

function createZeroEnergyPanelProp() {
  const propGroup = new THREE.Group()

  // 1. Instrumentation box
  const panel = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.24, 0.08),
    new THREE.MeshStandardMaterial({ color: '#1E293B', metalness: 0.6, roughness: 0.4 })
  )
  propGroup.add(panel)

  // 2. Digital display screen with 0.00V SAFE reading
  const screenTex = createZeroEnergyGaugeTexture()
  const screenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.32, 0.16),
    new THREE.MeshStandardMaterial({
      map: screenTex,
      emissive: '#064E3B',
      emissiveIntensity: 0.6,
      roughness: 0.2,
    })
  )
  screenMesh.position.set(0, 0.01, 0.042)
  propGroup.add(screenMesh)

  // 3. Test probe terminal sockets
  const probeRed = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.02, 16),
    new THREE.MeshStandardMaterial({ color: '#EF4444' })
  )
  probeRed.rotation.x = Math.PI / 2
  probeRed.position.set(-0.08, -0.085, 0.045)
  propGroup.add(probeRed)

  const probeBlack = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.02, 16),
    new THREE.MeshStandardMaterial({ color: '#0F172A' })
  )
  probeBlack.rotation.x = Math.PI / 2
  probeBlack.position.set(-0.03, -0.085, 0.045)
  propGroup.add(probeBlack)

  // 4. Glowing Zero-Energy Green LED
  const greenLed = new THREE.Mesh(
    new THREE.SphereGeometry(0.015, 12, 12),
    new THREE.MeshStandardMaterial({ color: '#10B981', emissive: '#059669', emissiveIntensity: 3.5 })
  )
  greenLed.position.set(0.12, -0.085, 0.045)
  propGroup.add(greenLed)

  const zeroLight = new THREE.PointLight('#10B981', 2.2, 2.5)
  zeroLight.position.set(0, 0, 0.12)
  propGroup.add(zeroLight)

  return propGroup
}

function createMachineGuardProp() {
  const propGroup = new THREE.Group()

  // 1. Safety yellow barrier frame
  const frameMat = new THREE.MeshStandardMaterial({ color: '#EAB308', metalness: 0.4, roughness: 0.35 })
  const frameTop = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 0.03), frameMat)
  frameTop.position.set(0, 0.20, 0)
  propGroup.add(frameTop)

  const frameBottom = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 0.03), frameMat)
  frameBottom.position.set(0, -0.20, 0)
  propGroup.add(frameBottom)

  const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.40, 0.03), frameMat)
  frameL.position.set(-0.175, 0, 0)
  propGroup.add(frameL)

  const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.40, 0.03), frameMat)
  frameR.position.set(0.175, 0, 0)
  propGroup.add(frameR)

  // 2. Protective wire mesh lattice bars
  const barMat = new THREE.MeshStandardMaterial({ color: '#64748B', metalness: 0.8, roughness: 0.3 })
  for (let i = -0.14; i <= 0.14; i += 0.04) {
    const vBar = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.38, 8), barMat)
    vBar.position.set(i, 0, 0)
    propGroup.add(vBar)
  }
  for (let j = -0.16; j <= 0.16; j += 0.04) {
    const hBar = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.34, 8), barMat)
    hBar.rotation.z = Math.PI / 2
    hBar.position.set(0, j, 0)
    propGroup.add(hBar)
  }

  // 3. Safety Interlock Switch sensor
  const interlockBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.08, 0.04),
    new THREE.MeshStandardMaterial({ color: '#DC2626', roughness: 0.3 })
  )
  interlockBox.position.set(0.175, 0.05, 0.02)
  propGroup.add(interlockBox)

  const interlockLed = new THREE.Mesh(
    new THREE.SphereGeometry(0.012, 12, 12),
    new THREE.MeshStandardMaterial({ color: '#22C55E', emissive: '#16A34A', emissiveIntensity: 3.0 })
  )
  interlockLed.position.set(0.175, 0.07, 0.045)
  propGroup.add(interlockLed)

  const guardLight = new THREE.PointLight('#EAB308', 1.8, 2.5)
  guardLight.position.set(0, 0, 0.10)
  propGroup.add(guardLight)

  return propGroup
}

// ─── Camera AR Live Video Background ──────────────────────────────────────────
function CameraBackground({ streamRef, videoRef }) {
  useEffect(() => {
    if (videoRef?.current && streamRef?.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(() => {})
    }
  }, [streamRef, videoRef])

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      autoPlay
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', zIndex: 0,
      }}
    />
  )
}

// Robust cross-platform UUID generator with fallback
function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID()
    } catch (_) {}
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// ─── Main Scenario Page Component ─────────────────────────────────────────────
export default function Scenario() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { T, lang } = useLang()
  const { isOnline } = useOffline()

  const [arMode, setArMode]               = useState(false)
  const [cameraAvail, setCameraAvail]     = useState(false)
  const [cameraChecked, setCameraChecked] = useState(false)
  const [currentStep, setCurrentStep]     = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [stepLogs, setStepLogs]           = useState([])
  const [sessionId, setSessionId]         = useState(null)
  const [saving, setSaving]               = useState(false)
  const [stepStartTime, setStepStartTime] = useState(Date.now())
  const [stepFeedback, setStepFeedback]   = useState(null)
  const [showControlsHelp, setShowControlsHelp] = useState(true)
  const [spatialDirectionCue, setSpatialDirectionCue] = useState(null)
  const [demoMode, setDemoMode]           = useState(true) // Presentation / Demo Mode default ON
  const [placedSteps, setPlacedSteps]     = useState({})
  const placedStepsRef                    = useRef({})
  placedStepsRef.current                  = placedSteps
  const [xrTrackingType, setXrTrackingType] = useState('orientation') // 'webxr' | 'orientation' | 'webxr_supported_gyro'
  const [webXrSupported, setWebXrSupported] = useState(false)
  const [sensorDebug, setSensorDebug]     = useState({
    activeMethod: 'Detecting sensors...',
    eventCount: 0,
    alpha: 0,
    beta: 90,
    gamma: 0,
    camFwd: { x: 0, y: 0, z: -1 },
    placedCoords: null,
    isWebXrSupported: false,
  })

  // Surface detection state for real-world plane anchoring
  const [surfaceDetection, setSurfaceDetection] = useState({
    detected: false,
    distance: 0,
    surfaceType: 'none',
    reason: 'searching',
  })
  const surfaceDetectionRef = useRef({
    detected: false,
    distance: 0,
    hitPos: null,
    surfaceType: 'none',
    reason: 'searching',
  })

  // ── Step Countdown Timer & Consequence System ─────────────────────────────
  const getStepDuration = (idx) => (idx <= 1 ? 20 : 15)
  const [timerSeconds, setTimerSeconds]   = useState(20)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [consequenceFailure, setConsequenceFailure] = useState(null)
  const [positiveSuccess, setPositiveSuccess] = useState(null)
  const [actualFireState, setActualFireState] = useState('small_safe') // 'small_safe' | 'not_safe'
  const [fireEscalated, setFireEscalated] = useState(false)

  const fireEscalatedRef = useRef(false)
  const consequenceFailureRef = useRef(null)
  consequenceFailureRef.current = consequenceFailure
  const stepRetriesRef = useRef({})
  const stepSessionLogsRef = useRef([])
  const timerIntervalRef = useRef(null)
  const handleStepClickRef = useRef(null)

  useEffect(() => {
    window.__setSurakshaFireState = (state) => {
      console.log('[SurakshaAR] Manually override fire state to:', state)
      setActualFireState(state)
    }
  }, [])

  const canvasRef = useRef(null)
  const cameraStreamRef = useRef(null)
  const cameraVideoRef = useRef(null)
  const fireAudioRef = useRef(new ProceduralFireAudio())
  const tickAudioRef = useRef(new ProceduralTickAudio())

  // Three.js persistent references
  const threeRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    animId: null,
    stepNodes: [], // { group, propGroup, orbMesh, ringMesh, beamMesh, badgeSprite, stepIndex, pos }
    hazardGroup: null,
    fireVisual: null,
    clock: new THREE.Clock(),
    deviceRot: { alpha: 0, beta: 65, gamma: 0 },
    sensorQuaternion: null,
    hasRealOrientation: typeof window !== 'undefined' && ('ontouchstart' in window || (navigator?.maxTouchPoints ?? 0) > 0),
    sensorEventCount: 0,
    activeMethod: (typeof window !== 'undefined' && ('ontouchstart' in window || (navigator?.maxTouchPoints ?? 0) > 0)) ? 'Mobile Sensors Ready' : 'Initializing...',
    lastDebugUpdate: 0,
    dragYaw: 0,
    dragPitch: 0,
    initTimestamp: 0,
    anchoredStep: -1,
    anchoredMode: null,
    placedPositions: {},
    placedRotations: {},
    surfaceState: { detected: false, distance: 0, hitPos: null, reason: 'searching' },
  })

  // Sensor Permission Handler for Android & iOS
  const requestSensorPermissions = useCallback(async () => {
    // 1. Android Chrome: Check Generic Sensor API & Permissions API for accelerometer / gyroscope
    if (typeof navigator !== 'undefined' && navigator.permissions?.query) {
      try {
        const accel = await navigator.permissions.query({ name: 'accelerometer' }).catch(() => null)
        const gyro = await navigator.permissions.query({ name: 'gyroscope' }).catch(() => null)
        if (accel || gyro) {
          console.log('[SurakshaAR] Sensor permissions state:', { accel: accel?.state, gyro: gyro?.state })
        }
      } catch {
        // Permissions query not supported or not required for sensors on this platform
      }
    }

    // 2. iOS Safari: Explicit requestPermission prompt
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const res = await DeviceOrientationEvent.requestPermission()
        console.log('[SurakshaAR] iOS DeviceOrientation permission granted:', res)
      } catch (err) {
        console.warn('[SurakshaAR] iOS DeviceOrientation permission error:', err)
      }
    }
  }, [])

  // Auto-detect WebXR Hit-Test capability & provide explicit fallback logging
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'xr' in navigator && navigator.xr?.isSessionSupported) {
      navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        console.log(`[SurakshaAR] WebXR 'immersive-ar' support query: ${supported}. Running WebRTC Camera AR with high-precision Gyro/Sensor tracking fallback.`)
        setWebXrSupported(supported)
        setXrTrackingType(supported ? 'webxr_supported_gyro' : 'orientation')
        setSensorDebug(prev => ({ ...prev, isWebXrSupported: supported }))
      }).catch((err) => {
        console.log('[SurakshaAR] WebXR query error:', err)
        setWebXrSupported(false)
        setXrTrackingType('orientation')
        setSensorDebug(prev => ({ ...prev, isWebXrSupported: false }))
      })
    } else {
      console.log('[SurakshaAR] WebXR not available on this browser/platform. Graceful fallback: Sensor/Gyro World-Locked AR.')
      setWebXrSupported(false)
      setXrTrackingType('orientation')
      setSensorDebug(prev => ({ ...prev, isWebXrSupported: false }))
    }
  }, [])

  // ── Tap-to-Place AR Placement Mechanics ────────────────────────────────────
  const handlePlaceCurrentStep = useCallback(() => {
    // FIX 1: Enforce Surface Detection Plausibility
    // Virtual objects must only be placed on detected real surfaces, never in empty air/ceiling/sky
    const surfaceState = surfaceDetectionRef.current
    if (!surfaceState?.detected || !surfaceState?.hitPos) {
      console.warn('[SurakshaAR] Placement blocked: No valid surface detected at current camera aim.')
      return
    }

    requestSensorPermissions()

    const t = threeRef.current
    const activeIdx = currentStepRef.current
    const activeNode = t.stepNodes[activeIdx]
    const camera = t.camera
    const placedPos = surfaceState.hitPos.clone()

    if (camera && activeNode) {
      t.placedPositions[activeIdx] = placedPos.clone()
      activeNode.group.position.copy(placedPos)
      activeNode.group.lookAt(camera.position.x, placedPos.y, camera.position.z)
      activeNode.group.rotation.x = 0
      activeNode.group.rotation.z = 0
      t.placedRotations[activeIdx] = activeNode.group.quaternion.clone()
      activeNode.group.visible = true

      // Update live debug state with placed coordinates
      setSensorDebug(prev => ({
        ...prev,
        placedCoords: {
          x: placedPos.x.toFixed(2),
          y: placedPos.y.toFixed(2),
          z: placedPos.z.toFixed(2),
        },
      }))
      console.log(`[SurakshaAR] Tap-to-Place Step ${activeIdx}: Anchored on detected surface at [${placedPos.x.toFixed(2)}, ${placedPos.y.toFixed(2)}, ${placedPos.z.toFixed(2)}] (${surfaceState.distance.toFixed(1)}m away)`)
    }

    setPlacedSteps(prev => ({ ...prev, [activeIdx]: true }))
    placedStepsRef.current[activeIdx] = true
    setIsTimerRunning(true)
    setStepStartTime(Date.now())
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(60) } catch {}
    }
  }, [requestSensorPermissions])

  const handleResetPlacement = useCallback(() => {
    const t = threeRef.current
    const activeIdx = currentStepRef.current
    if (t.placedPositions) delete t.placedPositions[activeIdx]
    if (t.placedRotations) delete t.placedRotations[activeIdx]
    t.initialAlpha = null
    setPlacedSteps(prev => ({ ...prev, [activeIdx]: false }))
    placedStepsRef.current[activeIdx] = false
    setTimerSeconds(getStepDuration(activeIdx))
    setIsTimerRunning(false)
  }, [])

  // Fetch scenario details
  const { data: scenario, isLoading } = useQuery({
    queryKey: ['scenario', id],
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockGetScenario(id).data
      const { data, error } = await supabase.from('scenarios').select('*').eq('id', id).single()
      if (error) throw error
      return data
    },
  })

  const isFireScenario = scenario?.hazard_type === 'fire' || scenario?.id?.includes('0001') || (scenario?.title && /fire/i.test(scenario.title))
  const isGasScenario  = scenario?.hazard_type === 'gas_leak'
  const isMachineryScenario = scenario?.hazard_type === 'machinery' || scenario?.id?.includes('0003') || (scenario?.title && /machinery/i.test(scenario.title))

  const getStepText = useCallback((s, field) => {
    if (!s) return ''
    if (lang === 'sat' && s[`${field}_sat`]) return s[`${field}_sat`]
    if (lang === 'hi' && s[`${field}_hi`]) return s[`${field}_hi`]
    return s[field] ?? ''
  }, [lang])

  // Helper to open real camera stream across mobile & desktop webcams
  const requestCameraStream = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) return null
    try {
      // Prioritize environment rear camera on phones/tablets
      return await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
    } catch {
      try {
        // Fallback to standard webcam/front camera
        return await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      } catch (err) {
        console.warn('[Camera] getUserMedia failed:', err)
        return null
      }
    }
  }, [])

  // Auto-dismiss help hint after 5 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowControlsHelp(false), 6000)
    return () => clearTimeout(t)
  }, [])

  // Check camera availability & auto-start AR mode
  useEffect(() => {
    async function checkCamera() {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await requestCameraStream()
        if (stream) {
          cameraStreamRef.current = stream
          setCameraAvail(true)
          setArMode(true) // Auto-start in Camera AR mode for real-time fire detection
        }
      }
      setCameraChecked(true)
    }
    checkCamera()
    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [requestCameraStream])

  // Create training session record
  useEffect(() => {
    if (!user || !id) return
    async function createSession() {
      const sId = generateUUID()
      const sessionData = {
        id: sId,
        user_id: user.id,
        scenario_id: id,
        started_at: new Date().toISOString(),
        status: 'in_progress',
        score: 0,
        steps_completed: [],
      }
      if (!isSupabaseConfigured) {
        const res = await mockCreateSession({ id: sId, userId: user.id, scenarioId: id })
        if (res?.data?.id) setSessionId(res.data.id)
        else setSessionId(sId)
      } else if (isOnline) {
        await supabase.from('training_sessions').insert(sessionData)
        setSessionId(sId)
      } else {
        await queueOfflineAction('complete_session', sessionData)
        setSessionId(sId)
      }
      competencyTracker.startSession({
        sessionId: sId,
        scenarioId: id,
        scenarioTitle: scenario?.title || 'Fire & Explosion Response',
        hazardType: scenario?.hazard_type || 'fire',
      })

      setStepStartTime(Date.now())
    }
    createSession()
  }, [user, id, isOnline, scenario])

  // Track each step presentation for reaction timing
  useEffect(() => {
    if (scenario?.steps?.[currentStep]) {
      const stepObj = scenario.steps[currentStep]
      const label = getStepText(stepObj, 'label') || `Step ${currentStep + 1}`
      competencyTracker.startStep(currentStep, label)
    }
  }, [currentStep, scenario, getStepText])

  // ── Auto-Voice Narration when Step starts or AR Camera opens ─────────────
  useEffect(() => {
    if (!scenario?.steps?.[currentStep]) return
    const stepObj = scenario.steps[currentStep]
    const label = getStepText(stepObj, 'label') || `Step ${currentStep + 1}`
    const instruction = getStepText(stepObj, 'instruction') || ''

    let speechText = ''
    if (lang === 'hi') {
      speechText = `चरण ${currentStep + 1}: ${label}। ${instruction}`
    } else if (lang === 'sat') {
      speechText = `${label}। ${instruction}`
    } else {
      speechText = `Step ${currentStep + 1}: ${label}. ${instruction}`
    }

    const timer = setTimeout(() => {
      speak(speechText, lang)
    }, 700)

    return () => {
      clearTimeout(timer)
      stopSpeech()
    }
  }, [currentStep, scenario, lang, getStepText])

  // ── Synchronous Timer Cancellation Helper ─────────────────────────────────
  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
    setIsTimerRunning(false)
  }, [])

  // ── Step Completion Handler ────────────────────────────────────────────────
  const handleStepClick = useCallback(async (stepIndex) => {
    if (stepIndex !== currentStep) return
    if (consequenceFailureRef.current) return

    // Immediately halt the countdown timer on step completion
    stopTimer()

    const timeTaken = Date.now() - stepStartTime
    const step = scenario?.steps?.[stepIndex]
    const log = {
      id: generateUUID(),
      session_id: sessionId,
      step_index: stepIndex,
      was_correct: true,
      time_taken_ms: timeTaken,
      is_ppe_step: step?.is_ppe_step ?? false,
    }

    const stepLabel = getStepText(step, 'label') || `Step ${stepIndex + 1}`
    const stepInst = getStepText(step, 'instruction') || (lang === 'sat' ? 'ᱥᱟᱹᱨᱤ! ᱫᱚᱥᱟᱨ ᱫᱷᱟᱯ ᱛᱮ ᱞᱟᱦᱟᱭ ᱢᱮ᱾' : lang === 'hi' ? 'सही! अगले चरण पर जाएं।' : 'Correct! Proceed to the next step.')

    // Brief positive confirmation pulse
    setPositiveSuccess({ label: stepLabel })
    setTimeout(() => setPositiveSuccess(null), 950)

    setStepFeedback({ correct: true, label: stepLabel })
    speak(stepInst, lang)
    setTimeout(() => setStepFeedback(null), 2200)

    // Data logging (in-memory analytics)
    const retries = stepRetriesRef.current[stepIndex] || 0
    const sessionEntry = {
      stepIndex,
      stepName: stepLabel,
      timeTakenMs: timeTaken,
      timeLimitMs: getStepDuration(stepIndex) * 1000,
      firstTryCorrect: retries === 0,
      retries,
      status: 'completed',
    }
    stepSessionLogsRef.current = [...stepSessionLogsRef.current, sessionEntry]
    window.__surakshaStepSessionData = stepSessionLogsRef.current

    // Innovation Layer: Measure real response time & verify sequence
    competencyTracker.recordAction({
      stepIndex,
      stepLabel,
      expectedSequenceIndex: currentStep,
      isPpeStep: step?.is_ppe_step ?? false,
      arTrackingMode: xrTrackingType,
      surfaceDetected: !!surfaceDetectionRef.current?.detected,
    })

    const newLogs = [...stepLogs, log]
    setStepLogs(newLogs)
    setCompletedSteps(prev => [...prev, stepIndex])

    if (!isSupabaseConfigured) {
      await mockInsertFeedbackLog({ sessionId, userId: user?.id, stepIndex, feedbackType: 'correct', message: step?.label ?? '' })
    } else if (isOnline) {
      await supabase.from('feedback_logs').insert(log)
    }

    const steps = scenario?.steps ?? []
    if (stepIndex === steps.length - 1) {
      setIsTimerRunning(false)
      const report = competencyTracker.getSummaryReport()
      window.__surakshaLatestCompetencyReport = report
      await finishSession(newLogs)
    } else {
      const nextIdx = stepIndex + 1
      setCurrentStep(nextIdx)
      setTimerSeconds(getStepDuration(nextIdx))
      setPlacedSteps(prev => ({ ...prev, [nextIdx]: false }))
      placedStepsRef.current[nextIdx] = false
      setIsTimerRunning(!arMode)
      setFireEscalated(false)
      fireEscalatedRef.current = false
      setConsequenceFailure(null)
      setStepStartTime(Date.now())

      // Auto-aim camera toward the next step
      const nextStep = steps[nextIdx]
      if (nextStep && threeRef.current.controls) {
        const [tx, ty, tz] = nextStep.position || [0, 1, 0]
        smoothLookAt(tx, ty, tz)
      }
    }
  }, [currentStep, stepStartTime, scenario, stepLogs, sessionId, user, isOnline, lang, getStepText, arMode, stopTimer])

  handleStepClickRef.current = handleStepClick

  // ── Consequence: Step Timeout Trigger ────────────────────────────────────
  const handleStepTimeout = useCallback(() => {
    // If a consequence is already active or handled, prevent timeout from clobbering it
    if (consequenceFailureRef.current) return

    stopTimer()
    setFireEscalated(true)
    fireEscalatedRef.current = true
    fireAudioRef.current.setEscalated(true)
    if (isFireScenario) {
      fireAudioRef.current.start()
    }

    const currentRetries = (stepRetriesRef.current[currentStep] || 0) + 1
    stepRetriesRef.current[currentStep] = currentRetries

    const step = scenario?.steps?.[currentStep]
    const stepLabel = getStepText(step, 'label') || `Step ${currentStep + 1}`

    // Lightweight In-Memory Data Logging
    const sessionEntry = {
      stepIndex: currentStep,
      stepName: stepLabel,
      timeTakenMs: getStepDuration(currentStep) * 1000,
      firstTryCorrect: false,
      retries: currentRetries,
      failureReason: 'timeout',
    }
    stepSessionLogsRef.current = [...stepSessionLogsRef.current, sessionEntry]
    window.__surakshaStepSessionData = stepSessionLogsRef.current

    // Innovation layer: record timeout as a competency mistake for gap analysis
    competencyTracker.recordMistake({
      stepIndex: currentStep,
      stepLabel,
      mistakeType: 'timeout',
      details: `Exceeded ${getStepDuration(currentStep)}s time limit on step ${currentStep + 1}`,
    })

    const timeoutExplanations = {
      0: {
        title: 'Fire Spread — Response Too Slow',
        explanation: 'Fire spread because response was too slow! In an industrial electrical fire, early containment within the first 20 seconds is critical before thermal runaway sets in and damages adjacent control racks.',
      },
      1: {
        title: 'Delayed Alarm Notification',
        explanation: 'Delayed alarm activation! Plant personnel were not notified in time, allowing dense smoke to fill the primary evacuation corridor.',
      },
      2: {
        title: 'Delayed Protective PPE Donning',
        explanation: 'Safety preparation delayed! Every second without protective gear risks severe respiratory burns from toxic hydrogen cyanide and carbon monoxide gas.',
      },
      3: {
        title: 'Delayed Fire Assessment & Action',
        explanation: 'Fire assessment and suppression took too long! The electrical fire has broken through the cabinet and ignited surrounding pallet stores.',
      },
      4: {
        title: 'Delayed Facility Evacuation',
        explanation: 'Delayed exit! Dense smoke and heat accumulate rapidly indoors, reducing oxygen levels to life-threatening limits.',
      },
      5: {
        title: 'Delayed Muster Point Assembly',
        explanation: 'Delayed muster assembly! Emergency crews cannot verify accountability or rescue trapped staff without immediate roll-call.',
      },
    }

    const info = timeoutExplanations[currentStep] || {
      title: 'Action Time Limit Exceeded',
      explanation: 'Hazard worsened due to delayed response! Industrial emergency protocols require immediate action within the safety window.',
    }

    setConsequenceFailure({
      title: info.title,
      explanation: info.explanation,
      reason: 'timeout',
      isDecisionTimeout: currentStep === 3 || !!scenario?.steps?.[currentStep]?.is_decision_step,
    })
  }, [currentStep, scenario, isFireScenario, getStepText, stopTimer])

  // ── Consequence / Decision: Decision-Point Choice Handler ─────────────────
  const handleDecisionChoice = useCallback((choice) => {
    console.log('[SurakshaAR] handleDecisionChoice tapped:', { choice, currentStep })

    // 1. Immediately cancel the timer interval so timeout consequence cannot fire
    stopTimer()

    // 2. Clear any active consequence failure modal
    setConsequenceFailure(null)
    consequenceFailureRef.current = null

    const step = scenario?.steps?.[currentStep]
    const timeTaken = Date.now() - stepStartTime

    if (choice === 'small_safe') {
      console.log('[SurakshaAR] Decision: Small & Safe — Direct Fire Suppression')
      // Play CO2 pressurized gas discharge audio
      if (fireAudioRef.current) {
        fireAudioRef.current.playCO2Discharge()
      }
      // Trigger 3D CO2 vapor discharge plume animation
      if (threeRef.current?.triggerCO2Spray) {
        threeRef.current.triggerCO2Spray()
      }

      // Extinguish fire in 3D scene immediately
      if (threeRef.current?.stepNodes?.[0]?.propGroup?.userData) {
        const ud = threeRef.current.stepNodes[0].propGroup.userData
        if (ud.flames) ud.flames.forEach(f => { f.visible = false })
        if (ud.smoke) ud.smoke.forEach(s => { s.visible = false })
      }
      if (threeRef.current?.flameLight) {
        threeRef.current.flameLight.intensity = 0
      }
      threeRef.current.flameExtinguished = true

      setPositiveSuccess({
        label: lang === 'hi' ? '🧯 CO₂ से आग बुझा दी गई!' : '🧯 Fire Extinguished with CO₂!',
      })
      setStepFeedback({
        correct: true,
        label: lang === 'hi' ? 'आग नियंत्रित (CO₂)' : 'Fire Suppressed (CO₂)',
      })

      // Advance step
      if (handleStepClickRef.current) {
        handleStepClickRef.current(currentStep)
      } else {
        handleStepClick(currentStep)
      }
    } else {
      console.log('[SurakshaAR] Decision: Not Safe / Spreading — Immediate Evacuation Protocol')
      // Workable safety path: evacuating when fire is spreading saves lives!
      if (fireAudioRef.current) {
        fireAudioRef.current.playEvacuationAlarm()
      }

      // Escalate fire urgency so trainee moves fast
      setFireEscalated(true)
      fireEscalatedRef.current = true

      setPositiveSuccess({
        label: lang === 'hi' ? '🚨 आपातकालीन निकासी: तुरंत निकास की ओर जाएं!' : '🚨 Evacuation Activated: Proceed to Fire Exit!',
      })
      setStepFeedback({
        correct: true,
        label: lang === 'hi' ? 'आपातकालीन निकासी' : 'Emergency Evacuation',
      })
      speak(
        lang === 'hi'
          ? 'आग फैल रही है। तुरंत आपातकालीन निकास की ओर बढ़ें।'
          : 'Hazardous fire condition assessed. Proceed immediately to the emergency fire exit.',
        lang
      )

      // Advance step directly to next step (Step 4: Use Fire Exit)
      if (handleStepClickRef.current) {
        handleStepClickRef.current(currentStep)
      } else {
        handleStepClick(currentStep)
      }
    }
  }, [currentStep, stepStartTime, scenario, lang, stopTimer, handleStepClick])

  // Expose decision handler globally for test scripts
  useEffect(() => {
    window.__handleDecisionChoice = handleDecisionChoice
  }, [handleDecisionChoice])

  // ── Consequence: Retry Step Handler ──────────────────────────────────────
  const handleRetryStep = useCallback(() => {
    stopTimer()
    setFireEscalated(false)
    fireEscalatedRef.current = false
    fireAudioRef.current.setEscalated(false)
    if (!isFireScenario || currentStep !== 0) {
      if (currentStep !== 0) fireAudioRef.current.stop()
    }
    setConsequenceFailure(null)
    setTimerSeconds(getStepDuration(currentStep))
    setIsTimerRunning(true)
    setStepStartTime(Date.now())
  }, [currentStep, isFireScenario, stopTimer])

  // ── Step Countdown Timer Ticking Loop ─────────────────────────────────────
  useEffect(() => {
    if (!isTimerRunning || consequenceFailure) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
      return
    }

    // In AR mode, wait until object is placed unless it's a decision step
    const isDecisionStep = scenario?.steps?.[currentStep]?.is_decision_step
    if (arMode && !placedSteps[currentStep] && !isDecisionStep) return

    // Clear any previous interval before starting a new one
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }

    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current)
            timerIntervalRef.current = null
          }
          handleStepTimeout()
          return 0
        }
        const next = prev - 1
        if (next <= 5 && next > 0) {
          tickAudioRef.current.playTick(next <= 3)
        }
        return next
      })
    }, 1000)

    timerIntervalRef.current = interval

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }
  }, [isTimerRunning, currentStep, consequenceFailure, arMode, placedSteps, handleStepTimeout, scenario])

  // Smoothly tween OrbitControls target to look at position
  function smoothLookAt(targetX, targetY, targetZ) {
    const controls = threeRef.current.controls
    if (!controls) return
    const startX = controls.target.x
    const startY = controls.target.y
    const startZ = controls.target.z
    const startTime = performance.now()
    const duration = 600

    function stepTween(now) {
      const p = Math.min((now - startTime) / duration, 1)
      const ease = p * (2 - p)
      controls.target.x = startX + (targetX - startX) * ease
      controls.target.y = startY + (targetY - startY) * ease
      controls.target.z = startZ + (targetZ - startZ) * ease
      controls.update()
      if (p < 1) requestAnimationFrame(stepTween)
    }
    requestAnimationFrame(stepTween)
  }

  // Focus current step button action
  function handleFocusTarget() {
    const step = scenario?.steps?.[currentStep]
    if (step && threeRef.current.controls && threeRef.current.camera) {
      const [tx, ty, tz] = step.position || [0, 1, 0]
      const camera = threeRef.current.camera
      // Place camera in front of target
      camera.position.set(tx, ty + 2.5, tz + 5.5)
      smoothLookAt(tx, ty, tz)
    }
  }

  const [autoRotate, setAutoRotate]       = useState(false)
  const autoRotateRef = useRef(false)

  // Toggle continuous 360-degree auto-rotation
  function toggleAutoRotate() {
    setAutoRotate(prev => {
      const next = !prev
      autoRotateRef.current = next
      if (threeRef.current.controls) {
        threeRef.current.controls.autoRotate = next
        threeRef.current.controls.autoRotateSpeed = 2.5
      }
      return next
    })
  }

  // Smooth animated 360-degree rotation step
  function animateOrbitRotate(angleX, angleY) {
    const t = threeRef.current
    const camera = t.camera
    const controls = t.controls
    if (!camera || !controls) return
    const target = controls.target ? controls.target.clone() : new THREE.Vector3(0, 1.2, 0)
    const startTime = performance.now()
    const duration = 280
    let lastP = 0
    function stepAnim(now) {
      const p = Math.min((now - startTime) / duration, 1)
      const ease = p * (2 - p)
      const delta = ease - lastP
      lastP = ease
      const offset = camera.position.clone().sub(target)
      if (angleX !== 0) {
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angleX * delta)
      }
      if (angleY !== 0) {
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
        offset.applyAxisAngle(right, angleY * delta)
      }
      camera.position.copy(target).add(offset)
      camera.lookAt(target)
      controls.update()
      if (p < 1) requestAnimationFrame(stepAnim)
    }
    requestAnimationFrame(stepAnim)
  }

  // Smooth animated zoom
  function animateZoom(factor) {
    const t = threeRef.current
    const camera = t.camera
    const controls = t.controls
    if (!camera || !controls) return
    const target = controls.target ? controls.target.clone() : new THREE.Vector3(0, 1.2, 0)
    const startTime = performance.now()
    const duration = 250
    let lastP = 0
    function stepZoom(now) {
      const p = Math.min((now - startTime) / duration, 1)
      const ease = p * (2 - p)
      const delta = ease - lastP
      lastP = ease
      const offset = camera.position.clone().sub(target)
      const scale = factor > 1 ? (1 - 0.20 * delta) : (1 + 0.20 * delta)
      offset.multiplyScalar(scale)
      camera.position.copy(target).add(offset)
      controls.update()
      if (p < 1) requestAnimationFrame(stepZoom)
    }
    requestAnimationFrame(stepZoom)
  }

  // Camera directional manual pan/rotate controls
  function handleManualRotate(dx, dy) {
    animateOrbitRotate(dx, dy)
  }

  function handleManualZoom(factor) {
    animateZoom(factor)
  }

  async function finishSession(logs) {
    setSaving(true)
    const { score, breakdown } = calculateScore(
      logs.map(l => ({ was_correct: l.was_correct, time_taken_ms: l.time_taken_ms, is_ppe_step: l.is_ppe_step })),
      scenario?.benchmark_time_ms ?? 90000
    )
    const totalTime = logs.reduce((s, l) => s + l.time_taken_ms, 0)
    const completedAt = new Date().toISOString()

    const updateData = {
      id: sessionId,
      user_id: user?.id,
      scenario_id: id,
      completed_at: completedAt,
      score,
      reaction_time_ms: totalTime,
      status: 'completed',
      steps_completed: logs.map(l => ({ step_index: l.step_index, was_correct: l.was_correct })),
    }

    if (!isSupabaseConfigured) {
      await mockUpdateSession(sessionId, updateData)
    } else if (isOnline) {
      await supabase.from('training_sessions').upsert(updateData)
    } else {
      await queueOfflineAction('complete_session', updateData)
    }

    setSaving(false)
    navigate(`/results/${sessionId}`, {
      state: { score, breakdown, scenario, allLogs: logs, totalTime },
    })
  }

  async function toggleARMode() {
    let nextMode = !arMode
    if (!arMode && cameraAvail && cameraStreamRef.current) {
      nextMode = true
    } else if (arMode) {
      nextMode = false
    } else {
      const stream = await requestCameraStream()
      if (stream) {
        cameraStreamRef.current = stream
        setCameraAvail(true)
        nextMode = true
      } else {
        alert('Camera permission required for Camera AR Mode. Using 3D Simulation Mode.')
        nextMode = false
      }
    }
    setArMode(nextMode)
    arModeRef.current = nextMode
    const t = threeRef.current
    if (nextMode) {
      t.initialAlpha = null
      t.dragYaw = 0
      t.dragPitch = 0
    }
    if (t.floor) t.floor.visible = !nextMode
    if (t.warehousePropsGroup) t.warehousePropsGroup.visible = !nextMode
    if (t.scene) {
      t.scene.background = nextMode ? null : new THREE.Color('#1F242D')
    }
    if (!nextMode) {
      if (t.stepNodes) {
        t.stepNodes.forEach((node) => {
          if (node.initialPos) {
            node.group.position.set(node.initialPos[0], node.initialPos[1], node.initialPos[2])
            node.group.rotation.set(0, 0, 0)
          }
        })
      }
      if (t.camera && t.controls) {
        t.camera.position.set(0, 3.5, 9.5)
        t.controls.target.set(0, 1.2, 0)
        t.controls.enabled = true
        t.controls.update()
      }
    }
  }

  // ─── Native WebXR ARCore Session Launcher ────────────────────────────────────
  // Launches an immersive-ar session using the WebXR Device API. Requires Chrome
  // on Android with ARCore installed. Falls back gracefully if unsupported.
  const launchWebXRSession = useCallback(async () => {
    if (!webXrSupported) {
      console.warn('[SurakshaAR] WebXR immersive-ar not supported on this device.')
      return
    }
    const t = threeRef.current
    if (!t.renderer) {
      console.warn('[SurakshaAR] Renderer not ready for WebXR session.')
      return
    }

    // Find the overlay root (the full-screen scenario container)
    const overlayRoot = document.getElementById('suraksha-scenario-root') || document.body

    try {
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay', 'anchors', 'plane-detection', 'local-floor'],
        domOverlay: { root: overlayRoot },
      })

      // Wire the session into Three.js renderer
      await t.renderer.xr.setSession(session)
      t.xrSession = session

      // Prefer local-floor (gives real ground plane Y), fallback to local
      let referenceSpace
      try {
        referenceSpace = await session.requestReferenceSpace('local-floor')
      } catch (_e) {
        referenceSpace = await session.requestReferenceSpace('local')
      }
      t.xrReferenceSpace = referenceSpace

      // Set up hit-test source from viewer space (camera forward ray)
      const viewerSpace = await session.requestReferenceSpace('viewer')
      const hitTestSource = await session.requestHitTestSource({ space: viewerSpace })
      t.xrHitTestSource = hitTestSource

      // Signal HUD that native WebXR is active
      setXrTrackingType('webxr')
      setArMode(true) // Enter AR display mode
      arModeRef.current = true

      console.log('[SurakshaAR] ✅ WebXR immersive-ar session started with hit-test source.')

      // Cleanup when session ends (user presses Back, session is lost, etc.)
      session.addEventListener('end', () => {
        console.log('[SurakshaAR] WebXR session ended — restoring gyro/sensor fallback.')
        t.xrHitTestSource = null
        t.xrReferenceSpace = null
        t.xrSession = null
        setXrTrackingType(webXrSupported ? 'webxr_supported_gyro' : 'orientation')
      })
    } catch (err) {
      console.error('[SurakshaAR] WebXR session request failed:', err)
      // Non-fatal: user stays in gyro/sensor AR or 3D sim mode
    }
  }, [webXrSupported])

  // ─── Three.js Scene Mounting (ONE TIME ONLY) ────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !scenario) return

    const t = threeRef.current
    const width = canvas.clientWidth || window.innerWidth
    const height = canvas.clientHeight || window.innerHeight

    // 1. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0 // Calibrated exposure eliminates blown-out plastic specular
    renderer.outputColorSpace = THREE.SRGBColorSpace
    // Enable WebXR so renderer.xr.setSession() can be called for native ARCore AR
    renderer.xr.enabled = true
    t.renderer = renderer
    // WebXR session state (set by launchWebXRSession)
    t.xrSession = null
    t.xrHitTestSource = null
    t.xrReferenceSpace = null

    // 2. Scene
    const scene = new THREE.Scene()
    t.scene = scene

    // 3. Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 200)
    camera.position.set(0, 3.5, 9.5)
    t.camera = camera

    // 4. OrbitControls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.rotateSpeed = 0.8
    controls.zoomSpeed = 1.0
    controls.panSpeed = 0.8
    controls.minDistance = 2.0
    controls.maxDistance = 25.0
    controls.maxPolarAngle = Math.PI / 2 - 0.05 // Don't flip under floor
    controls.target.set(0, 1.2, 0)
    controls.update()
    t.controls = controls

    // W3C Device Orientation Math Helpers
    t.zee = new THREE.Vector3(0, 0, 1)
    t.q0 = new THREE.Quaternion()
    t.q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)) // -PI/2 around X
    t.deviceEuler = new THREE.Euler()
    t.deviceQuat = new THREE.Quaternion()
    t.initialAlpha = null

    // 5. Lighting — Balanced industrial key, fill, and floor bounce
    const hemiLight = new THREE.HemisphereLight(0xF8FAFC, 0x1E293B, 0.75)
    scene.add(hemiLight)

    const dirLight = new THREE.DirectionalLight(0xFFFBF0, 1.05)
    dirLight.position.set(10, 18, 10)
    scene.add(dirLight)

    const fillLight = new THREE.DirectionalLight(0x93C5FD, 0.40)
    fillLight.position.set(-10, 8, -8)
    scene.add(fillLight)

    // 6. Environment Props
    const isGasLeak = scenario.hazard_type === 'gas_leak'

    // Floor with Industrial Safety Grid & Warning Borders
    const floorSize = 36
    const floorGeo = new THREE.PlaneGeometry(floorSize, floorSize)
    const floorCanvas = document.createElement('canvas')
    floorCanvas.width = 1024
    floorCanvas.height = 1024
    const fctx = floorCanvas.getContext('2d')

    // Factory floor concrete base
    fctx.fillStyle = isGasLeak ? '#383028' : '#2A2E33'
    fctx.fillRect(0, 0, 1024, 1024)

    // Safety grid tiles
    fctx.strokeStyle = isGasLeak ? '#4A4035' : '#3A4048'
    fctx.lineWidth = 4
    for (let i = 0; i <= 1024; i += 64) {
      fctx.beginPath()
      fctx.moveTo(i, 0); fctx.lineTo(i, 1024); fctx.stroke()
      fctx.beginPath()
      fctx.moveTo(0, i); fctx.lineTo(1024, i); fctx.stroke()
    }

    // Yellow/Black diagonal safety hazard perimeter
    fctx.strokeStyle = '#F1C40F'
    fctx.lineWidth = 24
    fctx.strokeRect(12, 12, 1000, 1000)

    const floorTex = new THREE.CanvasTexture(floorCanvas)
    floorTex.wrapS = THREE.RepeatWrapping
    floorTex.wrapT = THREE.RepeatWrapping
    floorTex.repeat.set(1, 1)

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.8,
      metalness: 0.1,
    })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = 0
    floor.visible = !arModeRef.current
    scene.add(floor)
    t.floor = floor

    // Warehouse Environment Props (Shown in 3D Simulation Mode, Hidden in Camera AR Mode)
    const warehousePropsGroup = new THREE.Group()
    warehousePropsGroup.visible = !arModeRef.current
    const machineMat = new THREE.MeshStandardMaterial({ color: '#4B5563', metalness: 0.7, roughness: 0.3 })
    const yellowStripeMat = new THREE.MeshStandardMaterial({ color: '#EAB308', metalness: 0.2, roughness: 0.5 })

    // Generator 1
    const gen1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.0, 1.6), machineMat)
    gen1.position.set(-5, 1.0, -1)
    warehousePropsGroup.add(gen1)
    const genStripe = new THREE.Mesh(new THREE.BoxGeometry(2.22, 0.2, 1.62), yellowStripeMat)
    genStripe.position.set(-5, 1.8, -1)
    warehousePropsGroup.add(genStripe)

    // Electrical Control Panel (Hazard 0 location: [3, 1.2, 3])
    const panelCabinet = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.4, 0.8), machineMat)
    panelCabinet.position.set(3, 1.2, 3)
    warehousePropsGroup.add(panelCabinet)
    // Panel face door
    const panelFace = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.0, 0.05), new THREE.MeshStandardMaterial({ color: '#DC2626' }))
    panelFace.position.set(3, 1.2, 2.6)
    warehousePropsGroup.add(panelFace)

    // Hazard visual effect (Fire or Gas Plume)
    const hazardGroup = new THREE.Group()
    if (isGasLeak) {
      hazardGroup.position.set(-2.5, 1.2, 2)
      // Toxic cloud spheres
      for (let i = 0; i < 4; i++) {
        const gas = new THREE.Mesh(
          new THREE.SphereGeometry(0.5 + i * 0.1, 12, 12),
          new THREE.MeshStandardMaterial({
            color: '#84CC16',
            emissive: '#65A30D',
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.65 - i * 0.1,
          })
        )
        gas.position.set((Math.random() - 0.5) * 0.4, i * 0.3, (Math.random() - 0.5) * 0.4)
        hazardGroup.add(gas)
      }
      const gLight = new THREE.PointLight('#84CC16', 3.0, 8)
      hazardGroup.add(gLight)
    } else if (scenario.hazard_type === 'ppe') {
      hazardGroup.position.set(3, 1.4, 2.3)
      // Amber industrial hazard caution indicator beacon & strobe
      const beaconBase = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.2, 16), machineMat)
      hazardGroup.add(beaconBase)
      const beaconLight = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 16, 16),
        new THREE.MeshStandardMaterial({ color: '#EAB308', emissive: '#CA8A04', emissiveIntensity: 2.2 })
      )
      beaconLight.position.y = 0.25
      hazardGroup.add(beaconLight)
      const ppeLight = new THREE.PointLight('#EAB308', 3.5, 8)
      ppeLight.position.y = 0.3
      hazardGroup.add(ppeLight)
    } else if (scenario.hazard_type === 'machinery') {
      hazardGroup.position.set(3, 1.2, 3)
      // Rotating Industrial Nip Rollers with yellow warning guard
      const machBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 1.2), machineMat)
      machBase.position.y = -0.3
      hazardGroup.add(machBase)

      const rollerMat = new THREE.MeshStandardMaterial({ color: '#94A3B8', metalness: 0.85, roughness: 0.25 })
      const r1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.2, 24), rollerMat)
      r1.rotation.z = Math.PI / 2
      r1.position.set(0, 0.25, -0.22)
      hazardGroup.add(r1)

      const r2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.2, 24), rollerMat)
      r2.rotation.z = Math.PI / 2
      r2.position.set(0, 0.25, 0.22)
      hazardGroup.add(r2)

      const mLight = new THREE.PointLight('#F59E0B', 3.0, 7)
      mLight.position.y = 0.5
      hazardGroup.add(mLight)

      t.machineryEnvRollers = [r1, r2]
    } else {
      // Fire Hazard lighting: realistic animated flame particles and embers are provided by createFireSourceProp()
      hazardGroup.position.set(3, 1.2, 2.3)
      const fLight = new THREE.PointLight('#F97316', 4.0, 9)
      hazardGroup.add(fLight)
      t.flameLight = fLight
    }
    scene.add(hazardGroup)
    t.hazardGroup = hazardGroup

    // Fixed World Coordinates for Scenario Spatial Stations
    const WORLD_FIRE_POS = new THREE.Vector3(3, 1.3, 2.7)
    t.WORLD_FIRE_POS = WORLD_FIRE_POS

    // Fire Alarm Station prop ([2.5, 2.0, -2])
    const alarmPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.2), machineMat)
    alarmPole.position.set(2.5, 1.1, -2)
    warehousePropsGroup.add(alarmPole)
    const alarmBox = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.3), new THREE.MeshStandardMaterial({ color: '#EF4444', emissive: '#B91C1C', emissiveIntensity: 0.4 }))
    alarmBox.position.set(2.5, 1.9, -2)
    warehousePropsGroup.add(alarmBox)

    // PPE Station Locker prop ([-4, 0.9, 1])
    const ppeLocker = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.0, 0.7), new THREE.MeshStandardMaterial({ color: '#0284C7', metalness: 0.5 }))
    ppeLocker.position.set(-4, 1.0, 1)
    warehousePropsGroup.add(ppeLocker)

    // Fire Extinguisher prop ([1.5, 0.8, 2])
    const extBody = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.9, 16), new THREE.MeshStandardMaterial({ color: '#DC2626', roughness: 0.3 }))
    extBody.position.set(1.5, 0.45, 2)
    warehousePropsGroup.add(extBody)

    // Emergency Exit door frame ([-6, 1.5, -5])
    const exitDoor = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.0, 0.1), new THREE.MeshStandardMaterial({ color: '#16A34A', emissive: '#15803D', emissiveIntensity: 0.6 }))
    exitDoor.position.set(-6, 1.5, -5)
    warehousePropsGroup.add(exitDoor)

    // Muster Assembly Point post ([0, 1.0, 10])
    const musterPost = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.5), machineMat)
    musterPost.position.set(0, 1.25, 10)
    warehousePropsGroup.add(musterPost)
    const musterSign = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.08), new THREE.MeshStandardMaterial({ color: '#16A34A', emissive: '#15803D', emissiveIntensity: 0.7 }))
    musterSign.position.set(0, 2.4, 10)
    warehousePropsGroup.add(musterSign)

    scene.add(warehousePropsGroup)
    t.warehousePropsGroup = warehousePropsGroup

    // ── Evacuation Waypoints (Glowing animated route to Exit Door & Muster Point) ──
    const evacPathGroup = new THREE.Group()
    evacPathGroup.visible = false
    const evacWaypoints = [
      new THREE.Vector3(2.5, 0.04, 2.2),
      new THREE.Vector3(1.0, 0.04, 1.0),
      new THREE.Vector3(-0.8, 0.04, -0.2),
      new THREE.Vector3(-2.6, 0.04, -1.8),
      new THREE.Vector3(-4.4, 0.04, -3.4),
      new THREE.Vector3(-5.8, 0.04, -4.8), // Exit door
    ]
    const evacArrowMat = new THREE.MeshBasicMaterial({
      color: '#22C55E',
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
    })
    const evacArrows = []
    for (let i = 0; i < evacWaypoints.length - 1; i++) {
      const p1 = evacWaypoints[i]
      const p2 = evacWaypoints[i + 1]
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5)
      const dir = new THREE.Vector3().subVectors(p2, p1).normalize()

      const shape = new THREE.Shape()
      shape.moveTo(-0.24, -0.16)
      shape.lineTo(0, 0.22)
      shape.lineTo(0.24, -0.16)
      shape.lineTo(0.12, -0.16)
      shape.lineTo(0, 0.06)
      shape.lineTo(-0.12, -0.16)
      shape.closePath()

      const arrowGeo = new THREE.ShapeGeometry(shape)
      const arrowMesh = new THREE.Mesh(arrowGeo, evacArrowMat.clone())
      arrowMesh.rotation.x = -Math.PI / 2
      arrowMesh.rotation.z = Math.atan2(-dir.x, dir.z) + Math.PI
      arrowMesh.position.copy(mid)
      evacPathGroup.add(arrowMesh)
      evacArrows.push(arrowMesh)
    }
    scene.add(evacPathGroup)
    t.evacPathGroup = evacPathGroup
    t.evacArrows = evacArrows

    // 7. Hotspot Beacons & Floating Badges
    const stepNodes = []
    const steps = scenario.steps || []
    steps.forEach((step, idx) => {
      const rawPos = step.position || [0, 1, 0]
      const pos = (isFireScenario && idx === 0) ? [3, 0.75, 2.3] : rawPos
      const group = new THREE.Group()
      group.position.set(pos[0], pos[1], pos[2])

      // ── Human-Scaled 3D Interactive Prop ──────────────────────────────────
      let propGroup = new THREE.Group()
      if (isMachineryScenario) {
        if (idx === 0) {
          propGroup = createMachineryNipPointProp()
        } else if (idx === 1) {
          propGroup = createEStopButtonProp()
        } else if (idx === 2) {
          propGroup = createLOTOStationProp()
        } else if (idx === 3) {
          propGroup = createZeroEnergyPanelProp()
        } else if (idx === 4) {
          propGroup = createMachineGuardProp()
        } else if (idx === 5) {
          propGroup = createMusterPointProp()
        }
      } else {
        if (idx === 0) {
          propGroup = isFireScenario ? createFireSourceProp() : createHazardPadProp()
        } else if (idx === 1) {
          propGroup = createAlarmBoxProp()
        } else if (idx === 2) {
          propGroup = createPPEStationProp()
        } else if (idx === 3) {
          propGroup = createExtinguisherProp()
        } else if (idx === 4) {
          propGroup = createExitSignProp()
        } else if (idx === 5) {
          propGroup = createMusterPointProp()
        }
      }
      group.add(propGroup)

      const isFireStep = isFireScenario && idx === 0

      // Main Interactive Target Orb (Compact 8cm radius)
      // Positioned cleanly above props so it never obscures the physical equipment or flames
      const orbGeo = new THREE.SphereGeometry(0.08, 16, 16)
      const orbMat = new THREE.MeshStandardMaterial({
        color: step.color || '#E05A00',
        emissive: step.color || '#E05A00',
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.2,
      })
      const orbMesh = new THREE.Mesh(orbGeo, orbMat)
      orbMesh.position.y = isFireStep ? 0.55 : 0.28
      orbMesh.userData = { stepIndex: idx }
      if (idx === 3 && isFireScenario) {
        // Hide toy-like floating orb directly on top of the realistic CO2 extinguisher!
        orbMesh.visible = false
      }
      group.add(orbMesh)

      // Pulsing floor target ring
      const ringGeo = new THREE.RingGeometry(0.18, 0.26, 24)
      const ringMat = new THREE.MeshBasicMaterial({
        color: step.color || '#E05A00',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
      })
      const ringMesh = new THREE.Mesh(ringGeo, ringMat)
      ringMesh.rotation.x = -Math.PI / 2
      ringMesh.position.y = -0.02
      group.add(ringMesh)

      // Vertical beacon light beam (Compact 0.45m, elevated above prop)
      const beamGeo = new THREE.CylinderGeometry(0.015, 0.05, 0.45, 12)
      const beamMat = new THREE.MeshBasicMaterial({
        color: step.color || '#E05A00',
        transparent: true,
        opacity: 0.3,
      })
      const beamMesh = new THREE.Mesh(beamGeo, beamMat)
      beamMesh.position.y = isFireStep ? 0.85 : 0.50
      if (idx === 3 && isFireScenario) {
        beamMesh.visible = false
      }
      group.add(beamMesh)

      // Floating billboard sprite label (Proportionate: 0.72m wide x 0.14m tall)
      // Positioned cleanly above the 3D model inside the central reticle
      const badgeSprite = createStepBadgeSprite(idx + 1, step.label, step.color || '#E05A00')
      badgeSprite.position.set(0, isFireStep ? 0.62 : (idx === 3 ? 0.56 : 0.38), 0)
      badgeSprite.scale.set(0.72, 0.14, 1)
      group.add(badgeSprite)

      scene.add(group)
      stepNodes.push({
        group,
        propGroup,
        orbMesh,
        ringMesh,
        beamMesh,
        badgeSprite,
        stepIndex: idx,
        initialY: pos[1],
        pos,
        initialPos: [...pos],
      })
    })
    t.stepNodes = stepNodes
    t.initTimestamp = performance.now()
    if (arModeRef.current && stepNodes[0]) {
      stepNodes[0].group.visible = true
    }

    // High-Pressure Animated CO2 Spray Particle Plume
    t.triggerCO2Spray = () => {
      if (!scene) return
      const sprayGroup = new THREE.Group()
      const smokeTex = getSmokeParticleTexture()
      const particles = []
      const count = 38

      for (let i = 0; i < count; i++) {
        const mat = new THREE.SpriteMaterial({
          map: smokeTex,
          color: '#FFFFFF',
          transparent: true,
          opacity: 0.88,
          depthWrite: false,
        })
        const sp = new THREE.Sprite(mat)
        const delay = (i / count) * 0.45
        const speed = 2.4 + Math.random() * 1.6
        const spreadX = (Math.random() - 0.5) * 0.55
        const spreadY = (Math.random() - 0.5) * 0.35
        const spreadZ = (Math.random() - 0.5) * 0.55

        sprayGroup.add(sp)
        particles.push({
          sprite: sp,
          delay,
          speed,
          dir: new THREE.Vector3(spreadX, 0.18 + spreadY, -1.5 + spreadZ).normalize(),
          age: 0,
          life: 0.75 + Math.random() * 0.45,
          maxScale: 0.36 + Math.random() * 0.35,
        })
      }

      const activeNode = stepNodes[3]
      if (activeNode?.group) {
        sprayGroup.position.copy(activeNode.group.position)
        sprayGroup.position.y += 0.15
        sprayGroup.rotation.copy(activeNode.group.rotation)
      } else {
        sprayGroup.position.set(1.5, 0.8, 2)
      }

      scene.add(sprayGroup)

      const startTime = performance.now()
      const sprayAnim = (now) => {
        const elapsed = (now - startTime) / 1000
        let allDead = true

        particles.forEach(p => {
          if (elapsed < p.delay) {
            p.sprite.visible = false
            allDead = false
            return
          }
          p.sprite.visible = true
          p.age += 0.016
          const prog = p.age / p.life
          if (prog < 1.0) {
            allDead = false
            const curDist = prog * p.speed
            p.sprite.position.copy(p.dir).multiplyScalar(curDist)
            const scale = p.maxScale * (0.28 + prog * 1.8)
            p.sprite.scale.set(scale, scale, 1)
            p.sprite.material.opacity = Math.max(0, 0.88 * (1 - prog))
          } else {
            p.sprite.visible = false
          }
        })

        if (!allDead && elapsed < 1.8) {
          requestAnimationFrame(sprayAnim)
        } else {
          scene.remove(sprayGroup)
          sprayGroup.clear()
        }
      }
      requestAnimationFrame(sprayAnim)
    }

    // 8. Raycasting Click, Touch & Drag Aiming Listeners
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    function handlePointerInteract(event) {
      const rect = canvas.getBoundingClientRect()
      const clientX = event.clientX ?? event.changedTouches?.[0]?.clientX
      const clientY = event.clientY ?? event.changedTouches?.[0]?.clientY
      if (clientX === undefined || clientY === undefined) return

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const activeNode = stepNodes[currentStepRef.current]
      const interactableTargets = []
      stepNodes.forEach(s => {
        if (s.orbMesh) interactableTargets.push(s.orbMesh)
      })
      if (activeNode?.group) {
        interactableTargets.push(activeNode.group)
      }
      const hits = raycaster.intersectObjects(interactableTargets, true)

      if (hits.length > 0) {
        if (consequenceFailureRef.current) return
        const activeIdx = currentStepRef.current

        const activeStepObj = scenario?.steps?.[activeIdx]
        if (activeStepObj?.is_decision_step) {
          // If unplaced in AR mode, anchor it immediately
          if (arModeRef.current && !placedStepsRef.current[activeIdx]) {
            handlePlaceCurrentStep()
          }
          // Tapping directly on the 3D extinguisher in AR triggers the extinguish action!
          handleDecisionChoice('small_safe')
          return
        }

        // If unplaced in AR mode, tapping the object places it immediately
        if (arModeRef.current && !placedStepsRef.current[activeIdx]) {
          handlePlaceCurrentStep()
          return
        }

        handleStepClick(activeIdx)
      }
    }

    let isPointerDown = false
    let startX = 0
    let startY = 0
    let hasDragged = false

    function onPointerDown(e) {
      isPointerDown = true
      hasDragged = false
      startX = e.clientX ?? e.touches?.[0]?.clientX ?? 0
      startY = e.clientY ?? e.touches?.[0]?.clientY ?? 0
    }

    function onPointerMove(e) {
      if (!isPointerDown) return
      const currentX = e.clientX ?? e.touches?.[0]?.clientX ?? 0
      const currentY = e.clientY ?? e.touches?.[0]?.clientY ?? 0
      const dx = currentX - startX
      const dy = currentY - startY

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasDragged = true
        startX = currentX
        startY = currentY
        if (arModeRef.current) {
          // Horizontal drag pans camera yaw left/right in AR mode
          t.dragYaw -= dx * 0.005
          // Vertical drag tilts camera pitch up/down in AR mode
          t.dragPitch = Math.max(-1.1, Math.min(1.1, t.dragPitch - dy * 0.005))
        }
      }
    }

    function onPointerUp(e) {
      isPointerDown = false
      if (!hasDragged) {
        handlePointerInteract(e)
      }
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    // 9. Window Resize
    function onResize() {
      const w = canvas.clientWidth || window.innerWidth
      const h = canvas.clientHeight || window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // 10. Device Orientation & Sensor Handlers (Android 10+, Chrome & iOS)
    function onDeviceRot(e) {
      // Android / iOS device orientation handler
      // e.alpha: compass/yaw (0 to 360)
      // e.beta: front-to-back pitch (-180 to 180), upright portrait is ~90°
      // e.gamma: left-to-right roll (-90 to 90)
      const hasAlpha = e.alpha !== null && e.alpha !== undefined
      const hasBeta = e.beta !== null && e.beta !== undefined
      const hasGamma = e.gamma !== null && e.gamma !== undefined

      if (hasAlpha || hasBeta || hasGamma) {
        t.deviceRot = {
          alpha: hasAlpha ? e.alpha : (t.deviceRot?.alpha ?? 0),
          beta: hasBeta ? e.beta : (t.deviceRot?.beta ?? 65),
          gamma: hasGamma ? e.gamma : (t.deviceRot?.gamma ?? 0),
        }
        t.hasRealOrientation = true
        t.sensorEventCount = (t.sensorEventCount || 0) + 1
        t.activeMethod = e.type === 'deviceorientationabsolute'
          ? 'DeviceOrientationAbsolute (Active)'
          : 'DeviceOrientation (Active)'
      }
    }
    window.addEventListener('deviceorientation', onDeviceRot, { passive: true })
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', onDeviceRot, { passive: true })
    }

    // 11. Animation Loop — uses setAnimationLoop for WebXR compatibility.
    // When a WebXR session is active, 'frame' is an XRFrame; otherwise null.
    renderer.setAnimationLoop((timestamp, frame) => {
      // ── WebXR Native Hit-Test (primary surface detection path) ──
      if (frame && t.xrHitTestSource && t.xrReferenceSpace) {
        const hits = frame.getHitTestResults(t.xrHitTestSource)
        if (hits.length > 0) {
          try {
            const pose = hits[0].getPose(t.xrReferenceSpace)
            if (pose) {
              const m = pose.transform.matrix
              const hitPos = new THREE.Vector3(m[12], m[13], m[14])
              t.surfaceState = {
                detected: true,
                distance: hitPos.distanceTo(camera.position),
                hitPos,
                reason: 'webxr_hit',
              }
              surfaceDetectionRef.current = t.surfaceState
            }
          } catch (_e) {
            // Pose may not be available every frame — silently skip
          }
        } else {
          t.surfaceState = { detected: false, distance: 0, hitPos: null, reason: 'webxr_searching' }
          surfaceDetectionRef.current = t.surfaceState
        }
      }

      const elapsed = t.clock.getElapsedTime()

      // Animate hazard & consequence growth
      if (t.hazardGroup && !t.flameExtinguished) {
        const hMult = fireEscalatedRef.current ? 2.2 : 1.0
        t.hazardGroup.scale.setScalar((1 + Math.sin(elapsed * 8) * 0.08) * hMult)
        if (t.flameLight) {
          t.flameLight.intensity = (fireEscalatedRef.current ? 9.5 : 4.0) + Math.sin(elapsed * 12) * 1.5
          t.flameLight.distance = fireEscalatedRef.current ? 12 : 7
          t.flameLight.color.set(fireEscalatedRef.current ? '#FF1100' : '#FF5500')
        }
      }

      // Animate Step 0 Realistic Fire Particle Flutter, Billowing Smoke & Consequence Growth
      if (t.stepNodes[0]?.propGroup?.userData?.updateFire && !t.flameExtinguished) {
        t.stepNodes[0].propGroup.userData.updateFire(elapsed, fireEscalatedRef.current)
      }

      // Animate Step 1 Alarm Strobe LED
      if (currentStepRef.current === 1 && t.stepNodes[1]?.propGroup?.userData?.strobeLight) {
        const strobePulse = (Math.sin(elapsed * 14) + 1) / 2
        t.stepNodes[1].propGroup.userData.strobeLight.intensity = strobePulse > 0.6 ? 2.8 : 0.15
      }

      // Animate Machinery Rollers (Env & Step 0 Nip Hazard)
      if (t.machineryEnvRollers) {
        const speed = currentStepRef.current >= 1 ? 0 : 0.05
        t.machineryEnvRollers[0].rotation.x += speed
        t.machineryEnvRollers[1].rotation.x -= speed
      }
      if (t.stepNodes[0]?.propGroup?.userData?.rollers) {
        const speed = currentStepRef.current >= 1 ? 0 : 0.06
        const [r1, r2] = t.stepNodes[0].propGroup.userData.rollers
        if (r1) r1.rotation.x += speed
        if (r2) r2.rotation.x -= speed
      }

      // Animate Evacuation Waypoints (visible on Evacuate & Muster steps)
      if (t.evacPathGroup) {
        const isEvacStep = currentStepRef.current >= 4
        t.evacPathGroup.visible = isEvacStep
        if (isEvacStep && t.evacArrows) {
          t.evacArrows.forEach((arr, i) => {
            const pulse = (Math.sin(elapsed * 6 - i * 0.9) + 1) / 2
            arr.material.opacity = 0.35 + pulse * 0.6
            arr.scale.setScalar(0.9 + pulse * 0.25)
          })
        }
      }

      // Animate step nodes
      t.stepNodes.forEach((node) => {
        const isActive = node.group.visible && node.stepIndex === currentStepRef.current
        if (isActive) {
          node.orbMesh.position.y = 0.22 + Math.sin(elapsed * 4) * 0.04
          node.ringMesh.rotation.z = elapsed * 1.5
          node.ringMesh.scale.setScalar(1 + Math.sin(elapsed * 5) * 0.15)
          node.beamMesh.material.opacity = 0.25 + Math.sin(elapsed * 6) * 0.15
        }
      })

      // Handle AR camera orientation & World Anchoring
      if (arModeRef.current) {
        if (controls) controls.enabled = false
        camera.position.set(0, 1.4, 0)

        // Ensure 3D floor and warehouse environment props are never rendered over the live camera feed
        if (t.floor && t.floor.visible) t.floor.visible = false
        if (t.warehousePropsGroup && t.warehousePropsGroup.visible) t.warehousePropsGroup.visible = false
        if (scene.background !== null) scene.background = null

        if (t.hasRealOrientation) {
          const { alpha, beta, gamma } = t.deviceRot
          if (t.initialAlpha === null || t.initialAlpha === undefined) {
            t.initialAlpha = alpha ?? 0
          }
          // Calibrate relative heading to trainee's starting forward gaze
          const relAlpha = (alpha ?? 0) - (t.initialAlpha ?? 0)

          const alphaRad = THREE.MathUtils.degToRad(relAlpha)
          const betaRad = THREE.MathUtils.degToRad(beta ?? 65)
          const gammaRad = THREE.MathUtils.degToRad(gamma ?? 0)
          const screenOrientRad = THREE.MathUtils.degToRad(window.screen?.orientation?.angle ?? (window.orientation ?? 0))

          // Full W3C 3-axis DeviceOrientation quaternion transformation
          t.deviceEuler.set(betaRad, alphaRad, -gammaRad, 'YXZ')
          t.deviceQuat.setFromEuler(t.deviceEuler)
          t.deviceQuat.multiply(t.q1)
          t.deviceQuat.multiply(t.q0.setFromAxisAngle(t.zee, -screenOrientRad))

          // Extract camera forward vector
          const camFwd = new THREE.Vector3(0, 0, -1).applyQuaternion(t.deviceQuat)
          const pitch = Math.asin(Math.max(-0.99, Math.min(0.99, camFwd.y))) + t.dragPitch
          const yaw = Math.atan2(-camFwd.x, -camFwd.z) + t.dragYaw

          // Clamp pitch: -83° (straight down at floor) to +45° (comfortable upward gaze)
          const clampedPitch = Math.max(-1.45, Math.min(0.78, pitch))

          // ZERO ROLL (Z = 0): Scene horizon remains rock-solid level, eliminating all sideways tilt!
          camera.rotation.set(clampedPitch, yaw, 0, 'YXZ')
        } else {
          // Dynamic camera orientation from drag aim (desktop webcam / laptop / gyro-less)
          const clampedPitch = Math.max(-1.45, Math.min(0.78, t.dragPitch))
          camera.rotation.set(clampedPitch, t.dragYaw, 0, 'YXZ')
        }

        // Live Sensor Debug HUD & Surface Detection throttled state update (~6 updates/sec)
        const now = performance.now()
        if (!t.lastDebugUpdate || now - t.lastDebugUpdate > 160) {
          t.lastDebugUpdate = now
          const camFwd = new THREE.Vector3(0, 0, -1).applyEuler(camera.rotation)
          setSensorDebug(prev => ({
            ...prev,
            activeMethod: t.activeMethod || (t.hasRealOrientation ? 'Sensors Active' : 'Touch/Mouse Aim Fallback'),
            eventCount: t.sensorEventCount || 0,
            alpha: t.deviceRot?.alpha ?? 0,
            beta: t.deviceRot?.beta ?? 65,
            gamma: t.deviceRot?.gamma ?? 0,
            camFwd: { x: camFwd.x, y: camFwd.y, z: camFwd.z },
          }))
          setSurfaceDetection({
            detected: t.surfaceState?.detected ?? false,
            distance: t.surfaceState?.distance ?? 0,
            surfaceType: xrTrackingType === 'webxr' ? 'webxr_hit' : 'approximate_floor',
            reason: t.surfaceState?.reason ?? 'searching',
          })
        }

        const activeIdx = currentStepRef.current
        const activeNode = t.stepNodes[activeIdx]
        const isPlaced = !arModeRef.current || !!placedStepsRef.current[activeIdx]

        // ── Tap-to-Place World Anchoring & Reticle Preview ──
        if (activeNode) {
          if (isPlaced && t.placedPositions && t.placedPositions[activeIdx]) {
            // Object locked at placed 3D world coordinates
            activeNode.group.position.copy(t.placedPositions[activeIdx])
            if (t.placedRotations && t.placedRotations[activeIdx]) {
              activeNode.group.quaternion.copy(t.placedRotations[activeIdx])
            }
            // Enforce vertical upright posture
            activeNode.group.rotation.x = 0
            activeNode.group.rotation.z = 0
            activeNode.group.visible = true
          } else {
            // Live surface detection for virtual object preview
            const camForward = new THREE.Vector3(0, 0, -1).applyEuler(camera.rotation).normalize()

            // Plausible surface aiming: from looking straight down at floor (-Y) up to eye level/desk (+Y up to 0.45)
            const isLookingAtEnvironment = camForward.y < 0.45
            let isSurfaceDetected = false
            let surfaceDist = 0
            let hitPos = null

            if (isLookingAtEnvironment) {
              isSurfaceDetected = true

              if (camForward.y < -0.08) {
                // Downward angle towards floor or desk: calculate distance
                const rawDist = (camera.position.y - 0.05) / (-camForward.y)
                surfaceDist = Math.max(1.0, Math.min(2.5, rawDist))
              } else {
                // Aiming horizontal or slightly down (at a desk or equipment in front)
                surfaceDist = 1.5
              }

              // Anchor object along the central camera reticle ray
              // This guarantees the object and its badge appear DIRECTLY IN THE RETICLE
              // and never sink below the bottom panel or under the action buttons!
              hitPos = new THREE.Vector3()
                .copy(camera.position)
                .addScaledVector(camForward, surfaceDist)
            }

            t.surfaceState = {
              detected: isSurfaceDetected,
              distance: surfaceDist,
              hitPos,
              reason: isSurfaceDetected ? 'surface_detected' : 'aim_down_at_floor_or_desk',
            }
            surfaceDetectionRef.current = t.surfaceState

            if (isSurfaceDetected && hitPos) {
              // Surface detected: object sits neatly right at target
              activeNode.group.position.copy(hitPos)
              // Make object face the trainee horizontally around vertical Y axis
              activeNode.group.lookAt(camera.position.x, hitPos.y, camera.position.z)
              // ENFORCE: Object is 100% upright, ZERO tilt/roll
              activeNode.group.rotation.x = 0
              activeNode.group.rotation.z = 0
              activeNode.group.visible = true
            } else {
              // NO SURFACE DETECTED: Hide virtual object completely! No floating in mid-air
              activeNode.group.visible = false
            }
          }
        }

        // Spatial Direction & Distance Guidance (Calculated to the live world target!)
        if (activeNode) {
          const targetWorldPos = new THREE.Vector3()
          activeNode.group.getWorldPosition(targetWorldPos)

          const camWorldPos = new THREE.Vector3()
          camera.getWorldPosition(camWorldPos)

          const camForward = new THREE.Vector3(0, 0, -1).applyEuler(camera.rotation)
          camForward.y = 0
          camForward.normalize()

          const toTarget = new THREE.Vector3().subVectors(targetWorldPos, camWorldPos)
          toTarget.y = 0
          const dist = toTarget.length()
          toTarget.normalize()

          const dot = Math.min(Math.max(camForward.dot(toTarget), -1), 1)
          const angleRad = Math.acos(dot)
          const angleDeg = Math.round(THREE.MathUtils.radToDeg(angleRad))

          const crossY = camForward.z * toTarget.x - camForward.x * toTarget.z

          let turnDirection = 'in-front'
          if (!isPlaced || angleDeg <= 25) {
            turnDirection = 'in-front'
          } else if (angleDeg >= 135) {
            turnDirection = 'behind'
          } else if (crossY < 0) {
            turnDirection = 'right'
          } else {
            turnDirection = 'left'
          }

          const now = performance.now()
          if (!t.lastCueUpdate || now - t.lastCueUpdate > 100) {
            t.lastCueUpdate = now
            setSpatialDirectionCue({
              inView: !isPlaced || angleDeg <= 25,
              turnDirection,
              angleDeg,
              distanceMeters: dist.toFixed(1),
              stationName: steps[activeIdx]?.label || '',
              stepIndex: activeIdx,
              isDemoMode: false,
              isPlaced,
            })
          }
        }
      } else {
        if (controls) {
          controls.enabled = true
          if (autoRotateRef.current) {
            controls.autoRotate = true
            controls.autoRotateSpeed = 2.5
          } else {
            controls.autoRotate = false
          }
          controls.update()
        }
      }

      renderer.render(scene, camera)
    }) // end renderer.setAnimationLoop

    // 12. Cleanup on unmount
    return () => {
      renderer.setAnimationLoop(null) // Stops WebXR & rAF loop
      if (t.xrSession) { try { t.xrSession.end() } catch (_e) {} }
      canvas.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('deviceorientation', onDeviceRot)
      if ('ondeviceorientationabsolute' in window) {
        window.removeEventListener('deviceorientationabsolute', onDeviceRot)
      }
      fireAudioRef.current.stop()
      controls.dispose()
      renderer.dispose()
      scene.clear()
    }
  }, [scenario, handleStepClick, cameraChecked])

  // Keep refs up to date for the persistent animation loop
  const currentStepRef = useRef(currentStep)
  currentStepRef.current = currentStep
  const arModeRef = useRef(arMode)
  arModeRef.current = arMode
  const demoModeRef = useRef(demoMode)
  demoModeRef.current = demoMode

  // ─── Update Visual State When Step Changes (No WebGL Teardown) ────────────────
  useEffect(() => {
    const t = threeRef.current
    if (!t.stepNodes || !t.stepNodes.length) return

    // Signal renderLoop to re-anchor active object to live camera orientation
    t.anchoredStep = -1
    t.initTimestamp = performance.now()

    t.stepNodes.forEach(node => {
      const isCompleted = completedSteps.includes(node.stepIndex)
      const isActive = node.stepIndex === currentStep

      if (isCompleted) {
        node.group.visible = false
      } else {
        // Spatial Multi-Location AR: in AR mode, ONLY render the active step's 3D object & beacon.
        // In 3D simulation mode, keep upcoming objects subtly visible for warehouse context.
        node.group.visible = arMode ? isActive : true
        node.beamMesh.visible = isActive
        node.ringMesh.visible = isActive
        node.badgeSprite.visible = isActive
        if (node.propGroup) node.propGroup.visible = true

        if (isActive) {
          node.orbMesh.material.emissiveIntensity = 1.0
          node.orbMesh.scale.setScalar(1.0)
          node.badgeSprite.scale.set(0.72, 0.14, 1)
        } else {
          node.orbMesh.material.emissiveIntensity = 0.05
          node.orbMesh.scale.setScalar(0.6)
        }
      }
    })

    // Hide giant warehouse environment meshes in AR mode (user's room is the environment!)
    if (t.warehousePropsGroup) {
      t.warehousePropsGroup.visible = !arMode
    }

    // Update scene background and floor visibility for AR vs 3D mode
    if (t.scene) {
      if (arMode) {
        t.scene.background = null // Transparent for camera view
        if (t.floor) t.floor.visible = false // Trainee's camera shows real-world floor!
      } else {
        t.scene.background = new THREE.Color('#1F242D') // Crisp slate studio room
        if (t.floor) t.floor.visible = true
      }
    }

    // Dynamic virtual hazard reactions & realistic fire extinction
    const isExtinguished = completedSteps.includes(3)
    t.flameExtinguished = isExtinguished
    if (t.stepNodes[0]?.propGroup?.userData) {
      const ud = t.stepNodes[0].propGroup.userData
      if (ud.flames) ud.flames.forEach(flame => { flame.visible = !isExtinguished })
      if (ud.smoke) ud.smoke.forEach(smoke => { smoke.visible = !isExtinguished })
      if (ud.fireLight) {
        ud.fireLight.intensity = isExtinguished ? 0 : 4.5
      }
    }
    if (t.flameLight) {
      t.flameLight.intensity = isExtinguished ? 0 : 4.0
    }

    // Ambient Fire Crackling Audio (Web Audio API)
    // Plays when Step 0 is active or when fire has escalated
    if (isFireScenario && !isExtinguished && (currentStep === 0 || fireEscalated)) {
      fireAudioRef.current.start()
    } else {
      fireAudioRef.current.stop()
    }
  }, [currentStep, completedSteps, arMode, isFireScenario, demoMode, fireEscalated, cameraChecked])

  const steps = scenario?.steps ?? []
  const allDone = completedSteps.length === steps.length && steps.length > 0
  const activeStep = steps[currentStep]

  return (
    <div id="suraksha-scenario-root" style={{ width: '100vw', height: '100vh', background: '#1F242D', position: 'relative', overflow: 'hidden' }}>

      {/* Loading Overlay — Keeps Canvas permanently mounted so WebGL never suffers race conditions */}
      {(isLoading || !cameraChecked) && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 100,
          background: '#1A1A1A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div className="spinner" style={{ borderTopColor: 'var(--color-brand)', margin: '0 auto 16px' }} />
            <p style={{ fontWeight: 600 }}>Loading 3D Training Simulator…</p>
          </div>
        </div>
      )}

      {/* Camera Live Feed & Virtual AR HUD (AR Mode) */}
      {arMode && cameraAvail && (
        <>
          <CameraBackground streamRef={cameraStreamRef} videoRef={cameraVideoRef} />
          <VirtualARHUD
            scenario={scenario}
            currentStep={currentStep}
            completedSteps={completedSteps}
            steps={steps}
            lang={lang}
            onStepClick={handleStepClick}
            stepFeedback={stepFeedback}
            allDone={allDone}
            saving={saving}
            onToggleMode={toggleARMode}
            onExit={() => navigate('/dashboard')}
            isOnline={isOnline}
            spatialDirectionCue={spatialDirectionCue}
            demoMode={demoMode}
            onToggleDemoMode={() => setDemoMode(prev => !prev)}
            timerSeconds={timerSeconds}
            timerMaxSeconds={getStepDuration(currentStep)}
            consequenceFailure={consequenceFailure}
            onRetryStep={handleRetryStep}
            positiveSuccess={positiveSuccess}
            onDecisionChoice={handleDecisionChoice}
            isPlaced={!arMode || !!placedSteps[currentStep] || !!steps[currentStep]?.is_decision_step}
            onPlaceObject={handlePlaceCurrentStep}
            onResetPlacement={handleResetPlacement}
            xrTrackingType={xrTrackingType}
            sensorDebug={sensorDebug}
            surfaceDetection={surfaceDetection}
          />
        </>
      )}

      {/* Persistent Three.js Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          display: 'block',
          touchAction: 'none',
          cursor: 'grab',
        }}
      />

      {/* On-Screen Touch / Mouse Camera Helper Controls (Right Side) */}
      {!arMode && (
        <div style={{
          position: 'absolute', right: 16, top: '40%', transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', gap: 8, zIndex: 25, pointerEvents: 'auto',
        }}>
          {/* Action Button Row: Locate + 360 Auto-Rotate */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleFocusTarget()
              }}
              onPointerDown={(e) => e.stopPropagation()}
              title="Focus Active Target"
              style={{
                width: 44, height: 44, borderRadius: 12, background: 'var(--color-brand)',
                border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)', cursor: 'pointer',
                touchAction: 'manipulation', pointerEvents: 'auto',
              }}
            >
              <Target size={22} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                toggleAutoRotate()
              }}
              onPointerDown={(e) => e.stopPropagation()}
              title={autoRotate ? "Stop 360° Rotation" : "Auto-Rotate 360°"}
              style={{
                width: 44, height: 44, borderRadius: 12,
                background: autoRotate ? '#10B981' : 'rgba(20, 20, 26, 0.85)',
                border: autoRotate ? '2px solid #34D399' : '1px solid rgba(255,255,255,0.2)',
                color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: autoRotate ? '0 0 16px rgba(16, 185, 129, 0.7)' : '0 4px 12px rgba(0,0,0,0.3)',
                cursor: 'pointer', transition: 'all 0.2s',
                touchAction: 'manipulation', pointerEvents: 'auto',
              }}
            >
              <RotateCw size={17} style={{ animation: autoRotate ? 'spin 3s linear infinite' : 'none' }} />
              <span style={{ fontSize: '9px', fontWeight: 800, marginTop: 1 }}>360°</span>
            </button>
          </div>

          {/* D-Pad Buttons with 360 Center Button */}
          <div style={{
            background: 'rgba(20, 20, 26, 0.85)', backdropFilter: 'blur(8px)',
            borderRadius: 16, padding: 6, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 4, border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleManualRotate(0, 0.4)
              }}
              onPointerDown={(e) => e.stopPropagation()}
              title="Tilt Up"
              style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.06)', borderRadius: 8, border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'manipulation', pointerEvents: 'auto' }}
            >
              <ArrowUp size={18} />
            </button>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleManualRotate(0.75, 0)
                }}
                onPointerDown={(e) => e.stopPropagation()}
                title="Rotate 360° Left"
                style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.06)', borderRadius: 8, border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'manipulation', pointerEvents: 'auto' }}
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleAutoRotate()
                }}
                onPointerDown={(e) => e.stopPropagation()}
                title="Toggle 360° Orbit"
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: autoRotate ? 'var(--color-brand)' : 'rgba(255,255,255,0.12)',
                  border: 'none', color: 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 800, touchAction: 'manipulation', pointerEvents: 'auto',
                }}
              >
                360°
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleManualRotate(-0.75, 0)
                }}
                onPointerDown={(e) => e.stopPropagation()}
                title="Rotate 360° Right"
                style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.06)', borderRadius: 8, border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'manipulation', pointerEvents: 'auto' }}
              >
                <ArrowRight size={18} />
              </button>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleManualRotate(0, -0.4)
              }}
              onPointerDown={(e) => e.stopPropagation()}
              title="Tilt Down"
              style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.06)', borderRadius: 8, border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'manipulation', pointerEvents: 'auto' }}
            >
              <ArrowDown size={18} />
            </button>
          </div>

          {/* Zoom Buttons */}
          <div style={{
            background: 'rgba(20, 20, 26, 0.85)', backdropFilter: 'blur(8px)',
            borderRadius: 14, padding: 6, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 4, border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleManualZoom(1.3)
              }}
              onPointerDown={(e) => e.stopPropagation()}
              title="Zoom In"
              style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.06)', borderRadius: 8, border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'manipulation', pointerEvents: 'auto' }}
            >
              <ZoomIn size={18} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleManualZoom(0.7)
              }}
              onPointerDown={(e) => e.stopPropagation()}
              title="Zoom Out"
              style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.06)', borderRadius: 8, border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'manipulation', pointerEvents: 'auto' }}
            >
              <ZoomOut size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Floating 3D Navigation Hint */}
      {showControlsHelp && !arMode && (
        <div style={{
          position: 'absolute', top: 76, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          border: '1px solid var(--color-brand)', borderRadius: 20,
          padding: '8px 20px', color: 'white', fontSize: 12, fontWeight: 600,
          zIndex: 12, display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}>
          <Compass size={16} color="var(--color-brand)" />
          <span>Click &amp; drag anywhere to rotate 360° · Scroll to zoom · Tap the glowing orb</span>
          <button onClick={() => setShowControlsHelp(false)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', marginLeft: 6 }}>✕</button>
        </div>
      )}

      {/* Desktop 3D Simulation HUD Layer */}
      {!arMode && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none', display: 'flex', flexDirection: 'column' }}>

          {/* Top Header Bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
            background: 'linear-gradient(to bottom, rgba(15,18,22,0.95), transparent)',
            pointerEvents: 'auto',
          }}>
            {/* Mode Badge & Timer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="button"
                onClick={toggleARMode}
                title="Click to Switch Mode"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: arMode ? 'rgba(224,90,0,0.25)' : 'rgba(14,124,123,0.35)',
                  border: `1.5px solid ${arMode ? 'var(--color-brand)' : '#0E7C7B'}`,
                  borderRadius: 20, padding: '6px 14px',
                  color: 'white', fontSize: 12, fontWeight: 700,
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                }}
              >
                {arMode ? <Camera size={14} color="var(--color-brand)" /> : <Monitor size={14} color="#0E7C7B" />}
                <span>{arMode ? '📷 Camera AR Mode' : '🖥️ 3D Simulation Mode'}</span>
              </button>

              {/* Countdown Urgency Timer */}
              {!allDone && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'rgba(15, 18, 24, 0.92)',
                    backdropFilter: 'blur(8px)',
                    border: `1.5px solid ${timerSeconds > 7 ? '#10B981' : timerSeconds > 3 ? '#F59E0B' : '#EF4444'}`,
                    borderRadius: 20,
                    padding: '5px 14px',
                    boxShadow: `0 4px 16px ${timerSeconds > 7 ? 'rgba(16,185,129,0.3)' : timerSeconds > 3 ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.7)'}`,
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: 13,
                    animation: timerSeconds <= 3 ? 'sarUrgentPulse 0.6s ease-in-out infinite' : 'none',
                  }}
                >
                  <span>⏱</span>
                  <span style={{ color: timerSeconds > 7 ? '#10B981' : timerSeconds > 3 ? '#F59E0B' : '#EF4444', minWidth: 26, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
                    {timerSeconds}s
                  </span>
                  <div style={{ width: 42, height: 5, background: 'rgba(255,255,255,0.18)', borderRadius: 3, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.max(0, Math.min(100, (timerSeconds / getStepDuration(currentStep)) * 100))}%`,
                        height: '100%',
                        background: timerSeconds > 7 ? '#10B981' : timerSeconds > 3 ? '#F59E0B' : '#EF4444',
                        borderRadius: 3,
                        transition: 'width 0.9s linear, background-color 0.3s ease',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {timerSeconds <= 3 ? 'CRITICAL' : timerSeconds <= 7 ? 'EXPEDITE' : 'WINDOW'}
                  </span>
                </div>
              )}
            </div>

            {/* Right Action Controls */}
            <div style={{ display: 'flex', gap: 8 }}>
              {!isOnline && (
                <div style={{
                  background: 'rgba(212,136,42,0.9)', borderRadius: 20,
                  padding: '4px 10px', fontSize: 11, fontWeight: 700, color: 'white',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <WifiOff size={12} /> OFFLINE
                </div>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleARMode()
                }}
                onPointerDown={(e) => e.stopPropagation()}
                style={{
                  background: 'rgba(28,32,40,0.9)', border: '1px solid rgba(255,255,255,0.25)',
                  color: 'white', borderRadius: 20, padding: '8px 16px',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                  touchAction: 'manipulation', pointerEvents: 'auto',
                }}
              >
                {arMode ? <Monitor size={14} /> : <Camera size={14} />}
                {arMode ? 'Switch to 3D' : 'Switch to AR'}
              </button>

              {/* Native ARCore button — only shown on ARCore-capable Android devices */}
              {webXrSupported && !arMode && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    launchWebXRSession()
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  title="Launch Native ARCore (real surface plane detection)"
                  style={{
                    background: 'linear-gradient(135deg, rgba(14,124,123,0.85), rgba(6,78,59,0.85))',
                    border: '1.5px solid #0E7C7B',
                    color: 'white', borderRadius: 20, padding: '8px 14px',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                    touchAction: 'manipulation', pointerEvents: 'auto',
                    boxShadow: '0 0 12px rgba(14,124,123,0.5)',
                  }}
                >
                  📡 Native ARCore
                </button>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate('/dashboard')
                }}
                onPointerDown={(e) => e.stopPropagation()}
                style={{
                  background: 'rgba(220,38,38,0.2)', border: '1px solid #DC2626',
                  color: 'white', borderRadius: 20, padding: '8px 14px',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                  touchAction: 'manipulation', pointerEvents: 'auto',
                }}
              >
                <X size={14} /> {T('exitTraining')}
              </button>
            </div>
          </div>

          {/* Title */}
          <div style={{ padding: '0 20px', pointerEvents: 'none' }}>
            <span style={{
              background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: 6,
              color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 700,
            }}>
              {scenario?.title ?? 'Industrial Training Scenario'}
            </span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Bottom Instruction & Action Card */}
          <div style={{
            background: 'linear-gradient(to top, rgba(12,14,18,0.96) 80%, transparent)',
            padding: '24px 20px 20px',
            pointerEvents: 'auto',
            maxWidth: 680,
            margin: '0 auto',
            width: '100%',
          }}>
            {/* Progress Segmented Bar */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              {steps.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 6, borderRadius: 3,
                  background: completedSteps.includes(i) ? '#10B981'
                    : i === currentStep ? 'var(--color-brand)' : 'rgba(255,255,255,0.2)',
                  transition: 'background 0.3s ease',
                }} />
              ))}
            </div>

            {!allDone && activeStep && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ color: 'var(--color-brand)', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {T('step')} {currentStep + 1} / {steps.length}
                  </span>
                  <button
                    onClick={() => speak(getStepText(activeStep, 'instruction'), lang)}
                    style={{
                      background: 'transparent', border: 'none', color: '#9CA3AF',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12,
                    }}
                  >
                    <Volume2 size={14} /> {T('listen')}
                  </button>
                </div>

                <h2 style={{ color: 'white', fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', fontWeight: 800, marginBottom: 6 }}>
                  {getStepText(activeStep, 'label')}
                </h2>

                <p style={{ color: '#D1D5DB', fontSize: 14, lineHeight: 1.5, marginBottom: 14 }}>
                  {getStepText(activeStep, 'instruction')}
                </p>

                {/* Direct Action Completion / Decision Buttons */}
                {activeStep?.is_decision_step ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-brand)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      ⚡ Decision Point: Evaluate Fire Hazard Severity
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        type="button"
                        data-testid="decision-small-safe"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDecisionChoice('small_safe')
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #10B981, #059669)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 12,
                          padding: '14px 16px',
                          fontWeight: 700,
                          fontSize: 14,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
                          touchAction: 'manipulation',
                          pointerEvents: 'auto',
                        }}
                      >
                        🔥 Small &amp; Safe (Extinguish)
                      </button>

                      <button
                        type="button"
                        data-testid="decision-not-safe"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDecisionChoice('not_safe')
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 12,
                          padding: '14px 16px',
                          fontWeight: 700,
                          fontSize: 14,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          boxShadow: '0 4px 14px rgba(239,68,68,0.35)',
                          touchAction: 'manipulation',
                          pointerEvents: 'auto',
                        }}
                      >
                        ⚠️ Not Safe / Spreading (Evacuate)
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleFocusTarget()
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        title="Center view on this target"
                        style={{
                          background: 'rgba(255,255,255,0.12)',
                          color: 'white',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: 12,
                          padding: '0 16px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          fontSize: 13,
                          fontWeight: 600,
                          touchAction: 'manipulation',
                          pointerEvents: 'auto',
                        }}
                      >
                        <Target size={18} />
                        Locate
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStepClick(currentStep)
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      style={{
                        flex: 1,
                        background: 'var(--color-brand)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 12,
                        padding: '14px 20px',
                        fontWeight: 700,
                        fontSize: 15,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: '0 4px 14px rgba(224,90,0,0.4)',
                        touchAction: 'manipulation',
                        pointerEvents: 'auto',
                      }}
                    >
                      <CheckCircle size={20} />
                      Complete Action: {activeStep.label}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFocusTarget()
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      title="Center view on this target"
                      style={{
                        background: 'rgba(255,255,255,0.12)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 12,
                        padding: '0 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        touchAction: 'manipulation',
                        pointerEvents: 'auto',
                      }}
                    >
                      <Target size={18} />
                      Locate
                    </button>
                  </div>
                )}
              </div>
            )}

            {allDone && (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', background: 'rgba(16,185,129,0.2)',
                  color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 10px',
                }}>
                  <CheckCircle size={28} />
                </div>
                <h3 style={{ color: '#10B981', fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
                  All Safety Actions Completed!
                </h3>
                <p style={{ color: '#9CA3AF', fontSize: 13 }}>
                  {saving ? 'Saving results and preparing knowledge assessment…' : 'Preparing results…'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step Feedback Popup for 3D Mode */}
      {!arMode && stepFeedback && (
        <div style={{
          position: 'absolute', top: '45%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 30,
          background: stepFeedback.correct ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
          backdropFilter: 'blur(8px)',
          borderRadius: 16, padding: '18px 28px',
          textAlign: 'center', color: 'white',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
        }}>
          <CheckCircle size={32} style={{ margin: '0 auto 6px' }} />
          <p style={{ fontWeight: 800, fontSize: 16 }}>{stepFeedback.label}</p>
          <p style={{ fontSize: 13, opacity: 0.9 }}>{stepFeedback.correct ? 'Correct Action Performed! ✓' : 'Out of Sequence — Follow step order'}</p>
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
            padding: '12px 24px',
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
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Correct Protocol Action! ✓</div>
            <div style={{ fontSize: '0.74rem', opacity: 0.9 }}>Executed within safety response window</div>
          </div>
        </div>
      )}

      {/* Consequence Overlay Modal on Failure or Timeout */}
      {consequenceFailure && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 18, 24, 0.88)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div
            style={{
              maxWidth: 500,
              width: '100%',
              background: '#181D26',
              border: '2px solid #EF4444',
              borderRadius: 22,
              padding: '28px 24px',
              boxShadow: '0 20px 50px rgba(239, 68, 68, 0.4), 0 8px 24px rgba(0,0,0,0.7)',
              textAlign: 'center',
              color: '#FFFFFF',
              animation: 'sarScaleUp 0.25s ease-out',
            }}
          >
            <div style={{
              width: 60, height: 60, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)',
              border: '2px solid #EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px', color: '#EF4444'
            }}>
              <AlertTriangle size={34} />
            </div>

            <div style={{
              fontSize: '0.74rem', fontWeight: 800, color: '#EF4444',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6
            }}>
              Critical Safety Consequence
            </div>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 12px', color: '#FFFFFF' }}>
              {consequenceFailure.title}
            </h2>

            <div style={{
              background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 14, padding: '14px 16px', marginBottom: 22, textAlign: 'left'
            }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#FCA5A5', lineHeight: 1.6 }}>
                {consequenceFailure.explanation}
              </p>
            </div>

            {consequenceFailure.isDecisionTimeout ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
                <button
                  onClick={() => handleDecisionChoice('small_safe')}
                  style={{
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 12,
                    padding: '14px 20px',
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  <span>🧯 Suppress Fire with CO₂ (Small &amp; Safe)</span>
                </button>

                <button
                  onClick={() => handleDecisionChoice('not_safe')}
                  style={{
                    background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 12,
                    padding: '14px 20px',
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)',
                  }}
                >
                  <span>🏃 Evacuate Immediately (Not Safe)</span>
                </button>

                <button
                  onClick={handleRetryStep}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: '#94A3B8',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 10,
                    padding: '10px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <RotateCcw size={15} />
                  <span>Reset Timer &amp; Reassess</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleRetryStep}
                style={{
                  background: 'var(--color-brand)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 12,
                  padding: '14px 22px',
                  fontSize: '0.98rem',
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
                <RotateCcw size={19} />
                <span>Retry This Step</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Global Injected Keyframes for Timer & Modal */}
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
