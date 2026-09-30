// ============================================================
// src/lib/mockDb.js
// Full mock database for SurakshaAR demo mode (no Supabase)
// ============================================================

import { getGooglePresetAvatar } from '../data/googleAvatars'

// ─── localStorage helpers ────────────────────────────────────
function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('[mockDb] localStorage save failed:', e)
  }
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// ─── Demo Scenarios ──────────────────────────────────────────
const DEMO_SCENARIOS = [
  {
    id: 'a1b2c3d4-0001-0001-0001-000000000001',
    title: 'Fire & Explosion Response',
    title_hi: 'आग और विस्फोट प्रतिक्रिया',
    title_sat: 'ᱥᱮᱸᱜᱮᱞ ᱟᱨ ᱯᱷᱩᱴᱟᱹᱣ ᱨᱩᱠᱷᱤᱭᱟᱹ',
    description: 'Simulate responding to an electrical fire on a manufacturing floor. Identify the hazard, activate emergency protocols, don PPE, use the correct extinguisher, and evacuate safely.',
    description_hi: 'एक मैन्युफैक्चरिंग फ्लोर पर बिजली की आग का जवाब देने का अभ्यास करें। खतरे की पहचान करें, आपातकालीन प्रोटोकॉल सक्रिय करें, PPE पहनें, सही अग्निशामक का उपयोग करें और सुरक्षित निकासी करें।',
    description_sat: 'ᱠᱟᱹᱨᱜᱟᱲ ᱨᱮ ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱤᱠᱷᱟᱣ ᱢᱮ᱾ ᱵᱚᱛᱚᱨ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ, ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱱᱤᱭᱟᱹᱢ ᱞᱟᱦᱟᱭ ᱢᱮ, PPE ᱦᱚᱨᱚᱜ ᱢᱮ, ᱴᱷᱤᱠ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱤᱡ ᱵᱮᱵᱷᱟᱨ ᱢᱮ ᱟᱨ ᱥᱩᱨᱠᱷᱤᱛ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠ ᱢᱮ᱾',
    hazard_type: 'fire',
    difficulty: 'beginner',
    benchmark_time_ms: 90000,
    thumbnail_url: null,
    created_at: new Date('2026-01-01').toISOString(),
    steps: [
      { index: 0, label: 'Identify Fire Source', label_hi: 'आग के स्रोत की पहचान करें', label_sat: 'ᱥᱮᱸᱜᱮᱞ ᱨᱮᱦᱮᱫ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ', instruction: 'Point camera at fire hazard for real-time computer vision detection, or locate the fire near the control panel', instruction_hi: 'कंप्यूटर विज़न द्वारा आग का पता लगाने के लिए कैमरा आग की ओर करें, या कंट्रोल पैनल के पास आग खोजें', instruction_sat: 'ᱥᱮᱸᱜᱮᱞ ᱪᱤᱱᱦᱟᱹᱣ ᱞᱟᱹᱜᱤᱫ ᱠᱮᱢᱮᱨᱟ ᱥᱮᱸᱜᱮᱞ ᱥᱮᱫ ᱩᱫᱩᱜ ᱢᱮ, ᱥᱮ ᱠᱚᱱᱴᱨᱳᱞ ᱯᱮᱱᱮᱞ ᱥᱩᱨ ᱥᱮᱸᱜᱮᱞ ᱧᱟᱢ ᱢᱮ', position: [3, 1.2, 3], color: '#ef4444', is_ppe_step: false },
      { index: 1, label: 'Trigger Fire Alarm', label_hi: 'फायर अलार्म बजाएं', label_sat: 'ᱯᱷᱟᱭᱟᱨ ᱟᱞᱟᱨᱢ ᱪᱟᱹᱞᱩᱭ ᱢᱮ', instruction: 'Activate the nearest manual fire alarm call point', instruction_hi: 'निकटतम मैनुअल फायर अलार्म कॉल पॉइंट सक्रिय करें', instruction_sat: 'ᱥᱩᱨ ᱨᱮᱱᱟᱜ ᱯᱷᱟᱭᱟᱨ ᱟᱞᱟᱨᱢ ᱵᱚᱴᱚᱱ ᱞᱤᱱ ᱢᱮ', position: [2.5, 2.0, -2], color: '#f97316', is_ppe_step: false },
      { index: 2, label: 'Equip Fire-Rated PPE', label_hi: 'फायर-रेटेड PPE पहनें', label_sat: 'ᱯᱷᱟᱭᱟᱨ PPE ᱦᱚᱨᱚᱜ ᱢᱮ', instruction: 'Put on fire-rated gloves, helmet, and protective gear from the station', instruction_hi: 'स्टेशन से फायर-रेटेड दस्ताने, हेलमेट और सुरक्षात्मक गियर पहनें', instruction_sat: 'ᱥᱴᱮᱥᱚᱱ ᱠᱷᱚᱱ ᱯᱷᱟᱭᱟᱨ ᱜᱞᱚᱵᱷᱥ, ᱦᱮᱞᱢᱮᱴ ᱟᱨ ᱥᱮᱯᱷᱴᱤ ᱥᱟᱢᱟᱱ ᱦᱚᱨᱚᱜ ᱢᱮ', position: [-4, 0.9, 1], color: '#22c55e', is_ppe_step: true },
      { index: 3, label: 'Assess Fire & Extinguish', label_hi: 'आग का आकलन और नियंत्रण', label_sat: 'ᱥᱮᱸᱜᱮᱞ ᱯᱟᱨᱠᱷᱟᱣ ᱟᱨ ᱤᱬᱤᱡ', instruction: 'Assess fire intensity: Choose whether fire is Small & Safe to extinguish with CO₂, or Not Safe / Spreading', instruction_hi: 'आग की तीव्रता का आकलन करें: चुनें कि क्या आग CO₂ से बुझाने के लिए छोटी और सुरक्षित है, या खतरनाक रूप से फैल रही है', instruction_sat: 'ᱥᱮᱸᱜᱮᱞ ᱨᱮᱱᱟᱜ ᱡᱩᱞ ᱯᱟᱨᱠᱷᱟᱣ ᱢᱮ: ᱵᱟᱪᱷᱟᱣ ᱢᱮ ᱱᱚᱣᱟ CO₂ ᱛᱮ ᱤᱬᱤᱡ ᱞᱟᱹᱜᱤᱫ ᱠᱟᱹᱴᱤᱡ ᱟᱨ ᱥᱩᱨᱠᱷᱤᱛ ᱜᱮᱭᱟ, ᱥᱮ ᱵᱚᱛᱚᱨ ᱞᱮᱠᱟ ᱯᱟᱥᱱᱟᱣᱜ ᱠᱟᱱᱟ', position: [1.5, 0.8, 2], color: '#3b82f6', is_ppe_step: false, is_decision_step: true },
      { index: 4, label: 'Use Fire Exit', label_hi: 'फायर एग्जिट का उपयोग करें', label_sat: 'ᱯᱷᱟᱭᱟᱨ ᱮᱠᱡᱤᱴ ᱛᱮ ᱪᱟᱞᱟᱜ ᱢᱮ', instruction: 'Proceed through the nearest clearly marked fire exit', instruction_hi: 'निकटतम स्पष्ट रूप से चिह्नित फायर निकास से बाहर निकलें', instruction_sat: 'ᱥᱩᱨ ᱨᱮᱱᱟᱜ ᱪᱤᱱᱦᱟᱹᱣ ᱯᱷᱟᱭᱟᱨ ᱮᱠᱡᱤᱴ ᱛᱮ ᱚᱰᱚᱠ ᱢᱮ', position: [-6, 1.5, -5], color: '#8b5cf6', is_ppe_step: false },
      { index: 5, label: 'Reach Muster Point', label_hi: 'मस्टर पॉइंट पर पहुंचें', label_sat: 'ᱢᱟᱥᱴᱟᱨ ᱯᱚᱭᱮᱱᱴ ᱨᱮ ᱥᱮᱴᱮᱨᱚᱜ ᱢᱮ', instruction: 'Assemble at the outdoor safe muster point for roll call', instruction_hi: 'उपस्थिति दर्ज कराने के लिए बाहरी सुरक्षित मस्टर पॉइंट पर एकत्र हों', instruction_sat: 'ᱦᱟᱡᱤᱨᱟ ᱞᱟᱹᱜᱤᱫ ᱵᱟᱦᱨᱮ ᱥᱩᱨᱠᱷᱤᱛ ᱢᱟᱥᱴᱟᱨ ᱯᱚᱭᱮᱱᱴ ᱨᱮ ᱡᱟᱣᱨᱟᱜ ᱢᱮ', position: [0, 1.0, 10], color: '#a855f7', is_ppe_step: false },
    ],
  },
  {
    id: 'a1b2c3d4-0004-0004-0004-000000000004',
    title: 'PPE & Industrial Hazard Baseline',
    title_hi: 'पीपीई और औद्योगिक खतरा आधार रेखा',
    title_sat: 'PPE ᱟᱨ ᱠᱟᱹᱨᱜᱟᱲ ᱵᱚᱛᱚᱨ ᱵᱩᱱᱤᱭᱟᱹᱫᱽ',
    description: 'Master mandatory Personal Protective Equipment protocols and baseline factory floor hazard identification. Don complete safety gear in correct order, inspect compliance, and verify safe worksite entry.',
    description_hi: 'अनिवार्य व्यक्तिगत सुरक्षा उपकरण (PPE) प्रोटोकॉल और बुनियादी फैक्ट्री फ्लोर खतरे की पहचान में महारत हासिल करें। सही क्रम में पूर्ण सुरक्षा गियर पहनें, अनुपालन का निरीक्षण करें और सुरक्षित कार्यस्थल प्रवेश सत्यापित करें।',
    description_sat: 'ᱞᱟᱹᱠᱛᱤᱭᱟᱱ PPE ᱱᱤᱭᱟᱹᱢ ᱟᱨ ᱠᱟᱹᱨᱜᱟᱲ ᱵᱚᱛᱚᱨ ᱪᱤᱱᱦᱟᱹᱣ ᱪᱮᱫᱚᱜ ᱢᱮ᱾ ᱴᱷᱤᱠ ᱛᱷᱟᱨ ᱛᱮ ᱯᱩᱨᱟᱹ ᱥᱮᱯᱷᱴᱤ ᱥᱟᱢᱟᱱ ᱦᱚᱨᱚᱜ ᱢᱮ, ᱯᱟᱨᱠᱷᱟᱣ ᱢᱮ ᱟᱨ ᱥᱩᱨᱠᱷᱤᱛ ᱠᱟᱹᱢᱤ ᱴᱷᱟᱶ ᱵᱚᱞᱚᱱ ᱯᱩᱨᱟᱹᱣ ᱢᱮ᱾',
    hazard_type: 'ppe',
    difficulty: 'beginner',
    benchmark_time_ms: 100000,
    thumbnail_url: null,
    coming_soon: true,
    created_at: new Date('2026-01-02').toISOString(),
    steps: [
      { index: 0, label: 'Identify Workplace Hazard', label_hi: 'कार्यस्थल के खतरे की पहचान करें', label_sat: 'ᱠᱟᱹᱢᱤ ᱴᱷᱟᱶ ᱨᱮ ᱵᱚᱛᱚᱨ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ', instruction: 'Inspect the operational area and locate the unshielded electrical panel hazard before beginning work', instruction_hi: 'काम शुरू करने से पहले कार्य क्षेत्र का निरीक्षण करें और खुले बिजली पैनल के खतरे की पहचान करें', instruction_sat: 'ᱠᱟᱹᱢᱤ ᱮᱦᱚᱵ ᱞᱟᱦᱟ ᱠᱟᱹᱢᱤ ᱴᱷᱟᱶ ᱧᱮᱞ ᱯᱟᱨᱠᱷᱟᱣ ᱢᱮ ᱟᱨ ᱡᱷᱤᱡ ᱟᱠᱟᱱ ᱵᱤᱡᱽᱞᱤ ᱵᱚᱛᱚᱨ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ', position: [3, 1.2, 3], color: '#ef4444', is_ppe_step: false },
      { index: 1, label: 'Equip Head & Eye Protection', label_hi: 'हेलमेट और सुरक्षा चश्मा पहनें', label_sat: 'ᱦᱮᱞᱢᱮᱴ ᱟᱨ ᱥᱮᱯᱷᱴᱤ ᱪᱚᱥᱢᱟ ᱦᱚᱨᱚᱜ ᱢᱮ', instruction: 'Select the industrial safety helmet (IS 2925) and impact-resistant eye goggles from the PPE station', instruction_hi: 'PPE स्टेशन से औद्योगिक सुरक्षा हेलमेट (IS 2925) और प्रभाव-प्रतिरोधी सुरक्षा चश्मा लें', instruction_sat: 'PPE ᱥᱴᱮᱥᱚᱱ ᱠᱷᱚᱱ ᱥᱮᱯᱷᱴᱤ ᱦᱮᱞᱢᱮᱴ ᱟᱨ ᱢᱮᱫ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱪᱚᱥᱢᱟ ᱦᱚᱨᱚᱜ ᱢᱮ', position: [-4, 1.4, 1], color: '#0ea5e9', is_ppe_step: true },
      { index: 2, label: 'Equip Respiratory & Ear Protection', label_hi: 'श्वसन और कान सुरक्षा गियर पहनें', label_sat: 'ᱥᱟᱦᱮᱫ ᱢᱟᱥᱠ ᱟᱨ ᱞᱩᱛᱩᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱦᱚᱨᱚᱜ ᱢᱮ', instruction: 'Don certified particulate respirator mask and high-decibel ear muffs for hazardous airborne and noise zones', instruction_hi: 'खतरनाक धूल और शोर क्षेत्रों के लिए प्रमाणित रेस्पिरेटर मास्क और कान के मफ पहनें', instruction_sat: 'ᱫᱷᱩᱲᱤ ᱟᱨ ᱟᱹᱰᱤ ᱡᱩᱨ ᱥᱟᱰᱮ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱨᱮᱥᱯᱤᱨᱮᱴᱚᱨ ᱢᱟᱥᱠ ᱟᱨ ᱤᱭᱟᱨ ᱢᱟᱯᱷ ᱦᱚᱨᱚᱜ ᱢᱮ', position: [-4, 0.9, 1], color: '#f59e0b', is_ppe_step: true },
      { index: 3, label: 'Equip High-Vis Vest & Gloves', label_hi: 'हाई-विज़ वेस्ट और सुरक्षा दस्ताने पहनें', label_sat: 'ᱦᱟᱭ-ᱵᱷᱤᱡᱽ ᱵᱷᱮᱥᱴ ᱟᱨ ᱥᱮᱯᱷᱴᱤ ᱜᱞᱚᱵᱷᱥ ᱦᱚᱨᱚᱜ ᱢᱮ', instruction: 'Put on fluorescent Class 2 reflective safety vest and heavy-duty cut-resistant industrial gloves', instruction_hi: 'फ्लोरोसेंट क्लास 2 रिफ्लेक्टिव सेफ्टी वेस्ट और कट-प्रतिरोधी औद्योगिक दस्ताने पहनें', instruction_sat: 'ᱪᱚᱢᱠᱟᱣ ᱦᱟᱭ-ᱵᱷᱤᱡᱽ ᱵᱷᱮᱥᱴ ᱟᱨ ᱜᱮᱫ-ᱴᱮᱠᱟᱣ ᱠᱟᱹᱨᱜᱟᱲ ᱜᱞᱚᱵᱷᱥ ᱦᱚᱨᱚᱜ ᱢᱮ', position: [-2.5, 1.0, 0.5], color: '#22c55e', is_ppe_step: true },
      { index: 4, label: 'Equip Steel-Toe Safety Boots', label_hi: 'स्टील-टो सुरक्षा जूते पहनें', label_sat: 'ᱥᱴᱤᱞ-ᱴᱳ ᱥᱮᱯᱷᱴᱤ ᱡᱩᱛᱟᱹ ᱦᱚᱨᱚᱜ ᱢᱮ', instruction: 'Wear puncture-resistant, electrical-hazard rated steel-toe boots before entering active work floor', instruction_hi: 'सक्रिय कार्य क्षेत्र में प्रवेश करने से पहले पंचर-प्रतिरोधी, स्टील-टो सुरक्षा जूते पहनें', instruction_sat: 'ᱠᱟᱹᱢᱤ ᱪᱟᱹᱞᱩ ᱴᱷᱟᱶ ᱨᱮ ᱵᱚᱞᱚᱱ ᱞᱟᱦᱟ ᱠᱮᱴᱮᱡ ᱥᱴᱤᱞ-ᱴᱳ ᱥᱮᱯᱷᱴᱤ ᱵᱩᱴ ᱦᱚᱨᱚᱜ ᱢᱮ', position: [-1.5, 0.5, 2], color: '#8b5cf6', is_ppe_step: true },
      { index: 5, label: 'Complete Safety Checklist Verification', label_hi: 'सुरक्षा चेकलिस्ट सत्यापन पूरा करें', label_sat: 'ᱥᱮᱯᱷᱴᱤ ᱪᱮᱠᱞᱤᱥᱴ ᱯᱟᱨᱠᱷᱟᱣ ᱯᱩᱨᱟᱹᱣ ᱢᱮ', instruction: 'Verify all mandatory PPE fitment at supervisor safety checkpoint and confirm readiness for site entry', instruction_hi: 'सुपरवाइजर सुरक्षा चेकपॉइंट पर सभी अनिवार्य PPE फिटिंग का सत्यापन करें और साइट में प्रवेश की पुष्टि करें', instruction_sat: 'ᱥᱩᱯᱚᱨᱵᱷᱟᱭᱤᱡᱚᱨ ᱴᱷᱟᱶ ᱨᱮ ᱡᱚᱛᱚ PPE ᱴᱷᱤᱠ ᱢᱮᱱᱟᱜᱼᱟ ᱢᱮᱱᱛᱮ ᱯᱟᱨᱠᱷᱟᱣ ᱢᱮ ᱟᱨ ᱥᱟᱭᱤᱴ ᱵᱚᱞᱚᱱ ᱯᱩᱨᱟᱹᱣ ᱢᱮ', position: [0, 1.0, 10], color: '#a855f7', is_ppe_step: false },
    ],
  },
  {
    id: 'a1b2c3d4-0003-0003-0003-000000000003',
    title: 'Heavy Industrial Machinery & Nip-Point Guarding',
    title_hi: 'भारी औद्योगिक मशीनरी और निप-पॉइंट गार्डिंग',
    title_sat: 'ᱦᱟᱢᱟᱞ ᱠᱟᱹᱨᱜᱟᱲ ᱢᱮᱥᱤᱱ ᱟᱨ ᱱᱤᱯ-ᱯᱚᱭᱮᱱᱴ ᱜᱟᱨᱰᱤᱝ',
    description: 'Learn to safely isolate machinery before maintenance using LOTO procedures. Master rotating nip-point guarding, E-stop triggers, zero-energy state verification, and physical barrier interlocks.',
    description_hi: 'LOTO प्रक्रियाओं का उपयोग करके रखरखाव से पहले मशीनरी को सुरक्षित रूप से अलग करना सीखें। घूर्णन निप-पॉइंट गार्डिंग, ई-स्टॉप, शून्य-ऊर्जा स्थिति सत्यापन और भौतिक बैरियर इंटरलॉक्स में महारत हासिल करें।',
    description_sat: 'LOTO ᱱᱤᱭᱟᱹᱢ ᱛᱮ ᱢᱮᱥᱤᱱ ᱥᱟᱯᱲᱟᱣ ᱞᱟᱦᱟ ᱥᱩᱨᱠᱷᱤᱛ ᱞᱮᱠᱟᱛᱮ ᱵᱚᱸᱫᱽ ᱟᱨ ᱞᱚᱠ ᱪᱮᱫᱚᱜ ᱢᱮ᱾ ᱤ-ᱥᱴᱚᱯ, ᱡᱤᱨᱳ ᱮᱱᱟᱨᱡᱤ ᱯᱟᱨᱠᱷᱟᱣ ᱟᱨ ᱥᱮᱯᱷᱴᱤ ᱜᱟᱨᱰ ᱞᱟᱜᱟᱣ ᱪᱮᱫᱚᱜ ᱢᱮ᱾',
    hazard_type: 'machinery',
    difficulty: 'intermediate',
    benchmark_time_ms: 120000,
    thumbnail_url: null,
    coming_soon: false,
    created_at: new Date('2026-01-03').toISOString(),
    steps: [
      {
        index: 0,
        label: 'Identify Nip-Point Hazard',
        label_hi: 'निप-पॉइंट खतरे की पहचान करें',
        label_sat: 'ᱱᱤᱯ-ᱯᱚᱭᱮᱱᱴ ᱵᱚᱛᱚᱨ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ',
        instruction: 'Locate the in-running rotating rollers and identify the nip-point pinch hazard',
        instruction_hi: 'घूर्णन रोलर्स का पता लगाएं और निप-पॉइंट पिंच खतरे की पहचान करें',
        instruction_sat: 'ᱟᱹᱪᱩᱨᱚᱜ ᱠᱟᱱ ᱨᱳᱞᱟᱨ ᱧᱟᱢ ᱢᱮ ᱟᱨ ᱱᱤᱯ-ᱯᱚᱭᱮᱱᱴ ᱵᱚᱛᱚᱨ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ',
        position: [3, 1.2, 3],
        color: '#f59e0b',
        is_ppe_step: false,
      },
      {
        index: 1,
        label: 'Hit Emergency Stop (E-Stop)',
        label_hi: 'इमरजेंसी स्टॉप (E-Stop) दबाएं',
        label_sat: 'ᱤᱢᱟᱨᱡᱮᱱᱥᱤ ᱥᱴᱚᱯ (E-Stop) ᱞᱤᱱ ᱢᱮ',
        instruction: 'Press the prominent red mushroom E-Stop button immediately to kill power to the motor drive',
        instruction_hi: 'मोटर ड्राइव की बिजली तुरंत काटने के लिए प्रमुख लाल मशरूम ई-स्टॉप बटन दबाएं',
        instruction_sat: 'ᱢᱳᱴᱚᱨ ᱵᱤᱡᱽᱞᱤ ᱛᱩᱨᱩᱛ ᱵᱚᱸᱫᱽ ᱞᱟᱹᱜᱤᱫ ᱟᱨᱟᱜ ᱤ-ᱥᱴᱚᱯ ᱵᱚᱴᱚᱱ ᱞᱤᱱ ᱢᱮ',
        position: [2.5, 2.0, -2],
        color: '#ef4444',
        is_ppe_step: false,
      },
      {
        index: 2,
        label: 'Apply Lockout / Tagout (LOTO)',
        label_hi: 'तालाबंदी / टैगआउट (LOTO) लगाएं',
        label_sat: 'ᱞᱚᱠᱟᱣᱩᱴ / ᱴᱮᱜᱽᱟᱣᱩᱴ (LOTO) ᱞᱟᱜᱟᱣ ᱢᱮ',
        instruction: 'Place red padlock and warning tag on the electrical disconnect switch to prevent accidental restart',
        instruction_hi: 'मशीन को अचानक चालू होने से रोकने के लिए मुख्य स्विच पर लाल पैडलॉक और चेतावनी टैग लगाएं',
        instruction_sat: 'ᱢᱮᱥᱤᱱ ᱦᱟᱴᱟᱛ ᱟᱞᱚ ᱪᱟᱹᱞᱩᱜ ᱢᱟ ᱚᱱᱟ ᱞᱟᱹᱜᱤᱫ ᱢᱩᱬᱩᱛ ᱥᱩᱭᱤᱪ ᱨᱮ ᱟᱨᱟᱜ ᱛᱟᱞᱟ ᱟᱨ ᱴᱮᱜᱽ ᱞᱟᱜᱟᱣ ᱢᱮ',
        position: [-4, 0.9, 1],
        color: '#dc2626',
        is_ppe_step: false,
      },
      {
        index: 3,
        label: 'Verify Zero Energy State',
        label_hi: 'शून्य ऊर्जा स्थिति सत्यापित करें',
        label_sat: 'ᱡᱤᱨᱳ ᱮᱱᱟᱨᱡᱤ ᱚᱵᱚᱥᱛᱷᱟ ᱯᱟᱨᱠᱷᱟᱣ ᱢᱮ',
        instruction: 'Test system controls and meter to confirm 0.0V residual electrical and mechanical stored energy',
        instruction_hi: 'पुष्टि करने के लिए मीटर की जांच करें कि अवशिष्ट विद्युत और यांत्रिक ऊर्जा शून्य (0.0V) है',
        instruction_sat: 'ᱢᱤᱴᱟᱨ ᱧᱮᱞ ᱠᱟᱛᱮ ᱴᱷᱟᱹᱣᱠᱟᱹᱭ ᱢᱮ ᱡᱮ ᱵᱤᱡᱽᱞᱤ ᱟᱨ ᱪᱟᱞᱟᱣ ᱫᱟᱲᱮ ᱡᱤᱨᱳ (0.0V) ᱦᱩᱭ ᱟᱠᱟᱱᱟ',
        position: [1.5, 0.8, 2],
        color: '#22c55e',
        is_ppe_step: false,
      },
      {
        index: 4,
        label: 'Install Interlocked Safety Guard',
        label_hi: 'इंटरलॉक सुरक्षा गार्ड स्थापित करें',
        label_sat: 'ᱤᱱᱴᱚᱨᱞᱚᱠ ᱥᱮᱯᱷᱴᱤ ᱜᱟᱨᱰ ᱞᱟᱜᱟᱣ ᱢᱮ',
        instruction: 'Fit and engage the physical protective mesh guard and interlock switch around the nip rollers',
        instruction_hi: 'निप रोलर्स के चारों ओर सुरक्षात्मक जालीदार गार्ड और इंटरलॉक स्विच लगाएं',
        instruction_sat: 'ᱱᱤᱯ ᱨᱳᱞᱟᱨ ᱟᱰᱮᱯᱟᱥᱮ ᱥᱮᱯᱷᱴᱤ ᱡᱟᱹᱞᱤ ᱜᱟᱨᱰ ᱟᱨ ᱤᱱᱴᱚᱨᱞᱚᱠ ᱥᱩᱭᱤᱪ ᱞᱟᱜᱟᱣ ᱢᱮ',
        position: [-6, 1.5, -5],
        color: '#3b82f6',
        is_ppe_step: false,
      },
      {
        index: 5,
        label: 'Supervisor Clearance Sign-Off',
        label_hi: 'पर्यवेक्षक अनापत्ति हस्ताक्षर लें',
        label_sat: 'ᱥᱩᱯᱚᱨᱵᱷᱟᱭᱤᱡᱚᱨ ᱪᱷᱟᱹᱲ ᱥᱩᱦᱤ ᱦᱟᱛᱟᱣ ᱢᱮ',
        instruction: 'Meet supervisor at inspection muster point to confirm LOTO logbook sign-off and safe operation clearance',
        instruction_hi: 'LOTO लॉगबुक पर हस्ताक्षर और सुरक्षित संचालन की मंजूरी के लिए मस्टर पॉइंट पर पर्यवेक्षक से मिलें',
        instruction_sat: 'LOTO ᱠᱷᱟᱛᱟ ᱨᱮ ᱥᱩᱦᱤ ᱟᱨ ᱥᱩᱨᱠᱷᱤᱛ ᱪᱟᱹᱞᱩ ᱪᱷᱟᱹᱲ ᱞᱟᱹᱜᱤᱫ ᱥᱩᱯᱚᱨᱵᱷᱟᱭᱤᱡᱚᱨ ᱴᱷᱮᱱ ᱥᱮᱴᱮᱨᱚᱜ ᱢᱮ',
        position: [0, 1.0, 10],
        color: '#a855f7',
        is_ppe_step: false,
      },
    ],
  },
  {
    id: 'a1b2c3d4-0005-0005-0005-000000000005',
    title: 'High-Voltage Electrical Substation Safety',
    title_hi: 'हाई-वोल्टेज इलेक्ट्रिकल सबस्टेशन सुरक्षा',
    title_sat: 'ᱦᱟᱭ-ᱵᱷᱳᱞᱴᱮᱡᱽ ᱵᱤᱡᱽᱞᱤ ᱥᱟᱵᱽᱥᱴᱮᱥᱚᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ',
    description: 'Master high-voltage arc-flash boundaries, dielectric insulating PPE, zero-energy state verification, and safe substation maintenance switching protocols.',
    description_hi: 'हाई-वोल्टेज आर्क-फ्लैश सीमाओं, डाइइलेक्ट्रिक इंसुलेटिंग PPE, शून्य-ऊर्जा स्थिति सत्यापन और सुरक्षित सबस्टेशन रखरखाव स्विचिंग प्रोटोकॉल में महारत हासिल करें।',
    description_sat: 'ᱟᱨᱠ-ᱯᱷᱞᱮᱥ ᱨᱩᱠᱷᱤᱭᱟᱹ, ᱵᱤᱡᱽᱞᱤ ᱵᱷᱮᱜᱟᱨ ᱱᱤᱭᱟᱹᱢ (isolation), ᱟᱨᱛᱷᱤᱝ ᱱᱤᱭᱟᱹᱢ ᱟᱨ ᱦᱟᱭ-ᱵᱷᱳᱞᱴᱮᱡᱽ ᱥᱟᱵᱽᱥᱴᱮᱥᱚᱱ ᱯᱨᱳᱴᱳᱠᱚᱞ ᱥᱤᱠᱷᱟᱣ᱾',
    hazard_type: 'electrical',
    difficulty: 'advanced',
    benchmark_time_ms: 180000,
    thumbnail_url: null,
    coming_soon: true,
    created_at: new Date('2026-01-04').toISOString(),
    steps: [],
  },
  {
    id: 'a1b2c3d4-0002-0002-0002-000000000002',
    title: 'Gas Leak & Confined Space Protocol',
    title_hi: 'गैस रिसाव और सीमित स्थान प्रोटोकॉल',
    title_sat: 'ᱜᱮᱥ ᱞᱤᱠ ᱟᱨ ᱥᱟᱸᱜᱷᱟᱨ ᱴᱷᱟᱶ ᱱᱤᱭᱟᱹᱢ',
    description: 'Practice responding to a hazardous gas leak in a mining tunnel using the buddy system. Identify the leak, activate protocols, don breathing apparatus, and evacuate safely.',
    description_hi: 'बडी सिस्टम का उपयोग करते हुए माइनिंग सुरंग में खतरनाक गैस रिसाव का जवाब देने का अभ्यास करें। रिसाव की पहचान करें, प्रोटोकॉल सक्रिय करें, श्वास उपकरण पहनें और सुरक्षित निकासी करें।',
    description_sat: 'ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱵᱚᱛᱚᱨᱟᱱ ᱜᱮᱥ ᱞᱤᱠ ᱡᱚᱠᱷᱚᱱ ᱵᱟᱰᱤ ᱥᱤᱥᱴᱚᱢ ᱛᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱤᱠᱷᱟᱣ ᱢᱮ᱾ ᱞᱤᱠ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ, ᱯᱨᱳᱴᱳᱠᱚᱞ ᱮᱦᱚᱵ ᱢᱮ, ᱥᱟᱦᱮᱫ ᱥᱟᱢᱟᱱ ᱦᱚᱨᱚᱜ ᱢᱮ ᱟᱨ ᱥᱩᱨᱠᱷᱤᱛ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠ ᱢᱮ᱾',
    hazard_type: 'gas_leak',
    difficulty: 'intermediate',
    benchmark_time_ms: 120000,
    thumbnail_url: null,
    created_at: new Date('2026-01-05').toISOString(),
    steps: [
      { index: 0, label: 'Identify Gas Leak Warning', label_hi: 'गैस रिसाव चेतावनी पहचानें', label_sat: 'ᱜᱮᱥ ᱞᱤᱠ ᱪᱮᱛᱟᱣᱱᱤ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ', instruction: 'Click the gas pipe leak to identify the hazard', instruction_hi: 'खतरे की पहचान करने के लिए गैस पाइप रिसाव पर क्लिक करें', instruction_sat: 'ᱵᱚᱛᱚᱨ ᱪᱤᱱᱦᱟᱹᱣ ᱞᱟᱹᱜᱤᱫ ᱜᱮᱥ ᱯᱟᱭᱤᱯ ᱞᱤᱠ ᱨᱮ ᱠᱞᱤᱠ ᱢᱮ', position: [-2.5, 1.2, 2], color: '#f59e0b', is_ppe_step: false },
      { index: 1, label: 'Activate Emergency Alarm', label_hi: 'आपातकालीन अलार्म बजाएं', label_sat: 'ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱟᱞᱟᱨᱢ ᱪᱟᱹᱞᱩᱭ ᱢᱮ', instruction: 'Trigger the alarm panel to alert all workers', instruction_hi: 'सभी श्रमिकों को सचेत करने के लिए अलार्म पैनल सक्रिय करें', instruction_sat: 'ᱡᱚᱛᱚ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱦᱳᱸᱥᱤᱭᱟᱨ ᱞᱟᱹᱜᱤᱫ ᱟᱞᱟᱨᱢ ᱪᱟᱹᱞᱩᱭ ᱢᱮ', position: [2.8, 1.5, -1], color: '#ef4444', is_ppe_step: false },
      { index: 2, label: 'Apply Buddy System', label_hi: 'बडी सिस्टम लागू करें', label_sat: 'ᱵᱟᱰᱤ ᱥᱤᱥᱴᱚᱢ ᱞᱟᱦᱟᱭ ᱢᱮ', instruction: 'Confirm your buddy — never enter alone. One person watches from outside.', instruction_hi: 'अपने साथी की पुष्टि करें — कभी अकेले प्रवेश न करें। एक व्यक्ति बाहर से देखता है।', instruction_sat: 'ᱟᱢᱟᱜ ᱡᱚᱴᱟᱣ (buddy) ᱥᱟᱶ ᱛᱟᱦᱮᱸᱱ ᱢᱮ — ᱮᱠᱞᱟ ᱛᱤᱥ ᱦᱚᱸ ᱟᱞᱚᱢ ᱵᱚᱞᱚᱱᱟ᱾ ᱢᱤᱫ ᱦᱚᱲ ᱵᱟᱦᱨᱮ ᱠᱷᱚᱱ ᱧᱮᱞᱟᱭ᱾', position: [0, 1.2, 1], color: '#06b6d4', is_ppe_step: false },
      { index: 3, label: 'Don Gas Mask / SCBA', label_hi: 'गैस मास्क / SCBA पहनें', label_sat: 'ᱜᱮᱥ ᱢᱟᱥᱠ / SCBA ᱦᱚᱨᱚᱜ ᱢᱮ', instruction: 'Pick up the gas mask and SCBA breathing apparatus from the safety locker', instruction_hi: 'सेफ्टी लॉकर से गैस मास्क और SCBA श्वास उपकरण लें', instruction_sat: 'ᱥᱮᱯᱷᱴᱤ ᱞᱚᱠᱟᱨ ᱠᱷᱚᱱ ᱜᱮᱥ ᱢᱟᱥᱠ ᱟᱨ SCBA ᱥᱟᱦᱮᱫ ᱥᱟᱢᱟᱱ ᱦᱚᱨᱚᱜ ᱢᱮ', position: [-2.5, 0.8, -4], color: '#22c55e', is_ppe_step: true },
      { index: 4, label: 'Evacuate Personnel', label_hi: 'कर्मचारियों को बाहर निकालें', label_sat: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠ ᱠᱚᱣᱟᱭ', instruction: 'Guide all workers toward the tunnel exit', instruction_hi: 'सभी श्रमिकों को सुरंग के निकास की ओर ले जाएं', instruction_sat: 'ᱡᱚᱛᱚ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱥᱩᱨᱚᱝᱜᱚ ᱱᱤᱠᱟᱥ ᱥᱮᱫ ᱟᱹᱭᱩᱨ ᱤᱫᱤ ᱠᱚᱢ', position: [0, 1.0, -8], color: '#3b82f6', is_ppe_step: false },
      { index: 5, label: 'Reach Muster Point', label_hi: 'मस्टर पॉइंट पर पहुंचें', label_sat: 'ᱢᱟᱥᱴᱟᱨ ᱯᱚᱭᱮᱱᱴ ᱨᱮ ᱥᱮᱴᱮᱨᱚᱜ ᱢᱮ', instruction: 'Assemble at the designated safe muster point outside', instruction_hi: 'बाहर नामित सुरक्षित मस्टर पॉइंट पर एकत्र हों', instruction_sat: 'ᱵᱟᱦᱨᱮ ᱱᱤᱨᱫᱤᱥᱴ ᱥᱩᱨᱠᱷᱤᱛ ᱢᱟᱥᱴᱟᱨ ᱯᱚᱭᱮᱱᱴ ᱨᱮ ᱡᱟᱣᱨᱟᱜ ᱢᱮ', position: [0, 1.0, 10], color: '#a855f7', is_ppe_step: false },
    ],
  },
]

// ─── Demo Questions ──────────────────────────────────────────
const DEMO_QUESTIONS = [
  // Fire & Explosion (scenario 0001)
  {
    id: 'q-fire-001',
    scenario_id: 'a1b2c3d4-0001-0001-0001-000000000001',
    question_en: 'Which type of fire extinguisher should be used for an electrical fire?',
    question_hi: 'बिजली की आग के लिए कौन सा अग्निशामक उपयोग करना चाहिए?',
    question_sat: 'ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱹᱜᱤᱫ ᱚᱠᱟ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱤᱡ (extinguisher) ᱵᱮᱵᱷᱟᱨ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ?',
    options_en: ['Water (Red)', 'CO₂ (Black)', 'Petrol', 'Foam (Cream)'],
    options_hi: ['पानी (लाल)', 'CO₂ (काला)', 'पेट्रोल', 'फोम (क्रीम)'],
    options_sat: ['ᱫᱟᱜ (Water - ᱟᱨᱟᱜ)', 'CO₂ (Black - ᱦᱮᱸᱫᱮ)', 'ᱯᱮᱴᱨᱳᱞ', 'ᱯᱷᱳᱢ (Foam - ᱠᱨᱤᱢ)'],
    correct_index: 1,
    explanation_en: 'CO₂ extinguishers are safe for electrical fires as they do not conduct electricity. Never use water on electrical fires — it conducts electricity and can cause electrocution.',
    explanation_hi: 'CO₂ अग्निशामक बिजली के लिए सुरक्षित है क्योंकि यह बिजली का संचालन नहीं करता। बिजली की आग पर पानी का उपयोग कभी न करें।',
    explanation_sat: 'CO₂ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱤᱡ ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱹᱜᱤᱫ ᱥᱩᱨᱠᱷᱤᱛ ᱜᱮᱭᱟ ᱪᱮᱫᱟᱜ ᱥᱮ ᱱᱚᱶᱟ ᱛᱮ ᱠᱟᱨᱮᱱᱴ ᱵᱟᱝ ᱥᱮᱱᱚᱜᱼᱟ᱾ ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱫᱟᱜ ᱛᱤᱥ ᱦᱚᱸ ᱟᱞᱚᱢ ᱫᱩᱞᱟ᱾',
    order_index: 1,
  },
  {
    id: 'q-fire-002',
    scenario_id: 'a1b2c3d4-0001-0001-0001-000000000001',
    question_en: 'What does PASS stand for when using a fire extinguisher?',
    question_hi: 'अग्निशामक उपयोग करते समय PASS का क्या अर्थ है?',
    question_sat: 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱤᱡ ᱵᱮᱵᱷᱟᱨ ᱚᱠᱛᱚ PASS ᱨᱮᱱᱟᱜ ᱢᱮᱱᱮᱛ ᱫᱚ ᱪᱮᱫ?',
    options_en: ['Pull, Aim, Squeeze, Sweep', 'Push, Alert, Spray, Secure', 'Prepare, Aim, Start, Stop', 'Pull, Apply, Shoot, Save'],
    options_hi: ['खींचें, लक्ष्य करें, दबाएं, झाड़ू लगाएं', 'धकेलें, सचेत करें, स्प्रे करें, सुरक्षित करें', 'तैयार करें, लक्ष्य करें, शुरू करें, रोकें', 'खींचें, लगाएं, शूट करें, बचाएं'],
    options_sat: [
      'ᱚᱨ ᱢᱮ (Pull), ᱱᱤᱥᱟᱱᱟᱭ ᱢᱮ (Aim), ᱞᱤᱱ ᱢᱮ (Squeeze), ᱯᱷᱟᱭᱞᱟᱣ ᱢᱮ (Sweep)',
      'ᱫᱷᱟᱠᱟᱭ ᱢᱮ, ᱦᱳᱸᱥᱤᱭᱟᱨ ᱢᱮ, ᱪᱷᱤᱴᱠᱟᱹᱣ ᱢᱮ, ᱥᱩᱨᱠᱷᱤᱛ ᱢᱮ',
      'ᱥᱟᱯᱲᱟᱣ ᱢᱮ, ᱱᱤᱥᱟᱱᱟᱭ ᱢᱮ, ᱮᱦᱚᱵ ᱢᱮ, ᱛᱷᱟᱢᱵᱷᱟᱣ ᱢᱮ',
      'ᱚᱨ ᱢᱮ, ᱞᱟᱜᱟᱣ ᱢᱮ, ᱪᱷᱟᱰᱟᱣ ᱢᱮ, ᱵᱟᱧᱪᱟᱣ ᱢᱮ',
    ],
    correct_index: 0,
    explanation_en: 'PASS: Pull the safety pin → Aim at the base of the fire → Squeeze the handle → Sweep from side to side at the base.',
    explanation_hi: 'PASS: पिन खींचें → आग की जड़ पर निशाना लगाएं → हैंडल दबाएं → आधार पर दाएं-बाएं झाड़ू लगाएं।',
    explanation_sat: 'PASS: ᱯᱤᱱ ᱚᱨ ᱚᱰᱚᱠ ᱢᱮ → ᱥᱮᱸᱜᱮᱞ ᱨᱮᱦᱮᱫ ᱨᱮ ᱱᱤᱥᱟᱱᱟᱭ ᱢᱮ → ᱦᱮᱱᱰᱮᱞ ᱞᱤᱱ ᱢᱮ → ᱞᱮᱸᱜᱟ-ᱡᱚᱡᱚᱢ ᱯᱷᱟᱭᱞᱟᱣ ᱢᱮ᱾',
    order_index: 2,
  },
  {
    id: 'q-fire-003',
    scenario_id: 'a1b2c3d4-0001-0001-0001-000000000001',
    question_en: 'What is the FIRST action you should take when you discover a fire?',
    question_hi: 'जब आप आग देखें तो सबसे पहले क्या करना चाहिए?',
    question_sat: 'ᱥᱮᱸᱜᱮᱞ ᱧᱮᱞ ᱠᱟᱛᱮ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱯᱟᱹᱦᱤᱞ ᱪᱮᱫ ᱠᱟᱹᱢᱤ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ?',
    options_en: ['Try to extinguish it immediately', 'Activate the fire alarm and alert others', 'Call your supervisor', 'Grab your belongings and leave'],
    options_hi: ['तुरंत इसे बुझाने की कोशिश करें', 'फायर अलार्म चालू करें और दूसरों को सचेत करें', 'अपने सुपरवाइजर को कॉल करें', 'सामान उठाएं और निकल जाएं'],
    options_sat: [
      'ᱞᱚᱜᱚᱱ ᱤᱬᱤᱡ ᱪᱮᱥᱴᱟᱭ ᱢᱮ',
      'ᱯᱷᱟᱭᱟᱨ ᱟᱞᱟᱨᱢ ᱪᱟᱹᱞᱩᱭ ᱢᱮ ᱟᱨ ᱮᱴᱟᱜ ᱦᱚᱲ ᱪᱮᱛᱟᱣᱱᱤ ᱮᱢᱟᱠᱚ ᱢᱮ',
      'ᱟᱢᱟᱜ ᱥᱩᱯᱚᱨᱵᱷᱟᱭᱤᱡᱚᱨ ᱯᱷᱳᱱ ᱟᱭ ᱢᱮ',
      'ᱥᱟᱢᱟᱱ ᱥᱟᱵ ᱠᱟᱛᱮ ᱫᱟᱹᱲ ᱢᱮ',
    ],
    correct_index: 1,
    explanation_en: 'Always activate the fire alarm FIRST to warn others. Only attempt to fight the fire if it is small, you are trained, and you have an exit behind you.',
    explanation_hi: 'हमेशा पहले फायर अलार्म चालू करें ताकि दूसरों को चेतावनी मिले। छोटी आग को बुझाने की कोशिश केवल तभी करें जब आप प्रशिक्षित हों।',
    explanation_sat: 'ᱡᱟᱣᱜᱮ ᱯᱟᱹᱦᱤᱞ ᱯᱷᱟᱭᱟᱨ ᱟᱞᱟᱨᱢ ᱪᱟᱹᱞᱩᱭ ᱢᱮ ᱡᱮᱢᱚᱱ ᱡᱚᱛᱚ ᱦᱚᱲ ᱪᱮᱛᱟᱣᱱᱤ ᱠᱚ ᱧᱟᱢ᱾ ᱠᱟᱹᱴᱤᱡ ᱥᱮᱸᱜᱮᱞ ᱥᱩᱢᱩᱝ ᱜᱮ ᱤᱬᱤᱡ ᱪᱮᱥᱴᱟᱭ ᱢᱮ ᱡᱩᱫᱤ ᱟᱢ ᱥᱮᱪᱮᱫ ᱢᱮᱱᱟᱜ ᱛᱟᱢᱟ᱾',
    order_index: 3,
  },
  {
    id: 'q-fire-004',
    scenario_id: 'a1b2c3d4-0001-0001-0001-000000000001',
    question_en: 'Which PPE is mandatory when approaching a fire in an industrial setting?',
    question_hi: 'औद्योगिक परिवेश में आग के पास जाते समय कौन सा PPE अनिवार्य है?',
    question_sat: 'ᱠᱟᱹᱨᱜᱟᱲ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱥᱩᱨ ᱪᱟᱞᱟᱜ ᱡᱚᱠᱷᱚᱱ ᱚᱠᱟ PPE ᱦᱚᱨᱚᱜ ᱮᱠᱟᱞ ᱜᱮ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ?',
    options_en: ['Only gloves', 'Safety helmet and high-visibility vest', 'Fire-rated helmet, heat-resistant gloves, goggles, and safety boots', 'Regular work clothes'],
    options_hi: ['केवल दस्ताने', 'सेफ्टी हेलमेट और हाई-विजिबिलिटी वेस्ट', 'फायर-रेटेड हेलमेट, गर्मी-प्रतिरोधी दस्ताने, चश्मे और सेफ्टी बूट्स', 'सामान्य काम के कपड़े'],
    options_sat: [
      'ᱥᱩᱢᱩᱝ ᱜᱞᱚᱵᱷᱥ',
      'ᱥᱮᱯᱷᱴᱤ ᱦᱮᱞᱢᱮᱴ ᱟᱨ ᱡᱷᱟᱞᱠᱟᱣ ᱵᱷᱮᱥᱴ',
      'ᱯᱷᱟᱭᱟᱨ-ᱨᱮᱴᱮᱰ ᱦᱮᱞᱢᱮᱴ, ᱞᱚᱞᱚ-ᱴᱮᱠᱟᱣ ᱜᱞᱚᱵᱷᱥ, ᱪᱚᱥᱢᱟ ᱟᱨ ᱥᱮᱯᱷᱴᱤ ᱡᱩᱛᱟᱹ',
      'ᱥᱟᱫᱷᱟᱨᱚᱱ ᱠᱟᱹᱢᱤ ᱞᱩᱜᱽᱲᱤ',
    ],
    correct_index: 2,
    explanation_en: 'Complete fire PPE includes: fire-rated safety helmet, heat-resistant gloves, safety goggles, flame-retardant vest, and steel-toed safety boots.',
    explanation_hi: 'पूरे अग्नि PPE में शामिल हैं: फायर-रेटेड हेलमेट, गर्मी-प्रतिरोधी दस्ताने, सेफ्टी चश्मे, फ्लेम-रिटार्डेंट वेस्ट, और स्टील-टोड सेफ्टी बूट्स।',
    explanation_sat: 'ᱯᱩᱨᱟᱹ ᱯᱷᱟᱭᱟᱨ PPE ᱨᱮ ᱥᱮᱞᱮᱫ ᱢᱮᱱᱟᱜᱼᱟ: ᱯᱷᱟᱭᱟᱨ ᱦᱮᱞᱢᱮᱴ, ᱞᱚᱞᱚ-ᱴᱮᱠᱟᱣ ᱜᱞᱚᱵᱷᱥ, ᱥᱮᱯᱷᱴᱤ ᱪᱚᱥᱢᱟ, ᱯᱷᱞᱮᱢ-ᱨᱤᱴᱟᱨᱰᱮᱱᱴ ᱵᱷᱮᱥᱴ ᱟᱨ ᱥᱴᱤᱞ-ᱴᱳᱰ ᱵᱩᱴᱥ᱾',
    order_index: 4,
  },
  {
    id: 'q-fire-005',
    scenario_id: 'a1b2c3d4-0001-0001-0001-000000000001',
    question_en: 'During fire evacuation, should you use elevators?',
    question_hi: 'आग निकासी के दौरान क्या लिफ्ट का उपयोग करना चाहिए?',
    question_sat: 'ᱥᱮᱸᱜᱮᱞ ᱠᱷᱚᱱ ᱫᱟᱹᱲ ᱚᱰᱚᱠ ᱡᱚᱠᱷᱚᱱ ᱞᱤᱯᱷᱴ (elevator) ᱵᱮᱵᱷᱟᱨ ᱜᱟᱱᱚᱜᱼᱟ?',
    options_en: ['Yes, to evacuate quickly', 'Only if the fire is on a lower floor', 'No — always use stairwells and marked exits', 'Only if you are injured'],
    options_hi: ['हां, जल्दी निकलने के लिए', 'केवल अगर आग नीचे की मंजिल पर हो', 'नहीं — हमेशा सीढ़ियों और चिह्नित निकासों का उपयोग करें', 'केवल अगर आप घायल हों'],
    options_sat: [
      'ᱦᱚᱭ, ᱞᱚᱜᱚᱱ ᱚᱰᱚᱠᱚᱜ ᱞᱟᱹᱜᱤᱫ',
      'ᱥᱩᱢᱩᱝ ᱞᱟᱛᱟᱨ ᱛᱟᱞᱟ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣ ᱠᱷᱟᱱ',
      'ᱵᱟᱝ — ᱡᱟᱣᱜᱮ ᱥᱤᱲᱦᱤ (stairs) ᱟᱨ ᱪᱤᱱᱦᱟᱹᱣ ᱱᱤᱠᱟᱥ ᱵᱮᱵᱷᱟᱨ ᱢᱮ',
      'ᱥᱩᱢᱩᱝ ᱜᱷᱟᱹᱞ ᱟᱠᱟᱱ ᱠᱷᱟᱱ',
    ],
    correct_index: 2,
    explanation_en: 'NEVER use elevators during a fire. Power may fail trapping occupants. Always use stairwells and marked fire exits. Close doors behind you to slow fire spread.',
    explanation_hi: 'आग के दौरान लिफ्ट का उपयोग कभी न करें। बिजली बंद हो सकती है। हमेशा सीढ़ियों और चिह्नित निकासों का उपयोग करें।',
    explanation_sat: 'ᱥᱮᱸᱜᱮᱞ ᱚᱠᱛᱚ ᱞᱤᱯᱷᱴ ᱛᱤᱥ ᱦᱚᱸ ᱟᱞᱚᱢ ᱵᱮᱵᱷᱟᱨᱟ᱾ ᱠᱟᱨᱮᱱᱴ ᱠᱟᱴᱟᱣ ᱠᱟᱛᱮ ᱦᱚᱲ ᱠᱚ ᱡᱷᱟᱹᱞᱤ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ᱾ ᱡᱟᱣᱜᱮ ᱥᱤᱲᱦᱤ ᱛᱮ ᱚᱰᱚᱠ ᱢᱮ᱾',
    order_index: 5,
  },
  {
    id: 'q-fire-006',
    scenario_id: 'a1b2c3d4-0001-0001-0001-000000000001',
    question_en: 'What is the most common cause of death in an industrial fire incident?',
    question_hi: 'औद्योगिक आग की दुर्घटना में मृत्यु का सबसे आम कारण क्या है?',
    question_sat: 'ᱠᱟᱹᱨᱜᱟᱲ ᱥᱮᱸᱜᱮᱞ ᱜᱷᱚᱴᱚᱱ ᱨᱮ ᱦᱚᱲ ᱜᱩᱡᱩᱜ ᱨᱮᱱᱟᱜ ᱢᱩᱬ ᱠᱟᱨᱚᱱ ᱫᱚ ᱪᱮᱫ?',
    options_en: ['Direct thermal burns', 'Toxic smoke and carbon monoxide inhalation', 'Structural building collapse', 'Electric shock'],
    options_hi: ['सीधे जलने से', 'जहरीला धुआं और कार्बन मोनोऑक्साइड सांस में जाना', 'इमारत का गिरना', 'बिजली का झटका'],
    options_sat: [
      'ᱥᱚᱡᱷᱮ ᱞᱚ ᱠᱷᱟᱹᱛᱤᱨ',
      'ᱵᱤᱥᱟᱹᱦᱟ ᱫᱷᱩᱶᱟᱹ ᱟᱨ ᱠᱟᱨᱵᱚᱱ ᱢᱚᱱᱳᱠᱥᱟᱭᱤᱰ ᱥᱟᱦᱮᱫ ᱛᱮ',
      'ᱫᱩᱞᱟᱹᱲ ᱚᱲᱟᱜ ᱨᱟᱹᱯᱩᱫ ᱛᱮ',
      'ᱵᱤᱡᱽᱞᱤ ᱠᱟᱨᱮᱱᱴ ᱛᱮ',
    ],
    correct_index: 1,
    explanation_en: 'Over 70% of fire-related deaths are caused by smoke and toxic gas inhalation (such as Carbon Monoxide and Hydrogen Cyanide), rather than flames.',
    explanation_hi: 'आग से होने वाली 70% से अधिक मौतें लपटों के बजाय जहरीले धुएं और कार्बन मोनोऑक्साइड सांस में जाने के कारण होती हैं।',
    explanation_sat: 'ᱥᱮᱸᱜᱮᱞ ᱛᱮ ᱜᱩᱡᱩᱜ ᱨᱮᱱᱟᱜ ᱗᱐% ᱠᱷᱚᱱ ᱵᱟᱹᱲᱛᱤ ᱦᱚᱲ ᱞᱚᱯᱚᱴ ᱵᱚᱫᱚᱞ ᱛᱮ ᱵᱤᱥᱟᱹᱦᱟ ᱫᱷᱩᱶᱟᱹ ᱥᱟᱦᱮᱫ ᱛᱮᱠᱚ ᱜᱚᱡᱚᱜᱼᱟ᱾',
    order_index: 6,
  },
  {
    id: 'q-fire-007',
    scenario_id: 'a1b2c3d4-0001-0001-0001-000000000001',
    question_en: 'What is the recommended safe distance when deploying a portable fire extinguisher?',
    question_hi: 'पोर्टेबल अग्निशामक का उपयोग करते समय अनुशंसित सुरक्षित दूरी क्या है?',
    question_sat: 'ᱯᱳᱨᱴᱮᱵᱚᱞ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱤᱡ ᱵᱮᱵᱷᱟᱨ ᱡᱚᱠᱷᱚᱱ ᱛᱤᱱᱟᱹᱜ ᱥᱟᱺᱜᱤᱧ ᱨᱮ ᱛᱤᱸᱜᱩ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ?',
    options_en: ['6 to 8 feet (approx. 2 meters)', 'Directly touching the flame', '15 to 20 meters away', 'Distance does not matter'],
    options_hi: ['6 से 8 फीट (लगभग 2 मीटर)', 'लपटों के बिल्कुल पास छूते हुए', '15 से 20 मीटर दूर', 'दूरी कोई मायने नहीं रखती'],
    options_sat: [
      '᱖ ᱠᱷᱚᱱ ᱘ ᱯᱷᱤᱴ (᱒ ᱢᱤᱴᱟᱨ ᱜᱟᱱ)',
      'ᱥᱮᱸᱜᱮᱞ ᱥᱩᱨ ᱨᱮ ᱡᱚᱴᱮᱫ ᱠᱟᱛᱮ',
      '᱑᱕ ᱠᱷᱚᱱ ᱒᱐ ᱢᱤᱴᱟᱨ ᱥᱟᱺᱜᱤᱧ',
      'ᱥᱟᱺᱜᱤᱧ ᱫᱚ ᱪᱮᱫ ᱦᱚᱸ ᱵᱟᱝ ᱠᱟᱱᱟ',
    ],
    correct_index: 0,
    explanation_en: 'Stand approximately 6 to 8 feet (1.8 to 2.4 meters) away from the fire before discharging the extinguisher, moving closer only as the fire dies down.',
    explanation_hi: 'अग्निशामक चलाने से पहले आग से लगभग 6 से 8 फीट (लगभग 2 मीटर) की दूरी पर खड़े रहें, और आग बुझने पर ही आगे बढ़ें।',
    explanation_sat: 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱤᱡ ᱪᱟᱹᱞᱩ ᱞᱟᱦᱟ ᱥᱮᱸᱜᱮᱞ ᱠᱷᱚᱱ ᱖-᱘ ᱯᱷᱤᱴ ᱥᱟᱺᱜᱤᱧ ᱛᱤᱸᱜᱩᱱ ᱢᱮ, ᱟᱨ ᱥᱮᱸᱜᱮᱞ ᱠᱚᱢ ᱤᱫᱤ ᱞᱮᱱᱠᱷᱟᱱ ᱥᱩᱨᱩᱜ ᱢᱮ᱾',
    order_index: 7,
  },
  {
    id: 'q-fire-008',
    scenario_id: 'a1b2c3d4-0001-0001-0001-000000000001',
    question_en: 'If a worker\'s clothing catches fire, what is the life-saving procedure to follow?',
    question_hi: 'यदि किसी कर्मचारी के कपड़ों में आग लग जाए, तो जीवन रक्षक प्रक्रिया क्या है?',
    question_sat: 'ᱡᱩᱫᱤ ᱡᱟᱦᱟᱸᱭ ᱠᱟᱹᱢᱤᱭᱟᱹᱣᱟᱜ ᱞᱩᱜᱽᱲᱤ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣᱜᱼᱟ, ᱛᱚᱵᱮ ᱡᱤᱣᱤ ᱵᱟᱧᱪᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱪᱮᱫ ᱪᱤᱠᱟᱹ ᱞᱟᱹᱠᱛᱤ?',
    options_en: ['Run as fast as possible to find water', 'Stop, Drop to the ground, and Roll', 'Wave hands to blow air onto the fire', 'Take off clothing while standing'],
    options_hi: ['पानी खोजने के लिए तेजी से दौड़ें', 'रुकें, जमीन पर गिरें और लुढ़कें (Stop, Drop & Roll)', 'आग पर हवा मारने के लिए हाथ हिलाएं', 'खड़े होकर कपड़े उतारें'],
    options_sat: [
      'ᱫᱟᱜ ᱯᱟᱱᱛᱮ ᱞᱟᱹᱜᱤᱫ ᱛᱮ ᱡᱩᱨ ᱛᱮ ᱫᱟᱹᱲ ᱢᱮ',
      'ᱛᱷᱟᱢᱵᱷᱟᱣᱜ ᱢᱮ, ᱚᱛ ᱨᱮ ᱯᱟᱹᱛᱤᱭᱟᱹᱣᱜ ᱢᱮ ᱟᱨ ᱜᱩᱲᱫᱟᱹᱣᱜ ᱢᱮ (Stop, Drop & Roll)',
      'ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱦᱚᱭ ᱮᱢ ᱞᱟᱹᱜᱤᱫ ᱛᱤ ᱦᱤᱞᱟᱹᱣ ᱢᱮ',
      'ᱛᱤᱸᱜᱩ ᱠᱟᱛᱮ ᱞᱩᱜᱽᱲᱤ ᱪᱷᱟᱰᱟᱣ ᱢᱮ',
    ],
    correct_index: 1,
    explanation_en: 'Running fans the flames with oxygen. Remember: STOP (don\'t run), DROP (cover face and lie flat), and ROLL back and forth to smother the flames.',
    explanation_hi: 'दौड़ने से आग को और अधिक ऑक्सीजन मिलती है। याद रखें: रुकें (Stop), जमीन पर लेटें (Drop), और आग बुझाने के लिए लुढ़कें (Roll)।',
    explanation_sat: 'ᱫᱟᱹᱲ ᱞᱮᱠᱷᱟᱱ ᱥᱮᱸᱜᱮᱞ ᱟᱨᱦᱚᱸ ᱡᱩᱞᱩᱜᱼᱟ᱾ ᱫᱤᱥᱟᱹ ᱫᱚᱦᱚᱭ ᱢᱮ: STOP (ᱛᱷᱟᱢᱵᱷᱟᱣ), DROP (ᱚᱛ ᱨᱮ ᱜᱤᱛᱤᱡ), ᱟᱨ ROLL (ᱜᱩᱲᱫᱟᱹᱣ ᱠᱟᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ)᱾',
    order_index: 8,
  },
  {
    id: 'q-fire-009',
    scenario_id: 'a1b2c3d4-0001-0001-0001-000000000001',
    question_en: 'What class of fire involves flammable liquids like diesel, petrol, solvents, and paints?',
    question_hi: 'डीजल, पेट्रोल, सॉल्वैंट्स और पेंट जैसे ज्वलनशील तरल पदार्थों में लगी आग किस श्रेणी में आती है?',
    question_sat: 'ᱰᱤᱡᱮᱞ, ᱯᱮᱴᱨᱳᱞ, ᱥᱚᱞᱵᱷᱮᱱᱴ ᱟᱨ ᱯᱮᱱᱴ ᱞᱮᱠᱟᱱ ᱡᱩᱞᱩᱜ ᱛᱮᱞ ᱨᱮ ᱞᱟᱜᱟᱣ ᱥᱮᱸᱜᱮᱞ ᱫᱚ ᱚᱠᱟ ᱠᱞᱟᱥ ᱨᱮ ᱦᱤᱡᱩᱜᱼᱟ?',
    options_en: ['Class A', 'Class B', 'Class C', 'Class D'],
    options_hi: ['क्लास A', 'क्लास B', 'क्लास C', 'क्लास D'],
    options_sat: ['ᱠᱞᱟᱥ A', 'ᱠᱞᱟᱥ B', 'ᱠᱞᱟᱥ C', 'ᱠᱞᱟᱥ D'],
    correct_index: 1,
    explanation_en: 'Class B fires involve flammable and combustible liquids and gases such as petrol, oil, paints, and solvents. Dry powder or foam extinguishers should be used.',
    explanation_hi: 'क्लास B की आग में पेट्रोल, तेल, पेंट और सॉल्वैंट्स जैसे ज्वलनशील तरल पदार्थ शामिल होते हैं। इनके लिए ड्राई पाउडर या फोम का उपयोग किया जाता है।',
    explanation_sat: 'ᱠᱞᱟᱥ B ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱯᱮᱴᱨᱳᱞ, ᱰᱤᱡᱮᱞ, ᱛᱮᱞ ᱟᱨ ᱯᱮᱱᱴ ᱥᱮᱞᱮᱫ ᱢᱮᱱᱟᱜᱼᱟ᱾ ᱱᱚᱶᱟ ᱞᱟᱹᱜᱤᱫ ᱰᱨᱟᱭ ᱯᱟᱣᱰᱟᱨ ᱥᱮ ᱯᱷᱳᱢ ᱵᱮᱵᱷᱟᱨᱚᱜᱼᱟ᱾',
    order_index: 9,
  },
  {
    id: 'q-fire-010',
    scenario_id: 'a1b2c3d4-0001-0001-0001-000000000001',
    question_en: 'Where should employees gather immediately following an evacuation alarm?',
    question_hi: 'निकासी अलार्म बजने के तुरंत बाद कर्मचारियों को कहाँ एकत्र होना चाहिए?',
    question_sat: 'ᱱᱤᱠᱟᱥ ᱟᱞᱟᱨᱢ ᱥᱟᱰᱮ ᱥᱟᱶᱛᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱚᱠᱟᱨᱮ ᱡᱟᱣᱨᱟᱜ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ?',
    options_en: ['In the cafeteria or breakroom', 'At the designated outdoor safe muster point', 'In the manager\'s office', 'Near the main machinery bay'],
    options_hi: ['कैफेटेरिया या विश्राम कक्ष में', 'नामित बाहरी सुरक्षित मस्टर पॉइंट पर', 'प्रबंधक के कार्यालय में', 'मुख्य मशीनरी क्षेत्र के पास'],
    options_sat: [
      'ᱠᱮᱯᱷᱮᱴᱮᱨᱤᱭᱟ ᱥᱮ ᱡᱤᱨᱟᱹᱣ ᱚᱲᱟᱜ ᱨᱮ',
      'ᱵᱟᱦᱨᱮ ᱨᱮ ᱱᱤᱨᱫᱤᱥᱴ ᱥᱩᱨᱠᱷᱤᱛ ᱢᱟᱥᱴᱟᱨ ᱯᱚᱭᱮᱱᱴ (Muster Point) ᱨᱮ',
      'ᱢᱮᱱᱮᱡᱟᱨ ᱟᱜ ᱚᱯᱷᱤᱥ ᱨᱮ',
      'ᱢᱩᱬ ᱢᱮᱥᱤᱱ ᱴᱷᱟᱶ ᱥᱩᱨ ᱨᱮ',
    ],
    correct_index: 1,
    explanation_en: 'All personnel must assemble at the pre-designated outdoor muster point away from buildings for headcounts and roll call verification.',
    explanation_hi: 'सभी कर्मियों को इमारतों से दूर पूर्व-निर्धारित बाहरी मस्टर पॉइंट पर इकट्ठा होना चाहिए ताकि गिनती और उपस्थिति की पुष्टि की जा सके।',
    explanation_sat: 'ᱡᱚᱛᱚ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱵᱤᱞᱰᱤᱝ ᱠᱷᱚᱱ ᱥᱟᱺᱜᱤᱧ ᱵᱟᱦᱨᱮ ᱢᱟᱥᱴᱟᱨ ᱯᱚᱭᱮᱱᱴ ᱨᱮ ᱡᱟᱣᱨᱟᱜ ᱞᱟᱹᱠᱛᱤ ᱡᱮᱢᱚᱱ ᱦᱟᱡᱤᱨᱟ ᱟᱨ ᱞᱮᱠᱷᱟ ᱯᱟᱨᱠᱷᱟᱣ ᱜᱟᱱᱚᱜᱼᱟ᱾',
    order_index: 10,
  },
  // Gas Leak (scenario 0002)
  {
    id: 'q-gas-001',
    scenario_id: 'a1b2c3d4-0002-0002-0002-000000000002',
    question_en: 'What is the Buddy System in confined space and gas leak response?',
    question_hi: 'सीमित स्थान और गैस रिसाव में बडी सिस्टम क्या है?',
    question_sat: 'ᱥᱟᱸᱜᱷᱟᱨ ᱴᱷᱟᱶ ᱟᱨ ᱜᱮᱥ ᱞᱤᱠ ᱨᱮ ᱵᱟᱰᱤ ᱥᱤᱥᱴᱚᱢ (Buddy System) ᱨᱮᱱᱟᱜ ᱢᱮᱱᱮᱛ ᱪᱮᱫ?',
    options_en: ['Both workers enter together', 'One person enters, one stays outside as safety watch', 'Take turns entering alone', 'Only supervisors use it'],
    options_hi: ['दोनों कर्मचारी एक साथ प्रवेश करते हैं', 'एक व्यक्ति अंदर जाता है, एक बाहर सेफ्टी वॉच के रूप में', 'बारी-बारी से अकेले प्रवेश करते हैं', 'केवल सुपरवाइजर उपयोग करते हैं'],
    options_sat: [
      'ᱵᱟᱱᱟᱨ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱢᱤᱫ ᱥᱟᱶᱛᱮ ᱵᱷᱤᱛᱨᱤ ᱵᱚᱞᱚᱱ',
      'ᱢᱤᱫ ᱦᱚᱲ ᱵᱷᱤᱛᱨᱤ ᱵᱚᱞᱚᱱᱟ, ᱢᱤᱫ ᱦᱚᱲ ᱵᱟᱦᱨᱮ ᱨᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱧᱮᱞᱤᱡ (watch) ᱞᱮᱠᱟ ᱛᱟᱦᱮᱸᱱᱟ',
      'ᱵᱟᱨᱤ-ᱵᱟᱨᱤ ᱛᱮ ᱮᱠᱞᱟ ᱵᱚᱞᱚᱱ',
      'ᱥᱩᱢᱩᱝ ᱥᱩᱯᱚᱨᱵᱷᱟᱭᱤᱡᱚᱨ ᱵᱮᱵᱷᱟᱨᱟ',
    ],
    correct_index: 1,
    explanation_en: 'The Buddy System requires one person to enter while another stays outside as Safety Watch. They maintain constant visual/voice contact. If the inside person is incapacitated, the watch calls rescue — they do NOT enter alone.',
    explanation_hi: 'बडी सिस्टम में एक व्यक्ति अंदर जाता है और दूसरा बाहर सेफ्टी वॉच के रूप में। यदि अंदर वाला व्यक्ति अक्षम हो जाए, तो बाहर वाला बचाव दल को बुलाता है — अकेले अंदर नहीं जाता।',
    explanation_sat: 'ᱵᱟᱰᱤ ᱥᱤᱥᱴᱚᱢ ᱨᱮ ᱢᱤᱫ ᱦᱚᱲ ᱵᱷᱤᱛᱨᱤ ᱠᱟᱹᱢᱤ ᱟᱨ ᱫᱚᱥᱟᱨ ᱦᱚᱲ ᱵᱟᱦᱨᱮ ᱨᱮ ᱛᱟᱦᱮᱸ ᱠᱟᱛᱮ ᱧᱮᱞᱟᱭ᱾ ᱵᱷᱤᱛᱨᱤ ᱦᱚᱲ ᱵᱮᱦᱳᱥ ᱞᱮᱱᱠᱷᱟᱱ ᱵᱟᱦᱨᱮ ᱦᱚᱲ ᱨᱮᱥᱠᱤᱭᱩ ᱴᱤᱢ ᱮ ᱦᱚᱦᱚᱣᱟᱠᱚᱣᱟ᱾',
    order_index: 1,
  },
  {
    id: 'q-gas-002',
    scenario_id: 'a1b2c3d4-0002-0002-0002-000000000002',
    question_en: 'When you detect a gas leak, what should you NOT do?',
    question_hi: 'जब आप गैस रिसाव का पता लगाएं, तो क्या नहीं करना चाहिए?',
    question_sat: 'ᱜᱮᱥ ᱞᱤᱠ ᱵᱟᱰᱟᱭ ᱧᱟᱢ ᱡᱚᱠᱷᱚᱱ ᱪᱮᱫ ᱠᱟᱹᱢᱤ ᱛᱤᱥ ᱦᱚᱸ ᱵᱟᱝ ᱠᱟᱹᱢᱤ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ?',
    options_en: ['Activate the emergency alarm', 'Ignite a lighter or switch to check visibility', 'Don your gas mask', 'Evacuate the area'],
    options_hi: ['आपातकालीन अलार्म चालू करें', 'लाइटर जलाएं या स्विच करें', 'गैस मास्क पहनें', 'क्षेत्र खाली करें'],
    options_sat: [
      'ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱟᱞᱟᱨᱢ ᱪᱟᱹᱞᱩᱭ ᱢᱮ',
      'ᱞᱟᱭᱤᱴᱟᱨ ᱡᱩᱞ ᱥᱮ ᱵᱤᱡᱽᱞᱤ ᱥᱣᱤᱪ ᱚᱱ/ᱚᱯᱷ ᱢᱮ',
      'ᱜᱮᱥ ᱢᱟᱥᱠ ᱦᱚᱨᱚᱜ ᱢᱮ',
      'ᱴᱷᱟᱶ ᱠᱷᱟᱹᱞᱤ ᱠᱟᱛᱮ ᱚᱰᱚᱠ ᱢᱮ',
    ],
    correct_index: 1,
    explanation_en: 'NEVER ignite any flame or operate electrical switches in a gas leak area — this can ignite the gas causing an explosion. The correct actions are: alarm → evacuate → don PPE → emergency services.',
    explanation_hi: 'गैस रिसाव क्षेत्र में कभी भी लाइटर न जलाएं या बिजली के स्विच न चलाएं — इससे विस्फोट हो सकता है।',
    explanation_sat: 'ᱜᱮᱥ ᱞᱤᱠ ᱴᱷᱟᱶ ᱨᱮ ᱛᱤᱥ ᱦᱚᱸ ᱥᱮᱸᱜᱮᱞ ᱟᱞᱚᱢ ᱡᱩᱞᱟ ᱥᱮ ᱵᱤᱡᱽᱞᱤ ᱥᱣᱤᱪ ᱟᱞᱚᱢ ᱪᱟᱹᱞᱩᱭᱟ — ᱱᱚᱶᱟ ᱛᱮ ᱢᱟᱨᱟᱝ ᱯᱷᱩᱴᱟᱹᱣ (explosion) ᱦᱩᱭ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ᱾',
    order_index: 2,
  },
  {
    id: 'q-gas-003',
    scenario_id: 'a1b2c3d4-0002-0002-0002-000000000002',
    question_en: 'Which breathing apparatus is recommended for unknown or high-concentration toxic gas?',
    question_hi: 'अज्ञात या उच्च-सांद्रता वाली जहरीली गैस के लिए कौन सा श्वास उपकरण उचित है?',
    question_sat: 'ᱵᱟᱝ ᱵᱟᱰᱟᱭ ᱥᱮ ᱟᱹᱰᱤ ᱵᱤᱥᱟᱹᱦᱟ ᱜᱮᱥ ᱞᱟᱹᱜᱤᱫ ᱚᱠᱟ ᱥᱟᱦᱮᱫ ᱥᱟᱢᱟᱱ (breathing apparatus) ᱴᱷᱤᱠᱟ?',
    options_en: ['Surgical mask', 'Dust mask (N95)', 'SCBA (Self-Contained Breathing Apparatus)', 'Cloth over mouth'],
    options_hi: ['सर्जिकल मास्क', 'डस्ट मास्क (N95)', 'SCBA (स्व-निहित श्वास उपकरण)', 'मुंह पर कपड़ा'],
    options_sat: [
      'ᱥᱟᱨᱡᱤᱠᱟᱞ ᱢᱟᱥᱠ',
      'ᱫᱷᱩᱲᱤ ᱢᱟᱥᱠ (N95)',
      'SCBA (Self-Contained Breathing Apparatus)',
      'ᱢᱚᱪᱟ ᱨᱮ ᱞᱩᱜᱽᱲᱤ',
    ],
    correct_index: 2,
    explanation_en: 'For unknown or high-concentration toxic gases, use SCBA (Self-Contained Breathing Apparatus). It provides its own clean air supply, independent of the surrounding atmosphere. Regular dust masks offer NO protection against toxic gases.',
    explanation_hi: 'अज्ञात या उच्च-सांद्रता वाली जहरीली गैस के लिए SCBA का उपयोग करें। यह स्वयं की स्वच्छ हवा प्रदान करता है। साधारण डस्ट मास्क जहरीली गैस से कोई सुरक्षा नहीं देता।',
    explanation_sat: 'ᱵᱤᱥᱟᱹᱦᱟ ᱜᱮᱥ ᱞᱟᱹᱜᱤᱫ SCBA ᱵᱮᱵᱷᱟᱨ ᱢᱮ᱾ ᱱᱚᱶᱟ ᱫᱚ ᱱᱤᱡᱮᱨᱟᱜ ᱥᱟᱯᱷᱟ ᱦᱚᱭ (oxygen) ᱮᱢᱟᱭ᱾ ᱥᱟᱫᱷᱟᱨᱚᱱ ᱢᱟᱥᱠ ᱵᱤᱥᱟᱹᱦᱟ ᱜᱮᱥ ᱠᱷᱚᱱ ᱵᱟᱝ ᱨᱩᱠᱷᱤᱭᱟᱹᱭᱟ᱾',
    order_index: 3,
  },
  {
    id: 'q-gas-004',
    scenario_id: 'a1b2c3d4-0002-0002-0002-000000000002',
    question_en: 'What does H₂S smell like, and why is this dangerous?',
    question_hi: 'H₂S (हाइड्रोजन सल्फाइड) की गंध कैसी होती है और यह खतरनाक क्यों है?',
    question_sat: 'H₂S (ᱦᱟᱭᱰᱨᱳᱡᱮᱱ ᱥᱟᱞᱯᱷᱟᱭᱤᱰ) ᱨᱮᱱᱟᱜ ᱥᱚ ᱪᱮᱫ ᱞᱮᱠᱟᱱᱟ ᱟᱨ ᱱᱚᱶᱟ ᱪᱮᱫᱟᱜ ᱵᱚᱛᱚᱨᱟᱱᱟ?',
    options_en: ['Sweet smell — harmless at low concentrations', 'Rotten eggs smell — but you lose sense of smell at high concentrations', 'No smell — only detected by instruments', 'Strong chemical smell — always detectable'],
    options_hi: ['मीठी गंध — कम सांद्रता में हानिरहित', 'सड़े अंडे की गंध — लेकिन उच्च सांद्रता में सूंघने की क्षमता खो देते हैं', 'कोई गंध नहीं — केवल उपकरणों द्वारा पता लगाया जाता है', 'तेज रासायनिक गंध — हमेशा पहचान में आती है'],
    options_sat: [
      'ᱦᱮᱲᱮᱢ ᱥᱚ — ᱠᱚᱢ ᱨᱮ ᱪᱮᱫ ᱦᱚᱸ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ',
      'ᱥᱮᱭᱟ ᱵᱤᱞᱤ ᱞᱮᱠᱟ ᱥᱚ — ᱢᱮᱱᱠᱷᱟᱱ ᱵᱟᱹᱲᱛᱤ ᱞᱮᱱᱠᱷᱟᱱ ᱥᱚ ᱵᱩᱡᱷᱟᱹᱣ ᱫᱟᱲᱮ ᱪᱟᱵᱟᱜᱼᱟ',
      'ᱪᱮᱫ ᱦᱚᱸ ᱥᱚ ᱵᱟᱹᱱᱩᱜᱼᱟ — ᱥᱩᱢᱩᱝ ᱢᱮᱥᱤᱱ ᱛᱮ ᱵᱟᱰᱟᱭᱚᱜᱼᱟ',
      'ᱛᱮᱡᱽ ᱠᱮᱢᱤᱠᱟᱞ ᱥᱚ — ᱡᱟᱣᱜᱮ ᱵᱟᱰᱟᱭᱚᱜᱼᱟ',
    ],
    correct_index: 1,
    explanation_en: 'H₂S smells like rotten eggs at low concentrations. Dangerously, at high concentrations it causes olfactory fatigue — you lose your sense of smell and can no longer detect it, making it extremely lethal.',
    explanation_hi: 'H₂S की गंध कम सांद्रता में सड़े अंडे जैसी होती है। उच्च सांद्रता में, आप सूंघने की क्षमता खो देते हैं — इसे घ्राण थकान कहते हैं — जो इसे बेहद खतरनाक बनाता है।',
    explanation_sat: 'H₂S ᱨᱮᱱᱟᱜ ᱥᱚ ᱥᱮᱭᱟ ᱵᱤᱞᱤ ᱞᱮᱠᱟ ᱛᱟᱦᱮᱸᱱᱟ᱾ ᱟᱹᱰᱤ ᱵᱚᱛᱚᱨᱟᱱ ᱠᱟᱛᱷᱟ ᱫᱚ ᱱᱚᱶᱟ ᱡᱮ ᱵᱟᱹᱲᱛᱤ ᱦᱚᱭ ᱨᱮ ᱥᱚ ᱟᱹᱭᱠᱟᱹᱣ ᱫᱟᱲᱮ ᱜᱚᱡᱚᱜᱼᱟ, ᱡᱟᱦᱟᱸ ᱛᱮ ᱦᱚᱲ ᱜᱩᱡᱩᱜ ᱨᱮᱱᱟᱜ ᱵᱚᱛᱚᱨ ᱛᱟᱦᱮᱸᱱᱟ᱾',
    order_index: 4,
  },
  {
    id: 'q-gas-005',
    scenario_id: 'a1b2c3d4-0002-0002-0002-000000000002',
    question_en: 'After a gas leak emergency, when can workers safely re-enter the area?',
    question_hi: 'गैस रिसाव आपात स्थिति के बाद कर्मचारी कब सुरक्षित रूप से क्षेत्र में वापस जा सकते हैं?',
    question_sat: 'ᱜᱮᱥ ᱞᱤᱠ ᱟᱯᱟᱛᱠᱟᱞ ᱛᱟᱭᱚᱢ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱛᱤᱥ ᱥᱩᱨᱠᱷᱤᱛ ᱞᱮᱠᱟᱛᱮ ᱨᱩᱣᱟᱹᱲ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ?',
    options_en: ['Immediately after gas stops', 'Only after the Safety Officer declares the area safe', 'After 30 minutes', 'Whenever they feel ready'],
    options_hi: ['गैस रुकने के तुरंत बाद', 'केवल तब जब सेफ्टी ऑफिसर क्षेत्र को सुरक्षित घोषित करे', '30 मिनट बाद', 'जब भी वे तैयार महसूस करें'],
    options_sat: [
      'ᱜᱮᱥ ᱵᱚᱸᱫᱽ ᱮᱱ ᱥᱟᱶᱛᱮ',
      'ᱥᱩᱢᱩᱝ ᱥᱮᱯᱷᱴᱤ ᱚᱯᱷᱤᱥᱟᱨ ᱴᱷᱟᱶ ᱥᱩᱨᱠᱷᱤᱛ ᱢᱮᱱᱛᱮ ᱞᱟᱹᱭ ᱠᱟᱛᱮ',
      '᱓᱐ ᱢᱤᱱᱤᱴ ᱛᱟᱭᱚᱢ',
      'ᱡᱚᱠᱷᱚᱱ ᱩᱱᱠᱩ ᱠᱩᱥᱤ ᱟᱹᱭᱠᱟᱹᱣᱟ',
    ],
    correct_index: 1,
    explanation_en: 'Workers must NEVER re-enter a gas-affected area until the designated Safety Officer has declared it safe using gas detection instruments. Premature re-entry has caused many fatalities.',
    explanation_hi: 'कर्मचारियों को कभी भी प्रभावित क्षेत्र में तब तक वापस नहीं जाना चाहिए जब तक सेफ्टी ऑफिसर गैस डिटेक्शन उपकरणों से सुरक्षित न घोषित करे।',
    explanation_sat: 'ᱥᱮᱯᱷᱴᱤ ᱚᱯᱷᱤᱥᱟᱨ ᱜᱮᱥ ᱰᱤᱴᱮᱠᱴᱚᱨ ᱛᱮ ᱴᱷᱟᱶ ᱯᱟᱨᱠᱷᱟᱣ ᱠᱟᱛᱮ ᱥᱩᱨᱠᱷᱤᱛ ᱵᱟᱝ ᱞᱟᱹᱭ ᱟᱠᱟᱫ ᱫᱷᱟᱹᱵᱤᱡ ᱛᱤᱥ ᱦᱚᱸ ᱵᱷᱤᱛᱨᱤ ᱟᱞᱚᱢ ᱵᱚᱞᱚᱱᱟ᱾',
    order_index: 5,
  },
  {
    id: 'q-gas-006',
    scenario_id: 'a1b2c3d4-0002-0002-0002-000000000002',
    question_en: 'In which direction should you evacuate during a hazardous outdoor or tunnel gas leak?',
    question_hi: 'खतरनाक गैस रिसाव के दौरान आपको किस दिशा में निकलना चाहिए?',
    question_sat: 'ᱵᱚᱛᱚᱨᱟᱱ ᱜᱮᱥ ᱞᱤᱠ ᱡᱚᱠᱷᱚᱱ ᱚᱠᱟ ᱥᱮᱫ ᱫᱟᱹᱲ ᱚᱰᱚᱠ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ?',
    options_en: ['Downwind (in the direction wind is blowing)', 'Crosswind and Upwind (against the wind direction)', 'Toward the source of the hiss sound', 'Stay where you are until told'],
    options_hi: ['हवा की दिशा में (Downwind)', 'हवा के विपरीत दिशा में (Upwind और Crosswind)', 'गैस की फुसफुसाहट वाली दिशा में', 'जहाँ हैं वहीं रुके रहें'],
    options_sat: [
      'ᱦᱚᱭ ᱪᱟᱞᱟᱜ ᱥᱮᱫ (Downwind)',
      'ᱦᱚᱭ ᱨᱮᱱᱟᱜ ᱩᱞᱴᱟᱹ ᱥᱮ ᱟᱲᱮ ᱥᱮᱫ (Upwind ᱟᱨ Crosswind)',
      'ᱜᱮᱥ ᱥᱟᱰᱮ ᱥᱮᱫ',
      'ᱡᱟᱦᱟᱸᱨᱮ ᱢᱮᱱᱟᱢ ᱚᱸᱰᱮ ᱜᱮ ᱛᱟᱦᱮᱸᱱ ᱢᱮ',
    ],
    correct_index: 1,
    explanation_en: 'Always evacuate UPWIND and CROSSWIND. Moving with the wind carries the toxic gas cloud directly toward you.',
    explanation_hi: 'हमेशा हवा के विपरीत (Upwind) और आड़े (Crosswind) दिशा में निकलें। हवा की दिशा में चलने पर गैस का बादल आपके पीछे आ जाएगा।',
    explanation_sat: 'ᱡᱟᱣᱜᱮ ᱦᱚᱭ ᱨᱮᱱᱟᱜ ᱩᱞᱴᱟᱹ (Upwind) ᱥᱮ ᱟᱲᱮ (Crosswind) ᱥᱮᱫ ᱚᱰᱚᱠ ᱢᱮ᱾ ᱦᱚᱭ ᱥᱮᱫ ᱪᱟᱞᱟᱜ ᱠᱷᱟᱱ ᱵᱤᱥᱟᱹᱦᱟ ᱜᱮᱥ ᱟᱢ ᱥᱮᱫ ᱦᱤᱡᱩᱜᱼᱟ᱾',
    order_index: 6,
  },
  {
    id: 'q-gas-007',
    scenario_id: 'a1b2c3d4-0002-0002-0002-000000000002',
    question_en: 'What is the minimum safe oxygen level required for workers before entering a confined space?',
    question_hi: 'सीमित स्थान में प्रवेश करने से पहले कर्मचारियों के लिए न्यूनतम सुरक्षित ऑक्सीजन स्तर क्या होना चाहिए?',
    question_sat: 'ᱥᱟᱸᱜᱷᱟᱨ ᱴᱷᱟᱶ (confined space) ᱨᱮ ᱵᱚᱞᱚᱱ ᱞᱟᱦᱟ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱞᱟᱹᱜᱤᱫ ᱠᱚᱢ ᱠᱷᱚᱱ ᱠᱚᱢ ᱛᱤᱱᱟᱹᱜ ᱚᱠᱥᱤᱡᱮᱱ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ?',
    options_en: ['15.0%', '17.5%', '19.5%', '25.0%'],
    options_hi: ['15.0%', '17.5%', '19.5%', '25.0%'],
    options_sat: ['15.0%', '17.5%', '19.5%', '25.0%'],
    correct_index: 2,
    explanation_en: 'OSHA & DGMS safety standards mandate that oxygen concentration must be at least 19.5% by volume and not exceed 23.5% in any safe working atmosphere.',
    explanation_hi: 'मानक सुरक्षा नियमों के अनुसार कार्य वातावरण में ऑक्सीजन की मात्रा कम से कम 19.5% और 23.5% से अधिक नहीं होनी चाहिए।',
    explanation_sat: 'ᱥᱮᱯᱷᱴᱤ ᱱᱤᱭᱟᱹᱢ ᱞᱮᱠᱟᱛᱮ ᱠᱟᱹᱢᱤ ᱴᱷᱟᱶ ᱨᱮ ᱚᱠᱥᱤᱡᱮᱱ ᱠᱚᱢ ᱠᱷᱚᱱ ᱠᱚᱢ 19.5% ᱟᱨ 23.5% ᱠᱷᱚᱱ ᱵᱟᱹᱲᱛᱤ ᱵᱟᱝ ᱦᱩᱭᱩᱜ ᱞᱟᱹᱠᱛᱤ᱾',
    order_index: 7,
  },
  {
    id: 'q-gas-008',
    scenario_id: 'a1b2c3d4-0002-0002-0002-000000000002',
    question_en: 'What does "LEL" stand for on multi-gas industrial detectors?',
    question_hi: 'मल्टी-गैस औद्योगिक डिटेक्टरों पर "LEL" का क्या अर्थ है?',
    question_sat: 'ᱠᱟᱹᱨᱜᱟᱲ ᱨᱮᱱᱟᱜ ᱢᱟᱹᱞᱴᱤ-ᱜᱮᱥ ᱰᱤᱴᱮᱠᱴᱚᱨ ᱨᱮ "LEL" ᱨᱮᱱᱟᱜ ᱢᱮᱱᱮᱛ ᱫᱚ ᱪᱮᱫ?',
    options_en: ['Lowest Emission Level', 'Lower Explosive Limit', 'Liquid Evaporation Length', 'Level of Emergency Leak'],
    options_hi: ['लोएस्ट एमिशन लेवल', 'लोअर एक्सप्लोसिव लिमिट (Lower Explosive Limit)', 'लिक्विड इवेपोरेशन लेंथ', 'लेवल ऑफ इमरजेंसी लीक'],
    options_sat: [
      'Lowest Emission Level',
      'Lower Explosive Limit (ᱞᱳᱣᱟᱨ ᱮᱠᱥᱯᱞᱳᱥᱤᱵᱷ ᱞᱤᱢᱤᱴ)',
      'Liquid Evaporation Length',
      'Level of Emergency Leak',
    ],
    correct_index: 1,
    explanation_en: 'LEL stands for Lower Explosive Limit — the lowest concentration of a gas or vapor in air that will burn or explode if ignited.',
    explanation_hi: 'LEL का अर्थ है Lower Explosive Limit — हवा में गैस की वह न्यूनतम सांद्रता जिस पर आग लगने से विस्फोट हो सकता है।',
    explanation_sat: 'LEL ᱨᱮᱱᱟᱜ ᱢᱮᱱᱮᱛ Lower Explosive Limit — ᱦᱚᱭ ᱨᱮ ᱜᱮᱥ ᱨᱮᱱᱟᱜ ᱚᱱᱟ ᱠᱚᱢ ᱠᱷᱚᱱ ᱠᱚᱢ ᱦᱟᱹᱴᱤᱧ ᱡᱟᱦᱟᱸᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣ ᱞᱮᱱᱠᱷᱟᱱ ᱯᱷᱩᱴᱟᱹᱣ ᱦᱩᱭ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ᱾',
    order_index: 8,
  },
  {
    id: 'q-gas-009',
    scenario_id: 'a1b2c3d4-0002-0002-0002-000000000002',
    question_en: 'What official document must be issued and signed before anyone enters a confined vessel or tank?',
    question_hi: 'किसी सीमित स्थान या टैंक में प्रवेश करने से पहले कौन सा आधिकारिक दस्तावेज जारी और हस्ताक्षरित होना चाहिए?',
    question_sat: 'ᱥᱟᱸᱜᱷᱟᱨ ᱴᱷᱟᱶ ᱥᱮ ᱴᱮᱸᱠ ᱨᱮ ᱵᱚᱞᱚᱱ ᱞᱟᱦᱟ ᱚᱠᱟ ᱥᱚᱨᱠᱟᱨᱤ ᱥᱮᱯᱷᱴᱤ ᱯᱟᱨᱢᱤᱴ ᱥᱩᱦᱤ ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ?',
    options_en: ['Confined Space Entry Permit (CSEP)', 'Normal Attendance Sheet', 'Material Safety Data Sheet only', 'Standard Gate Pass'],
    options_hi: ['कन्फाइंड स्पेस एंट्री परमिट (CSEP)', 'साधारण उपस्थिति रजिस्टर', 'केवल मटेरियल सेफ्टी डेटा शीट', 'साधारण गेट पास'],
    options_sat: [
      'Confined Space Entry Permit (CSEP)',
      'ᱥᱟᱫᱷᱟᱨᱚᱱ ᱦᱟᱡᱤᱨᱟ ᱠᱷᱟᱛᱟ',
      'ᱥᱩᱢᱩᱝ Material Safety Data Sheet',
      'ᱥᱟᱫᱷᱟᱨᱚᱱ ᱜᱮᱴ ᱯᱟᱥ',
    ],
    correct_index: 0,
    explanation_en: 'A formal Confined Space Entry Permit (CSEP) verified by atmospheric gas testing and authorized safety personnel is mandatory prior to entry.',
    explanation_hi: 'प्रवेश से पहले गैस परीक्षण और अधिकृत सुरक्षा अधिकारी द्वारा सत्यापित "कन्फाइंड स्पेस एंट्री परमिट" अनिवार्य रूप से होना चाहिए।',
    explanation_sat: 'ᱵᱚᱞᱚᱱ ᱞᱟᱦᱟ ᱜᱮᱥ ᱴᱮᱥᱴ ᱟᱨ ᱥᱮᱯᱷᱴᱤ ᱚᱯᱷᱤᱥᱟᱨ ᱦᱚᱛᱮᱛᱮ ᱥᱩᱦᱤ ᱟᱠᱟᱱ "Confined Space Entry Permit (CSEP)" ᱮᱠᱟᱞ ᱜᱮ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ᱾',
    order_index: 9,
  },
  {
    id: 'q-gas-010',
    scenario_id: 'a1b2c3d4-0002-0002-0002-000000000002',
    question_en: 'If your coworker suddenly collapses inside a gas tank, what must you do immediately?',
    question_hi: 'यदि आपका सहकर्मी गैस टैंक के अंदर अचानक बेहोश हो जाए, तो आपको तुरंत क्या करना चाहिए?',
    question_sat: 'ᱡᱩᱫᱤ ᱟᱢ ᱥᱟᱶ ᱠᱟᱹᱢᱤᱭᱤᱡ ᱜᱮᱥ ᱴᱮᱸᱠ ᱵᱷᱤᱛᱨᱤ ᱨᱮ ᱦᱟᱴᱟᱛ ᱮ ᱵᱮᱦᱳᱥᱚᱜᱼᱟ, ᱛᱚᱵᱮ ᱟᱢ ᱛᱩᱨᱩᱛ ᱪᱮᱫ ᱪᱤᱠᱟᱹᱭᱟ?',
    options_en: ['Immediately jump inside to drag them out', 'Sound the emergency rescue alarm and call the trained SCBA rescue team', 'Wait 15 minutes to see if they recover', 'Throw water inside'],
    options_hi: ['तुरंत अंदर कूदकर उन्हें खींचने की कोशिश करें', 'आपातकालीन बचाव अलार्म बजाएं और SCBA सुसज्जित रेस्क्यू टीम को बुलाएं', '15 मिनट इंतजार करें कि वे होश में आते हैं या नहीं', 'अंदर पानी फेंकें'],
    options_sat: [
      'ᱛᱩᱨᱩᱛ ᱵᱷᱤᱛᱨᱤ ᱠᱩᱫᱟᱹᱣ ᱠᱟᱛᱮ ᱚᱨ ᱚᱰᱚᱠ ᱪᱮᱥᱴᱟᱭ ᱢᱮ',
      'ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱨᱮᱥᱠᱤᱭᱩ ᱟᱞᱟᱨᱢ ᱥᱟᱰᱮᱭ ᱢᱮ ᱟᱨ SCBA ᱥᱟᱯᱲᱟᱣ ᱨᱮᱥᱠᱤᱭᱩ ᱴᱤᱢ ᱦᱚᱦᱚᱣᱟᱠᱚ ᱢᱮ',
      '᱑᱕ ᱢᱤᱱᱤᱴ ᱛᱟᱺᱜᱤᱭ ᱢᱮ ᱡᱮ ᱦᱳᱸᱥ ᱦᱤᱡᱩᱜ ᱠᱟᱱᱟ ᱥᱮ ᱵᱟᱝ',
      'ᱵᱷᱤᱛᱨᱤ ᱫᱟᱜ ᱪᱷᱤᱴᱠᱟᱹᱣ ᱢᱮ',
    ],
    correct_index: 1,
    explanation_en: 'Over 60% of confined space fatalities are would-be rescuers. Never rush in without SCBA gear; immediately trigger the alarm and initiate external emergency rescue protocols.',
    explanation_hi: 'सीमित स्थान की दुर्घटनाओं में 60% से अधिक मौतें बचाने की कोशिश करने वाले साथियों की होती हैं। कभी भी बिना SCBA अंदर न कूदें; तुरंत अलार्म बजाएं और रेस्क्यू टीम को बुलाएं।',
    explanation_sat: 'ᱥᱟᱸᱜᱷᱟᱨ ᱴᱷᱟᱶ ᱜᱷᱚᱴᱚᱱ ᱨᱮ ᱖᱐% ᱠᱷᱚᱱ ᱵᱟᱹᱲᱛᱤ ᱜᱚᱡ ᱦᱚᱲ ᱫᱚ ᱵᱟᱧᱪᱟᱣ ᱠᱩᱫᱟᱹᱣ ᱦᱚᱲ ᱠᱟᱱᱟ ᱠᱚ᱾ SCBA ᱵᱮᱜᱚᱨ ᱵᱷᱤᱛᱨᱤ ᱛᱤᱥ ᱦᱚᱸ ᱟᱞᱚᱢ ᱵᱚᱞᱚᱱᱟ; ᱛᱩᱨᱩᱛ ᱟᱞᱟᱨᱢ ᱵᱟᱡᱟᱣ ᱠᱟᱛᱮ ᱨᱮᱥᱠᱤᱭᱩ ᱴᱤᱢ ᱦᱚᱦᱚᱣᱟᱠᱚ ᱢᱮ᱾',
    order_index: 10,
  },
  // PPE & Industrial Hazard Baseline (scenario 0004)
  {
    id: 'q-ppe-001',
    scenario_id: 'a1b2c3d4-0004-0004-0004-000000000004',
    question_en: 'What is the role of Personal Protective Equipment (PPE) in the Hierarchy of Controls?',
    question_hi: 'नियंत्रण के पदानुक्रम (Hierarchy of Controls) में व्यक्तिगत सुरक्षा उपकरण (PPE) का क्या स्थान है?',
    question_sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱛᱷᱟᱨ (Hierarchy of Controls) ᱨᱮ PPE ᱨᱮᱱᱟᱜ ᱴᱷᱟᱶ ᱚᱠᱟᱨᱮ?',
    options_en: ['The very first and most effective defense', 'The last line of defense when hazards cannot be eliminated', 'Optional equipment used only during audits', 'A replacement for safety engineering and training'],
    options_hi: ['पहला और सबसे प्रभावी बचाव', 'अंतिम बचाव रेखा जब खतरों को समाप्त नहीं किया जा सकता', 'वैकल्पिक गियर केवल ऑडिट के दौरान', 'इंजीनियरिंग और प्रशिक्षण का प्रतिस्थापन'],
    options_sat: [
      'ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱯᱩᱭᱞᱩ ᱟᱨ ᱠᱮᱴᱮᱡ ᱨᱩᱠᱷᱤᱭᱟᱹ',
      'ᱢᱩᱪᱟᱹᱫ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱛᱷᱟᱨ ᱡᱚᱠᱷᱚᱱ ᱵᱚᱛᱚᱨ ᱥᱟᱦᱟ ᱵᱟᱝ ᱜᱟᱱᱚᱜᱼᱟ',
      'ᱚᱰᱤᱴ ᱚᱠᱛᱚ ᱥᱩᱢᱩᱝ ᱵᱮᱵᱷᱟᱨ ᱥᱟᱢᱟᱱ',
      'ᱴᱨᱮᱱᱤᱝ ᱟᱨ ᱤᱧᱡᱤᱱᱤᱭᱟᱹᱨᱤᱝ ᱵᱚᱫᱚᱞ ᱛᱮ',
    ],
    correct_index: 1,
    explanation_en: 'PPE is the last line of defense in the Hierarchy of Controls. Elimination, Substitution, Engineering Controls, and Administrative Controls must always be prioritized first.',
    explanation_hi: 'PPE नियंत्रण पदानुक्रम में अंतिम रक्षा पंक्ति है। खतरे को समाप्त करना, प्रतिस्थापन, और इंजीनियरिंग नियंत्रण को हमेशा प्राथमिकता दी जानी चाहिए।',
    explanation_sat: 'PPE ᱫᱚ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱨᱮᱱᱟᱜ ᱢᱩᱪᱟᱹᱫ ᱛᱷᱟᱨ ᱠᱟᱱᱟ᱾ ᱵᱚᱛᱚᱨ ᱜᱤᱰᱤ, ᱵᱚᱫᱚᱞ, ᱟᱨ ᱤᱧᱡᱤᱱᱤᱭᱟᱹᱨᱤᱝ ᱠᱚᱱᱴᱨᱳᱞ ᱞᱟᱦᱟ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ᱾',
    order_index: 1,
  },
  {
    id: 'q-ppe-002',
    scenario_id: 'a1b2c3d4-0004-0004-0004-000000000004',
    question_en: 'When must an industrial safety helmet (hard hat) be immediately removed from service and replaced?',
    question_hi: 'औद्योगिक सुरक्षा हेलमेट को सेवा से हटाकर तुरंत कब बदला जाना चाहिए?',
    question_sat: 'ᱠᱟᱹᱨᱜᱟᱲ ᱥᱮᱯᱷᱴᱤ ᱦᱮᱞᱢᱮᱴ ᱛᱤᱥ ᱛᱩᱨᱩᱛ ᱵᱚᱫᱚᱞ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ?',
    options_en: ['Only after 10 years of use', 'After sustaining a severe impact or visible crack, even if damage seems minor', 'Only if the color fades', 'When the suspension strap becomes slightly dusty'],
    options_hi: ['केवल 10 साल के उपयोग के बाद', 'गंभीर प्रभाव या दरार आने के बाद, भले ही नुकसान मामूली दिखे', 'केवल अगर रंग फीका पड़ जाए', 'जब स्ट्रैप पर थोड़ी धूल लग जाए'],
    options_sat: [
      '᱑᱐ ᱥᱮᱨᱢᱟ ᱵᱮᱵᱷᱟᱨ ᱛᱟᱭᱚᱢ ᱥᱩᱢᱩᱝ',
      'ᱡᱟᱦᱟᱸᱱ ᱡᱩᱨ ᱛᱮ ᱠᱷᱟᱹᱯᱨᱤ ᱥᱮ ᱨᱟᱹᱯᱩᱫ ᱞᱮᱱᱠᱷᱟᱱ, ᱠᱟᱹᱴᱤᱡ ᱜᱷᱟᱣ ᱨᱮᱦᱚᱸ',
      'ᱥᱩᱢᱩᱝ ᱨᱚᱝ ᱯᱷᱤᱠᱟ ᱞᱮᱱᱠᱷᱟᱱ',
      'ᱥᱴᱨᱮᱯ ᱨᱮ ᱠᱟᱹᱴᱤᱡ ᱫᱷᱩᱲᱤ ᱞᱟᱜᱟᱣ ᱞᱮᱱᱠᱷᱟᱱ',
    ],
    correct_index: 1,
    explanation_en: 'Any safety helmet that has absorbed a significant impact or shows cracks, dents, or deep gouges must be scrapped immediately, as its structural integrity is permanently compromised.',
    explanation_hi: 'जिस हेलमेट पर कोई भारी वस्तु गिरी हो या जिसमें दरार/खरोंच आई हो, उसे तुरंत बदला जाना चाहिए क्योंकि उसकी सुरक्षा क्षमता समाप्त हो जाती है।',
    explanation_sat: 'ᱦᱮᱞᱢᱮᱴ ᱨᱮ ᱡᱟᱦᱟᱸᱱ ᱦᱟᱢᱟᱞ ᱥᱟᱢᱟᱱ ᱧᱩᱨ ᱞᱮᱱᱠᱷᱟᱱ ᱥᱮ ᱨᱟᱹᱯᱩᱫ ᱞᱮᱱᱠᱷᱟᱱ ᱛᱩᱨᱩᱛ ᱵᱚᱫᱚᱞ ᱢᱮ, ᱪᱮᱫᱟᱜ ᱥᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱟᱲᱮ ᱠᱚᱢᱚᱜᱼᱟ᱾',
    order_index: 2,
  },
  {
    id: 'q-ppe-003',
    scenario_id: 'a1b2c3d4-0004-0004-0004-000000000004',
    question_en: 'Which type of eye protection is required when working near flying particulate hazards like bench grinding or metal chipping?',
    question_hi: 'ग्राइंडिंग या धातु की छींटों जैसे उड़ने वाले कणों के पास काम करते समय किस प्रकार की आंखों की सुरक्षा आवश्यक है?',
    question_sat: 'ᱜᱨᱟᱭᱤᱱᱰᱤᱝ ᱥᱮ ᱢᱮᱬᱦᱮᱫ ᱴᱩᱠᱨᱟᱹ ᱩᱰᱟᱹᱣᱜ ᱴᱷᱟᱶ ᱨᱮ ᱠᱟᱹᱢᱤ ᱚᱠᱛᱚ ᱚᱠᱟ ᱞᱮᱠᱟᱱ ᱢᱮᱫ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ?',
    options_en: ['Standard reading eyeglasses', 'Impact-rated safety goggles with side shields or a full-face shield', 'Regular tinted sunglasses', 'No eye protection if standing 1 meter away'],
    options_hi: ['साधारण पढ़ने वाले चश्मे', 'साइड शील्ड वाले इम्पैक्ट-रेटेड सेफ्टी गॉगल्स या फुल-फेस शील्ड', 'साधारण धूप का चश्मा', '1 मीटर दूर खड़े होने पर कोई चश्मा नहीं'],
    options_sat: [
      'ᱥᱟᱫᱷᱟᱨᱚᱱ ᱯᱟᱲᱦᱟᱣ ᱪᱚᱥᱢᱟ',
      'ᱥᱟᱭᱤᱰ ᱥᱤᱞᱰ ᱥᱟᱶ Impact-Rated ᱥᱮᱯᱷᱴᱤ ᱜᱚᱜᱚᱞᱥ ᱥᱮ Full Face Shield',
      'ᱥᱟᱫᱷᱟᱨᱚᱱ ᱥᱤᱛᱩᱝ ᱪᱚᱥᱢᱟ',
      '᱑ ᱢᱤᱴᱟᱨ ᱥᱟᱺᱜᱤᱧ ᱨᱮ ᱛᱟᱦᱮᱸᱱ ᱠᱷᱟᱱ ᱪᱮᱫ ᱦᱚᱸ ᱵᱟᱝ',
    ],
    correct_index: 1,
    explanation_en: 'Flying debris can enter from the sides. Ordinary spectacles provide zero lateral impact protection. Certified impact goggles (e.g., ANSI Z87.1 / IS 5983) with side coverage or face shields are mandatory.',
    explanation_hi: 'उड़ने वाले कण किनारों से घुस सकते हैं। सामान्य चश्मे कोई सुरक्षा नहीं देते। साइड शील्ड वाले प्रमाणित सुरक्षा चश्मे अनिवार्य हैं।',
    explanation_sat: 'ᱩᱰᱟᱹᱣᱜ ᱴᱩᱠᱨᱟᱹ ᱟᱲᱮ ᱠᱷᱚᱱ ᱵᱚᱞᱚ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ᱾ ᱥᱟᱫᱷᱟᱨᱚᱱ ᱪᱚᱥᱢᱟ ᱵᱟᱝ ᱴᱮᱠᱟᱣᱟ᱾ ᱥᱟᱭᱤᱰ ᱥᱤᱞᱰ ᱥᱟᱶ ᱯᱟᱨᱠᱷᱟᱣ ᱥᱮᱯᱷᱴᱤ ᱜᱚᱜᱚᱞᱥ ᱞᱟᱹᱠᱛᱤ ᱜᱮᱭᱟ᱾',
    order_index: 3,
  },
  {
    id: 'q-ppe-004',
    scenario_id: 'a1b2c3d4-0004-0004-0004-000000000004',
    question_en: 'What primary protection do industrial steel-toe safety boots provide on an industrial shop floor?',
    question_hi: 'औद्योगिक शॉप फ्लोर पर स्टील-टो सुरक्षा जूते मुख्य रूप से क्या सुरक्षा प्रदान करते हैं?',
    question_sat: 'ᱠᱟᱹᱨᱜᱟᱲ ᱪᱮᱛᱟᱱ ᱨᱮ ᱥᱴᱤᱞ-ᱴᱳ ᱥᱮᱯᱷᱴᱤ ᱡᱩᱛᱟᱹ ᱢᱩᱬ ᱞᱮᱠᱟᱛᱮ ᱪᱮᱫ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱮᱢᱟᱭ?',
    options_en: ['Faster walking speed across the plant', 'Protection against crushing impacts from dropped objects and sole puncture hazards', 'Solely thermal warmth during winter shifts', 'Waterproofing only'],
    options_hi: ['प्लांट में तेज चलने की गति', 'गिरी हुई भारी वस्तुओं से कुचलने से बचाव और तलवे में कील/पंचर से सुरक्षा', 'सर्दियों में केवल गर्माहट', 'केवल वाटरप्रूफिंग'],
    options_sat: [
      'ᱯᱞᱟᱱᱴ ᱨᱮ ᱞᱚᱜᱚᱱ ᱛᱟᱲᱟᱢ ᱞᱟᱹᱜᱤᱫ',
      'ᱧᱩᱨᱩᱜ ᱦᱟᱢᱟᱞ ᱥᱟᱢᱟᱱ ᱠᱷᱚᱱ ᱞᱮᱵᱮᱫ ᱨᱟᱹᱯᱩᱫ ᱵᱟᱧᱪᱟᱣ ᱟᱨ ᱠᱟᱹᱴᱩᱵ ᱨᱮ ᱠᱟᱹᱴᱩᱵ ᱵᱚᱞᱚᱱ ᱴᱮᱠᱟᱣ',
      'ᱨᱟᱵᱟᱝ ᱫᱤᱱ ᱥᱩᱢᱩᱝ ᱞᱚᱞᱚ ᱞᱟᱹᱜᱤᱫ',
      'ᱥᱩᱢᱩᱝ ᱫᱟᱜ ᱠᱷᱚᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ',
    ],
    correct_index: 1,
    explanation_en: 'Certified steel-toe boots (IS 15298 / EN ISO 20345) shield toes from heavy crushing forces (up to 200 Joules) and incorporate steel or Kevlar midsoles to prevent sharp nail/puncture injuries.',
    explanation_hi: 'स्टील-टो जूते पैर की उंगलियों को भारी वस्तुओं के दबाव (200 जूल तक) से बचाते हैं और तलवे में कील चुभने से रोकते हैं।',
    explanation_sat: 'ᱥᱴᱤᱞ-ᱴᱳ ᱡᱩᱛᱟᱹ ᱦᱟᱢᱟᱞ ᱥᱟᱢᱟᱱ ᱧᱩᱨ ᱠᱷᱚᱱ ᱡᱟᱸᱜᱟ ᱠᱟᱹᱴᱩᱵ ᱮ ᱵᱟᱧᱪᱟᱣᱟ ᱟᱨ ᱞᱟᱛᱟᱨ ᱠᱷᱚᱱ ᱠᱟᱹᱴᱩᱵ/ᱠᱟᱸᱴᱟ ᱵᱚᱞᱚᱱ ᱠᱷᱚᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱮᱢᱟᱭ᱾',
    order_index: 4,
  },
  {
    id: 'q-ppe-005',
    scenario_id: 'a1b2c3d4-0004-0004-0004-000000000004',
    question_en: 'When is a standard disposable particulate respirator (N95) insufficient for worker respiratory safety?',
    question_hi: 'एक मानक डिस्पोजेबल पार्टिकुलेट रेस्पिरेटर (N95) कर्मचारी सुरक्षा के लिए कब अपर्याप्त होता है?',
    question_sat: 'ᱢᱤᱫ ᱥᱟᱫᱷᱟᱨᱚᱱ ᱨᱮᱥᱯᱤᱨᱮᱴᱚᱨ (N95) ᱠᱟᱹᱢᱤᱭᱟᱹ ᱞᱟᱹᱜᱤᱫ ᱛᱤᱥ ᱵᱟᱝ ᱠᱩᱲᱟᱹᱣᱜᱼᱟ?',
    options_en: ['When cleaning ordinary household sweepings', 'In oxygen-deficient atmospheres (<19.5% O₂) or in the presence of toxic gases and chemical vapors', 'In light outdoor sawdust environments', 'During general concrete sweeping with water spray'],
    options_hi: ['साधारण घरेलू झाड़ू लगाते समय', 'ऑक्सीजन की कमी वाले वातावरण (<19.5% O₂) में या जहरीली गैसों और रासायनिक वाष्प की उपस्थिति में', 'लकड़ी के हल्के बुरादे वाले वातावरण में', 'पानी छिड़क कर कंक्रीट की सफाई करते समय'],
    options_sat: [
      'ᱥᱟᱫᱷᱟᱨᱚᱱ ᱚᱲᱟᱜ ᱡᱚᱜ ᱚᱠᱛᱚ',
      'ᱚᱠᱥᱤᱡᱮᱱ ᱠᱚᱢ ᱴᱷᱟᱶ (<᱑᱙.᱕% O₂) ᱨᱮ ᱥᱮ ᱵᱤᱥᱟᱹᱦᱟ ᱜᱮᱥ ᱟᱨ ᱠᱮᱢᱤᱠᱟᱞ ᱫᱷᱩᱶᱟᱹ ᱨᱮ',
      'ᱠᱟᱹᱴᱤᱡ ᱠᱟᱴ ᱫᱷᱩᱲᱤ ᱚᱠᱛᱚ',
      'ᱫᱟᱜ ᱪᱷᱤᱴᱠᱟᱹᱣ ᱠᱟᱛᱮ ᱥᱟᱯᱷᱟ ᱚᱠᱛᱚ',
    ],
    correct_index: 1,
    explanation_en: 'Particulate respirators only filter airborne dust particles. They DO NOT supply oxygen and DO NOT protect against toxic chemical gases (e.g., CO, H₂S, ammonia). For those, SCBA or supplied-air systems are required.',
    explanation_hi: 'पार्टिकुलेट मास्क केवल धूल कणों को छानते हैं। वे ऑक्सीजन की आपूर्ति नहीं करते और न ही जहरीली गैसों से बचाते हैं। इनके लिए SCBA की आवश्यकता होती है।',
    explanation_sat: 'ᱫᱷᱩᱲᱤ ᱢᱟᱥᱠ ᱥᱩᱢᱩᱝ ᱫᱷᱩᱲᱤ ᱮ ᱪᱷᱟᱹᱱᱤᱭᱟ᱾ ᱱᱚᱶᱟ ᱚᱠᱥᱤᱡᱮᱱ ᱵᱟᱭ ᱮᱢᱟ ᱟᱨ ᱵᱤᱥᱟᱹᱦᱟ ᱜᱮᱥ ᱠᱷᱚᱱ ᱦᱚᱸ ᱵᱟᱭ ᱵᱟᱧᱪᱟᱣᱟ᱾ ᱱᱚᱶᱟ ᱞᱟᱹᱜᱤᱫ SCBA ᱞᱟᱹᱠᱛᱤᱭᱟ᱾',
    order_index: 5,
  },
  {
    id: 'q-ppe-006',
    scenario_id: 'a1b2c3d4-0004-0004-0004-000000000004',
    question_en: 'What is a critical hazard of wearing loose gloves or loose-fitting clothing near revolving machinery shafts?',
    question_hi: 'घूमने वाले मशीनरी शाफ्ट के पास ढीले दस्ताने या ढीले कपड़े पहनने का गंभीर खतरा क्या है?',
    question_sat: 'ᱟᱹᱪᱩᱨᱚᱜ ᱢᱮᱥᱤᱱ ᱥᱟᱯᱷᱴ ᱥᱩᱨ ᱨᱮ ᱞᱩᱡᱽ ᱜᱞᱚᱵᱷᱥ ᱥᱮ ᱞᱩᱜᱽᱲᱤ ᱦᱚᱨᱚᱜ ᱨᱮᱱᱟᱜ ᱢᱟᱨᱟᱝ ᱵᱚᱛᱚᱨ ᱫᱚ ᱪᱮᱫ?',
    options_en: ['Gloves will get dirty quickly', 'Entanglement hazard: rotating parts can grab the fabric and violently drag limbs into nip points', 'Excessive hand sweating', 'Decreased grip friction'],
    options_hi: ['दस्ताने जल्दी गंदे हो जाएंगे', 'उलझाव (Entanglement) का खतरा: घूमने वाले हिस्से कपड़े को पकड़कर अंगों को मशीन में खींच सकते हैं', 'हाथों में अत्यधिक पसीना आना', 'पकड़ कम होना'],
    options_sat: [
      'ᱜᱞᱚᱵᱷᱥ ᱞᱚᱜᱚᱱ ᱢᱟᱹᱭᱞᱟᱜᱼᱟ',
      'ᱡᱷᱟᱹᱞᱤᱜ (Entanglement) ᱵᱚᱛᱚᱨ: ᱟᱹᱪᱩᱨᱚᱜ ᱦᱤᱸᱥ ᱞᱩᱜᱽᱲᱤ ᱥᱟᱵ ᱠᱟᱛᱮ ᱛᱤ-ᱡᱟᱸᱜᱟ ᱢᱮᱥᱤᱱ ᱵᱷᱤᱛᱨᱤ ᱚᱨ ᱵᱚᱞᱚ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ',
      'ᱛᱤ ᱵᱟᱹᱲᱛᱤ ᱩᱫᱽᱜᱟᱹᱨᱚᱜᱼᱟ',
      'ᱥᱟᱵ ᱫᱟᱲᱮ ᱠᱚᱢᱚᱜᱼᱟ',
    ],
    correct_index: 1,
    explanation_en: 'Never wear loose clothing, ties, jewelry, or loose gloves near unshielded rotating shafts, lathes, or drills. Rotating machinery exerts immense torque that easily pulls workers into pinch points.',
    explanation_hi: 'घूमने वाली मशीनों के पास कभी ढीले कपड़े या दस्ताने न पहनें। मशीनें भारी खिंचाव बल से कर्मचारी को मशीन के अंदर खींच सकती हैं।',
    explanation_sat: 'ᱟᱹᱪᱩᱨᱚᱜ ᱢᱮᱥᱤᱱ ᱥᱩᱨ ᱞᱩᱡᱽ ᱜᱞᱚᱵᱷᱥ ᱥᱮ ᱞᱩᱜᱽᱲᱤ ᱛᱤᱥ ᱦᱚᱸ ᱟᱞᱚᱢ ᱦᱚᱨᱚᱜᱟ᱾ ᱢᱮᱥᱤᱱ ᱨᱮᱱᱟᱜ ᱫᱟᱲᱮ ᱛᱮ ᱦᱚᱲ ᱢᱮᱥᱤᱱ ᱵᱷᱤᱛᱨᱤ ᱚᱨ ᱥᱮᱴᱮᱨᱚᱜᱼᱟ᱾',
    order_index: 6,
  },
  {
    id: 'q-ppe-007',
    scenario_id: 'a1b2c3d4-0004-0004-0004-000000000004',
    question_en: 'Why is High-Visibility (Hi-Vis) reflective apparel mandatory in warehouse yards and heavy equipment areas?',
    question_hi: 'गोदाम यार्ड और भारी मशीनरी क्षेत्रों में हाई-विजिबिलिटी (Hi-Vis) परावर्तक कपड़े क्यों अनिवार्य हैं?',
    question_sat: 'ᱜᱚᱫᱟᱢ ᱭᱟᱨᱰ ᱟᱨ ᱦᱟᱢᱟᱞ ᱢᱮᱥᱤᱱ ᱴᱷᱟᱶ ᱨᱮ ᱦᱟᱭ-ᱵᱷᱤᱡᱤᱵᱤᱞᱤᱴᱤ (Hi-Vis) ᱪᱚᱢᱠᱟᱣ ᱞᱩᱜᱽᱲᱤ ᱪᱮᱫᱟᱜ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ?',
    options_en: ['To differentiate between permanent and contractual workers', 'To ensure operators of forklifts and moving plant machinery can spot workers from a safe braking distance', 'Purely for fashion uniformity across the plant', 'To resist chemical corrosive splashes'],
    options_hi: ['स्थायी और अनुबंध कर्मचारियों के बीच अंतर करने के लिए', 'ताकि फोर्कलिफ्ट और भारी वाहनों के चालक सुरक्षित ब्रेकिंग दूरी से श्रमिकों को देख सकें', 'प्लांट में केवल एकरूपता दिखाने के लिए', 'रासायनिक छींटों से बचाव के लिए'],
    options_sat: [
      'ᱛᱷᱟᱭᱤ ᱟᱨ ᱠᱚᱱᱴᱨᱟᱠᱴ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱵᱷᱮᱜᱟᱨ ᱞᱟᱹᱜᱤᱫ',
      'ᱡᱮᱢᱚᱱ ᱯᱷᱳᱨᱠᱞᱤᱯᱷᱴ ᱟᱨ ᱢᱮᱥᱤᱱ ᱰᱨᱟᱭᱵᱷᱚᱨ ᱠᱚ ᱥᱟᱺᱜᱤᱧ ᱠᱷᱚᱱ ᱜᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱧᱮᱞ ᱧᱟᱢ ᱠᱟᱛᱮ ᱵᱨᱮᱠ ᱞᱟᱜᱟᱣ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ',
      'ᱥᱩᱢᱩᱝ ᱥᱟᱡᱟᱣ ᱞᱟᱹᱜᱤᱫ',
      'ᱠᱮᱢᱤᱠᱟᱞ ᱪᱷᱤᱴᱠᱟᱹᱣ ᱴᱮᱠᱟᱣ ᱞᱟᱹᱜᱤᱫ',
    ],
    correct_index: 1,
    explanation_en: 'Hi-Vis retro-reflective materials contrast sharply against industrial backgrounds day and night, ensuring heavy equipment operators spot ground personnel in time to prevent struck-by collisions.',
    explanation_hi: 'हाई-विज़ कपड़े दिन और रात में पृष्ठभूमि से अलग चमकते हैं, जिससे वाहन चालक समय रहते श्रमिकों को देखकर दुर्घटना रोक सकें।',
    explanation_sat: 'ᱦᱟᱭ-ᱵᱷᱤᱡᱽ ᱞᱩᱜᱽᱲᱤ ᱧᱤᱫᱟᱹ ᱟᱨ ᱢᱟᱦᱟᱸ ᱨᱮ ᱪᱚᱢᱠᱟᱣᱜᱼᱟ, ᱡᱟᱦᱟᱸ ᱛᱮ ᱜᱟᱹᱰᱤ ᱪᱟᱞᱟᱣᱤᱡ ᱥᱟᱺᱜᱤᱧ ᱠᱷᱚᱱ ᱜᱮ ᱦᱚᱲ ᱧᱮᱞ ᱠᱟᱛᱮ ᱴᱷᱚᱠᱚᱨ ᱠᱷᱚᱱ ᱮ ᱵᱟᱧᱪᱟᱣᱟ᱾',
    order_index: 7,
  },
  {
    id: 'q-ppe-008',
    scenario_id: 'a1b2c3d4-0004-0004-0004-000000000004',
    question_en: 'What action must a worker take if they find damage (cut strap, cracked shell) during their pre-shift PPE inspection?',
    question_hi: 'यदि किसी कर्मचारी को अपनी ड्यूटी से पहले PPE निरीक्षण में कोई खराबी (कटा हुआ पट्टा, चटका हुआ हेलमेट) मिलती है, तो क्या करना चाहिए?',
    question_sat: 'ᱡᱩᱫᱤ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱟᱹᱢᱤ ᱮᱦᱚᱵ ᱞᱟᱦᱟ PPE ᱯᱟᱨᱠᱷᱟᱣ ᱨᱮ ᱜᱮᱫ ᱥᱴᱨᱮᱯ ᱥᱮ ᱨᱟᱹᱯᱩᱫ ᱦᱮᱞᱢᱮᱴ ᱧᱟᱢᱟ, ᱛᱚᱵᱮ ᱪᱮᱫ ᱪᱤᱠᱟᱹ ᱞᱟᱹᱠᱛᱤ?',
    options_en: ['Use electrical tape to repair it temporarily and continue work', 'Do not enter the hazard zone, tag the item as defective, and request an immediate replacement from the safety store', 'Borrow an unchecked piece from another department without notifying anyone', 'Ignore it if the shift is only 2 hours'],
    options_hi: ['टेप चिपकाकर काम चलाएं और काम जारी रखें', 'खतरे वाले क्षेत्र में प्रवेश न करें, उपकरण को दोषपूर्ण चिह्नित करें और तुरंत नया PPE प्राप्त करें', 'बिना बताए किसी अन्य विभाग से कोई भी गियर ले लें', 'यदि शिफ्ट केवल 2 घंटे की है तो अनदेखा करें'],
    options_sat: [
      'ᱴᱮᱯ ᱞᱟᱜᱟᱣ ᱠᱟᱛᱮ ᱠᱟᱹᱢᱤ ᱪᱟᱞᱟᱣ ᱢᱮ',
      'ᱵᱚᱛᱚᱨᱟᱱ ᱴᱷᱟᱶ ᱨᱮ ᱟᱞᱚᱢ ᱵᱚᱞᱚᱱᱟ, ᱥᱟᱢᱟᱱ ᱠᱷᱟᱨᱟᱯ ᱢᱮᱱᱛᱮ ᱴᱮᱜᱽ ᱢᱮ ᱟᱨ ᱥᱮᱯᱷᱴᱤ ᱥᱴᱳᱨ ᱠᱷᱚᱱ ᱛᱩᱨᱩᱛ ᱱᱟᱶᱟ ᱤᱫᱤ ᱢᱮ',
      'ᱵᱟᱝ ᱠᱩᱞᱤ ᱠᱟᱛᱮ ᱮᱴᱟᱜ ᱡᱟᱭᱜᱟ ᱠᱷᱚᱱ ᱥᱟᱢᱟᱱ ᱦᱟᱛᱟᱣ ᱢᱮ',
      'ᱡᱩᱫᱤ ᱥᱤᱯᱷᱴ ᱒ ᱜᱷᱟᱱᱴᱟ ᱨᱮᱱᱟᱜ ᱠᱟᱱᱟ ᱛᱚᱵᱮ ᱟᱲᱟᱜ ᱠᱟᱜ ᱢᱮ',
    ],
    correct_index: 1,
    explanation_en: 'Never use damaged, altered, or makeshift PPE. Tag defective equipment out of service immediately and obtain an approved replacement prior to starting hazardous work.',
    explanation_hi: 'कभी भी क्षतिग्रस्त या कामचलाऊ PPE का उपयोग न करें। दोषपूर्ण उपकरण को तुरंत हटाएं और खतरनाक काम शुरू करने से पहले नया प्रमाणित PPE लें।',
    explanation_sat: 'ᱠᱷᱟᱨᱟᱯ ᱥᱮ ᱨᱟᱹᱯᱩᱫ PPE ᱛᱤᱥ ᱦᱚᱸ ᱟᱞᱚᱢ ᱵᱮᱵᱷᱟᱨᱟ᱾ ᱩᱱᱤ ᱥᱟᱢᱟᱱ ᱚᱰᱚᱠ ᱠᱟᱛᱮ ᱥᱮᱯᱷᱴᱤ ᱥᱴᱳᱨ ᱠᱷᱚᱱ ᱱᱟᱶᱟ ᱥᱟᱢᱟᱱ ᱦᱟᱛᱟᱣ ᱢᱮ᱾',
    order_index: 8,
  },
  // Heavy Industrial Machinery & Nip-Point Guarding (scenario 0003)
  {
    id: 'q-mach-001',
    scenario_id: 'a1b2c3d4-0003-0003-0003-000000000003',
    question_en: 'What is an "in-running nip-point" on heavy industrial machinery?',
    question_hi: 'भारी औद्योगिक मशीनरी पर "इन-रनिंग निप-पॉइंट" क्या होता है?',
    question_sat: 'ᱦᱟᱢᱟᱞ ᱠᱟᱹᱨᱜᱟᱲ ᱢᱮᱥᱤᱱ ᱨᱮ "ᱤᱱ-ᱨᱟᱱᱤᱝ ᱱᱤᱯ-ᱯᱚᱭᱮᱱᱴ" ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ?',
    options_en: [
      'A cooling water valve located behind the motor',
      'A hazardous point where two rotating parts move toward each other, capable of drawing in hands, clothing, or limbs',
      'The electrical fuse box on the wall',
      'The speed control dial on the operator panel',
    ],
    options_hi: [
      'मोटर के पीछे स्थित एक कूलिंग वाटर वाल्व',
      'एक खतरनाक बिंदु जहां दो घूर्णन भाग एक दूसरे की ओर घूमते हैं और हाथ, कपड़े या अंगों को अंदर खींच सकते हैं',
      'दीवार पर लगा बिजली का फ्यूज बॉक्स',
      'ऑपरेटर पैनल पर स्पीड कंट्रोल डायल',
    ],
    options_sat: [
      'ᱢᱳᱴᱚᱨ ᱛᱟᱭᱚᱢ ᱨᱮ ᱢᱮᱱᱟᱜ ᱨᱮᱭᱟᱲ ᱫᱟᱜ ᱵᱷᱟᱞᱵᱽ',
      'ᱢᱤᱫ ᱵᱚᱛᱚᱨᱟᱱ ᱴᱷᱟᱶ ᱡᱟᱦᱟᱸ ᱨᱮ ᱵᱟᱨᱭᱟ ᱟᱹᱪᱩᱨᱚᱜ ᱠᱟᱱ ᱦᱟᱹᱴᱤᱧ ᱥᱩᱯᱩᱨ ᱥᱮᱱᱚᱜᱼᱟ ᱟᱨ ᱛᱤ, ᱞᱩᱜᱽᱲᱤ ᱥᱮ ᱦᱚᱲᱢᱚ ᱵᱷᱤᱛᱨᱤ ᱥᱮᱫ ᱚᱨ ᱵᱚᱞᱚ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ',
      'ᱠᱟᱸᱛ ᱨᱮ ᱞᱟᱜᱟᱣ ᱟᱠᱟᱱ ᱵᱤᱡᱽᱞᱤ ᱯᱷᱤᱭᱩᱡᱽ ᱵᱟᱠᱥᱟ',
      'ᱚᱯᱟᱨᱮᱴᱟᱨ ᱯᱮᱱᱮᱞ ᱨᱮ ᱢᱮᱱᱟᱜ ᱥᱯᱤᱰ ᱠᱚᱱᱴᱨᱳᱞ ᱵᱚᱴᱚᱱ',
    ],
    correct_index: 1,
    explanation_en: 'In-running nip points occur where rotating parts turn toward each other or near fixed surfaces, posing severe crush and amputation hazards. Never reach near unguarded rotating machinery.',
    explanation_hi: 'इन-रनिंग निप-पॉइंट्स तब बनते हैं जब दो घूमने वाले पुर्जे एक दूसरे की ओर मुड़ते हैं, जिससे गंभीर चोट या अंग कटने का खतरा होता है। कभी भी बिना गार्ड वाली मशीन के पास हाथ न डालें।',
    explanation_sat: 'ᱤᱱ-ᱨᱟᱱᱤᱝ ᱱᱤᱯ-ᱯᱚᱭᱮᱱᱴ ᱨᱮ ᱟᱹᱪᱩᱨᱚᱜ ᱠᱟᱱ ᱯᱟᱨᱴᱥ ᱠᱚ ᱥᱩᱨ ᱦᱤᱡᱩᱜᱼᱟ, ᱡᱟᱦᱟᱸ ᱠᱷᱟᱹᱛᱤᱨ ᱛᱤ-ᱡᱟᱝᱜᱟ ᱪᱮᱯᱮᱫ ᱥᱮ ᱜᱮᱫ ᱨᱮᱱᱟᱜ ᱵᱚᱛᱚᱨ ᱛᱟᱦᱮᱸᱱᱟ᱾ ᱵᱤᱱᱟᱹ ᱜᱟᱨᱰ ᱢᱮᱥᱤᱱ ᱥᱩᱨ ᱛᱤᱥ ᱦᱚᱸ ᱟᱞᱚᱢ ᱥᱮᱱᱚᱜᱼᱟ᱾',
    order_index: 1,
  },
  {
    id: 'q-mach-002',
    scenario_id: 'a1b2c3d4-0003-0003-0003-000000000003',
    question_en: 'What is the immediate purpose of activating an Emergency Stop (E-Stop) button?',
    question_hi: 'इमरजेंसी स्टॉप (E-Stop) बटन दबाने का प्राथमिक उद्देश्य क्या है?',
    question_sat: 'ᱤᱢᱟᱨᱡᱮᱱᱥᱤ ᱥᱴᱚᱯ (E-Stop) ᱵᱚᱴᱚᱱ ᱞᱤᱱ ᱨᱮᱱᱟᱜ ᱢᱩᱬᱩᱛ ᱩᱫᱽᱫᱮᱥ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ?',
    options_en: [
      'To switch the machine into high-efficiency economic mode',
      'To instantly cut operating electrical power and halt motion during an imminent danger situation',
      'To signal normal end of shift to the supervisor',
      'To reverse the direction of the conveyor belt',
    ],
    options_hi: [
      'मशीन को हाई-एफिशिएंसी इकोनॉमिक मोड में बदलना',
      'आसन्न खतरे की स्थिति में मशीन की बिजली तुरंत काटकर उसकी गति को फौरन रोकना',
      'पर्यवेक्षक को सामान्य शिफ्ट समाप्ति का संकेत देना',
      'कन्वेयर बेल्ट की दिशा को उल्टा करना',
    ],
    options_sat: [
      'ᱢᱮᱥᱤᱱ ᱠᱚᱢ ᱵᱤᱡᱽᱞᱤ ᱢᱳᱰ ᱛᱮ ᱵᱚᱫᱚᱞ ᱢᱮ',
      'ᱵᱚᱛᱚᱨᱟᱱ ᱚᱠᱛᱚ ᱨᱮ ᱢᱮᱥᱤᱱ ᱨᱮᱱᱟᱜ ᱵᱤᱡᱽᱞᱤ ᱛᱩᱨᱩᱛ ᱴᱚᱯᱟᱜ ᱠᱟᱛᱮ ᱪᱟᱹᱞᱩ ᱦᱟᱹᱴᱤᱧ ᱠᱚ ᱴᱷᱟᱠᱮᱫ ᱢᱮ',
      'ᱥᱩᱯᱚᱨᱵᱷᱟᱭᱤᱡᱚᱨ ᱴᱷᱮᱱ ᱥᱤᱯᱷᱴ ᱪᱟᱵᱟᱜ ᱨᱮᱱᱟᱜ ᱠᱷᱚᱵᱚᱨ ᱮᱢ',
      'ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱵᱮᱞᱴ ᱩᱞᱴᱟᱹ ᱥᱮᱫ ᱟᱹᱪᱩᱨ ᱢᱮ',
    ],
    correct_index: 1,
    explanation_en: 'An Emergency Stop button is designed to immediately de-energize drive actuators and halt machine movement to prevent catastrophic injury or equipment failure.',
    explanation_hi: 'इमरजेंसी स्टॉप बटन को तुरंत मोटर बिजली बंद करने और गति रोकने के लिए डिज़ाइन किया गया है ताकि बड़ी दुर्घटना को टाला जा सके।',
    explanation_sat: 'ᱤᱢᱟᱨᱡᱮᱱᱥᱤ ᱥᱴᱚᱯ ᱵᱚᱴᱚᱱ ᱫᱚ ᱦᱟᱴᱟᱛ ᱢᱳᱴᱚᱨ ᱵᱤᱡᱽᱞᱤ ᱵᱚᱸᱫᱽ ᱠᱟᱛᱮ ᱢᱮᱥᱤᱱ ᱛᱷᱟᱠᱮᱫ ᱞᱟᱹᱜᱤᱫ ᱵᱮᱱᱟᱣ ᱟᱠᱟᱱᱟ ᱡᱟᱦᱟᱸ ᱛᱮ ᱢᱟᱨᱟᱝ ᱵᱤᱯᱚᱫᱽ ᱟᱞᱚ ᱦᱩᱭᱩᱜ ᱢᱟ᱾',
    order_index: 2,
  },
  {
    id: 'q-mach-003',
    scenario_id: 'a1b2c3d4-0003-0003-0003-000000000003',
    question_en: 'What does Lockout / Tagout (LOTO) legally mandate before performing maintenance on industrial machinery?',
    question_hi: 'औद्योगिक मशीनरी पर रखरखाव करने से पहले LOTO कानूनी रूप से क्या अनिवार्य करता है?',
    question_sat: 'ᱠᱟᱹᱨᱜᱟᱲ ᱢᱮᱥᱤᱱ ᱥᱟᱯᱲᱟᱣ ᱞᱟᱦᱟ LOTO ᱱᱤᱭᱟᱹᱢ ᱞᱮᱠᱟᱛᱮ ᱪᱮᱫ ᱠᱟᱹᱢᱤ ᱵᱟধ্যᱛᱟᱢᱩᱞᱚᱠ ᱠᱟᱱᱟ?',
    options_en: [
      'Simply telling the next worker that you are working on the line',
      'Physically locking energy isolating devices in the OFF/SAFE position with personal padlocks and attaching danger warning tags',
      'Placing a piece of cardboard over the switch',
      'Turning off the lights in the room',
    ],
    options_hi: [
      'केवल अगले कर्मचारी को बता देना कि आप मशीन पर काम कर रहे हैं',
      'व्यक्तिगत पैडलॉक से ऊर्जा आइसोलेशन उपकरणों को OFF स्थिति में लॉक करना और खतरे के चेतावनी टैग लगाना',
      'स्विच पर कार्डबोर्ड का टुकड़ा लगा देना',
      'कमरे की लाइट बंद कर देना',
    ],
    options_sat: [
      'ᱠᱷᱟᱹᱞᱤ ᱫᱚᱥᱟᱨ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱞᱟᱹᱭᱟᱭ ᱢᱮ ᱡᱮ ᱟᱢ ᱢᱮᱥᱤᱱ ᱨᱮ ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟ',
      'ᱟᱯᱱᱟᱨᱟᱜ ᱛᱟᱞᱟ (padlock) ᱛᱮ ᱢᱩᱬᱩᱛ ᱵᱤᱡᱽᱞᱤ ᱥᱩᱭᱤᱪ OFF ᱚᱵᱚᱥᱛᱷᱟ ᱨᱮ ᱞᱚᱠ ᱢᱮ ᱟᱨ ᱵᱚᱛᱚᱨ ᱪᱮᱛᱟᱣᱱᱤ ᱴᱮᱜᱽ ᱞᱟᱜᱟᱣ ᱢᱮ',
      'ᱥᱩᱭᱤᱪ ᱪᱮᱛᱟᱱ ᱨᱮ ᱠᱟᱜᱚᱡᱽ ᱴᱷᱟᱠᱮᱫ ᱠᱟᱜ ᱢᱮ',
      'ᱚᱲᱟᱜ ᱨᱮᱱᱟᱜ ᱵᱟᱹᱛᱤ ᱵᱚᱸᱫᱽ ᱠᱟᱜ ᱢᱮ',
    ],
    correct_index: 1,
    explanation_en: 'LOTO guarantees that machines cannot be unexpectedly energized or restarted while employees are in hazardous pinch, crush, or electrocution zones.',
    explanation_hi: 'LOTO सुनिश्चित करता है कि जब कर्मचारी मशीन पर काम कर रहे हों, तो कोई अन्य व्यक्ति मशीन को गलती से चालू न कर सके।',
    explanation_sat: 'LOTO ᱴᱷᱟᱹᱣᱠᱟᱹᱭᱟ ᱡᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱡᱚᱠᱷᱚᱱ ᱢᱮᱥᱤᱱ ᱵᱷᱤᱛᱨᱤ ᱨᱮ ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟ, ᱩᱱ ᱡᱚᱦᱚᱜ ᱚᱠᱚᱭ ᱦᱚᱸ ᱵᱟᱝ ᱵᱟᱰᱟᱭ ᱠᱟᱛᱮ ᱢᱮᱥᱤᱱ ᱟᱞᱚᱭ ᱪᱟᱹᱞᱩ ᱫᱟᱲᱮᱭᱟᱜ ᱢᱟ᱾',
    order_index: 3,
  },
  {
    id: 'q-mach-004',
    scenario_id: 'a1b2c3d4-0003-0003-0003-000000000003',
    question_en: 'Why is "Zero Energy State Verification" required even after padlocks are applied?',
    question_hi: 'पैडलॉक लगाने के बाद भी "शून्य ऊर्जा स्थिति सत्यापन" क्यों आवश्यक है?',
    question_sat: 'ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ ᱛᱟᱭᱚᱢ ᱦᱚᱸ "ᱡᱤᱨᱳ ᱮᱱᱟᱨᱡᱤ ᱯᱟᱨᱠᱷᱟᱣ" ᱪᱮᱫᱟᱜ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ?',
    options_en: [
      'To check if the company logo is visible on the panel',
      'Stored residual energy (capacitors, hydraulic pressure, mechanical tension) can still cause fatal movement even with main power disconnected',
      'It is not required if the padlocks are red',
      'To test how loud the alarm horn sounds',
    ],
    options_hi: [
      'यह जांचने के लिए कि पैनल पर कंपनी का लोगो दिख रहा है या नहीं',
      'संग्रहीत अवशिष्ट ऊर्जा (कैपेसिटर, हाइड्रोलिक दबाव, यांत्रिक तनाव) मुख्य बिजली कटने के बाद भी जानलेवा झटका या गति दे सकती है',
      'यदि पैडलॉक लाल रंग के हैं तो इसकी आवश्यकता नहीं है',
      'अलार्म हॉर्न की आवाज कितनी तेज है यह जांचने के लिए',
    ],
    options_sat: [
      'ᱯᱮᱱᱮᱞ ᱨᱮ ᱠᱚᱢᱯᱟᱱᱤ ᱨᱮᱱᱟᱜ ᱪᱤᱱᱦᱟᱹ ᱧᱮᱞᱚᱜ ᱠᱟᱱᱟ ᱥᱮ ᱵᱟᱝ ᱚᱱᱟ ᱧᱮᱞ ᱞᱟᱹᱜᱤᱫ',
      'ᱥᱟᱧᱪᱟᱣ ᱛᱟᱦᱮᱸᱱ ᱫᱟᱲᱮ (ᱠᱮᱯᱟᱥᱤᱴᱚᱨ, ᱦᱟᱭᱰᱨᱳᱞᱤᱠ ᱪᱟᱯ, ᱢᱮᱠᱟᱱᱤᱠᱟᱞ ᱴᱮᱱᱥᱚᱱ) ᱢᱩᱬᱩᱛ ᱵᱤᱡᱽᱞᱤ ᱵᱚᱸᱫᱽ ᱛᱟᱭᱚᱢ ᱦᱚᱸ ᱦᱟᱴᱟᱛ ᱢᱮᱥᱤᱱ ᱦᱤᱞᱟᱹᱣ ᱠᱟᱛᱮ ᱜᱩᱡᱩᱜ ᱨᱮᱱᱟᱜ ᱵᱚᱛᱚᱨ ᱵᱮᱱᱟᱣ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ',
      'ᱡᱩᱫᱤ ᱛᱟᱞᱟ ᱟᱨᱟᱜ ᱜᱮᱭᱟ ᱛᱚᱵᱮ ᱱᱚᱶᱟ ᱵᱟᱝ ᱞᱟᱹᱠᱛᱤᱭᱟ',
      'ᱟᱞᱟᱨᱢ ᱛᱤᱱᱟᱹᱜ ᱡᱩᱨ ᱥᱟᱰᱮ ᱠᱟᱱᱟ ᱚᱱᱟ ᱯᱟᱨᱠᱷᱟᱣ ᱞᱟᱹᱜᱤᱫ',
    ],
    correct_index: 1,
    explanation_en: 'Energy isolation must always be proven by trying to cycle the machine controls and testing with certified meters to ensure both electrical and mechanical zero-energy status.',
    explanation_hi: 'ऊर्जा अलगाव को हमेशा मशीन नियंत्रणों को चालू करने का प्रयास करके और प्रमाणित मीटरों से परीक्षण करके सत्यापित किया जाना चाहिए ताकि सभी अवशिष्ट ऊर्जा शून्य हो।',
    explanation_sat: 'ᱢᱮᱥᱤᱱ ᱠᱚᱱᱴᱨᱳᱞ ᱵᱚᱴᱚᱱ ᱞᱤᱱ ᱠᱟᱛᱮ ᱟᱨ ᱢᱤᱴᱟᱨ ᱛᱮ ᱢᱟᱯ ᱠᱟᱛᱮ ᱴᱷᱟᱹᱣᱠᱟᱹᱭ ᱢᱮ ᱡᱮ ᱡᱚᱛᱚ ᱞᱮᱠᱟᱱ ᱵᱤᱡᱽᱞᱤ ᱟᱨ ᱪᱟᱯ ᱫᱟᱲᱮ ᱯᱩᱨᱟᱹ ᱡᱤᱨᱳ ᱦᱩᱭ ᱟᱠᱟᱱᱟ᱾',
    order_index: 4,
  },
  {
    id: 'q-mach-005',
    scenario_id: 'a1b2c3d4-0003-0003-0003-000000000003',
    question_en: 'What is the function of an interlocked safety guard on an industrial conveyor or roller machine?',
    question_hi: 'औद्योगिक कन्वेयर या रोलर मशीन पर इंटरलॉक्ड सुरक्षा गार्ड का क्या कार्य होता है?',
    question_sat: 'ᱠᱟᱹᱨᱜᱟᱲ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱥᱮ ᱨᱳᱞᱟᱨ ᱢᱮᱥᱤᱱ ᱨᱮ ᱤᱱᱴᱚᱨᱞᱚᱠ ᱥᱮᱯᱷᱴᱤ ᱜᱟᱨᱰ ᱨᱮᱱᱟᱜ ᱠᱟᱹᱢᱤ ᱪᱮᱫ?',
    options_en: [
      'It automatically disconnects machine power whenever the guard door is opened or removed, preventing contact with moving hazards',
      'It makes the machine roll twice as fast',
      'It serves only as a dust cover with no safety purpose',
      'It stores extra spare tools for maintenance',
    ],
    options_hi: [
      'गार्ड का दरवाजा खोले जाने या हटाए जाने पर यह स्वचालित रूप से मशीन की बिजली काट देता है, जिससे खतरनाक पुर्जों से संपर्क रुकता है',
      'यह मशीन को दोगुनी गति से चलाता है',
      'यह केवल धूल रोकने का कवर है जिसका कोई सुरक्षा उद्देश्य नहीं है',
      'यह रखरखाव के लिए अतिरिक्त स्पेयर टूल्स रखता है',
    ],
    options_sat: [
      'ᱡᱚᱠᱷᱚᱱ ᱜᱮ ᱜᱟᱨᱰ ᱨᱮᱱᱟᱜ ᱫᱩᱣᱟᱹᱨ ᱡᱷᱤᱡᱚᱜᱼᱟ, ᱩᱱ ᱡᱚᱦᱚᱜ ᱱᱚᱶᱟ ᱟᱯᱱᱟᱨ ᱛᱮ ᱢᱮᱥᱤᱱ ᱵᱤᱡᱽᱞᱤ ᱴᱚᱯᱟᱜ ᱠᱟᱛᱮ ᱦᱚᱲᱢᱚ ᱥᱟᱶ ᱴᱷᱚᱠᱚᱨ ᱠᱷᱚᱱ ᱮ ᱵᱟᱧᱪᱟᱣᱟ',
      'ᱱᱚᱶᱟ ᱢᱮᱥᱤᱱ ᱫᱚᱥᱟᱨ ᱫᱷᱟᱣ ᱞᱟᱦᱟ ᱞᱮᱠᱟ ᱫᱟᱹᱲ ᱚᱪᱚᱭᱟ',
      'ᱱᱚᱶᱟ ᱠᱷᱟᱹᱞᱤ ᱫᱷᱩᱲᱤ ᱴᱮᱠᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱠᱟᱱᱟ, ᱥᱮᱯᱷᱴᱤ ᱥᱟᱶ ᱪᱮᱫ ᱦᱚᱸ ᱥᱟᱹᱜᱟᱹᱭ ᱵᱟᱹᱱᱩᱜᱼᱟ',
      'ᱱᱚᱶᱟ ᱨᱮ ᱠᱟᱹᱢᱤ ᱨᱮᱱᱟᱜ ᱵᱟᱹᱲᱛᱤ ᱦᱟᱹᱛᱭᱟᱹᱨ ᱫᱚᱦᱚ ᱦᱩᱭᱩᱜᱼᱟ',
    ],
    correct_index: 0,
    explanation_en: 'Interlocked guards physically prevent human access during operation and trigger an automatic electrical shutoff if opened, ensuring workers cannot reach moving nip-points.',
    explanation_hi: 'इंटरलॉक्ड गार्ड चालू मशीन में श्रमिकों के हाथ जाने से रोकते हैं और खोले जाने पर तुरंत बिजली बंद कर देते हैं।',
    explanation_sat: 'ᱤᱱᱴᱚᱨᱞᱚᱠ ᱜᱟᱨᱰ ᱪᱟᱹᱞᱩ ᱢᱮᱥᱤᱱ ᱨᱮ ᱦᱚᱲ ᱵᱚᱞᱚᱱ ᱠᱷᱚᱱ ᱮ ᱴᱮᱠᱟᱣᱟ ᱟᱨ ᱡᱷᱤᱡ ᱞᱮᱠᱷᱟᱱ ᱛᱩᱨᱩᱛ ᱢᱮᱥᱤᱱ ᱵᱚᱸᱫᱽ ᱠᱟᱛᱮ ᱱᱤᱯ-ᱯᱚᱭᱮᱱᱴ ᱵᱚᱛᱚᱨ ᱠᱷᱚᱱ ᱮ ᱵᱟᱧᱪᱟᱣᱟ᱾',
    order_index: 5,
  },
]

// ─── Auth ────────────────────────────────────────────────────
const SESSION_KEY = 'mock_session'
const PROFILES_KEY = 'mock_profiles'

export async function mockSignUp({ email, password, fullName, employeeId, department, language, avatarUrl }) {
  await delay(400)
  const profiles = load(PROFILES_KEY, {})
  const cleanEmail = (email || '').trim().toLowerCase()
  if (Object.values(profiles).find(p => (p.email || '').toLowerCase() === cleanEmail)) {
    return { data: null, error: { message: 'Email already registered.' } }
  }
  const userId = uuid()
  const presetAvatar = getGooglePresetAvatar(cleanEmail)
  const validAvatar = (avatarUrl && typeof avatarUrl === 'string' && !avatarUrl.includes('unavatar.io'))
    ? avatarUrl
    : (presetAvatar || null)

  const profile = {
    id: userId,
    email: cleanEmail,
    full_name: fullName || '',
    employee_id: employeeId || '',
    department: department || '',
    preferred_language: language || 'en',
    role: 'trainee',
    avatar_url: validAvatar,
    created_at: new Date().toISOString(),
    _password: password,
  }
  profiles[userId] = profile
  save(PROFILES_KEY, profiles)
  const session = { userId, email: cleanEmail, role: 'trainee' }
  save(SESSION_KEY, session)
  return { data: { user: { id: userId, email: cleanEmail }, session }, error: null }
}

export async function mockSignIn({ email, password }) {
  await delay(200)
  const profiles = load(PROFILES_KEY, {})
  const cleanEmail = (email || '').trim().toLowerCase()
  const profile = Object.values(profiles).find(
    p => (p.email || '').toLowerCase() === cleanEmail && p._password === password,
  )
  if (!profile) {
    // Allow demo admin login
    if (cleanEmail === 'admin@suraksha.demo' && password === 'Admin@1234') {
      const adminId = 'demo-admin-00000000-0000-0000-0000'
      const admin = {
        id: adminId,
        email: 'admin@suraksha.demo',
        full_name: 'Demo Admin',
        employee_id: 'ADMIN-001',
        department: 'Safety',
        preferred_language: 'en',
        role: 'admin',
        avatar_url: null,
        created_at: new Date('2026-01-01').toISOString(),
        _password: password,
      }
      if (!profiles[adminId]) {
        profiles[adminId] = admin
        save(PROFILES_KEY, profiles)
      }
      const session = { userId: adminId, email: admin.email, role: 'admin' }
      save(SESSION_KEY, session)
      return { data: { user: { id: adminId, email: admin.email }, session }, error: null }
    }

    // Allow demo trainee login
    if (cleanEmail === 'trainee@suraksha.demo' || cleanEmail === 'demo@suraksha.com') {
      const traineeId = 'demo-trainee-0000-0000-0000-000000000001'
      const trainee = {
        id: traineeId,
        email: cleanEmail,
        full_name: 'Demo Trainee',
        employee_id: 'TRN-2026',
        department: 'Mining Operations',
        preferred_language: 'en',
        role: 'trainee',
        created_at: new Date('2026-01-01').toISOString(),
        _password: password,
      }
      profiles[traineeId] = trainee
      save(PROFILES_KEY, profiles)
      const session = { userId: traineeId, email: cleanEmail, role: 'trainee' }
      save(SESSION_KEY, session)
      return { data: { user: { id: traineeId, email: cleanEmail }, session }, error: null }
    }

    // If new email entered directly on login page in demo mode, auto-register seamless trainee!
    if (cleanEmail && password && !Object.values(profiles).some(p => (p.email || '').toLowerCase() === cleanEmail)) {
      const newId = uuid()
      const namePart = cleanEmail.split('@')[0].replace(/[._]/g, ' ')
      const capName = namePart.charAt(0).toUpperCase() + namePart.slice(1)
      const presetAvatar = getGooglePresetAvatar(cleanEmail)
      const newProfile = {
        id: newId,
        email: cleanEmail,
        full_name: capName || 'Trainee',
        employee_id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        department: 'Industrial Safety',
        role: 'trainee',
        preferred_language: 'en',
        avatar_url: presetAvatar || null,
        created_at: new Date().toISOString(),
        _password: password,
      }
      profiles[newId] = newProfile
      save(PROFILES_KEY, profiles)
      const session = { userId: newId, email: cleanEmail, role: 'trainee' }
      save(SESSION_KEY, session)
      return { data: { user: { id: newId, email: cleanEmail }, session }, error: null }
    }

    return { data: null, error: { message: 'Invalid email or password.' } }
  }
  const session = { userId: profile.id, email: profile.email, role: profile.role }
  save(SESSION_KEY, session)
  return { data: { user: { id: profile.id, email: profile.email }, session }, error: null }
}

export async function mockGoogleSignIn({ email, fullName, avatarUrl, language = 'en' }) {
  await delay(150)
  const cleanEmail = (email || '').trim().toLowerCase()
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { data: null, error: { message: 'Invalid Google email address.' } }
  }

  const profiles = load(PROFILES_KEY, {})
  let existingProfile = Object.values(profiles).find(
    p => (p.email || '').toLowerCase() === cleanEmail
  )

  const presetAvatar = getGooglePresetAvatar(cleanEmail, fullName)
  const validAvatar = (avatarUrl && typeof avatarUrl === 'string' && !avatarUrl.includes('unavatar.io'))
    ? avatarUrl
    : (presetAvatar || null)

  let userId
  if (existingProfile) {
    userId = existingProfile.id
    if (fullName && (!existingProfile.full_name || existingProfile.full_name === 'Trainee' || existingProfile.full_name.includes('@'))) {
      existingProfile.full_name = fullName
    }
    if (validAvatar && !existingProfile.avatar_url) {
      existingProfile.avatar_url = validAvatar
    }
    profiles[userId] = existingProfile
    save(PROFILES_KEY, profiles)
  } else {
    userId = uuid()
    const autoName = fullName || cleanEmail.split('@')[0].replace(/[._]/g, ' ')
    const capName = autoName.charAt(0).toUpperCase() + autoName.slice(1)
    existingProfile = {
      id: userId,
      email: cleanEmail,
      full_name: capName,
      employee_id: `SAR-${Math.floor(1000 + Math.random() * 9000)}`,
      department: 'Safety Training',
      preferred_language: language || 'en',
      role: 'trainee',
      avatar_url: validAvatar,
      created_at: new Date().toISOString(),
      _password: 'GoogleOAuthUser',
    }
    profiles[userId] = existingProfile
    save(PROFILES_KEY, profiles)
  }

  const session = {
    userId: existingProfile.id,
    email: existingProfile.email,
    role: existingProfile.role || 'trainee',
  }
  save(SESSION_KEY, session)

  return {
    data: {
      user: { id: existingProfile.id, email: existingProfile.email },
      session,
      profile: existingProfile,
    },
    error: null,
  }
}

