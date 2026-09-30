/**
 * SurakshaAR — Voice Module (TTS + STT)
 * Uses browser-native Web Speech API — no API key required.
 * 
 * TTS language support:
 *   en → en-IN (Indian English)
 *   hi → hi-IN (Hindi — available on Android Chrome + most browsers)
 *   sat → NO TTS available, returns false (caller shows text-only fallback)
 * 
 * STT: Chrome/Android WebView only.
 */

// Ol Chiki to Devanagari phonetic transliteration for browser Indian TTS engines
const OL_CHIKI_ASPIRATES = {
  '\u1c60\u1c77': 'ख', // k + h -> kh
  '\u1c5c\u1c77': 'घ', // g + h -> gh
  '\u1c6a\u1c77': 'छ', // c + h -> ch
  '\u1c61\u1c77': 'झ', // j + h -> jh
  '\u1c74\u1c77': 'ठ', // t + h -> th
  '\u1c70\u1c77': 'ढ', // d + h -> dh
  '\u1c5b\u1c77': 'थ', // t + h -> th
  '\u1c6b\u1c77': 'ध', // d + h -> dh
  '\u1c6f\u1c77': 'फ', // p + h -> ph
  '\u1c75\u1c77': 'भ', // b + h -> bh
  '\u1c72\u1c77': 'ढ़', // rh + h -> rdh
  '\u1c68\u1c77': 'र्ह', // r + h
}

const OL_CHIKI_SINGLE = {
  '\u1c5a': 'ओ', '\u1c5b': 'त', '\u1c5c': 'ग', '\u1c5d': 'ंग', '\u1c5e': 'ल',
  '\u1c5f': 'ा', '\u1c60': 'क', '\u1c61': 'ज', '\u1c62': 'म', '\u1c63': 'व',
  '\u1c64': 'ी', '\u1c65': 'स', '\u1c66': 'ह', '\u1c67': 'ञ', '\u1c68': 'र',
  '\u1c69': 'ु', '\u1c6a': 'च', '\u1c6b': 'द', '\u1c6c': 'ण', '\u1c6d': 'य',
  '\u1c6e': 'े', '\u1c6f': 'प', '\u1c70': 'ड', '\u1c71': 'न', '\u1c72': 'ड़',
  '\u1c73': 'ो', '\u1c74': 'ट', '\u1c75': 'ब', '\u1c76': 'व', '\u1c77': 'ह',
  '\u1c78': 'ं', '\u1c79': '',   '\u1c7a': '',   '\u1c7b': 'ा', '\u1c7c': '',
  '\u1c7d': '',   '\u1c7e': '।', '\u1c7f': '॥',
  '\u1c50': '0',  '\u1c51': '1', '\u1c52': '2', '\u1c53': '3', '\u1c54': '4',
  '\u1c55': '5',  '\u1c56': '6', '\u1c57': '7', '\u1c58': '8', '\u1c59': '9',
}

export function olChikiToHindi(str) {
  if (!str) return ''
  let s = String(str)
  for (const [pair, rep] of Object.entries(OL_CHIKI_ASPIRATES)) {
    s = s.replaceAll(pair, rep)
  }
  let out = ''
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (OL_CHIKI_SINGLE[ch] !== undefined) {
      if ((ch === '\u1c5f' || ch === '\u1c64' || ch === '\u1c69' || ch === '\u1c6e' || ch === '\u1c73') &&
          (i === 0 || /\s|[.,!?;:()।॥]/.test(s[i - 1]))) {
        const initV = { '\u1c5f': 'आ', '\u1c64': 'इ', '\u1c69': 'उ', '\u1c6e': 'ए', '\u1c73': 'ओ' }
        out += initV[ch]
      } else {
        out += OL_CHIKI_SINGLE[ch]
      }
    } else {
      out += ch
    }
  }
  return out
}

export const TTS_LANG = {
  en: 'en-IN',
  hi: 'hi-IN',
  hinglish: 'hi-IN', // Indian phonetics for natural Hinglish speech
  sat: 'hi-IN', // Regional Indian phonetic voice with Ol Chiki transliteration
}

export const VOICE_LANGUAGES = [
  { code: 'en', label: 'English', stt: 'en-IN', tts: 'en-IN' },
  { code: 'hi', label: 'Hindi', stt: 'hi-IN', tts: 'hi-IN' },
  { code: 'hinglish', label: 'Hinglish', stt: 'hi-IN', tts: 'hi-IN' },
]

export function isVoiceSupported(lang) {
  return ['en', 'hi', 'hinglish'].includes(lang)
}

let currentUtterance = null
let currentAudio = null

/** Stop any currently playing speech or audio narration */
export function stopSpeech() {
  if (typeof window !== 'undefined' && window.AndroidTTS && typeof window.AndroidTTS.stop === 'function') {
    try {
      window.AndroidTTS.stop()
    } catch {}
  }
  if (currentAudio) {
    try {
      currentAudio.pause()
      currentAudio.currentTime = 0
    } catch {}
    currentAudio = null
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel()
    } catch {}
    currentUtterance = null
  }
}

