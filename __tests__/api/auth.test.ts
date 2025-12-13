/**
 * Authentication API Tests
 * 
 * Tests critical authentication flows:
 * - User signup
 * - User login
 * - Session management
 * - Password validation
 */

describe("Authentication API", () => {
  const API_BASE = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  describe("POST /api/auth/signup", () => {
    it("should create a new user with valid credentials", async () => {
      const testEmail = `test-${Date.now()}@example.com`
      const testPassword = "TestPassword123!"

      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          name: "Test User",
        }),
      })

      expect(response.status).toBe(201)
      const data = await response.json()
      expect(data).toHaveProperty("user")
      expect(data.user).toHaveProperty("email", testEmail)
    })

    it("should reject signup with invalid email", async () => {
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "invalid-email",
          password: "TestPassword123!",
          name: "Test User",
        }),
      })

      expect(response.status).toBe(400)
    })

    it("should reject signup with weak password", async () => {
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "123",
          name: "Test User",
        }),
      })

      expect(response.status).toBe(400)
    })

    it("should reject signup with existing email", async () => {
      const testEmail = `test-${Date.now()}@example.com`
      const testPassword = "TestPassword123!"

      // Create first user
      await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          name: "Test User",
        }),
      })

      // Try to create duplicate
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          name: "Test User 2",
        }),
      })

      expect(response.status).toBe(400)
    })
  })
})


