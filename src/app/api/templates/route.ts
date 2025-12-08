import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-helper"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const searchParams = request.nextUrl.searchParams
    const mine = searchParams.get("mine") === "true"
    const publicOnly = searchParams.get("public") === "true"

    const where: any = {}
    if (mine && session?.user?.id) {
      where.userId = session.user.id
    } else if (publicOnly) {
      where.isPublic = true
    } else if (session?.user?.id) {
      where.OR = [{ userId: session.user.id }, { isPublic: true }]
    } else {
      where.isPublic = true
    }

    const templates = await prisma.template.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ templates })
  } catch (error: any) {
    console.error("Error fetching templates:", error)
    return NextResponse.json(
      { error: "Failed to fetch templates" },
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

    const body = await request.json()
    const { title, description, formSchema, templateCode, category, documentType, industry, isPublic } = body

    const template = await prisma.template.create({
      data: {
        userId: session.user.id,
        title,
        description,
        formSchema: JSON.stringify(formSchema),
        templateCode,
        category,
        documentType,
        industry,
        isPublic: isPublic || false,
      },
    })

    return NextResponse.json({ template })
  } catch (error: any) {
    console.error("Error creating template:", error)
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    )
  }
}

