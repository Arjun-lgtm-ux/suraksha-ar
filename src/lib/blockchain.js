/**
 * SurakshaAR — Certificate Blockchain Integrity Module
 *
 * For hackathon demo: uses SHA-256 (SubtleCrypto browser API) to hash
 * the canonical certificate payload and stores it in Supabase.
 *
 * Architecture: provider-abstracted so real on-chain provider can be
 * configured via VITE_CHAIN_MODE environment variable.
 *
 * CHAIN_MODE = 'local' → SHA-256 stored in Supabase (demo)
 * CHAIN_MODE = 'polygon' → Requires ethers.js + backend signing service
 *
 * Certificates are clearly labelled with their verification method.
 */

const CHAIN_MODE = import.meta.env.VITE_CHAIN_MODE ?? 'local'

/**
 * Compute SHA-256 hash of a string using the SubtleCrypto Web API.
 * No external library needed — available in all modern browsers.
 */
export async function sha256(text) {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Build a canonical (deterministic, ordered) certificate payload string.
 * This is what gets hashed — order matters for reproducibility.
 */
export function buildCanonicalPayload(cert) {
  return JSON.stringify({
    cert_number: cert.cert_number,
    user_id: cert.user_id,
    trainee_name: cert.trainee_name,
    course_name: cert.course_name,
    score: cert.score,
    issued_at: cert.issued_at,
    scenario_id: cert.scenario_id,
  }, null, 0) // no extra whitespace — deterministic
}

/**
 * Record certificate on the configured chain/provider.
 * Returns { txId, provider, mode } for storage in the certificates table.
 */
export async function recordOnChain(certData) {
  const payload = buildCanonicalPayload(certData)
  const hash = await sha256(payload)

  if (CHAIN_MODE === 'local') {
    // Demo mode: store hash in Supabase — clearly labelled
    // txId format: LOCAL:first16charsOfHash
    return {
      hash_sha256: hash,
      blockchain_tx_id: `LOCAL:${hash.substring(0, 16)}`,
      provider: 'supabase-sha256-demo',
      mode: 'local',
    }
  }

  if (CHAIN_MODE === 'polygon') {
    // Real Polygon Mumbai testnet — requires backend signing service
    // NOT implemented in frontend bundle (private key must stay on server)
    throw new Error(
      'Polygon chain mode requires a backend signing service.\n' +
      'Configure a server-side endpoint and set VITE_CHAIN_ENDPOINT.'
    )
  }

  throw new Error(`Unknown VITE_CHAIN_MODE: ${CHAIN_MODE}`)
}

/**
 * Verify a certificate's integrity by recomputing its hash.
 * Call this on the /verify/:certId page.
 * 
 * @param {object} cert - Full certificate object from DB
 * @returns {{ valid: boolean, computedHash: string, storedHash: string }}
 */
export async function verifyCertificate(cert) {
  const payload = buildCanonicalPayload(cert)
  const computedHash = await sha256(payload)
  const storedHash = cert.hash_sha256
  return {
    valid: computedHash === storedHash,
    computedHash,
    storedHash,
  }
}
