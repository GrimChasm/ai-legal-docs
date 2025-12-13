/**
 * Rate Limiting Utility
 * 
 * Simple in-memory rate limiting for API routes.
 * For production, consider using Redis or a dedicated rate limiting service.
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store (clears on server restart)
// In production, use Redis or similar for distributed rate limiting
const store: RateLimitStore = {}

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    for (const key in store) {
      if (store[key].resetTime < now) {
        delete store[key]
      }
    }
  }, 5 * 60 * 1000)
}

export interface RateLimitOptions {
  /** Maximum number of requests allowed */
  max: number
  /** Time window in seconds */
  window: number
  /** Optional identifier for rate limiting (defaults to IP address) */
  identifier?: string
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

/**
 * Rate limit check
 * 
 * @param options Rate limiting options
 * @param request Next.js request object (for IP extraction)
 * @returns Rate limit result
 */
export function rateLimit(
  options: RateLimitOptions,
  request?: Request
): RateLimitResult {
  const { max, window, identifier } = options

  // Get identifier (IP address or custom)
  let key: string
  if (identifier) {
    key = identifier
  } else if (request) {
    // Extract IP address from request
    const forwarded = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    const ip = forwarded?.split(",")[0] || realIp || "unknown"
    key = `rate-limit:${ip}`
  } else {
    key = "rate-limit:unknown"
  }

  const now = Date.now()
  const windowMs = window * 1000

  // Get or create entry
  let entry = store[key]

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired one
    entry = {
      count: 1,
      resetTime: now + windowMs,
    }
    store[key] = entry
    return {
      success: true,
      limit: max,
      remaining: max - 1,
      reset: entry.resetTime,
    }
  }

  // Increment count
  entry.count++

  if (entry.count > max) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
    return {
      success: false,
      limit: max,
      remaining: 0,
      reset: entry.resetTime,
      retryAfter,
    }
  }

  return {
    success: true,
    limit: max,
    remaining: max - entry.count,
    reset: entry.resetTime,
  }
}

/**
 * Rate limit middleware for API routes
 * 
 * Usage:
 * ```ts
 * const rateLimitResult = checkRateLimit(request)
 * if (!rateLimitResult.success) {
 *   return NextResponse.json(
 *     { error: "Too many requests", retryAfter: rateLimitResult.retryAfter },
 *     { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
 *   )
 * }
 * ```
 */
export function checkRateLimit(
  request: Request,
  options: Partial<RateLimitOptions> = {}
): RateLimitResult {
  const defaultOptions: RateLimitOptions = {
    max: 100, // 100 requests
    window: 60, // per minute
    ...options,
  }

  return rateLimit(defaultOptions, request)
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.reset.toString(),
    ...(result.retryAfter && {
      "Retry-After": result.retryAfter.toString(),
    }),
  }
}

/**
 * Rate limit presets for different endpoints
 */
export const RATE_LIMITS = {
  // Document generation is expensive, limit more strictly
  GENERATE: {
    max: 20,
    window: 60, // 20 requests per minute
  },
  // Drafts are less expensive
  DRAFTS: {
    max: 60,
    window: 60, // 60 requests per minute
  },
  // Stripe checkout should be limited to prevent abuse
  CHECKOUT: {
    max: 10,
    window: 60, // 10 requests per minute
  },
  // General API endpoints
  DEFAULT: {
    max: 100,
    window: 60, // 100 requests per minute
  },
} as const







