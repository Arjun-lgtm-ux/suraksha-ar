import fs from 'fs'
import path from 'path'
import { RateLimiter } from '../worker/rateLimiter.js'
import {
  checkCriticalHazardGuardrails,
  queryKnowledgeBase,
  findFaqMatch,
  MODULES
} from '../src/lib/safetyKnowledge.js'

export const SURAKSHA_MITRA_SYSTEM_PROMPT = `You are 'Suraksha Mitra', the advanced, friendly, and highly knowledgeable AI Safety Copilot for SurakshaAR — an AR industrial safety training platform for workers and trainees in India (specifically Jharkhand mining and manufacturing).

HOW TO COMMUNICATE:
1. Conversational & Human-like: Talk naturally, warmly, and clearly like an expert safety mentor and helpful colleague. NEVER speak like a cold bullet-point dump or rigid robot.
2. Answer Directly First: Always answer the user's specific question directly and conversationally before giving details or examples.
3. Language Adherence:
   - If English is selected, write 100% in English.
   - If Hindi is selected, write in Devanagari Hindi (हिंदी).
   - If Hinglish is selected, write in conversational Hinglish (Roman Hindi).
   - If Santali is selected, write in Santali (Ol Chiki script).
4. Formatting:
   - Use well-structured, engaging paragraphs for explanations.
   - Bold **key points** to make them easy to read on mobile and desktop.
   - End with a friendly question asking if they'd like practical tips or specific training guidance.
5. Industrial Safety Standards:
   - Ground all safety practices in authentic standards (IS 2925, IS 15298, OSHA, DGMS), explained in simple terms.`

export function getLanguagePrompt(lang = 'en') {
  if (lang === 'en') {
    return `### CRITICAL LANGUAGE MANDATE:
The user has chosen ENGLISH as their interface language.
- Write 100% of your response in ENGLISH.
- Greet with 'Hello' or 'Hi', NOT 'Namaste' or 'Johar'.
- Do NOT use Hindi words or Devanagari script.`
  }
  if (lang === 'hi') {
    return `### CRITICAL LANGUAGE MANDATE:
The user has chosen HINDI (हिंदी) as their interface language.
- Write 100% of your response in fluent Devanagari Hindi (हिंदी).
- Greet with 'नमस्ते' or 'जोहार'.`
  }
  if (lang === 'hinglish') {
    return `### CRITICAL LANGUAGE MANDATE:
The user has chosen HINGLISH as their interface language.
- Write in conversational Hinglish (Hindi in Roman alphabet, e.g. 'Namaste! Main hoon Suraksha Mitra...').
- Greet with 'Johar!' or 'Namaste!'.`
  }
  if (lang === 'sat') {
    return `### CRITICAL LANGUAGE MANDATE:
The user has chosen SANTALI (ᱥᱟᱱᱛᱟᱲᱤ) as their interface language.
- Write in Santali (Ol Chiki script) with clear, simple terms.`
  }
  return ''
}

// Local rate limiter instance
export const localLimiter = new RateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 45,
})

/**
 * Retrieve Groq API key strictly on the server side.
 * Checks process.env, .env, .env.local, .env.production.
 */
export function getGroqApiKey() {
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 10) {
    return process.env.GROQ_API_KEY.trim()
  }
  const candidateFiles = ['.env.local', '.env', '.env.production']
  for (const f of candidateFiles) {
    try {
      const fullPath = path.resolve(process.cwd(), f)
      if (fs.existsSync(fullPath)) {
        const text = fs.readFileSync(fullPath, 'utf8')
        const match = text.match(/^GROQ_API_KEY\s*=\s*["']?([^"'\r\n]+)["']?/m)
        if (match && match[1] && match[1].trim().length > 10) {
          return match[1].trim()
        }
      }
    } catch (_) {}
  }
  return null
}

/**
 * Retrieve Sarvam API key strictly on the server side.
 */
