/**
 * Google Account Profile Photo Helper
 * Generates lightweight, privacy-safe vector avatars dynamically for ANY user.
 * ZERO hardcoded personal emails.
 */
export const GOOGLE_AVATAR_PRESETS = {}

export function getGooglePresetAvatar(email, name = '') {
  if (!email && !name) return null
  const cleanEmail = (email || '').trim().toLowerCase()
  const cleanName = (name || cleanEmail.split('@')[0] || 'U').trim()
  const initial = (cleanName[0] || 'U').toUpperCase()

  // Google Material palette
  const colors = [
    '#1A73E8', // Google Blue
    '#D93025', // Google Red
    '#188038', // Google Green
    '#E37400', // Google Orange
    '#9334E6', // Google Purple
    '#00796B', // Teal
    '#C2185B', // Pink
    '#00838F', // Cyan
  ]

  let hash = 0
  for (let i = 0; i < cleanEmail.length; i++) {
    hash = cleanEmail.charCodeAt(i) + ((hash << 5) - hash)
  }
  const color = colors[Math.abs(hash) % colors.length]

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
    <rect width="96" height="96" rx="48" fill="${color}"/>
    <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" fill="#FFFFFF" font-family="-apple-system,BlinkMacSystemFont,'Google Sans',Roboto,sans-serif" font-size="44" font-weight="600">${initial}</text>
  </svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export async function getGravatarUrl(email) {
  if (!email || !email.includes('@')) return null
  try {
    const clean = email.trim().toLowerCase()
    const encoder = new TextEncoder()
    const data = encoder.encode(clean)
    const hashBuf = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuf))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return `https://www.gravatar.com/avatar/${hashHex}?d=404`
  } catch {
    return null
  }
}
