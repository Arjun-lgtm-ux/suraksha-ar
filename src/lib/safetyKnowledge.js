/**
 * SurakshaAR — Safety Knowledge Base & Intelligent Assistant Engine
 * 
 * Comprehensive, verified industrial safety knowledge base covering:
 * - Fire & Explosion Response, Extinguisher Classes, PASS Protocol
 * - Gas Leak, Toxic Atmospheres & Confined Space Safety
 * - PPE Identification, Inspection, Standards & Hazard Baselines
 * - High-Voltage Electrical Safety, LOTO (Lockout/Tagout), Arc Flash
 * - Heavy Machinery, Rotating Equipment, E-Stops & Machine Guarding
 * - Underground & Open-cast Mining Safety (DGMS compliance)
 * - Evacuation Procedures, Muster Points & Roll-Call Protocols
 * - Industrial First Aid, Chemical Exposure & Emergency Helplines
 * - SurakshaAR Platform Navigation, AR Training, Scoring & Certificates
 * 
 * Features:
 * 1. Critical Hazard Guardrails (intercepts life-threatening misconceptions immediately)
 * 2. Boundary-Safe Token Matching & Phonetic Hinglish Expansions
 * 3. Context & Module-Aware Retrieval (Fire, Gas, PPE, Electrical, Machinery, Mining, Platform)
 * 4. Conversational History Resolution for follow-up questions
 * 6. Standalone Local Knowledge Engine with Optional Backend Proxy
 */

import safetyFaq from '../data/safetyFaq.js'

/**
 * Fast verified FAQ matching across English, Hindi, and Santali (Ol Chiki)
 */
export function findFaqMatch(query, lang = 'en') {
  if (!query || typeof query !== 'string') return null
  const qClean = query.trim().toLowerCase()
  if (!qClean) return null

  // 1. Direct keyword match (prioritize longer/more specific keywords)
  let bestMatch = null
  let bestScore = 0

  for (const item of safetyFaq) {
    if (item.keywords && Array.isArray(item.keywords)) {
      for (const kw of item.keywords) {
        if (!kw) continue
        const kwLower = kw.toLowerCase()
        if (qClean.includes(kwLower)) {
          const score = kwLower.length
          if (score > bestScore) {
            bestScore = score
            const lData = item[lang] || item.en
            bestMatch = {
              answer: lData.answer,
              question: lData.question,
              source: 'Suraksha Mitra Safety Knowledge (Verified)',
              confidence: 0.98,
              isFaq: true,
            }
          }
        }
      }
    }
  }

  if (bestMatch) return bestMatch

  // 2. Ol Chiki script matching (\u1C50-\u1C7F)
  const isOlChiki = /[\u1c50-\u1c7f]/.test(query)
  if (isOlChiki) {
    for (const item of safetyFaq) {
      if (item.sat) {
        const words = query.split(/\s+/).filter(w => w.length > 2)
        for (const w of words) {
          if (item.sat.question.includes(w) || (item.keywords && item.keywords.some(k => k.includes(w)))) {
            return {
              answer: item.sat.answer,
              question: item.sat.question,
              source: 'ᱥᱩᱨᱠᱷᱟ ᱢᱤᱛᱨᱚ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱟᱰᱟᱭ',
              confidence: 0.95,
              isFaq: true,
            }
          }
        }
      }
    }
    // Default Santali verified safety response
    return {
      answer: "👷 ᱡᱚᱦᱟᱨ! ᱤᱧ ᱫᱚ ᱥᱩᱨᱠᱷᱟ ᱢᱤᱛᱨᱚ ᱠᱟᱹᱱᱟᱹᱧ᱾ ᱠᱷᱟᱫᱟᱱ ᱟᱨ ᱠᱟᱹᱨᱜᱟᱲ ᱨᱮ ᱠᱟᱹᱢᱤ ᱡᱚᱠᱷᱚᱱ ᱡᱟᱣᱜᱮ PPE ᱥᱟᱢᱟᱱ (ᱦᱮᱞᱢᱮᱴ, ᱪᱚᱥᱢᱟ, ᱡᱩᱛᱟᱹ) ᱦᱚᱨᱚᱜ ᱢᱮ, ᱥᱮᱸᱜᱮᱞ ᱡᱩᱞ ᱞᱮᱱᱠᱷᱟᱱ CO₂ ᱤᱬᱤᱡᱤᱡ ᱵᱮᱵᱷᱟᱨ ᱢᱮ ᱟᱨ ᱜᱮᱥ ᱞᱤᱠ ᱡᱚᱠᱷᱚᱱ ᱢᱟᱥᱴᱟᱨ ᱯᱚᱭᱮᱱᱴ ᱛᱮ ᱧᱤᱨ ᱢᱮ᱾",
      source: 'ᱥᱩᱨᱠᱷᱟ ᱢᱤᱛᱨᱚ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱟᱰᱟᱭ',
      confidence: 0.90,
      isFaq: true,
    }
  }

  return null
}

export const MODULES = {
  FIRE_EXPLOSION: 'FIRE_EXPLOSION',
  GAS_LEAK: 'GAS_LEAK',
  PPE: 'PPE',
  ELECTRICAL: 'ELECTRICAL',
  MACHINERY: 'MACHINERY',
  MINING: 'MINING',
  CONFINED_SPACE: 'CONFINED_SPACE',
  PLATFORM: 'PLATFORM',
  GLOBAL: 'GLOBAL',
};

export const SAFE_FALLBACK = {
  en: "I am Suraksha Saathi, your AI Safety & Technical Assistant. I am here to guide you on workplace safety standards, PPE guidelines, fire response (PASS rule), gas leak safety, electrical protocols (LOTO), machinery safeguards, and AR training modules. Please feel free to ask any safety or training question!",
  hi: "मैं सुरक्षा साथी हूँ, आपका AI सुरक्षा और तकनीकी सहायक। मैं कार्यस्थल सुरक्षा, PPE मानकों, अग्नि सुरक्षा (PASS नियम), गैस रिसाव प्रोटोकॉल, विद्युत सुरक्षा (LOTO), मशीनरी सुरक्षा और AR ट्रेनिंग से संबंधित आपके सभी प्रश्नों का उत्तर देने के लिए यहाँ हूँ। कृपया अपना प्रश्न पूछें!",
  hinglish: "Main hoon Suraksha Saathi, aapka AI Safety & Technical Assistant! Industrial safety, PPE guidelines, fire response, gas leak emergency, electrical safety (LOTO), machine guarding aur AR training modules se jude kisi bhi sawal ke liye main aapki madad kar sakta hoon. Kripya apna sawal poochein!",
  sat: "ᱤᱧ ᱫᱚ ᱥᱩᱨᱠᱷᱟ ᱥᱟᱛᱷᱤ (Suraksha Saathi) ᱠᱟᱹᱱᱟᱹᱧ᱾ ᱠᱟᱹᱨᱜᱟᱲ ᱨᱩᱠᱷᱤᱭᱟᱹ, PPE, ᱥᱮᱸᱜᱮᱞ, ᱜᱮᱥ ᱞᱤᱠ, ᱵᱤᱡᱽᱞᱤ ᱟᱨ AR ᱴᱨᱮᱱᱤᱝ ᱵᱟᱵᱚᱛ ᱡᱚᱛᱚ ᱞᱮᱠᱟᱱ ᱠᱩᱠᱞᱤ ᱨᱮᱱᱟᱜ ᱛᱮᱞᱟ ᱮᱢ ᱫᱟᱲᱮᱭᱟᱜ-ᱟᱹᱧ᱾ ᱟᱢᱟᱜ ᱠᱩᱠᱞᱤ ᱠᱩᱞᱤᱭ ᱢᱮ᱾",
};

// ─── CRITICAL HAZARD GUARDRAILS ───────────────────────────────────────────────
export function checkCriticalHazardGuardrails(input, lang = 'en') {
  if (!input) return null;
  const lower = input.toLowerCase();

  // 1. Water on electrical fire
  const hasWater = lower.includes('water') || lower.includes('pani') || lower.includes('paani') || lower.includes('पानी') || lower.includes('ᱫᱟᱜ');
  const hasElectric = lower.includes('electric') || lower.includes('bijli') || lower.includes('bijlee') || lower.includes('current') || lower.includes('बिजली') || lower.includes('विद्युत') || lower.includes('ᱵᱤᱡᱽᱞᱤ');
  if (hasWater && hasElectric) {
    return {
      answer: {
        en: "⚠️ CRITICAL SAFETY WARNING: NEVER USE WATER ON ELECTRICAL FIRES!\n\n• Water conducts electricity and causes fatal electrocution!\n• Immediate Action: Cut the main power breaker if safe to reach.\n• Extinguisher: Use ONLY CO₂ (Black band) or Dry Powder (Blue band).\n• Emergency Helpline: Call 101 (Fire) or 112 immediately.",
        hi: "⚠️ अति-गंभीर सुरक्षा चेतावनी: बिजली की आग पर कभी भी पानी न डालें!\n\n• पानी बिजली का सुचालक है जिससे जानलेवा करंट (Electrocution) लग सकता है!\n• तुरंत कार्रवाई: यदि सुरक्षित हो तो मुख्य पावर सप्लाई बंद करें।\n• अग्निशामक: केवल CO₂ (काला बैंड) या सूखा पाउडर (नीला बैंड) का प्रयोग करें।\n• आपातकालीन नंबर: तुरंत 101 या 112 पर कॉल करें।",
        hinglish: "⚠️ CRITICAL DANGER: Bijli ki aag par Paani KABHI NA DALEIN!\n\n• Paani current conduct karta hai jisse jaanleva bijli ka jhatka (electrocution) lag sakta hai!\n• Turant action: Agar safe ho toh main power MCB/switch off karein.\n• Kaunsa extinguisher: Sirf CO₂ (Black) ya Dry Powder (Blue) use karein.\n• Emergency Helpline: Turant 101 (Fire) ya 112 par call karein.",
        sat: "⚠️ ᱟᱹᱰᱤ ᱵᱚᱛᱚᱨᱟᱱ ᱪᱮᱛᱟᱣᱱᱤ: ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱫᱟᱜ ᱛᱤᱥ ᱦᱚᱸ ᱟᱞᱚᱢ ᱫᱩᱞᱟ!\n\n• ᱫᱟᱜ ᱫᱚ ᱵᱤᱡᱽᱞᱤ ᱯᱟᱨᱚᱢᱟ, ᱡᱟᱦᱟᱸᱛᱮ ᱡᱤᱣᱤ ᱪᱟᱞᱟᱜ ᱨᱮᱭᱟᱜ ᱵᱚᱛᱚᱨ ᱢᱮᱱᱟᱜᱼᱟ!\n• ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱤᱡ: ᱠᱷᱟᱹᱞᱤ CO₂ (ᱦᱮᱸᱫᱮ) ᱥᱮ ᱨᱚᱦᱚᱲ ᱜᱩᱸᱰᱟᱹ ᱵᱮᱵᱷᱟᱨ ᱢᱮ᱾"
      }[lang] || "⚠️ CRITICAL SAFETY WARNING: NEVER USE WATER ON ELECTRICAL FIRES!",
      source: 'CRITICAL HAZARD INTERVENTION (IS / OSHA Safety Standard)',
      confidence: 1.0,
      isCritical: true,
    };
  }

  // 2. Clothing on fire: STOP, DROP & ROLL (never run)
  const hasClothing = lower.includes('cloth') || lower.includes('kapde') || lower.includes('kapdo') || lower.includes('कपड़ों') || lower.includes('ᱞᱩᱜᱽᱲᱤ');
  const hasFire = lower.includes('fire') || lower.includes('aag') || lower.includes('jal') || lower.includes('आग') || lower.includes('ᱥᱮᱸᱜᱮᱞ');
  if (hasClothing && hasFire) {
    return {
      answer: {
        en: "⚠️ EMERGENCY: IF CLOTHING CATCHES FIRE — DO NOT RUN!\n\n1. STOP: Running fans the flames with oxygen and worsens burns.\n2. DROP: Drop flat to the ground and cover your face with your hands.\n3. ROLL: Roll back and forth continuously to smother the fire.\n• Use a heavy fire blanket or douse with water only after flames are out.\n• Call 108 (Ambulance) / 101 immediately.",
        hi: "⚠️ आपातकाल: यदि कपड़ों में आग लग जाए — कभी न दौड़ें!\n\n1. रुकें (STOP): दौड़ने से हवा मिलती है और आग तेजी से फैलती है।\n2. झुकें/लेटें (DROP): तुरंत जमीन पर पेट के बल लेट जाएं और हाथों से चेहरा ढकें।\n3. लुढ़कें (ROLL): जमीन पर आगे-पीछे तब तक लुढ़कें जब तक आग बुझ न जाए।\n• एम्बुलेंस के लिए तुरंत 108 या 112 पर कॉल करें।",
        hinglish: "⚠️ EMERGENCY: Kapdon mein aag lagne par KABHI NA BHAGEIN!\n\n1. STOP (Ruk jayein): Bhaagne se hawa milti hai aur aag aur bhadak jati hai.\n2. DROP (Zameen par let jayein): Turant zameen par let kar apne chehre ko haathon se cover karein.\n3. ROLL (Gol-gol ghoomein): Zameen par aage-peeche roll karein taaki aag dab kar bujh jaye.\n• Turant 108 (Ambulance) aur 101 (Fire) par call karein.",
        sat: "⚠️ ᱟᱯᱟᱛᱠᱟᱞ: ᱞᱩᱜᱽᱲᱤ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣ ᱞᱮᱱᱠᱷᱟᱱ — ᱟᱞᱚᱢ ᱫᱟᱹᱲᱟ! ᱛᱤᱸᱜᱩᱱ ᱢᱮ (STOP), ᱚᱛ ᱨᱮ ᱜᱤᱛᱤᱡ ᱢᱮ (DROP), ᱟᱨ ᱞᱩᱵᱩᱲ-ᱞᱩᱵᱩᱲ ᱜᱩᱞᱟᱹᱭᱚᱜ ᱢᱮ (ROLL)᱾"
      }[lang] || "⚠️ EMERGENCY: IF CLOTHING CATCHES FIRE — DO NOT RUN! STOP, DROP & ROLL.",
      source: 'CRITICAL HAZARD INTERVENTION (National Fire Protection Standard)',
      confidence: 1.0,
      isCritical: true,
    };
  }

  // 3. Electrical switch / phone / lighter during gas leak
  const hasGas = lower.includes('gas') || lower.includes('cylinder') || lower.includes('गैस') || lower.includes('ᱜᱮᱥ');
  const hasIgnition = lower.includes('switch') || lower.includes('lighter') || lower.includes('spark') || lower.includes('maachis') || lower.includes('match') || lower.includes('phone') || lower.includes('स्विच');
  if (hasGas && hasIgnition) {
    return {
      answer: {
        en: "⚠️ CRITICAL EXPLOSION HAZARD:\n\n• NEVER flick any light switches, electrical switches, or use mobile phones in a gas leak zone!\n• Even an invisible tiny electrical contact spark can detonate accumulated flammable gas (LPG, Methane, Acetylene).\n• Action: Evacuate immediately upwind, shout warnings, and alert the control room from a safe distance outdoors.",
        hi: "⚠️ अति-गंभीर विस्फोट का खतरा:\n\n• गैस रिसाव वाले क्षेत्र में कोई भी बिजली का स्विच ऑन/ऑफ न करें और न ही मोबाइल फोन का उपयोग करें!\n• स्विच से निकलने वाली एक छोटी सी चिंगारी भी जमा गैस में भीषण विस्फोट कर सकती है।\n• कार्रवाई: तुरंत हवा के विपरीत दिशा (Upwind) में बाहर निकलें और सुरक्षित दूरी से अलार्म बजाएं।",
        hinglish: "⚠️ DANGER: Gas leak area mein koi bhi Electric Switch ON ya OFF na karein!\n\n• Switch dabane par choti si invisible spark (chingari) se poora gas cloud dhamaka (explosion) kar sakta hai!\n• Mobile phone bhi use na karein.\n• Upwind safe open area mein bhagein aur door jakar alarm bajayein.",
        sat: "⚠️ ᱵᱚᱛᱚᱨᱟᱱ ᱯᱷᱩᱴᱟᱹᱣ ᱦᱟᱞᱚᱛ: ᱜᱮᱥ ᱞᱤᱠ ᱴᱷᱟᱶ ᱨᱮ ᱵᱤᱡᱽᱞᱤ ᱥᱩᱭᱤᱪ ᱚᱱ/ᱚᱯᱷ ᱟᱨ ᱢᱳᱵᱟᱭᱤᱞ ᱯᱷᱳᱱ ᱛᱤᱥ ᱦᱚᱸ ᱟᱞᱚᱢ ᱵᱮᱵᱷᱟᱨᱟ! ᱩᱥᱟᱹᱨᱟ ᱦᱚᱭ ᱩᱞᱴᱟᱹ ᱥᱮᱫ ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠᱚᱜ ᱢᱮ᱾"
      }[lang] || "⚠️ CRITICAL EXPLOSION HAZARD: DO NOT OPERATE SWITCHES OR PHONES IN GAS LEAKS!",
      source: 'CRITICAL HAZARD INTERVENTION (IS / OSHA Standard)',
      confidence: 1.0,
      isCritical: true,
    };
  }

  // 4. Loose gloves / clothing near rotating machinery / lathes
  const hasMachine = lower.includes('lathe') || lower.includes('drill') || lower.includes('rotating') || lower.includes('machine') || lower.includes('मशीन') || lower.includes('ᱢᱮᱥᱤᱱ');
  const hasLoose = lower.includes('loose') || lower.includes('dheela') || lower.includes('dheele') || lower.includes('ढीले');
  if (hasMachine && hasLoose) {
    return {
      answer: {
        en: "⚠️ SEVERE AMPUTATION & ENTANGLEMENT HAZARD:\n\n• NEVER wear loose-fitting gloves, loose sleeves, neckties, hanging jewelry, or untied long hair near rotating shafts, lathe spindles, drills, or rollers!\n• Rotating machinery can snatch loose fabric in milliseconds, dragging hands and arms into the pinch point causing catastrophic crushing or amputation.\n• Rule: Keep sleeves rolled tight, hair tucked into cap, and use bare hands or snug mechanical-grip gloves only where approved.",
        hi: "⚠️ गंभीर अंग-भंग (Amputation) की चेतावनी:\n\n• घूमने वाली मशीनों (लेथ, ड्रिल, कन्वेयर, रोलर) के पास कभी भी ढीले दस्ताने, ढीले कपड़े, टाई या खुले बाल न रखें!\n• मशीन का स्पिंडल मिलीसेकंड में कपड़े को खींचकर हाथ को मशीन के अंदर खींच लेता है।\n• नियम: बाहें ऊपर मोड़ें, बाल टोपी में बांधें और सुरक्षा गार्ड लगे होने पर ही काम करें।",
        hinglish: "⚠️ DANGER: Ghoomne wali machine (Lathe, Drill, Roller) ke paas Dheele Gloves ya Dheele Kapde KABHI NA PEHNEIN!\n\n• Ghoomta hua spindle kapde ya dheele glove ko pakad kar ek second ke 10ve hisse mein haath ko andar kheench leta hai, jisse amputation (haath katne) ka khatra hota hai.\n• Hamesha sleeves tight karein, baal bandhein aur machine guards hamesha lagaye rakhein.",
        sat: "⚠️ ᱟᱹᱰᱤ ᱢᱟᱨᱟᱝ ᱵᱚᱛᱚᱨ: ᱟᱹᱪᱩᱨᱚᱜ ᱠᱟᱱ ᱢᱮᱥᱤᱱ (Lathe, Drill) ᱥᱩᱨ ᱨᱮ ढीला ᱞᱩᱜᱽᱲᱤ ᱥᱮ ᱢᱳᱡᱟ ᱟᱞᱚᱢ ᱦᱚᱨᱚᱜᱟ! ᱛᱤ ᱚᱨ ᱵᱚᱞᱚ ᱠᱟᱛᱮ ᱨᱟᱹᱯᱩᱫ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ᱾"
      }[lang] || "⚠️ DANGER: LOOSE GLOVES OR CLOTHING ARE FORBIDDEN NEAR ROTATING MACHINERY!",
      source: 'CRITICAL HAZARD INTERVENTION (IS 9474 / OSHA 1910.212)',
      confidence: 1.0,
      isCritical: true,
    };
  }

  // 5. Cracked helmet repair with tape
  const hasHelmet = lower.includes('helmet') || lower.includes('topi') || lower.includes('हेलमेट') || lower.includes('ᱦᱮᱞᱢᱮᱴ');
  const hasTapeOrGlue = lower.includes('tape') || lower.includes('glue') || lower.includes('fevikwik') || lower.includes('fevi') || lower.includes('chipka') || lower.includes('टेप');
  if (hasHelmet && hasTapeOrGlue) {
    return {
      answer: {
        en: "⚠️ DANGEROUS PPE PRACTICE:\n\n• NEVER repair a cracked, punctured, or severely impacted safety helmet with tape, glue, or adhesives!\n• Adhesives contain chemicals that weaken the polycarbonate/HDPE shell structure, and tape provides ZERO structural impact absorption against falling objects.\n• Action: Immediately decommission the damaged helmet and issue a new certified IS 2925 / EN 397 safety hard hat.",
        hi: "⚠️ खतरनाक PPE प्रथा:\n\n• टूटे या चटके हुए सेफ्टी हेलमेट को कभी भी टेप या गोंद से ठीक करके न पहनें!\n• गोंद के केमिकल हेलमेट की प्लास्टिक को कमजोर करते हैं और टेप सिर पर गिरने वाली भारी वस्तु से बिल्कुल रक्षा नहीं कर सकता।\n• कार्रवाई: तुरंत इस हेलमेट को नष्ट करें और नया IS 2925 प्रमाणित हेलमेट प्राप्त करें।",
        hinglish: "⚠️ DANGER: Toote ya crack hue helmet par Tape ya Fevikwik lagakar KABHI USE NA KAREIN!\n\n• Tape se impact absorption khatam ho jati hai aur upar se patthar ya loha girne par sar mein seedha fractured ho sakta hai.\n• Turant store se naya certified IS 2925 safety hard hat issue karwayein.",
        sat: "⚠️ ᱵᱟᱹᱲᱤᱡ PPE ᱵᱮᱵᱷᱟᱨ: ᱨᱟᱹᱯᱩᱫ ᱦᱮᱞᱢᱮᱴ ᱨᱮ ᱴᱮᱯ ᱞᱟᱜᱟᱣ ᱠᱟᱛᱮ ᱛᱤᱥ ᱦᱚᱸ ᱟᱞᱚᱢ ᱦᱚᱨᱚᱜᱟ! ᱱᱟᱶᱟ IS 2925 ᱦᱮᱞᱢᱮᱴ ᱦᱟᱛᱟᱣ ᱢᱮ᱾"
      }[lang] || "⚠️ DANGER: NEVER REPAIR CRACKED HELMETS WITH TAPE!",
      source: 'CRITICAL HAZARD INTERVENTION (IS 2925 / EN 397 Standard)',
      confidence: 1.0,
      isCritical: true,
    };
  }

  // 6. Water on burning oil / grease / cooking fire
  const hasOil = lower.includes('oil') || lower.includes('grease') || lower.includes('tel') || lower.includes('petrol') || lower.includes('diesel') || lower.includes('तेल');
  if (hasWater && hasOil && (lower.includes('fire') || lower.includes('aag') || lower.includes('आग'))) {
    return {
      answer: {
        en: "⚠️ SEVERE EXPLOSION HAZARD:\n\n• NEVER throw water on an oil, grease, petrol, or kitchen oil fire (Class B / Class F)!\n• Water boils instantly under hot burning oil and vaporizes violently, throwing flaming oil into a massive fireball (BLEVE/steam explosion)!\n• Correct Action: Turn off burner/fuel, slide a lid or Fire Blanket over the pan to smother it, or use a Class F (Wet Chemical) / Foam extinguisher.",
        hi: "⚠️ भीषण आग का खतरा:\n\n• जलते तेल, पेट्रोल, ग्रीस या रसोई के तेल की आग पर कभी भी पानी न डालें!\n• पानी तेल के नीचे जाते ही भाप बनकर फटता है जिससे जलता हुआ तेल चारों तरफ फैल जाता है।\n• सही तरीका: आग पर अग्निरोधक कंबल (Fire Blanket) डालें, ढक्कन से ढकें या फोम/गीले रासायनिक अग्निशामक का उपयोग करें।",
        hinglish: "⚠️ DANGER: Tel, Petrol ya Grease ki aag par Paani KABHI NA DALEIN!\n\n• Tel ke andar paani dalne se bhayanak fireball aur blast hota hai kyunki paani garam tel se bhaap bankar fhat padta hai.\n• Sahi tareeka: Fire blanket daal kar aag dhabayein, dhakkan se dhakein ya Foam/Wet Chemical extinguisher use karein.",
        sat: "⚠️ ᱵᱚᱛᱚᱨᱟᱱ ᱥᱮᱸᱜᱮᱞ: ᱥᱩᱱᱩᱢ ᱥᱮ ᱯᱮᱴᱨᱳᱞ ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱫᱟᱜ ᱟᱞᱚᱢ ᱫᱩᱞᱟ! ᱱᱚᱶᱟ ᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱟᱨᱦᱚᱸ ᱯᱷᱩᱴᱟᱹᱣ ᱠᱟᱛᱮ ᱯᱟᱥᱱᱟᱣᱜᱼᱟ᱾"
      }[lang] || "⚠️ DANGER: NEVER USE WATER ON OIL OR GREASE FIRES!",
      source: 'CRITICAL HAZARD INTERVENTION (IS 2190 Standard)',
      confidence: 1.0,
      isCritical: true,
    };
  }

  return null;
}

