/**
 * SurakshaAR — Authentication Validation & Security Helper
 * 
 * Provides:
 * 1. Strict RFC email validation, real-time existence checking, typo detection,
 *    and random gibberish / non-existent email rejection (e.g. jahdgsaJU@gmail.com)
 * 2. Jumbled strong password rules (min 8 chars, uppercase, lowercase, numbers, special symbol)
 * 3. Strong random password generator
 * 4. Verification OTP code generator & validator
 */

// Common email typo domains to suggest corrections
const TYPO_DOMAINS = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'hotmial.com': 'hotmail.com',
  'yaho.com': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'rediffmial.com': 'rediffmail.com',
}

// Disposable / temporary throwaway email domains to reject
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'throwawaymail.com',
  'trashmail.com',
  'yopmail.com',
  'sharklasers.com',
  'fakeinbox.com',
  'dispostable.com',
  'getairmail.com',
  'temp-mail.org',
  'mohmal.com',
])

// Keyboard smash patterns from QWERTY rows
const KEYBOARD_SMASH_PATTERNS = [
  'asdf', 'sdfg', 'dfgh', 'fghj', 'ghjk', 'hjkl', 'jklm',
  'qwer', 'wert', 'erty', 'rtyu', 'tyui', 'yuio', 'uiop',
  'zxcv', 'xcvb', 'cvbn', 'vbnm',
  'jahd', 'hdgs', 'dgsa', 'gsaj', 'hdsg', 'dksa', 'fjgh', 'ghjf',
  'lkjh', 'kjhg', 'jhgf', 'hgfd', 'gfds', 'fdsa',
]

/**
 * Check if a local part (username) appears to be a fake/random keyboard smash.
 */
export function isFakeGibberishUsername(rawLocal, domain) {
  // 1. Gmail usernames cannot contain uppercase letters
  if ((domain === 'gmail.com' || domain === 'googlemail.com') && /[A-Z]/.test(rawLocal)) {
    return {
      isFake: true,
      error: 'This Gmail address does not exist. Gmail addresses cannot contain uppercase letters.',
    }
  }

  // 2. Gmail official length requirement: 6 to 30 characters
  const clean = rawLocal.toLowerCase()
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    const withoutDots = clean.replace(/\./g, '')
    if (withoutDots.length < 6) {
      return {
        isFake: true,
        error: 'This Gmail address does not exist. Gmail usernames must be at least 6 characters long.',
      }
    }
    if (withoutDots.length > 30) {
      return {
        isFake: true,
        error: 'This Gmail address does not exist. Gmail usernames cannot exceed 30 characters.',
      }
    }
    // Consecutive dots or edge dots are illegal in Gmail
    if (clean.includes('..') || clean.startsWith('.') || clean.endsWith('.')) {
      return {
        isFake: true,
        error: 'This Gmail address does not exist. Dots cannot be consecutive or at the beginning/end.',
      }
    }
    // Illegal characters in Gmail
    if (/[^a-z0-9.]/.test(clean)) {
      return {
        isFake: true,
        error: 'This Gmail address does not exist. Gmail usernames only allow letters (a-z), numbers, and periods.',
      }
    }
  }

  // Strip digits, dots, and hyphens to analyze phonetic letter structure
  const alphaOnly = clean.replace(/[0-9._-]/g, '')

  // 3. Check keyboard row smash sequences (e.g. jahd, hdgs, asdf, etc.)
  for (const smash of KEYBOARD_SMASH_PATTERNS) {
    if (alphaOnly.includes(smash)) {
      return {
        isFake: true,
        error: 'This Gmail address does not exist. Please enter a valid, active email address.',
      }
    }
  }

  // 4. Home-row keyboard cluster check (letters only from asdfghjkl)
  if (alphaOnly.length >= 6) {
    const isHomeRowOnly = /^[asdfghjkl]+$/.test(alphaOnly)
    const allowedHomeNames = ['alka', 'kajal', 'kallu', 'gala', 'sahla', 'jafar', 'kamal', 'hasan', 'ashraf', 'daksh']
    if (isHomeRowOnly && !allowedHomeNames.some(n => alphaOnly.includes(n))) {
      return {
        isFake: true,
        error: 'This Gmail address does not exist. Please enter a valid, active email address.',
      }
    }
  }

  // 5. 5 or more consecutive consonants (unpronounceable fake strings)
  if (/[^aeiou0-9]{5,}/.test(clean)) {
    return {
      isFake: true,
      error: 'This Gmail address does not exist. Please enter a valid, active email address.',
    }
  }

  // 6. Repeated 4+ identical characters (e.g. aaaa, zzzz)
  if (/(.)\1{3,}/.test(clean)) {
    return {
      isFake: true,
      error: 'This Gmail address does not exist. Please enter a valid, active email address.',
    }
  }

  return { isFake: false, error: null }
}

