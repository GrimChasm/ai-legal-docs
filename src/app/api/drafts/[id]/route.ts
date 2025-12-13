import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-helper"
import { prisma } from "@/lib/prisma"
import { generateDocumentDiff, formatChangesForEmail } from "@/lib/html-diff"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const draft = await prisma.draft.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    return NextResponse.json({ draft })
  } catch (error: any) {
    console.error("Error fetching draft:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    const { contractId, values, html, markdown } = body

    // Validate required fields
    if (!contractId || !values) {
      return NextResponse.json(
        { error: "contractId and values are required" },
        { status: 400 }
      )
    }

    // Validate contractId format
    const { validateContractId, validateValues } = await import("@/lib/validation")
    const contractIdValidation = validateContractId(contractId)
    if (!contractIdValidation.valid) {
      return NextResponse.json(
        { error: contractIdValidation.error },
        { status: 400 }
      )
    }

    // Validate values object
    const valuesValidation = validateValues(values)
    if (!valuesValidation.valid) {
      return NextResponse.json(
        { error: valuesValidation.error },
        { status: 400 }
      )
    }

    // Validate html if provided (allow null, undefined, or string)
    if (html !== undefined && html !== null && typeof html !== "string") {
      return NextResponse.json(
        { error: "html must be a string" },
        { status: 400 }
      )
    }

    // Validate markdown if provided (allow null, undefined, or string) - for backward compatibility
    if (markdown !== undefined && markdown !== null && typeof markdown !== "string") {
      return NextResponse.json(
        { error: "markdown must be a string" },
        { status: 400 }
      )
    }

    // Prefer HTML over markdown, but convert markdown to HTML if only markdown is provided
    let finalHtml = html || ""
    if (!finalHtml && markdown) {
      // Import markdown converter
      const { markdownToHTML } = await import("@/lib/markdown-to-html")
      finalHtml = markdownToHTML(markdown)
    }

    // Check if draft exists and belongs to user
    const existingDraft = await prisma.draft.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingDraft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    // Check if all parties have signed - if so, prevent edits
    const [signatures, invites] = await Promise.all([
      prisma.signature.findMany({
        where: { draftId: id },
      }),
      prisma.signatureInvite.findMany({
        where: { draftId: id },
      }),
    ])

    // Check if user has signed
    const userSigned = signatures.some(sig => 
      sig.role === "creator" || 
      (session.user.email && sig.signerEmail?.toLowerCase() === session.user.email.toLowerCase() && sig.role !== "counterparty")
    )

    // Check if all recipients have signed
    const allRecipientsSigned = invites.length > 0 && invites.every(invite => invite.status === "signed")

    // All parties signed = user signed AND all recipients signed (if there are any)
    const allPartiesSigned = userSigned && (invites.length === 0 || allRecipientsSigned)

    if (allPartiesSigned) {
      return NextResponse.json(
        { error: "Cannot edit document: All parties have signed. The document is legally binding and cannot be modified. If changes are needed, create a new version or amendment." },
        { status: 403 }
      )
    }

    // Check if content has changed and if there are signed recipients
    const oldHtml = existingDraft.markdown || ""
    const contentChanged = finalHtml && finalHtml !== oldHtml

    // Update the draft and return the updated draft
    const updatedDraft = await prisma.draft.update({
      where: {
        id,
      },
      data: {
        contractId,
        values: JSON.stringify(values),
        markdown: finalHtml || (markdown !== undefined ? (markdown || "") : undefined), // Store HTML in markdown field
        updatedAt: new Date(),
      },
    })

    // If content changed and there are signed recipients, notify them
    if (contentChanged && finalHtml) {
      try {
        await notifySignedRecipientsOfChanges(
          id,
          oldHtml,
          finalHtml,
          session.user.id
        )
      } catch (error) {
        // Log error but don't fail the update
        console.error("Error notifying recipients of document changes:", error)
      }
    }

    return NextResponse.json({ draft: updatedDraft })
  } catch (error: any) {
    console.error("Error updating draft:", error)
    
    // Provide more specific error messages
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Draft not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.draft.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ message: "Draft deleted" })
  } catch (error: any) {
    console.error("Error deleting draft:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * Notify all signed recipients when a document is changed
 */
async function notifySignedRecipientsOfChanges(
  draftId: string,
  oldHtml: string,
  newHtml: string,
  senderUserId: string
): Promise<void> {
  // Generate diff
  const diff = generateDocumentDiff(oldHtml, newHtml)
  
  if (!diff.hasChanges) {
    return // No changes, no need to notify
  }

  // Get all signature invites where recipient has signed (include token for view URL)
  const signedInvites = await prisma.signatureInvite.findMany({
    where: {
      draftId,
      status: "signed",
      signedAt: { not: null },
    },
    select: {
      recipientName: true,
      recipientEmail: true,
      token: true, // Include token to generate view URL
    },
  })

  if (signedInvites.length === 0) {
    return // No signed recipients to notify
  }

  // Get sender info
  const sender = await prisma.user.findUnique({
    where: { id: senderUserId },
    select: { name: true, email: true },
  })

  // Get draft info for document title
  const draft = await prisma.draft.findUnique({
    where: { id: draftId },
    select: { contractId: true },
  })

  const documentTitle = draft?.contractId || "Document"

  // Generate base URL
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  // Format changes for email
  const changesHtml = formatChangesForEmail(diff.changes)

  // Import email module
  const emailModule = await import("@/lib/email").catch(() => null)
  if (!emailModule) {
    console.warn("Email module not available, cannot send change notifications")
    return
  }

  // Send notification to each signed recipient
  const notificationPromises = signedInvites.map(async (invite) => {
    try {
      // Generate view URL using the recipient's signature invite token
      // This allows them to view the document without needing to log in
      const viewUrl = `${baseUrl}/sign/${invite.token}`
      
      const emailHtml = emailModule.generateDocumentChangeEmail(
        invite.recipientName,
        documentTitle,
        viewUrl,
        diff.summary,
        changesHtml,
        sender?.name || sender?.email || "ContractVault User"
      )

      await emailModule.sendEmail({
        to: invite.recipientEmail,
        subject: `Document Updated: ${documentTitle}`,
        html: emailHtml,
      })

      console.log(`Change notification sent to ${invite.recipientEmail}`)
    } catch (error) {
      console.error(`Failed to send change notification to ${invite.recipientEmail}:`, error)
      // Continue with other recipients even if one fails
    }
  })

  await Promise.allSettled(notificationPromises)
}

