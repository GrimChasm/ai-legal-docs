import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const collaborators = await prisma.collaborator.findMany({
      where: { draftId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    const formatted = collaborators.map((collab) => ({
      id: collab.id,
      name: collab.user.name || collab.user.email,
      email: collab.user.email,
      role: collab.role,
    }))

    return NextResponse.json({ collaborators: formatted })
  } catch (error: any) {
    console.error("Error fetching collaborators:", error)
    return NextResponse.json(
      { error: "Failed to fetch collaborators" },
      { status: 500 }
    )
  }
}

