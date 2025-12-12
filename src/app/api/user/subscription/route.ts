/**
 * Get User Subscription Status API Route
 * 
 * Returns the current user's subscription status and plan information.
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-helper"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        isPro: true,
        subscriptionStatus: true,
        stripePriceId: true,
        stripeCurrentPeriodEnd: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      isPro: user.isPro,
      subscriptionStatus: user.subscriptionStatus,
      stripePriceId: user.stripePriceId,
      stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.toISOString() || null,
    })
  } catch (error: any) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json(
      { error: "Failed to fetch subscription status" },
      { status: 500 }
    )
  }
}





