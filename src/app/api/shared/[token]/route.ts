import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const share = await prisma.share.findUnique({
      where: { token: params.token },
      include: {
        draft: true,
      },
    })

    if (!share) {
      return NextResponse.json({ error: "Share not found" }, { status: 404 })
    }

    // Check if share has expired
    if (share.expiresAt && share.expiresAt < new Date()) {
      return NextResponse.json({ error: "Share has expired" }, { status: 410 })
    }

    const draft = share.draft
    const values = JSON.parse(draft.values || "{}")

    return NextResponse.json({
      draft: {
        id: draft.id,
        contractId: draft.contractId,
        values,
        markdown: draft.markdown,
        createdAt: draft.createdAt.toISOString(),
        updatedAt: draft.updatedAt.toISOString(),
      },
      share: {
        role: share.role,
        email: share.email,
      },
    })
  } catch (error: any) {
    console.error("Error fetching shared draft:", error)
    return NextResponse.json(
      { error: "Failed to fetch shared draft" },
      { status: 500 }
    )
  }
}

