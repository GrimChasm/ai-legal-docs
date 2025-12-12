/**
 * Validation Utility Tests
 * 
 * Tests for input validation functions to ensure security and data integrity.
 */

import {
  validateString,
  validateEmail,
  validateId,
  validateEnum,
  validateNumber,
  validateContractId,
  validateValues,
  validateRequestBody,
} from "@/lib/validation"

describe("Validation Utilities", () => {
  describe("validateString", () => {
    it("should validate a non-empty string", () => {
      const result = validateString("test", "field")
      expect(result.valid).toBe(true)
    })

    it("should reject non-string values", () => {
      const result = validateString(123, "field")
      expect(result.valid).toBe(false)
      expect(result.error).toContain("must be a string")
    })

    it("should reject empty strings", () => {
      const result = validateString("", "field")
      expect(result.valid).toBe(false)
      expect(result.error).toContain("cannot be empty")
    })

    it("should reject strings exceeding max length", () => {
      const result = validateString("a".repeat(101), "field", 100)
      expect(result.valid).toBe(false)
      expect(result.error).toContain("less than 100")
    })
  })

  describe("validateEmail", () => {
    it("should validate a valid email", () => {
      const result = validateEmail("test@example.com")
      expect(result.valid).toBe(true)
    })

    it("should reject invalid email formats", () => {
      const result = validateEmail("not-an-email")
      expect(result.valid).toBe(false)
      expect(result.error).toContain("valid email address")
    })

    it("should reject empty emails", () => {
      const result = validateEmail("")
      expect(result.valid).toBe(false)
    })
  })

  describe("validateId", () => {
    it("should validate a CUID", () => {
      const result = validateId("c1234567890123456789012345")
      expect(result.valid).toBe(true)
    })

    it("should validate a UUID", () => {
      const result = validateId("123e4567-e89b-12d3-a456-426614174000")
      expect(result.valid).toBe(true)
    })

    it("should reject invalid ID formats", () => {
      const result = validateId("invalid-id")
      expect(result.valid).toBe(false)
    })
  })

  describe("validateEnum", () => {
    it("should validate allowed values", () => {
      const result = validateEnum("subscription", ["subscription", "payment"] as const)
      expect(result.valid).toBe(true)
    })

    it("should reject disallowed values", () => {
      const result = validateEnum("invalid", ["subscription", "payment"] as const)
      expect(result.valid).toBe(false)
    })
  })

  describe("validateContractId", () => {
    it("should validate standard contract IDs", () => {
      const result = validateContractId("nda")
      expect(result.valid).toBe(true)
    })

    it("should validate custom contract IDs", () => {
      const result = validateContractId("custom-123")
      expect(result.valid).toBe(true)
    })

    it("should reject invalid formats", () => {
      const result = validateContractId("invalid@id")
      expect(result.valid).toBe(false)
    })
  })

  describe("validateValues", () => {
    it("should validate a valid values object", () => {
      const result = validateValues({ name: "John", age: 30 })
      expect(result.valid).toBe(true)
    })

    it("should reject non-object values", () => {
      const result = validateValues("not an object")
      expect(result.valid).toBe(false)
    })

    it("should reject arrays", () => {
      const result = validateValues([])
      expect(result.valid).toBe(false)
    })

    it("should reject objects with too many fields", () => {
      const largeObject: Record<string, string> = {}
      for (let i = 0; i < 101; i++) {
        largeObject[`field${i}`] = "value"
      }
      const result = validateValues(largeObject)
      expect(result.valid).toBe(false)
      expect(result.error).toContain("Too many fields")
    })

    it("should reject invalid value types", () => {
      const result = validateValues({ name: { nested: "object" } })
      expect(result.valid).toBe(false)
    })
  })

  describe("validateRequestBody", () => {
    it("should validate request body with all required fields", () => {
      const result = validateRequestBody({ field1: "value1", field2: "value2" }, ["field1", "field2"])
      expect(result.valid).toBe(true)
    })

    it("should reject missing required fields", () => {
      const result = validateRequestBody({ field1: "value1" }, ["field1", "field2"])
      expect(result.valid).toBe(false)
      expect(result.error).toContain("Missing required field")
    })

    it("should reject non-object bodies", () => {
      const result = validateRequestBody("not an object", ["field1"])
      expect(result.valid).toBe(false)
    })
  })
})





