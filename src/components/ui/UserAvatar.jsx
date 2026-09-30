import React, { useState, useEffect } from 'react'
import { getGooglePresetAvatar } from '../../data/googleAvatars'

export function getUserAvatarUrl(user, profile) {
  // 1. Check custom uploaded or stored avatar_url (excluding broken unavatar URLs)
  const rawUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture
  if (rawUrl && typeof rawUrl === 'string' && !rawUrl.includes('unavatar.io')) {
    return rawUrl
  }

  // 2. Auto-sync real Google profile photo from presets if email matches
  const email = (user?.email || profile?.email || '').trim().toLowerCase()
  const preset = getGooglePresetAvatar(email)
  if (preset) return preset

  return null
}

export function UserAvatar({ user, profile, size = 38, style = {}, className = '' }) {
  const avatarUrl = getUserAvatarUrl(user, profile)
  const [loadedImg, setLoadedImg] = useState(null)

  useEffect(() => {
    if (!avatarUrl) {
      setLoadedImg(null)
      return
    }
    let isCurrent = true
    const img = new Image()
    img.src = avatarUrl
    img.onload = () => {
      if (isCurrent) setLoadedImg(avatarUrl)
    }
    img.onerror = () => {
      if (isCurrent) setLoadedImg(null)
    }
    return () => {
      isCurrent = false
    }
  }, [avatarUrl])

  const rawName = (profile?.full_name || user?.user_metadata?.full_name || user?.email || 'Trainee').trim()
  const cleanName = rawName.replace(/^[^a-zA-Z0-9]+/, '')
  const initial = (cleanName[0] || 'T').toUpperCase()

  if (loadedImg) {
    return (
      <img
        src={loadedImg}
        alt={rawName}
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '1.5px solid rgba(255,255,255,0.2)',
          display: 'block',
          flexShrink: 0,
          ...style,
        }}
      />
    )
  }

  const fontSize = size <= 28 ? '0.72rem' : size <= 42 ? '0.95rem' : size <= 64 ? '1.5rem' : '1.8rem'

  return (
    <div
      className={className}
      aria-label={rawName}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #FF6B00 0%, #E05A00 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        fontWeight: 800,
        color: '#FFFFFF',
        flexShrink: 0,
        userSelect: 'none',
        lineHeight: 1,
        boxShadow: '0 2px 8px rgba(224,90,0,0.25)',
        ...style,
      }}
    >
      {initial}
    </div>
  )
}

export default UserAvatar
