import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-helper"
import { prisma } from "@/lib/prisma"

/**
 * POST /api/signatures
 * Create a new signature for a document
 * 
 * Body:
 * - draftId: string
 * - signerName: string
 * - signerEmail: string
 * - signatureData: string (base64 image)
 * - signatureType: "drawn" | "typed" | "uploaded"
 * - role: "creator" | "counterparty"
 * - typedText?: string (optional, for typed signatures)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { draftId, signerName, signerEmail, signatureData, signatureType, role, typedText } = body

    // Validate required fields
    if (!draftId || !signerName || !signerEmail || !signatureData || !signatureType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Verify draft exists and user has access
    const draft = await prisma.draft.findUnique({
      where: { id: draftId },
    })

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    // Check if user is the owner or has permission
    if (draft.userId !== session.user.id && role !== "counterparty") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get IP address if available
    const ipAddress = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     null

    // Create signature
    // Verify signature model exists
    if (!prisma.signature) {
      console.error("Prisma signature model not available. Please restart the dev server.")
      return NextResponse.json(
        { error: "Signature model not available. Please restart the server." },
        { status: 500 }
      )
    }

    const signature = await prisma.signature.create({
      data: {
        draftId,
        signerName,
        signerEmail,
        signatureData,
        signatureType,
        role: role || "creator",
        ipAddress,
      },
    })

    return NextResponse.json({ signature }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating signature:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create signature" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/signatures?draftId=xxx
 * Get all signatures for a document
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const draftId = searchParams.get("draftId")

    if (!draftId) {
      return NextResponse.json(
        { error: "draftId is required" },
        { status: 400 }
      )
    }

    // Verify draft exists and user has access
    const draft = await prisma.draft.findUnique({
      where: { id: draftId },
    })

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    if (draft.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get signatures
    const signatures = await prisma.signature.findMany({
      where: { draftId },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json({ signatures })
  } catch (error: any) {
    console.error("Error fetching signatures:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch signatures" },
      { status: 500 }
    )
  }
}
