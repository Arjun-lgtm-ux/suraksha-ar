import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured =
  !!supabaseUrl &&
  supabaseUrl.startsWith('http') &&
  !!supabaseAnonKey &&
  supabaseAnonKey.length > 20

if (!isSupabaseConfigured) {
  console.warn(
    '[SurakshaAR] Supabase not configured — running in Demo Mode (localStorage).\n' +
    'To enable real auth: copy .env.example → .env and add your Supabase keys.'
  )
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export function friendlyAuthError(error) {
  if (!error) return null
  const msg = error.message ?? ''
  if (
    msg.toLowerCase().includes('load failed') ||
    msg.toLowerCase().includes('failed to fetch') ||
    msg.toLowerCase().includes('networkerror')
  ) {
    return 'Cannot connect to the server. Check your internet connection.'
  }
  if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('credential')) {
    return 'Invalid email or password. Please try again.'
  }
  if (msg.toLowerCase().includes('email not confirmed')) {
    return 'Please confirm your email before logging in.'
  }
  if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already been registered')) {
    return 'An account with this email already exists. Try logging in.'
  }
  return msg
}
