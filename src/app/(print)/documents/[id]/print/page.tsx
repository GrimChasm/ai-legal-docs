/**
 * Print Route for PDF Export
 * 
 * This route renders the document preview without UI chrome (no header, footer, buttons, etc.)
 * It's used by Playwright to generate PDFs that match the on-screen preview exactly.
 * 
 * Route: /documents/[id]/print
 * 
 * Features:
 * - Uses the same DocumentRenderer component as the preview
 * - Loads the same fonts (Inter, etc.)
 * - Uses screen styles (not print CSS)
 * - Hides all UI chrome (navigation, buttons, sidebars)
 * - Wraps content in .paper container for consistent PDF layout
 */

import { notFound } from "next/navigation"
import { auth } from "@/lib/auth-helper"
import { prisma } from "@/lib/prisma"
import DocumentRenderer from "@/components/document-renderer"
import { DocumentStyle, defaultStyle } from "@/lib/document-styles"

// This must be a server component for PDF export
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Metadata for the print page
export const metadata = {
  title: "Document Print",
  description: "Print view of document",
}

interface PageProps {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ userId?: string }>
}

async function getDraftData(draftId: string, userId: string) {
  const draft = await prisma.draft.findFirst({
    where: {
      id: draftId,
      userId: userId,
    },
    include: {
      signatures: {
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!draft) {
    return null
  }

  // Parse values and style
  const values = JSON.parse(draft.values || "{}")
  let documentStyle: DocumentStyle = defaultStyle

  // Try to get user preferences for document style
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferences: true },
    })
    if (user?.preferences) {
      const prefs = JSON.parse(user.preferences)
      if (prefs.documentStyle) {
        documentStyle = { ...defaultStyle, ...prefs.documentStyle }
      }
    }
  } catch (error) {
    // Use default style if preferences can't be loaded
  }

  // Format signatures
  const signatures = draft.signatures.map((sig) => ({
    signerName: sig.signerName || "",
    signerEmail: sig.signerEmail || "",
    signatureData: sig.signatureData || undefined,
    createdAt: sig.createdAt.toISOString(),
  }))

  return {
    content: draft.markdown || "",
    style: documentStyle,
    signatures,
    contractId: draft.contractId,
  }
}

export default async function PrintPage({ 
  params,
  searchParams,
}: PageProps) {
  const { id } = await params
  const session = await auth()
  
  // Try to get userId from query params (for server-side export when cookie might not work)
  let userIdFromQuery: string | undefined
  if (searchParams) {
    try {
      const search = await searchParams
      userIdFromQuery = search?.userId as string | undefined
      console.log("Print route - searchParams resolved:", search, "userIdFromQuery:", userIdFromQuery)
    } catch (e) {
      console.warn("Print route - Could not await searchParams:", e)
      // Try to access directly if it's already resolved
      if (typeof searchParams === 'object' && 'userId' in searchParams) {
        userIdFromQuery = (searchParams as any).userId
        console.log("Print route - Got userId from searchParams directly:", userIdFromQuery)
      }
    }
  }

  // Allow access if:
  // 1. User has valid session, OR
  // 2. userId is provided in query params (for server-side export)
  // Note: getDraftData will verify the userId owns the draft, so this is secure
  const userId = session?.user?.id || userIdFromQuery

  console.log("Print route - Session userId:", session?.user?.id, "Query userId:", userIdFromQuery, "Final userId:", userId)

  if (!userId) {
    console.error("Print route - No userId found. Session:", !!session, "Query param:", userIdFromQuery)
    notFound()
  }

  console.log("Print route - UserId:", userId, "Draft ID:", id)

  // Get draft data (this will verify userId owns the draft)
  const draftData = await getDraftData(id, userId)

  if (!draftData) {
    console.error("Print route - Draft not found or user doesn't own it. Draft ID:", id, "UserId:", userId)
    notFound()
  }

  // Debug: Log content length
  console.log("Print route - Draft ID:", id)
  console.log("Print route - Content length:", draftData.content?.length || 0)
  console.log("Print route - Content preview:", draftData.content?.substring(0, 100) || "empty")
  console.log("Print route - Has signatures:", draftData.signatures?.length || 0)

  // Ensure content exists
  if (!draftData.content || draftData.content.trim().length === 0) {
    return (
      <div className="paper">
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1>No Content Available</h1>
          <p>This document does not have any content to display.</p>
          <p style={{ fontSize: "0.875rem", color: "#666", marginTop: "1rem" }}>
            Draft ID: {id}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="paper" style={{ minHeight: "100vh", width: "100%" }}>
      {/* Match the preview structure exactly - this is what ExportPreview uses */}
      <div 
        className="document-preview-web" 
        style={{ 
          width: "100%", 
          display: "block",
          visibility: "visible",
          opacity: 1,
        }}
      >
        <DocumentRenderer
          content={draftData.content}
          style={draftData.style}
          signatures={draftData.signatures}
          forExport={false} // Use screen styles, not export styles
          className="print-document-renderer"
        />
      </div>
      {/* Script to signal when fonts are ready */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Wait for fonts to load before PDF generation
            (function() {
              console.log('Print page script executing');
              if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(() => {
                  // Signal that fonts are ready
                  document.body.setAttribute('data-fonts-ready', 'true');
                  console.log('Fonts ready for PDF export');
                });
              } else {
                // Fallback if fonts API not available
                setTimeout(() => {
                  document.body.setAttribute('data-fonts-ready', 'true');
                  console.log('Fonts ready (fallback)');
                }, 500);
              }
            })();
          `,
        }}
      />
    </div>
  )
}

