import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-helper"
import { prisma } from "@/lib/prisma"

/**
 * PATCH /api/signatures/[id]
 * Update signature position
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { position, customY } = body

    // Verify signature exists and user has access
    const signature = await prisma.signature.findUnique({
      where: { id },
      include: { draft: true },
    })

    if (!signature) {
      return NextResponse.json({ error: "Signature not found" }, { status: 404 })
    }

    // Verify user owns the draft
    if (signature.draft.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update signature position
    const updated = await prisma.signature.update({
      where: { id },
      data: {
        position: position || "bottom",
        customY: customY !== undefined ? customY : null,
      },
    })

    return NextResponse.json({ signature: updated }, { status: 200 })
  } catch (error: any) {
    console.error("Error updating signature position:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update signature position" },
      { status: 500 }
    )
  }
}

