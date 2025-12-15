/**
 * Markdown to HTML Converter
 * 
 * Converts markdown content to HTML for storage in the database.
 * Uses the 'marked' library for proper markdown parsing.
 */

import { marked } from "marked"

/**
 * Converts markdown content to HTML
 * @param markdown - Markdown content to convert
 * @returns HTML string
 */
export function markdownToHTML(markdown: string | null | undefined): string {
  if (!markdown || typeof markdown !== "string") {
    return ""
  }

  const trimmed = markdown.trim()
  
  if (!trimmed) {
    return ""
  }

  // Clean markdown - remove code fences if entire content is wrapped
  let cleaned = trimmed
  if (cleaned.startsWith("```") && cleaned.endsWith("```")) {
    const lines = cleaned.split("\n")
    if (lines[0].startsWith("```")) {
      lines.shift()
    }
    if (lines[lines.length - 1].trim() === "```") {
      lines.pop()
    }
    cleaned = lines.join("\n").trim()
  }

  // Configure marked options
  marked.setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: false, // Don't convert line breaks to <br>
  })

  // Convert markdown to HTML
  try {
    const html = marked.parse(cleaned) as string
    return html.trim()
  } catch (error) {
    console.error("Error converting markdown to HTML:", error)
    // Fallback: return escaped markdown as plain text
    return cleaned
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }
}

/**
 * Checks if content is already HTML (contains HTML tags)
 * @param content - Content to check
 * @returns true if content appears to be HTML
 */
export function isHTML(content: string): boolean {
  if (!content || typeof content !== "string") {
    return false
  }
  
  // Check for common HTML tags
  const htmlTagPattern = /<\/?[a-z][\s\S]*>/i
  return htmlTagPattern.test(content)
}

/**
 * Converts content to HTML, handling both markdown and HTML input
 * @param content - Markdown or HTML content
 * @returns HTML string
 */
export function ensureHTML(content: string | null | undefined): string {
  if (!content || typeof content !== "string") {
    return ""
  }

  // If it's already HTML, return as-is
  if (isHTML(content)) {
    return content.trim()
  }

  // Otherwise, convert from markdown
  return markdownToHTML(content)
}



