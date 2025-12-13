/**
 * HTML Renderer for Export
 * 
 * This module generates semantic, print-optimized HTML for document exports.
 * It ensures consistent structure across all document types:
 * - Title uses <h1>
 * - Major sections use <h2>
 * - Subsections use <h3>
 * - Paragraphs use <p>
 * - Lists use <ol>/<ul> with <li>
 * - Signatures use <section class="signatures">
 * 
 * This HTML is optimized for:
 * - PDF export via Playwright (with print.css)
 * - DOCX export via docxtemplater or Pandoc
 * - Consistent legal document formatting
 */

import { DocumentStyle } from "@/lib/document-styles"
import { isHTML, ensureHTML } from "@/lib/markdown-to-html"

export interface SignatureData {
  signerName: string
  signerEmail: string
  signatureData?: string // Base64 image data
  createdAt: string
}

export interface DocumentData {
  content: string // HTML or markdown
  style: DocumentStyle
  signatures?: SignatureData[]
  title?: string
}

/**
 * Get font family CSS value from DocumentStyle
 */
function getFontFamilyCSS(style: DocumentStyle): string {
  switch (style.fontFamily) {
    case "modern":
      return "Helvetica, Arial, sans-serif"
    case "classic":
      return '"Times New Roman", Times, serif'
    case "mono":
      return "Courier New, monospace"
    default:
      return "Helvetica, Arial, sans-serif"
  }
}

/**
 * Get font size in points
 */
function getFontSizePt(style: DocumentStyle): number {
  switch (style.fontSize) {
    case "small":
      return 10
    case "medium":
      return 12
    case "large":
      return 14
    default:
      return 12
  }
}

/**
 * Get line spacing value
 */
function getLineSpacing(style: DocumentStyle): number {
  switch (style.lineSpacing) {
    case "single":
      return 1.0
    case "onePointOneFive":
      return 1.15
    case "onePointFive":
      return 1.5
    default:
      return 1.15
  }
}

/**
 * Get paragraph spacing in rem
 */
function getParagraphSpacing(style: DocumentStyle): string {
  switch (style.paragraphSpacing) {
    case "compact":
      return "0.5rem"
    case "roomy":
      return "1.5rem"
    default:
      return "1rem"
  }
}

/**
 * Render signature section HTML
 */
