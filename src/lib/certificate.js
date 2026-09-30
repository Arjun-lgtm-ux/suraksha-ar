/**
 * SurakshaAR — Certificate Generation
 * Generates certificate ID, builds certificate data, triggers download.
 */
import { recordOnChain } from './blockchain'
import { supabase, isSupabaseConfigured } from './supabase'

/** Generate a unique certificate number: SAR-YYYY-XXXXXXXX */
export function generateCertNumber() {
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).substring(2, 10).toUpperCase()
  return `SAR-${year}-${random}`
}

/**
 * Issue a certificate after assessment is passed.
 * Stores in Supabase (or mock) and records blockchain hash.
 * 
 * @param {{ userId, traineeName, scenarioId, courseName, score, attemptId }} params
 * @returns {object} certificate
 */
export async function issueCertificate({ userId, traineeName, scenarioId, courseName, score, attemptId }) {
  const cert_number = generateCertNumber()
  const issued_at = new Date().toISOString()

  const certData = {
    cert_number,
    user_id: userId,
    trainee_name: traineeName,
    course_name: courseName,
    score,
    issued_at,
    scenario_id: scenarioId,
    attempt_id: attemptId,
  }

  // Compute hash + blockchain record
  const chainRecord = await recordOnChain(certData)

  const fullCert = {
    ...certData,
    hash_sha256: chainRecord.hash_sha256,
    blockchain_tx_id: chainRecord.blockchain_tx_id,
    status: 'valid',
  }

  if (!isSupabaseConfigured) {
    // Store in localStorage for demo
    const certs = JSON.parse(localStorage.getItem('mock_certificates') ?? '[]')
    const newCert = { id: crypto.randomUUID(), ...fullCert }
    localStorage.setItem('mock_certificates', JSON.stringify([...certs, newCert]))
    return newCert
  }

  const { data, error } = await supabase
    .from('certificates')
    .insert(fullCert)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Get all certificates for a user */
export async function getUserCertificates(userId) {
  if (!isSupabaseConfigured) {
    const certs = JSON.parse(localStorage.getItem('mock_certificates') ?? '[]')
    return certs.filter(c => c.user_id === userId)
  }
  const { data, error } = await supabase
    .from('certificates')
    .select('*, scenarios(title)')
    .eq('user_id', userId)
    .eq('status', 'valid')
    .order('issued_at', { ascending: false })
  if (error) throw error
  return data
}

/** Get a single certificate by cert_number (for public verify) */
export async function getCertificateByNumber(certNumber) {
  if (!isSupabaseConfigured) {
    const certs = JSON.parse(localStorage.getItem('mock_certificates') ?? '[]')
    return certs.find(c => c.cert_number === certNumber) ?? null
  }
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('cert_number', certNumber)
    .single()
  if (error) return null
  return data
}
