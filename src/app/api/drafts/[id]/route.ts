import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-helper"
import { prisma } from "@/lib/prisma"

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

