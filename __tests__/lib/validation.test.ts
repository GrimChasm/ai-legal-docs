/**
 * Validation Library Tests
 * 
 * Tests input validation functions:
 * - String validation
 * - Email validation
 * - ID validation
 * - Request body validation
 */

import {
  validateString,
  validateEmail,
  validateId,
  validateRequestBody,
  validateEnum,
} from "@/lib/validation"

describe("Validation Library", () => {
  describe("validateString", () => {
    it("should validate non-empty strings", () => {
      expect(() => validateString("test", "field")).not.toThrow()
    })

    it("should reject empty strings", () => {
      expect(() => validateString("", "field")).toThrow()
    })

    it("should reject non-strings", () => {
      expect(() => validateString(123 as any, "field")).toThrow()
      expect(() => validateString(null as any, "field")).toThrow()
      expect(() => validateString(undefined as any, "field")).toThrow()
    })

    it("should enforce max length", () => {
      const longString = "a".repeat(1001)
      expect(() => validateString(longString, "field", { maxLength: 1000 })).toThrow()
    })
  })

  describe("validateEmail", () => {
    it("should validate correct email formats", () => {
      expect(() => validateEmail("test@example.com", "email")).not.toThrow()
      expect(() => validateEmail("user.name+tag@example.co.uk", "email")).not.toThrow()
    })

    it("should reject invalid email formats", () => {
      expect(() => validateEmail("invalid-email", "email")).toThrow()
      expect(() => validateEmail("@example.com", "email")).toThrow()
      expect(() => validateEmail("test@", "email")).toThrow()
    })
  })

  describe("validateId", () => {
    it("should validate CUID format", () => {
      expect(() => validateId("cmj22atce000959i5tikibesa", "id")).not.toThrow()
    })

    it("should reject invalid ID formats", () => {
      expect(() => validateId("", "id")).toThrow()
      expect(() => validateId("short", "id")).toThrow()
      expect(() => validateId("invalid-id-format", "id")).toThrow()
    })
  })

  describe("validateEnum", () => {
    it("should validate enum values", () => {
      expect(() => validateEnum("value1", ["value1", "value2"] as const, "field")).not.toThrow()
    })

    it("should reject invalid enum values", () => {
      expect(() => validateEnum("invalid", ["value1", "value2"] as const, "field")).toThrow()
    })
  })

  describe("validateRequestBody", () => {
    it("should validate required fields", () => {
      const schema = {
        email: { type: "string", required: true },
        name: { type: "string", required: false },
      }

      expect(() =>
        validateRequestBody({ email: "test@example.com" }, schema)
      ).not.toThrow()
    })

    it("should reject missing required fields", () => {
      const schema = {
        email: { type: "string", required: true },
      }

      expect(() => validateRequestBody({}, schema)).toThrow()
    })
  })
})
