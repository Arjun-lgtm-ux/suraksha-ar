import { createContext, useContext, useState, useEffect } from 'react'

const AccessibilityContext = createContext(null)

export function AccessibilityProvider({ children }) {
  const [highContrast, setHighContrastState] = useState(() => {
    return localStorage.getItem('sar_hc') === 'true'
  })

  const [darkMode, setDarkModeState] = useState(() => {
    const saved = localStorage.getItem('sar_dark_mode')
    if (saved !== null) return saved === 'true'
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  function toggleHighContrast() {
    setHighContrastState(prev => {
      const next = !prev
      localStorage.setItem('sar_hc', String(next))
      return next
    })
  }

  function toggleDarkMode() {
    setDarkModeState(prev => {
      const next = !prev
      localStorage.setItem('sar_dark_mode', String(next))
      return next
    })
  }

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [highContrast])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <AccessibilityContext.Provider value={{ highContrast, toggleHighContrast, darkMode, toggleDarkMode }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext)
  if (!ctx) throw new Error('useAccessibility must be used inside <AccessibilityProvider>')
  return ctx
}
