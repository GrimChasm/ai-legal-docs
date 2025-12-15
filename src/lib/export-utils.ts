/**
 * Export Utilities
 * 
 * IMPORTANT: This file exports documents to PDF and DOCX formats.
 * 
 * SINGLE SOURCE OF TRUTH:
 * - The canonical document rendering is in DocumentRenderer component (src/components/document-renderer.tsx)
 * - This file uses the SAME styling calculations (getFontSizePt, getLineSpacingValue, etc.)
 * - The exported files should match what users see in the preview
 * 
 * STYLING CONSISTENCY:
 * - All font sizes, spacing, and margins use the same DocumentStyle calculations
 * - PDF and DOCX exports apply the same styles as DocumentRenderer
 * - Page dimensions (A4) match the preview
 * 
 * HOW IT WORKS:
 * 1. DocumentRenderer renders the preview (React component)
 * 2. PDF export uses jsPDF with the same style calculations
 * 3. DOCX export uses docx library with the same style calculations
 * 4. All three use the same DocumentStyle interface and helper functions
 */

import jsPDF from "jspdf"
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } from "docx"
import { saveAs } from "file-saver"
import { DocumentStyle, getFontFamilyName, getFontSizePt, getLineSpacingValue, defaultStyle } from "./document-styles"
import { isHTML } from "./markdown-to-html"
import { htmlToPlainText, contentToPlainText } from "./html-to-text"

/**
 * Clean markdown content - removes code fences if entire content is wrapped
 * Also handles HTML content by converting it to plain text
 */
export function cleanMarkdown(content: string): string {
  if (!content) return ""
  
  // If content is HTML, convert it to plain text first
  if (isHTML(content)) {
    return htmlToPlainText(content)
  }
  
  const trimmed = content.trim()
  
  // If the entire content is wrapped in code fences, remove them
  if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
    const lines = trimmed.split("\n")
    // Remove first line (```language or ```)
    if (lines[0].startsWith("```")) {
      lines.shift()
    }
    // Remove last line (```)
    if (lines[lines.length - 1].trim() === "```") {
      lines.pop()
    }
    return lines.join("\n").trim()
  }
  
  return content
}

/**
 * Parse inline markdown formatting (bold, italic) into TextRun array
 */
function parseInlineFormatting(text: string, style?: DocumentStyle): TextRun[] {
  const runs: TextRun[] = []
  
  if (!text) {
    return [new TextRun({ text: "" })]
  }

  // Match bold (**text** or __text__)
  const boldRegex = /\*\*(.+?)\*\*|__(.+?)__/g
  // Match italic (*text* or _text_)
  const italicRegex = /(?<!\*)\*([^*]+?)\*(?!\*)|(?<!_)_([^_]+?)_(?!_)/g

  // Collect all matches with their positions
  const matches: Array<{ start: number; end: number; text: string; bold?: boolean; italic?: boolean }> = []

  let match
  while ((match = boldRegex.exec(text)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[1] || match[2],
      bold: true,
    })
  }

  // Reset regex
  boldRegex.lastIndex = 0
  while ((match = italicRegex.exec(text)) !== null) {
    const start = match.index
    const end = start + match[0].length
    // Check if this is already part of a bold match
    const isInBold = matches.some((m) => start >= m.start && end <= m.end)
    if (!isInBold) {
      matches.push({
        start,
        end,
        text: match[1] || match[2],
        italic: true,
      })
    }
  }

  // Sort matches by position
  matches.sort((a, b) => a.start - b.start)

  // Build TextRun array
  let currentPos = 0
  const fontSize = style ? getFontSizePt(style) : 12
  const fontFamily = style ? getFontFamilyName(style).split(",")[0].trim() : "Arial"
  
  for (const match of matches) {
    // Add text before match
    if (match.start > currentPos) {
      const beforeText = text.substring(currentPos, match.start)
      if (beforeText) {
        runs.push(new TextRun({ 
          text: beforeText,
          size: fontSize * 2, // Size is in half-points
          font: fontFamily,
        }))
      }
    }
    // Add matched text with formatting
    runs.push(new TextRun({ 
      text: match.text, 
      bold: match.bold, 
      italics: match.italic,
      size: fontSize * 2,
      font: fontFamily,
    }))
    currentPos = match.end
  }

  // Add remaining text
  if (currentPos < text.length) {
    const remainingText = text.substring(currentPos)
    if (remainingText) {
      runs.push(new TextRun({ 
        text: remainingText,
        size: fontSize * 2,
        font: fontFamily,
      }))
    }
  }

  // If no formatting found, return single run
  if (runs.length === 0) {
    runs.push(new TextRun({ 
      text,
      size: fontSize * 2,
      font: fontFamily,
    }))
  }

  return runs
}

