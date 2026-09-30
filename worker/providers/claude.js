/**
 * Anthropic Claude API Provider (Alternative provider)
 * Demonstrates pluggable provider architecture — switching to Claude is as simple as
 * changing the provider import in worker/index.js.
 */

export class ClaudeProvider {
  constructor(apiKey, options = {}) {
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is required for ClaudeProvider')
    }
    this.apiKey = apiKey
    this.model = options.model || 'claude-3-5-sonnet-20241022'
  }

  formatMessages(messages) {
    return messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({
        role: m.role,
        content: typeof m.content === 'string' ? m.content : (m.text || '')
      }))
  }

  async generateResponse({ messages, systemPrompt }) {
    const formattedMessages = this.formatMessages(messages)
    const url = 'https://api.anthropic.com/v1/messages'

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 2048,
        system: systemPrompt,
        messages: formattedMessages
      })
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Claude API failed (${res.status}): ${errText}`)
    }

    const json = await res.json()
    const reply = json.content?.map(c => c.text).filter(Boolean).join('\n') || ''
    return {
      reply,
      model: this.model,
      provider: 'claude'
    }
  }

  async streamResponse({ messages, systemPrompt }) {
    const formattedMessages = this.formatMessages(messages)
    const url = 'https://api.anthropic.com/v1/messages'

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 2048,
        system: systemPrompt,
        messages: formattedMessages,
        stream: true
      })
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Claude streaming API failed (${res.status}): ${errText}`)
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    const encoder = new TextEncoder()
    let buffer = ''

    return new ReadableStream({
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
            buffer = lines.pop() || ''

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed.startsWith('data:')) continue

              const jsonStr = trimmed.slice(5).trim()
              if (!jsonStr || jsonStr === '[DONE]') continue

              try {
                const parsed = JSON.parse(jsonStr)
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ chunk: parsed.delta.text })}\n\n`)
                  )
                }
              } catch {
                // Ignore parse errors on chunk boundaries
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
  }
}
