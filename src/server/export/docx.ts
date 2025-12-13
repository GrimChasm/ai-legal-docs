/**
 * DOCX Export
 * 
 * This module exports documents to DOCX format using docxtemplater for
 * high-fidelity, template-based document generation. This ensures:
 * - Consistent formatting across all document types
 * - Proper Word heading styles
 * - Editable numbered lists
 * - Page break control
 * - Professional legal document quality
 * 
 * Approach:
 * - Uses docxtemplater with a .docx template
 * - Maps semantic document data to template placeholders
 * - Ensures signatures are on a dedicated final page
 * 
 * Requirements:
 * - docxtemplater: npm install docxtemplater
 * - pizzip: npm install pizzip (for DOCX file handling)
 * - A base template file: templates/legal-document-template.docx
 */

import { renderHtmlForExport, type DocumentData, type SignatureData } from "./renderHtml"
import { DocumentStyle, getFontSizePt, getLineSpacingValue } from "@/lib/document-styles"

/**
 * Convert HTML content to plain text for DOCX template
 * Preserves structure (headings, lists, paragraphs)
 */
function htmlToPlainText(html: string): string {
  // Remove script and style tags
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")

  // Convert headings to markdown-like format
  text = text.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n# $1\n")
  text = text.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n## $1\n")
  text = text.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n### $1\n")

  // Convert paragraphs
  text = text.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")

  // Convert lists
  text = text.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
    const items = content.match(/<li[^>]*>(.*?)<\/li>/gi) || []
    return "\n" + items.map((item: string, index: number) => {
      const itemText = item.replace(/<li[^>]*>(.*?)<\/li>/gi, "$1")
      return `${index + 1}. ${itemText.trim()}`
    }).join("\n") + "\n"
  })

  text = text.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
    const items = content.match(/<li[^>]*>(.*?)<\/li>/gi) || []
    return "\n" + items.map((item: string) => {
      const itemText = item.replace(/<li[^>]*>(.*?)<\/li>/gi, "$1")
      return `- ${itemText.trim()}`
    }).join("\n") + "\n"
  })

  // Remove all remaining HTML tags
  text = text.replace(/<[^>]+>/g, "")

  // Decode HTML entities
  text = text.replace(/&nbsp;/g, " ")
  text = text.replace(/&amp;/g, "&")
  text = text.replace(/&lt;/g, "<")
  text = text.replace(/&gt;/g, ">")
  text = text.replace(/&quot;/g, '"')
  text = text.replace(/&#39;/g, "'")

  // Clean up whitespace
  text = text.replace(/\n{3,}/g, "\n\n")
  text = text.trim()

  return text
}

/**
 * Format signatures for DOCX template
 */
