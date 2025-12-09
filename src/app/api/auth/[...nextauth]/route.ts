import { handlers } from "@/lib/auth-helper"
import { NextRequest, NextResponse } from "next/server"

// Wrap handlers to ensure JSON responses on errors
export const GET = async (req: NextRequest) => {
  try {
    return await handlers.GET(req)
  } catch (error: any) {
    console.error("NextAuth GET error:", error)
    return NextResponse.json(
      { error: error?.message || "Authentication error" },
      { status: 500 }
    )
  }
}

export const POST = async (req: NextRequest) => {
  try {
    return await handlers.POST(req)
  } catch (error: any) {
    console.error("NextAuth POST error:", error)
    return NextResponse.json(
      { error: error?.message || "Authentication error" },
      { status: 500 }
    )
  }
}
