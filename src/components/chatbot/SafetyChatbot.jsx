/**
 * SurakshaAR — AI Conversational Agent Component ("Suraksha Mitra")
 * 
 * Features:
 * - Real conversational AI agent tailored for Jharkhand industrial & mining workers
 * - Real-time Server-Sent Events (SSE) streaming with progressive token rendering
 * - Multi-turn conversation memory with localStorage persistence across refreshes
 * - Contextual history management (sends last ~10 messages as context)
 * - In-header 4-Language bar: English, हिंदी, Hinglish, ᱥᱟᱱᱛᱟᱲᱤ
 * - 3-Language voice input (STT) and text-to-speech output (TTS)
 * - Sliding-window rate limit awareness & graceful fallback handling (zero raw error traces)
 * - Mobile responsive drawer/sheet for factory floor smartphones and tablets
 * - Clear Chat / New Conversation reset
 */
import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react'
import { useLang } from '../../contexts/LanguageContext'
import { querySafetyAssistant, getSuggestedQuestions, findFaqMatch, MODULES } from '../../lib/safetyKnowledge'
import { speak, stopSpeech, startListening, isTTSSupported, isVoiceSupported } from '../../lib/voice'

export const CHAT_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧', voice: true, voiceBadge: 'Voice 🎙️' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳', voice: true, voiceBadge: 'आवाज़ 🎙️' },
  { code: 'hinglish', name: 'Hinglish', native: 'Hinglish', flag: '🇮🇳', voice: true, voiceBadge: 'Awaaz 🎙️' },
  { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', flag: '🌿', voice: false, voiceBadge: 'Text' },
]

const WELCOME_MESSAGES = {
  en: {
    id: 'welcome-en',
    role: 'assistant',
    content: "👷 Johar! I am **Suraksha Mitra**, your AI safety-training assistant for mining and manufacturing in Jharkhand.\n\nAsk me about PPE gear, blast hazards, machinery safety, LOTO protocols, or any AR training module in this app!\n\n🎙️ *Tip: You can also tap the Mic to speak in English, Hindi, or Hinglish.*",
    source: 'Suraksha Mitra AI',
  },
  hi: {
    id: 'welcome-hi',
    role: 'assistant',
    content: "👷 जोहार! मैं **सुरक्षा मित्र** हूँ, झारखंड के खनन एवं औद्योगिक श्रमिकों के लिए आपका AI सुरक्षा-प्रशिक्षण साथी।\n\nमुझसे PPE किट, गैस रिसाव, खदान के खतरों, मशीनरी सेफ्टी, LOTO नियमों या इस ऐप के AR मॉड्यूल के बारे में पूछें!\n\n🎙️ *माइक बटन दबाकर आप बोलकर भी सवाल पूछ सकते हैं।*",
    source: 'सुरक्षा मित्र AI',
  },
  hinglish: {
    id: 'welcome-hinglish',
    role: 'assistant',
    content: "👷 Johar! Main hoon **Suraksha Mitra**, Jharkhand ke mining aur manufacturing workers ka AI safety assistant.\n\nAap mujhse PPE kit, mine hazards, gas leak, machine safety, LOTO rules ya is app ke AR modules ke baare mein kuch bhi pooch sakte hain!\n\n🎙️ *Aap Mic daba kar bolkar bhi pooch sakte hain!*",
    source: 'Suraksha Mitra AI',
  },
  sat: {
    id: 'welcome-sat',
    role: 'assistant',
    content: "👷 ᱡᱚᱦᱟᱨ! ᱤᱧ ᱫᱚ **ᱥᱩᱨᱠᱷᱟ ᱢᱤᱛᱨᱚ** (Suraksha Mitra) ᱠᱟᱹᱱᱟᱹᱧ᱾ ᱠᱷᱟᱫᱟᱱ ᱟᱨ ᱠᱟᱹᱨᱜᱟᱲ ᱨᱮᱱᱟᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ, PPE ᱥᱟᱢᱟᱱ ᱟᱨ AR ᱴᱨᱮᱱᱤᱝ ᱵᱟᱵᱚᱛ ᱤᱧ ᱠᱩᱞᱤ ᱫᱟᱲᱮᱭᱟᱹᱧᱟ᱾",
    source: 'ᱥᱩᱨᱠᱷᱟ ᱢᱤᱛᱨᱚ AI',
  },
}