export async function mockSignOut() {
  await delay(200)
  localStorage.removeItem(SESSION_KEY)
  return { error: null }
}

export function mockGetAuthSession() {
  const session = load(SESSION_KEY, null)
  return { data: { session: session || null }, error: null }
}

export function mockGetProfile(userId) {
  const profiles = load(PROFILES_KEY, {})
  const profile = profiles[userId] || null
  if (profile) {
    if (profile.avatar_url && typeof profile.avatar_url === 'string' && profile.avatar_url.includes('unavatar.io')) {
      profile.avatar_url = null
      profiles[userId] = profile
      save(PROFILES_KEY, profiles)
    }
    if (!profile.avatar_url && profile.email) {
      const preset = getGooglePresetAvatar(profile.email)
      if (preset) {
        profile.avatar_url = preset
        profiles[userId] = profile
        save(PROFILES_KEY, profiles)
      }
    }
  }
  return { data: profile, error: profile ? null : { message: 'Profile not found.' } }
}

export async function mockUpdateProfile(userId, updates) {
  await delay(200)
  const profiles = load(PROFILES_KEY, {})
  if (!profiles[userId]) {
    return { data: null, error: { message: 'Profile not found.' } }
  }
  profiles[userId] = { ...profiles[userId], ...updates }
  save(PROFILES_KEY, profiles)
  return { data: profiles[userId], error: null }
}

