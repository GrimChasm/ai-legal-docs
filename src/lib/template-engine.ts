/**
 * Template Engine for Direct Document Generation
 * 
 * This module provides a template-based approach to generating legal documents
 * without requiring AI APIs. Templates are professionally written documents
 * with placeholders that get filled in with user input.
 * 
 * Benefits:
 * - No API keys required
 * - Faster generation (instant)
 * - More reliable and consistent
 * - Lawyer-grade quality (templates are professionally written)
 * - Lower costs
 */

export interface TemplateValues {
  [key: string]: string | number | undefined
}

/**
 * Format a date string for display in documents
 */
export function formatDate(dateString: string): string {
  if (!dateString) return ""
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return dateString
  }
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  if (isNaN(num)) return String(amount)
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num)
}

/**
 * Replace placeholders in a template string with actual values
 */
export function renderTemplate(template: string, values: TemplateValues): string {
  let result = template
  
  // Replace all placeholders like {{fieldName}} or ${fieldName}
  Object.entries(values).forEach(([key, value]) => {
    const stringValue = value !== undefined && value !== null ? String(value) : ""
    
    // Handle {{key}} format
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), stringValue)
    
    // Handle ${key} format
    result = result.replace(new RegExp(`\\$\\{${key}\\}`, "g"), stringValue)
    
    // Handle {{key|format}} format for special formatting
    result = result.replace(
      new RegExp(`\\{\\{${key}\\|date\\}\\}`, "g"),
      formatDate(stringValue)
    )
    result = result.replace(
      new RegExp(`\\{\\{${key}\\|currency\\}\\}`, "g"),
      formatCurrency(stringValue)
    )
  })
  
  // Remove any remaining placeholders (optional - comment out if you want to see them)
  // result = result.replace(/\{\{[^}]+\}\}/g, "[Not Provided]")
  
  return result
}

/**
 * Generate a document directly from a template without AI
 */
export function generateDocumentFromTemplate(
  templateContent: string,
  values: TemplateValues
): string {
  return renderTemplate(templateContent, values)
}

