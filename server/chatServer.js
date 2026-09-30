import http from 'http'
import { handleChatApi, getGroqApiKey, getSarvamApiKey } from './chatHandler.js'

const PORT = process.env.PORT || 3001

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-Session-Id, Authorization')
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk
      if (body.length > 2 * 1024 * 1024) {
        req.destroy()
        reject(new Error('Body too large'))
      }
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res)

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const url = new URL(req.url, `http://localhost:${PORT}`)

  // Health check
  if (req.method === 'GET' && (url.pathname === '/api/health' || url.pathname === '/health')) {
    const groqKey = getGroqApiKey()
    const sarvamKey = getSarvamApiKey()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      status: 'ok',
      service: 'Suraksha Mitra AI Server',
      groqConfigured: !!groqKey,
      sarvamConfigured: !!sarvamKey,
      timestamp: new Date().toISOString()
    }))
    return
  }

  // Chat API
  if (req.method === 'POST' && (url.pathname === '/api/chat' || url.pathname === '/SurakshaAR/api/chat')) {
    try {
      const payload = await parseJsonBody(req)
      const isStreaming = Boolean(payload.stream)

      if (isStreaming) {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        })
        await handleChatApi(payload, res)
      } else {
        const result = await handleChatApi(payload)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(result))
      }
    } catch (err) {
      console.error('[Server] Chat route error:', err)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Internal server error', details: err.message }))
    }
    return
  }

  // Sarvam AI Translation Proxy
  if (req.method === 'POST' && url.pathname === '/api/sarvam/translate') {
    const sarvamKey = getSarvamApiKey()
    if (!sarvamKey) {
      res.writeHead(503, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Sarvam API key not configured on server' }))
      return
    }

    try {
      const payload = await parseJsonBody(req)
      const sarvamRes = await fetch('https://api.sarvam.ai/translate', {
        method: 'POST',
        headers: {
          'api-subscription-key': sarvamKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      const data = await sarvamRes.json()
      res.writeHead(sarvamRes.status, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(data))
    } catch (err) {
      console.error('[Server] Sarvam translate error:', err)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Failed to proxy Sarvam translation' }))
    }
    return
  }

  // Sarvam AI STT Proxy
  if (req.method === 'POST' && url.pathname === '/api/sarvam/stt') {
    const sarvamKey = getSarvamApiKey()
    if (!sarvamKey) {
      res.writeHead(530, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Sarvam API key not configured on server' }))
      return
    }

    try {
      // Forward request to Sarvam Speech-to-text
      const chunks = []
      req.on('data', chunk => chunks.push(chunk))
      req.on('end', async () => {
        const buffer = Buffer.concat(chunks)
        const sarvamRes = await fetch('https://api.sarvam.ai/speech-to-text', {
          method: 'POST',
          headers: {
            'api-subscription-key': sarvamKey,
            'Content-Type': req.headers['content-type'] || 'multipart/form-data'
          },
          body: buffer
        })
        const data = await sarvamRes.json()
        res.writeHead(sarvamRes.status, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(data))
      })
    } catch (err) {
      console.error('[Server] Sarvam STT error:', err)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Failed to proxy Sarvam STT' }))
    }
    return
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Not found' }))
})

server.listen(PORT, () => {
  console.log(`[SurakshaAR Backend] Chat Server running at http://localhost:${PORT}`)
  console.log(`- Groq API: ${getGroqApiKey() ? 'Configured ✅' : 'Missing (Falling back to local safety knowledge) ⚡'}`)
  console.log(`- Sarvam AI: ${getSarvamApiKey() ? 'Configured ✅' : 'Not configured'}`)
})
