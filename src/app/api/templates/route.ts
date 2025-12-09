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

    // Validate required fields
    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Description is optional in the database, but we'll still validate it's provided
    if (!description || !description.trim()) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 })
    }

    if (!formSchema || Object.keys(formSchema).length === 0) {
      return NextResponse.json({ error: "At least one form field is required" }, { status: 400 })
    }

    if (!templateCode || !templateCode.trim()) {
      return NextResponse.json({ error: "Template code is required. Please generate the template code first." }, { status: 400 })
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found. Please sign in again." }, { status: 404 })
    }

    const template = await prisma.template.create({
      data: {
        userId: session.user.id,
        title: title.trim(),
        description: description.trim(),
        formSchema: JSON.stringify(formSchema),
        templateCode: templateCode.trim(),
        category: category?.trim() || null,
        documentType: documentType?.trim() || null,
        industry: industry?.trim() || null,
        isPublic: isPublic || false,
      },
    })

    return NextResponse.json({ template })
  } catch (error: any) {
    console.error("Error creating template:", error)
    
    // Return more specific error messages
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A template with this title already exists. Please choose a different title." },
        { status: 400 }
      )
    }
    
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "User not found. Please sign in again." },
        { status: 404 }
      )
    }

    // Return the actual error message if available
    return NextResponse.json(
      { error: error.message || "Failed to create template. Please check all fields are filled correctly." },
      { status: 500 }
    )
  }
}

