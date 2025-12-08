import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-helper"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const body = await request.json()
    const { email, role } = body

    const token = randomBytes(32).toString("hex")

    const share = await prisma.share.create({
      data: {
        draftId: id,
        userId: session.user.id,
        email,
        role: role || "viewer",
        token,
      },
    })

    // In a real app, you would send an email here with the share link
    const shareUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/shared/${token}`

    return NextResponse.json({ share, shareUrl })
  } catch (error: any) {
    console.error("Error sharing draft:", error)
    return NextResponse.json(
      { error: "Failed to share draft" },
      { status: 500 }
    )
  }
}

