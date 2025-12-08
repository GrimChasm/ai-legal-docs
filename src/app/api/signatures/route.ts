import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-helper"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { draftId, signerEmail, signerName, provider } = body

    const draft = await prisma.draft.findUnique({
      where: { id: draftId },
    })

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    if (draft.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // In a real implementation, you would integrate with DocuSign or HelloSign here
    // For now, we'll just create a signature request record
    const signatureRequest = await prisma.signatureRequest.create({
      data: {
        draftId,
        userId: session.user.id,
        provider: provider || "docusign",
        signerEmail,
        signerName,
        status: "pending",
      },
    })

    // TODO: Integrate with actual signature provider API
    // This is a placeholder - you would call DocuSign/HelloSign API here

    return NextResponse.json({ signatureRequest })
  } catch (error: any) {
    console.error("Error creating signature request:", error)
    return NextResponse.json(
      { error: "Failed to create signature request" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const draftId = searchParams.get("draftId")

    const where: any = { userId: session.user.id }
    if (draftId) {
      where.draftId = draftId
    }

    const requests = await prisma.signatureRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ requests })
  } catch (error: any) {
    console.error("Error fetching signature requests:", error)
    return NextResponse.json(
      { error: "Failed to fetch signature requests" },
      { status: 500 }
    )
  }
}

