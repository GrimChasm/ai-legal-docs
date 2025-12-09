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
    })

    // Fetch user details for collaborators with userId
    const formatted = await Promise.all(
      collaborators.map(async (collab) => {
        let name = collab.name
        let email = collab.email

        if (collab.userId) {
          const user = await prisma.user.findUnique({
            where: { id: collab.userId },
            select: { name: true, email: true },
          })
          if (user) {
            name = user.name || name || user.email
            email = user.email || email
          }
        }

        return {
          id: collab.id,
          name: name || email || "Unknown",
          email: email || "",
          role: collab.permission,
        }
      })
    )

    return NextResponse.json({ collaborators: formatted })
  } catch (error: any) {
    console.error("Error fetching collaborators:", error)
    return NextResponse.json(
      { error: "Failed to fetch collaborators" },
      { status: 500 }
    )
  }
}