/** Speak text aloud using dual-engine (HD audio stream + native Web Speech API fallback) */
export function speak(text, lang = 'en', onEnd = null) {
  if (!text) return false
  stopSpeech()

  const ttsLang = TTS_LANG[lang] || 'en-IN'
  const shortLang = ttsLang.split('-')[0] // 'hi' or 'en'

  // For Santali, convert Ol Chiki script to phonemes so Indian TTS can pronounce it clearly
  let speechText = text
  if (lang === 'sat') {
    speechText = olChikiToHindi(text)
  }

  // Strip emojis, markdown, and unwanted symbols for smooth, natural pronunciation
  const cleanText = speechText
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/[#*_~`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!cleanText) return false

  // 1. First priority on Android Native App: Hardware Native TextToSpeech Engine
  if (typeof window !== 'undefined' && window.AndroidTTS && typeof window.AndroidTTS.speak === 'function') {
    try {
      window.AndroidTTS.speak(cleanText, shortLang)
      if (onEnd) {
        const words = cleanText.split(' ').length
        const estimatedMs = Math.max(1200, (words / 2.5) * 1000)
        setTimeout(onEnd, estimatedMs)
      }
      return true
    } catch (e) {
      console.warn('[SurakshaAR Voice] AndroidTTS bridge failed, falling back:', e)
    }
  }

  let fallbackAttempted = false

  const playWithSpeechSynthesis = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onEnd) onEnd()
      return false
    }

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.lang = ttsLang
      utterance.rate = 0.90
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onend = () => {
        currentUtterance = null
        if (onEnd) onEnd()
      }
      utterance.onerror = (e) => {
        console.warn('[SurakshaAR Voice] SpeechSynthesis error:', e)
        currentUtterance = null
        if (!fallbackAttempted) {
          fallbackAttempted = true
          playWithAudioStream()
        } else if (onEnd) {
          onEnd()
        }
      }

      const voices = window.speechSynthesis.getVoices() || []
      const voice = voices.find(v => v.lang === ttsLang) ||
                    voices.find(v => v.lang.startsWith(shortLang)) ||
                    voices.find(v => v.lang.includes('IN')) ||
                    voices[0]
      if (voice) utterance.voice = voice

      currentUtterance = utterance
      window.speechSynthesis.speak(utterance)
      return true
    } catch (err) {
      console.warn('[SurakshaAR Voice] SpeechSynthesis exception:', err)
      if (!fallbackAttempted) {
        fallbackAttempted = true
        return playWithAudioStream()
      }
      return false
    }
  }

  const playWithAudioStream = () => {
    try {
      // Chunk up to first 220 chars for quick stream start
      const encoded = encodeURIComponent(cleanText.slice(0, 220))
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${shortLang}&q=${encoded}`
      const audio = new Audio(audioUrl)
      currentAudio = audio

      audio.onended = () => {
        currentAudio = null
        if (onEnd) onEnd()
      }

      audio.onerror = () => {
        currentAudio = null
        // Fall back to native speechSynthesis if network stream fails
        if (!fallbackAttempted) {
          fallbackAttempted = true
          playWithSpeechSynthesis()
        } else if (onEnd) {
          onEnd()
        }
      }

      const p = audio.play()
      if (p !== undefined) {
        p.catch(err => {
          console.warn('[SurakshaAR Voice] Audio playback blocked, attempting SpeechSynthesis:', err)
          if (!fallbackAttempted) {
            fallbackAttempted = true
            playWithSpeechSynthesis()
          }
        })
      }
      return true
    } catch (err) {
      console.warn('[SurakshaAR Voice] Audio stream error:', err)
      if (!fallbackAttempted) {
        fallbackAttempted = true
        return playWithSpeechSynthesis()
      }
      return false
    }
  }

  // If online, prefer the Google TTS audio stream for crisp, authentic pronunciation
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    return playWithAudioStream()
  } else {
    return playWithSpeechSynthesis()
  }
}

/** Get current speech utterance (retained to prevent GC) */
export function getCurrentUtterance() {
  return currentUtterance
}

/** Check if TTS is supported for a language */
export function isTTSSupported(lang) {
  return true
}

/** Returns available voices — call after 'voiceschanged' event */
export function getVoices() {
  return window.speechSynthesis?.getVoices() ?? []
}

/**
 * Start speech recognition (STT). Returns a controller object.
 * Only works in Chrome and Android WebView.
 * 
 * @param {string} lang - 'en' | 'hi' | 'hinglish'
 * @param {function} onResult - called with recognized text
 * @param {function} onError - called with error message
 * @returns {{ stop: function }} controller
 */
export function startListening(lang, onResult, onError) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    onError?.('Speech recognition not supported in this browser.')
    return null
  }

  const recognition = new SpeechRecognition()
  const sttLang = lang === 'en' ? 'en-IN' : 'hi-IN'
  recognition.lang = sttLang
  recognition.interimResults = false
  recognition.maxAlternatives = 1
  recognition.continuous = false

  recognition.onresult = (event) => {
    const text = event.results[0]?.[0]?.transcript ?? ''
    onResult?.(text)
  }
  recognition.onerror = (event) => {
    onError?.(event.error)
  }
  recognition.start()

  return { stop: () => recognition.stop() }
}
