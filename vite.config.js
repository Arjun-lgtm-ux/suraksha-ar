import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'suraksha-chat-api-plugin',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const pathname = req.url ? req.url.split('?')[0].replace(/\/+$/, '') : ''
          if (pathname === '/api/chat' || pathname === '/SurakshaAR/api/chat' || pathname.endsWith('/api/chat')) {
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')

            if (req.method === 'OPTIONS') {
              res.statusCode = 204
              res.end()
              return
            }

            if (req.method === 'POST') {
              let rawBody = ''
              req.on('data', chunk => { rawBody += chunk })
              req.on('end', async () => {
                try {
                  const { handleChatApi } = await import('./server/chatHandler.js')
                  const payload = JSON.parse(rawBody || '{}')
                  const response = await handleChatApi(payload)
                  if (!res.headersSent) {
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify(response))
                  } else {
                    res.end()
                  }
                } catch (err) {
                  console.error('[Vite Chat API Error]', err)
                  if (!res.headersSent) {
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ error: err.message }))
                  } else {
                    res.end()
                  }
                }
              })
              return
            }
          }
          next()
        })
      }
    }
  ],
  base: './',
  server: {
    port: 5174,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'three-vendor': ['three'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
  },
})