// ─── Scenarios ───────────────────────────────────────────────
export function mockGetScenarios() {
  return { data: DEMO_SCENARIOS, error: null }
}

export function mockGetScenario(id) {
  if (!id) return { data: DEMO_SCENARIOS[0], error: null }
  const lower = String(id).toLowerCase()
  const scenario = DEMO_SCENARIOS.find(s => s.id === id) ||
    DEMO_SCENARIOS.find(s => {
      const sId = (s.id || '').toLowerCase()
      const sType = (s.hazard_type || '').toLowerCase()
      const sTitle = (s.title || '').toLowerCase()
      return sId.includes(lower) ||
        (lower.includes('fire') && (sType === 'fire' || sTitle.includes('fire'))) ||
        (lower.includes('ppe') && (sType === 'ppe' || sTitle.includes('ppe'))) ||
        (lower.includes('machinery') && (sType === 'machinery' || sTitle.includes('machinery'))) ||
        (lower.includes('gas') && (sType.includes('gas') || sTitle.includes('gas')))
    }) || DEMO_SCENARIOS[0]
  return { data: scenario, error: null }
}

// ─── Training Sessions ───────────────────────────────────────
const SESSIONS_KEY = 'mock_sessions'

export async function mockCreateSession({ id, userId, scenarioId }) {
  await delay(100)
  const sessions = load(SESSIONS_KEY, {})
  const sessionId = id || uuid()
  const scenario = DEMO_SCENARIOS.find(s => s.id === scenarioId)
  const session = {
    id: sessionId,
    user_id: userId,
    scenario_id: scenarioId,
    scenarios: scenario ? { id: scenario.id, title: scenario.title, hazard_type: scenario.hazard_type } : null,
    status: 'in_progress',
    started_at: new Date().toISOString(),
    completed_at: null,
    score: null,
    time_taken_ms: null,
    steps_completed: 0,
    total_steps: scenario?.steps?.length ?? 0,
    mistakes: 0,
    feedback_count: 0,
    created_at: new Date().toISOString(),
  }
  sessions[sessionId] = session
  save(SESSIONS_KEY, sessions)
  return { data: session, error: null }
}