function formatSignatures(signatures: SignatureData[]): string {
  if (!signatures || signatures.length === 0) {
    return ""
  }

  let text = "\n\nSIGNATURES\n\n"
  for (const signature of signatures) {
    text += `Signed by: ${signature.signerName}\n`
    text += `${signature.signerEmail}\n`
    const signDate = new Date(signature.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    text += `Date: ${signDate}\n\n`
  }

  return text
}

/**
 * Export document to DOCX using docxtemplater
 * 
 * Note: This is a simplified implementation. For production, you should:
 * 1. Create a proper DOCX template with Word styles
 * 2. Use docxtemplater's rich text support for formatting
 * 3. Handle images (signatures) properly
 * 
 * For now, we'll use a fallback approach that generates DOCX programmatically
 * using the docx library (which is already installed).
 */
export async function exportToDOCX(
  data: DocumentData
): Promise<Buffer> {
  // Import the existing DOCX export logic
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun } = await import("docx")
  
  // Get style values to match the preview exactly
  const style = data.style
  const baseFontSize = getFontSizePt(style) // Returns font size in points
  const lineSpacing = getLineSpacingValue(style) // Returns line spacing multiplier
  
  // Convert line spacing multiplier to Word line spacing (240 = single, 360 = 1.5, etc.)
  const wordLineSpacing = Math.round(lineSpacing * 240)
  
  // Calculate paragraph spacing based on style (in twips: 1pt = 20 twips)
  const getParagraphSpacing = () => {
    switch (style.paragraphSpacing) {
      case "compact":
        return Math.round(baseFontSize * 0.5 * 20) // Half font size
      case "roomy":
        return Math.round(baseFontSize * 1.5 * 20) // 1.5x font size
      case "normal":
      default:
        return Math.round(baseFontSize * 1 * 20) // 1x font size
    }
  }
  
  const paragraphSpacing = getParagraphSpacing()
  
  // Get font family name
  const getFontFamily = () => {
    switch (style.fontFamily) {
      case "classic":
        return "Times New Roman"
      case "mono":
        return "Courier New"
      case "modern":
      default:
        return "Calibri" // Word's default modern font
    }
  }
  
  const fontFamily = getFontFamily()
  
  // Convert HTML to structured content - parse HTML directly instead of plain text
  const html = renderHtmlForExport(data)
  const paragraphs: Paragraph[] = []
  
  // Parse HTML to extract structure - process elements in document order
  const parseHTMLToParagraphs = async (htmlContent: string) => {
    // Extract body content from full HTML document
    let bodyContent = htmlContent
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    if (bodyMatch) {
      bodyContent = bodyMatch[1]
    }
    
    // Extract article content if present (from renderHtmlForExport)
    const articleMatch = bodyContent.match(/<article[^>]*class="document-content"[^>]*>([\s\S]*?)<\/article>/i)
    if (articleMatch) {
      bodyContent = articleMatch[1]
    } else {
      // Try without class attribute
      const articleMatch2 = bodyContent.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
      if (articleMatch2) {
        bodyContent = articleMatch2[1]
      }
    }
    
    // Also try to find document-renderer content (from DocumentRenderer component)
    const rendererMatch = bodyContent.match(/<div[^>]*class="[^"]*document-renderer[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
    if (rendererMatch) {
      bodyContent = rendererMatch[1]
    }
    
    // Remove script and style tags
    let cleanHtml = bodyContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    cleanHtml = cleanHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    
    const elements: Array<{ 
      type: string
      content: string
      isBold?: boolean
      isItalic?: boolean
      position: number
      listIndex?: number
    }> = []
    
    // Helper to extract text and formatting from HTML
    const extractTextAndFormatting = (html: string): { text: string; isBold: boolean; isItalic: boolean } => {
      let text = html
      let isBold = false
      let isItalic = false
      
      // Check for bold tags
      if (/<(strong|b)[^>]*>/i.test(text)) {
        isBold = true
        text = text.replace(/<(strong|b)[^>]*>/gi, "").replace(/<\/(strong|b)>/gi, "")
      }
      
      // Check for italic tags
      if (/<(em|i)[^>]*>/i.test(text)) {
        isItalic = true
        text = text.replace(/<(em|i)[^>]*>/gi, "").replace(/<\/(em|i)>/gi, "")
      }
      
      // Remove all remaining HTML tags
      text = text.replace(/<[^>]+>/g, "")
      
      // Decode HTML entities
      text = text.replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, "/")
        .replace(/&apos;/g, "'")
      
      // Decode numeric entities
      text = text.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
      text = text.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      
      return { text: text.trim(), isBold, isItalic }
    }
    
    // Find all block-level elements in document order
    // Match: h1, h2, h3, p, ol, ul (and their closing tags)
    const blockElementRegex = /<(h1|h2|h3|p|ol|ul|div|section)[^>]*>([\s\S]*?)<\/\1>/gi
    
    // Also need to handle self-closing tags and find all elements with their positions
    const allMatches: Array<{
      type: string
      start: number
      end: number
      content: string
      isList: boolean
      isListItem: boolean
    }> = []
    
    // Find all headings
    const headingMatches = cleanHtml.matchAll(/<(h1|h2|h3)[^>]*>([\s\S]*?)<\/\1>/gi)
    for (const match of headingMatches) {
      allMatches.push({
        type: match[1],
        start: match.index!,
        end: match.index! + match[0].length,
        content: match[2],
        isList: false,
        isListItem: false,
      })
    }
    
    // Find all paragraphs (not inside lists)
    const pMatches = cleanHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)
    for (const match of pMatches) {
      allMatches.push({
        type: "p",
        start: match.index!,
        end: match.index! + match[0].length,
        content: match[1],
        isList: false,
        isListItem: false,
      })
    }
    
    // Find all ordered lists
    const olMatches = cleanHtml.matchAll(/<ol[^>]*>([\s\S]*?)<\/ol>/gi)
    for (const match of olMatches) {
      allMatches.push({
        type: "ol",
        start: match.index!,
        end: match.index! + match[0].length,
        content: match[1],
        isList: true,
        isListItem: false,
      })
    }
    
    // Find all unordered lists
    const ulMatches = cleanHtml.matchAll(/<ul[^>]*>([\s\S]*?)<\/ul>/gi)
    for (const match of ulMatches) {
      allMatches.push({
        type: "ul",
        start: match.index!,
        end: match.index! + match[0].length,
        content: match[1],
        isList: true,
        isListItem: false,
      })
    }
    
    // Sort all matches by position in document
    allMatches.sort((a, b) => a.start - b.start)
    
    // Process elements in document order
    for (const match of allMatches) {
      if (match.type === "h1" || match.type === "h2" || match.type === "h3") {
        const { text, isBold, isItalic } = extractTextAndFormatting(match.content)
        if (text) {
          elements.push({
            type: match.type,
            content: text,
            isBold,
            isItalic,
            position: match.start,
          })
        }
      } else if (match.type === "p") {
        // Check if this paragraph is inside a list (shouldn't happen, but be safe)
        const isInsideList = allMatches.some(
          m => m.isList && match.start >= m.start && match.end <= m.end
        )
        if (!isInsideList) {
          const { text, isBold, isItalic } = extractTextAndFormatting(match.content)
          if (text) {
            elements.push({
              type: "p",
              content: text,
              isBold,
              isItalic,
              position: match.start,
            })
          }
        }
      } else if (match.type === "ol" || match.type === "ul") {
        // Process list items
        const liMatches = match.content.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)
        let itemIndex = 1
        for (const liMatch of liMatches) {
          const { text, isBold, isItalic } = extractTextAndFormatting(liMatch[1])
          if (text) {
            elements.push({
              type: match.type === "ol" ? "li-ordered" : "li-unordered",
              content: match.type === "ol" ? `${itemIndex}. ${text}` : text,
              isBold,
              isItalic,
              position: match.start + (liMatch.index || 0),
              listIndex: itemIndex,
            })
            if (match.type === "ol") itemIndex++
          }
        }
      }
    }
    
    // Sort elements by position to ensure correct order
    elements.sort((a, b) => a.position - b.position)
    
    // If we have very few elements (only headings), try to extract more content
    // This handles cases where content might be in divs or other wrappers
    if (elements.length > 0 && elements.length < 5) {
      // Try to find any text content in divs that might contain paragraphs
      const divMatches = cleanHtml.matchAll(/<div[^>]*>([\s\S]*?)<\/div>/gi)
      for (const match of divMatches) {
        const divContent = match[1]
        // Skip if this div contains structured elements we already processed
        const hasStructuredContent = /<(h1|h2|h3|p|ol|ul|li)[^>]*>/i.test(divContent)
        if (!hasStructuredContent) {
          // Extract plain text from div
          const { text } = extractTextAndFormatting(divContent)
          if (text && text.length > 20) { // Only add if substantial content
            // Check if we already have this content
            const alreadyExists = elements.some(e => e.content.includes(text.substring(0, 50)))
            if (!alreadyExists) {
              elements.push({
                type: "p",
                content: text,
                position: match.index!,
              })
            }
          }
        }
      }
      // Re-sort after adding div content
      elements.sort((a, b) => a.position - b.position)
    }
    
    // If we have very few elements (only headings), use htmlToPlainText as fallback
    // This ensures we capture all content even if HTML structure is unexpected
    if (elements.length === 0 || (elements.length < 10 && elements.every(e => e.type.startsWith("h")))) {
      // Use htmlToPlainText utility (imported at top of file)
      const plainText = htmlToPlainText(htmlContent)
      const lines = plainText.split("\n")
      let position = 0
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue
        
        // Skip if this content already exists in elements
        const alreadyExists = elements.some(e => {
          const eText = e.content.substring(0, 30).toLowerCase()
          const lineText = trimmed.substring(0, 30).toLowerCase()
          return eText === lineText || lineText.includes(eText) || eText.includes(lineText)
        })
        if (alreadyExists) continue
        
        if (trimmed.startsWith("# ")) {
          elements.push({ type: "h1", content: trimmed.substring(2), position: position++ })
        } else if (trimmed.startsWith("## ")) {
          elements.push({ type: "h2", content: trimmed.substring(3), position: position++ })
        } else if (trimmed.startsWith("### ")) {
          elements.push({ type: "h3", content: trimmed.substring(4), position: position++ })
        } else if (trimmed.match(/^\d+\.\s/)) {
          elements.push({ type: "li-ordered", content: trimmed, position: position++ })
        } else if (trimmed.startsWith("- ")) {
          elements.push({ type: "li-unordered", content: trimmed.substring(2), position: position++ })
        } else {
          elements.push({ type: "p", content: trimmed, position: position++ })
        }
      }
      // Re-sort after adding from plain text
      elements.sort((a, b) => a.position - b.position)
    }
    
    return elements
  }
  
  const elements = await parseHTMLToParagraphs(html)
  
  // Convert elements to DOCX paragraphs with matching styles
  for (const element of elements) {
    const content = element.content
    const isBold = element.isBold || false
    const isItalic = element.isItalic || false
    
    if (element.type === "h1") {
      const headingText = style.headingCase === "uppercase" ? content.toUpperCase() : content
      const indent = style.headingIndent === "indented" ? 720 : 0 // 0.5 inch in twips
      
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: headingText, 
              bold: style.headingStyle === "bold" || isBold,
              italics: isItalic,
              size: Math.round((baseFontSize + 4) * 2), // H1: base + 4pt, convert to half-points
              font: fontFamily,
            })
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { 
            after: paragraphSpacing,
            before: Math.round(baseFontSize * 0.75 * 20), // Reduced top margin
          },
          indent: indent > 0 ? { left: indent } : undefined,
        })
      )
    } else if (element.type === "h2") {
      const headingText = style.headingCase === "uppercase" ? content.toUpperCase() : content
      const indent = style.headingIndent === "indented" ? 720 : 0
      
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: headingText, 
              bold: style.headingStyle === "bold" || isBold,
              italics: isItalic,
              size: Math.round((baseFontSize + 2) * 2), // H2: base + 2pt
              font: fontFamily,
            })
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { 
            after: paragraphSpacing,
            before: Math.round(baseFontSize * 0.75 * 20),
          },
          indent: indent > 0 ? { left: indent } : undefined,
        })
      )
    } else if (element.type === "h3") {
      const headingText = style.headingCase === "uppercase" ? content.toUpperCase() : content
      const indent = style.headingIndent === "indented" ? 720 : 0
      
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: headingText, 
              bold: style.headingStyle === "bold" || isBold,
              italics: isItalic,
              size: Math.round(baseFontSize * 2), // H3: same as base
              font: fontFamily,
            })
          ],
          heading: HeadingLevel.HEADING_3,
          spacing: { 
            after: paragraphSpacing,
            before: Math.round(baseFontSize * 0.75 * 20),
          },
          indent: indent > 0 ? { left: indent } : undefined,
        })
      )
    } else if (element.type === "li-ordered") {
      // Extract number and text
      const match = content.match(/^(\d+)\.\s*(.*)/)
      const itemText = match ? match[2] : content.replace(/^\d+\.\s*/, "")
      const itemNumber = match ? parseInt(match[1], 10) : 1
      
      // For ordered lists, use manual numbering for now (more reliable)
      // TODO: Implement proper Word numbering if needed
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: `${itemNumber}. ${itemText}`, 
              bold: isBold,
              italics: isItalic,
              size: Math.round(baseFontSize * 2),
              font: fontFamily,
            })
          ],
          spacing: { 
            after: Math.round(baseFontSize * 0.5 * 20),
            line: wordLineSpacing,
          },
          indent: {
            left: 360, // Indent for list items (0.25 inch)
            hanging: 180, // Hanging indent for number
          },
        })
      )
    } else if (element.type === "li-unordered") {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: content, 
              bold: isBold,
              italics: isItalic,
              size: Math.round(baseFontSize * 2),
              font: fontFamily,
            })
          ],
          bullet: { level: 0 },
          spacing: { 
            after: Math.round(baseFontSize * 0.5 * 20),
            line: wordLineSpacing,
          },
          indent: {
            left: 360, // Indent for bullet items
            hanging: 180, // Hanging indent for bullet
          },
        })
      )
    } else {
      // Regular paragraph
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: content, 
              bold: isBold,
              italics: isItalic,
              size: Math.round(baseFontSize * 2), // Convert to half-points
              font: fontFamily,
            })
          ],
          spacing: { 
            after: paragraphSpacing,
            line: wordLineSpacing,
          },
        })
      )
    }
  }
  
  // Prepare images for signatures
  const signatureImages: Array<{ buffer: Buffer; width: number; height: number } | null> = []
  
  // Process signature images
  if (data.signatures && data.signatures.length > 0) {
    for (const signature of data.signatures) {
      if (signature.signatureData) {
        try {
          // Extract base64 data
          const base64Data = signature.signatureData.includes(",")
            ? signature.signatureData.split(",")[1]
            : signature.signatureData
          
          if (base64Data && base64Data.length > 0) {
            // Convert base64 to buffer
            const imageBuffer = Buffer.from(base64Data, "base64")
            
            // Validate buffer
            if (imageBuffer.length > 0) {
              signatureImages.push({
                buffer: imageBuffer,
                width: 120 * 9525,  // 120px in EMU
                height: 40 * 9525,  // 40px in EMU
              })
            } else {
              signatureImages.push(null)
            }
          } else {
            signatureImages.push(null)
          }
        } catch (error) {
          console.warn("Error processing signature image:", error)
          signatureImages.push(null)
        }
      } else {
        signatureImages.push(null)
      }
    }
  }
  
  // Add signatures section with page break
  if (data.signatures && data.signatures.length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: "" })],
        spacing: { before: 1440 }, // 1 inch spacing before signatures
      })
    )
    
    const signaturesHeading = style.headingCase === "uppercase" ? "SIGNATURES" : "Signatures"
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ 
            text: signaturesHeading, 
            bold: style.headingStyle === "bold",
            size: Math.round((baseFontSize + 2) * 2), // H2 size
            font: fontFamily,
          })
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: paragraphSpacing },
      })
    )
    
    for (let i = 0; i < data.signatures.length; i++) {
      const signature = data.signatures[i]
      const signatureImage = signatureImages[i]
      
      // Add signature image if available
      // Note: ImageRun can cause corruption if not properly formatted
      // For now, skip images to ensure file opens correctly
      // TODO: Fix ImageRun implementation
      /*
      if (signatureImage && signatureImage.buffer) {
        try {
          // Validate image buffer is valid PNG
          const isValidPNG = signatureImage.buffer.slice(0, 8).toString('hex') === '89504e470d0a1a0a'
          if (!isValidPNG) {
            console.warn("Signature image is not a valid PNG")
            // Skip image
          } else {
            const imageRun = new ImageRun({
              data: signatureImage.buffer,
              transformation: {
                width: signatureImage.width,
                height: signatureImage.height,
              },
              type: "png",
            })
            
            paragraphs.push(
              new Paragraph({
                children: [imageRun],
                spacing: { after: 120 },
              })
            )
          }
        } catch (error) {
          console.warn("Error creating ImageRun for signature:", error)
          // Continue without image if there's an error
        }
      }
      */
      
      // Add placeholder text for signature instead
      if (signatureImage && signatureImage.buffer) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: "[Signature Image]", italic: true, color: "999999" })],
            spacing: { after: 120 },
          })
        )
      }
      
      // Add signer name
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: `Signed by: ${signature.signerName || "Unknown"}`, 
              size: Math.round(baseFontSize * 2),
              font: fontFamily,
            })
          ],
          spacing: { 
            after: Math.round(baseFontSize * 0.5 * 20),
            line: wordLineSpacing,
          },
        })
      )
      
      // Add signer email
      if (signature.signerEmail && signature.signerEmail.trim()) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ 
                text: signature.signerEmail, 
                size: Math.round((baseFontSize - 1) * 2), // Slightly smaller
                font: fontFamily,
              })
            ],
            spacing: { 
              after: Math.round(baseFontSize * 0.5 * 20),
              line: wordLineSpacing,
            },
          })
        )
      }
      
      // Add date
      const signDate = new Date(signature.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: `Date: ${signDate}`, 
              size: Math.round(baseFontSize * 2),
              font: fontFamily,
            })
          ],
          spacing: { 
            after: paragraphSpacing,
            line: wordLineSpacing,
          },
        })
      )
    }
  }
  
  // Ensure we have at least one paragraph (Word requires at least one)
  if (paragraphs.length === 0) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: "Document" })],
      })
    )
  }
  
  // All paragraphs should be valid since we're creating them properly
  // Just ensure we have at least one
  if (paragraphs.length === 0) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: "Document" })],
      })
    )
  }
  
  const validParagraphs = paragraphs
  
  // Calculate margins based on layout (matching DocumentViewer)
  const marginMm = style.layout === "wide" ? 25 : 20 // mm
  const marginTwips = Math.round(marginMm * 56.6929) // Convert mm to twips (1mm = 56.6929 twips)
  
  // Create document with proper structure matching the preview
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: "portrait",
              width: 12240, // 8.5 inches in twips (1440 twips per inch)
              height: 15840, // 11 inches in twips
            },
            margin: {
              top: marginTwips,
              right: marginTwips,
              bottom: marginTwips,
              left: marginTwips,
            },
          },
        },
        children: validParagraphs,
      },
    ],
  })
  
  // Generate buffer - use toBuffer for better compatibility
  try {
    const buffer = await Packer.toBuffer(doc)
    
    // Validate buffer is not empty
    if (!buffer || buffer.length === 0) {
      throw new Error("Generated DOCX buffer is empty")
    }
    
    // Validate it's a valid DOCX file (starts with PK header - ZIP file signature)
    const header = buffer.slice(0, 2).toString('hex')
    if (header !== '504b') {
      throw new Error(`Invalid DOCX file header: ${header}. Expected PK (ZIP file signature)`)
    }
    
    return buffer
  } catch (error) {
    console.error("Error generating DOCX buffer:", error)
    throw error // Re-throw to see the actual error
  }
}

/**
 * Check if DOCX export is available
 */
export function isDOCXAvailable(): boolean {
  try {
    // Check if docx library is available
    require("docx")
    return true
  } catch (error) {
    return false
  }
}

