import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-helper"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

// Dynamic import for email to avoid issues if module fails to load
let emailModule: typeof import("@/lib/email") | null = null
async function getEmailModule() {
  if (!emailModule) {
    try {
      emailModule = await import("@/lib/email")
    } catch (error) {
      console.error("Failed to load email module:", error)
      // Return a fallback module
      return {
        sendEmail: async () => {
          console.warn("Email module not available")
          return false
        },
        generateSignatureInviteEmail: () => "",
      }
    }
  }
  return emailModule
}

/**
 * POST /api/signature-invites
 * Create a signature invite (send for signature)
 * 
 * Body:
 * - draftId: string
 * - recipientName: string
 * - recipientEmail: string
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { draftId, recipientName, recipientEmail } = body

    // Validate required fields
    if (!draftId || !recipientName || !recipientEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Normalize email to lowercase (emails are case-insensitive)
    const normalizedEmail = recipientEmail.trim().toLowerCase()

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Verify draft exists and user owns it
    const draft = await prisma.draft.findUnique({
      where: { id: draftId },
    })

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    if (draft.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Generate unique token
    const token = randomBytes(32).toString("hex")

    // Get sender info for email
    const sender = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true },
    })

    // Create signature invite
    const invite = await prisma.signatureInvite.create({
      data: {
        draftId,
        senderUserId: session.user.id,
        recipientName,
        recipientEmail: normalizedEmail, // Store normalized (lowercase) email
        token,
        status: "pending",
      },
    })

    // Generate signing URL
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const signingUrl = `${baseUrl}/sign/${token}`

    // Send email invitation
    const documentTitle = draft.contractId || "Document"
    let emailSent = false
    let emailError: string | null = null
    
    try {
      const email = await getEmailModule()
      emailSent = await email.sendEmail({
        to: normalizedEmail, // Use normalized (lowercase) email
        subject: `Signature Request: ${documentTitle}`,
        html: email.generateSignatureInviteEmail(
          recipientName,
          documentTitle,
          signingUrl,
          sender?.name || sender?.email || "ContractVault User"
        ),
      })
      
      if (!emailSent) {
        // Check if email service is configured
        const hasEmailConfig = 
          process.env.RESEND_API_KEY || 
          (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
        
        if (!hasEmailConfig) {
          emailError = "EMAIL_NOT_CONFIGURED"
        } else {
          emailError = "EMAIL_SEND_FAILED"
        }
      }
    } catch (emailError_) {
      // Log email error but don't fail the invite creation
      console.error("Error sending email (invite still created):", emailError_)
      emailError = "EMAIL_SEND_ERROR"
    }

    return NextResponse.json({ 
      invite,
      signingUrl, // Include URL in response (useful for testing or manual sharing)
      emailSent, // Indicate if email was sent successfully
      emailError, // Error message if email failed
    }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating signature invite:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create signature invite" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/signature-invites?draftId=xxx
 * Get all signature invites for a document
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

    // Verify draft exists and user owns it
    const draft = await prisma.draft.findUnique({
      where: { id: draftId },
    })

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    if (draft.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get signature invites
    const invites = await prisma.signatureInvite.findMany({
      where: { draftId },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ invites })
  } catch (error: any) {
    console.error("Error fetching signature invites:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch signature invites" },
      { status: 500 }
    )
  }
}

