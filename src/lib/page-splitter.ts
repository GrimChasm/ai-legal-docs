/**
 * Page Splitter Utility
 * 
 * Calculates page breaks and splits content across multiple pages.
 * This ensures that page numbers correspond to the correct content.
 */

// A4 page dimensions in mm
const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297
const MM_TO_PX = 3.779527559 // 1mm = 3.779527559px at 96 DPI

// Convert mm to px
function mmToPx(mm: number): number {
  return mm * MM_TO_PX
}

// Calculate page dimensions - using wider format for better readability
// Increased width by ~20% for wider page layout (matches DocumentViewer)
const PAGE_WIDTH_PX = mmToPx(A4_WIDTH_MM) * 1.2 // ~20% wider than standard A4
const PAGE_HEIGHT_PX = mmToPx(A4_HEIGHT_MM)

export interface PageInfo {
  pageNumber: number
  startY: number
  endY: number
  height: number
}

/**
 * Calculate page breaks based on content height
 * 
 * @param totalContentHeight - Total height of content in pixels
 * @param topMargin - Top margin in mm
 * @param bottomMargin - Bottom margin in mm
 * @returns Array of PageInfo objects with page boundaries
 */
export function calculatePageBreaks(
  totalContentHeight: number,
  topMargin: number = 20,
  bottomMargin: number = 20
): PageInfo[] {
  const topMarginPx = mmToPx(topMargin)
  const bottomMarginPx = mmToPx(bottomMargin)
  const contentHeightPx = PAGE_HEIGHT_PX - topMarginPx - bottomMarginPx

  const pages: PageInfo[] = []
  let currentY = 0
  let pageNumber = 1

  while (currentY < totalContentHeight) {
    const startY = currentY
    const endY = Math.min(currentY + contentHeightPx, totalContentHeight)
    const height = endY - startY

    pages.push({
      pageNumber,
      startY,
      endY,
      height,
    })

    currentY = endY
    pageNumber++
  }

  return pages
}

/**
 * Get the page number that contains a specific Y position
 */
export function getPageForPosition(y: number, pages: PageInfo[]): number {
  for (const page of pages) {
    if (y >= page.startY && y < page.endY) {
      return page.pageNumber
    }
  }
  // If position is at or beyond the last page
  if (pages.length > 0 && y >= pages[pages.length - 1].endY) {
    return pages.length
  }
  return 1
}

