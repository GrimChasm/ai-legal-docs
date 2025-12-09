import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-helper"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { commentId } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    if (comment.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { content, resolved } = body

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content: content !== undefined ? content : undefined,
        resolved: resolved !== undefined ? resolved : undefined,
      },
    })

    return NextResponse.json({
      comment: {
        id: updated.id,
        content: updated.content,
        userId: updated.authorId,
        userName: updated.authorName,
        createdAt: updated.createdAt.toISOString(),
        resolved: updated.resolved,
      },
    })
  } catch (error: any) {
    console.error("Error updating comment:", error)
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { commentId } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    if (comment.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.comment.delete({
      where: { id: commentId },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting comment:", error)
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    )
  }
}

