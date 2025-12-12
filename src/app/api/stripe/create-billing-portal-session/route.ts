/**
 * Create Stripe Billing Portal Session API Route
 * 
 * This endpoint creates a Stripe Billing Portal session so users can manage their subscription.
 * 
 * POST /api/stripe/create-billing-portal-session
 * 
 * Returns: { url: string } - The Stripe Billing Portal URL to redirect to
 * 
 * SETUP INSTRUCTIONS:
 * 1. In Stripe Dashboard, go to: Settings > Billing > Customer portal
 * 2. Configure the portal settings (what customers can do)
 * 3. Make sure you have a return URL configured
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-helper"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to continue." },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        stripeCustomerId: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please sign in again." },
        { status: 404 }
      )
    }

    if (!user.stripeCustomerId) {
      return NextResponse.json(
        { error: "No active subscription found." },
        { status: 400 }
      )
    }

    // Get the origin URL for return redirect
    const origin = request.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000"

    // Create Billing Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${origin}/billing`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error: any) {
    console.error("Error creating billing portal session:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to create billing portal session. Please try again.",
      },
      { status: 500 }
    )
  }
}