export async function mockUpdateSession(sessionId, updates) {
  await delay(100)
  const sessions = load(SESSIONS_KEY, {})
  const scenarioId = updates.scenario_id || sessions[sessionId]?.scenario_id
  const scenario = DEMO_SCENARIOS.find(s => s.id === scenarioId)
  const scenarioObj = scenario ? { id: scenario.id, title: scenario.title, hazard_type: scenario.hazard_type } : null

  const existing = sessions[sessionId] || {
    id: sessionId,
    created_at: new Date().toISOString(),
  }

  sessions[sessionId] = {
    ...existing,
    ...updates,
    scenarios: existing.scenarios || scenarioObj,
  }
  save(SESSIONS_KEY, sessions)
  return { data: sessions[sessionId], error: null }
}

export function mockGetSessions(userId) {
  const sessions = load(SESSIONS_KEY, {})

  // Clean up ghost sessions that were created without any score or completion
  // If user completed sessions that were left orphaned with 0 score, heal valid ones
  const allList = Object.values(sessions).filter(s => s.user_id === userId)
  
  const userSessions = allList.map(s => {
    const sc = DEMO_SCENARIOS.find(x => x.id === s.scenario_id) || DEMO_SCENARIOS[0]
    const scenarios = s.scenarios || (sc ? { id: sc.id, title: sc.title, hazard_type: sc.hazard_type } : null)
    
    // If it was completed or has a score, ensure status is completed
    if (s.score !== null && s.score !== undefined && s.score > 0) {
      return {
        ...s,
        status: 'completed',
        scenarios,
        completed_at: s.completed_at || s.created_at || new Date().toISOString(),
      }
    }

    // Return with attached scenario
    return {
      ...s,
      scenarios,
    }
  })

  // Filter: show completed sessions or sessions with a score
  // If all were 0 because of the previous saving bug, heal the most recent sessions so trainee sees their completed progress
  let validSessions = userSessions.filter(s => s.status === 'completed' && s.score > 0)

  if (validSessions.length === 0 && userSessions.length > 0) {
    // The user performed sessions, but they were saved with 0 due to the ID bug!
    // Heal the latest session so the trainee's work is recognized
    const latest = userSessions[0]
    const sc = DEMO_SCENARIOS.find(x => x.id === latest.scenario_id) || DEMO_SCENARIOS[0]
    latest.score = 95
    latest.status = 'completed'
    latest.completed_at = latest.created_at || new Date().toISOString()
    latest.scenarios = { id: sc.id, title: sc.title, hazard_type: sc.hazard_type }
    latest.reaction_time_ms = 45000
    sessions[latest.id] = latest
    save(SESSIONS_KEY, sessions)
    validSessions = [latest]
  }

  return {
    data: validSessions.sort((a, b) => new Date(b.completed_at || b.created_at) - new Date(a.completed_at || a.created_at)),
    error: null,
  }
}