const PLACEHOLDERS = {
  en: 'Ask Suraksha Mitra about safety, PPE, mining...',
  hi: 'सुरक्षा मित्र से सुरक्षा, PPE, खनन के बारे में पूछें...',
  hinglish: 'Suraksha Mitra se safety, PPE, mining ke baare mein poochein...',
  sat: 'ᱥᱩᱨᱠᱷᱟ ᱢᱤᱛᱨᱚ ᱴᱷᱮᱱ ᱠᱩᱞᱤᱭ ᱢᱮ…',
}

const STORAGE_KEY = 'suraksha_mitra_chat_history'
const SESSION_KEY = 'suraksha_mitra_session_id'

function getSessionId() {
  if (typeof window === 'undefined') return 'sess-default'
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36)
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

function getActiveModuleFromPath(pathname) {
  if (!pathname) return MODULES.GLOBAL
  if (pathname.includes('0001') || pathname.includes('fire')) return MODULES.FIRE_EXPLOSION
  if (pathname.includes('0002') || pathname.includes('gas')) return MODULES.GAS_LEAK
  if (pathname.includes('0003') || pathname.includes('electrical')) return MODULES.ELECTRICAL
  if (pathname.includes('0004') || pathname.includes('ppe')) return MODULES.PPE
  if (pathname.includes('0005') || pathname.includes('machinery')) return MODULES.MACHINERY
  if (pathname.includes('0006') || pathname.includes('mining')) return MODULES.MINING
  return MODULES.GLOBAL
}

