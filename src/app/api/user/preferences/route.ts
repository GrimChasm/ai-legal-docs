import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-helper"
import { prisma } from "@/lib/prisma"
import { DocumentStyle } from "@/lib/document-styles"

/**
 * GET /api/user/preferences
 * Get user's document style preferences
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { documentStyle: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Parse document style if it exists
    let documentStyle: DocumentStyle | null = null
    if (user.documentStyle) {
      try {
        documentStyle = JSON.parse(user.documentStyle) as DocumentStyle
      } catch (error) {
        console.error("Error parsing document style:", error)
        // Return null if parsing fails
      }
    }

    return NextResponse.json({ documentStyle })
  } catch (error: any) {
    console.error("Error fetching user preferences:", error)
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/user/preferences
 * Update user's document style preferences
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { documentStyle } = body

    if (!documentStyle) {
      return NextResponse.json(
        { error: "Document style is required" },
        { status: 400 }
      )
    }

    // Validate document style structure
    const requiredFields: (keyof DocumentStyle)[] = [
      "fontFamily",
      "fontSize",
      "lineSpacing",
      "paragraphSpacing",
      "headingStyle",
      "headingCase",
      "headingIndent",
      "layout",
      "numberingStyle",
    ]

    for (const field of requiredFields) {
      if (!(field in documentStyle)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Update user's document style preference
    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        documentStyle: JSON.stringify(documentStyle),
      },
    })

    return NextResponse.json({
      success: true,
      documentStyle: JSON.parse(updated.documentStyle || "{}"),
    })
  } catch (error: any) {
    console.error("Error updating user preferences:", error)
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    )
  }
}