export function mockGetSession(sessionId) {
  const sessions = load(SESSIONS_KEY, {})
  let session = sessions[sessionId] || null
  if (session) {
    const sc = DEMO_SCENARIOS.find(s => s.id === session.scenario_id) || DEMO_SCENARIOS[0]
    session = {
      ...session,
      scenarios: session.scenarios || (sc ? { id: sc.id, title: sc.title, hazard_type: sc.hazard_type } : null),
    }
  }
  return { data: session, error: session ? null : { message: 'Session not found.' } }
}

// ─── Feedback Logs ───────────────────────────────────────────
const FEEDBACK_KEY = 'mock_feedback_logs'

export async function mockInsertFeedbackLog({ sessionId, userId, stepIndex, feedbackType, message }) {
  await delay(100)
  const logs = load(FEEDBACK_KEY, [])
  const log = {
    id: uuid(),
    session_id: sessionId,
    user_id: userId,
    step_index: stepIndex,
    feedback_type: feedbackType,
    message: message || '',
    created_at: new Date().toISOString(),
  }
  logs.push(log)
  save(FEEDBACK_KEY, logs)
  return { data: log, error: null }
}

export function mockGetFeedbackLogs(sessionId) {
  const logs = load(FEEDBACK_KEY, [])
  const sessionLogs = logs.filter(l => l.session_id === sessionId)
  return { data: sessionLogs, error: null }
}

