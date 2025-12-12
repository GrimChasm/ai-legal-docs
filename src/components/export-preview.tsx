/**
 * Export Preview Component
 * 
 * Provides preview modes for Web, PDF, and DOCX exports.
 * Uses the canonical DocumentRenderer for consistent rendering.
 * 
 * This component:
 * - Shows three preview modes: Web, PDF, DOCX
 * - Uses DocumentViewer for PDF/DOCX previews (with pagination)
 * - Uses DocumentRenderer directly for Web preview
 * - Ensures all previews match the actual exports
 */

"use client"

import { useState } from "react"
import DocumentRenderer from "./document-renderer"
import DocumentViewer from "./document-viewer"
import { DocumentStyle } from "@/lib/document-styles"

interface ExportPreviewProps {
  content: string
  style: DocumentStyle
  signatures?: Array<{
    signerName: string
    signerEmail: string
    signatureData?: string
    createdAt: string
  }>
}

type PreviewMode = "web" | "pdf" | "docx"

export default function ExportPreview({ content, style, signatures }: ExportPreviewProps) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("web")

  return (
    <div className="space-y-4">
      {/* Preview Mode Selector */}
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <button
          onClick={() => setPreviewMode("web")}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
            previewMode === "web"
              ? "bg-accent-light text-text-main border-2 border-accent shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] font-semibold"
              : "bg-transparent text-text-main hover:text-text-main hover:bg-bg-muted border-2 border-transparent hover:border-border hover:shadow-sm active:scale-[0.98]"
          }`}
        >
          Web Preview
        </button>
        <button
          onClick={() => setPreviewMode("pdf")}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
            previewMode === "pdf"
              ? "bg-accent-light text-text-main border-2 border-accent shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] font-semibold"
              : "bg-transparent text-text-main hover:text-text-main hover:bg-bg-muted border-2 border-transparent hover:border-border hover:shadow-sm active:scale-[0.98]"
          }`}
        >
          PDF Preview
        </button>
        <button
          onClick={() => setPreviewMode("docx")}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
            previewMode === "docx"
              ? "bg-accent-light text-text-main border-2 border-accent shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] font-semibold"
              : "bg-transparent text-text-main hover:text-text-main hover:bg-bg-muted border-2 border-transparent hover:border-border hover:shadow-sm active:scale-[0.98]"
          }`}
        >
          DOCX Preview
        </button>
      </div>

      {/* Preview Content */}
      <div className="overflow-auto">
        {previewMode === "web" ? (
          // Web preview - direct rendering
          <div className="document-preview-web">
            <DocumentRenderer
              content={content}
              style={style}
              signatures={signatures}
              forExport={false}
            />
          </div>
        ) : (
          // PDF/DOCX preview - paginated view
          <DocumentViewer
            content={content}
            style={style}
            signatures={signatures}
            loading={false}
          />
        )}
      </div>
    </div>
  )
}