// ─── HINGLISH & PHONETIC NORMALIZATION DICTIONARY ─────────────────────────────
const HINGLISH_EXPANSIONS = {
  'aag': 'fire explosion',
  'bujhana': 'extinguish',
  'bujhaye': 'extinguish',
  'extingush': 'extinguisher',
  'cylinder': 'cylinder fire gas',
  'dhuan': 'smoke ventilation',
  'dhuwa': 'smoke ventilation',
  'jhulas': 'burn injury first aid',
  'jal': 'burn fire',
  'bijli': 'electrical high voltage shock',
  'bijlee': 'electrical shock current',
  'current': 'electric current shock electrocution',
  'shock': 'electric shock medical aid',
  'badbu': 'gas leak smell detection odor',
  'resav': 'gas leak emission',
  'risav': 'gas leak emission',
  'topi': 'helmet hard hat head protection',
  'chashma': 'safety goggles eye face shield',
  'chasma': 'goggles eye protection glasses',
  'dastane': 'gloves hand protection nitrile leather',
  'dastana': 'gloves hand protection',
  'juta': 'safety boots steel toe footwear',
  'joota': 'safety boots footwear',
  'jutey': 'safety boots footwear',
  'fhat': 'damaged torn ppe replace shoes',
  'fat': 'damaged ppe discard',
  'toot': 'broken damaged helmet replace',
  'patta': 'belt conveyor pinch point machine guard',
  'lathe': 'lathe machine rotating hazard chuck',
  'koyla': 'coal mine dgms explosion methane',
  'khadan': 'mining underground dgms ventilation',
  'dhasav': 'strata fall roof fall mine collapse',
  'pramanpatra': 'certificate blockchain qr verify',
  'ank': 'score assessment marks percentage',
  'pariksha': 'assessment quiz test evaluation',
  'camera': 'ar mode camera permission webcam',
};

function normalizeQuery(text) {
  let normalized = text.toLowerCase();
  for (const [key, expansion] of Object.entries(HINGLISH_EXPANSIONS)) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    if (regex.test(normalized)) {
      normalized += ' ' + expansion;
    }
  }
  return normalized;
}

