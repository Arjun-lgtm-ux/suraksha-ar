import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

if (typeof window !== 'undefined') {
  window.React = React
  window.ReactDOM = ReactDOM
}

try {
  const rootEl = document.getElementById('root')
  if (rootEl) {
    ReactDOM.createRoot(rootEl).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  }
} catch (err) {
  console.error('[main.jsx error]', err)
  const rootEl = document.getElementById('root')
  if (rootEl) {
    rootEl.innerHTML = `<div style="padding:24px;color:#C0392B;font-family:sans-serif;"><h2>Render Error</h2><pre>${err.message}</pre></div>`
  }
}
