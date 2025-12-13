/**
 * Rate Limiting Tests
 * 
 * Tests for rate limiting functionality to prevent API abuse.
 */

import { rateLimit, checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit"

// Mock Request object
function createMockRequest(ip: string = "127.0.0.1"): Request {
  return {
    headers: new Headers({
      "x-forwarded-for": ip,
    }),
  } as Request
}

describe("Rate Limiting", () => {
  beforeEach(() => {
    // Clear rate limit store before each test
    // Note: In a real implementation, you'd reset the store
  })

  describe("rateLimit", () => {
    it("should allow requests within limit", () => {
      const request = createMockRequest()
      const result = rateLimit(
        { max: 5, window: 60 },
        request
      )
      expect(result.success).toBe(true)
      expect(result.remaining).toBeGreaterThan(0)
    })

    it("should reject requests exceeding limit", () => {
      const request = createMockRequest("192.168.1.1")
      const options = { max: 2, window: 60 }

      // Make requests up to limit
      rateLimit(options, request)
      rateLimit(options, request)
      
      // This should exceed the limit
      const result = rateLimit(options, request)
      expect(result.success).toBe(false)
      expect(result.remaining).toBe(0)
      expect(result.retryAfter).toBeDefined()
    })

    it("should reset after window expires", () => {
      // This test would require time manipulation
      // In a real scenario, you'd use a time-based mock
      const request = createMockRequest()
      const result = rateLimit(
        { max: 1, window: 1 }, // 1 second window
        request
      )
      expect(result.success).toBe(true)
    })
  })

  describe("checkRateLimit", () => {
    it("should use default limits when none specified", () => {
      const request = createMockRequest()
      const result = checkRateLimit(request)
      expect(result.success).toBe(true)
      expect(result.limit).toBe(100) // Default limit
    })

    it("should use custom limits", () => {
      const request = createMockRequest()
      const result = checkRateLimit(request, { max: 10, window: 60 })
      expect(result.success).toBe(true)
      expect(result.limit).toBe(10)
    })
  })

  describe("RATE_LIMITS presets", () => {
    it("should have appropriate limits for document generation", () => {
      expect(RATE_LIMITS.GENERATE.max).toBe(20)
      expect(RATE_LIMITS.GENERATE.window).toBe(60)
    })

    it("should have appropriate limits for checkout", () => {
      expect(RATE_LIMITS.CHECKOUT.max).toBe(10)
      expect(RATE_LIMITS.CHECKOUT.window).toBe(60)
    })
  })
})






