import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-helper"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const comments = await prisma.comment.findMany({
      where: { draftId: id },
      orderBy: { createdAt: "desc" },
    })

    const formattedComments = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      userId: comment.authorId,
      userName: comment.user?.name || comment.user?.email || comment.authorName || "Unknown",
      createdAt: comment.createdAt.toISOString(),
      resolved: comment.resolved,
    }))

    return NextResponse.json({ comments: formattedComments })
  } catch (error: any) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

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

    const body = await request.json()
    const { content, x, y } = body

    const comment = await prisma.comment.create({
      data: {
        draftId: id,
        authorId: session.user.id,
        authorName: session.user.name || session.user.email || "Unknown",
        authorEmail: session.user.email || null,
        content,
        position: x && y ? JSON.stringify({ x, y }) : null,
      },
    })

    return NextResponse.json({
      comment: {
        id: comment.id,
        content: comment.content,
        userId: comment.authorId,
        userName: comment.user?.name || comment.user?.email || comment.authorName || "Unknown",
        createdAt: comment.createdAt.toISOString(),
        resolved: comment.resolved,
      },
    })
  } catch (error: any) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    )
  }
}

