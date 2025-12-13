/**
 * Redis Rate Limiting Utility
 * 
 * Production-ready rate limiting using Redis.
 * Falls back to in-memory rate limiting if Redis is not available.
 * 
 * Setup:
 * 1. Install: npm install ioredis
 * 2. Set REDIS_URL in .env.local (e.g., redis://localhost:6379)
 * 3. For Upstash: Get connection string from https://upstash.com
 */

import { rateLimit, type RateLimitOptions, type RateLimitResult } from "./rate-limit"

let redisClient: any = null
let redisAvailable = false

// Lazy load Redis client
async function getRedisClient() {
  if (redisClient) {
    return redisClient
  }

  try {
    // Only import if REDIS_URL is set
    if (process.env.REDIS_URL) {
      const Redis = (await import("ioredis")).default
      redisClient = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000)
          return delay
        },
      })

      redisClient.on("error", (err: Error) => {
        console.error("Redis error:", err)
        redisAvailable = false
      })

      redisClient.on("connect", () => {
        redisAvailable = true
      })

      // Test connection
      await redisClient.ping()
      redisAvailable = true
      return redisClient
    }
  } catch (error) {
    console.warn("Redis not available, falling back to in-memory rate limiting:", error)
    redisAvailable = false
  }

  return null
}

/**
 * Redis-backed rate limiting
 * Falls back to in-memory if Redis is unavailable
 */
export async function rateLimitRedis(
  options: RateLimitOptions,
  request?: Request
): Promise<RateLimitResult> {
  const { max, window, identifier } = options

  // Get identifier
  let key: string
  if (identifier) {
    key = identifier
  } else if (request) {
    const forwarded = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    const ip = forwarded?.split(",")[0] || realIp || "unknown"
    key = `rate-limit:${ip}`
  } else {
    key = "rate-limit:unknown"
  }

  const redisKey = `rl:${key}`
  const windowMs = window * 1000

  try {
    const client = await getRedisClient()

    if (client && redisAvailable) {
      // Use Redis for rate limiting
      const now = Date.now()
      const pipeline = client.pipeline()

      // Get current count
      pipeline.get(redisKey)
      // Increment and set expiry
      pipeline.incr(redisKey)
      pipeline.pexpire(redisKey, windowMs)

      const results = await pipeline.exec()
      const currentCount = results?.[0]?.[1] ? parseInt(results[0][1] as string, 10) : 0
      const newCount = results?.[1]?.[1] ? parseInt(results[1][1] as string, 10) : 1

      const resetTime = now + windowMs

      if (newCount > max) {
        const retryAfter = Math.ceil(windowMs / 1000)
        return {
          success: false,
          limit: max,
          remaining: 0,
          reset: resetTime,
          retryAfter,
        }
      }

      return {
        success: true,
        limit: max,
        remaining: max - newCount,
        reset: resetTime,
      }
    }
  } catch (error) {
    console.warn("Redis rate limiting failed, falling back to in-memory:", error)
    redisAvailable = false
  }

  // Fallback to in-memory rate limiting
  return rateLimit(options, request)
}

/**
 * Check rate limit with Redis (async)
 */
export async function checkRateLimitRedis(
  request: Request,
  options: Partial<RateLimitOptions> = {}
): Promise<RateLimitResult> {
  const defaultOptions: RateLimitOptions = {
    max: 100,
    window: 60,
    ...options,
  }

  return rateLimitRedis(defaultOptions, request)
}


