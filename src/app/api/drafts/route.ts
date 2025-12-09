import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-helper"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

    const { contractId, values, markdown } = await request.json()

    if (!contractId || !values) {
      return NextResponse.json(
        { error: "contractId and values are required" },
        { status: 400 }
      )
    }

    const draft = await prisma.draft.create({
      data: {
        userId: session.user.id,
        contractId,
        values: JSON.stringify(values),
        markdown: markdown || "",
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

