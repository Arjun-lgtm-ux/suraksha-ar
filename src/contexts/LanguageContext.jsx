import { createContext, useContext, useState, useEffect } from 'react'
import { SUPPORTED_LANGUAGES, LANG_FONT, getText, getTutorialSteps } from '../lib/i18n'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('sar_lang') ?? 'en'
  })

  function setLang(code) {
    if (!SUPPORTED_LANGUAGES.find(l => l.code === code)) return
    setLangState(code)
    localStorage.setItem('sar_lang', code)
    // Update document font for script rendering
    document.documentElement.style.setProperty('--font-body', LANG_FONT[code])
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--font-body', LANG_FONT[lang])
    document.documentElement.setAttribute('lang', lang === 'sat' ? 'sat' : lang === 'hi' ? 'hi' : 'en')
  }, [lang])

  const T = (key, ...args) => getText(lang, key, ...args)
  const tutorialSteps = getTutorialSteps(lang)
  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === lang)

  return (
    <LanguageContext.Provider value={{ lang, setLang, T, tutorialSteps, currentLang, SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>')
  return ctx
}
