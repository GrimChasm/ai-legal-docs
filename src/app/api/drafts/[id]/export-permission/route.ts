/**
 * Check Export Permission API Route
 * 
 * GET /api/drafts/[id]/export-permission
 * 
 * Returns whether the current user can export this document.
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-helper"
import { canExportDocument } from "@/lib/export-permissions"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id: draftId } = await params
    const canExport = await canExportDocument(session.user.id, draftId)

    return NextResponse.json({
      canExport,
      draftId,
    })
  } catch (error: any) {
    console.error("Error checking export permission:", error)
    return NextResponse.json(
      { error: "Failed to check export permission" },
      { status: 500 }
    )
  }
}

