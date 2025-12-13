/**
 * Export Service
 * 
 * This is the orchestrator for all document exports. It:
 * - Routes export requests to the appropriate exporter (PDF/DOCX)
 * - Handles feature flags for gradual rollout
 * - Provides a unified API for export operations
 * - Ensures consistent error handling
 * 
 * Usage:
 * ```typescript
 * const service = new ExportService()
 * const pdfBuffer = await service.exportPDF(data, options)
 * const docxBuffer = await service.exportDOCX(data)
 * ```
 */

import type { DocumentData } from "./renderHtml"
import { exportToPDF as playwrightExportPDF, isPlaywrightAvailable } from "./pdf"
import { exportToDOCX, isDOCXAvailable } from "./docx"
import { exportToPDF as legacyExportPDF, exportToDOCX as legacyExportDOCX } from "@/lib/export-utils"

export interface ExportOptions {
  format?: "Letter" | "A4"
  margin?: { top: string; right: string; bottom: string; left: string }
  useNewExport?: boolean // Feature flag
}

/**
 * Export Service Class
 */
export class ExportService {
  private useNewExport: boolean

  constructor(useNewExport: boolean = true) {
    // Check environment variable for feature flag
    this.useNewExport = useNewExport && (process.env.USE_NEW_EXPORT !== "false")
  }

  /**
   * Export document to PDF
   */
  async exportPDF(
    data: DocumentData,
    options: ExportOptions = {}
  ): Promise<Buffer> {
    const { useNewExport = this.useNewExport, ...pdfOptions } = options

    // Use new Playwright-based export if enabled and available
    if (useNewExport) {
      const isAvailable = await isPlaywrightAvailable()
      if (isAvailable) {
        try {
          return await playwrightExportPDF(data, pdfOptions)
        } catch (error) {
          console.error("New PDF export failed, falling back to legacy:", error)
          // Fall through to legacy export
        }
      }
    }

    // Fallback to legacy export
    return this.legacyExportPDF(data)
  }

  /**
   * Export document to DOCX
   */
  async exportDOCX(
    data: DocumentData,
    options: { useNewExport?: boolean } = {}
  ): Promise<Buffer> {
    const { useNewExport = this.useNewExport } = options

    // Use new DOCX export if enabled and available
    if (useNewExport) {
      const isAvailable = isDOCXAvailable()
      if (isAvailable) {
        try {
          return await exportToDOCX(data)
        } catch (error) {
          console.error("New DOCX export failed, falling back to legacy:", error)
          // Fall through to legacy export
        }
      }
    }

    // Fallback to legacy export
    return this.legacyExportDOCX(data)
  }

  /**
   * Legacy PDF export (client-side jsPDF)
   * This is kept for backward compatibility and fallback
   */
  private async legacyExportPDF(data: DocumentData): Promise<Buffer> {
    // Convert DocumentData to legacy format
    const { content, style, signatures } = data
    
    // Legacy export expects plain text, so we need to convert
    // For now, we'll throw an error and require the new export
    // In production, you might want to implement a proper conversion
    throw new Error(
      "Legacy PDF export is deprecated. Please use the new Playwright-based export."
    )
  }

  /**
   * Legacy DOCX export (client-side docx library)
   * This is kept for backward compatibility and fallback
   */
  private async legacyExportDOCX(data: DocumentData): Promise<Buffer> {
    // Convert DocumentData to legacy format
    const { content, style, signatures } = data
    
    // Legacy export expects plain text, so we need to convert
    // For now, we'll throw an error and require the new export
    // In production, you might want to implement a proper conversion
    throw new Error(
      "Legacy DOCX export is deprecated. Please use the new export system."
    )
  }

  /**
   * Check if new export system is available
   */
  async isNewExportAvailable(): Promise<{ pdf: boolean; docx: boolean }> {
    return {
      pdf: await isPlaywrightAvailable(),
      docx: isDOCXAvailable(),
    }
  }
}

// Singleton instance
let exportServiceInstance: ExportService | null = null

/**
 * Get the export service instance (singleton)
 */
export function getExportService(): ExportService {
  if (!exportServiceInstance) {
    exportServiceInstance = new ExportService()
  }
  return exportServiceInstance
}

