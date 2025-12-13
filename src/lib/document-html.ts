/**
 * Document HTML Generator
 * 
 * This utility generates HTML from document content using the same
 * rendering logic as DocumentRenderer. This HTML can be used for:
 * - PDF export (via html2pdf or similar)
 * - Server-side rendering
 * - Email templates
 * 
 * This ensures consistency between preview and exports.
 */

import { DocumentStyle, getFontFamilyName, getFontSizePt, getLineSpacingValue } from "./document-styles"

interface SignatureData {
  signerName: string
  signerEmail: string
  signatureData?: string
  createdAt: string
}

// Clean markdown content
function cleanMarkdown(content: string): string {
  if (!content) return ""
  
  const trimmed = content.trim()
  
  if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
    const lines = trimmed.split("\n")
    if (lines[0].startsWith("```")) {
      lines.shift()
    }
    if (lines[lines.length - 1].trim() === "```") {
      lines.pop()
    }
    return lines.join("\n").trim()
  }
  
  return content
}

// Simple markdown to HTML converter (basic implementation)
// For full markdown support, consider using a library like marked
function markdownToHTML(markdown: string, style: DocumentStyle): string {
  const cleaned = cleanMarkdown(markdown)
  const fontSize = getFontSizePt(style)
  const lineSpacing = getLineSpacingValue(style)
  const fontFamily = getFontFamilyName(style).split(",")[0].trim()
  
  const textColor = "#000000"
  
  // Get paragraph spacing
  const getParagraphSpacing = () => {
    switch (style.paragraphSpacing) {
      case "compact":
        return "0.5rem"
      case "roomy":
        return "1.5rem"
      default:
        return "1rem"
    }
  }

  let html = `<div class="document-renderer" style="font-family: ${fontFamily}; font-size: ${fontSize}pt; line-height: ${lineSpacing}; color: ${textColor};">`
  
  const lines = cleaned.split("\n")
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (!line) {
      html += "<p style='margin-bottom: " + getParagraphSpacing() + ";'></p>"
      continue
    }
    
    // Headings
    if (line.startsWith("# ")) {
      const text = line.substring(2)
      const headingText = style.headingCase === "uppercase" ? text.toUpperCase() : text
      html += `<h1 class="document-heading document-heading-1" style="font-weight: ${style.headingStyle === "bold" ? 700 : 400}; text-transform: ${style.headingCase === "uppercase" ? "uppercase" : "none"}; margin-left: ${style.headingIndent === "indented" ? "1rem" : "0"}; color: ${textColor}; margin-bottom: ${getParagraphSpacing()}; margin-top: 1.5rem; font-size: ${fontSize + 4}pt; font-family: ${fontFamily}; line-height: ${lineSpacing};">${escapeHtml(headingText)}</h1>`
    } else if (line.startsWith("## ")) {
      const text = line.substring(3)
      const headingText = style.headingCase === "uppercase" ? text.toUpperCase() : text
      html += `<h2 class="document-heading document-heading-2" style="font-weight: ${style.headingStyle === "bold" ? 700 : 400}; text-transform: ${style.headingCase === "uppercase" ? "uppercase" : "none"}; margin-left: ${style.headingIndent === "indented" ? "1rem" : "0"}; color: ${textColor}; margin-bottom: ${getParagraphSpacing()}; margin-top: 1.5rem; font-size: ${fontSize + 2}pt; font-family: ${fontFamily}; line-height: ${lineSpacing};">${escapeHtml(headingText)}</h2>`
    } else if (line.startsWith("### ")) {
      const text = line.substring(4)
      const headingText = style.headingCase === "uppercase" ? text.toUpperCase() : text
      html += `<h3 class="document-heading document-heading-3" style="font-weight: ${style.headingStyle === "bold" ? 700 : 400}; text-transform: ${style.headingCase === "uppercase" ? "uppercase" : "none"}; margin-left: ${style.headingIndent === "indented" ? "1rem" : "0"}; color: ${textColor}; margin-bottom: ${getParagraphSpacing()}; margin-top: 1.25rem; font-size: ${fontSize + 1}pt; font-family: ${fontFamily}; line-height: ${lineSpacing};">${escapeHtml(headingText)}</h3>`
    } else if (line.match(/^[-*]\s/)) {
      // List item
      const text = line.substring(2)
      html += `<ul class="document-list document-list-unordered" style="color: ${textColor}; margin-bottom: ${getParagraphSpacing()}; margin-top: 0; padding-left: 1.5rem; font-family: ${fontFamily}; font-size: ${fontSize}pt; line-height: ${lineSpacing};"><li class="document-list-item" style="word-wrap: break-word; overflow-wrap: break-word; font-family: ${fontFamily}; font-size: ${fontSize}pt; line-height: ${lineSpacing}; margin-bottom: 0.25rem;">${processInlineFormatting(text, fontFamily)}</li></ul>`
    } else {
      // Regular paragraph
      html += `<p class="document-paragraph" style="color: ${textColor}; margin-bottom: ${getParagraphSpacing()}; margin-top: 0; font-family: ${fontFamily}; font-size: ${fontSize}pt; line-height: ${lineSpacing};">${processInlineFormatting(line, fontFamily)}</p>`
    }
  }
  
  html += "</div>"
  
  return html
}

