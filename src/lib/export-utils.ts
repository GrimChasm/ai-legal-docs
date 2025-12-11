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
import { DocumentStyle, getFontFamilyName, getFontSizePt, getLineSpacingValue } from "./document-styles"

/**
 * Clean markdown content - removes code fences if entire content is wrapped
 */
export function cleanMarkdown(content: string): string {
  if (!content) return ""
  
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

  // Calculate spacing in twips (1 twip = 1/20 of a point)
  const getSpacing = (): number => {
    if (!style) return 240
    switch (style.paragraphSpacing) {
      case "compact":
        return 120
      case "roomy":
        return 360
      default:
        return 240
    }
  }

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
      
      // Apply heading style
      textRuns.forEach(run => {
        if (style?.headingStyle === "bold") {
          run.bold = true
        }
        run.size = headingSize * 2
      })

      const indent = style?.headingIndent === "indented" ? 720 : 0 // 0.5 inch = 720 twips

      paragraphs.push(
        new Paragraph({
          children: textRuns,
          heading: element.level === 1 
            ? HeadingLevel.HEADING_1 
            : element.level === 2 
            ? HeadingLevel.HEADING_2 
            : HeadingLevel.HEADING_3,
          spacing: {
            after: getSpacing(),
          },
          indent: {
            left: indent,
          },
        })
      )
    } else if (element.type === "list" && element.children) {
      for (const item of element.children) {
        const textRuns = parseInlineFormatting(item.content, style)
        paragraphs.push(
          new Paragraph({
            children: textRuns,
            bullet: { level: item.level || 0 },
            spacing: {
              after: getSpacing() / 2,
            },
          })
        )
      }
    } else if (element.type === "paragraph") {
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
 * Improved version that better matches the preview
 */
export async function exportToPDF(
  content: string,
  filename: string = "document.pdf",
  style?: DocumentStyle,
  signatures?: SignatureData[]
) {
  try {
    const cleaned = cleanMarkdown(content)
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
      }

      if (element.type === "empty") {
        yPosition += lineSpacing * 0.5
        continue
      }

      if (element.type === "heading") {
        let headingText = element.content
        if (style?.headingCase === "uppercase") {
          headingText = headingText.toUpperCase()
        }

        // Apply heading styles
        const headingSize = fontSize + (4 - (element.level || 1))
        doc.setFontSize(headingSize)
        
        if (style?.headingStyle === "bold") {
          doc.setFont(style.fontFamily === "modern" ? "helvetica" : style.fontFamily === "classic" ? "times" : "courier", "bold")
        }

        // Apply heading indent
        const xPosition = style?.headingIndent === "indented" ? margin + 10 : margin
        
        // Render heading text (jsPDF handles basic text, formatting is limited)
        doc.text(headingText, xPosition, yPosition, { maxWidth })

        // Reset font
        doc.setFontSize(fontSize)
        doc.setFont(style?.fontFamily === "modern" ? "helvetica" : style?.fontFamily === "classic" ? "times" : "courier", "normal")

        // Apply paragraph spacing
        const spacing = style?.paragraphSpacing === "compact" 
          ? lineSpacing * 0.5 
          : style?.paragraphSpacing === "roomy" 
          ? lineSpacing * 1.5 
          : lineSpacing
        yPosition += spacing
      } else if (element.type === "list" && element.children) {
        for (const item of element.children) {
          if (yPosition > pageHeight - margin - 20) {
            doc.addPage()
            yPosition = margin
          }

          // Render list item with bullet
          const listText = "• " + item.content
          const listLines = doc.splitTextToSize(listText, maxWidth)
          doc.text(listLines, margin, yPosition, { maxWidth })
          yPosition += listLines.length * lineSpacing

          // Reset font
          doc.setFont(style?.fontFamily === "modern" ? "helvetica" : style?.fontFamily === "classic" ? "times" : "courier", "normal")
          
          const spacing = style?.paragraphSpacing === "compact" 
            ? lineSpacing * 0.5 
            : style?.paragraphSpacing === "roomy" 
            ? lineSpacing * 1.5 
            : lineSpacing
          yPosition += spacing
        }
      } else if (element.type === "paragraph") {
        // Render paragraph text (jsPDF has limited formatting support)
        const lines = doc.splitTextToSize(element.content, maxWidth)
        doc.text(lines, margin, yPosition, { maxWidth })
        yPosition += lines.length * lineSpacing

        // Reset font
        doc.setFont(style?.fontFamily === "modern" ? "helvetica" : style?.fontFamily === "classic" ? "times" : "courier", "normal")

        // Apply paragraph spacing
        const spacing = style?.paragraphSpacing === "compact" 
          ? lineSpacing * 0.5 
          : style?.paragraphSpacing === "roomy" 
          ? lineSpacing * 1.5 
          : lineSpacing
        yPosition += spacing
      }
    }

    // Add signatures at the end of the document
    if (signatures && signatures.length > 0) {
      // Add spacing before signatures
      yPosition += lineSpacing * 2
      
      // Check if we need a new page for signatures
      const signatureBlockHeight = 80
      if (yPosition + (signatureBlockHeight * signatures.length) > pageHeight - margin) {
        doc.addPage()
        yPosition = margin
      }

      // Add signature section header
      doc.setFontSize(fontSize + 2)
      doc.setFont(style?.fontFamily === "modern" ? "helvetica" : style?.fontFamily === "classic" ? "times" : "courier", "bold")
      doc.text("Signatures", margin, yPosition)
      yPosition += lineSpacing * 1.5
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
              yPosition += (imgHeight / 3.78) + 5
            }
          }
        } catch (imgError) {
          console.warn("Could not add signature image to PDF:", imgError)
        }

        // Add signer name
        doc.text(`Signed by: ${signature.signerName}`, margin, yPosition)
        yPosition += lineSpacing

        // Add signer email
        doc.setFontSize(fontSize - 1)
        doc.setTextColor(100, 100, 100)
        doc.text(signature.signerEmail, margin, yPosition)
        yPosition += lineSpacing

        // Add date
        const signDate = new Date(signature.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
        doc.text(`Date: ${signDate}`, margin, yPosition)
        yPosition += lineSpacing * 2

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
 * Improved version that better matches the preview
 */
export async function exportToDOCX(
  content: string,
  filename: string = "document.docx",
  style?: DocumentStyle,
  signatures?: SignatureData[]
) {
  try {
    const paragraphs = parseMarkdownToParagraphs(content, style)

    // Add signature blocks if provided
    if (signatures && signatures.length > 0) {
      // Add spacing paragraph
      paragraphs.push(
        new Paragraph({
          text: "",
          spacing: { after: 400 },
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
          spacing: { after: 300 },
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
                spacing: { after: 200 },
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
              spacing: { after: 200 },
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
            spacing: { after: 100 },
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
            spacing: { after: 100 },
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
            spacing: { after: 400 },
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
