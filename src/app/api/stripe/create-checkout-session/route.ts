/**
 * Create Stripe Checkout Session API Route
 * 
 * This endpoint creates a Stripe Checkout session for subscriptions or one-time payments.
 * 
 * POST /api/stripe/create-checkout-session
 * Body: {
 *   mode: "subscription" | "payment",
 *   productId: "PRO_MONTHLY" | "PRO_YEARLY" | "SINGLE_DOCUMENT",
 *   draftId?: string (optional, for one-time document unlocks)
 * }
 * 
 * Returns: { url: string } - The Stripe Checkout URL to redirect to
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-helper"
import { stripe } from "@/lib/stripe"
import { getPlan, getOneTimeProduct } from "@/lib/pricing"
import { prisma } from "@/lib/prisma"
import {
  validateRequestBody,
  validateEnum,
  validateId,
  validateEmail,
} from "@/lib/validation"
import { checkRateLimit, getRateLimitHeaders, RATE_LIMITS } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  // Rate limiting (strict for payment endpoints)
  const rateLimitResult = checkRateLimit(request, RATE_LIMITS.CHECKOUT)
  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: "Too many requests. Please try again later.",
        retryAfter: rateLimitResult.retryAfter,
      },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult),
      }
    )
  }

  try {
    // Get authenticated user
    const session = await auth()
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to continue." },
        { status: 401 }
      )
    }

    // Validate user ID and email
    const userIdValidation = validateId(session.user.id, "User ID")
    if (!userIdValidation.valid) {
      return NextResponse.json(
        { error: "Invalid user session. Please sign in again." },
        { status: 401 }
      )
    }

    const emailValidation = validateEmail(session.user.email, "Email")
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: "Invalid email address. Please sign in again." },
        { status: 401 }
      )
    }

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    const { mode, productId, draftId } = body

    // Validate required fields
    const bodyValidation = validateRequestBody(body, ["mode", "productId"])
    if (!bodyValidation.valid) {
      return NextResponse.json(
        { error: bodyValidation.error },
        { status: 400 }
      )
    }

    // Validate mode
    const modeValidation = validateEnum(mode, ["subscription", "payment"] as const, "mode")
    if (!modeValidation.valid) {
      return NextResponse.json(
        { error: modeValidation.error },
        { status: 400 }
      )
    }

    // Validate productId
    const productIdValidation = validateString(productId, "productId", 100)
    if (!productIdValidation.valid) {
      return NextResponse.json(
        { error: productIdValidation.error },
        { status: 400 }
      )
    }

    // Validate draftId if provided
    if (draftId !== undefined) {
      const draftIdValidation = validateId(draftId, "draftId")
      if (!draftIdValidation.valid) {
        return NextResponse.json(
          { error: draftIdValidation.error },
          { status: 400 }
        )
      }
    }

    let priceId: string
    let planLabel: string

    // Get price ID based on mode
    if (mode === "subscription") {
      const plan = getPlan(productId)
      if (!plan) {
        return NextResponse.json(
          { error: `Invalid plan: ${productId}. Please select a valid plan.` },
          { status: 400 }
        )
      }
      priceId = plan.priceId
      planLabel = plan.label
    } else {
      // One-time payment
      const product = getOneTimeProduct(productId)
      if (!product) {
        return NextResponse.json(
          { error: `Invalid product: ${productId}. Please select a valid product.` },
          { status: 400 }
        )
      }
      priceId = product.priceId
      planLabel = product.label

      // For one-time payments, draftId should be provided
      if (productId === "SINGLE_DOCUMENT" && !draftId) {
        return NextResponse.json(
          { error: "draftId is required for single document unlock" },
          { status: 400 }
        )
      }

      // Verify draft exists and belongs to user
      if (draftId) {
        const draft = await prisma.draft.findUnique({
          where: { id: draftId },
          select: { userId: true, hasPaidExport: true },
        })

        if (!draft) {
          return NextResponse.json(
            { error: "Document not found" },
            { status: 404 }
          )
        }

        if (draft.userId !== session.user.id) {
          return NextResponse.json(
            { error: "Unauthorized. This document does not belong to you." },
            { status: 403 }
          )
        }

        if (draft.hasPaidExport) {
          return NextResponse.json(
            { error: "This document has already been unlocked" },
            { status: 400 }
          )
        }
      }
    }

    // Get or create Stripe customer
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        stripeCustomerId: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please sign in again." },
        { status: 404 }
      )
    }

    let customerId = user.stripeCustomerId

    // Create Stripe customer if they don't have one
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      })
      customerId = customer.id

      // Save customer ID to database
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      })
    }

    // Get the origin URL for success/cancel redirects
    const origin = request.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000"

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}${draftId ? `&draftId=${draftId}` : ""}`,
      cancel_url: `${origin}${draftId ? `/contracts/${draftId}` : "/pricing"}?canceled=true`,
      metadata: {
        userId: user.id,
        productId: productId,
        mode: mode,
        ...(draftId && { draftId: draftId }), // Include draftId in metadata for webhook
      },
      // Allow promotion codes
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to create checkout session. Please try again.",
      },
      { status: 500 }
    )
  }
}

