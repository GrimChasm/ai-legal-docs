/**
 * DOCX Export API Endpoint
 * 
 * This endpoint handles server-side DOCX export.
 * 
 * POST /api/export/docx
 * Body: {
 *   draftId: string (required) - Draft ID to export
 *   OR
 *   content: string (HTML or markdown)
 *   style: DocumentStyle
 *   signatures?: SignatureData[]
 *   title?: string
 * }
 * 
 * Returns: DOCX file as binary
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-helper"
import { exportToDOCX } from "@/server/export/docx"
import { prisma } from "@/lib/prisma"
import { DocumentStyle, defaultStyle } from "@/lib/document-styles"

export const runtime = "nodejs" // Required for DOCX generation

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { draftId, content, style, signatures, title } = body

    let docxBuffer: Buffer
    let filename = "document.docx"

    // If draftId is provided, use it to get document data
    if (draftId) {
      // Get draft data
      const draft = await prisma.draft.findFirst({
        where: {
          id: draftId,
          userId: session.user.id,
        },
        include: {
          signatures: {
            orderBy: { createdAt: "asc" },
          },
        },
      })

      if (!draft) {
        return NextResponse.json(
          { error: "Draft not found" },
          { status: 404 }
        )
      }

      // Get document style
      let documentStyle: DocumentStyle = defaultStyle
      try {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { documentStyle: true },
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
      const signatureData = draft.signatures.map((sig) => ({
        signerName: sig.signerName || "",
        signerEmail: sig.signerEmail || "",
        signatureData: sig.signatureData || undefined,
        createdAt: sig.createdAt.toISOString(),
      }))

      // Export to DOCX
      docxBuffer = await exportToDOCX({
        content: draft.markdown || "",
        style: documentStyle,
        signatures: signatureData,
        title: draft.contractId,
      })

      // Generate filename
      const titleSlug = draft.contractId.replace(/[^a-z0-9]/gi, "_").toLowerCase()
      filename = `${titleSlug}-${new Date().toISOString().split("T")[0]}.docx`
    } else {
      // Legacy: use provided content and style
      if (!content || !style) {
        return NextResponse.json(
          { error: "Either draftId or (content and style) are required" },
          { status: 400 }
        )
      }

      // Validate style object
      const requiredStyleFields: (keyof DocumentStyle)[] = [
        "fontFamily",
        "fontSize",
        "lineSpacing",
        "paragraphSpacing",
        "headingStyle",
        "headingCase",
        "headingIndent",
        "layout",
        "numberingStyle",
      ]

      for (const field of requiredStyleFields) {
        if (!(field in style)) {
          return NextResponse.json(
            { error: `style.${field} is required` },
            { status: 400 }
          )
        }
      }

      // Export to DOCX
      docxBuffer = await exportToDOCX({
        content,
        style: style as DocumentStyle,
        signatures,
        title,
      })

      if (title) {
        const titleSlug = title.replace(/[^a-z0-9]/gi, "_").toLowerCase()
        filename = `${titleSlug}-${new Date().toISOString().split("T")[0]}.docx`
      }
    }

    // Return DOCX file
    return new NextResponse(docxBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error: any) {
    console.error("DOCX export error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to export DOCX" },
      { status: 500 }
    )
  }
}

