import { useOffline } from '../../contexts/OfflineContext'
import { useLang } from '../../contexts/LanguageContext'
import { WifiOff, RefreshCw, CheckCircle } from 'lucide-react'

export default function OfflineBanner() {
  const { isOnline, syncStatus } = useOffline()
  const { T } = useLang()

  if (isOnline && syncStatus === 'idle') return null
  if (isOnline && syncStatus === 'done') {
    return (
      <div className="sync-banner" role="status">
        <CheckCircle size={16} />
        {T('syncComplete')}
      </div>
    )
  }
  if (isOnline && syncStatus === 'syncing') {
    return (
      <div className="sync-banner" style={{ background: '#0E7C7B' }} role="status">
        <RefreshCw size={16} style={{ animation: 'spin 0.7s linear infinite' }} />
        {T('syncing')}
      </div>
    )
  }
  if (!isOnline) {
    return (
      <div className="offline-banner" role="alert">
        <WifiOff size={16} />
        {T('offlineMode')} — Your progress will be saved and synced when you reconnect.
      </div>
    )
  }
  return null
}
