/**
 * Suraksha Mitra — Cloudflare Worker Backend Proxy
 * Serves real-time streaming and standard JSON responses via Google Gemini API
 * with in-memory sliding window rate limiting and CORS protection.
 */

import { RateLimiter } from './rateLimiter.js'
import { GeminiProvider } from './providers/gemini.js'
// To switch to Claude:
// import { ClaudeProvider } from './providers/claude.js'

export const SURAKSHA_MITRA_SYSTEM_PROMPT = `You are 'Suraksha Mitra' (सुरक्षा मित्र), the advanced, friendly, and highly knowledgeable AI Safety Copilot for SurakshaAR — an AR industrial safety training platform for workers and trainees in India.

HOW TO COMMUNICATE (BEHAVE LIKE CHATGPT / GEMINI):
1. Conversational & Human-like: Talk naturally, warmly, and clearly like an expert safety mentor and helpful colleague. NEVER speak like a rigid checklist, generic robotic script, or cold bullet-point dump.
2. Answer Directly First: Always answer the user's specific question directly and conversationally before giving details or examples. If asked 'ppe kya hota h' or 'what is X', first explain what it is, why it exists, and its real-world importance in simple, relatable words.
3. Match Language & Tone:
   - If the user speaks/types in Hindi or Hinglish (e.g. 'ppe kya hota h', 'fire extinguisher kaise use karein'), reply in natural, easy-to-understand Hindi or Hinglish.
   - If in English, reply in fluent, encouraging English.
   - Always match the user's vibe and terminology.
4. Formatting:
   - Use well-structured, engaging paragraphs for explanations.
   - Bold **key points** to make them easy to read on mobile and desktop.
   - Use bullet points only when helpful to list components or steps, and explain briefly why each one is used.
   - End with a friendly, conversational question asking if they'd like practical tips or specific training guidance.
5. Industrial Safety Standards:
   - Ground all safety practices in authentic standards (IS 2925, IS 15298, OSHA, DGMS), but explain them in simple layman terms without overwhelming jargon.`

// Global rate limiter instance (25 requests per minute per IP/session)
const limiter = new RateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 25,
})

function corsHeaders(origin = '*') {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Session-Id',
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const origin = request.headers.get('Origin') || '*'

    // 1. Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
      })
    }

    // Health check endpoint
    if (url.pathname === '/' || url.pathname === '/health') {
      return new Response(
        JSON.stringify({
          status: 'online',
          service: 'Suraksha Mitra AI Proxy',
          provider: 'Gemini (gemini-2.0-flash / gemini-1.5-flash)',
          docs: 'POST /api/chat with { messages: [...], sessionId, stream }'
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin),
          },
        }
      )
    }

    // 2. Chat API endpoint
    if (url.pathname === '/api/chat' || url.pathname === '/SurakshaAR/api/chat') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
        })
      }

      // Check API Key
      const apiKey = env?.GEMINI_API_KEY
      if (!apiKey || apiKey === 'your-gemini-api-key-here') {
        return new Response(
          JSON.stringify({
            error: 'Backend API key not configured. Please set GEMINI_API_KEY in worker secrets.',
            fallbackMessage: '⚠️ Suraksha Mitra proxy is running, but GEMINI_API_KEY has not been set yet. Please check README instructions.'
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
          }
        )
      }

      // Parse payload
      let body
      try {
        body = await request.json()
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
        })
      }

      const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || '127.0.0.1'
      const sessionId = body.sessionId || request.headers.get('X-Session-Id') || clientIp

      // 3. Check rate limit
      const rateCheck = limiter.check(sessionId)
      if (!rateCheck.allowed) {
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded. Please wait a moment before sending more messages.',
            retryAfter: rateCheck.retryAfter,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(rateCheck.retryAfter),
              ...corsHeaders(origin),
            },
          }
        )
      }

      // Format messages: support { messages: [...] } or single { message: "..." }
      let messages = Array.isArray(body.messages) ? body.messages : []
      if (messages.length === 0 && body.message) {
        messages = [{ role: 'user', content: String(body.message) }]
      } else if (messages.length === 0 && body.query) {
        messages = [{ role: 'user', content: String(body.query) }]
      }

      if (messages.length === 0) {
        return new Response(JSON.stringify({ error: 'Messages array cannot be empty' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
        })
      }

      // Keep last 10 messages for context
      const contextualMessages = messages.slice(-10)

      // Instantiate AI provider (Gemini by default)
      const provider = new GeminiProvider(apiKey)
      // To use Claude instead:
      // const provider = new ClaudeProvider(env.ANTHROPIC_API_KEY)

      const wantsStream = body.stream === true || request.headers.get('Accept') === 'text/event-stream'

      try {
        if (wantsStream) {
          // Streaming SSE response
          const stream = await provider.streamResponse({
            messages: contextualMessages,
            systemPrompt: SURAKSHA_MITRA_SYSTEM_PROMPT,
          })

          return new Response(stream, {
            status: 200,
            headers: {
              'Content-Type': 'text/event-stream; charset=utf-8',
              'Cache-Control': 'no-cache, no-transform',
              'Connection': 'keep-alive',
              'X-Accel-Buffering': 'no',
              ...corsHeaders(origin),
            },
          })
        } else {
          // Standard JSON response
          const result = await provider.generateResponse({
            messages: contextualMessages,
            systemPrompt: SURAKSHA_MITRA_SYSTEM_PROMPT,
          })

          return new Response(
            JSON.stringify({
              reply: result.reply,
              model: result.model,
              provider: result.provider,
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders(origin),
              },
            }
          )
        }
      } catch (err) {
        console.error('[Suraksha Mitra Worker Error]', err)
        return new Response(
          JSON.stringify({
            error: 'Failed to generate safety response',
            details: err.message,
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
          }
        )
      }
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    })
  },
}