/**
 * Parse markdown into structured elements for better export
 */
interface MarkdownElement {
  type: "heading" | "paragraph" | "list" | "listItem" | "table" | "code" | "empty"
  level?: number // For headings and list items
  content: string
  children?: MarkdownElement[]
  isBold?: boolean
  isItalic?: boolean
}

function parseMarkdownStructure(markdown: string): MarkdownElement[] {
  const cleaned = cleanMarkdown(markdown)
  const lines = cleaned.split("\n")
  const elements: MarkdownElement[] = []
  let inList = false
  let listItems: MarkdownElement[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (!line) {
      // If we were in a list, close it
      if (inList && listItems.length > 0) {
        elements.push({
          type: "list",
          content: "",
          children: listItems,
        })
        listItems = []
        inList = false
      }
      elements.push({ type: "empty", content: "" })
      continue
    }

    // Headings
    if (line.startsWith("# ")) {
      if (inList) {
        elements.push({
          type: "list",
          content: "",
          children: listItems,
        })
        listItems = []
        inList = false
      }
      elements.push({
        type: "heading",
        level: 1,
        content: line.substring(2).trim(),
      })
    } else if (line.startsWith("## ")) {
      if (inList) {
        elements.push({
          type: "list",
          content: "",
          children: listItems,
        })
        listItems = []
        inList = false
      }
      elements.push({
        type: "heading",
        level: 2,
        content: line.substring(3).trim(),
      })
    } else if (line.startsWith("### ")) {
      if (inList) {
        elements.push({
          type: "list",
          content: "",
          children: listItems,
        })
        listItems = []
        inList = false
      }
      elements.push({
        type: "heading",
        level: 3,
        content: line.substring(4).trim(),
      })
    } else if (line.match(/^[-*]\s/) || line.match(/^\d+\.\s/)) {
      // List items
      if (!inList) {
        inList = true
      }
      const content = line.replace(/^[-*]\s/, "").replace(/^\d+\.\s/, "").trim()
      listItems.push({
        type: "listItem",
        content,
        level: 0,
      })
    } else {
      // Regular paragraph
      if (inList) {
        elements.push({
          type: "list",
          content: "",
          children: listItems,
        })
        listItems = []
        inList = false
      }
      elements.push({
        type: "paragraph",
        content: line,
      })
    }
  }

  // Close any remaining list
  if (inList && listItems.length > 0) {
    elements.push({
      type: "list",
      content: "",
      children: listItems,
    })
  }

  return elements
}

/**
 * Parse markdown into paragraphs for DOCX with document styling
 */
