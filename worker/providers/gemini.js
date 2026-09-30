/**
 * Google Gemini API Provider
 * Supports gemini-2.0-flash / gemini-1.5-flash with streaming (SSE) and non-streaming responses.
 */

export class GeminiProvider {
  constructor(apiKey, options = {}) {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required for GeminiProvider')
    }
    this.apiKey = apiKey
    this.model = options.model || 'gemini-3.1-flash-lite'
    this.fallbackModels = options.fallbackModels || ['gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.8-flash', 'gemini-flash-latest']
  }

  /**
   * Convert standard message format [{ role: 'user'|'assistant'|'system', content }] to Gemini format
   */
  formatContents(messages) {
    const contents = []
    for (const msg of messages) {
      const role = msg.role === 'assistant' ? 'model' : 'user'
      const text = typeof msg.content === 'string' ? msg.content : (msg.text || '')
      if (!text.trim()) continue

      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += '\n' + text
      } else {
        contents.push({
          role,
          parts: [{ text }]
        })
      }
    }
    return contents
  }

  /**
   * Non-streaming chat generation
   */
  async generateResponse({ messages, systemPrompt }) {
    const contents = this.formatContents(messages)
    const payload = {
      contents,
      systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 2048,
      }
    }

    const modelsToTry = [this.model, ...this.fallbackModels]
    let lastError = null

    for (const modelName of modelsToTry) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${this.apiKey}`
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (res.ok) {
          const json = await res.json()
          const candidate = json.candidates?.[0]
          const reply = candidate?.content?.parts?.map(p => p.text).filter(Boolean).join('\n') || ''
          return {
            reply,
            model: modelName,
            provider: 'gemini'
          }
        }

        const errText = await res.text()
        lastError = new Error(`Gemini API [${modelName}] failed (${res.status}): ${errText}`)
      } catch (err) {
        lastError = err
      }
    }

    throw lastError || new Error('All Gemini models failed to generate a response')
  }

  /**
   * Streaming chat generation using Server-Sent Events (SSE)
   * Returns a ReadableStream that emits formatted SSE chunks: data: {"chunk": "..."}\n\n
   */
  async streamResponse({ messages, systemPrompt }) {
    const contents = this.formatContents(messages)
    const payload = {
      contents,
      systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 2048,
      }
    }

    const modelsToTry = [this.model, ...this.fallbackModels]
    let res = null
    let lastError = null

    for (const modelName of modelsToTry) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?alt=sse&key=${this.apiKey}`
      try {
        const attempt = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (attempt.ok) {
          res = attempt
          break
        }
        const errText = await attempt.text()
        lastError = new Error(`Gemini stream [${modelName}] failed (${attempt.status}): ${errText}`)
      } catch (err) {
        lastError = err
      }
    }

    if (!res) {
      throw lastError || new Error('All Gemini streaming models failed')
    }

    // Transform Gemini SSE stream into standard client SSE chunks
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    const encoder = new TextEncoder()
    let buffer = ''

    const transformedStream = new ReadableStream({
      async pull(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'))
              controller.close()
              return
            }

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || '' // keep incomplete line in buffer

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed.startsWith('data:')) continue

              const jsonStr = trimmed.slice(5).trim()
              if (!jsonStr || jsonStr === '[DONE]') continue

              try {
                const parsed = JSON.parse(jsonStr)
                const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text
                if (text) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ chunk: text })}\n\n`)
                  )
                }
              } catch {
                // Ignore parse errors on partial JSON chunks
              }
            }
          }
        } catch (err) {
          controller.error(err)
        }
      },
      cancel() {
        reader.cancel()
      }
    })

    return transformedStream
  }
}