// ─── EXTENSIVE SAFETY KNOWLEDGE REPOSITORY ──────────────────────────────────
export const KNOWLEDGE_BASE = [
  // ──────────────────────────────────────────────────────────────────────────
  // 1. GREETINGS & INTRODUCTIONS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'greeting',
    module: MODULES.GLOBAL,
    keywords: [
      'hello', 'hey', 'namaste', 'namaskar', 'pranam', 'good morning', 'good afternoon', 'good evening',
      'help', 'start', 'suraksha saathi', 'नमस्ते', 'नमस्कार', 'मदद', 'हॅलो', 'kya kar sakte ho', 'kaise ho',
      'ᱡᱚᱦᱟᱨ', 'ᱜᱚᱲᱚ'
    ],
    // Only whole-word matches for short tokens
    shortKeywords: ['hi', 'hii'],
    answer_en: "👷 Hello! I am your Suraksha Saathi AI Safety Assistant.\n\nI can provide verified guidance on:\n• 🔴 Fire safety, extinguisher types & PASS rule\n• ⚡ High-voltage electrical safety & LOTO (Lockout/Tagout)\n• 🦺 PPE standards, inspection & hazard gear\n• 💨 Gas leak detection, SCBA & Confined Space buddy system\n• ⚙️ Machinery guarding & rotating equipment hazards\n• ⛏️ Mining safety (DGMS) & underground escape protocols\n• 🚪 Evacuation pathways, muster points & emergency roll call\n• 📜 SurakshaAR platform: AR modules, scoring & certificates\n• 📞 Emergency helplines (101, 108, 112, 100)\n\nWhat safety topic or scenario would you like to explore?",
    answer_hi: "👷 नमस्ते! मैं आपका सुरक्षा साथी AI सुरक्षा सहायक हूँ।\n\nमैं निम्न पर प्रमाणित सुरक्षा मार्गदर्शन दे सकता हूँ:\n• 🔴 अग्निशामक के प्रकार और PASS नियम\n• ⚡ हाई-वोल्टेज बिजली सुरक्षा और LOTO प्रक्रिया\n• 🦺 PPE मानक, निरीक्षण और सही उपकरण का चयन\n• 💨 गैस रिसाव की पहचान, SCBA और बडी सिस्टम\n• ⚙️ मशीन सुरक्षा गार्ड और घूमने वाले पार्ट्स से बचाव\n• ⛏️ खान सुरक्षा (DGMS) और निकासी प्रक्रिया\n• 📜 SurakshaAR AR ट्रेनिंग, असेसमेंट और सर्टिफिकेट\n• 📞 आपातकालीन नंबर (101, 108, 112, 100)\n\nआप किस सुरक्षा विषय के बारे में जानना चाहते हैं?",
    answer_hinglish: "👷 Namaste! Main aapka Suraksha Saathi AI Safety Assistant hoon.\n\nAap mujhse in zaroori industrial safety topics par guidance le sakte hain:\n• 🔴 Fire safety, extinguishers ke types aur PASS formula\n• ⚡ Electrical safety, short-circuit aur LOTO protocol\n• 🦺 PPE gear standards, inspection aur damage hone par kya karein\n• 💨 Gas leak detection, SCBA aur Confined Space buddy system\n• ⚙️ Machine guarding aur rotating tools se bachaav\n• ⛏️ Mining safety (DGMS rules) aur underground escape\n• 📜 SurakshaAR training modules, AR mode, score aur certificate\n• 📞 Emergency helpline numbers (101, 108, 112)\n\nAapko kis safety topic par guidance chahiye?",
    answer_sat: "👷 ᱡᱚᱦᱟᱨ! ᱤᱧ ᱟᱢᱤᱡ ᱥᱩᱨᱠᱷᱟ ᱥᱟᱛᱷᱤ (Suraksha Saathi) ᱠᱟᱹᱱᱟᱹᱧ᱾\n\nᱟᱢ ᱤᱧ ᱱᱚᱶᱟ ᱠᱚ ᱵᱟᱵᱚᱛ ᱠᱩᱞᱤ ᱫᱟᱲᱮᱭᱟᱹᱧᱟ:\n• 🔴 ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱤᱡ ᱟᱨ PASS ᱱᱤᱭᱟᱹᱢ\n• ⚡ ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ ᱟᱨ LOTO ᱨᱩᱠᱷᱤᱭᱟᱹ\n• 🦺 PPE ᱥᱩᱨᱠᱷᱟ ᱥᱟᱢᱟᱱ ᱟᱨ ᱵᱮᱵᱷᱟᱨ\n• 💨 ᱜᱮᱥ ᱞᱤᱠ ᱟᱨ ᱵᱟᱰᱤ ᱥᱤᱥᱴᱚᱢ\n• ⚙️ ᱠᱟᱹᱨᱜᱟᱲ ᱢᱮᱥᱤᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ\n• 📜 SurakshaAR ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱟᱨ ᱴᱨᱮᱱᱤᱝ\n• 📞 ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱦᱮᱞᱯᱞᱟᱭᱤᱱ ᱱᱚᱢᱵᱚᱨ (᱑᱐᱑, ᱑᱐᱘, ᱑᱑᱒)᱾",
  },
  {
    id: 'who_are_you',
    module: MODULES.GLOBAL,
    keywords: [
      'who are you', 'who r u', 'who made you', 'who created you', 'what are you',
      'tell me about yourself', 'introduce yourself', 'tum kaun ho', 'aap kaun ho',
      'koun ho', 'kaun ho', 'kya ho', 'kya karte ho', 'kya kaam hai', 'who is suraksha saathi',
      'about you', 'about suraksha saathi', 'who is this'
    ],
    answer_en: "🤖 **I am Suraksha Saathi**, your intelligent AI Safety & Engineering Assistant built for the **SurakshaAR** platform.\n\n### What I Can Do:\n1. 🦺 **Workplace & Industrial Safety**: Complete guidelines on PPE standards (IS/OSHA), hazard zones, and inspection.\n2. 🔴 **Fire & Disaster Response**: Extinguisher types (PASS rule), evacuation pathways, and fire classes.\n3. ⚡ **Electrical Safety & LOTO**: High-voltage procedures, arc flash safety, and lock-out/tag-out steps.\n4. 💨 **Gas Leak & Confined Space**: Gas detection thresholds, SCBA equipment, and safety watch protocols.\n5. 📜 **SurakshaAR Platform Navigation**: AR simulations, interactive quiz assessments, scoring, and blockchain certificates.\n6. 🧠 **Industrial Safety & Engineering Knowledge**: I explain safety concepts, hazard prevention, plant SOPs, emergency response sequences, and AR training steps in clear detail!",
    answer_hi: "🤖 **मैं सुरक्षा साथी हूँ**, SurakshaAR प्लेटफ़ॉर्म का बुद्धिमान AI सुरक्षा एवं तकनीकी सहायक।\n\n### मैं आपकी क्या सहायता कर सकता हूँ:\n1. 🦺 **औद्योगिक सुरक्षा**: PPE मानक (IS/OSHA), खतरा क्षेत्र और निरीक्षण नियम।\n2. 🔴 **अग्नि सुरक्षा**: अग्निशामक के प्रकार (PASS नियम), निकासी प्रक्रिया और आग के वर्ग।\n3. ⚡ **विद्युत सुरक्षा और LOTO**: हाई-वोल्टेज प्रोटोकॉल, आर्क फ्लैश और 6-चरणीय तालाबंदी।\n4. 💨 **गैस रिसाव और सीमित स्थान**: गैस सीमाएं, SCBA उपकरण और बडी सिस्टम।\n5. 📜 **SurakshaAR प्लेटफ़ॉर्म**: AR ट्रेनिंग, स्कोरिंग, असेसमेंट और वेरिफाइड सर्टिफिकेट।\n6. 🧠 **सुरक्षा एवं तकनीकी मार्गदर्शन**: किसी भी औद्योगिक सुरक्षा, आपातकालीन उपाय और प्लांट नियमों का सरल एवं स्पष्ट उत्तर!",
    answer_hinglish: "🤖 **Main Suraksha Saathi hoon**, aapka smart AI Safety & Technical Assistant!\n\n### Main aapki in cheezon mein madad kar sakta hoon:\n1. 🦺 **Plant & Industrial Safety**: PPE selection, inspection aur safety standard rules.\n2. 🔴 **Fire & Emergency Response**: PASS formula, cylinder selection aur evacuation roadmap.\n3. ⚡ **Electrical Safety & LOTO**: High-voltage isolations aur 6-step lockout/tagout.\n4. 💨 **Gas Leak & Confined Space**: 4-gas monitoring, SCBA kab pehnein aur buddy system.\n5. 📜 **SurakshaAR Training**: AR mode mein practice, assessment pass karna aur certificate download karna.\n6. 🧠 **Safety Guidance**: Industrial safety, plant SOPs aur safety precautions par clear step-by-step guidance!",
    answer_sat: "🤖 ᱤᱧ ᱫᱚ ᱥᱩᱨᱠᱷᱟ ᱥᱟᱛᱷᱤ (Suraksha Saathi) ᱠᱟᱹᱱᱟᱹᱧ᱾ ᱠᱟᱹᱨᱜᱟᱲ ᱨᱩᱠᱷᱤᱭᱟᱹ, PPE, ᱥᱮᱸᱜᱮᱞ ᱟᱨ SurakshaAR ᱴᱨᱮᱱᱤᱝ ᱨᱮ ᱜᱚᱲᱚ ᱮᱢ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ᱾",
  },
  {
    id: 'what_is_surakshaar',
    module: MODULES.PLATFORM,
    keywords: [
      'what is surakshaar', 'surakshaar kya hai', 'surakshaar kya h', 'surakshaar ke baare mein',
      'about surakshaar', 'about platform', 'surakshaar features', 'what does this website do',
      'what is this app', 'website kya karti hai'
    ],
    answer_en: "🛡️ **SurakshaAR** is an immersive industrial safety training platform designed to eliminate workplace accidents in high-risk environments through hands-on Augmented Reality (AR).\n\n### Core Platform Features:\n• 👓 **Immersive AR Simulations**: Practice real emergency response (Fire & Explosion, Gas Leak, PPE Inspection, High-Voltage Electrical, Machinery Safety) safely in 3D/AR.\n• 🎯 **Interactive Real-time Assessment**: Evaluates reaction time, hazard identification accuracy, and adherence to safety protocols.\n• 🏆 **Performance Scoring & Blockchain Certificates**: Verifiable safety credentials recorded securely to validate workforce readiness.\n• 🌐 **Quad-lingual & Accessible**: Available in English, हिंदी, Hinglish, and ᱥᱟᱱᱛᱟᱲᱤ with voice TTS and high-contrast modes.\n• 🤖 **Suraksha Saathi AI**: 24/7 intelligent assistance for safety guidelines, hazard SOPs, and quiz assistance.",
    answer_hi: "🛡️ **SurakshaAR** एक संवर्धित वास्तविकता (Augmented Reality) आधारित औद्योगिक सुरक्षा प्रशिक्षण प्लेटफ़ॉर्म है।\n\n### प्रमुख विशेषताएं:\n• 👓 **इमर्सिव AR प्रशिक्षण**: आग, गैस रिसाव, PPE, और हाई-वोल्टेज विद्युत खतरों का बिना वास्तविक खतरे के सुरक्षित 3D/AR अभ्यास।\n• 🎯 **इंटरैक्टिव असेसमेंट**: प्रतिक्रिया समय और सुरक्षा नियमों के पालन का सटीक मूल्यांकन।\n• 🏆 **प्रमाणित सर्टिफिकेट**: परीक्षा उत्तीर्ण करने पर डिजिटल सत्यापन योग्य सुरक्षा प्रमाणपत्र।\n• 🌐 **बहुभाषी समर्थन**: अंग्रेजी, हिंदी, हिंग्लिश और संथाली (ऑल चिकी) में उपलब्ध।\n• 🤖 **सुरक्षा साथी AI**: 24/7 बुद्धिमान सुरक्षा सहायता।",
    answer_hinglish: "🛡️ **SurakshaAR** ek modern Augmented Reality (AR) safety training platform hai jo industrial workers aur trainees ko bina real risk ke emergency training deta hai.\n\n### Main Features:\n• 👓 **3D AR Training**: Fire explosion, gas leak, PPE inspection aur high-voltage switchyard ko AR mein practice karein.\n• 🎯 **Live Scoring & Quiz**: Har action aur safety step ka real-time evaluation hota hai.\n• 🏆 **Verified Certificate**: Module complete hone par professional safety certificate milta hai.\n• 🌐 **Multi-language Support**: English, Hindi, Hinglish aur Santali bhashaon mein available.\n• 🤖 **Suraksha Saathi AI**: Har samay live guidance aur sawalon ke answers dene ke liye ready!",
    answer_sat: "🛡️ **SurakshaAR** ᱫᱚ ᱢᱤᱫ AR (Augmented Reality) ᱴᱨᱮᱱᱤᱝ ᱯᱞᱮᱴᱯᱷᱳᱨᱢ ᱠᱟᱱᱟ ᱡᱟᱦᱟᱸᱨᱮ ᱥᱮᱸᱜᱮᱞ, ᱜᱮᱥ ᱟᱨ ᱵᱤᱡᱽᱞᱤ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱟᱵᱚᱛ ᱥᱮᱪᱮᱫ ᱧᱟᱢᱚᱜᱼᱟ᱾",
  },
  {
    id: 'ai_general_explainer',
    module: MODULES.GLOBAL,
    keywords: [
      'how do you answer', 'general questions', 'clear answer', 'explain clearly',
      'kaise kaam karte ho', 'kya bata sakte ho', 'safety assistant role'
    ],
    answer_en: "💡 **How I Answer Your Questions:**\n\n1. **Industrial Safety & SOPs**: For all safety, hazard, and emergency questions, I provide certified protocols adhering strictly to IS, OSHA, DGMS, and NFPA standards.\n2. **Direct & Actionable Guidance**: Every explanation is structured with bold highlights, bullet points, and step-by-step instructions so you can grasp it instantly.\n3. **Practical Examples**: Real plant scenarios, color codes, inspection checklists, and dos & don'ts.\n\nAsk me any question in English, Hindi, Hinglish, or Santali!",
    answer_hi: "💡 **मैं आपके सवालों का उत्तर कैसे देता हूँ:**\n\n1. **औद्योगिक सुरक्षा मानक**: सभी सुरक्षा और आपातकालीन सवालों के लिए मैं IS, OSHA और DGMS मानकों के अनुसार प्रमाणित उत्तर देता हूँ।\n2. **चरणबद्ध और स्पष्ट संरचना**: प्रत्येक उत्तर में मुख्य बिंदु, चरणबद्ध निर्देश और व्यावहारिक उदाहरण शामिल होते हैं।\n3. **व्यावहारिक उपाय**: कारखाने के वास्तविक परिदृश्य, रंग कोड, निरीक्षण चेकलिस्ट और सावधानियां।\n\nआप किसी भी भाषा (English, Hindi, Hinglish, Santali) में कोई भी प्रश्न पूछ सकते हैं!",
    answer_hinglish: "💡 **Main aapke har sawal ka answer kaise deta hoon:**\n\n1. **Industrial Safety & Standards**: Safety, fire, gas, PPE aur electrical se jude sawalon ke liye IS aur OSHA ke verified standard answers turant deta hoon.\n2. **Easy & Clear Structure**: Har answer mein headings, bullet points aur step-by-step points hote hain taaki aapko aasani se samajh aaye.\n3. **Plant Guidelines**: Factory floor ki reality, dos & don'ts aur emergency actions simple shabdon mein explain karta hoon.\n\nAap English, Hindi, Hinglish ya Santali mein koi bhi sawal pooch sakte hain!",
    answer_sat: "💡 ᱤᱧ ᱡᱚᱛᱚ ᱠᱩᱠᱞᱤ ᱨᱮᱱᱟᱜ ᱥᱟᱹᱨᱤ ᱟᱨ ᱯᱩᱥᱴᱟᱹᱣ ᱛᱮᱞᱟᱧ ᱮᱢᱟ᱾",
  },
  {
    id: 'general_safety_tips',
    module: MODULES.GLOBAL,
    keywords: [
      'safety tips', 'safety rules', 'factory rules', 'suraksha niyam', 'plant safety',
      'safety tips batao', 'kya dhyan rakhein', 'safety tips kya hai', 'tips', 'precautions',
      'savdhani', 'suraksha ke niyam', 'rules of safety', 'golden rules', 'ᱱᱤᱭᱟᱹᱢ'
    ],
    answer_en: "🛡️ **Golden Safety Rules for the Workplace / Factory Floor:**\n\n1. 🦺 **Always Wear Mandatory PPE**: Never enter working areas without hard hat (IS 2925), steel-toe boots (IS 15298), and eye protection.\n2. 🚫 **Never Bypass Machine Guards**: Keep safety interlocks and shields engaged at all times.\n3. ⚡ **Observe LOTO (Lockout/Tagout)**: Always de-energize and lock equipment before maintenance or cleaning.\n4. 🚪 **Keep Emergency Routes Clear**: Fire doors, extinguishers, and eyewash stations must never be blocked.\n5. ⚠️ **Report Near-Misses Immediately**: Inform your safety officer or supervisor about any potential hazard before an accident occurs.\n6. 🧹 **Good Housekeeping**: Keep floors clean and dry to eliminate slips, trips, and falls.\n\nSafety is not an option — it is our first priority!",
    answer_hi: "🛡️ **कार्यस्थल और कारखाने के सुनहरे सुरक्षा नियम (Golden Rules):**\n\n1. 🦺 **अनिवार्य PPE हमेशा पहनें**: बिना हेलमेट (IS 2925), सुरक्षा जूते (IS 15298) और चश्मे के कभी भी प्लांट में न जाएं।\n2. 🚫 **मशीन गार्ड को कभी न हटाएं**: सुरक्षा शील्ड और इमरजेंसी स्टॉप हमेशा चालू रखें।\n3. ⚡ **LOTO नियम का पालन करें**: मशीन रिपेयर या सफाई से पहले मुख्य पावर सप्लाई बंद करके ताला लगाएं।\n4. 🚪 **आपातकालीन रास्ते साफ रखें**: आग के रास्ते, अग्निशामक और आपातकालीन निकास के आगे कोई सामान न रखें।\n5. ⚠️ **खतरे की तुरंत सूचना दें**: किसी भी जोखिम या ढीले तार की सूचना तुरंत सुपरवाइजर को दें।\n6. 🧹 **कार्यस्थल साफ रखें**: फर्श पर तेल या पानी न फैलने दें ताकि फिसलने का खतरा न हो।\n\nसुरक्षा पहले, काम बाद में!",
    answer_hinglish: "🛡️ **Plant & Factory Floor ke Golden Safety Rules:**\n\n1. 🦺 **Mandatory PPE zaroor pehnein**: Safety helmet, steel-toe boots aur eye goggles ke bina plant mein entry mana hai.\n2. 🚫 **Machine guards bypass na karein**: Rotating shafts aur gears ke cover hamesha lage hone chahiye.\n3. ⚡ **LOTO (Lockout/Tagout) follow karein**: Maintenance se pehle power switch off karke apna lock aur tag lagayein.\n4. 🚪 **Exit gates hamesha clear rakhein**: Fire extinguisher aur emergency exit ke samne kabhi samaan na rakhein.\n5. ⚠️ **Near-miss turant report karein**: Koi bhi khatra dikhe toh supervisor ko turant inform karein.\n6. 🧹 **Floor clean rakhein**: Tel ya grease ko turant saaf karein taaki fisalne ka risk na ho.\n\nSuraksha pehle, kaam hamesha safe!",
    answer_sat: "🛡️ **ᱠᱟᱹᱨᱜᱟᱲ ᱨᱮᱱᱟᱜ ᱢᱩᱬ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱱᱤᱭᱟᱹᱢ:**\n᱑. 🦺 ᱡᱟᱣᱜᱮ PPE (ᱦᱮᱞᱢᱮᱴ, ᱡᱩᱛᱟᱹ, ᱪᱚᱥᱢᱟ) ᱦᱚᱨᱚᱜ ᱢᱮ᱾\n᱒. 🚫 ᱢᱮᱥᱤᱱ ᱜᱟᱨᱰ ᱟᱞᱚᱢ ᱚᱪᱚᱜᱟ᱾\n᱓. ⚡ ᱢᱮᱥᱤᱱ ᱥᱟᱯᱲᱟᱣ ᱞᱟᱦᱟ LOTO ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ ᱢᱮ᱾\n᱔. 🚪 ᱚᱰᱚᱠᱚᱜ ᱦᱚᱨ ᱥᱟᱯᱷᱟ ᱫᱚᱦᱚᱭ ᱢᱮ᱾\n᱕. ⚠️ ᱵᱚᱛᱚᱨᱟᱱ ᱡᱤᱱᱤᱥ ᱥᱩᱯᱚᱨᱵᱷᱟᱭᱤᱡᱚᱨ ᱴᱷᱮᱱ ᱞᱟᱹᱭ ᱢᱮ᱾",
  },
  {
    id: 'thank_you',
    module: MODULES.GLOBAL,
    keywords: [
      'thank you', 'thanks', 'dhanyawad', 'shukriya', 'bahut accha', 'great help',
      'thx', 'thank u', 'dhanyavaad', 'धन्यवाद', 'शुक्रिया', 'ᱥᱟᱨᱦᱟᱣ'
    ],
    answer_en: "🙏 **You're very welcome!**\n\nYour safety is our highest mission. If you have any more questions about industrial protocols, AR scenarios, or equipment standards, I'm always here to help.\n\nStay alert and stay safe on the floor! 🛡️",
    answer_hi: "🙏 **आपका बहुत-बहुत स्वागत है!**\n\nआपकी सुरक्षा हमारी सर्वोच्च प्राथमिकता है। यदि आपको औद्योगिक सुरक्षा, AR ट्रेनिंग मॉड्यूल या किसी भी उपकरण के संबंध में और कोई जानकारी चाहिए, तो कभी भी पूछ सकते हैं।\n\nहमेशा सतर्क रहें, सुरक्षित रहें! 🛡️",
    answer_hinglish: "🙏 **Most welcome!**\n\nAapki safety hamari sabse badi priority hai. Agar industrial safety, PPE ya AR practice se juda koi bhi naya sawal ho, toh bejhijhak poochiye.\n\nFloor par hamesha alert aur safe rahein! 🛡️",
    answer_sat: "🙏 **ᱟᱹᱰᱤ ᱟᱹᱰᱤ ᱥᱟᱨᱦᱟᱣ!**\n\nᱟᱢᱟᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱜᱮ ᱟᱞᱮᱭᱟᱜ ᱢᱩᱬ ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟ᱾ ᱡᱟᱣᱜᱮ ᱥᱟᱵᱽᱫᱷᱟᱱ ᱛᱟᱦᱮᱸᱱ ᱢᱮ! 🛡️",
  },
  {
    id: 'goodbye',
    module: MODULES.GLOBAL,
    keywords: [
      'bye', 'goodbye', 'alvida', 'see you', 'tata', 'phir milenge', 'बाय', 'अलविदा', 'ᱟᱞᱵᱷᱤᱫᱟ'
    ],
    answer_en: "👋 **Goodbye and take care!**\n\nRemember: Safety is a habit, not an accident. Make sure your PPE is secure and all machinery is safe before leaving your shift. Have a productive and safe day! 👷",
    answer_hi: "👋 **अलविदा और अपना ध्यान रखें!**\n\nयाद रखें: सुरक्षा एक आदत है, संयोग नहीं। शिफ्ट समाप्त करते समय सभी उपकरणों और PPE की जांच अवश्य करें। आपका दिन शुभ और सुरक्षित रहे! 👷",
    answer_hinglish: "👋 **Alvida aur safe rahein!**\n\nYaad rakhein: Har shift mein safety rules follow karna sabse zaroori hai. Shift khatam karne se pehle sabhi tools aur equipment safely band karein. Good luck! 👷",
    answer_sat: "👋 **ᱡᱚᱦᱟᱨ! ᱟᱢᱟᱜ ᱫᱷᱮᱭᱟᱱ ᱫᱚᱦᱚᱭ ᱢᱮ!**\n\nᱡᱟᱣᱜᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱱᱤᱭᱟᱹᱢ ᱢᱟᱱᱟᱣ ᱢᱮ ᱟᱨ ᱥᱩᱨᱠᱷᱤᱛ ᱛᱟᱦᱮᱸᱱ ᱢᱮ᱾ 👷",
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'fire_extinguisher_types',
    module: MODULES.FIRE_EXPLOSION,
    keywords: [
      'extinguisher', 'fire extinguisher', 'types of extinguisher', 'color code', 'extinguisher types',
      'अग्निशामक', 'अग्निशामक के प्रकार', 'अग्निशामक प्रकार', 'सिलेंडर के प्रकार', 'fire extinguisher ke type',
      'water extinguisher', 'co2 extinguisher', 'foam extinguisher', 'dry powder', 'abc extinguisher',
      '4 main fire extinguisher', 'which extinguisher', 'color band', 'band color', 'cylinder color',
      'co2 cylinder', 'co2 band', 'black band', 'red band', 'blue band', 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱤᱡ'
    ],
    answer_en: "Industrial Fire Extinguisher Types & Color Codes (IS 15683 / BS EN 3):\n\n🔴 Water (Red Band) — Class A (Wood, paper, cloth, trash). NEVER on electrical or liquid fires.\n⚫ CO₂ (Black Band) — Class B & Electrical fires. Leaves zero residue, ideal for server rooms & control panels.\n🔵 Dry Chemical Powder / ABC (Blue Band) — Universal multi-purpose for Class A, B, C & electrical fires.\n🟡 Foam / AFFF (Cream Band) — Class B (Petrol, diesel, paints, flammable solvents). Forms a blanket over fuel.\n🟡 Wet Chemical (Canary Yellow) — Class F/K (Commercial kitchen cooking oil and fat deep-fryers).\n\nAlways verify the pressure gauge needle is in the GREEN zone before tackling a fire.",
    answer_hi: "औद्योगिक अग्निशामक प्रकार और रंग कोड (IS 15683):\n\n🔴 पानी (लाल बैंड) — क्लास A (लकड़ी, कागज, कपड़ा)। बिजली या तरल आग पर कभी नहीं।\n⚫ CO₂ (काला बैंड) — क्लास B और बिजली की आग। कोई अवशेष नहीं छोड़ता, कंट्रोल पैनल के लिए सर्वोत्तम।\n🔵 सूखा रासायनिक पाउडर (नीला बैंड) — सर्व-उद्देश्यीय (क्लास A, B, C और बिजली आग)।\n🟡 फोम/AFFF (क्रीम बैंड) — क्लास B (पेट्रोल, डीजल, पेंट)।\n🟡 वेट केमिकल (पीला बैंड) — क्लास F/K (रसोई के तेल और वसा की आग)।\n\nप्रयोग से पहले सुनिश्चित करें कि प्रेशर गेज की सुई हरे (Green) क्षेत्र में हो।",
    answer_hinglish: "Industrial Fire Extinguisher ke main types aur color codes:\n\n🔴 Water (Red) — Class A (lakdi, kagaz, kapda). Bijli ya tel par KABHI NAHI.\n⚫ CO₂ (Black) — Electrical aur flammable liquids ke liye. Electronic panels ke liye best hai kyunki residue nahi chhodta.\n🔵 Dry Powder ABC (Blue) — Universal extinguisher, sabhi aag (A, B, C aur electrical) par kaam karta hai.\n🟡 Foam AFFF (Cream) — Petrol, diesel, grease ke liye fuel par blanket bana deta hai.\n🟡 Wet Chemical (Yellow) — Commercial kitchen aur deep fryer oil ki aag ke liye.\n\nHamesha check karein ki pressure gauge ki sui GREEN zone mein honi chahiye.",
    answer_sat: "ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱤᱡ (Extinguisher) ᱨᱮᱱᱟᱜ ᱢᱩᱬ ᱞᱮᱠᱟᱱ:\n🔴 ᱫᱟᱜ (Water - ᱟᱨᱟᱜ): ᱠᱟᱴ, ᱠᱟᱜᱚᱡᱽ, ᱞᱩᱜᱽᱲᱤ ᱞᱟᱹᱜᱤᱫ᱾ ᱵᱤᱡᱽᱞᱤ ᱨᱮ ᱛᱤᱥ ᱦᱚᱸ ᱵᱟᱝ᱾\n⚫ CO₂ (ᱦᱮᱸᱫᱮ): ᱵᱤᱡᱽᱞᱤ ᱟᱨ ᱥᱩᱱᱩᱢ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱹᱜᱤᱫ᱾\n🔵 ᱨᱚᱦᱚᱲ ᱜᱩᱸᱰᱟᱹ (Dry Powder - ᱞᱤᱞ): ᱡᱚᱛᱚ ᱞᱮᱠᱟᱱ ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱠᱟᱹᱢᱤᱭᱟ᱾\n🟡 ᱯᱷᱳᱢ (Foam - ᱥᱟᱥᱟᱝ): ᱥᱩᱱᱩᱢ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱹᱜᱤᱫ᱾",
  },
  {
    id: 'fire_pass_technique',
    module: MODULES.FIRE_EXPLOSION,
    keywords: [
      'pass', 'pass rule', 'pass method', 'pass technique', 'pass formula', 'how to operate extinguisher',
      'pass kya hai', 'pass niyam', 'chalaneka tarika', 'chalane ka tarika', 'pass नियम', 'अग्निशामक कैसे चलाएं',
      'how to use fire extinguisher', 'extinguisher operate'
    ],
    answer_en: "The PASS Technique for Operating Fire Extinguishers:\n\n1. P — PULL the tamper seal pin from the handle.\n2. A — AIM the nozzle low, directly at the BASE of the fire (not at the flames).\n3. S — SQUEEZE the operating lever slowly and evenly to discharge extinguishing agent.\n4. S — SWEEP the nozzle side-to-side across the base of the fire until completely extinguished.\n\n⚠️ Maintain an escape route behind you at all times. If the fire spreads beyond waist-height, evacuate immediately.",
    answer_hi: "अग्निशामक चलाने का PASS नियम:\n\n1. P (Pull) — हैंडल से सेफ्टी पिन और सील खींचकर निकालें।\n2. A (Aim) — नोजल को आग की लपटों पर नहीं, बल्कि आग की जड़ (Base) पर केंद्रित करें।\n3. S (Squeeze) — गैस/पाउडर छोड़ने के लिए लीवर को धीरे-धीरे और समान रूप से दबाएं।\n4. S (Sweep) — नोजल को आग की जड़ पर दाएं-बाएं (झाड़ू की तरह) घुमाएं।\n\n⚠️ हमेशा अपनी पीठ के पीछे सुरक्षित निकास मार्ग खुला रखें। यदि आग बेकाबू हो, तो तुरंत बाहर निकलें।",
    answer_hinglish: "Fire Extinguisher chalane ka PASS Formula:\n\n1. P - PULL: Extinguisher ki safety pin ko kheenche.\n2. A - AIM: Nozzle ko aag ki lapaton par nahi, aag ki JAD (Base) par point karein.\n3. S - SQUEEZE: Handle lever ko daba kar agent release karein.\n4. S - SWEEP: Nozzle ko aage-peeche (left-to-right) jhaadu ki tarah aag ki jad par ghumayein.\n\n⚠️ Apne peeche hamesha ek Exit route khula rakhein. Agar aag zyada badi ho jaye, toh bahar bhagein.",
    answer_sat: "ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱤᱡ ᱵᱮᱵᱷᱟᱨ ᱨᱮᱱᱟᱜ PASS ᱱᱤᱭᱟᱹᱢ:\n᱑. P (Pull): ᱦᱮᱱᱰᱮᱞ ᱠᱷᱚᱱ ᱯᱤᱱ ᱚᱨ ᱚᱰᱚᱠ ᱢᱮ᱾\n᱒. A (Aim): ᱯᱟᱭᱤᱯ ᱫᱚ ᱥᱮᱸᱜᱮᱞ ᱨᱮᱱᱟᱜ ᱵᱩᱰᱟᱹ (Base) ᱥᱮᱫ ᱥᱟᱢᱟᱝ ᱢᱮ᱾\n᱓. S (Squeeze): ᱦᱮᱱᱰᱮᱞ ᱫᱟᱵᱟᱣ ᱢᱮ᱾\n᱔. S (Sweep): ᱞᱮᱸᱜᱟ-ᱡᱚᱡᱚᱢ ᱥᱮᱫ ᱡᱷᱟᱲᱩ ᱞᱮᱠᱟ ᱟᱹᱪᱩᱨ ᱢᱮ᱾",
  },
  {
    id: 'electrical_fire_protocol',
    module: MODULES.FIRE_EXPLOSION,
    keywords: [
      'electrical fire', 'electric fire', 'extinguisher for electrical', 'which extinguisher for electrical fire',
      'bijli ki aag bujhane', 'bijli ki aag ke liye kaunsa extinguisher', 'बिजली की आग के लिए अग्निशामक',
      'bijli aag extinguisher', 'electric panel fire'
    ],
    answer_en: "Extinguisher Protocol for Electrical Fires:\n\n✅ Recommended: Carbon Dioxide (CO₂ - Black band) or Dry Powder (ABC - Blue band).\n• CO₂ is preferred for control panels, computers, and electronics as it leaves zero chemical residue.\n❌ STRICTLY FORBIDDEN: NEVER use Water or Foam extinguishers on energized equipment — risk of deadly electric shock!\n\nFirst Steps:\n1. Safely disconnect the electrical power supply if possible.\n2. Stand 2 meters back and aim CO₂ nozzle at base of fire using PASS.\n3. Do not touch the CO₂ horn with bare hands (frostbite hazard).",
    answer_hi: "बिजली की आग के लिए अग्निशामक प्रोटोकॉल:\n\n✅ अनुशंसित: कार्बन डाइऑक्साइड (CO₂ - काला बैंड) या सूखा पाउडर (नीला बैंड)।\n• CO₂ कंट्रोल पैनल और इलेक्ट्रॉनिक उपकरणों के लिए सबसे अच्छा है क्योंकि यह कोई अवशेष नहीं छोड़ता।\n❌ सख्त मना: बिजली के उपकरणों पर कभी भी पानी या फोम का उपयोग न करें — जानलेवा करंट लग सकता है!\n\nकदम:\n1. सुरक्षित होने पर बिजली का मेन स्विच बंद करें।\n2. 2 मीटर की दूरी से CO₂ नोजल को आग की जड़ पर लगाएं।",
    answer_hinglish: "Bijli (Electrical) ki aag ke liye kaunsa extinguisher use karein:\n\n✅ CO₂ (Black band) ya Dry Powder (Blue band) extinguisher use karein.\n• CO₂ electronic panels aur machines ke liye best hai kyunki ye residue (kooda) nahi chhodta.\n❌ Paani ya Foam KABHI NA DALEIN — current lagne ka khatra hota hai.\n\nSteps: Pehle main breaker off karein, phir 2 meter door khade hokar PASS rule se aag bujhayein.",
    answer_sat: "ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱹᱜᱤᱫ:\n✅ CO₂ (ᱦᱮᱸᱫᱮ) ᱥᱮ ᱨᱚᱦᱚᱲ ᱜᱩᱸᱰᱟᱹ (ᱞᱤᱞ) ᱵᱮᱵᱷᱟᱨ ᱢᱮ᱾\n❌ ᱫᱟᱜ ᱛᱤᱥ ᱦᱚᱸ ᱟᱞᱚᱢ ᱫᱩᱞᱟ᱾ ᱯᱟᱹᱦᱤᱞ ᱢᱩᱬ ᱵᱤᱡᱽᱞᱤ ᱥᱩᱭᱤᱪ ᱵᱚᱸᱫᱽ ᱢᱮ᱾",
  },
  {
    id: 'fire_classes',
    module: MODULES.FIRE_EXPLOSION,
    keywords: [
      'fire classes', 'class a', 'class b', 'class c', 'class d', 'class f', 'class k',
      'types of fire', 'aag ke varg', 'fire categories', 'आग के प्रकार', 'आग का वर्गीकरण'
    ],
    answer_en: "Classification of Fires (IS 2190 / ISO 3941):\n\n• Class A: Solid combustibles (Wood, paper, rubber, textiles, plastics).\n• Class B: Flammable liquids (Petrol, diesel, thinners, oils, paints).\n• Class C: Flammable gases (LPG, CNG, methane, propane, acetylene).\n• Class D: Combustible metals (Magnesium, titanium, potassium, sodium) — requires special Dry Powder flux.\n• Class E / Electrical: Fires involving energized electrical installations (Use CO₂ / Clean Agent).\n• Class F / K: Cooking media (Vegetable oils, animal fats in fryers).",
    answer_hi: "आग का वर्गीकरण (IS 2190):\n\n• क्लास A: ठोस पदार्थ (लकड़ी, कागज, कपड़ा, प्लास्टिक)।\n• क्लास B: ज्वलनशील तरल पदार्थ (पेट्रोल, डीजल, पेंट, थिनर)।\n• क्लास C: ज्वलनशील गैसें (LPG, CNG, मीथेन, एसिटिलीन)।\n• क्लास D: ज्वलनशील धातुएं (मैग्नीशियम, सोडियम, टाइटेनियम)।\n• क्लास E: लाइव बिजली उपकरण की आग (CO₂ का प्रयोग करें)।\n• क्लास F/K: रसोई का तेल और वसा।",
    answer_hinglish: "Industrial aag ke 6 main Classes hote hain:\n\n• Class A: Solid cheezein jaise lakdi, kagaz, plastic.\n• Class B: Flammable liquids jaise petrol, diesel, paints.\n• Class C: Flammable gases jaise LPG, CNG, Acetylene.\n• Class D: Combustible metals jaise Sodium, Magnesium.\n• Class E (Electrical): Live bijli ke panels aur equipment.\n• Class F/K: Commercial kitchen mein cooking oil aur grease.",
    answer_sat: "ᱥᱮᱸᱜᱮᱞ ᱨᱮᱱᱟᱜ ᱵᱷᱟᱜᱽ ᱠᱚ:\n• Class A: ᱠᱟᱴ, ᱠᱟᱜᱚᱡᱽ, ᱞᱩᱜᱽᱲᱤ ᱥᱮᱸᱜᱮᱞ᱾\n• Class B: ᱯᱮᱴᱨᱳᱞ, ᱰᱤᱡᱮᱞ, ᱥᱩᱱᱩᱢ ᱥᱮᱸᱜᱮᱞ᱾\n• Class C: LPG, CNG ᱜᱮᱥ ᱥᱮᱸᱜᱮᱞ᱾\n• Class D: ᱢᱮᱬᱦᱮᱫ/ᱫᱷᱟᱛᱩ ᱥᱮᱸᱜᱮᱞ᱾\n• Class E: ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ᱾",
  },
  {
    id: 'fire_evacuation_procedure',
    module: MODULES.FIRE_EXPLOSION,
    keywords: [
      'evacuate', 'evacuation', 'fire exit', 'emergency escape', 'bhagne ka tarika', 'bahar kaise nikle',
      'evacuation steps', 'building khali', 'fire alarm', 'निकासी प्रक्रिया', 'आपातकालीन निकास',
      'fire evacuation sequence', 'fire emergency steps'
    ],
    answer_en: "Industrial Emergency Evacuation Protocol:\n\n1. SOUND ALARM: Break the glass at the nearest Manual Call Point (MCP).\n2. CEASE WORK: Shut down critical machinery only if it takes under 5 seconds.\n3. FOLLOW EXITS: Follow photoluminescent emergency exit signs. NEVER use elevators/lifts.\n4. STAY LOW: If smoke is present, crawl on your hands and knees where clean air remains (within 30–60 cm of floor).\n5. CLOSE DOORS: Shut fire doors behind you to starve the blaze of fresh oxygen.\n6. MUSTER POINT: Report immediately to your designated Assembly Point for roll call. Never leave without reporting.",
    answer_hi: "औद्योगिक आपातकालीन निकास प्रक्रिया:\n\n1. अलार्म बजाएं: निकटतम मैनुअल कॉल पॉइंट (MCP) का कांच तोड़कर अलार्म सक्रिय करें।\n2. कार्य रोकें: मशीन बंद करें यदि सुरक्षित हो।\n3. निकास मार्ग: हरी आपातकालीन निकास लाइटों का अनुसरण करें। कभी भी लिफ्ट का उपयोग न करें।\n4. नीचे झुकें: यदि धुआं हो, तो घुटनों के बल फर्श के पास रेंगते हुए निकलें।\n5. दरवाजे बंद करें: आग को फैलने से रोकने के लिए पीछे के दरवाजे बंद करते जाएं।\n6. मस्टर पॉइंट: रोल-कॉल (हाजिरी) के लिए निर्धारित असेंबली पॉइंट पर एकत्रित हों।",
    answer_hinglish: "Emergency Evacuation (Bahar nikalne) ka sahi sequence:\n\n1. Sabse pehle nazdeeki Manual Call Point (MCP) ka kaanch tod kar Fire Alarm bajayein.\n2. Kaam turant rokein. LIFT ka prayog KABHI NAHI karein, sirf emergency stairs lein.\n3. Agar dhuan bhar gaya ho toh zameen ke paas baith kar crawl (rengte hue) niklein kyunki clean air neeche rehti hai.\n4. Peeche ke fire doors band karte hue jayein taaki aag ko oxygen na mile.\n5. Bahar nikal kar seedhe tay shuda Muster Point par jayein aur supervisor ko attendance dein.",
    answer_sat: "ᱥᱮᱸᱜᱮᱞ ᱚᱰᱚᱠᱚᱜ ᱰᱟᱦᱟᱨ ᱨᱮᱱᱟᱜ ᱱᱤᱭᱟᱹᱢ:\n᱑. ᱥᱩᱨ ᱨᱮᱱᱟᱜ ᱯᱷᱟᱭᱟᱨ ᱟᱞᱟᱨᱢ ᱫᱟᱵᱟᱣ ᱢᱮ᱾\n᱒. ᱞᱤᱯᱷᱴ ᱛᱤᱥ ᱦᱚᱸ ᱟᱞᱚᱢ ᱵᱮᱵᱷᱟᱨᱟ, ᱥᱤᱲᱦᱤ ᱛᱮ ᱩᱰᱩᱠᱚᱜ ᱢᱮ᱾\n᱓. ᱫᱷᱩᱸᱣᱟᱹ ᱛᱟᱦᱮᱸᱱ ᱠᱷᱟᱱ ᱚᱛ ᱨᱮ ᱨᱮᱸᱜᱚᱡ ᱠᱟᱛᱮ ᱪᱟᱞᱟᱜ ᱢᱮ᱾\n᱔. ᱢᱟᱥᱴᱟᱨ ᱯᱚᱭᱮᱱᱴ ᱨᱮ ᱡᱟᱨᱣᱟᱜ ᱢᱮ᱾",
  },
  {
    id: 'muster_point',
    module: MODULES.GLOBAL,
    keywords: [
      'muster point', 'assembly point', 'assembly area', 'muster point kya hai', 'where to gather',
      'safe gathering point', 'roll call point', 'मस्टर पॉइंट', 'एकत्र होने का स्थान', 'असेंबली पॉइंट'
    ],
    answer_en: "Muster Point (Emergency Assembly Area):\n\n• Definition: A permanently marked safe open area outside the plant perimeter, upwind from hazard zones.\n• Purpose: Allows the Emergency Response Coordinator to conduct an accurate Roll Call and determine if anyone is trapped inside.\n• Rules:\n  1. Move promptly without running or causing panic.\n  2. Group with your specific department/shift.\n  3. Answer clearly during roll call.\n  4. Do NOT re-enter the facility for personal belongings under ANY circumstance until official All-Clear is sounded.",
    answer_hi: "मस्टर पॉइंट (आपातकालीन असेंबली क्षेत्र):\n\n• परिभाषा: प्लांट की सीमा से बाहर एक पूर्व-निर्धारित सुरक्षित खुला क्षेत्र।\n• उद्देश्य: आपातकालीन प्रतिक्रिया टीम सभी श्रमिकों की उपस्थिति (Roll Call) की गिनती करती है।\n• नियम:\n  1. घबराए बिना तेजी से सुरक्षित दूरी पर पहुंचें।\n  2. अपने विभाग के समूह में खड़े हों।\n  3. हाजिरी में अपना नाम दर्ज करवाएं।\n  4. जब तक सुरक्षा अधिकारी हरी झंडी (All-Clear) न दे, अपने निजी सामान के लिए भी अंदर वापस न जाएं।",
    answer_hinglish: "Muster Point (Assembly Area) kya hota hai:\n\n• Ye plant/building ke bahar open ground mein tay kiya gaya safe area hota hai.\n• Yahan aag ya gas leak ke waqt sabhi log ikattha hote hain taaki Supervisor roll-call karke check kar sake ki koi andar toh nahi phans gaya.\n• Zaroori niyam: Muster point par jakar khade rahein, aur bina All-Clear ghoshna ke apna wallet, phone ya bike lene dobara andar bilkul na jayein.",
    answer_sat: "ᱢᱟᱥᱴᱟᱨ ᱯᱚᱭᱮᱱᱴ (Muster Point) ᱫᱚ ᱢᱤᱫ ᱥᱩᱨᱠᱷᱤᱛ ᱯᱷᱟᱸᱠᱟ ᱴᱷᱟᱶ ᱠᱟᱱᱟ ᱡᱟᱦᱟᱸᱨᱮ ᱟᱯᱟᱛᱠᱟᱞ ᱚᱠᱛᱚ ᱡᱚᱛᱚ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱡᱟᱨᱣᱟᱜᱼᱟ ᱟᱨ ᱦᱟᱡᱤᱨᱤ (Roll call) ᱦᱩᱭᱩᱜᱼᱟ᱾ ᱥᱩᱨᱠᱷᱟ ᱚᱯᱷᱤᱥᱟᱨ ᱵᱟᱭ ᱢᱮᱱ ᱵᱷᱩᱨ ᱚᱲᱟᱜ ᱵᱷᱤᱛᱨᱤ ᱛᱮ ᱟᱞᱚᱢ ᱨᱩᱣᱟᱹᱲᱟ᱾",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 3. GAS LEAK & CONFINED SPACE SAFETY
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'gas_leak_detection',
    module: MODULES.GAS_LEAK,
    keywords: [
      'gas leak', 'smell gas', 'gas badbu', 'h2s', 'cylinder leak', 'detect gas leak', 'gas risav',
      'lpg leak', 'toxic gas', 'hissing sound', 'गैस रिसाव', 'गैस रिसाव होने पर', 'गैस रिसाव के लक्षण',
      'गैस की गंध', 'गैस लीक', 'how do i detect a gas leak', 'gas leak detection', 'gas emergency'
    ],
    answer_en: "Gas Leak Detection & Emergency Response:\n\n• Warning Signs:\n  👃 Odor: Rotten eggs (H₂S - Hydrogen Sulfide), sharp pungent smell (Ammonia, Chlorine), or garlic/skunk smell (Mercaptan in LPG/Natural gas).\n  👁️ Visual: Dense vapor cloud, ground shimmer, dying vegetation, or frost on valves.\n  👂 Acoustic: Hissing, roaring, or whistling noise from flanges or pipelines.\n\n• Immediate Safety Actions:\n  1. Evacuate IMMEDIATELY UPWIND (into the wind direction) and to higher elevation if gas is heavier than air (like LPG/H₂S).\n  2. NEVER operate electrical switches, pagers, or mobile devices.\n  3. Sound manual emergency siren from outside the plume.\n  4. Restrict site entry; only trained HAZMAT rescue teams with positive-pressure SCBA may enter.",
    answer_hi: "गैस रिसाव पहचान और आपातकालीन कार्रवाई:\n\n• खतरे के संकेत:\n  👃 गंध: सड़े अंडे जैसी गंध (H₂S गैस), तीखी गंध (अमोनिया, क्लोरीन), या LPG में मिलाई गई गंध।\n  👁️ दृश्य: वाष्प का बादल, हवा में धुंधलापन, या पाइप जोड़ों पर बर्फ जमना।\n  👂 ध्वनि: पाइप से सीटी या फुसफुसाहट (Hissing) की आवाज़।\n\n• तत्काल कार्रवाई:\n  1. तुरंत हवा के विपरीत दिशा (Upwind) में भागें।\n  2. कोई भी बिजली का स्विच ऑन/ऑफ न करें।\n  3. बाहर से आपातकालीन अलार्म बजाएं।\n  4. बिना SCBA (सांस लेने का उपकरण) के किसी को भी अंदर न जाने दें।",
    answer_hinglish: "Gas Leak pehchaan aur emergency rules:\n\n• Signs:\n  👃 Ajeeb smell: Sade ande jaisi badbu (H₂S gas), teekhi smell (Ammonia/Chlorine), ya LPG smell.\n  👁️ Visual: Dhundhla badal, pipeline ke paas barf jamna.\n  👂 Sound: Pipes se hissing ya seeti ki awaaz aana.\n\n• Action:\n  1. Turant hawa ke opposite direction (Upwind) mein daudein.\n  2. Koi switch ya phone na chalayein.\n  3. Siren bajayein aur bina positive-pressure SCBA ke andar na ghusein.",
    answer_sat: "ᱜᱮᱥ ᱞᱤᱠ (Gas Leak) ᱪᱤᱱᱦᱟᱹᱣ ᱟᱨ ᱠᱟᱹᱢᱤ:\n👃 ᱵᱟᱹᱲᱤᱡ ᱥᱚ (ᱥᱮᱭᱟ ᱵᱤᱞᱤ ᱞᱮᱠᱟᱱ H₂S ᱥᱚ)᱾\n👁️ ᱦᱚᱭ ᱨᱮ ᱠᱩᱦᱲᱟᱹ ᱧᱮᱞᱚᱜ ᱟᱨ ᱯᱟᱭᱤᱯ ᱨᱮ ᱵᱚᱨᱚᱯᱷ ᱡᱟᱢᱟᱜ᱾\n👂 ᱯᱟᱭᱤᱯ ᱠᱷᱚᱱ ᱥᱩᱸ-ᱥᱩᱸ ᱥᱟᱰᱮ ᱦᱤᱡᱩᱜ᱾\n• ᱞᱚᱜᱚᱱ ᱠᱟᱹᱢᱤ: ᱦᱚᱭ ᱩᱞᱴᱟᱹ ᱥᱮᱫ (Upwind) ᱫᱟᱹᱲ ᱢᱮ, ᱵᱤᱡᱽᱞᱤ ᱥᱩᱭᱤᱪ ᱟᱞᱚᱢ ᱡᱩᱞᱟ, ᱟᱨ SCBA ᱵᱮᱜᱚᱨ ᱵᱷᱤᱛᱨᱤ ᱟᱞᱚᱢ ᱵᱚᱞᱚᱱᱟ᱾",
  },
  {
    id: 'buddy_system',
    module: MODULES.GAS_LEAK,
    keywords: [
      'buddy system', 'confined space buddy', 'safety watch', 'partner system', 'buddy kya hai',
      'standby person', 'hole watch', 'akele kaam na karein', 'बडी सिस्टम', 'सीमित स्थान में साथी'
    ],
    answer_en: "The Buddy System & Standby Person Protocol (OSHA 1910.146 / IS 11972):\n\n• Golden Rule: NEVER enter a confined space, hazardous chemical bay, or gas testing zone alone.\n• Team Roles:\n  1. Entrant: Enters with body harness, gas monitor, and intrinsically safe radio.\n  2. Standby Person (Hole Watch): Remains permanently outside at the entrance.\n• Mandatory Duties of Standby Person:\n  • Maintains continuous visual or radio contact.\n  • Monitors entrants for toxic exposure, heat stress, or slurred speech.\n  • Controls the entry log and air supply lines.\n  • ⚠️ NEVER enters the confined space to attempt rescue! Sounds emergency alarms and mobilizes the designated rescue squad with mechanical retrieval winches.",
    answer_hi: "बडी सिस्टम और स्टैंडबाय वॉच नियम:\n\n• सुनहरा नियम: किसी भी सीमित स्थान (Confined Space) या गैस क्षेत्र में अकेले कभी प्रवेश न करें।\n• टीम के कार्य:\n  1. प्रवेशकर्ता (Entrant): हार्नेस, गैस मीटर और रेडियो के साथ अंदर काम करता है।\n  2. सुरक्षा साथी (Safety Watch): प्रवेश द्वार के बाहर लगातार तैनात रहता है।\n• बाहर खड़े साथी की जिम्मेदारी:\n  • लगातार संपर्क बनाए रखना।\n  • यदि अंदर साथी बेहोश हो जाए, तो अकेले अंदर कूदने की गलती कभी न करे; बल्कि अलार्म बजाकर रेस्क्यू टीम और विंच (Winch) का उपयोग करे।",
    answer_hinglish: "Buddy System aur Safety Watch rules:\n\n• Golden Rule: Confined space (tank, silo, underground chamber) mein KABHI BHI AKELE na jayein.\n• Role 1 (Entrant): Jo worker harness aur gas monitor lekar andar jata hai.\n• Role 2 (Safety Watch / Buddy): Jo gate ke bahar khada hokar lagatar nazar rakhta hai.\n• Sabse bada niyam: Agar andar wala saathi behosh ya sankat mein ho, toh Safety Watch akele andar ghusne ki galti na kare, balki turant Rescue Siren bajakar mechanical winch se pull kare.",
    answer_sat: "ᱵᱟᱰᱤ ᱥᱤᱥᱴᱚᱢ (Buddy System) ᱫᱚ ᱵᱟᱨ ᱦᱚᱲ ᱢᱮᱥᱟ ᱠᱟᱛᱮ ᱠᱟᱹᱢᱤ ᱨᱮᱭᱟᱜ ᱱᱤᱭᱟᱹᱢ ᱠᱟᱱᱟ:\n• ᱜᱮᱥ ᱴᱷᱟᱶ ᱨᱮ ᱛᱤᱥ ᱦᱚᱸ ᱮᱠᱞᱟ ᱟᱞᱚᱢ ᱵᱚᱞᱚᱱᱟ᱾\n• ᱢᱤᱫ ᱦᱚᱲ ᱵᱷᱤᱛᱨᱤ ᱨᱮ ᱠᱟᱹᱢᱤᱭᱟ — ᱢᱤᱫ ᱦᱚᱲ ᱵᱟᱦᱨᱮ ᱨᱮ ᱧᱮᱧᱮᱞᱤᱡ (Safety Watch) ᱛᱟᱦᱮᱸᱱᱟ᱾",
  },
  {
    id: 'confined_space_atmosphere',
    module: MODULES.GAS_LEAK,
    keywords: [
      'confined space permit', '4 gas monitor', 'oxygen level', 'lel', 'flammable limit', 'gas detector',
      'confined space testing', 'permit to work', 'ऑक्सीजन स्तर', 'गैस परीक्षण'
    ],
    answer_en: "Confined Space Atmospheric Testing Standards:\n\n• Testing Order (Stratified testing at bottom, middle, and top):\n  1. Oxygen (O₂): Safe range is strictly 19.5% to 23.5%. Below 19.5% causes fatal asphyxiation; above 23.5% causes extreme fire risk.\n  2. Flammable Gases (LEL): Must be LESS than 10% Lower Explosive Limit.\n  3. Carbon Monoxide (CO): Toxic threshold limit < 25 ppm.\n  4. Hydrogen Sulfide (H₂S): Toxic threshold limit < 10 ppm.\n\n• Never enter without an authorized 'Confined Space Entry Permit' and continuous forced-air mechanical ventilation.",
    answer_hi: "सीमित स्थान (Confined Space) गैस परीक्षण मानक:\n\n• परीक्षण का क्रम:\n  1. ऑक्सीजन (O₂): सुरक्षित स्तर 19.5% से 23.5% के बीच होना चाहिए। 19.5% से कम होने पर दम घुट सकता है।\n  2. ज्वलनशील गैसें (LEL): 10% से कम होना चाहिए।\n  3. कार्बन मोनोऑक्साइड (CO): 25 ppm से कम।\n  4. हाइड्रोजन सल्फाइड (H₂S): 10 ppm से कम।\n\n• बिना 'वर्क परमिट' और लगातार वेंटिलेशन पंखे के कभी अंदर प्रवेश न करें।",
    answer_hinglish: "Confined Space gas testing standards:\n\n• 4-Gas detector limits:\n  1. Oxygen (O₂): Hamesha 19.5% se 23.5% ke beech honi chahiye. 19.5% se kam par dum ghut kar maut ho sakti hai.\n  2. Flammability (LEL): 10% LEL se kam hona zaroori hai.\n  3. Carbon Monoxide (CO): 25 ppm se kam.\n  4. Hydrogen Sulfide (H₂S): 10 ppm se kam.\n\n• Hamesha Confined Space Entry Permit lein aur blower ventilation chalaye rakhein.",
    answer_sat: "ᱥᱤᱢᱤᱛ ᱴᱷᱟᱶ ᱜᱮᱥ ᱴᱮᱥᱴ ᱱᱤᱭᱟᱹᱢ:\n• ᱚᱠᱥᱤᱡᱮᱱ (O₂): ᱑᱙.᱕% ᱠᱷᱚᱱ ᱒᱓.᱕% ᱵᱷᱤᱛᱨᱤ ᱨᱮ ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾\n• ᱡᱩᱞᱩᱜ ᱜᱮᱥ (LEL): ᱑᱐% ᱠᱷᱚᱱ ᱠᱚᱢ᱾\n• ᱵᱤᱱᱟ Work Permit ᱛᱮ ᱛᱤᱥ ᱦᱚᱸ ᱵᱚᱞᱚᱱ ᱵᱟᱝ ᱜᱟᱱᱚᱜᱼᱟ᱾",
  },
  {
    id: 'scba_vs_respirator',
    module: MODULES.GAS_LEAK,
    keywords: [
      'scba', 'gas mask', 'respirator', 'dust mask', 'breathing apparatus', 'scba kya hota hai',
      'filter mask', 'oxygen cylinder mask', 'गैस मास्क', 'रेस्पिरेटर'
    ],
    answer_en: "Respiratory Protection Selection:\n\n1. SCBA (Self-Contained Breathing Apparatus): Delivers Grade D breathable compressed air from a back cylinder. MANDATORY in oxygen-deficient environments (<19.5% O₂) and unknown toxic gas concentrations (IDLH - Immediately Dangerous to Life or Health).\n2. Full-Face Cartridge Respirator: Purifies ambient air using chemical absorbent canisters (e.g., organic vapor, acid gas). Requires at least 19.5% ambient O₂.\n3. Half-Face Dust Mask / N95 / FFP2: Filters inert particulates only. Provides ZERO protection against toxic gases or oxygen deficiency! Never use a dust mask for gas leaks.",
    answer_hi: "श्वसन सुरक्षा उपकरण का चयन:\n\n1. SCBA (सेल्फ-कंटेन्ड ब्रीदिंग अपेरटस): यह अपनी पीठ पर रखे सिलेंडर से शुद्ध सांस लेने योग्य हवा देता है। ऑक्सीजन की कमी (<19.5%) या अज्ञात जहरीली गैस में अनिवार्य है।\n2. केमिकल कार्ट्रिज रेस्पिरेटर: यह हवा को छानता है, लेकिन वातावरण में कम से कम 19.5% ऑक्सीजन होना जरूरी है।\n3. साधारण डस्ट मास्क: केवल धूल कण रोकता है। जहरीली गैस या गैस रिसाव में यह बिल्कुल काम नहीं करता।",
    answer_hinglish: "Respirator aur SCBA mein antar:\n\n1. SCBA (Self-Contained Breathing Apparatus): Peeth par clean compressed air cylinder hota hai. Gas leak aur oxygen kam (<19.5%) hone par yahi use hota hai.\n2. Cartridge Respirator: Chemical filter se hawa saaf karta hai, lekin oxygen kam hone par ye kaam nahi karega.\n3. Dust Mask (N95): Sirf dhool-mitti ke liye hai, gas leak mein iska ZERO protection hota hai.",
    answer_sat: "ᱥᱟᱦᱮᱫ ᱦᱟᱛᱟᱣ ᱥᱟᱢᱟᱱ (SCBA ᱟᱨ ᱢᱟᱥᱠ):\n• SCBA: ᱯᱤᱴᱷᱤ ᱨᱮ ᱦᱚᱭ ᱥᱤᱞᱤᱱᱰᱟᱨ ᱛᱟᱦᱮᱸᱱᱟ, ᱡᱟᱦᱟᱸᱨᱮ ᱚᱠᱥᱤᱡᱮᱱ ᱠᱚᱢ ᱛᱟᱦᱮᱸᱱᱟ ᱚᱸᱰᱮ ᱱᱚᱶᱟ ᱵᱮᱵᱷᱟᱨᱚᱜᱼᱟ᱾\n• ᱥᱟᱫᱷᱟᱨᱚᱱ ᱫᱷᱩᱲᱤ ᱢᱟᱥᱠ ᱡᱮᱦᱮᱨ ᱜᱮᱥ ᱠᱷᱚᱱ ᱵᱟᱭ ᱵᱟᱧᱪᱟᱣᱟ᱾",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 4. PPE & INDUSTRIAL HAZARD BASELINE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'ppe_baseline_overview',
    module: MODULES.PPE,
    keywords: [
      'ppe', 'ppe kit', 'personal protective equipment', 'safety gear', 'ppe list', 'mandatory ppe',
      'ppe kya hai', 'kya pahnna chahiye', 'suraksha samagri', 'पीपीई', 'सुरक्षा उपकरण', 'अनिवार्य पीपीई',
      '6 point ppe', 'ppe baseline', 'ᱥᱩᱨᱠᱷᱟ ᱥᱟᱢᱟᱱ'
    ],
    answer_en: "PPE stands for **Personal Protective Equipment**. In simple terms, it refers to protective gear, clothing, and helmets designed to safeguard workers from hazards that can cause serious workplace injuries or illnesses.\n\nKey components of the industrial PPE baseline (IS / OSHA standards) include:\n• 🪖 **Hard Hat (IS 2925)**: Protects the head against impacts from falling tools or debris.\n• 👁️ **Safety Glasses (ANSI Z87.1)**: Guards eyes against dust, flying particles, and chemical splashes.\n• 👂 **Earplugs / Earmuffs**: Protects hearing in high-decibel noise areas (>85 dBA).\n• 🦺 **High-Visibility Vest**: Ensures workers are clearly visible to heavy vehicle operators.\n• 🧤 **Protective Gloves**: Protects hands from sharp metal cuts, heat, or chemicals.\n• 👢 **Steel-Toed Shoes (IS 15298)**: Protects toes from crushing impacts and prevents slips.\n\nAlways inspect your gear before entering hazardous zones. Would you like to know how to inspect or fit a specific piece of PPE?",
    answer_hi: "नमस्ते! **PPE** का पूरा नाम **Personal Protective Equipment** (व्यक्तिगत सुरक्षा उपकरण) होता है।\n\nसरल शब्दों में कहें तो, PPE वे विशेष सुरक्षा कपड़े और उपकरण होते हैं जिन्हें किसी औद्योगिक प्लांट, खदान या कंस्ट्रक्शन साइट पर काम करते समय अपनी जान और शरीर को चोट या खतरे से बचाने के लिए पहना जाता है। यह किसी भी मजदूर या कर्मचारी के लिए 'सुरक्षा की आखिरी ढाल' होता है।\n\n**ज़रूरी PPE उपकरण:**\n• 🪖 **सेफ्टी हेलमेट (IS 2925)**: सिर को ऊपर से गिरने वाली भारी वस्तुओं से बचाता है।\n• 👁️ **सेफ्टी चश्मा**: आंखों को उड़ते हुए कणों, चिंगारी और केमिकल से सुरक्षित रखता है।\n• 👂 **ईयर प्लग**: मशीनों के तेज शोर से कानों की सुनने की क्षमता को बचाता है।\n• 🦺 **रिफ्लेक्टिव जैकेट**: दूर से साफ दिखाई देने के लिए ताकि कोई गाड़ी टक्कर न मारे।\n• 🧤 **सेफ्टी ग्लव्स**: हाथ कटने, जलने या रसायन से सुरक्षा के लिए।\n• 👢 **स्टील-टो जूते (IS 15298)**: भारी वस्तु गिरने पर पैर की उंगलियों की रक्षा करते हैं।\n\nकाम शुरू करने से पहले हमेशा जांच लें कि आपका कोई गियर टूटा या ढीला तो नहीं है!",
    answer_hinglish: "Namaste! **PPE** ka matlab hota hai **Personal Protective Equipment** (व्यक्तिगत सुरक्षा उपकरण).\n\nSeedhe shabdon mein kahein toh PPE woh saare safety gear aur kapde hain jo factory, plant, ya mining site par kaam karte waqt shramikon ko kisi bhi durghatna ya chot se bachate hain. Ye aapki safety ki aakhri line of defense hai.\n\n**Zaroori PPE Gear:**\n• 🪖 **Safety Helmet (IS 2925)**: Sar ko upar se girne wale pathar ya lohe se bachata hai.\n• 👁️ **Safety Goggles**: Aankhon ko dhool, sparks aur chemical se surakshit rakhte hain.\n• 👂 **Earplugs / Earmuffs**: Tez machine ki awaaz se kaan ko bachaane ke liye.\n• 🦺 **Reflective Vest**: Door se dikhne ke liye taaki heavy vehicle durghatna na ho.\n• 🧤 **Safety Gloves**: Haath ko katne, jalne ya chemical se bachane ke liye.\n• 👢 **Steel-Toe Safety Shoes (IS 15298)**: Pairon par bhari cheez girne se ungliyan bachate hain.\n\nKoi specific PPE inspect karne ya pehanne ka sahi tareeka poochna chahte hain?",
    answer_sat: "ᱞᱟᱹᱠᱛᱤᱭᱟᱱ ᱠᱟᱹᱨᱜᱟᱲ PPE ᱥᱟᱢᱟᱱ (Personal Protective Equipment):\n🪖 ᱦᱮᱞᱢᱮᱴ: ᱵᱚᱦᱚᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱞᱟᱹᱜᱤᱫ᱾\n👁️ ᱥᱩᱨᱠᱷᱟ ᱪᱚᱥᱢᱟ (Goggles): ᱢᱮᱫ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱞᱟᱹᱜᱤᱫ᱾\n👂 ᱤᱭᱟᱨᱯᱞᱟᱜᱽ (Earplug): ᱢᱟᱨᱟᱝ ᱥᱟᱰᱮ ᱠᱷᱚᱱ ᱞᱩᱛᱩᱨ ᱵᱟᱧᱪᱟᱣ᱾\n🦺 ᱨᱤᱯᱷᱞᱮᱠᱴᱤᱵᱷ ᱵᱷᱮᱥᱴ: ᱧᱮᱞᱚᱜ ᱞᱟᱹᱜᱤᱫ ᱡᱷᱟᱞᱠᱟᱣ ᱠᱩᱨᱛᱤ᱾\n🧤 ᱛᱤ-ᱢᱳᱡᱟ (Gloves): ᱛᱤ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱞᱟᱹᱜᱤᱫ᱾\n👢 ᱥᱴᱤᱞ-ᱴᱳ ᱡᱩᱛᱟᱹ: ᱡᱟᱸᱜᱟ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱞᱟᱹᱜᱤᱫ᱾",
  },
  {
    id: 'helmet_color_codes',
    module: MODULES.PPE,
    keywords: [
      'helmet color', 'hard hat color', 'white helmet', 'yellow helmet', 'blue helmet', 'green helmet',
      'red helmet', 'helmet ke rang', 'topi ka rang', 'हेलमेट रंग', 'हेलमेट का रंग'
    ],
    answer_en: "Industrial Safety Helmet Color Code Standards:\n\n⚪ White — Site Engineers, Managers, Supervisors, and Safety Officers.\n🟡 Yellow — General Construction Workers, Laborers, and Heavy Earth-moving Equipment Operators.\n🔵 Blue — Electricians, Technical Specialists, Carpenters, and Temporary Operators.\n🟢 Green — Safety Inspectors, Environmental Officers, and First Aiders.\n🔴 Red — Emergency Fire Crews, Firefighters, and Fire Marshals.\n🟤 Brown — Welders and Workers engaged in extreme heat applications.\n\nInspect helmet harness suspension daily. Replace any helmet after 3–5 years or following a significant impact.",
    answer_hi: "औद्योगिक सेफ्टी हेलमेट रंग कोड (Industrial Helmet Codes):\n\n⚪ सफेद (White) — साइट इंजीनियर, मैनेजर, सुपरवाइज़र और सेफ्टी ऑफिसर।\n🟡 पीला (Yellow) — सामान्य मजदूर, ऑपरेटर और कंस्ट्रक्शन वर्कर।\n🔵 नीला (Blue) — इलेक्ट्रीशियन, तकनीकी विशेषज्ञ और बढ़ई।\n🟢 हरा (Green) — सुरक्षा निरीक्षक (Safety Officer) और प्राथमिक चिकित्सा दल।\n🔴 लाल (Red) — फायर मार्शल और अग्निशमन दल।\n🟤 भूरा (Brown) — वेल्डर और उच्च ताप पर काम करने वाले।",
    answer_hinglish: "Plant mein helmet colors ka matlab:\n\n⚪ White — Engineers, Managers, Supervisors aur Safety Officers.\n🟡 Yellow — General workers aur heavy machine operators.\n🔵 Blue — Electricians aur technical contractors.\n🟢 Green — Safety officers aur First Aid responders.\n🔴 Red — Firefighters aur Emergency Fire Marshals.\n🟤 Brown — Welders aur hot-work workers.",
    answer_sat: "ᱦᱮᱞᱢᱮᱴ ᱨᱚᱝ ᱨᱮᱭᱟᱜ ᱢᱟᱱᱮ:\n⚪ ᱯᱩᱸᱰ (White): ᱤᱧᱡᱤᱱᱤᱭᱟᱨ ᱟᱨ ᱥᱩᱯᱚᱨᱵᱷᱟᱭᱤᱡᱚᱨ᱾\n🟡 ᱥᱟᱥᱟᱝ (Yellow): ᱠᱟᱹᱢᱤᱭᱟᱹ ᱟᱨ ᱚᱯᱨᱮᱴᱟᱨ᱾\n🔵 ᱞᱤᱞ (Blue): ᱤᱞᱮᱠᱴᱨᱤᱥᱤᱭᱟᱱ᱾\n🟢 ᱦᱟᱹᱨᱭᱟᱹᱲ (Green): ᱥᱩᱨᱠᱷᱟ ᱚᱯᱷᱤᱥᱟᱨ ᱟᱨ ᱯᱟᱹᱦᱤᱞ ᱨᱟᱱ ᱫᱚᱞ᱾\n🔴 ᱟᱨᱟᱜ (Red): ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱤᱡ ᱫᱚᱞ᱾",
  },
  {
    id: 'safety_shoes_inspection',
    module: MODULES.PPE,
    keywords: [
      'safety shoes', 'boots damaged', 'steel toe', 'shoes fhat gaye', 'toote jute', 'safety boot standard',
      'dielectric shoes', 'puncture resistant', 'सेफ्टी जूते', 'जूते फट गए'
    ],
    answer_en: "Safety Footwear Standards & Inspection (IS 15298):\n\n• Features: Steel or composite toe cap (withstands 200 Joules impact), puncture-resistant steel midsole plate, and anti-static/oil-resistant outer sole.\n• When to Replace Safety Boots:\n  1. The steel toe cap becomes exposed or visibly dented.\n  2. The sole tread depth is worn smooth, increasing slip hazards.\n  3. Leather is torn, punctured, or soaked in corrosive chemicals.\n  4. Dielectric electrical boots have any cracking or moisture ingress.\n\nNever work on an industrial plant floor with athletic sneakers, sandals, or damaged safety footwear.",
    answer_hi: "सेफ्टी जूतों के मानक और निरीक्षण (IS 15298):\n\n• विशेषताएं: स्टील टो-कैप (200 जूल प्रभाव सहन), पंचर-रोधी सोल, और एंटी-स्लिप पकड़।\n• जूते कब बदलें:\n  1. यदि स्टील की टो बाहर दिखने लगे या पिचक जाए।\n  2. यदि सोल घिसकर चिकना हो गया हो।\n  3. यदि चमड़ा फट गया हो या केमिकल से खराब हो गया हो।\n  4. इलेक्ट्रीशियन बूट में दरार आ जाए।\n\nफैक्ट्री फ्लोर पर कभी भी चप्पल या साधारण जूते पहनकर काम न करें।",
    answer_hinglish: "Safety Shoes ke zaroori niyam:\n\n• Features: Aage steel toe hoti hai jo 200 Joule ke vajan se ungliyon ko dabne se bachati hai.\n• Kab naya joota lena zaroori hai:\n  1. Steel cap chamde se bahar nikal aaye ya dent pad jaye.\n  2. Niche ka sole ghis kar smooth ho gaya ho (slip hone ka risk).\n  3. Joota fat gaya ho ya chemical andar ghus raha ho.\n\nKharab joota pehankar plant mein kaam karna mana hai, turant store se replace karwayein.",
    answer_sat: "ᱥᱩᱨᱠᱷᱟ ᱡᱩᱛᱟᱹ ᱨᱮᱭᱟᱜ ᱱᱤᱭᱟᱹᱢ:\n• ᱞᱟᱦᱟ ᱨᱮ ᱥᱴᱤᱞ ᱛᱟᱦᱮᱸᱱᱟ ᱡᱟᱦᱟᱸᱛᱮ ᱡᱟᱸᱜᱟ ᱨᱮ ᱵᱷᱟᱹᱨᱤ ᱡᱤᱱᱤᱥ ᱧᱩᱨ ᱨᱮᱦᱚᱸ ᱵᱟᱝ ᱵᱟᱡᱟᱣᱜᱼᱟ᱾\n• ᱡᱩᱛᱟᱹ ᱪᱤᱨᱟᱹ ᱞᱮᱱᱠᱷᱟᱱ ᱥᱮ ᱥᱴᱤᱞ ᱩᱰᱩᱠ ᱞᱮᱱᱠᱷᱟᱱ ᱩᱥᱟᱹᱨᱟ ᱵᱚᱫᱚᱞ ᱢᱮ᱾",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 5. ELECTRICAL SAFETY & LOTO
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'loto_lockout_tagout',
    module: MODULES.ELECTRICAL,
    keywords: [
      'loto', 'lockout tagout', 'lockout', 'tagout', 'loto protocol', 'zero energy state', 'loto steps',
      '6 steps of loto', 'लॉकआउट टैगआउट', 'loto प्रक्रिया', 'padlock'
    ],
    answer_en: "Lockout / Tagout (LOTO) 6-Step Protocol (OSHA 1910.147 / IS 14489):\n\n1. PREPARE: Identify all energy sources (electrical, hydraulic, pneumatic, gravitational).\n2. NOTIFY: Inform affected operators and supervisors of pending shutdown.\n3. SHUT DOWN: De-energize equipment using normal stopping controls.\n4. ISOLATE: Open disconnect switches, breakers, and close inline energy valves.\n5. LOCK & TAG: Attach personal safety padlock and danger tag to every energy isolating device. Keep the key in your possession.\n6. VERIFY ZERO ENERGY: Dissipate stored energy (bleed air, drain capacitors) and attempt to restart to confirm equipment is completely dead.",
    answer_hi: "लॉकआउट/टैगआउट (LOTO) 6-चरणीय प्रक्रिया:\n\n1. तैयारी: सभी ऊर्जा स्रोतों (बिजली, हाइड्रोलिक, न्यूमेटिक) की पहचान करें।\n2. सूचना दें: प्रभावित कर्मचारियों को शटडाउन की सूचना दें।\n3. मशीन बंद करें: सामान्य नियंत्रण से मशीन बंद करें।\n4. ऊर्जा अलग करें: मेन ब्रेकर या वॉल्व को बंद करें।\n5. ताला और टैग लगाएं: व्यक्तिगत पैडलॉक और डेंजर टैग लगाएं। चाबी अपने पास रखें।\n6. जीरो एनर्जी जांचें: संचित ऊर्जा को डिस्चार्ज करें और स्टार्ट बटन दबाकर पुष्टि करें कि मशीन पूरी तरह बंद है।",
    answer_hinglish: "LOTO (Lockout/Tagout) ke 6 Steps:\n\n1. Prepare: Sabhi energy sources (bijli, pressure, air) ki list banayein.\n2. Notify: Operators ko bataein ki machine band hone wali hai.\n3. Shutdown: Normal switch se machine band karein.\n4. Isolate: Main MCB breaker ya valve band karein.\n5. Lock & Tag: Apna personal taala (padlock) lagayein aur Danger Tag taang kar chabi apni pocket mein rakhein.\n6. Zero Energy Verify: Test karein ki machine sach mein band hai aur stored current/pressure discharge ho chuka hai.",
    answer_sat: "LOTO ᱨᱮᱱᱟᱜ ᱖ ᱜᱚᱴᱟᱝ ᱫᱷᱟᱯ:\n᱑. ᱵᱟᱰᱟᱭ ᱢᱮ ᱚᱠᱟ ᱠᱷᱚᱱ ᱵᱤᱡᱽᱞᱤ ᱦᱤᱡᱩᱜ ᱠᱟᱱᱟ᱾\n᱒. ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱞᱟᱹᱭᱟᱠᱚ ᱢᱮ᱾\n᱓. ᱢᱮᱥᱤᱱ ᱵᱚᱸᱫᱽ ᱢᱮ᱾\n᱔. ᱢᱩᱬ ᱥᱩᱭᱤᱪ ᱵᱚᱸᱫᱽ ᱠᱟᱛᱮ ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ ᱢᱮ ᱟᱨ ᱪᱟᱹᱵᱷᱤ ᱟᱢ ᱴᱷᱮᱱ ᱫᱚᱦᱚᱭ ᱢᱮ᱾\n᱕. ᱪᱮᱠ ᱢᱮ ᱡᱮ ᱢᱮᱥᱤᱱ ᱨᱮ ᱠᱟᱨᱮᱱᱴ ᱵᱟᱹᱱᱩᱜᱼᱟ᱾",
  },
  {
    id: 'electric_shock_response',
    module: MODULES.ELECTRICAL,
    keywords: [
      'electric shock', 'current lag gaya', 'shock emergency', 'victim touching wire', 'electrocution',
      'bijli ka jhatka', 'shock first aid', 'करंट का झटका', 'करंट लग गया'
    ],
    answer_en: "Electric Shock Emergency Response Protocol:\n\n1. DO NOT TOUCH THE VICTIM WITH BARE HANDS! You will also be electrocuted.\n2. ISOLATE POWER: Immediately trip the circuit breaker or disconnect the main switch.\n3. IF POWER CANNOT BE CUT: Stand on a dry rubber mat or wooden plank and use a dry, non-conductive object (wooden broom handle, PVC pipe, fiberglass rod) to separate the victim from the live wire.\n4. CHECK VITALS: Check responsiveness and breathing. If unconscious and not breathing, begin CPR immediately (30 chest compressions : 2 rescue breaths).\n5. CALL 108 / 112: Request immediate advanced cardiac life support ambulance.",
    answer_hi: "बिजली का झटका लगने पर आपातकालीन कार्रवाई:\n\n1. पीड़ित को कभी भी नंगे हाथों से न छुएं! आप भी करंट की चपेट में आ सकते हैं।\n2. बिजली बंद करें: तुरंत मेन स्विच या सर्किट ब्रेकर बंद करें।\n3. यदि बिजली बंद न हो: सूखी लकड़ी, रबर या पीवीसी डंडे से पीड़ित को बिजली के तार से अलग करें।\n4. सांस जांचें: यदि सांस न चल रही हो, तो तुरंत CPR शुरू करें (30 बार छाती दबाएं, 2 बार सांस दें)।\n5. तुरंत 108 या 112 पर एम्बुलेंस के लिए कॉल करें।",
    answer_hinglish: "Current (Electric Shock) lagne par kya karein:\n\n1. Victim ko nange haathon se KABHI NA CHHUEIN, nahi toh aapko bhi current pakad lega!\n2. Sabse pehle Main MCB/Power Switch off karein.\n3. Agar power off na ho sake, toh sukhi lakdi ya dry plastic dande se victim ko taar se alag karein.\n4. Victim ki saans check karein, agar saans band ho toh turant CPR shuru karein.\n5. Turant 108 (Ambulance) aur plant medical room ko call karein.",
    answer_sat: "ᱵᱤᱡᱽᱞᱤ ᱠᱟᱨᱮᱱᱴ ᱞᱟᱜᱟᱣ ᱞᱮᱱᱠᱷᱟᱱ ᱠᱟᱹᱢᱤ:\n᱑. ᱵᱟᱡᱟᱣ ᱟᱠᱟᱱ ᱦᱚᱲ ᱛᱤ ᱛᱮ ᱛᱤᱥ ᱦᱚᱸ ᱟᱞᱚᱢ ᱡᱚᱴᱮᱫᱮᱭᱟ!\n᱒. ᱞᱚᱜᱚᱱ ᱵᱤᱡᱽᱞᱤ ᱥᱩᱭᱤᱪ ᱵᱚᱸᱫᱽ ᱢᱮ᱾\n᱓. ᱨᱚᱦᱚᱲ ᱠᱟᱴ ᱛᱮ ᱦᱚᱲ ᱫᱚ ᱵᱤᱡᱽᱞᱤ ᱛᱟᱨ ᱠᱷᱚᱱ ᱥᱟᱦᱟᱭ ᱢᱮ᱾\n᱔. ᱩᱥᱟᱹᱨᱟ ᱑᱐᱘ ᱟᱨ ᱑᱑᱒ ᱱᱚᱢᱵᱚᱨ ᱛᱮ ᱯᱷᱳᱱ ᱢᱮ᱾",
  },
  {
    id: 'arc_flash_hazards',
    module: MODULES.ELECTRICAL,
    keywords: [
      'arc flash', 'arc blast', 'electrical flash', 'arc flash ppe', 'substation flash', 'arc rating',
      'cal/cm2', 'arc flash kya hai', 'आर्क फ्लैश'
    ],
    answer_en: "Arc Flash & Arc Blast Hazards (NFPA 70E / IEEE 1584):\n\n• Definition: An arc flash is an explosive short-circuit release of radiant heat (temperatures up to 19,000°C / 35,000°F — 4 times hotter than the sun's surface) and sound blast pressures exceeding 2,000 lbs/sq ft.\n• Required PPE: Arc-rated face shield with balaclava, arc-rated fire-resistant (FR) coverall suit matching the incident energy rating (Cal/cm²), dielectric safety boots, and insulating rubber gloves with leather protectors.\n• Safety Rule: Observe the Arc Flash Boundary at all times. Never rack circuit breakers without wearing full arc-flash PPE.",
    answer_hi: "आर्क फ्लैश (Arc Flash) और सबस्टेशन सुरक्षा:\n\n• आर्क फ्लैश क्या है: यह बिजली का एक बहुत बड़ा शॉर्ट-सर्किट धमाका है जिसका तापमान 19,000°C तक पहुंच सकता है।\n• आवश्यक सुरक्षा उपकरण: आर्क-रेटेड फेस शील्ड, फायर-रेसिस्टेंट (FR) सूट, रबर के इंसुलेटेड दस्ताने और सेफ्टी जूते।\n• नियम: सबस्टेशन में बिना उचित आर्क-रेटेड सूट के कभी भी बड़े पैनल या ब्रेकर न खोलें।",
    answer_hinglish: "Arc Flash kya hai aur bachaav kaise karein:\n\n• Arc Flash ek bhayanak electrical blast hota hai jo switchgear ya sub-station mein short circuit hone par hota hai (suraj se 4 guna zyada heat nikalti hai).\n• Bachaav: Substation mein switchgear kholne ke liye Arc-Flash Rated Suit, Balaclava face shield aur High-voltage Rubber gloves pehanna anivarya hai.",
    answer_sat: "ᱟᱨᱠ ᱯᱷᱞᱮᱥ (Arc Flash):\n• ᱵᱤᱡᱽᱞᱤ ᱥᱟᱵᱽ-ᱥᱴᱮᱥᱚᱱ ᱨᱮ ᱢᱟᱨᱟᱝ ᱥᱚᱨᱴ ᱥᱟᱨᱠᱤᱴ ᱯᱷᱩᱴᱟᱹᱣ ᱠᱟᱱᱟ᱾\n• ᱱᱚᱶᱟ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ ᱞᱟᱹᱜᱤᱫ Arc-rated ᱥᱩᱴ ᱟᱨ ᱨᱚᱵᱚᱨ ᱛᱤ-ᱢᱳᱡᱟ ᱦᱚᱨᱚᱜ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 6. MACHINERY & WORKPLACE SAFETY
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'machine_guarding',
    module: MODULES.MACHINERY,
    keywords: [
      'machine guarding', 'machine guards', 'safety guard', 'open gears', 'pinch point', 'machine cover',
      'machine guard kyu', 'मशीन सुरक्षा गार्ड', 'मशीन गार्ड'
    ],
    answer_en: "Machine Guarding Principles (IS 9474 / OSHA 1910.212):\n\n• The Principle: Any machine part, function, or process that may cause injury MUST be mechanically guarded before operation.\n• Types of Guards:\n  1. Fixed Guards: Permanent barriers enclosing gears, pulleys, and flywheels.\n  2. Interlocked Guards: Automatically cut machine power if opened or removed.\n  3. Presence-Sensing Devices: Light curtains or pressure mats that freeze equipment if a worker enters the hazard zone.\n\n⚠️ Golden Rule: NEVER bypass, disable, or operate a machine with its safety guards removed. Report missing guards immediately.",
    answer_hi: "मशीन सुरक्षा गार्ड के सिद्धांत (IS 9474):\n\n• सिद्धांत: मशीन का कोई भी घूमने वाला भाग जो चोट पहुंचा सकता है, उस पर गार्ड लगा होना अनिवार्य है।\n• गार्ड के प्रकार:\n  1. फिक्स्ड गार्ड: गियर और बेल्ट को ढकने वाले स्थायी कवर।\n  2. इंटरलॉक्ड गार्ड: यदि गार्ड खोला जाए तो मशीन अपने आप बंद हो जाती है।\n  3. लाइट कर्टेन: अदृश्य सेंसर बीम, जो हाथ अंदर जाने पर मशीन तुरंत रोक देती है।\n\n⚠️ गार्ड हटाकर या बाईपास करके कभी भी मशीन न चलाएं।",
    answer_hinglish: "Machine Guarding ke rules:\n\n• Niyam: Har ghoomne wale gear, cutter ya belt par Safety Guard hona compulsory hai.\n• Types:\n  1. Fixed Guard: Lohe ka permanent cover.\n  2. Interlocked Guard: Cover kholte hi machine apne aap band ho jati hai.\n  3. Light Curtain: Sensor jo hath aate hi machine ko rok deta hai.\n\n⚠️ Kabhi bhi safety guard ko khol kar ya bypass karke machine na chalayein.",
    answer_sat: "ᱢᱮᱥᱤᱱ ᱜᱟᱨᱰ (Machine Guard):\n• ᱟᱹᱪᱩᱨᱚᱜ ᱠᱟᱱ ᱜᱤᱭᱟᱨ, ᱵᱮᱞᱴ ᱟᱨ ᱠᱟᱴᱟᱨ ᱪᱮᱛᱟᱱ ᱨᱮ ᱜᱟᱨᱰ (Cover) ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾ ᱜᱟᱨᱰ ᱵᱮᱜᱚᱨ ᱢᱮᱥᱤᱱ ᱛᱤᱥ ᱦᱚᱸ ᱟᱞᱚᱢ ᱪᱟᱹᱞᱩᱭᱟ᱾",
  },
  {
    id: 'emergency_stop_button',
    module: MODULES.MACHINERY,
    keywords: [
      'emergency stop', 'e stop', 'estop', 'red mushroom button', 'emergency switch', 'machine band karna',
      'emergency push button', 'इमरजेंसी स्टॉप'
    ],
    answer_en: "Emergency Stop (E-Stop) Button Protocol:\n\n• Identification: Large, red, mushroom-shaped push-button with a bright yellow background plate.\n• Function: Immediately cuts motive power to all driven hazardous elements without introducing secondary hazards.\n• Rules for Use:\n  1. Press FIRMLY in any emergency: Entanglement, abnormal jamming, scream for help, or smoke.\n  2. E-Stop locks down upon pressing; must be manually twist-reset after hazard resolution.\n  3. ⚠️ An E-Stop is NOT a substitute for Lockout/Tagout (LOTO) during maintenance! It does not isolate residual stored energy.",
    answer_hi: "इमरजेंसी स्टॉप (E-Stop) बटन के नियम:\n\n• पहचान: पीले बैकग्राउंड पर बड़ा लाल मशरूम जैसा गोल बटन।\n• कार्य: दबाते ही मशीन की सारी बिजली तुरंत कट जाती है और मशीन रुक जाती है।\n• नियम:\n  1. किसी भी दुर्घटना, कपड़ा फंसने या खतरे की स्थिति में इसे तुरंत दबाएं।\n  2. रिसेट करने के लिए बटन को घुमाकर खींचना पड़ता है।\n  3. ⚠️ E-Stop रखरखाव (Maintenance) के समय LOTO का विकल्प नहीं है।",
    answer_hinglish: "Emergency Stop (E-Stop) button kaise use karein:\n\n• Pehchan: Peeli plate par bada Laal mushroom jaisa button hota hai.\n• Jab bhi kisi ka haath fanse, ajeeb awaaz aaye ya dhuwan nikle, turant E-Stop daba dein.\n• Ye machine ki power turant cut kar deta hai.\n• Yaad rakhein: E-Stop machine service karne ke waqt LOTO ka substitute nahi hai.",
    answer_sat: "ᱤᱢᱟᱨᱡᱮᱱᱥᱤ ᱥᱴᱳᱯ (E-Stop) ᱵᱟᱴᱚᱱ:\n• ᱥᱟᱥᱟᱝ ᱪᱮᱛᱟᱱ ᱨᱮ ᱟᱨᱟᱜ ᱜᱩᱞᱟᱹᱭ ᱵᱟᱴᱚᱱ᱾ ᱟᱯᱟᱛᱠᱟᱞ ᱚᱠᱛᱚ ᱱᱚᱶᱟ ᱫᱟᱵᱟᱣ ᱞᱮᱠᱷᱟᱱ ᱢᱮᱥᱤᱱ ᱛᱤᱸᱜᱩᱱᱟ᱾",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 7. MINING SAFETY (DGMS REGULATIONS)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'mining_safety_dgms',
    module: MODULES.MINING,
    keywords: [
      'mining', 'mine safety', 'dgms', 'coal mine', 'underground mine', 'koyla khadan', 'roof fall',
      'strata', 'firedamp', 'self rescuer', 'mining niyam', 'खान सुरक्षा', 'कोयला खदान'
    ],
    answer_en: "DGMS Underground Mining Safety Regulations (Mines Act 1952):\n\n• Roof Fall / Strata Control: Check roof supports and rock bolts daily. Use Sounding Rods to tap and inspect rock stability before entering any active face.\n• Noxious Gas Monitoring: Continuously test for Firedamp (Methane - CH₄, explosive at 5–15%), Blackdamp (excess CO₂ / Nitrogen causing suffocation), and Afterdamp (Carbon Monoxide after blast).\n• Personal Safety Equipment: Cap lamp with intrinsic battery, flame-proof safety boots, DGMS-approved hard hat, and personal chemical Self-Rescuer (SCSR) providing 30–60 minutes of oxygen during mine fires.\n• Escapeway: Know primary and secondary intake/return airway escape paths at all times.",
    answer_hi: "खान सुरक्षा (DGMS) और कोयला खदान नियम:\n\n• छत की जांच (Roof Control): काम शुरू करने से पहले छड़ों से ठोककर छत और साइड्स की स्थिरता जांचें।\n• खतरनाक गैसें: मीथेन (Firedamp - 5-15% पर विस्फोटक) और कार्बन मोनोऑक्साइड की लगातार जांच करें।\n• अनिवार्य उपकरण: टोपी वाली लाइट (Cap Lamp), सुरक्षा जूते और सेल्फ-रेस्क्यूअर (SCSR जो आग में ऑक्सीजन देता है)।\n• आपातकालीन निकास: हमेशा प्राथमिक और द्वितीयक हवा मार्ग के निकास रास्तों को याद रखें।",
    answer_hinglish: "Mining Safety (DGMS) ke mukhya niyam:\n\n• Roof Support: Khadan mein kaam shuru karne se pehle chhat ko tap karke check karein ki patthar dheela toh nahi hai.\n• Toxic Gases: Methane (CH₄) aur Carbon Monoxide ka meter se lagatar test karein.\n• SCSR (Self-Rescuer): Aag lagne par 30-60 minute oxygen dene wala portable device hamesha belt par bandha hona chahiye.\n• Cap lamp aur steel toe boots khadan ke andar compulsory hain.",
    answer_sat: "ᱠᱷᱟᱫᱟᱱ ᱥᱩᱨᱠᱷᱟ (Mining DGMS) ᱱᱤᱭᱟᱹᱢ:\n• ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱵᱚᱞᱚᱱ ᱞᱟᱦᱟ ᱪᱷᱟᱛ ᱨᱮᱭᱟᱜ ᱫᱷᱤᱨᱤ ᱴᱮᱥᱴ ᱢᱮ᱾\n• ᱢᱤᱛᱷᱮᱱ (Methane) ᱜᱮᱥ ᱪᱮᱠ ᱢᱮ᱾\n• ᱠᱮᱯ ᱞᱮᱢᱯ (Cap lamp) ᱟᱨ Self-Rescuer ᱦᱚᱨᱚᱜ ᱠᱟᱛᱮ ᱜᱮ ᱵᱚᱞᱚᱱ ᱢᱮ᱾",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 8. FIRST AID & MEDICAL RESPONSE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'first_aid_burns',
    module: MODULES.GLOBAL,
    keywords: [
      'burns', 'jal gaya', 'first aid burns', 'burn treatment', 'hot water burn', 'chemical burn',
      'jalne par kya kare', 'toothpaste on burn', 'ice on burn', 'जलने पर', 'जलने पर उपचार',
      'जल गया क्या लगाएं'
    ],
    answer_en: "Industrial First Aid for Thermal & Chemical Burns:\n\n• Thermal Burns (Hot metal, steam, flames):\n  1. COOL IMMEDIATELY: Place under cool, clean gently running tap water for at least 10 to 20 minutes.\n  2. ❌ NEVER APPLY: Ice, iced water, toothpaste, butter, mustard oil, or turmeric. These trap heat inside the tissue and cause severe infection!\n  3. COVER: Cover loosely with a sterile, non-adherent dressing or clean cling film wrap.\n  4. SEEK MEDICAL HELP: For burns larger than a palm size or on face/hands/joints.\n\n• Chemical Burns: Flush skin or eyes continuously at the Emergency Eyewash / Deluge Shower for a MINIMUM of 15 to 20 minutes while removing contaminated clothing.",
    answer_hi: "जलने (Burns) पर प्राथमिक चिकित्सा:\n\n• आग या गर्म वस्तु से जलने पर:\n  1. तुरंत ठंडा करें: कम से कम 10 से 20 मिनट तक बहते हुए साफ ठंडे पानी से धोएं।\n  2. ❌ कभी न लगाएं: बर्फ, टूथपेस्ट, मक्खन, तेल या हल्दी! यह त्वचा के अंदर गर्मी को रोकते हैं और इन्फेक्शन फैलाते हैं।\n  3. ढकें: साफ सूती कपड़े या स्टेराइल पट्टी से ढीला ढकें।\n  4. डॉक्टर के पास जाएं।\n\n• केमिकल से जलने पर: आपातकालीन आई-वॉश या शॉवर पर कम से कम 15-20 मिनट तक लगातार धोएं।",
    answer_hinglish: "Jalne (Burns) par sahi First Aid:\n\n• 1. Turant 10 se 20 minute tak beh-te hue taaze thande paani ke neeche rakhein.\n• 2. ❌ Barf, toothpaste, tel ya haldi KABHI NA LAGAYEIN! Isse tissue damage badhta hai aur infection hota hai.\n• 3. Saaf sterile patti se halka cover karein.\n• 4. Agar chemical gira ho, toh Emergency Eye Wash / Shower par kam se kam 15-20 minute dhowein aur kapde utaar dein.\n• Turant 108 ya plant doctor ko dikhayein.",
    answer_sat: "ᱞᱚ ᱞᱮᱱᱠᱷᱟᱱ (Burns) ᱯᱟᱹᱦᱤᱞ ᱨᱟᱱ:\n• ᱑᱐-᱒᱐ ᱢᱤᱱᱤᱴ ᱫᱷᱟᱹᱵᱤᱡ ᱞᱤᱸᱜᱤᱱ ᱨᱮᱭᱟᱲ ᱫᱟᱜ ᱛᱮ ᱟᱹᱨᱩᱵ ᱢᱮ᱾\n• ᱵᱚᱨᱚᱯᱷ, ᱛᱩᱲᱤ ᱥᱩᱱᱩᱢ ᱥᱮ ᱴᱩᱛᱷᱯᱮᱥᱴ ᱛᱤᱥ ᱦᱚᱸ ᱟᱞᱚᱢ ᱞᱟᱜᱟᱣᱟ!\n• ᱥᱟᱯᱷᱟ ᱞᱩᱜᱽᱲᱤ ᱛᱮ ᱯᱚᱴᱚᱢ ᱠᱟᱛᱮ ᱰᱟᱠᱛᱚᱨ ᱴᱷᱮᱱ ᱤᱫᱤᱭ ᱢᱮ᱾",
  },
  {
    id: 'emergency_contact_numbers',
    module: MODULES.GLOBAL,
    keywords: [
      'emergency number', 'helpline', 'fire brigade number', 'ambulance number', 'police number',
      'phone number', 'call help', '112', '101', '108', '100', 'आपातकालीन नंबर', 'हेल्पलाइन नंबर',
      'ambulance', 'fire brigade'
    ],
    answer_en: "National Emergency Helpline Numbers (India):\n\n🆘 112 — National Unified Emergency Number (Police, Fire, Ambulance, Disaster)\n🚒 101 — Fire & Rescue Service\n🚑 108 — Emergency Medical & Ambulance Service (State / National Health Mission)\n👮 100 — Police Assistance\n⚡ 1912 — Electricity Emergency & Disaster Helpline\n🧪 1800-116-117 — National Poison Information Centre (AIIMS)\n\nAlways memorize your site-specific Emergency Control Room (ECR) internal extension.",
    answer_hi: "भारत के प्रमुख आपातकालीन हेल्पलाइन नंबर:\n\n🆘 112 — राष्ट्रीय एकीकृत आपातकालीन नंबर (पुलिस, फायर, एम्बुलेंस)\n🚒 101 — अग्निशमन सेवा (Fire Brigade)\n🚑 108 — एम्बुलेंस और आपातकालीन चिकित्सा सहायता\n👮 100 — पुलिस\n⚡ 1912 — बिजली आपातकाल हेल्पलाइन\n\nअपनी फैक्ट्री/प्लांट के कंट्रोल रूम का स्थानीय नंबर भी हमेशा याद रखें।",
    answer_hinglish: "India ke zaroori Emergency Helpline Numbers:\n\n🆘 112 — National Emergency Number (All-in-one)\n🚒 101 — Fire Brigade\n🚑 108 — Ambulance Service\n👮 100 — Police Control Room\n⚡ 1912 — Electricity Emergency Helpline\n\nApne plant ke Safety Control Room ka number bhi notice board par note rakhein.",
    answer_sat: "ᱵᱷᱟᱨᱚᱛ ᱨᱮᱱᱟᱜ ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱱᱚᱢᱵᱚᱨ ᱠᱚ:\n🆘 ᱑᱑᱒ — ᱡᱟᱹᱛᱤᱭᱟᱹᱨᱤ ᱟᱯᱟᱛᱠᱟᱞ ᱱᱚᱢᱵᱚᱨ\n🚒 ᱑᱐᱑ — ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ (Fire)\n🚑 ᱑᱐᱘ — ᱨᱩᱜᱤ ᱜᱟᱹᱰᱤ (Ambulance)\n👮 ᱑᱐᱐ — ᱯᱩᱞᱤᱥ (Police)᱾",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 9. SURAKSHAAR PLATFORM, AR TRAINING & CERTIFICATION
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'surakshaar_certificate_process',
    module: MODULES.PLATFORM,
    keywords: [
      'certificate', 'how to get certificate', 'qr certificate', 'download certificate', 'pass assessment',
      'marks', 'score', 'pramanpatra', 'certificate kaise milega', 'passing score', 'सर्टिफिकेट', 'प्रमाणपत्र'
    ],
    answer_en: "How to Earn a Certified SurakshaAR Certificate:\n\n1. COMPLETE THE MODULE: Go to Training Modules on the Dashboard and launch any training module (Fire, Gas Leak, PPE Baseline, Electrical, Machinery).\n2. PRACTICE IN AR: Go through the step-by-step interactive tutorial and AR hazard simulation.\n3. PASS THE ASSESSMENT: Complete the safety quiz at the end of the module. A minimum passing score of 70% is required.\n4. INSTANT CERTIFICATE: Upon passing, your digitally signed certificate with a unique Verification Hash and dynamic QR code is generated.\n5. DOWNLOAD & VERIFY: You can preview, print, or download your certificate anytime from your Dashboard or Profile section.",
    answer_hi: "SurakshaAR प्रमाणपत्र कैसे प्राप्त करें:\n\n1. मॉड्यूल पूरा करें: डैशबोर्ड पर ट्रेनिंग मॉड्यूल (फायर, गैस, PPE, आदि) चुनें।\n2. AR में अभ्यास करें: ट्यूटोरियल और 3D AR सिमुलेशन पूरा करें।\n3. असेसमेंट परीक्षा दें: मॉड्यूल के अंत में क्विज़ में कम से कम 70% अंक प्राप्त करना अनिवार्य है।\n4. तुरंत प्रमाणपत्र: पास होते ही यूनिक QR कोड और सत्यापन हैश के साथ डिजिटल प्रमाणपत्र जारी होता है।\n5. डाउनलोड करें: आप अपने डैशबोर्ड या प्रोफाइल सेक्शन से कभी भी प्रमाणपत्र डाउनलोड या प्रिंट कर सकते हैं।",
    answer_hinglish: "SurakshaAR Certificate kaise milta hai:\n\n1. Dashboard par jakar koi bhi Training Module (Fire, Gas, PPE Baseline, etc.) shuru karein.\n2. AR simulation aur safety steps complete karein.\n3. Module ke end mein Assessment Quiz mein kam se kam 70% passing score laana zaroori hai.\n4. Pass hote hi aapka tamper-proof QR code wala verified Certificate ban jayega.\n5. Aap Dashboard ya Profile page par jakar 'View Certificate' par click karke PDF/Print download kar sakte hain.",
    answer_sat: "SurakshaAR ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱪᱮᱫ ᱞᱮᱠᱟ ᱧᱟᱢᱚᱜᱼᱟ:\n᱑. ᱴᱨᱮᱱᱤᱝ ᱢᱚᱰᱩᱞ ᱯᱩᱨᱟᱹᱣ ᱢᱮ᱾\n᱒. AR ᱥᱤᱢᱩᱞᱮᱥᱚᱱ ᱯᱟᱨᱚᱢ ᱢᱮ᱾\n᱓. ᱠᱩᱠᱞᱤ-ᱛᱮᱞᱟ ᱨᱮ ᱠᱚᱢ ᱠᱷᱚᱱ ᱠᱚᱢ ᱗᱐% ᱱᱚᱢᱵᱚᱨ ᱟᱹᱜᱩᱭ ᱢᱮ᱾\n᱔. QR ᱠᱳᱰ ᱟᱱ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱧᱟᱢᱚᱜᱼᱟ, ᱡᱟᱦᱟᱸ ᱫᱚ ᱰᱟᱭᱩᱱᱞᱳᱰ ᱫᱟᱲᱮᱭᱟᱜᱼᱟᱢ᱾",
  },
  {
    id: 'surakshaar_training_modules_list',
    module: MODULES.PLATFORM,
    keywords: [
      'modules', '5 modules', 'training modules', 'all modules', 'list of modules', 'available courses',
      'modules list', 'courses kya hai', 'ट्रेनिंग मॉड्यूल', 'कोर्स'
    ],
    answer_en: "SurakshaAR Training Modules Available (Total 5 Modules):\n\n1. 🔥 Fire & Explosion Response (Module 0001): Extinguisher classification, PASS rule, electrical fire protocols, and rapid facility evacuation.\n2. 🦺 PPE & Industrial Hazard Baseline (Module 0004): 6-point PPE compliance, head/eye/foot inspection, damaged PPE protocols, and hazard warning signs.\n3. 💨 Gas Leak & Confined Space Protocol (Module 0002): Toxic gas detection, 4-gas atmospheric tests, SCBA usage, and mandatory Buddy System rules.\n4. ⚡ High-Voltage Electrical Substation Safety (Module 0003): Arc flash boundaries, 6-step LOTO isolation, capacitor discharge, and electric shock response.\n5. ⚙️ Heavy Machinery & Rotating Equipment Safety (Module 0005): Machine guarding, nip points, entanglement prevention, and Emergency-Stop protocols.",
    answer_hi: "SurakshaAR के 5 मुख्य ट्रेनिंग मॉड्यूल:\n\n1. 🔥 Fire & Explosion Response: अग्निशामक का चुनाव, PASS नियम और निकासी योजना।\n2. 🦺 PPE & Industrial Hazard Baseline: 6-बिंदु PPE उपकरण, क्षतिग्रस्त सुरक्षा गियर की पहचान और चेतावनी संकेत।\n3. 💨 Gas Leak & Confined Space Protocol: गैस रिसाव की पहचान, SCBA उपकरण और बडी सिस्टम।\n4. ⚡ High-Voltage Electrical Substation: आर्क फ्लैश से बचाव, LOTO लॉकिंग और करंट लगने पर बचाव।\n5. ⚙️ Heavy Machinery Safety: मशीन गार्ड, घूमने वाले पार्ट्स से बचाव और इमरजेंसी स्टॉप।",
    answer_hinglish: "SurakshaAR ke total 5 Training Modules hain:\n\n1. 🔥 Fire & Explosion Response: Fire extinguisher types, PASS formula aur evacuation.\n2. 🦺 PPE & Industrial Hazard Baseline: Helmet, Goggles, Boots inspection aur basic plant hazards.\n3. 💨 Gas Leak & Confined Space Protocol: Gas leak detection, 4-gas testing aur Buddy System.\n4. ⚡ High-Voltage Electrical Substation: LOTO isolation aur arc flash protection.\n5. ⚙️ Heavy Machinery Safety: Rotating tools se bachaav, machine guards aur E-Stop button.",
    answer_sat: "SurakshaAR ᱨᱮᱱᱟᱜ ᱕ ᱜᱚᱴᱟᱝ ᱴᱨᱮᱱᱤᱝ ᱢᱚᱰᱩᱞ:\n᱑. 🔥 Fire & Explosion Response (ᱥᱮᱸᱜᱮᱞ ᱨᱩᱠᱷᱤᱭᱟᱹ)\n᱒. 🦺 PPE & Industrial Hazard Baseline (PPE ᱥᱟᱢᱟᱱ ᱪᱤᱱᱦᱟᱹᱣ)\n᱓. 💨 Gas Leak & Confined Space Protocol (ᱜᱮᱥ ᱞᱤᱠ ᱟᱨ ᱵᱟᱰᱤ ᱥᱤᱥᱴᱚᱢ)\n᱔. ⚡ High-Voltage Electrical Substation (ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ ᱟᱨ LOTO)\n᱕. ⚙️ Heavy Machinery Safety (ᱠᱟᱹᱨᱜᱟᱲ ᱢᱮᱥᱤᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ)᱾",
  },
];