function parseMarkdownToParagraphs(markdown: string, style?: DocumentStyle): Paragraph[] {
  const elements = parseMarkdownStructure(markdown)
  const paragraphs: Paragraph[] = []
  const fontSize = style ? getFontSizePt(style) : 12
  const fontFamily = style ? getFontFamilyName(style).split(",")[0].trim() : "Arial"
  const lineSpacing = style ? getLineSpacingValue(style) : 1.15

  // Calculate spacing in twips (1 twip = 1/20 of a point) - aggressively minimal
  const getSpacing = (): number => {
    if (!style) return 5 // Aggressively minimal: 0.25pt
    switch (style.paragraphSpacing) {
      case "compact":
        return 2 // Extremely minimal: 0.1pt
      case "roomy":
        return 10 // Still minimal: 0.5pt
      default:
        return 5 // Aggressively minimal: 0.25pt
    }
  }
  
  // Get heading bottom spacing - aggressively minimal
  const getHeadingBottomSpacing = (): number => {
    return 5 // Aggressively minimal: 0.25pt after heading
  }
  
  // Track first element for tight spacing
  let isFirstContentElement = true

  for (const element of elements) {
    if (element.type === "empty") {
      paragraphs.push(new Paragraph({ text: "" }))
      continue
    }

    if (element.type === "heading") {
      let headingText = element.content
      if (style?.headingCase === "uppercase") {
        headingText = headingText.toUpperCase()
      }

      const textRuns = parseInlineFormatting(headingText, style)
      const headingSize = fontSize + (4 - (element.level || 1))
      
      // Apply heading style - create new TextRun objects with updated properties
      const styledRuns = textRuns.map(run => {
        const runOptions: any = {
          text: run.options.text || "",
          size: headingSize * 2,
          font: run.options.font,
        }
        
        // Preserve existing bold/italic formatting, or apply heading style
        if (run.options.bold || style?.headingStyle === "bold") {
          runOptions.bold = true
        }
        if (run.options.italics) {
          runOptions.italics = true
        }
        
        return new TextRun(runOptions)
      })

      const indent = style?.headingIndent === "indented" ? 720 : 0 // 0.5 inch = 720 twips
      
      // First heading has no top margin, others have aggressively minimal spacing
      const topSpacing = isFirstContentElement ? 0 : 5 // Aggressively minimal: 0.25pt between sections
      isFirstContentElement = false

      paragraphs.push(
        new Paragraph({
          children: styledRuns,
          heading: element.level === 1 
            ? HeadingLevel.HEADING_1 
            : element.level === 2 
            ? HeadingLevel.HEADING_2 
            : HeadingLevel.HEADING_3,
          spacing: {
            before: topSpacing,
            after: getHeadingBottomSpacing(), // Aggressively minimal spacing after heading
          },
          indent: {
            left: indent,
          },
        })
      )
    } else if (element.type === "list" && element.children) {
      // Mark that we've seen content
      if (isFirstContentElement) {
        isFirstContentElement = false
      }
      
      for (const item of element.children) {
        const textRuns = parseInlineFormatting(item.content, style)
        paragraphs.push(
          new Paragraph({
            children: textRuns,
            bullet: { level: item.level || 0 },
            spacing: {
              after: getSpacing(), // Use tight spacing
            },
          })
        )
      }
    } else if (element.type === "paragraph") {
      // Mark that we've seen content
      if (isFirstContentElement) {
        isFirstContentElement = false
      }
      
      const textRuns = parseInlineFormatting(element.content, style)
      paragraphs.push(
        new Paragraph({
          children: textRuns,
          spacing: {
            after: getSpacing(),
            line: Math.round(lineSpacing * 240), // Convert to twips
            lineRule: "auto",
          },
        })
      )
    }
  }

  return paragraphs
}

/**
 * Signature data structure for exports
 */
export interface SignatureData {
  id: string
  signerName: string
  signerEmail: string
  signatureData: string // Base64 image data
  createdAt: string
  position?: "bottom" | "custom" // Position preference
  customY?: number // Custom Y position (in points)
}

/**
 * Export markdown content as PDF with document styling and signatures
 * 
 * IMPORTANT: This function ensures all exports are in plain language by:
 * 1. Converting HTML to plain text (markdown-like format)
 * 2. Cleaning markdown (removing code fences if present)
 * 3. Parsing and rendering as plain text with consistent formatting
 * 
 * This ensures PDF exports are always in plain language, not HTML tags.
 */
