/**
 * Distributed rate limiter for the contact form.
 *
 * Uses Upstash Redis (HTTP-based, works in serverless) when configured.
 * Falls back to an in-memory limiter for local development and CI when
 * UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set.
 *
 * Why sliding window? Fixed-window allows burst-at-boundary attacks
 * (5 requests at second 59, 5 more at second 61 = 10 requests in 2s).
 * Sliding window weights the prior bucket to smooth that out.
 *
 * Why fail open? If Upstash is unreachable, we don't want to deny
 * legitimate contact submissions. The contact endpoint is not security-
 * critical — it sends a single email. The blast radius of "allow a few
 * extra emails during an outage" is much smaller than "reject all
 * contact form submissions because Redis is down".
 *
 * The cooldown check (MIN_REQUEST_INTERVAL_MS) lives only in the
 * in-memory fallback. In production with Upstash, the sliding window
 * already spaces requests. Keeping the cooldown out of Redis is a
 * deliberate scope cut: it was a defense-in-depth layer for the original
 * single-instance setup and isn't worth a second Redis round-trip.
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// --- In-memory fallback --------------------------------------------------

type MemoryEntry = {
  count: number
  resetTime: number
  lastRequestTime: number
}

const memoryStore = new Map<string, MemoryEntry>()
const MEMORY_STORE_LIMIT = 1000

function memoryCheck(
  key: string,
  limit: number,
  windowMs: number,
  minIntervalMs: number,
): boolean {
  const now = Date.now()

  // Periodically prune expired entries to prevent unbounded growth.
  if (memoryStore.size > MEMORY_STORE_LIMIT) {
    for (const [k, v] of memoryStore) {
      if (now > v.resetTime) memoryStore.delete(k)
    }
  }

  const entry = memoryStore.get(key)

  if (!entry || now > entry.resetTime) {
    memoryStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
      lastRequestTime: now,
    })
    return false
  }

  if (now - entry.lastRequestTime < minIntervalMs) {
    return true
  }

  entry.count++
  entry.lastRequestTime = now
  return entry.count > limit
}

/** Clear the in-memory store. Test helper only — never called in production. */
export function __resetMemoryStoreForTests(): void {
  memoryStore.clear()
}

// --- Upstash client ------------------------------------------------------

function getUpstashClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

let cachedLimiter: Ratelimit | null = null

function getRatelimit(limit: number, windowMs: number): Ratelimit | null {
  const redis = getUpstashClient()
  if (!redis) return null
  if (cachedLimiter) return cachedLimiter

  cachedLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
    prefix: 'contact',
    analytics: false,
  })
  return cachedLimiter
}

/** Test helper — reset the cached Upstash limiter. */
export function __resetRatelimitCacheForTests(): void {
  cachedLimiter = null
}

// --- Public API ----------------------------------------------------------

export interface RateLimitConfig {
  limit: number
  windowMs: number
  minIntervalMs: number
}

export interface RateLimitResult {
  success: boolean
  /** Remaining requests in the current window. 0 when blocked. */
  remaining: number
  /** Unix-ms when the next request would be allowed. */
  reset: number
}

/**
 * Build the rate-limit configuration from environment variables, with
 * defaults that match the previous in-memory behavior.
 */
export function getRateLimitConfig(): RateLimitConfig {
  return {
    limit: Number(process.env.CONTACT_RATE_LIMIT ?? '5'),
    windowMs: Number(process.env.CONTACT_RATE_WINDOW_MS ?? '60000'),
    minIntervalMs: Number(process.env.CONTACT_MIN_REQUEST_INTERVAL_MS ?? '10000'),
  }
}

/**
 * Check whether a request from `key` should be allowed.
 *
 * Returns `{ success: true }` if the request should proceed. Either the
 * distributed (Upstash) or in-memory limiter is used, depending on env.
 */
export async function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  const limiter = getRatelimit(config.limit, config.windowMs)

  // No Upstash configured → in-memory fallback with cooldown.
  if (!limiter) {
    const blocked = memoryCheck(
      key,
      config.limit,
      config.windowMs,
      config.minIntervalMs,
    )
    return {
      success: !blocked,
      remaining: blocked ? 0 : config.limit,
      reset: Date.now() + config.windowMs,
    }
  }

  try {
    const result = await limiter.limit(key)
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
    }
  } catch (error) {
    // Fail open on Redis errors. Log for observability but don't block
    // legitimate users.
    console.error('[rate-limit] Upstash error, failing open:', error)
    return {
      success: true,
      remaining: config.limit,
      reset: Date.now() + config.windowMs,
    }
  }
}