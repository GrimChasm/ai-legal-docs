/**
 * Input Validation Utilities
 * 
 * Provides validation functions for API route inputs to prevent
 * invalid data, injection attacks, and ensure data integrity.
 */

export interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validates that a value is a non-empty string
 */
export function validateString(value: any, fieldName: string, maxLength?: number): ValidationResult {
  if (typeof value !== "string") {
    return { valid: false, error: `${fieldName} must be a string` }
  }
  
  if (value.trim().length === 0) {
    return { valid: false, error: `${fieldName} cannot be empty` }
  }
  
  if (maxLength && value.length > maxLength) {
    return { valid: false, error: `${fieldName} must be less than ${maxLength} characters` }
  }
  
  return { valid: true }
}

/**
 * Validates that a value is a valid email address
 */
export function validateEmail(value: any, fieldName: string = "Email"): ValidationResult {
  const stringResult = validateString(value, fieldName)
  if (!stringResult.valid) {
    return stringResult
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return { valid: false, error: `${fieldName} must be a valid email address` }
  }
  
  return { valid: true }
}

/**
 * Validates that a value is a valid UUID or CUID
 * 
 * CUIDs from Prisma can vary in length (typically 20-30 characters after 'c')
 * UUIDs follow the standard 8-4-4-4-12 hex format
 */
export function validateId(value: any, fieldName: string = "ID"): ValidationResult {
  const stringResult = validateString(value, fieldName, 200)
  if (!stringResult.valid) {
    return stringResult
  }
  
  // CUID format: c + 20-30 alphanumeric characters (Prisma generates variable length)
  // UUID format: 8-4-4-4-12 hex characters
  const cuidRegex = /^c[a-z0-9]{20,30}$/
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  
  if (!cuidRegex.test(value) && !uuidRegex.test(value)) {
    return { valid: false, error: `${fieldName} must be a valid ID format` }
  }
  
  return { valid: true }
}

/**
 * Validates that a value is a valid object
 */
export function validateObject(value: any, fieldName: string = "Object"): ValidationResult {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return { valid: false, error: `${fieldName} must be an object` }
  }
  
  return { valid: true }
}

/**
 * Validates that a value is one of the allowed values
 */
export function validateEnum<T extends string>(
  value: any,
  allowedValues: readonly T[],
  fieldName: string = "Value"
): ValidationResult {
  if (!allowedValues.includes(value)) {
    return {
      valid: false,
      error: `${fieldName} must be one of: ${allowedValues.join(", ")}`,
    }
  }
  
  return { valid: true }
}

/**
 * Validates that a value is a number within a range
 */
export function validateNumber(
  value: any,
  fieldName: string = "Number",
  min?: number,
  max?: number
): ValidationResult {
  if (typeof value !== "number" || isNaN(value)) {
    return { valid: false, error: `${fieldName} must be a number` }
  }
  
  if (min !== undefined && value < min) {
    return { valid: false, error: `${fieldName} must be at least ${min}` }
  }
  
  if (max !== undefined && value > max) {
    return { valid: false, error: `${fieldName} must be at most ${max}` }
  }
  
  return { valid: true }
}

/**
 * Validates request body structure
 */
export function validateRequestBody(
  body: any,
  requiredFields: string[]
): ValidationResult {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be a valid JSON object" }
  }
  
  for (const field of requiredFields) {
    if (!(field in body) || body[field] === undefined || body[field] === null) {
      return { valid: false, error: `Missing required field: ${field}` }
    }
  }
  
  return { valid: true }
}

/**
 * Sanitizes a string to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .trim()
}

/**
 * Validates and sanitizes contractId
 */
export function validateContractId(contractId: any): ValidationResult {
  const stringResult = validateString(contractId, "contractId", 200)
  if (!stringResult.valid) {
    return stringResult
  }
  
  // Allow alphanumeric, hyphens, underscores, and custom- prefix
  const contractIdRegex = /^[a-zA-Z0-9_-]+$|^custom-[a-zA-Z0-9_-]+$/
  if (!contractIdRegex.test(contractId)) {
    return { valid: false, error: "Invalid contractId format" }
  }
  
  return { valid: true }
}

/**
 * Validates values object structure
 */
export function validateValues(values: any): ValidationResult {
  const objectResult = validateObject(values, "values")
  if (!objectResult.valid) {
    return objectResult
  }
  
  // Check for reasonable number of fields (prevent DoS)
  const keys = Object.keys(values)
  if (keys.length > 100) {
    return { valid: false, error: "Too many fields in values object (max 100)" }
  }
  
  // Validate each value is a string or number
  for (const [key, value] of Object.entries(values)) {
    if (typeof value !== "string" && typeof value !== "number") {
      return {
        valid: false,
        error: `Invalid value type for field "${key}". Must be string or number.`,
      }
    }
    
    // Limit individual value length
    const stringValue = String(value)
    if (stringValue.length > 10000) {
      return {
        valid: false,
        error: `Value for field "${key}" is too long (max 10000 characters)`,
      }
    }
  }
  
  return { valid: true }
}