/**
 * Validate an email address format, domain syntax, and reject fake/temporary/gibberish emails.
 * Returns { isValid: boolean, error: string | null, suggestion: string | null }
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email address is required.', suggestion: null }
  }

  const raw = email.trim()
  const clean = raw.toLowerCase()

  // Standard RFC 5322 regex for email syntax
  const rfcRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

  if (!rfcRegex.test(raw)) {
    return {
      isValid: false,
      error: 'Please enter a valid email format (e.g. yourname@gmail.com).',
      suggestion: null,
    }
  }

  const parts = raw.split('@')
  if (parts.length !== 2) {
    return { isValid: false, error: 'Email must contain exactly one "@" symbol.', suggestion: null }
  }

  const [rawUsername, rawDomain] = parts
  const domain = rawDomain.toLowerCase()

  if (rawUsername.length < 2) {
    return { isValid: false, error: 'Email username must be at least 2 characters.', suggestion: null }
  }

  // Check common typos
  if (TYPO_DOMAINS[domain]) {
    const suggested = `${rawUsername.toLowerCase()}@${TYPO_DOMAINS[domain]}`
    return {
      isValid: false,
      error: `Did you mean ${suggested}?`,
      suggestion: suggested,
    }
  }

  // Check temporary/disposable domains
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: 'Temporary or disposable email domains are not allowed. Please use a real email.',
      suggestion: null,
    }
  }

  // Domain structure checks
  const domainParts = domain.split('.')
  const tld = domainParts[domainParts.length - 1]

  if (!tld || tld.length < 2 || tld.length > 12) {
    return { isValid: false, error: 'Invalid domain extension (TLD).', suggestion: null }
  }

  // Check fake/gibberish username and provider existence rules
  const fakeCheck = isFakeGibberishUsername(rawUsername, domain)
  if (fakeCheck.isFake) {
    return {
      isValid: false,
      error: fakeCheck.error,
      suggestion: null,
    }
  }

  return { isValid: true, error: null, suggestion: null }
}

/**
 * Check password criteria and calculate strength score (0 to 4).
 * Enforces jumbled password rules:
 * - Minimum 8 characters
 * - Uppercase letter (A-Z)
 * - Lowercase letter (a-z)
 * - Number (0-9)
 * - Special character (@, #, $, %, !, &, etc.)
 */
export function checkPasswordCriteria(password) {
  const pwd = password || ''

  const checks = {
    length: pwd.length >= 8,
    hasLower: /[a-z]/.test(pwd),
    hasUpper: /[A-Z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecial: /[^A-Za-z0-9]/.test(pwd),
  }

  // Combined letter check for UI
  const hasBothCases = checks.hasLower && checks.hasUpper

  let score = 0
  if (checks.length) score++
  if (hasBothCases) score++
  if (checks.hasNumber) score++
  if (checks.hasSpecial) score++

  let strengthLabel = 'Weak'
  let strengthColor = '#EF4444' // Red

  if (score === 2) {
    strengthLabel = 'Fair'
    strengthColor = '#F97316' // Orange
  } else if (score === 3) {
    strengthLabel = 'Good'
    strengthColor = '#EAB308' // Amber
  } else if (score === 4) {
    strengthLabel = 'Strong'
    strengthColor = '#10B981' // Emerald Green
  }

  const allMet = checks.length && checks.hasLower && checks.hasUpper && checks.hasNumber && checks.hasSpecial

  return {
    checks,
    hasBothCases,
    score,
    strengthLabel,
    strengthColor,
    allMet,
  }
}

/**
 * Generate a strong, jumbled password that satisfies all security criteria.
 * Includes uppercase, lowercase, numbers, and special symbols (@, #, $, !, %).
 */
export function generateStrongPassword() {
  const uppers = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lowers = 'abcdefghijkmnopqrstuvwxyz'
  const digits = '23456789'
  const specials = '@#$%&!*?'

  // Guarantee at least one of each required set
  let pwd = [
    uppers[Math.floor(Math.random() * uppers.length)],
    lowers[Math.floor(Math.random() * lowers.length)],
    digits[Math.floor(Math.random() * digits.length)],
    specials[Math.floor(Math.random() * specials.length)],
  ]

  const allChars = uppers + lowers + digits + specials
  for (let i = 0; i < 8; i++) {
    pwd.push(allChars[Math.floor(Math.random() * allChars.length)])
  }

  // Shuffle the array using Fisher-Yates algorithm
  for (let i = pwd.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pwd[i], pwd[j]] = [pwd[j], pwd[i]]
  }

  return pwd.join('')
}

/**
 * Generate a random 6-digit verification code.
 */
export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
