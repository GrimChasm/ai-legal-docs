import jsPDF from "jspdf"
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx"
import { saveAs } from "file-saver"
import { DocumentStyle, getFontFamilyName, getFontSizePt, getLineSpacingValue } from "./document-styles"

/**
 * Convert markdown text to plain text (basic conversion)
 */
function markdownToText(markdown: string): string {
  return markdown
    .replace(/^#+\s+/gm, "") // Remove headers
    .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.+?)\*/g, "$1") // Remove italic
    .replace(/`(.+?)`/g, "$1") // Remove code
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // Remove links
    .trim()
}

/**
 * Parse markdown into paragraphs for DOCX with document styling
 */
function parseMarkdownToParagraphs(markdown: string, style?: DocumentStyle): Paragraph[] {
  const lines = markdown.split("\n")
  const paragraphs: Paragraph[] = []

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // Skip empty lines
    if (!line.trim()) {
      paragraphs.push(new Paragraph({ text: "" }))
      continue
    }

    // Handle headers
    if (line.startsWith("# ")) {
      let headingText = line.substring(2)
      if (style?.headingCase === "uppercase") {
        headingText = headingText.toUpperCase()
      }
      const text = parseInlineFormatting(headingText)
      paragraphs.push(
        new Paragraph({
          children: text,
          heading: HeadingLevel.HEADING_1,
          spacing: {
            after: style?.paragraphSpacing === "compact" ? 120 : style?.paragraphSpacing === "roomy" ? 360 : 240,
          },
        })
      )
    } else if (line.startsWith("## ")) {
      let headingText = line.substring(3)
      if (style?.headingCase === "uppercase") {
        headingText = headingText.toUpperCase()
      }
      const text = parseInlineFormatting(headingText)
      paragraphs.push(
        new Paragraph({
          children: text,
          heading: HeadingLevel.HEADING_2,
          spacing: {
            after: style?.paragraphSpacing === "compact" ? 120 : style?.paragraphSpacing === "roomy" ? 360 : 240,
          },
        })
      )
    } else if (line.startsWith("### ")) {
      let headingText = line.substring(4)
      if (style?.headingCase === "uppercase") {
        headingText = headingText.toUpperCase()
      }
      const text = parseInlineFormatting(headingText)
      paragraphs.push(
        new Paragraph({
          children: text,
          heading: HeadingLevel.HEADING_3,
          spacing: {
            after: style?.paragraphSpacing === "compact" ? 120 : style?.paragraphSpacing === "roomy" ? 360 : 240,
          },
        })
      )
    } else if (line.match(/^[-*]\s/)) {
      // Handle bullet points
      const text = parseInlineFormatting(line.substring(2))
      paragraphs.push(
        new Paragraph({
          children: text,
          bullet: { level: 0 },
        })
      )
    } else {
      // Regular paragraph
      const text = parseInlineFormatting(line)
      paragraphs.push(
        new Paragraph({
          children: text,
          spacing: {
            after: style?.paragraphSpacing === "compact" ? 120 : style?.paragraphSpacing === "roomy" ? 360 : 240,
          },
        })
      )
    }
  }

  return paragraphs
}

/**
 * Parse inline markdown formatting (bold, italic) into TextRun array
 */
function parseInlineFormatting(text: string): TextRun[] {
  const runs: TextRun[] = []
  let remaining = text
  let lastIndex = 0

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
  for (const match of matches) {
    // Add text before match
    if (match.start > currentPos) {
      const beforeText = text.substring(currentPos, match.start)
      if (beforeText) {
        runs.push(new TextRun({ text: beforeText }))
      }
    }
    // Add matched text with formatting
    runs.push(new TextRun({ text: match.text, bold: match.bold, italics: match.italic }))
    currentPos = match.end
  }

  // Add remaining text
  if (currentPos < text.length) {
    const remainingText = text.substring(currentPos)
    if (remainingText) {
      runs.push(new TextRun({ text: remainingText }))
    }
  }

  // If no formatting found, return single run
  if (runs.length === 0) {
    runs.push(new TextRun({ text }))
  }

  return runs
}

/**
 * Export markdown content as PDF with document styling
 * 
 * Applies the DocumentStyle settings to the PDF export:
 * - Font family and size
 * - Line spacing
 * - Margins (based on layout)
 * - Heading styles (bold/uppercase)
 */
export async function exportToPDF(
  content: string,
  filename: string = "document.pdf",
  style?: DocumentStyle
) {
  try {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    
    // Apply layout margins
    const margin = style?.layout === "wide" ? 30 : 20
    const maxWidth = pageWidth - margin * 2
    let yPosition = margin

    // Apply font settings
    const fontSize = style ? getFontSizePt(style) : 12
    const lineSpacing = style ? getLineSpacingValue(style) * fontSize : fontSize * 1.15
    
    // Set font (jsPDF has limited font support, so we'll use standard fonts)
    // Modern -> Helvetica, Classic -> Times, Mono -> Courier
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
    doc.setTextColor(0, 0, 0)

    // Convert markdown to plain text and split into lines
    const text = markdownToText(content)
    const lines = doc.splitTextToSize(text, maxWidth)

    for (let i = 0; i < lines.length; i++) {
      if (yPosition > pageHeight - margin) {
        doc.addPage()
        yPosition = margin
      }
      
      // Check if this line is a heading (starts with #)
      const originalLine = text.split('\n').find(l => l.trim() && lines[i].includes(l.trim().substring(0, 20)))
      const isHeading = originalLine?.trim().startsWith('#')
      
      if (isHeading && style) {
        // Apply heading styles
        const headingSize = fontSize + 2
        doc.setFontSize(headingSize)
        if (style.headingStyle === "bold") {
          doc.setFont("helvetica", "bold")
        }
        
        let headingText = lines[i]
        if (style.headingCase === "uppercase") {
          headingText = headingText.toUpperCase()
        }
        
        doc.text(headingText, style.headingIndent === "indented" ? margin + 10 : margin, yPosition)
        doc.setFontSize(fontSize)
        doc.setFont("helvetica", "normal")
      } else {
        doc.text(lines[i], margin, yPosition)
      }
      
      yPosition += lineSpacing
    }

    doc.save(filename)
  } catch (error) {
    console.error("Error exporting to PDF:", error)
    throw new Error("Failed to export PDF")
  }
}

/**
 * Export markdown content as DOCX with document styling
 * 
 * Applies the DocumentStyle settings to the DOCX export:
 * - Font family and size
 * - Line spacing
 * - Paragraph spacing
 * - Heading styles (bold/uppercase)
 * - Margins (based on layout)
 */
export async function exportToDOCX(
  content: string,
  filename: string = "document.docx",
  style?: DocumentStyle
) {
  try {
    const paragraphs = parseMarkdownToParagraphs(content, style)

    // Calculate margins based on layout
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

