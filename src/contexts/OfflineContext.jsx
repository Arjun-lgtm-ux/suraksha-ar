import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { processOfflineQueue } from '../lib/indexeddb'
import { isSupabaseConfigured } from '../lib/supabase'

const OfflineContext = createContext(null)

export function OfflineProvider({ children }) {
  const [isOnline, setIsOnline]   = useState(navigator.onLine)
  const [syncStatus, setSyncStatus] = useState('idle') // idle | syncing | done | error

  const runSync = useCallback(async () => {
    if (!isSupabaseConfigured) return
    setSyncStatus('syncing')
    try {
      await processOfflineQueue()
      setSyncStatus('done')
      setTimeout(() => setSyncStatus('idle'), 3000)
    } catch (err) {
      console.error('[Offline sync]', err)
      setSyncStatus('error')
    }
  }, [])

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
      runSync()
    }
    function handleOffline() {
      setIsOnline(false)
      setSyncStatus('idle')
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    // On initial load, run sync if online
    if (navigator.onLine) runSync()
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [runSync])

  return (
    <OfflineContext.Provider value={{ isOnline, syncStatus }}>
      {children}
    </OfflineContext.Provider>
  )
}

export function useOffline() {
  const ctx = useContext(OfflineContext)
  if (!ctx) throw new Error('useOffline must be inside <OfflineProvider>')
  return ctx
}
