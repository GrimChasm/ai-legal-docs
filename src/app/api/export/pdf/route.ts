/**
 * PDF Export API Endpoint
 * 
 * This endpoint handles server-side PDF export using Playwright.
 * It renders the /documents/[id]/print route to generate a PDF that matches the preview exactly.
 * 
 * POST /api/export/pdf
 * Body: {
 *   draftId: string (required) - Draft ID to export
 *   format?: "Letter" | "A4"
 *   margin?: { top, right, bottom, left }
 * }
 * 
 * Returns: PDF file as binary
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-helper"
import { exportToPDFFromPrintRoute } from "@/server/export/pdf"
import { cookies } from "next/headers"

export const runtime = "nodejs" // Required for Playwright

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { draftId, format, margin } = body

    // Validate required fields
    if (!draftId) {
      return NextResponse.json(
        { error: "draftId is required" },
        { status: 400 }
      )
    }

    // Get session cookie for authentication in Playwright
    // Try multiple methods to get the session cookie
    const cookieStore = await cookies()
    let sessionCookie: string | undefined
    
    // Method 1: Try from X-Session-Cookie header (passed from client)
    const sessionCookieHeader = request.headers.get("X-Session-Cookie")
    if (sessionCookieHeader) {
      try {
        const cookies = JSON.parse(sessionCookieHeader)
        // Find the session cookie
        const cookieName = Object.keys(cookies).find(name => 
          name.includes("session") || name.includes("auth")
        )
        if (cookieName && cookies[cookieName]) {
          sessionCookie = cookies[cookieName]
          console.log("Found session cookie from header:", cookieName)
        }
      } catch (e) {
        console.warn("Failed to parse X-Session-Cookie header:", e)
      }
    }
    
    // Method 2: Try all possible cookie names from request
    if (!sessionCookie) {
      const possibleCookieNames = [
        "next-auth.session-token",
        "__Secure-next-auth.session-token",
        "authjs.session-token",
        "__Secure-authjs.session-token",
      ]
      
      for (const cookieName of possibleCookieNames) {
        const cookie = request.cookies.get(cookieName)
        if (cookie?.value) {
          sessionCookie = cookie.value
          console.log("Found session cookie from request:", cookieName)
          break
        }
      }
    }
    
    // Method 3: Try from cookies() helper
    if (!sessionCookie) {
      const possibleCookieNames = [
        "next-auth.session-token",
        "__Secure-next-auth.session-token",
        "authjs.session-token",
        "__Secure-authjs.session-token",
      ]
      
      for (const cookieName of possibleCookieNames) {
        const cookie = cookieStore.get(cookieName)
        if (cookie?.value) {
          sessionCookie = cookie.value
          console.log("Found session cookie from cookieStore:", cookieName)
          break
        }
      }
    }
    
    // Method 4: Try to find any cookie with "session" or "auth" in the name
    if (!sessionCookie) {
      const allCookies = cookieStore.getAll()
      const sessionCookieEntry = allCookies.find(cookie => 
        cookie.name.includes("session") || cookie.name.includes("auth")
      )
      if (sessionCookieEntry) {
        sessionCookie = sessionCookieEntry.value
        console.log("Found session cookie by name pattern:", sessionCookieEntry.name)
      }
    }

    if (!sessionCookie) {
      console.error("Session cookie not found. Debug info:", {
        hasSession: !!session,
        userId: session?.user?.id,
        requestCookieNames: request.cookies.getAll().map(c => c.name),
        cookieStoreNames: cookieStore.getAll().map(c => c.name),
        hasHeader: !!sessionCookieHeader,
      })
      // Since we have a valid session, we can still proceed but Playwright won't be authenticated
      // This might work if the print route doesn't require authentication
      console.warn("Proceeding without session cookie - print route may fail if it requires auth")
      sessionCookie = "" // Empty string as fallback
    }

    // Export to PDF using print route
    // Pass userId to bypass cookie authentication requirement
    const pdfBuffer = await exportToPDFFromPrintRoute(
      draftId, 
      sessionCookie || "", // May be empty, but we'll use userId query param instead
      {
        format,
        margin,
        userId: session.user.id, // Pass userId to print route
      }
    )

    // Get draft title for filename (optional)
    let filename = "document.pdf"
    try {
      const { prisma } = await import("@/lib/prisma")
      const draft = await prisma.draft.findFirst({
        where: {
          id: draftId,
          userId: session.user.id,
        },
        select: { contractId: true },
      })
      if (draft?.contractId) {
        const titleSlug = draft.contractId.replace(/[^a-z0-9]/gi, "_").toLowerCase()
        filename = `${titleSlug}-${new Date().toISOString().split("T")[0]}.pdf`
      }
    } catch (error) {
      // Use default filename if we can't get draft title
      console.warn("Could not get draft title for filename:", error)
    }

    // Return PDF file
    // Convert Buffer to Uint8Array for NextResponse compatibility
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error: any) {
    console.error("PDF export error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to export PDF" },
      { status: 500 }
    )
  }
}