export async function exportToPDF(
  content: string,
  filename: string = "document.pdf",
  style?: DocumentStyle,
  signatures?: SignatureData[]
) {
  try {
    // Convert HTML to plain text for consistent plain language export
    // This ensures all document types export in plain language, not HTML
    const processedContent = contentToPlainText(content)
    const cleaned = cleanMarkdown(processedContent)
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    
    // Apply layout margins (matching preview)
    const margin = style?.layout === "wide" ? 25 : 20
    const maxWidth = pageWidth - margin * 2
    let yPosition = margin

    // Apply font settings
    const fontSize = style ? getFontSizePt(style) : 12
    const lineSpacing = style ? getLineSpacingValue(style) * fontSize : fontSize * 1.15
    
    // Helper function to get paragraph spacing in points - aggressively minimal
    const getParagraphSpacingPt = () => {
      if (!style) return 0.25 // Aggressively minimal: 0.25pt
      switch (style.paragraphSpacing) {
        case "compact":
          return 0.1 // Extremely minimal: 0.1pt
        case "roomy":
          return 0.5 // Still minimal: 0.5pt
        default:
          return 0.25 // Aggressively minimal: 0.25pt
      }
    }
    
    // Helper function to get heading bottom spacing - aggressively minimal
    const getHeadingBottomSpacingPt = () => {
      return 0.25 // Aggressively minimal: 0.25pt after heading
    }
    
    // Helper function to get heading top margin - aggressively minimal
    let isFirstContentElement = true
    const getHeadingTopMarginPt = (level: number, isFirst: boolean) => {
      if (isFirst) {
        return 0 // First heading has no top margin
      }
      // Aggressively minimal spacing between sections
      return 0.25 // 0.25pt between section headings
    }
    
    // Set font (matching preview fonts)
    if (style) {
      switch (style.fontFamily) {
        case "modern":
          doc.setFont("helvetica")
          break
        case "classic":
          doc.setFont("times")
          break
        case "mono":
          doc.setFont("courier")
          break
      }
    } else {
      doc.setFont("helvetica")
    }

    doc.setFontSize(fontSize)
    // Use black text for PDF (matching DocumentRenderer with forExport=true)
    doc.setTextColor(0, 0, 0)

    // Parse markdown structure
    const elements = parseMarkdownStructure(cleaned)

    for (const element of elements) {
      // Check if we need a new page
      if (yPosition > pageHeight - margin - 20) {
        doc.addPage()
        yPosition = margin
        // Reset first element flag on new page
        isFirstContentElement = true
      }

      if (element.type === "empty") {
        yPosition += lineSpacing * 0.01 // Aggressively minimal: almost no spacing for empty lines
        continue
      }

      if (element.type === "heading") {
        let headingText = element.content
        if (style?.headingCase === "uppercase") {
          headingText = headingText.toUpperCase()
        }

        // Add top margin before heading (matching preview: reduced spacing)
        const headingLevel = element.level || 1
        const isFirst = isFirstContentElement
        isFirstContentElement = false
        const topMargin = getHeadingTopMarginPt(headingLevel, isFirst)
        yPosition += topMargin

        // Apply heading styles
        const headingSize = fontSize + (4 - (headingLevel || 1))
        doc.setFontSize(headingSize)
        
        if (style?.headingStyle === "bold") {
          doc.setFont(style.fontFamily === "modern" ? "helvetica" : style.fontFamily === "classic" ? "times" : "courier", "bold")
        }

        // Apply heading indent
        const xPosition = style?.headingIndent === "indented" ? margin + 10 : margin
        
        // Render heading text (jsPDF handles basic text, formatting is limited)
        const headingLines = doc.splitTextToSize(headingText, maxWidth)
        doc.text(headingLines, xPosition, yPosition, { maxWidth })
        
        // Move yPosition down by the height of the heading text
        const headingLineSpacingValue = style ? getLineSpacingValue(style) : 1.15
        const headingLineSpacing = headingLineSpacingValue * headingSize
        yPosition += headingLines.length * headingLineSpacing * 0.7 // Aggressively reduced line spacing for headings

        // Reset font
        doc.setFontSize(fontSize)
        doc.setFont(style?.fontFamily === "modern" ? "helvetica" : style?.fontFamily === "classic" ? "times" : "courier", "normal")

        // Apply aggressively minimal spacing after heading
        const headingBottomSpacing = getHeadingBottomSpacingPt()
        yPosition += headingBottomSpacing
      } else if (element.type === "list" && element.children) {
        // Mark that we've seen content (for first element tracking)
        if (isFirstContentElement) {
          isFirstContentElement = false
        }
        
        for (const item of element.children) {
          if (yPosition > pageHeight - margin - 20) {
            doc.addPage()
            yPosition = margin
            // Reset first element flag on new page
            isFirstContentElement = true
          }

          // Render list item with bullet
          const listText = "• " + item.content
          const listLines = doc.splitTextToSize(listText, maxWidth)
          doc.text(listLines, margin, yPosition, { maxWidth })
          yPosition += listLines.length * lineSpacing * 0.7 // Aggressively reduced line spacing for lists

          // Reset font
          doc.setFont(style?.fontFamily === "modern" ? "helvetica" : style?.fontFamily === "classic" ? "times" : "courier", "normal")
          
          // Apply aggressively minimal paragraph spacing
          const paragraphSpacing = getParagraphSpacingPt()
          yPosition += paragraphSpacing
        }
      } else if (element.type === "paragraph") {
        // Mark that we've seen content (for first element tracking)
        if (isFirstContentElement) {
          isFirstContentElement = false
        }
        
        // Render paragraph text (jsPDF has limited formatting support)
        const lines = doc.splitTextToSize(element.content, maxWidth)
        doc.text(lines, margin, yPosition, { maxWidth })
        yPosition += lines.length * lineSpacing * 0.7 // Aggressively reduced line spacing for paragraphs

        // Reset font
        doc.setFont(style?.fontFamily === "modern" ? "helvetica" : style?.fontFamily === "classic" ? "times" : "courier", "normal")

        // Apply aggressively minimal paragraph spacing
        const paragraphSpacing = getParagraphSpacingPt()
        yPosition += paragraphSpacing
      }
    }

    // Add signatures at the end of the document
    if (signatures && signatures.length > 0) {
      // Aggressively minimal spacing before signatures
      yPosition += 6 // Minimal: 6pt instead of 36pt
      
      // Check if we need a new page for signatures
      const signatureBlockHeight = 80
      if (yPosition + (signatureBlockHeight * signatures.length) > pageHeight - margin) {
        doc.addPage()
        yPosition = margin
      }

      // Add signature section header
      doc.setFontSize(fontSize + 2)
      doc.setFont(style?.fontFamily === "modern" ? "helvetica" : style?.fontFamily === "classic" ? "times" : "courier", "bold")
      const signatureHeaderLines = doc.splitTextToSize("Signatures", maxWidth)
      doc.text(signatureHeaderLines, margin, yPosition, { maxWidth })
      yPosition += signatureHeaderLines.length * lineSpacing * 0.7 // Aggressively reduced line spacing
      yPosition += getHeadingBottomSpacingPt() // Aggressively minimal spacing after heading
      doc.setFontSize(fontSize)
      doc.setFont(style?.fontFamily === "modern" ? "helvetica" : style?.fontFamily === "classic" ? "times" : "courier", "normal")

      // Add each signature
      for (const signature of signatures) {
        // Check if we need a new page
        if (yPosition + signatureBlockHeight > pageHeight - margin) {
          doc.addPage()
          yPosition = margin
        }

        try {
          // Convert base64 image to data URL
          const imgData = signature.signatureData
          if (imgData && imgData.startsWith("data:image")) {
            // Extract base64 part
            const base64Data = imgData.split(",")[1]
            if (base64Data) {
              // Add signature image (max width: 120px, height: 40px)
              const imgWidth = 120
              const imgHeight = 40
              doc.addImage(
                imgData,
                "PNG",
                margin,
                yPosition,
                imgWidth / 3.78, // Convert px to mm
                imgHeight / 3.78
              )
              yPosition += (imgHeight / 3.78) + 2 // Reduced spacing after image
            }
          }
        } catch (imgError) {
          console.warn("Could not add signature image to PDF:", imgError)
        }

        // Add signer name
        doc.text(`Signed by: ${signature.signerName}`, margin, yPosition)
        yPosition += lineSpacing * 0.6 // Aggressively reduced spacing

        // Add signer email
        doc.setFontSize(fontSize - 1)
        doc.setTextColor(100, 100, 100)
        doc.text(signature.signerEmail, margin, yPosition)
        yPosition += lineSpacing * 0.6 // Aggressively reduced spacing

        // Add date
        const signDate = new Date(signature.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
        doc.text(`Date: ${signDate}`, margin, yPosition)
        yPosition += getParagraphSpacingPt() // Aggressively minimal paragraph spacing

        // Reset text color and size
        doc.setTextColor(16, 22, 35)
        doc.setFontSize(fontSize)
      }
    }

    doc.save(filename)
  } catch (error) {
    console.error("Error exporting to PDF:", error)
    throw new Error("Failed to export PDF")
  }
}

/**
 * Export markdown content as DOCX with document styling and signatures
 * 
 * IMPORTANT: This function ensures all exports are in plain language by:
 * 1. Converting HTML to plain text (markdown-like format)
 * 2. Parsing markdown structure into DOCX paragraphs
 * 3. Applying consistent formatting across all document types
 * 
 * This ensures DOCX exports are always in plain language, not HTML tags.
 */
export async function exportToDOCX(
  content: string,
  filename: string = "document.docx",
  style?: DocumentStyle,
  signatures?: SignatureData[]
) {
  try {
    // Convert HTML to plain text for consistent plain language export
    // This ensures all document types export in plain language, not HTML
    const processedContent = contentToPlainText(content)
    const paragraphs = parseMarkdownToParagraphs(processedContent, style)

    // Add signature blocks if provided
    if (signatures && signatures.length > 0) {
      // Add aggressively minimal spacing paragraph
      paragraphs.push(
        new Paragraph({
          text: "",
          spacing: { after: 10 }, // Aggressively minimal: 10 twips (0.5pt)
        })
      )

      // Add signature section header
      const headingSize = style ? getFontSizePt(style) + 2 : 14
      const fontFamily = style ? getFontFamilyName(style).split(",")[0].trim() : "Arial"
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Signatures",
              bold: true,
              size: headingSize * 2,
              font: fontFamily,
            }),
          ],
          spacing: { after: 5 }, // Aggressively minimal: 5 twips (0.25pt)
        })
      )

      // Add each signature
      for (const signature of signatures) {
        try {
          // Convert base64 to buffer for docx
          const base64Data = signature.signatureData.includes(",")
            ? signature.signatureData.split(",")[1]
            : signature.signatureData

          if (base64Data) {
            // Add signature placeholder (images require Media.addImage which needs document context)
            // For now, we'll add a text placeholder
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: "[Signature Image]",
                    italics: true,
                    color: "666666",
                    size: (style ? getFontSizePt(style) : 12) * 2,
                    font: fontFamily,
                  }),
                ],
                spacing: { after: 5 }, // Aggressively minimal: 5 twips (0.25pt)
              })
            )
          }
        } catch (imgError) {
          console.warn("Could not add signature image to DOCX:", imgError)
          // Add fallback text
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "[Signature Image]",
                  italics: true,
                  color: "666666",
                  size: (style ? getFontSizePt(style) : 12) * 2,
                  font: fontFamily,
                }),
              ],
              spacing: { after: 100 }, // Condensed: 100 twips (5pt) instead of 200 (10pt)
            })
          )
        }

        // Add signer name
        const fontSize = style ? getFontSizePt(style) : 12
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Signed by: ${signature.signerName}`,
                size: fontSize * 2,
                font: fontFamily,
              }),
            ],
            spacing: { after: 5 }, // Aggressively minimal: 5 twips (0.25pt)
          })
        )

        // Add signer email
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: signature.signerEmail,
                size: (fontSize - 1) * 2,
                color: "666666",
                font: fontFamily,
              }),
            ],
            spacing: { after: 5 }, // Aggressively minimal: 5 twips (0.25pt)
          })
        )

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
                size: fontSize * 2,
                font: fontFamily,
              }),
            ],
            spacing: { after: 10 }, // Aggressively minimal: 10 twips (0.5pt)
          })
        )
      }
    }

    // Calculate margins based on layout (matching preview)
    const margin = style?.layout === "wide" ? 1440 : 720 // 1 inch = 1440 twips, 0.5 inch = 720 twips

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: margin,
                right: margin,
                bottom: margin,
                left: margin,
              },
            },
          },
          children: paragraphs,
        },
      ],
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, filename)
  } catch (error) {
    console.error("Error exporting to DOCX:", error)
    throw new Error("Failed to export DOCX")
  }
}
