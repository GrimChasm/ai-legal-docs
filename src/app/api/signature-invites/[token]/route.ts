import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/signature-invites/[token]
 * Get signature invite details by token (public endpoint for signing page)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    const invite = await prisma.signatureInvite.findUnique({
      where: { token },
      include: {
        draft: {
          select: {
            id: true,
            contractId: true,
            markdown: true,
            values: true,
          },
        },
      },
    })

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 })
    }

    // Check if already signed
    if (invite.status === "signed") {
      return NextResponse.json(
        { error: "This document has already been signed" },
        { status: 400 }
      )
    }

    return NextResponse.json({ invite })
  } catch (error: any) {
    console.error("Error fetching signature invite:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch invite" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/signature-invites/[token]
 * Submit signature for an invite
 * 
 * Body:
 * - signerName: string
 * - signerEmail: string
 * - signatureData: string (base64 image)
 * - signatureType: "drawn" | "typed" | "uploaded"
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const body = await request.json()
    const { signerName, signerEmail, signatureData, signatureType } = body

    // Validate required fields
    if (!signerName || !signerEmail || !signatureData || !signatureType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Normalize email to lowercase (emails are case-insensitive)
    const normalizedSignerEmail = signerEmail.trim().toLowerCase()

    // Get invite
    const invite = await prisma.signatureInvite.findUnique({
      where: { token },
    })

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 })
    }

    // Check if already signed
    if (invite.status === "signed") {
      return NextResponse.json(
        { error: "This document has already been signed" },
        { status: 400 }
      )
    }

    // Get IP address
    const ipAddress = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     null

    // Create signature
    const signature = await prisma.signature.create({
      data: {
        draftId: invite.draftId,
        signerName,
        signerEmail: normalizedSignerEmail, // Store normalized (lowercase) email
        signatureData,
        signatureType,
        role: "counterparty",
        ipAddress,
      },
    })

    // Update invite status
    await prisma.signatureInvite.update({
      where: { id: invite.id },
      data: {
        status: "signed",
        signedAt: new Date(),
      },
    })

    return NextResponse.json({ signature }, { status: 201 })
  } catch (error: any) {
    console.error("Error submitting signature:", error)
    return NextResponse.json(
      { error: error.message || "Failed to submit signature" },
      { status: 500 }
    )
  }
}

