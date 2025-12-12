/**
 * Subscription Access Control Helpers
 * 
 * Use these functions to check if a user has Pro access and gate premium features.
 * 
 * Example usage:
 * 
 * // In an API route:
 * import { requirePro } from "@/lib/subscription"
 * 
 * export async function GET(request: NextRequest) {
 *   const user = await requirePro(request)
 *   // User is guaranteed to have Pro access here
 *   // ... your premium feature code
 * }
 * 
 * // In a component:
 * import { useIsPro } from "@/lib/subscription"
 * 
 * function MyComponent() {
 *   const isPro = useIsPro()
 *   if (!isPro) {
 *     return <UpgradePrompt />
 *   }
 *   return <PremiumFeature />
 * }
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-helper"
import { prisma } from "@/lib/prisma"

/**
 * Get the current user's Pro status from the database
 * Use this in API routes to check subscription status
 */
export async function getUserProStatus(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isPro: true },
    })

    return user?.isPro ?? false
  } catch (error) {
    console.error("Error checking Pro status:", error)
    return false
  }
}

/**
 * Require Pro access in an API route
 * Returns the user if they have Pro access, otherwise returns an error response
 * 
 * Usage:
 * const user = await requirePro(request)
 * if (user instanceof NextResponse) {
 *   return user // This is an error response
 * }
 * // User has Pro access, continue...
 */
export async function requirePro(
  request: NextRequest
): Promise<{ id: string; email: string } | NextResponse> {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in." },
      { status: 401 }
    )
  }

  const isPro = await getUserProStatus(session.user.id)

  if (!isPro) {
    return NextResponse.json(
      {
        error: "Pro subscription required",
        message: "This feature requires a Pro subscription. Please upgrade to continue.",
        upgradeUrl: "/pricing",
      },
      { status: 403 }
    )
  }

  return {
    id: session.user.id,
    email: session.user.email!,
  }
}

/**
 * Check if user has Pro access (non-blocking)
 * Returns true if Pro, false otherwise
 */
export async function checkProAccess(userId: string): Promise<boolean> {
  return getUserProStatus(userId)
}

/**
 * Get user's subscription details
 */
export async function getUserSubscription(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isPro: true,
        subscriptionStatus: true,
        stripePriceId: true,
        stripeCurrentPeriodEnd: true,
        stripeSubscriptionId: true,
      },
    })

    return user
      ? {
          isPro: user.isPro,
          status: user.subscriptionStatus,
          priceId: user.stripePriceId,
          currentPeriodEnd: user.stripeCurrentPeriodEnd,
          subscriptionId: user.stripeSubscriptionId,
        }
      : null
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return null
  }
}