export function getSarvamApiKey() {
  if (process.env.SARVAM_API_KEY && process.env.SARVAM_API_KEY.trim().length > 10) {
    return process.env.SARVAM_API_KEY.trim()
  }
  const candidateFiles = ['.env.local', '.env', '.env.production']
  for (const f of candidateFiles) {
    try {
      const fullPath = path.resolve(process.cwd(), f)
      if (fs.existsSync(fullPath)) {
        const text = fs.readFileSync(fullPath, 'utf8')
        const match = text.match(/^SARVAM_API_KEY\s*=\s*["']?([^"'\r\n]+)["']?/m)
        if (match && match[1] && match[1].trim().length > 10) {
          return match[1].trim()
        }
      }
    } catch (_) {}
  }
  return null
}

/**
 * Server-side Chat API for Suraksha Mitra powered by Groq (llama-3.3-70b-versatile)
 */
export async function handleChatApi(payload = {}, resStream = null) {
  const sessionId = payload.sessionId || 'local-session'
  const rateCheck = localLimiter.check(sessionId)
  if (!rateCheck.allowed) {
    const rateMsg = '⚠️ Rate limit exceeded. Please wait a moment before sending more messages.'
    if (resStream) {
      resStream.write(`data: ${JSON.stringify({ chunk: rateMsg })}\n\n`)
      resStream.write('data: [DONE]\n\n')
      resStream.end()
      return
    }
    return {
      error: 'Rate limit exceeded. Please wait a moment before asking another question.',
      reply: rateMsg,
      retryAfter: rateCheck.retryAfter,
    }
  }

  // Normalize input
  let query = payload.query
  let messages = Array.isArray(payload.messages) ? payload.messages : []

  if (messages.length > 0) {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')
    query = lastUserMsg?.content || lastUserMsg?.text || ''
  } else if (query) {
    messages = [{ role: 'user', content: query }]
  }

  if (!query || query.trim().length === 0) {
    const emptyMsg = 'Please ask an industrial safety or training question.'
    if (resStream) {
      resStream.write(`data: ${JSON.stringify({ chunk: emptyMsg })}\n\n`)
      resStream.write('data: [DONE]\n\n')
      resStream.end()
      return
    }
    return {
      reply: emptyMsg,
      answer: emptyMsg,
      source: 'Suraksha Mitra',
      confidence: 0,
      sources: []
    }
  }

  const lang = payload.lang || 'en'
  const module = payload.module || MODULES.GLOBAL

  // 1. Critical Hazard Guardrail Check FIRST
  const fullContextQuery = [
    query,
    ...(Array.isArray(messages) ? messages.slice(-4).map(m => m.content || m.text || '') : [])
  ].join(' ')
  const critical = checkCriticalHazardGuardrails(fullContextQuery, lang)
  if (critical) {
    if (resStream) {
      resStream.write(`data: ${JSON.stringify({ chunk: critical.answer })}\n\n`)
      resStream.write('data: [DONE]\n\n')
      resStream.end()
      return
    }
    return {
      reply: critical.answer,
      answer: critical.answer,
      source: critical.source,
      confidence: critical.confidence,
      sources: [],
      isCritical: true,
    }
  }

  // 2. Verified FAQ Knowledge Base Check
  const faqMatch = findFaqMatch(query, lang)
  if (faqMatch) {
    if (resStream) {
      resStream.write(`data: ${JSON.stringify({ chunk: faqMatch.answer })}\n\n`)
      resStream.write('data: [DONE]\n\n')
      resStream.end()
      return
    }
    return {
      reply: faqMatch.answer,
      answer: faqMatch.answer,
      source: faqMatch.source,
      confidence: faqMatch.confidence || 0.98,
      sources: []
    }
  }

  // 3. Local Safety Knowledge match
  const localMatch = queryKnowledgeBase(query, lang, module, messages)

  // 4. Check for Groq API key
  const groqKey = getGroqApiKey()

  if (!groqKey) {
    const safeReply = localMatch?.answer || (
      lang === 'hi'
        ? 'मैं सुरक्षा मित्र हूँ। औद्योगिक और खनन सुरक्षा (PPE, गैस रिसाव, बिजली, मशीन सुरक्षा) पर आप मुझसे कोई भी सवाल पूछ सकते हैं।'
        : lang === 'hinglish'
          ? 'Main hoon Suraksha Mitra. Industrial aur mining safety (PPE, fire, gas leak, electrical, machinery) par aap mujhse koi bhi practical sawal pooch sakte hain.'
          : lang === 'sat'
            ? '👷 ᱡᱚᱦᱟᱨ! ᱤᱧ ᱫᱚ ᱥᱩᱨᱠᱷᱟ ᱢᱤᱛᱨᱚ ᱠᱟᱹᱱᱟᱹᱧ᱾ ᱠᱷᱟᱫᱟᱱ ᱟᱨ ᱠᱟᱹᱨᱜᱟᱲ ᱨᱮᱱᱟᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱟᱵᱚᱛ ᱠᱩᱞᱤᱭ ᱢᱮ᱾'
            : 'I am Suraksha Mitra. You can ask me any practical questions regarding industrial safety, PPE, mining hazards, fire response, or AR training.'
    )
    if (resStream) {
      resStream.write(`data: ${JSON.stringify({ chunk: safeReply })}\n\n`)
      resStream.write('data: [DONE]\n\n')
      resStream.end()
      return
    }
    return {
      reply: safeReply,
      answer: safeReply,
      source: (localMatch && !localMatch.isFallback) ? localMatch.source : 'Suraksha Mitra Safety Knowledge',
      confidence: (localMatch && !localMatch.isFallback) ? 0.95 : 0.7,
      sources: localMatch?.sources || []
    }
  }

  // 5. Groq OpenAI-Compatible Chat Completions Call
  try {
    let trustedContextPrompt = ''
    if (localMatch && !localMatch.isFallback) {
      trustedContextPrompt = `\n\n[Verified Safety Facts (IS/OSHA): ${localMatch.answer}\nIncorporate these verified safety facts for accuracy.]`
    }
    const fullSystemInstruction = `${getLanguagePrompt(lang)}\n\n${SURAKSHA_MITRA_SYSTEM_PROMPT}${trustedContextPrompt}`

    const groqMessages = [
      { role: 'system', content: fullSystemInstruction },
      ...messages.slice(-8).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: typeof m.content === 'string' ? m.content : (m.text || '')
      }))
    ]

    const isStreaming = Boolean(payload.stream && resStream)
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
        temperature: 0.4,
        max_tokens: 1024,
        stream: isStreaming
      })
    })

    if (!groqRes.ok) {
      const errText = await groqRes.text()
      console.warn('[SurakshaMitra Groq] API error:', groqRes.status, errText)
      throw new Error(`Groq API returned ${groqRes.status}`)
    }

    // Stream SSE back to client
    if (isStreaming && groqRes.body) {
      const reader = groqRes.body.getReader()
      const decoder = new TextDecoder('utf-8')
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
          const dataStr = trimmed.slice(5).trim()
          if (dataStr === '[DONE]') {
            resStream.write('data: [DONE]\n\n')
            continue
          }
          try {
            const parsed = JSON.parse(dataStr)
            const chunk = parsed.choices?.[0]?.delta?.content
            if (chunk) {
              resStream.write(`data: ${JSON.stringify({ chunk })}\n\n`)
            }
          } catch (_) {}
        }
      }
      resStream.end()
      return
    }

    const data = await groqRes.json()
    const replyText = data.choices?.[0]?.message?.content
    if (replyText) {
      return {
        reply: replyText,
        answer: replyText,
        source: 'Suraksha Mitra AI (Groq Llama 3.3)',
        provider: 'Groq',
        confidence: 0.98,
        sources: []
      }
    }
  } catch (err) {
    console.error('[handleChatApi] Groq error:', err)
  }

  // Graceful fallback on API error
  const fallbackAnswer = localMatch?.answer || "I am your safety assistant. Please consult your certified safety officer or check site SOPs."
  if (resStream) {
    resStream.write(`data: ${JSON.stringify({ chunk: fallbackAnswer })}\n\n`)
    resStream.write('data: [DONE]\n\n')
    resStream.end()
    return
  }
  return {
    reply: fallbackAnswer,
    answer: fallbackAnswer,
    source: localMatch?.source || "Suraksha Mitra Safety Knowledge",
    confidence: localMatch?.confidence || 0.65,
    sources: []
  }
}
