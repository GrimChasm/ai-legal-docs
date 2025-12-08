import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-helper"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const { id, versionId } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const draft = await prisma.draft.findUnique({
      where: { id },
    })

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    if (draft.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const version = await prisma.version.findUnique({
      where: { id: versionId },
    })

    if (!version) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 })
    }

    if (version.draftId !== id) {
      return NextResponse.json({ error: "Version does not belong to this draft" }, { status: 400 })
    }

    return NextResponse.json({ version })
  } catch (error: any) {
    console.error("Error fetching version:", error)
    return NextResponse.json(
      { error: "Failed to fetch version" },
      { status: 500 }
    )
  }
}

