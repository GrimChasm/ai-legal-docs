/**
 * Document Viewer Component
 * 
 * Provides a single-page preview of documents with:
 * - Zoom controls
 * - Page-like rendering with proper margins
 * - Responsive design
 * 
 * This component uses the canonical DocumentRenderer for consistent rendering.
 */

"use client"

import { useState, useEffect, useRef } from "react"
import DocumentRenderer from "./document-renderer"
import { DocumentStyle } from "@/lib/document-styles"

interface DocumentViewerProps {
  content: string
  style: DocumentStyle
  signatures?: Array<{
    signerName: string
    signerEmail: string
    signatureData?: string
    createdAt: string
  }>
  loading?: boolean
}

type ZoomLevel = 0.75 | 1 | 1.5

// A4 page dimensions in mm
const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297
const MM_TO_PX = 3.779527559 // 1mm = 3.779527559px at 96 DPI

// Convert mm to px
function mmToPx(mm: number): number {
  return mm * MM_TO_PX
}

// Calculate page dimensions - using wider format for better readability
// Increased width by ~20% for wider page layout
const PAGE_WIDTH_PX = mmToPx(A4_WIDTH_MM) * 1.2 // ~20% wider than standard A4
const PAGE_HEIGHT_PX = mmToPx(A4_HEIGHT_MM)

export default function DocumentViewer({
  content,
  style,
  signatures,
  loading = false,
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState<ZoomLevel>(1)
  const [fitMode, setFitMode] = useState<"width" | "page" | "auto">("width")
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number>(0)
  const [, forceUpdate] = useState({})
  
  // Handle window resize to trigger re-render
  useEffect(() => {
    const handleResize = () => {
      // Force re-render to recalculate container width
      forceUpdate({})
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Calculate margins based on layout
  const margin = style.layout === "wide" ? 25 : 20 // mm
  const marginPx = mmToPx(margin)
  const contentWidthPx = PAGE_WIDTH_PX - (marginPx * 2)

  // Measure content height
  useEffect(() => {
    if (!content || loading || !contentRef.current) {
      setContentHeight(0)
      return
    }

    // Use a timeout to ensure DOM is rendered
    const timeout = setTimeout(() => {
      if (contentRef.current) {
        const contentElement = contentRef.current.querySelector('.document-renderer')
        if (contentElement) {
          const height = contentElement.scrollHeight
          // Account for signatures if present
          const signatureHeight = signatures && signatures.length > 0 ? 200 : 0
          setContentHeight(height + signatureHeight)
        }
      }
    }, 200)

    return () => clearTimeout(timeout)
  }, [content, loading, style, signatures])

  // Calculate container width based on fit mode and zoom
  const getContainerWidth = () => {
    if (!containerRef.current) return PAGE_WIDTH_PX

    const containerWidth = containerRef.current.clientWidth
    const availableWidth = Math.max(containerWidth - 80, 300) // Account for padding, minimum 300px

    switch (fitMode) {
      case "width":
        // Fit to container width (ignore zoom, always fit to available width)
        return Math.min(availableWidth, PAGE_WIDTH_PX)
      case "page":
        // Show full page at zoom level (may be larger than container)
        const zoomedWidth = PAGE_WIDTH_PX * zoom
        // If zoomed page fits, show it; otherwise fit to width
        return Math.min(zoomedWidth, availableWidth)
      case "auto":
        // Auto-fit to container, respecting zoom
        const autoWidth = PAGE_WIDTH_PX * zoom
        return Math.min(autoWidth, availableWidth)
      default:
        return Math.min(PAGE_WIDTH_PX * zoom, availableWidth)
    }
  }

  // Calculate container width based on fit mode and zoom
  const containerWidth = getContainerWidth()
  const scale = containerWidth / PAGE_WIDTH_PX
  
  // Ensure scale is never zero or negative
  const safeScale = Math.max(scale, 0.1)


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-bg-muted rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-muted">Generating document preview...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="document-viewer-container w-full">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 p-4 bg-bg-muted rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-main font-medium">Zoom:</span>
          <div className="flex items-center gap-1">
            {([0.75, 1, 1.5] as ZoomLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => {
                  setZoom(level)
                  // If fit mode is "width", switch to "auto" to allow zoom
                  if (fitMode === "width") {
                    setFitMode("auto")
                  }
                }}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 ${
                  zoom === level
                    ? "bg-accent-light text-text-main shadow-md hover:shadow-lg hover:scale-[1.05] active:scale-[0.95] font-semibold border-2 border-accent"
                    : "bg-white text-text-main hover:bg-accent-light hover:text-text-main hover:border-accent border border-border hover:shadow-sm active:scale-[0.95]"
                }`}
              >
                {Math.round(level * 100)}%
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setFitMode("width")
            }}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 ${
              fitMode === "width"
                ? "bg-accent-light text-text-main shadow-md hover:shadow-lg hover:scale-[1.05] active:scale-[0.95] font-semibold border-2 border-accent"
                : "bg-white text-text-main hover:bg-accent-light hover:text-text-main hover:border-accent border border-border hover:shadow-sm active:scale-[0.95]"
            }`}
          >
            Fit to Width
          </button>
          <button
            onClick={() => {
              setFitMode("page")
            }}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 ${
              fitMode === "page"
                ? "bg-accent-light text-text-main shadow-md hover:shadow-lg hover:scale-[1.05] active:scale-[0.95] font-semibold border-2 border-accent"
                : "bg-white text-text-main hover:bg-accent-light hover:text-text-main hover:border-accent border border-border hover:shadow-sm active:scale-[0.95]"
            }`}
          >
            Fit to Page
          </button>
        </div>
      </div>

      {/* Document Container */}
      <div
        ref={containerRef}
        className="document-pages-container flex flex-col items-center gap-6 py-6 bg-bg-muted min-h-[600px]"
        style={{
          padding: "2rem 1rem",
        }}
      >
        {/* Document container - expands to fit all content */}
        <div
          className="document-page bg-white shadow-2xl"
          style={{
            width: `${containerWidth}px`,
            minHeight: contentHeight > 0 ? `${(contentHeight + marginPx * 2) * safeScale}px` : `${1600 * safeScale}px`,
            boxSizing: "border-box",
            position: "relative",
            borderRadius: "4px",
            overflow: "visible",
          }}
        >
          {/* Document content wrapper - full width, auto height */}
          <div
            style={{
              width: `${PAGE_WIDTH_PX}px`,
              minHeight: contentHeight > 0 ? `${contentHeight + marginPx * 2}px` : "1600px",
              transform: `scale(${safeScale})`,
              transformOrigin: "top left",
              overflow: "visible",
              position: "relative",
              padding: `${marginPx}px`,
              boxSizing: "border-box",
            }}
          >
            {/* Content area - full width, auto height */}
            <div
              ref={contentRef}
              style={{
                width: `${contentWidthPx}px`,
                minHeight: contentHeight > 0 ? `${contentHeight}px` : "auto",
                overflow: "visible",
                position: "relative",
                boxSizing: "border-box",
              }}
            >
              <DocumentRenderer
                content={content}
                style={style}
                signatures={signatures}
                forExport={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