// Process inline formatting (bold, italic)
function processInlineFormatting(text: string, fontFamily: string): string {
  // Escape HTML first
  let result = escapeHtml(text)
  
  // Bold (**text** or __text__)
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong class="document-strong" style="font-family: ' + fontFamily + '; font-weight: 700;">$1</strong>')
  result = result.replace(/__(.+?)__/g, '<strong class="document-strong" style="font-family: ' + fontFamily + '; font-weight: 700;">$1</strong>')
  
  // Italic (*text* or _text_)
  result = result.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em class="document-emphasis" style="font-family: ' + fontFamily + '; font-style: italic;">$1</em>')
  result = result.replace(/(?<!_)_([^_]+?)_(?!_)/g, '<em class="document-emphasis" style="font-family: ' + fontFamily + '; font-style: italic;">$1</em>')
  
  return result
}

// Escape HTML
function escapeHtml(text: string): string {
  const div = typeof document !== "undefined" ? document.createElement("div") : null
  if (div) {
    div.textContent = text
    return div.innerHTML
  }
  // Fallback for server-side
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/**
 * Generate HTML from document content and style
 * This HTML matches what DocumentRenderer produces
 */
export function generateDocumentHTML(
  content: string,
  style: DocumentStyle,
  signatures?: SignatureData[]
): string {
  let html = markdownToHTML(content, style)
  
  // Add signatures if provided
  if (signatures && signatures.length > 0) {
    const fontSize = getFontSizePt(style)
    const fontFamily = getFontFamilyName(style).split(",")[0].trim()
    
    html += `<div class="document-signatures" style="margin-top: 3rem; padding-top: 2rem; border-top: 2px solid #e5e7eb; page-break-inside: avoid;">`
    html += `<h3 class="document-heading document-heading-3" style="font-weight: 700; font-size: ${fontSize + 2}pt; margin-bottom: 1.5rem; font-family: ${fontFamily}; color: #000000;">Signatures</h3>`
    
    signatures.forEach((signature) => {
      html += `<div class="document-signature-block" style="margin-bottom: 2rem; page-break-inside: avoid;">`
      
      if (signature.signatureData) {
        html += `<div style="margin-bottom: 0.5rem;"><img src="${signature.signatureData}" alt="Signature" style="max-width: 120px; max-height: 40px; object-fit: contain;" /></div>`
      }
      
      html += `<p class="document-paragraph" style="font-family: ${fontFamily}; font-size: ${fontSize}pt; margin-bottom: 0.25rem; color: #000000;">Signed by: ${escapeHtml(signature.signerName)}</p>`
      html += `<p class="document-paragraph" style="font-family: ${fontFamily}; font-size: ${fontSize - 1}pt; color: #666666; margin-bottom: 0.25rem;">${escapeHtml(signature.signerEmail)}</p>`
      
      const signDate = new Date(signature.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      html += `<p class="document-paragraph" style="font-family: ${fontFamily}; font-size: ${fontSize}pt; color: #000000;">Date: ${escapeHtml(signDate)}</p>`
      
      html += `</div>`
    })
    
    html += `</div>`
  }
  
  return html
}