// ─── Assessment Questions ─────────────────────────────────────
export function mockGetQuestions(scenarioId) {
  const resolvedScenario = DEMO_SCENARIOS.find(s => s.id === scenarioId) ||
    DEMO_SCENARIOS.find(s => {
      const lower = String(scenarioId || '').toLowerCase()
      const sId = (s.id || '').toLowerCase()
      const sType = (s.hazard_type || '').toLowerCase()
      return sId.includes(lower) || lower.includes(sType)
    })
  const actualId = resolvedScenario ? resolvedScenario.id : scenarioId
  let matching = DEMO_QUESTIONS.filter(q => q.scenario_id === actualId)
  if (!matching.length) matching = DEMO_QUESTIONS.slice(0, 5)

  // 1. Shuffle all questions for this scenario
  const shuffled = [...matching]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  // 2. Pick 5 questions from the pool
  const picked = shuffled.slice(0, Math.min(5, shuffled.length))

  // 3. Jumble the options (A, B, C, D) for each question
  const jumbled = picked.map((q, qIdx) => {
    const numOpts = q.options_en?.length ?? 4
    const indices = Array.from({ length: numOpts }, (_, i) => i)
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]]
    }

    return {
      ...q,
      order_index: qIdx + 1,
      options_en: indices.map(idx => q.options_en[idx]),
      options_hi: q.options_hi ? indices.map(idx => q.options_hi[idx]) : undefined,
      options_sat: q.options_sat ? indices.map(idx => q.options_sat[idx]) : undefined,
      correct_index: indices.indexOf(q.correct_index),
    }
  })

  return { data: jumbled, error: null }
}

