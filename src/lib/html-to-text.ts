/**
 * HTML to Plain Text Converter
 * 
 * Converts HTML content to plain text for PDF and DOCX exports.
 * Handles:
 * - HTML entities (&amp;, &quot;, etc.)
 * - Block-level tags (headings, paragraphs, lists)
 * - Inline formatting (bold, italic)
 * - Lists (ordered and unordered)
 * 
 * This utility ensures that HTML content is converted to readable plain text
 * that can be processed by PDF and DOCX export functions.
 */

import { isHTML } from "./markdown-to-html"

/**
 * Converts HTML to plain text by stripping tags and extracting text content
 * 
 * @param html - HTML content to convert
 * @returns Plain text with markdown-like formatting for headings and lists
 */
export function htmlToPlainText(html: string): string {
  if (!html || typeof html !== "string") {
    return ""
  }

  let text = html.trim()

  // Step 1: Replace HTML entities first (comprehensive list)
  const entityReplacements: Array<[RegExp, string]> = [
    [/&nbsp;/g, " "],
    [/&amp;/g, "&"],
    [/&lt;/g, "<"],
    [/&gt;/g, ">"],
    [/&quot;/g, '"'],
    [/&#39;/g, "'"],
    [/&apos;/g, "'"],
    [/&#x27;/g, "'"],
    [/&#x2F;/g, "/"],
    [/&#160;/g, " "], // Non-breaking space (numeric)
    [/&copy;/g, "©"],
    [/&reg;/g, "®"],
    [/&trade;/g, "™"],
    [/&mdash;/g, "—"],
    [/&ndash;/g, "–"],
    [/&hellip;/g, "…"],
    [/&ldquo;/g, '"'],
    [/&rdquo;/g, '"'],
    [/&lsquo;/g, "'"],
    [/&rsquo;/g, "'"],
  ]
  
  for (const [regex, replacement] of entityReplacements) {
    text = text.replace(regex, replacement)
  }

  // Step 2: Process formatting tags (bold, italic) recursively to handle nesting
  // We need to process these first so nested formatting is preserved
  let lastText = ""
  let iterations = 0
  const maxIterations = 10 // Prevent infinite loops
  
  while (text !== lastText && iterations < maxIterations) {
    lastText = text
    iterations++
    
    // Bold and strong (process nested ones first)
    text = text.replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, "**$2**")
    // Italic and emphasis (process nested ones first)
    text = text.replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, "*$2*")
  }

  // Step 3: Process block-level tags with markdown-like formatting
  // Headings (process from h6 to h1 to avoid conflicts with nested tags)
  text = text.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "\n###### $1\n")
  text = text.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "\n##### $1\n")
  text = text.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "\n#### $1\n")
  text = text.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n### $1\n")
  text = text.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n## $1\n")
  text = text.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n# $1\n")

  // Paragraphs
  text = text.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")

  // Divs with content (treat as paragraphs)
  text = text.replace(/<div[^>]*>(.*?)<\/div>/gi, "$1\n")

  // Sections
  text = text.replace(/<section[^>]*>(.*?)<\/section>/gi, "$1\n")
  
  // Articles (common in legal documents)
  text = text.replace(/<article[^>]*>(.*?)<\/article>/gi, "$1\n")
  
  // Blockquotes (convert to indented text)
  text = text.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, "$1\n")
  
  // Preformatted text (code blocks) - preserve line breaks
  text = text.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, "$1\n")
  
  // Code tags (inline code)
  text = text.replace(/<code[^>]*>(.*?)<\/code>/gi, "$1")
  
  // Address tags
  text = text.replace(/<address[^>]*>(.*?)<\/address>/gi, "$1\n")
  
  // HR (horizontal rules) - convert to separator line
  text = text.replace(/<hr[^>]*>/gi, "\n---\n")

  // Line breaks
  text = text.replace(/<br\s*\/?>/gi, "\n")

  // Lists - process list items first, then containers
  // Ordered lists - convert to numbered list format
  text = text.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, content) => {
    const items = content.match(/<li[^>]*>(.*?)<\/li>/gi) || []
    return "\n" + items.map((item: string, index: number) => {
      const text = item.replace(/<li[^>]*>(.*?)<\/li>/gi, "$1")
      return `${index + 1}. ${text.trim()}`
    }).join("\n") + "\n"
  })
  
  // Unordered lists - convert to bullet list format
  text = text.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, content) => {
    const items = content.match(/<li[^>]*>(.*?)<\/li>/gi) || []
    return "\n" + items.map((item: string) => {
      const text = item.replace(/<li[^>]*>(.*?)<\/li>/gi, "$1")
      return `- ${text.trim()}`
    }).join("\n") + "\n"
  })
  
  // Handle standalone list items (if lists weren't captured above)
  text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n")

  // Step 4: Remove all remaining HTML tags and attributes
  // This includes script, style, and any other tags that weren't processed
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "") // Remove script tags and content
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "") // Remove style tags and content
  text = text.replace(/<[^>]+>/g, "") // Remove all remaining HTML tags

  // Step 5: Decode any remaining HTML entities that might have been missed
  // Handle numeric entities (decimal and hex)
  text = text.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(parseInt(dec, 10))
  })
  text = text.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16))
  })
  
  // Handle common named entities
  const entityMap: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
  }
  for (const [entity, char] of Object.entries(entityMap)) {
    text = text.replace(new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), char)
  }

  // Step 6: Clean up extra whitespace and newlines
  text = text.replace(/\n{3,}/g, "\n\n") // Max 2 consecutive newlines
  text = text.replace(/[ \t]+/g, " ") // Multiple spaces to single space
  text = text.replace(/\n /g, "\n") // Remove leading spaces after newlines
  text = text.replace(/ \n/g, "\n") // Remove trailing spaces before newlines
  text = text.trim()

  return text
}

/**
 * Converts content to plain text, handling both HTML and markdown
 * 
 * @param content - HTML or markdown content
 * @returns Plain text suitable for PDF/DOCX export
 */
export function contentToPlainText(content: string): string {
  if (!content || typeof content !== "string") {
    return ""
  }

  // Check if content is HTML
  if (isHTML(content)) {
    return htmlToPlainText(content)
  }

  // Otherwise, return as-is (markdown will be processed by existing parsers)
  return content
}


