import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-helper"
import { prisma } from "@/lib/prisma"
import { validateId, validateContractId, validateValues } from "@/lib/validation"
import { checkRateLimit, getRateLimitHeaders, RATE_LIMITS } from "@/lib/rate-limit"

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = checkRateLimit(request, RATE_LIMITS.DRAFTS)
  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: "Too many requests. Please try again later.",
        retryAfter: rateLimitResult.retryAfter,
      },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult),
      }
    )
  }

  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate user ID exists and is a non-empty string
    // We trust NextAuth's session validation, so we just need basic checks
    if (!session.user.id || typeof session.user.id !== "string" || session.user.id.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid user session. Please sign in again." },
        { status: 401 }
      )
    }

    const drafts = await prisma.draft.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json({ drafts })
  } catch (error: any) {
    console.error("Error fetching drafts:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = checkRateLimit(request, RATE_LIMITS.DRAFTS)
  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: "Too many requests. Please try again later.",
        retryAfter: rateLimitResult.retryAfter,
      },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult),
      }
    )
  }

  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate user ID exists and is a non-empty string
    if (typeof session.user.id !== "string" || session.user.id.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid user session. Please sign in again." },
        { status: 401 }
      )
    }

    // Verify the user exists in the database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please sign in again." },
        { status: 404 }
      )
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

    const draft = await prisma.draft.create({
      data: {
        userId: session.user.id,
        contractId,
        values: JSON.stringify(values),
        markdown: finalHtml || "", // Store HTML in markdown field (we'll migrate schema later if needed)
      },
    })

    return NextResponse.json({ draft }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating draft:", error)
    
    // Provide more specific error messages
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "User not found. Please sign in again." },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