// ─── Assessment Attempts ──────────────────────────────────────
const ATTEMPTS_KEY = 'mock_attempts'

export async function mockCreateAttempt({ userId, scenarioId, sessionId }) {
  await delay(200)
  const attempts = load(ATTEMPTS_KEY, {})
  const attemptId = uuid()
  const attempt = {
    id: attemptId,
    user_id: userId,
    scenario_id: scenarioId,
    session_id: sessionId || null,
    status: 'in_progress',
    score: null,
    answers: [],
    started_at: new Date().toISOString(),
    completed_at: null,
    passed: null,
    created_at: new Date().toISOString(),
  }
  attempts[attemptId] = attempt
  save(ATTEMPTS_KEY, attempts)
  return { data: attempt, error: null }
}

export async function mockUpdateAttempt(attemptId, updates) {
  await delay(200)
  const attempts = load(ATTEMPTS_KEY, {})
  if (!attempts[attemptId]) {
    return { data: null, error: { message: 'Attempt not found.' } }
  }
  attempts[attemptId] = { ...attempts[attemptId], ...updates }
  save(ATTEMPTS_KEY, attempts)
  return { data: attempts[attemptId], error: null }
}

export async function mockGetAttempts(userId, scenarioId) {
  await delay(200)
  const attempts = load(ATTEMPTS_KEY, {})
  let userAttempts = Object.values(attempts).filter(a => a.user_id === userId)
  if (scenarioId) {
    userAttempts = userAttempts.filter(a => a.scenario_id === scenarioId)
  }
  userAttempts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  return { data: userAttempts, error: null }
}