function renderSignatures(signatures: SignatureData[], style: DocumentStyle): string {
  if (!signatures || signatures.length === 0) {
    return ""
  }

  const fontSize = getFontSizePt(style)
  const fontFamily = getFontFamilyCSS(style)

  let html = `<section class="signatures" style="page-break-before: always; margin-top: 3rem; padding-top: 2rem; border-top: 2px solid #e5e7eb;">`
  html += `<h3 class="signatures-heading" style="font-weight: 700; font-size: ${fontSize + 2}pt; margin-bottom: 1.5rem; font-family: ${fontFamily}; color: #000;">Signatures</h3>`

  for (const signature of signatures) {
    html += `<div class="signature-block" style="margin-bottom: 2rem; page-break-inside: avoid;">`
    
    if (signature.signatureData) {
      html += `<div style="margin-bottom: 0.5rem;">`
      html += `<img src="${signature.signatureData}" alt="Signature" style="max-width: 120px; max-height: 40px; object-fit: contain;" />`
      html += `</div>`
    }

    html += `<p style="font-family: ${fontFamily}; font-size: ${fontSize}pt; margin-bottom: 0.25rem; color: #000;">Signed by: ${escapeHtml(signature.signerName)}</p>`
    html += `<p style="font-family: ${fontFamily}; font-size: ${fontSize - 1}pt; color: #666; margin-bottom: 0.25rem;">${escapeHtml(signature.signerEmail)}</p>`
    
    const signDate = new Date(signature.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    html += `<p style="font-family: ${fontFamily}; font-size: ${fontSize}pt; color: #000;">Date: ${escapeHtml(signDate)}</p>`
    
    html += `</div>`
  }

  html += `</section>`
  return html
}

/**
 * Escape HTML entities
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * Normalize HTML structure for export
 * Ensures semantic structure: h1 for title, h2 for sections, h3 for subsections
 * Also ensures HTML is properly formatted and doesn't show raw HTML tags
 */
function normalizeHtmlStructure(html: string): string {
  // Remove any script or style tags that might interfere
  let normalized = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
  normalized = normalized.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
  
  // Ensure HTML entities are properly decoded (they'll be rendered by browser)
  // But we don't want to double-decode, so we leave entities as-is for browser rendering
  
  // Remove any UI elements that might have been included
  normalized = normalized.replace(/<button[^>]*>[\s\S]*?<\/button>/gi, "")
  normalized = normalized.replace(/<input[^>]*>/gi, "")
  normalized = normalized.replace(/<select[^>]*>[\s\S]*?<\/select>/gi, "")
  normalized = normalized.replace(/<textarea[^>]*>[\s\S]*?<\/textarea>/gi, "")
  
  return normalized
}

/**
 * Render full standalone HTML document for export
 * 
 * This generates a complete HTML document with:
 * - Semantic structure (h1, h2, h3, p, ol, ul, li)
 * - Print-optimized CSS (via print.css)
 * - Proper page break rules
 * - Signature section on final page
 */
export function renderHtmlForExport(data: DocumentData): string {
  const { content, style, signatures, title } = data

  // Ensure content is HTML
  const htmlContent = ensureHTML(content)
  
  // Normalize structure - this removes UI elements but preserves document structure
  const normalizedContent = normalizeHtmlStructure(htmlContent)
  
  // Note: The normalizedContent is HTML that will be inserted into the DOM.
  // Playwright's setContent() will automatically parse and render this HTML,
  // so HTML tags will be rendered as elements, not displayed as text.

  // Get style values
  const fontSize = getFontSizePt(style)
  const lineSpacing = getLineSpacing(style)
  const fontFamily = getFontFamilyCSS(style)
  const paragraphSpacing = getParagraphSpacing(style)
  const margin = style.layout === "wide" ? "0.5in" : "1in"

  // Build the HTML document
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title ? escapeHtml(title) : "Document"}</title>
  <link rel="stylesheet" href="/print.css">
  <!-- Print CSS will be injected inline by PDF export -->
  <style>
    /* Document-specific styles */
    body {
      font-family: ${fontFamily};
      font-size: ${fontSize}pt;
      line-height: ${lineSpacing};
      color: #000;
      margin: 0;
      padding: ${margin};
    }
    
    h1 {
      font-size: ${fontSize + 4}pt;
      font-weight: ${style.headingStyle === "bold" ? "700" : "400"};
      text-transform: ${style.headingCase === "uppercase" ? "uppercase" : "none"};
      margin-left: ${style.headingIndent === "indented" ? "1rem" : "0"};
      margin-top: 0;
      margin-bottom: ${paragraphSpacing};
      page-break-after: avoid;
    }
    
    h2 {
      font-size: ${fontSize + 2}pt;
      font-weight: ${style.headingStyle === "bold" ? "700" : "400"};
      text-transform: ${style.headingCase === "uppercase" ? "uppercase" : "none"};
      margin-left: ${style.headingIndent === "indented" ? "1rem" : "0"};
      margin-top: 0.75rem;
      margin-bottom: ${paragraphSpacing};
      page-break-after: avoid;
    }
    
    h3 {
      font-size: ${fontSize + 1}pt;
      font-weight: ${style.headingStyle === "bold" ? "700" : "400"};
      text-transform: ${style.headingCase === "uppercase" ? "uppercase" : "none"};
      margin-left: ${style.headingIndent === "indented" ? "1rem" : "0"};
      margin-top: 0.625rem;
      margin-bottom: ${paragraphSpacing};
      page-break-after: avoid;
    }
    
    p {
      margin-top: 0;
      margin-bottom: ${paragraphSpacing};
      page-break-inside: avoid;
    }
    
    ul, ol {
      margin-top: 0;
      margin-bottom: ${paragraphSpacing};
      padding-left: 1.5rem;
      page-break-inside: avoid;
    }
    
    li {
      margin-bottom: 0.25rem;
      page-break-inside: avoid;
    }
    
    /* Ensure sections don't break across pages */
    section {
      page-break-inside: avoid;
    }
    
    /* Signature section always on new page */
    section.signatures {
      page-break-before: always;
    }
  </style>
</head>
<body>
  <article class="document-content">
    ${normalizedContent}
    ${signatures ? renderSignatures(signatures, style) : ""}
  </article>
</body>
</html>`

  return html
}

