/**
 * Canonical Document Renderer
 * 
 * This is the SINGLE SOURCE OF TRUTH for document rendering.
 * 
 * This component:
 * - Takes document content (markdown) and styling props
 * - Renders a semantic HTML structure with consistent styling
 * - Is used by both the preview AND export functions
 * 
 * Usage:
 * - Preview: <DocumentRenderer content={markdown} style={documentStyle} />
 * - PDF Export: Uses the same HTML/CSS output
 * - DOCX Export: Maps the same structure to DOCX elements
 * 
 * Structure:
 * - Title (if present)
 * - Section headings (H1, H2, H3)
 * - Paragraphs
 * - Lists (ordered/unordered)
 * - Signature blocks
 */

"use client"

import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { DocumentStyle, getFontFamilyName, getFontSizePt, getLineSpacingValue } from "@/lib/document-styles"
import { isHTML, ensureHTML } from "@/lib/markdown-to-html"

interface DocumentRendererProps {
  content: string
  style: DocumentStyle
  signatures?: Array<{
    signerName: string
    signerEmail: string
    signatureData?: string
    createdAt: string
  }>
  className?: string
  /** If true, renders for print/PDF (black text, no web colors) */
  forExport?: boolean
}

// Clean markdown content - removes code fences if entire content is wrapped
function cleanMarkdown(content: string): string {
  if (!content) return ""
  
  const trimmed = content.trim()
  
  // If the entire content is wrapped in code fences, remove them
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

/**
 * Canonical Document Renderer Component
 * 
 * This component renders documents with consistent styling that matches
 * both the preview and exported PDF/DOCX files.
 */
export default function DocumentRenderer({
  content,
  style,
  signatures,
  className = "",
  forExport = false,
}: DocumentRendererProps) {
  // Check if content is HTML or markdown
  const contentIsHTML = isHTML(content)
  const processedContent = contentIsHTML ? content : cleanMarkdown(content)
  
  const fontSize = getFontSizePt(style)
  const lineSpacing = getLineSpacingValue(style)
  const fontFamily = getFontFamilyName(style).split(",")[0].trim()

  // Calculate spacing based on paragraph spacing setting
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

  // Text color - black for exports, theme color for web preview
  const textColor = forExport ? "#000000" : "#101623"
  const mutedColor = forExport ? "#666666" : "#6C7783"

  // Base document styles
  const documentStyles: React.CSSProperties = {
    fontFamily: fontFamily,
    fontSize: `${fontSize}pt`,
    lineHeight: lineSpacing,
    color: textColor,
    wordWrap: "break-word",
    overflowWrap: "break-word",
    wordBreak: "normal", // Prefer breaking at spaces, not mid-word
    hyphens: "auto", // Enable automatic hyphenation for better word breaking
  }

  return (
    <div 
      className={`document-renderer ${className}`} 
      style={{
        ...documentStyles,
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {contentIsHTML ? (
        // Render HTML directly
        <div
          dangerouslySetInnerHTML={{ __html: processedContent }}
          style={{
            ...documentStyles,
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        />
      ) : (
        // Render markdown (for backward compatibility)
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          skipHtml={false}
          components={{
          h1: ({ children }) => (
            <h1
              className="document-heading document-heading-1"
              style={{
                fontWeight: style.headingStyle === "bold" ? 700 : 400,
                textTransform: style.headingCase === "uppercase" ? "uppercase" : "none",
                marginLeft: style.headingIndent === "indented" ? "1rem" : "0",
                color: textColor,
                marginBottom: getParagraphSpacing(),
                marginTop: "0.75rem", // Reduced from 1.5rem for more condensed spacing
                fontSize: `${fontSize + 4}pt`,
                fontFamily: fontFamily,
                lineHeight: lineSpacing,
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                wordBreak: "normal", // Prefer breaking at spaces
                hyphens: "auto", // Enable hyphenation
              }}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              className="document-heading document-heading-2"
              style={{
                fontWeight: style.headingStyle === "bold" ? 700 : 400,
                textTransform: style.headingCase === "uppercase" ? "uppercase" : "none",
                marginLeft: style.headingIndent === "indented" ? "1rem" : "0",
                color: textColor,
                marginBottom: getParagraphSpacing(),
                marginTop: "0.75rem", // Reduced from 1.5rem for more condensed spacing
                fontSize: `${fontSize + 2}pt`,
                fontFamily: fontFamily,
                lineHeight: lineSpacing,
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                wordBreak: "normal", // Prefer breaking at spaces
                hyphens: "auto", // Enable hyphenation
              }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              className="document-heading document-heading-3"
              style={{
                fontWeight: style.headingStyle === "bold" ? 700 : 400,
                textTransform: style.headingCase === "uppercase" ? "uppercase" : "none",
                marginLeft: style.headingIndent === "indented" ? "1rem" : "0",
                color: textColor,
                marginBottom: getParagraphSpacing(),
                marginTop: "0.625rem", // Reduced from 1.25rem for more condensed spacing
                fontSize: `${fontSize + 1}pt`,
                fontFamily: fontFamily,
                lineHeight: lineSpacing,
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                wordBreak: "normal", // Prefer breaking at spaces
                hyphens: "auto", // Enable hyphenation
              }}
            >
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p
              className="document-paragraph"
              style={{
                color: textColor,
                marginBottom: getParagraphSpacing(),
                marginTop: 0,
                fontFamily: fontFamily,
                fontSize: `${fontSize}pt`,
                lineHeight: lineSpacing,
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                wordBreak: "normal", // Prefer breaking at spaces
                hyphens: "auto", // Enable hyphenation
              }}
            >
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul
              className="document-list document-list-unordered"
              style={{
                color: textColor,
                marginBottom: getParagraphSpacing(),
                marginTop: 0,
                paddingLeft: "1.5rem",
                fontFamily: fontFamily,
                fontSize: `${fontSize}pt`,
                lineHeight: lineSpacing,
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
              }}
            >
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol
              className="document-list document-list-ordered"
              style={{
                color: textColor,
                marginBottom: getParagraphSpacing(),
                marginTop: 0,
                paddingLeft: "1.5rem",
                fontFamily: fontFamily,
                fontSize: `${fontSize}pt`,
                lineHeight: lineSpacing,
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
              }}
            >
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li
              className="document-list-item"
              style={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
                wordBreak: "normal", // Prefer breaking at spaces
                hyphens: "auto", // Enable hyphenation
                fontFamily: fontFamily,
                fontSize: `${fontSize}pt`,
                lineHeight: lineSpacing,
                marginBottom: "0.25rem",
              }}
            >
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="document-strong" style={{ fontFamily: fontFamily, fontWeight: 700 }}>
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="document-emphasis" style={{ fontFamily: fontFamily, fontStyle: "italic" }}>
              {children}
            </em>
          ),
          code: ({ children, className, ...props }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code
                  className="document-code-inline"
                  style={{
                    backgroundColor: forExport ? "#f5f5f5" : "#f3f4f6",
                    padding: "0.125rem 0.25rem",
                    borderRadius: "0.25rem",
                    fontSize: "0.875em",
                    fontFamily: "monospace",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return (
              <div
                className="document-code-block"
                style={{
                  overflowX: "auto",
                  width: "100%",
                  backgroundColor: forExport ? "#f5f5f5" : "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <code
                  style={{
                    display: "block",
                    whiteSpace: "pre",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                  }}
                  {...props}
                >
                  {children}
                </code>
              </div>
            )
          },
          pre: ({ children }) => (
            <div
              className="document-pre"
              style={{
                overflowX: "auto",
                width: "100%",
                marginBottom: "1rem",
              }}
            >
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  width: "100%",
                  fontFamily: "monospace",
                }}
              >
                {children}
              </pre>
            </div>
          ),
          table: ({ children }) => (
            <div
              className="document-table-wrapper"
              style={{
                overflowX: "auto",
                width: "100%",
                maxWidth: "100%",
                marginBottom: "1rem",
                boxSizing: "border-box",
              }}
            >
              <table
                className="document-table"
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  borderCollapse: "collapse",
                  fontFamily: fontFamily,
                  fontSize: `${fontSize}pt`,
                  tableLayout: "auto",
                }}
              >
                {children}
              </table>
            </div>
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
        )}

      {/* Signature blocks */}
      {signatures && signatures.length > 0 && (
        <div
          className="document-signatures"
          style={{
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: "2px solid #e5e7eb",
            pageBreakInside: "avoid",
          }}
        >
          <h3
            className="document-heading document-heading-3"
            style={{
              fontWeight: 700,
              fontSize: `${fontSize + 2}pt`,
              marginBottom: "1.5rem",
              fontFamily: fontFamily,
              color: textColor,
            }}
          >
            Signatures
          </h3>
          {signatures.map((signature, index) => (
            <div
              key={index}
              className="document-signature-block"
              style={{
                marginBottom: "2rem",
                pageBreakInside: "avoid",
              }}
            >
              {signature.signatureData && (
                <div style={{ marginBottom: "0.5rem" }}>
                  <img
                    src={signature.signatureData}
                    alt="Signature"
                    style={{
                      maxWidth: "120px",
                      maxHeight: "40px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}
              <p
                className="document-paragraph"
                style={{
                  fontFamily: fontFamily,
                  fontSize: `${fontSize}pt`,
                  marginBottom: "0.25rem",
                  color: textColor,
                }}
              >
                Signed by: {signature.signerName}
              </p>
              <p
                className="document-paragraph"
                style={{
                  fontFamily: fontFamily,
                  fontSize: `${fontSize - 1}pt`,
                  color: mutedColor,
                  marginBottom: "0.25rem",
                }}
              >
                {signature.signerEmail}
              </p>
              <p
                className="document-paragraph"
                style={{
                  fontFamily: fontFamily,
                  fontSize: `${fontSize}pt`,
                  color: textColor,
                }}
              >
                Date: {new Date(signature.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