// ─── QUERY ENGINE WITH SEMANTIC MATCHING & CONTEXT ───────────────────────────
export function queryKnowledgeBase(input, lang = 'en', currentModule = MODULES.GLOBAL, history = []) {
  if (!input || input.trim().length === 0) return null;

  // 1. Critical Hazard Guardrail Check FIRST (Prevents fatal advice)
  const criticalIntervention = checkCriticalHazardGuardrails(input, lang);
  if (criticalIntervention) {
    return criticalIntervention;
  }

  const normalizedInput = normalizeQuery(input);
  const inputLower = input.toLowerCase();

  // 2. Tokenization
  const tokens = normalizedInput
    .toLowerCase()
    .split(/[\s,?.!;:]+/)
    .filter(t => t.length > 0);

  // 3. Resolve context from previous messages if query is a follow-up
  let contextBoost = '';
  if (tokens.length <= 4 && Array.isArray(history) && history.length > 0) {
    const recentBotMessages = history
      .filter(m => m.role === 'user' || m.role === 'bot')
      .slice(-3)
      .map(m => m.text)
      .join(' ')
      .toLowerCase();
    contextBoost = recentBotMessages;
  }

  // 4. Scoring Algorithm
  const scored = KNOWLEDGE_BASE.map(entry => {
    let score = 0;

    // A. Module context boost (Current active module gets precedence)
    if (currentModule && currentModule !== MODULES.GLOBAL) {
      if (entry.module === currentModule) {
        score += 3.5;
      }
    } else if (entry.module === MODULES.GLOBAL) {
      score += 0.5;
    }

    // B. Direct Keyword matches (with length protection against substring collisions)
    for (const kw of entry.keywords) {
      const kwLower = kw.toLowerCase();

      // Word boundary regex or whole token match for short words
      if (kwLower.length <= 3) {
        if (tokens.includes(kwLower)) {
          score += 5.0;
        }
      } else {
        // Multi-word phrase or word > 3 characters
        if (inputLower.includes(kwLower)) {
          score += 7.0;
        } else if (normalizedInput.includes(kwLower)) {
          score += 4.5;
        }

        // Keyword token overlap
        const kwTokens = kwLower.split(/\s+/).filter(Boolean);
        let matchCount = 0;
        for (const kt of kwTokens) {
          if (tokens.includes(kt)) matchCount++;
        }
        if (matchCount > 0) {
          score += matchCount * 1.5;
        }
      }

      // Context boost for follow-ups
      if (contextBoost && contextBoost.includes(kwLower)) {
        score += 1.5;
      }
    }

    // C. Check entry.shortKeywords if any (only match exact whole tokens)
    if (entry.shortKeywords) {
      for (const sk of entry.shortKeywords) {
        if (tokens.includes(sk.toLowerCase())) {
          score += 5.0;
        }
      }
    }

    return { entry, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  // If match score is insufficient, return safe fallback
  if (!best || best.score < 2.0) {
    const fallbackText = SAFE_FALLBACK[lang] ?? SAFE_FALLBACK.en;
    return {
      answer: fallbackText,
      source: 'National Industrial Safety Protocol (IS / OSHA)',
      confidence: 0.5,
      isFallback: true,
    };
  }

  const ans = (
    (lang === 'sat' && best.entry.answer_sat) ||
    (lang === 'hinglish' && best.entry.answer_hinglish) ||
    (lang === 'hi' && best.entry.answer_hi) ||
    best.entry.answer_en
  ) ?? (SAFE_FALLBACK[lang] ?? SAFE_FALLBACK.en);

  const sourceByModule = {
    [MODULES.FIRE_EXPLOSION]: 'IS 15683 / IS 2190 Fire Safety Code',
    [MODULES.GAS_LEAK]: 'OSHA 1910.146 Confined Space Standard',
    [MODULES.PPE]: 'IS 2925 / IS 15298 / ANSI Z87.1 PPE Standard',
    [MODULES.ELECTRICAL]: 'NFPA 70E / OSHA 1910.147 LOTO Safety Code',
    [MODULES.MACHINERY]: 'IS 9474 / OSHA 1910.212 Machine Safety Standard',
    [MODULES.MINING]: 'DGMS / Mines Act 1952 Safety Protocol',
    [MODULES.PLATFORM]: 'SurakshaAR Platform Verification Standard',
    [MODULES.GLOBAL]: 'National Industrial Safety Code (IS / OSHA)',
  };

  const chosenSource = sourceByModule[best.entry.module] || 'National Industrial Safety Protocol';

  return {
    answer: ans,
    source: chosenSource,
    confidence: Math.min(0.99, 0.72 + best.score * 0.04),
    moduleId: best.entry.module,
  };
}

// ─── LOCAL SAFETY ASSISTANT WITH OPTIONAL BACKEND PROXY ─────
export async function querySafetyAssistant(input, lang = 'en', currentModule = MODULES.GLOBAL, history = []) {
  // 1. Always check critical hazard guardrails locally first (fastest life-critical intervention)
  const critical = checkCriticalHazardGuardrails(input, lang);
  if (critical) return critical;

  // 2. Check verified tri-lingual FAQ knowledge base (instant & verified in EN, HI, SAT)
  const faqMatch = findFaqMatch(input, lang);
  if (faqMatch) return faqMatch;

  // 3. Try custom backend endpoint if explicitly configured in environment
  if (typeof window !== 'undefined') {
    const customEndpoint = import.meta.env?.VITE_CHAT_API_URL;
    if (customEndpoint && customEndpoint.trim().length > 0) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(customEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: input,
            message: input,
            messages: [
              ...(Array.isArray(history)
                ? history.slice(-8).map(m => ({
                    role: m.role === 'assistant' || m.role === 'bot' ? 'assistant' : 'user',
                    content: m.text || m.content || ''
                  }))
                : []),
              { role: 'user', content: input }
            ],
            lang,
            module: currentModule,
            sessionId: (typeof localStorage !== 'undefined' && localStorage.getItem('suraksha_mitra_session_id')) || 'default-session',
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          const text = data?.reply || data?.answer;
          if (text) {
            return {
              answer: text,
              reply: text,
              source: data.source || (data.provider ? `Suraksha Mitra (${data.provider})` : 'Suraksha Mitra AI'),
              sources: Array.isArray(data.sources) ? data.sources : [],
              confidence: data.confidence || 0.95,
              groundingQueries: data.groundingQueries || [],
              isCritical: data.isCritical || false,
            };
          }
        }
      } catch (_) {
        // Fall back cleanly to local knowledge base
      }
    }
  }

  // 4. Instant local safety knowledge base response (100% standalone, resilient & zero API key dependency)
  return queryKnowledgeBase(input, lang, currentModule, history);
}

// ─── DYNAMIC SUGGESTED QUESTIONS FOR ALL MODULES & LANGUAGES ─────────────────
export function getSuggestedQuestions(module = MODULES.GLOBAL, lang = 'en') {
  const suggestions = {
    FIRE_EXPLOSION: {
      en: [
        { label: '🔴 Extinguisher Types', query: 'What are the 4 main fire extinguisher types?' },
        { label: '🎯 PASS Technique', query: 'How does the PASS rule work for fire extinguishers?' },
        { label: '⚡ Electrical Fire', query: 'Which extinguisher should I use for an electrical fire?' },
        { label: '🚪 Evacuation Steps', query: 'What is the fire evacuation procedure?' },
      ],
      hi: [
        { label: '🔴 अग्निशामक प्रकार', query: 'अग्निशामक के कौन से मुख्य प्रकार हैं?' },
        { label: '🎯 PASS नियम', query: 'अग्निशामक चलाने का PASS नियम क्या है?' },
        { label: '⚡ बिजली की आग', query: 'बिजली की आग के लिए कौन सा अग्निशामक उपयोग करें?' },
        { label: '🚪 निकास प्रक्रिया', query: 'आग लगने पर निकासी के सही नियम क्या हैं?' },
      ],
      hinglish: [
        { label: '🔴 Extinguisher Types', query: 'Fire extinguisher ke kaun-kaun se types hote hain?' },
        { label: '🎯 PASS Formula', query: 'Extinguisher chalane ka PASS rule kya hai?' },
        { label: '⚡ Bijli ki Aag', query: 'Bijli ki aag bujhane ke liye kaunsa extinguisher use karein?' },
        { label: '🚪 Bahar Nikalna', query: 'Fire evacuation sequence kya hai?' },
      ],
      sat: [
        { label: '🔴 ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱤᱡ', query: 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱤᱡ ᱞᱮᱠᱟᱱ ᱪᱮᱫ ᱠᱚ?' },
        { label: '🎯 PASS ᱱᱤᱭᱟᱹᱢ', query: 'PASS ᱱᱤᱭᱟᱹᱢ ᱪᱮᱫ ᱞᱮᱠᱟ ᱠᱟᱹᱢᱤᱭᱟ?' },
        { label: '⚡ ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ', query: 'ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱹᱜᱤᱫ ᱚᱠᱟ ᱤᱬᱤᱡᱤᱡ?' },
        { label: '🚪 ᱱᱤᱠᱟᱥ', query: 'ᱥᱮᱸᱜᱮᱞ ᱱᱤᱠᱟᱥ ᱫᱷᱟᱯ ᱪᱮᱫ?' },
      ],
    },
    GAS_LEAK: {
      en: [
        { label: '👃 Gas Leak Signs', query: 'How do I detect and respond to a gas leak?' },
        { label: '👥 Buddy System', query: 'What is the buddy system in confined spaces?' },
        { label: '🎭 SCBA Gear', query: 'When is SCBA required instead of a mask?' },
        { label: '🧪 4-Gas Monitor', query: 'What are safe oxygen levels in a confined space?' },
      ],
      hi: [
        { label: '👃 गैस रिसाव पहचान', query: 'गैस रिसाव के लक्षण और तुरंत क्या करें?' },
        { label: '👥 बडी सिस्टम', query: 'सीमित स्थान में बडी सिस्टम क्या है?' },
        { label: '🎭 SCBA उपकरण', query: 'गैस रिसाव में कौन सा मास्क पहनें?' },
        { label: '🧪 गैस परीक्षण', query: 'सीमित स्थान में ऑक्सीजन का सुरक्षित स्तर क्या है?' },
      ],
      hinglish: [
        { label: '👃 Gas Leak Detection', query: 'Gas leak kaise pehchanein aur kya karein?' },
        { label: '👥 Buddy System', query: 'Buddy system aur Safety Watch ke kya rules hain?' },
        { label: '🎭 SCBA Gear', query: 'Gas leak mein SCBA kab pehanna zaroori hota hai?' },
        { label: '🧪 4-Gas Monitor', query: 'Confined space mein safe oxygen level kitna hona chahiye?' },
      ],
      sat: [
        { label: '👃 ᱜᱮᱥ ᱞᱤᱠ', query: 'ᱜᱮᱥ ᱞᱤᱠ ᱪᱮᱫ ᱞᱮᱠᱟ ᱪᱤᱱᱦᱟᱹᱣᱟ?' },
        { label: '👥 ᱵᱟᱰᱤ ᱥᱤᱥᱴᱚᱢ', query: 'ᱵᱟᱰᱤ ᱥᱤᱥᱴᱚᱢ ᱫᱚ ᱪᱮᱫ?' },
        { label: '🎭 SCBA ᱢᱟᱥᱠ', query: 'ᱜᱮᱥ ᱞᱤᱠ ᱨᱮ ᱪᱮᱫ PPE?' },
        { label: '🧪 ᱚᱠᱥᱤᱡᱮᱱ', query: 'ᱥᱤᱢᱤᱛ ᱴᱷᱟᱶ ᱨᱮ ᱚᱠᱥᱤᱡᱮᱱ ᱛᱤᱱᱟᱹᱜ ᱞᱟᱹᱠᱛᱤ?' },
      ],
    },
    PPE: {
      en: [
        { label: '🪖 6-Point PPE List', query: 'What is the mandatory industrial PPE baseline?' },
        { label: '🎨 Helmet Colors', query: 'What do different safety helmet colors mean?' },
        { label: '👢 Safety Boots', query: 'When should damaged safety shoes be replaced?' },
        { label: '🪜 Height Harness', query: 'What are the rules for fall protection harness?' },
      ],
      hi: [
        { label: '🪖 PPE बेसलाइन', query: 'अनिवार्य औद्योगिक PPE उपकरण कौन से हैं?' },
        { label: '🎨 हेलमेट रंग कोड', query: 'विभिन्न रंगों के सेफ्टी हेलमेट का क्या अर्थ है?' },
        { label: '👢 सेफ्टी बूट्स', query: 'क्षतिग्रस्त सुरक्षा जूते कब बदलने चाहिए?' },
        { label: '🪜 ऊंचाई हार्नेस', query: 'ऊंचाई पर सुरक्षा हार्नेस के क्या नियम हैं?' },
      ],
      hinglish: [
        { label: '🪖 Mandatory PPE', query: 'Plant mein kaunsa PPE pehanna zaroori hota hai?' },
        { label: '🎨 Helmet Colors', query: 'Safety helmet ke alag-alag rangon ka kya matlab hai?' },
        { label: '👢 Safety Shoes', query: 'Shoes damage hone par kya karein?' },
        { label: '🪜 Height Harness', query: 'Unchai par fall protection harness kab pehanna hota hai?' },
      ],
      sat: [
        { label: '🪖 PPE ᱥᱟᱢᱟᱱ', query: 'ᱞᱟᱹᱠᱛᱤᱭᱟᱱ PPE ᱥᱟᱢᱟᱱ ᱪᱮᱫ ᱠᱚ?' },
        { label: '🎨 ᱦᱮᱞᱢᱮᱴ ᱨᱚᱝ', query: 'ᱦᱮᱞᱢᱮᱴ ᱨᱚᱝ ᱨᱮᱭᱟᱜ ᱢᱟᱱᱮ ᱪᱮᱫ?' },
        { label: '👢 ᱥᱩᱨᱠᱷᱟ ᱡᱩᱛᱟᱹ', query: 'ᱡᱩᱛᱟᱹ ᱨᱟᱹᱯᱩᱫ ᱞᱮᱱᱠᱷᱟᱱ ᱪᱮᱫ ᱠᱟᱹᱢᱤ?' },
        { label: '🪜 ᱦᱟᱨᱱᱮᱥ', query: 'ᱩᱥᱩᱞ ᱨᱮ ᱦᱟᱨᱱᱮᱥ ᱱᱤᱭᱟᱹᱢ ᱪᱮᱫ?' },
      ],
    },
    ELECTRICAL: {
      en: [
        { label: '🔒 LOTO Steps', query: 'What are the 6 steps of Lockout/Tagout (LOTO)?' },
        { label: '⚡ Shock First Aid', query: 'What to do if someone gets an electric shock?' },
        { label: '💥 Arc Flash', query: 'What causes an arc flash in a substation?' },
        { label: '🧯 Electrical Fire', query: 'Can I pour water on an electrical fire?' },
      ],
      hi: [
        { label: '🔒 LOTO प्रक्रिया', query: 'LOTO (लॉकआउट/टैगआउट) के 6 चरण क्या हैं?' },
        { label: '⚡ करंट का झटका', query: 'बिजली का झटका लगने पर क्या प्राथमिक उपचार करें?' },
        { label: '💥 आर्क फ्लैश', query: 'सबस्टेशन में आर्क फ्लैश क्या होता है?' },
        { label: '🧯 बिजली की आग', query: 'बिजली की आग पर कौन सा अग्निशामक प्रयोग करें?' },
      ],
      hinglish: [
        { label: '🔒 LOTO Steps', query: 'LOTO protocol ke 6 steps kya hain?' },
        { label: '⚡ Current Shock', query: 'Current lagne par victim ko kaise bachayein?' },
        { label: '💥 Arc Flash', query: 'Substation mein arc flash hazard se kaise bachein?' },
        { label: '🧯 Bijli ki Aag', query: 'Bijli ki aag bujhane ka sahi tarika kya hai?' },
      ],
      sat: [
        { label: '🔒 LOTO ᱱᱤᱭᱟᱹᱢ', query: 'LOTO ᱨᱮᱱᱟᱜ ᱖ ᱫᱷᱟᱯ ᱪᱮᱫ?' },
        { label: '⚡ ᱠᱟᱨᱮᱱᱴ ᱵᱟᱡᱟᱣ', query: 'ᱵᱤᱡᱽᱞᱤ ᱠᱟᱨᱮᱱᱴ ᱞᱟᱜᱟᱣ ᱞᱮᱱᱠᱷᱟᱱ ᱪᱮᱫ ᱠᱟᱹᱢᱤ?' },
        { label: '💥 ᱟᱨᱠ ᱯᱷᱞᱮᱥ', query: 'ᱟᱨᱠ ᱯᱷᱞᱮᱥ ᱫᱚ ᱪᱮᱫ?' },
        { label: '🧯 ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ', query: 'ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱫᱟᱜ ᱫᱩᱞ ᱜᱟᱱᱚᱜᱼᱟ?' },
      ],
    },
    MACHINERY: {
      en: [
        { label: '⚙️ Machine Guards', query: 'Why are machine guards mandatory on rotating equipment?' },
        { label: '🛑 Emergency Stop', query: 'When should the Emergency Stop button be used?' },
        { label: '📦 Safe Lifting', query: 'What is the correct posture for heavy manual lifting?' },
        { label: '🧤 Rotating Hazard', query: 'Why are loose gloves prohibited near lathes?' },
      ],
      hi: [
        { label: '⚙️ मशीन गार्ड्स', query: 'घूमने वाली मशीनों पर सुरक्षा गार्ड क्यों जरूरी हैं?' },
        { label: '🛑 इमरजेंसी स्टॉप', query: 'इमरजेंसी स्टॉप बटन का प्रयोग कब करना चाहिए?' },
        { label: '📦 वजन उठाना', query: 'भारी वजन उठाने का सही एर्गोनोमिक तरीका क्या है?' },
        { label: '🧤 लेथ मशीन दस्ताने', query: 'लेथ मशीन के पास ढीले दस्ताने क्यों मना हैं?' },
      ],
      hinglish: [
        { label: '⚙️ Machine Guards', query: 'Machine par safety guard kyu zaroori hote hain?' },
        { label: '🛑 Emergency Stop', query: 'Emergency Stop (E-Stop) button kab dabana chahiye?' },
        { label: '📦 Bhari Vajan Posture', query: 'Bhari saman uthane ka safe tareeka kya hai?' },
        { label: '🧤 Lathe par Gloves', query: 'Machine ke paas loose gloves kyu mana hai?' },
      ],
      sat: [
        { label: '⚙️ ᱢᱮᱥᱤᱱ ᱜᱟᱨᱰ', query: 'ᱢᱮᱥᱤᱱ ᱜᱟᱨᱰ ᱪᱮᱫᱟᱜ ᱞᱟᱹᱠᱛᱤᱭᱟ?' },
        { label: '🛑 ᱤ-ᱥᱴᱳᱯ', query: 'ᱤᱢᱟᱨᱡᱮᱱᱥᱤ ᱥᱴᱳᱯ ᱵᱟᱴᱚᱱ ᱛᱤᱨᱮ ᱫᱟᱵᱟᱣᱟ?' },
        { label: '📦 ᱵᱷᱟᱹᱨᱤ ᱡᱤᱱᱤᱥ', query: 'ᱵᱷᱟᱹᱨᱤ ᱡᱤᱱᱤᱥ ᱪᱮᱫ ᱞᱮᱠᱟ ᱛᱩᱞᱟ?' },
        { label: '🧤 ᱞᱮᱛᱷ ᱢᱮᱥᱤᱱ', query: 'ᱞᱮᱛᱷ ᱢᱮᱥᱤᱱ ᱥᱩᱨ ᱜᱞᱳᱵᱷᱥ ᱢᱟᱱᱟ ᱜᱮᱭᱟ?' },
      ],
    },
    GLOBAL: {
      en: [
        { label: '🔴 Extinguisher Types', query: 'How to use a fire extinguisher with PASS?' },
        { label: '📜 Get Certificate', query: 'How do I earn a verified certificate on SurakshaAR?' },
        { label: '📞 Emergency Numbers', query: 'What are the national emergency helpline numbers?' },
        { label: '🩹 First Aid Burns', query: 'What is the immediate first aid for thermal burns?' },
      ],
      hi: [
        { label: '🔴 अग्निशामक PASS', query: 'अग्निशामक का PASS नियम क्या है?' },
        { label: '📜 सर्टिफिकेट प्रक्रिया', query: 'SurakshaAR में सर्टिफिकेट कैसे प्राप्त करें?' },
        { label: '📞 आपातकालीन नंबर', query: 'भारत के प्रमुख आपातकालीन नंबर क्या हैं?' },
        { label: '🩹 जलने पर उपचार', query: 'जलने पर तुरंत कौन सा प्राथमिक उपचार करें?' },
      ],
      hinglish: [
        { label: '🔴 Extinguisher Types', query: 'Fire extinguisher ke types aur PASS formula kya hai?' },
        { label: '📜 Get Certificate', query: 'SurakshaAR mein certificate kaise milega?' },
        { label: '📞 Helpline Numbers', query: 'Emergency helpline numbers kya hain?' },
        { label: '🩹 Jalne Par First Aid', query: 'Jalne par turant first aid kya karni chahiye?' },
      ],
      sat: [
        { label: '🔴 ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱤᱡ', query: 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱤᱡ ᱪᱮᱫ ᱞᱮᱠᱟ ᱵᱮᱵᱷᱟᱨᱟ?' },
        { label: '📜 ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ', query: 'SurakshaAR ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱪᱮᱫ ᱞᱮᱠᱟ ᱧᱟᱢᱚᱜᱼᱟ?' },
        { label: '📞 ᱟᱯᱟᱛᱠᱟᱞᱤᱱ', query: 'ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱦᱮᱞᱯᱞᱟᱭᱤᱱ ᱱᱚᱢᱵᱚᱨ ᱠᱚ ᱪᱮᱫ?' },
        { label: '🩹 ᱯᱟᱹᱦᱤᱞ ᱨᱟᱱ', query: 'ᱞᱚ ᱞᱮᱱᱠᱷᱟᱱ ᱯᱟᱹᱦᱤᱞ ᱨᱟᱱ ᱪᱮᱫ?' },
      ],
    },
  };

  const modKey = suggestions[module] ? module : 'GLOBAL';
  const group = suggestions[modKey] || suggestions.GLOBAL;
  return group[lang] || group.en;
}
