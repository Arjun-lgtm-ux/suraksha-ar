/**
 * In-memory sliding-window rate limiter for Cloudflare Worker & Node serverless environments.
 * Limits requests per IP address or session ID to protect free-tier API quotas.
 */

export class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 60 * 1000 // 1 minute window
    this.maxRequests = options.maxRequests || 25   // max 25 requests per window
    this.records = new Map()
  }

  /**
   * Check and record a request.
   * @param {string} identifier - Client IP or sessionId
   * @returns {{ allowed: boolean, remaining: number, retryAfter: number }}
   */
  check(identifier) {
    const now = Date.now()
    const cleanId = identifier || 'anonymous'

    // Clean up expired entries periodically
    if (this.records.size > 1000) {
      for (const [key, record] of this.records.entries()) {
        if (now - record.startTime > this.windowMs) {
          this.records.delete(key)
        }
      }
    }

    const currentRecord = this.records.get(cleanId)

    if (!currentRecord || (now - currentRecord.startTime > this.windowMs)) {
      this.records.set(cleanId, {
        startTime: now,
        count: 1
      })
      return { allowed: true, remaining: this.maxRequests - 1, retryAfter: 0 }
    }

    if (currentRecord.count >= this.maxRequests) {
      const resetTime = currentRecord.startTime + this.windowMs
      const retryAfter = Math.ceil((resetTime - now) / 1000)
      return { allowed: false, remaining: 0, retryAfter }
    }

    currentRecord.count += 1
    return {
      allowed: true,
      remaining: this.maxRequests - currentRecord.count,
      retryAfter: 0
    }
  }
}