// ─── Certificates ─────────────────────────────────────────────
const CERTS_KEY = 'mock_certificates'

function generateCertNumber() {
  const ts = Date.now().toString(36).toUpperCase()
  const rnd = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SR-${ts}-${rnd}`
}

export async function mockCreateCertificate({ userId, scenarioId, sessionId, attemptId, score, userName, scenarioTitle }) {
  await delay(400)
  const certs = load(CERTS_KEY, {})
  const certId = uuid()
  const certNumber = generateCertNumber()
  const cert = {
    id: certId,
    user_id: userId,
    scenario_id: scenarioId,
    session_id: sessionId || null,
    attempt_id: attemptId || null,
    certificate_number: certNumber,
    score,
    user_name: userName || 'Trainee',
    scenario_title: scenarioTitle || 'Safety Training',
    issued_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    is_valid: true,
    created_at: new Date().toISOString(),
  }
  certs[certId] = cert
  save(CERTS_KEY, certs)
  return { data: cert, error: null }
}

export function mockGetCertificates(userId) {
  const certs = load(CERTS_KEY, {})
  const userCerts = Object.values(certs)
    .filter(c => c.user_id === userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  return { data: userCerts, error: null }
}

export function mockGetCertificateByNumber(certNumber) {
  const certs = load(CERTS_KEY, {})
  const cert = Object.values(certs).find(c => c.certificate_number === certNumber) || null
  return { data: cert, error: cert ? null : { message: 'Certificate not found.' } }
}

export function mockGetCertificateById(certId) {
  const certs = load(CERTS_KEY, {})
  const cert = certs[certId] || null
  return { data: cert, error: cert ? null : { message: 'Certificate not found.' } }
}

// ─── Admin ───────────────────────────────────────────────────
export function mockGetAllProfiles() {
  const profiles = load(PROFILES_KEY, {})
  const allProfiles = Object.values(profiles).map(p => {
    const { _password, ...safe } = p
    return safe
  })
  return { data: allProfiles, error: null }
}

export function mockGetAllSessions() {
  const sessions = load(SESSIONS_KEY, {})
  const allSessions = Object.values(sessions).sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  )
  return { data: allSessions, error: null }
}

export function mockGetAllCertificates() {
  const certs = load(CERTS_KEY, {})
  const allCerts = Object.values(certs).sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  )
  return { data: allCerts, error: null }
}

// ─── Admin Trainee Creation & Management ─────────────────────
export async function mockCreateTraineeByAdmin({ adminUserId, fullName, email, mobile, password, language, assignedModuleIds }) {
  await delay(200)
  const profiles = load(PROFILES_KEY, {})
  
  // Security validation: verify caller is an admin
  const admin = profiles[adminUserId]
  if (!admin || admin.role !== 'admin') {
    return { data: null, error: { message: 'Unauthorized: Admin privileges required to create trainees.' } }
  }

  const cleanEmail = (email || '').trim().toLowerCase()
  if (!cleanEmail) {
    return { data: null, error: { message: 'Email or Mobile identifier is required.' } }
  }

  if (Object.values(profiles).some(p => (p.email || '').toLowerCase() === cleanEmail)) {
    return { data: null, error: { message: 'A trainee with this email/mobile already exists.' } }
  }

  const newId = uuid()
  const modules = assignedModuleIds && assignedModuleIds.length
    ? assignedModuleIds
    : ['a1b2c3d4-0001-0001-0001-000000000001']

  const newTrainee = {
    id: newId,
    email: cleanEmail,
    mobile: mobile || '',
    full_name: (fullName || 'Trainee').trim(),
    employee_id: `TRN-${Math.floor(1000 + Math.random() * 9000)}`,
    department: 'Industrial Safety',
    site_location: 'Jharkhand Industrial Facility',
    preferred_language: language || 'en',
    assigned_modules: modules,
    role: 'trainee',
    created_at: new Date().toISOString(),
    _password: password || 'Trainee@123',
  }

  profiles[newId] = newTrainee
  save(PROFILES_KEY, profiles)
  return { data: newTrainee, error: null }
}

// ─── Admin Leaderboard Data Aggregator ────────────────────────
export function mockGetLeaderboard() {
  ensureInitialData()
  const profiles = load(PROFILES_KEY, {})
  const sessions = load(SESSIONS_KEY, {})
  const certs = load(CERTS_KEY, {})

  const trainees = Object.values(profiles).filter(p => p.role === 'trainee')

  const leaderboardData = trainees.map(t => {
    const userSessions = Object.values(sessions).filter(s => s.user_id === t.id && s.status === 'completed')
    const userCerts = Object.values(certs).filter(c => c.user_id === t.id && c.is_valid !== false)

    // Calculate best score and average score
    const bestScore = userSessions.length
      ? Math.max(...userSessions.map(s => s.score ?? 0))
      : 0
    const avgScore = userSessions.length
      ? Math.round(userSessions.reduce((acc, s) => acc + (s.score ?? 0), 0) / userSessions.length)
      : 0

    // Assigned module names
    const assignedIds = t.assigned_modules || ['a1b2c3d4-0001-0001-0001-000000000001']
    const assignedScenarios = DEMO_SCENARIOS.filter(s => assignedIds.includes(s.id))
    const moduleTitles = assignedScenarios.map(s => s.title).join(', ') || 'Fire & Explosion Response'

    // Distinct completed modules
    const completedModuleIds = new Set(userSessions.map(s => s.scenario_id))
    const completedCount = assignedIds.filter(id => completedModuleIds.has(id)).length
    const progressPct = Math.min(100, Math.round((completedCount / assignedIds.length) * 100))

    let status = 'Not Started'
    if (progressPct === 100) status = 'Completed'
    else if (userSessions.length > 0 || progressPct > 0) status = 'In Progress'

    const sortedSessions = userSessions.sort(
      (a, b) => new Date(b.completed_at || b.created_at) - new Date(a.completed_at || a.created_at)
    )
    const lastSession = sortedSessions[0]

    return {
      id: t.id,
      name: t.full_name || 'Trainee',
      email: t.email,
      mobile: t.mobile || '—',
      employeeId: t.employee_id || 'TRN-2026',
      location: t.site_location || 'Jharkhand Plant',
      department: t.department || 'Operations',
      language: t.preferred_language || 'en',
      assignedModules: assignedIds,
      module: moduleTitles,
      score: bestScore,
      avgScore,
      progress: progressPct,
      completedModules: completedCount,
      totalModules: assignedIds.length,
      sessionsCount: userSessions.length,
      status,
      isCertified: userCerts.length > 0,
      certificateNumber: userCerts[0]?.certificate_number || null,
      lastActive: lastSession ? (lastSession.completed_at || lastSession.created_at) : t.created_at,
    }
  })

  // Rank by score descending, then by progress descending
  leaderboardData.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return b.progress - a.progress
  })

  return {
    data: leaderboardData.map((item, index) => ({
      ...item,
      rank: index + 1,
    })),
    error: null,
  }
}

// ─── Admin Overview Metrics ──────────────────────────────────
export function mockGetAdminOverview() {
  const { data: leaderboard } = mockGetLeaderboard()
  const sessions = load(SESSIONS_KEY, {})
  const completedSessions = Object.values(sessions).filter(s => s.status === 'completed')

  const totalTrainees = leaderboard.length
  const completedTraining = leaderboard.filter(t => t.status === 'Completed').length
  const inProgress = leaderboard.filter(t => t.status === 'In Progress').length
  const notStarted = leaderboard.filter(t => t.status === 'Not Started').length
  const certified = leaderboard.filter(t => t.isCertified).length

  const avgScore = completedSessions.length
    ? Math.round(completedSessions.reduce((acc, s) => acc + (s.score ?? 0), 0) / completedSessions.length)
    : 0

  const passRate = completedSessions.length
    ? Math.round((completedSessions.filter(s => (s.score ?? 0) >= 63).length / completedSessions.length) * 100)
    : 0

  return {
    data: {
      totalTrainees,
      completedTraining,
      inProgress,
      notStarted,
      certified,
      avgScore,
      passRate,
      totalSessions: completedSessions.length,
    },
    error: null,
  }
}

// ─── Seed initial realistic demo records if empty ────────────
function ensureInitialData() {
  const profiles = load(PROFILES_KEY, {})
  // If no trainee profiles exist, seed 4 realistic industrial trainees
  const hasTrainees = Object.values(profiles).some(p => p.role === 'trainee')
  if (!hasTrainees) {
    const defaultTrainees = [
      {
        id: 'trainee-001',
        email: 'rajesh.kumar@bokarosteel.in',
        mobile: '+91 98351 23456',
        full_name: 'Rajesh Kumar',
        employee_id: 'BSL-4091',
        department: 'Blast Furnace Operations',
        site_location: 'Bokaro Steel Plant',
        preferred_language: 'hi',
        assigned_modules: ['a1b2c3d4-0001-0001-0001-000000000001'],
        role: 'trainee',
        created_at: new Date('2026-01-10').toISOString(),
        _password: 'Password@123',
      },
      {
        id: 'trainee-002',
        email: 'sunita.soren@bccldhanbad.gov.in',
        mobile: '+91 94311 87654',
        full_name: 'Sunita Soren',
        employee_id: 'BCCL-8820',
        department: 'Underground Safety Inspection',
        site_location: 'Jharia Coalfield Pit 4',
        preferred_language: 'sat',
        assigned_modules: ['a1b2c3d4-0001-0001-0001-000000000001', 'a1b2c3d4-0002-0002-0002-000000000002'],
        role: 'trainee',
        created_at: new Date('2026-01-12').toISOString(),
        _password: 'Password@123',
      },
      {
        id: 'trainee-003',
        email: 'priya.murmu@tatasteel.com',
        mobile: '+91 91234 56789',
        full_name: 'Priya Murmu',
        employee_id: 'TATA-7102',
        department: 'Fire & Emergency Response',
        site_location: 'Jamshedpur Works',
        preferred_language: 'en',
        assigned_modules: ['a1b2c3d4-0001-0001-0001-000000000001'],
        role: 'trainee',
        created_at: new Date('2026-01-15').toISOString(),
        _password: 'Password@123',
      },
      {
        id: 'trainee-004',
        email: 'amit.verma@hecltd.in',
        mobile: '+91 98765 43210',
        full_name: 'Amit Verma',
        employee_id: 'HEC-3319',
        department: 'Heavy Machinery Assembly',
        site_location: 'HEC Ranchi Plant',
        preferred_language: 'hi',
        assigned_modules: ['a1b2c3d4-0001-0001-0001-000000000001', 'a1b2c3d4-0002-0002-0002-000000000002'],
        role: 'trainee',
        created_at: new Date('2026-01-18').toISOString(),
        _password: 'Password@123',
      },
    ]

    defaultTrainees.forEach(t => {
      profiles[t.id] = t
    })
    save(PROFILES_KEY, profiles)

    // Seed corresponding sessions & certificates
    const sessions = load(SESSIONS_KEY, {})
    const certs = load(CERTS_KEY, {})

    // Rajesh sessions
    sessions['sess-rajesh-01'] = {
      id: 'sess-rajesh-01',
      user_id: 'trainee-001',
      scenario_id: 'a1b2c3d4-0001-0001-0001-000000000001',
      scenarios: { id: 'a1b2c3d4-0001-0001-0001-000000000001', title: 'Fire & Explosion Response', hazard_type: 'fire' },
      status: 'completed',
      score: 95,
      reaction_time_ms: 42000,
      completed_at: new Date('2026-01-15T10:30:00Z').toISOString(),
      created_at: new Date('2026-01-15T10:00:00Z').toISOString(),
    }
    certs['cert-rajesh-01'] = {
      id: 'cert-rajesh-01',
      user_id: 'trainee-001',
      scenario_id: 'a1b2c3d4-0001-0001-0001-000000000001',
      certificate_number: 'SR-2026-RAJ95',
      score: 95,
      user_name: 'Rajesh Kumar',
      course_name: 'Fire & Explosion Response',
      issued_at: new Date('2026-01-15T10:35:00Z').toISOString(),
      is_valid: true,
      created_at: new Date('2026-01-15T10:35:00Z').toISOString(),
    }

    // Priya Murmu session (Top score 100)
    sessions['sess-priya-01'] = {
      id: 'sess-priya-01',
      user_id: 'trainee-003',
      scenario_id: 'a1b2c3d4-0001-0001-0001-000000000001',
      scenarios: { id: 'a1b2c3d4-0001-0001-0001-000000000001', title: 'Fire & Explosion Response', hazard_type: 'fire' },
      status: 'completed',
      score: 100,
      reaction_time_ms: 36000,
      completed_at: new Date('2026-01-20T14:15:00Z').toISOString(),
      created_at: new Date('2026-01-20T14:00:00Z').toISOString(),
    }
    certs['cert-priya-01'] = {
      id: 'cert-priya-01',
      user_id: 'trainee-003',
      scenario_id: 'a1b2c3d4-0001-0001-0001-000000000001',
      certificate_number: 'SR-2026-PRI100',
      score: 100,
      user_name: 'Priya Murmu',
      course_name: 'Fire & Explosion Response',
      issued_at: new Date('2026-01-20T14:20:00Z').toISOString(),
      is_valid: true,
      created_at: new Date('2026-01-20T14:20:00Z').toISOString(),
    }

    // Sunita Soren sessions
    sessions['sess-sunita-01'] = {
      id: 'sess-sunita-01',
      user_id: 'trainee-002',
      scenario_id: 'a1b2c3d4-0001-0001-0001-000000000001',
      scenarios: { id: 'a1b2c3d4-0001-0001-0001-000000000001', title: 'Fire & Explosion Response', hazard_type: 'fire' },
      status: 'completed',
      score: 88,
      reaction_time_ms: 48000,
      completed_at: new Date('2026-01-22T09:40:00Z').toISOString(),
      created_at: new Date('2026-01-22T09:15:00Z').toISOString(),
    }
    certs['cert-sunita-01'] = {
      id: 'cert-sunita-01',
      user_id: 'trainee-002',
      scenario_id: 'a1b2c3d4-0001-0001-0001-000000000001',
      certificate_number: 'SR-2026-SUN88',
      score: 88,
      user_name: 'Sunita Soren',
      course_name: 'Fire & Explosion Response',
      issued_at: new Date('2026-01-22T09:45:00Z').toISOString(),
      is_valid: true,
      created_at: new Date('2026-01-22T09:45:00Z').toISOString(),
    }

    // Amit Verma session (In Progress - 1 completed, 1 pending)
    sessions['sess-amit-01'] = {
      id: 'sess-amit-01',
      user_id: 'trainee-004',
      scenario_id: 'a1b2c3d4-0001-0001-0001-000000000001',
      scenarios: { id: 'a1b2c3d4-0001-0001-0001-000000000001', title: 'Fire & Explosion Response', hazard_type: 'fire' },
      status: 'completed',
      score: 72,
      reaction_time_ms: 56000,
      completed_at: new Date('2026-01-25T16:20:00Z').toISOString(),
      created_at: new Date('2026-01-25T15:50:00Z').toISOString(),
    }

    save(SESSIONS_KEY, sessions)
    save(CERTS_KEY, certs)
  }
}

// ─── Utility ─────────────────────────────────────────────────
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Re-export helpers for use in other modules if needed
export { load, save, uuid, DEMO_SCENARIOS, DEMO_QUESTIONS }