export default function SafetyChatbot() {
  const { lang: globalLang } = useLang()
  const location = useLocation()
  const isScenarioPage = location?.pathname?.includes('/scenario')
  if (isScenarioPage) return null

  const activeModule = getActiveModuleFromPath(location?.pathname)

  const [open, setOpen] = useState(false)
  const [badgeDismissed, setBadgeDismissed] = useState(false)
  const [chatLang, setChatLang] = useState(() => {
    return localStorage.getItem('sar_chat_lang') || (['en', 'hi', 'sat'].includes(globalLang) ? globalLang : 'en')
  })

  // Load chat history from localStorage so it survives page reloads
  const [messages, setMessages] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed
          }
        }
      } catch (err) {
        console.warn('[SafetyChatbot] Could not load chat history:', err)
      }
    }
    return [WELCOME_MESSAGES[chatLang] || WELCOME_MESSAGES.en]
  })

  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speakingMsgId, setSpeakingMsgId] = useState(null)
  const [voiceNotice, setVoiceNotice] = useState(null)
  const [activeEndpoint, setActiveEndpoint] = useState(null)
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true))

  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)
  const abortControllerRef = useRef(null)

  // Network online/offline monitor
  useEffect(() => {
    function handleOnline() { setIsOnline(true) }
    function handleOffline() { setIsOnline(false) }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Save messages to localStorage whenever they update
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
      } catch (err) {
        console.warn('[SafetyChatbot] Failed to save chat history:', err)
      }
    }
  }, [messages])

  function scrollBottom(smooth = true) {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
    }, 40)
  }

  function handleLanguageChange(newLang) {
    if (newLang === chatLang) return
    setChatLang(newLang)
    localStorage.setItem('sar_chat_lang', newLang)

    stopSpeech()
    setSpeakingMsgId(null)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }

    const langObj = CHAT_LANGUAGES.find(l => l.code === newLang)
    const noticeText = {
      en: '🌐 Language switched to English (Voice enabled 🎙️)',
      hi: '🌐 भाषा हिंदी में बदल दी गई (आवाज़ सक्रिय 🎙️)',
      hinglish: '🌐 Switched to Hinglish (Voice enabled 🎙️)',
      sat: '🌐 ᱯᱟᱹᱨᱥᱤ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱵᱚᱫᱚᱞᱮᱱᱟ 🌿',
    }[newLang] || `Switched to ${langObj?.name}`

    setMessages(prev => [
      ...prev,
      {
        id: 'sys-' + Date.now(),
        role: 'system',
        content: noticeText,
      }
    ])
    scrollBottom()
  }

  function handleClearChat() {
    stopSpeech()
    setSpeakingMsgId(null)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setIsGenerating(false)
    const freshWelcome = WELCOME_MESSAGES[chatLang] || WELCOME_MESSAGES.en
    const newHistory = [{ ...freshWelcome, id: 'welcome-' + Date.now() }]
    setMessages(newHistory)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
    }
    scrollBottom()
  }

  function handleOpen() {
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 200)
    scrollBottom(false)
  }

  function handleClose() {
    setOpen(false)
    stopSpeech()
    setSpeakingMsgId(null)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  /**
   * Process a question using real streaming from backend proxy (Cloudflare Worker or Vite dev server)
   * with graceful fallback to verified safety knowledge base.
   */
  async function processQuery(queryText) {
    const query = (queryText ?? input).trim()
    if (!query || isGenerating) return
    setInput('')

    // Cancel any active stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    const userMsgId = 'u-' + Date.now()
    const userMsg = {
      id: userMsgId,
      role: 'user',
      content: query,
      timestamp: Date.now()
    }

    const updatedHistory = [...messages, userMsg]
    setMessages(updatedHistory)
    scrollBottom()
    setIsGenerating(true)

    // Build context with the last ~10 messages
    const contextualMessages = updatedHistory
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }))

    const sessionId = getSessionId()
    const isStaticHost = typeof window !== 'undefined' && (
      window.location.hostname.includes('github.io') ||
      window.location.protocol === 'file:'
    )
    const customEndpoint = import.meta.env?.VITE_CHAT_API_URL
    const endpointsToTry = (customEndpoint && customEndpoint.trim().length > 0)
      ? [customEndpoint.trim()]
      : (!isStaticHost ? ['/SurakshaAR/api/chat', '/api/chat'] : [])

    let streamedSuccess = false
    const botMsgId = 'a-' + Date.now()

    // 1. Instant Verified FAQ Check (EN, HI, SAT) — fastest, offline-safe
    const instantFaq = findFaqMatch(query, chatLang)
    if (instantFaq) {
      setMessages(prev => [
        ...prev,
        {
          id: botMsgId,
          role: 'assistant',
          content: instantFaq.answer,
          source: instantFaq.source || 'Suraksha Mitra Safety Knowledge (Verified)',
          sources: []
        }
      ])
      setIsGenerating(false)
      scrollBottom()
      return
    }

    // 2. If browser is offline, answer immediately from verified safety knowledge base
    if (!isOnline) {
      const localResult = await querySafetyAssistant(query, chatLang, activeModule, contextualMessages)
      const text = typeof localResult === 'string'
        ? localResult
        : (localResult?.answer || localResult?.reply || "I am your safety assistant. Please consult your site safety officer.")
      setMessages(prev => [
        ...prev,
        {
          id: botMsgId,
          role: 'assistant',
          content: text,
          source: 'Suraksha Mitra Safety Knowledge (Offline ⚡)',
          sources: localResult?.sources || []
        }
      ])
      setIsGenerating(false)
      scrollBottom()
      return
    }

    // 3. Try backend endpoints (Groq server / proxy) with timeout
    for (const endpoint of endpointsToTry) {
      if (abortController.signal.aborted) break
      try {
        setActiveEndpoint(endpoint)
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 4000)

        const abortHandler = () => controller.abort()
        abortController.signal.addEventListener('abort', abortHandler)

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream, application/json',
            'X-Session-Id': sessionId,
          },
          body: JSON.stringify({
            messages: contextualMessages,
            sessionId,
            stream: true,
            query,
            lang: chatLang,
            module: activeModule
          }),
          signal: controller.signal
        }).finally(() => {
          clearTimeout(timeoutId)
          abortController.signal.removeEventListener('abort', abortHandler)
        })

        // Check for rate limit
        if (response.status === 429) {
          const rateData = await response.json().catch(() => ({}))
          const waitTime = rateData.retryAfter ? ` (~${rateData.retryAfter}s)` : ''
          setMessages(prev => [
            ...prev,
            {
              id: botMsgId,
              role: 'assistant',
              content: `⚠️ **Rate limit notice**: You've asked several questions in a short period. Please wait about a minute${waitTime} before asking your next question to protect AI resources.`,
              source: 'Rate Limiter'
            }
          ])
          streamedSuccess = true
          break
        }

        if (!response.ok) {
          continue
        }

        const contentType = response.headers.get('content-type') || ''

        // Streaming SSE response
        if (contentType.includes('text/event-stream') && response.body) {
          setMessages(prev => [
            ...prev,
            {
              id: botMsgId,
              role: 'assistant',
              content: '',
              streaming: true,
              source: 'Suraksha Mitra AI'
            }
          ])

          const reader = response.body.getReader()
          const decoder = new TextDecoder('utf-8')
          let accumulatedText = ''
          let buffer = ''

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed.startsWith('data:')) continue
              const dataPayload = trimmed.slice(5).trim()
              if (dataPayload === '[DONE]') continue

              try {
                const parsed = JSON.parse(dataPayload)
                if (parsed.chunk) {
                  accumulatedText += parsed.chunk
                  setMessages(prev =>
                    prev.map(m =>
                      m.id === botMsgId ? { ...m, content: accumulatedText } : m
                    )
                  )
                  scrollBottom()
                }
              } catch {
                // Ignore chunk boundary json parse errors
              }
            }
          }

          if (accumulatedText.trim().length > 0) {
            setMessages(prev =>
              prev.map(m =>
                m.id === botMsgId ? { ...m, streaming: false } : m
              )
            )
            streamedSuccess = true
            break
          }
        }

        // Non-streaming JSON response
        if (contentType.includes('application/json')) {
          const json = await response.json()
          const replyText = json.reply || json.answer
          if (replyText) {
            setMessages(prev => [
              ...prev,
              {
                id: botMsgId,
                role: 'assistant',
                content: replyText,
                source: json.source || (json.provider ? `Suraksha Mitra (${json.provider})` : 'Suraksha Mitra AI'),
                sources: json.sources || []
              }
            ])
            streamedSuccess = true
            setSpeakingMsgId(botMsgId)
            speak(replyText, chatLang, () => setSpeakingMsgId(null))
            break
          }
        }
      } catch (err) {
        if (err.name === 'AbortError' && abortController.signal.aborted) return
      }
    }

    // 4. Graceful Fallback if backend was unreachable (e.g. GitHub Pages static hosting or offline)
    if (!streamedSuccess && !abortController.signal.aborted) {
      console.info('[SafetyChatbot] Using local safety knowledge fallback.')
      const localResult = await querySafetyAssistant(query, chatLang, activeModule, contextualMessages)
      const text = typeof localResult === 'string'
        ? localResult
        : (localResult?.answer || localResult?.reply || "I am your Suraksha Mitra safety assistant. Please consult your site safety officer.")
      const source = typeof localResult === 'object' && localResult?.source
        ? localResult.source
        : 'Suraksha Mitra Safety Knowledge'

      setMessages(prev => {
        const exists = prev.some(m => m.id === botMsgId)
        if (exists) {
          return prev.map(m =>
            m.id === botMsgId
              ? { ...m, content: text, streaming: false, source, sources: localResult?.sources || [] }
              : m
          )
        }
        return [
          ...prev,
          {
            id: botMsgId,
            role: 'assistant',
            content: text,
            source,
            sources: localResult?.sources || []
          }
        ]
      })

      setSpeakingMsgId(botMsgId)
      speak(text, chatLang, () => setSpeakingMsgId(null))
    }

    setIsGenerating(false)
    scrollBottom()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      processQuery()
    }
  }

  // Voice Readout (TTS)
  function handleToggleSpeech(msg) {
    if (speakingMsgId === msg.id) {
      stopSpeech()
      setSpeakingMsgId(null)
      return
    }
    stopSpeech()
    setSpeakingMsgId(msg.id)
    const speechCleanText = (msg.content || '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_#`]/g, '')
      .replace(/https?:\/\/\S+/g, '')

    speak(speechCleanText, chatLang, () => {
      setSpeakingMsgId(null)
    })
  }

  // Voice Input (STT)
  function toggleVoiceInput() {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsListening(false)
      return
    }

    if (chatLang === 'sat') {
      setVoiceNotice('🎙️ Voice recognition is supported in English, Hindi, and Hinglish. Please switch language to speak.')
      setTimeout(() => setVoiceNotice(null), 4000)
      return
    }

    setVoiceNotice(null)
    const controller = startListening(
      chatLang,
      (recognizedText) => {
        setIsListening(false)
        if (recognizedText) {
          setInput(recognizedText)
          processQuery(recognizedText)
        }
      },
      (error) => {
        setIsListening(false)
        console.warn('[SafetyChatbot] Voice recognition error:', error)
        setVoiceNotice('Could not recognize voice. Please check microphone permission.')
        setTimeout(() => setVoiceNotice(null), 4000)
      }
    )

    if (controller) {
      recognitionRef.current = controller
      setIsListening(true)
    }
  }

  useEffect(() => {
    return () => {
      stopSpeech()
      if (recognitionRef.current) recognitionRef.current.stop()
      if (abortControllerRef.current) abortControllerRef.current.abort()
    }
  }, [])

  const currentSuggestions = getSuggestedQuestions(activeModule, chatLang) || []
  const hasVoice = isVoiceSupported(chatLang)

  return (
    <>
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(14px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes micPulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(224, 90, 0, 0.7); transform: scale(1); }
          50% { box-shadow: 0 0 0 8px rgba(224, 90, 0, 0); transform: scale(1.06); }
          100% { box-shadow: 0 0 0 0 rgba(224, 90, 0, 0); transform: scale(1); }
        }
        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @media (max-width: 480px) {
          .suraksha-chat-window {
            width: calc(100vw - 20px) !important;
            right: 10px !important;
            bottom: 84px !important;
            height: calc(100vh - 100px) !important;
            max-height: 560px !important;
          }
        }
      `}</style>

      {/* Floating speech badge */}
      {!open && !badgeDismissed && (
        <div
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleOpen() }}
          style={{
            position: 'fixed',
            bottom: 'calc(82px + env(safe-area-inset-bottom, 0px))',
            right: 'max(18px, env(safe-area-inset-right, 0px))',
            maxWidth: 'calc(100vw - 36px)',
            background: 'var(--color-surface)',
            border: '1.5px solid rgba(224, 90, 0, 0.35)',
            borderRadius: '16px 16px 4px 16px',
            padding: '6px 10px 6px 12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(224, 90, 0, 0.18)',
            zIndex: 'var(--z-modal)',
            cursor: 'pointer',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{
            width: 22, height: 22,
            borderRadius: '50%',
            background: 'rgba(224, 90, 0, 0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Bot size={13} style={{ color: 'var(--color-brand)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5, lineHeight: 1 }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.78rem', fontWeight: 500 }}>
              Aapka Apna
            </span>
            <span style={{ color: 'var(--color-brand)', fontSize: '0.84rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
              Suraksha Mitra
            </span>
          </div>

          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#2ECC71', boxShadow: '0 0 6px #2ECC71',
            flexShrink: 0, marginLeft: 2,
          }} />

          <button
            onClick={(e) => {
              e.stopPropagation()
              setBadgeDismissed(true)
            }}
            aria-label="Close notification"
            title="Dismiss label"
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '2px 4px', marginLeft: 4, display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-text-muted)', borderRadius: '50%', flexShrink: 0,
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Floating launcher button */}
      <button
        onClick={open ? handleClose : handleOpen}
        aria-label="Suraksha Mitra AI Assistant"
        style={{
          position: 'fixed',
          bottom: 'calc(18px + env(safe-area-inset-bottom, 0px))',
          right: 'max(18px, env(safe-area-inset-right, 0px))',
          width: 58, height: 58, borderRadius: '50%',
          background: open ? 'var(--color-text-secondary)' : 'var(--color-brand)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(224,90,0,0.4)',
          zIndex: 'var(--z-modal)',
          transition: 'background 0.2s, transform 0.2s',
          transform: open ? 'rotate(90deg)' : 'none',
        }}
      >
        {open ? <X size={24} color="white" /> : <MessageCircle size={24} color="white" />}
      </button>

      {/* Chat dialog panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Suraksha Mitra AI Assistant"
          className="suraksha-chat-window"
          style={{
            position: 'fixed',
            bottom: 'calc(84px + env(safe-area-inset-bottom, 0px))',
            right: 'max(16px, env(safe-area-inset-right, 0px))',
            width: 'min(420px, calc(100vw - 32px))',
            height: 'min(580px, calc(100vh - 110px))',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex', flexDirection: 'column',
            zIndex: 'var(--z-modal)',
            overflow: 'hidden',
            animation: 'slideUpFade 0.25s ease',
          }}
        >
          {/* Header with Persona & Controls */}
          <div style={{
            background: 'var(--color-brand)',
            padding: '12px 14px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 9,
            flexShrink: 0,
            boxShadow: '0 3px 10px rgba(224, 90, 0, 0.25)',
          }}>
            {/* Top Row: Bot Icon, Title, Status, Clear Chat, Close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Bot size={20} color="white" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <p style={{ color: 'white', fontWeight: 800, fontSize: '0.96rem', lineHeight: 1.2 }}>
                    Suraksha Mitra
                  </p>
                  <span style={{
                    fontSize: '0.62rem',
                    background: !isOnline ? 'rgba(239, 68, 68, 0.45)' : 'rgba(255,255,255,0.25)',
                    color: 'white',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                    boxShadow: !isOnline ? '0 1px 3px rgba(0,0,0,0.2)' : 'none'
                  }}>
                    {!isOnline ? '⚡ Offline' : 'AI Copilot'}
                  </span>
                </div>
                <p style={{
                  color: 'rgba(255,255,255,0.88)',
                  fontSize: '0.66rem',
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  Safety Assistant • Jharkhand Mines & Plants
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {/* Reset / Clear Chat Button */}
                <button
                  onClick={handleClearChat}
                  title="Clear conversation / New Chat"
                  aria-label="Clear chat"
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 26, height: 26,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                >
                  <RotateCcw size={13} />
                </button>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  aria-label="Close chat"
                  style={{
                    background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: '50%',
                    width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'white', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Language Bar (4 Languages, 3 with Voice) */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.22)',
              borderRadius: '12px',
              padding: '3px',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              justifyContent: 'space-between',
            }}>
              {CHAT_LANGUAGES.map(item => {
                const isSelected = chatLang === item.code
                return (
                  <button
                    key={item.code}
                    onClick={() => handleLanguageChange(item.code)}
                    title={
                      item.voice
                        ? `${item.name} (${item.voiceBadge} supported)`
                        : `${item.name} (Ol Chiki Text)`
                    }
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 3,
                      padding: '5px 3px',
                      borderRadius: '9px',
                      fontSize: '0.72rem',
                      fontWeight: isSelected ? 800 : 600,
                      border: 'none',
                      background: isSelected ? '#ffffff' : 'transparent',
                      color: isSelected ? 'var(--color-brand, #E05A00)' : 'rgba(255,255,255,0.92)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.18s ease',
                      boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.2)' : 'none',
                    }}
                  >
                    <span>{item.native}</span>
                    {item.voice ? (
                      <span style={{ fontSize: '0.62rem', lineHeight: 1, opacity: isSelected ? 1 : 0.8 }}>
                        🎙️
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.62rem', lineHeight: 1, opacity: isSelected ? 1 : 0.7 }}>
                        📝
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Voice status notice */}
          {voiceNotice && (
            <div style={{
              background: '#FFF3CD', color: '#856404',
              padding: '6px 12px', fontSize: '0.72rem',
              borderBottom: '1px solid #FFEEBA',
              display: 'flex', alignItems: 'center', gap: 6,
              lineHeight: 1.3, flexShrink: 0,
            }}>
              <AlertCircle size={13} />
              <span style={{ flex: 1 }}>{voiceNotice}</span>
              <button
                onClick={() => setVoiceNotice(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#856404', padding: 0 }}
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* Live Voice Listening Pulse Bar */}
          {isListening && (
            <div style={{
              background: 'linear-gradient(90deg, rgba(224,90,0,0.12), rgba(224,90,0,0.25), rgba(224,90,0,0.12))',
              borderBottom: '1.5px solid var(--color-brand)',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.75rem',
              color: 'var(--color-brand)',
              fontWeight: 700,
              flexShrink: 0,
            }}>
              <span style={{
                width: 10, height: 10, borderRadius: '50%',
                background: '#E05A00', animation: 'micPulseGlow 1.2s infinite ease-in-out',
              }} />
              <span>
                {chatLang === 'hi' ? '🎙️ सुन रहा हूँ... बोलिए' :
                 chatLang === 'hinglish' ? '🎙️ Listening... Bol rahe hain...' :
                 '🎙️ Listening... Speak now'}
              </span>
              <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                Click Mic to Stop
              </span>
            </div>
          )}

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 14px 6px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            {messages.map(msg => {
              if (msg.role === 'system') {
                return (
                  <div key={msg.id} style={{
                    alignSelf: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: 'var(--color-text-muted)',
                    background: 'var(--color-surface-alt)',
                    border: '1px solid var(--color-border)',
                    padding: '3px 10px',
                    borderRadius: '12px',
                  }}>
                    {msg.content}
                  </div>
                )
              }

              const isAssistant = msg.role === 'assistant' || msg.role === 'bot'
              const isSpeaking = speakingMsgId === msg.id

              return (
                <div key={msg.id} style={{
                  display: 'flex',
                  justifyContent: isAssistant ? 'flex-start' : 'flex-end',
                  gap: 8,
                  alignItems: 'flex-end',
                }}>
                  {isAssistant && (
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'rgba(224, 90, 0, 0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Bot size={15} style={{ color: 'var(--color-brand)' }} />
                    </div>
                  )}

                  <div style={{ maxWidth: '86%' }}>
                    <div style={{
                      padding: '10px 13px',
                      background: isAssistant ? 'var(--color-surface-alt)' : 'var(--color-brand)',
                      color: isAssistant ? 'var(--color-text-primary)' : 'white',
                      borderRadius: isAssistant ? '4px 18px 18px 18px' : '18px 18px 4px 18px',
                      fontSize: '0.85rem',
                      lineHeight: 1.55,
                      border: isAssistant ? '1px solid var(--color-border)' : 'none',
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                    }}>
                      {msg.content}

                      {/* Streaming blinking cursor */}
                      {msg.streaming && (
                        <span style={{
                          display: 'inline-block',
                          width: 6,
                          height: 14,
                          background: 'var(--color-brand)',
                          marginLeft: 3,
                          verticalAlign: 'middle',
                          animation: 'cursorBlink 0.8s infinite',
                        }} />
                      )}

                      {/* Web citations if any */}
                      {Array.isArray(msg.sources) && msg.sources.length > 0 && (
                        <div style={{
                          marginTop: 8,
                          paddingTop: 8,
                          borderTop: '1px dashed var(--color-border)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 4,
                        }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                            🔗 Verified Sources:
                          </span>
                          {msg.sources.slice(0, 3).map((s, idx) => (
                            <a
                              key={idx}
                              href={s.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                fontSize: '0.66rem',
                                color: 'var(--color-brand)',
                                textDecoration: 'underline',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                              title={s.title || s.uri}
                            >
                              • {s.title || s.uri}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Source tag + Voice Readout */}
                    {isAssistant && !msg.streaming && (
                      <div style={{
                        display: 'flex', gap: 6, marginTop: 4,
                        alignItems: 'center', flexWrap: 'wrap',
                      }}>
                        {msg.source && (
                          <span style={{
                            fontSize: '0.65rem', fontWeight: 600,
                            color: 'var(--color-text-muted)',
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-pill)',
                            padding: '1px 6px',
                          }}>
                            🛡️ {msg.source}
                          </span>
                        )}

                        {isTTSSupported(chatLang) && msg.content && (
                          <button
                            onClick={() => handleToggleSpeech(msg)}
                            title={isSpeaking ? 'Stop speaking' : 'Listen with Voice'}
                            style={{
                              background: isSpeaking ? 'var(--color-brand)' : 'var(--color-surface)',
                              border: isSpeaking ? '1px solid var(--color-brand)' : '1px solid var(--color-border)',
                              borderRadius: '12px',
                              cursor: 'pointer',
                              padding: '2px 7px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              color: isSpeaking ? 'white' : 'var(--color-text-secondary)',
                              fontSize: '0.65rem',
                              fontWeight: 600,
                              transition: 'all 0.15s ease',
                            }}
                            aria-label={isSpeaking ? 'Stop speech' : 'Play speech'}
                          >
                            {isSpeaking ? (
                              <>
                                <VolumeX size={12} />
                                <span>Playing…</span>
                              </>
                            ) : (
                              <>
                                <Volume2 size={12} />
                                <span>Voice 🔊</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Waiting for first streaming token indicator */}
            {isGenerating && !messages.some(m => m.streaming) && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(224, 90, 0, 0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Bot size={15} style={{ color: 'var(--color-brand)' }} />
                </div>
                <div style={{
                  padding: '9px 13px',
                  background: 'var(--color-surface-alt)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px 18px 18px 18px',
                  display: 'flex', gap: 4, alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: 'var(--color-brand)',
                      animation: `typingBounce 1s ease ${i * 0.15}s infinite`,
                    }} />
                  ))}
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginLeft: 6 }}>
                    Thinking…
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Suggested Prompt Pills */}
          <div style={{
            padding: '4px 12px 6px',
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            flexShrink: 0,
            background: 'var(--color-surface)',
          }}>
            {currentSuggestions.slice(0, 4).map((item, idx) => (
              <button
                key={idx}
                onClick={() => processQuery(item.query)}
                disabled={isGenerating || isListening}
                style={{
                  background: 'var(--color-surface-alt)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '14px',
                  padding: '4px 9px',
                  fontSize: '0.68rem',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontWeight: 600,
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(224, 90, 0, 0.12)'
                  e.currentTarget.style.color = 'var(--color-brand)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--color-surface-alt)'
                  e.currentTarget.style.color = 'var(--color-text-secondary)'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input & Voice Controls */}
          <div style={{
            padding: '8px 12px 10px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            flexShrink: 0,
            background: 'var(--color-surface)',
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={PLACEHOLDERS[chatLang] || PLACEHOLDERS.en}
              rows={1}
              style={{
                flex: 1,
                border: isListening ? '1.5px solid var(--color-brand)' : '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                fontSize: '0.84rem',
                resize: 'none',
                outline: 'none',
                background: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                fontFamily: chatLang === 'sat' ? 'var(--font-santali), var(--font-sans)' : 'var(--font-sans)',
                lineHeight: 1.45,
                maxHeight: 72,
                overflowY: 'auto',
                boxShadow: isListening ? '0 0 0 3px rgba(224, 90, 0, 0.15)' : 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
            />

            {/* Voice Input (Microphone) */}
            <button
              onClick={toggleVoiceInput}
              title={
                isListening ? 'Stop listening' :
                hasVoice ? `Speak in ${CHAT_LANGUAGES.find(l => l.code === chatLang)?.name}` :
                'Voice available in English, Hindi & Hinglish'
              }
              style={{
                width: 38, height: 38, borderRadius: '50%',
                background: isListening ? '#E05A00' : 'var(--color-surface-alt)',
                border: isListening ? '2px solid #C0392B' : '1px solid var(--color-border)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                color: isListening ? '#ffffff' : 'var(--color-text-primary)',
                animation: isListening ? 'micPulseGlow 1.2s infinite' : 'none',
                transition: 'all 0.15s ease',
              }}
              aria-label={isListening ? 'Stop voice recording' : 'Start voice input'}
            >
              {isListening ? <MicOff size={17} /> : <Mic size={17} />}
            </button>

            {/* Send Button */}
            <button
              onClick={() => processQuery()}
              disabled={!input.trim() || isGenerating}
              style={{
                width: 38, height: 38, borderRadius: '50%',
                background: input.trim() && !isGenerating ? 'var(--color-brand)' : 'var(--color-border)',
                border: 'none',
                cursor: input.trim() && !isGenerating ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.15s',
              }}
              aria-label="Send message"
            >
              <Send size={16} color="white" />
            </button>
          </div>

          {/* Footer note */}
          <div style={{
            padding: '4px 12px 8px',
            fontSize: '0.62rem',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
            flexShrink: 0,
            background: 'var(--color-surface)',
          }}>
            Suraksha Mitra AI • Streaming & Real-time Reasoning • 4 Languages
          </div>
        </div>
      )}
    </>
  )
}
