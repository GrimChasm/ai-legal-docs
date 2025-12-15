/**
 * Stripe Webhook Handler
 * 
 * This endpoint handles Stripe webhook events for subscription updates.
 * 
 * SETUP INSTRUCTIONS:
 * 1. In Stripe Dashboard, go to: Developers > Webhooks
 * 2. Add endpoint: https://yourdomain.com/api/stripe/webhook
 * 3. Select events to listen to:
 *    - checkout.session.completed
 *    - customer.subscription.updated
 *    - customer.subscription.deleted
 *    - invoice.payment_failed (optional)
 * 4. Copy the webhook signing secret (starts with whsec_...)
 * 5. Add to .env.local: STRIPE_WEBHOOK_SECRET=whsec_...
 * 
 * For local testing, use Stripe CLI:
 * stripe listen --forward-to localhost:3000/api/stripe/webhook
 * This will give you a webhook secret to use locally.
 */

import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

// IMPORTANT: Next.js App Router requires us to get the raw body for webhook signature verification
// We need to read the body as a stream and convert it to a Buffer
export const runtime = "nodejs"

// Get the raw body as Buffer for signature verification
async function getRawBody(request: NextRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = []
  const reader = request.body?.getReader()
  
  if (!reader) {
    throw new Error("No request body")
  }

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) {
        chunks.push(value)
      }
    }
  } finally {
    reader.releaseLock()
  }

  // Combine all chunks into a single Buffer
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
  const result = Buffer.allocUnsafe(totalLength)
  let offset = 0
  for (const chunk of chunks) {
    result.set(chunk, offset)
    offset += chunk.length
  }
  
  return result
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is missing")
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    )
  }

  try {
    // Get the raw body for signature verification
    const body = await getRawBody(request)
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      )
    }

    // Verify the webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message)
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const mode = session.metadata?.mode || session.mode
        const productId = session.metadata?.productId

        if (!userId) {
          console.error("No userId in checkout session metadata")
          break
        }

        if (mode === "subscription") {
          // Handle subscription checkout
          const subscriptionId = session.subscription as string
          const customerId = session.customer as string

          // Get subscription details from Stripe
          const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription
          const priceId = subscription.items.data[0]?.price.id

          // Update user in database
          await prisma.user.update({
            where: { id: userId },
            data: {
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              stripePriceId: priceId,
              isPro: true,
              subscriptionStatus: subscription.status,
              stripeCurrentPeriodEnd: (subscription as any).current_period_end 
                ? new Date((subscription as any).current_period_end * 1000)
                : null,
            },
          })

          console.log(`Subscription activated for user ${userId}`)
        } else if (mode === "payment") {
          // Handle one-time payment (document unlock)
          const draftId = session.metadata?.draftId

          if (productId === "SINGLE_DOCUMENT" && draftId) {
            // Unlock the specific document
            const draft = await prisma.draft.findUnique({
              where: { id: draftId },
              select: { userId: true },
            })

            if (!draft) {
              console.error(`Draft ${draftId} not found for one-time unlock`)
              break
            }

            if (draft.userId !== userId) {
              console.error(`User ${userId} does not own draft ${draftId}`)
              break
            }

            // Mark document as unlocked
            await prisma.draft.update({
              where: { id: draftId },
              data: { hasPaidExport: true },
            })

            console.log(`Document ${draftId} unlocked via one-time payment for user ${userId}`)
          } else {
            console.log(`One-time payment completed for user ${userId}, product: ${productId}`)
          }
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by Stripe customer ID
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        })

        if (!user) {
          console.error(`User not found for customer ${customerId}`)
          break
        }

        const priceId = subscription.items.data[0]?.price.id
        const isActive = subscription.status === "active" || subscription.status === "trialing"

        // Update user subscription status
        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            isPro: isActive,
            subscriptionStatus: subscription.status,
            stripeCurrentPeriodEnd: (subscription as any).current_period_end 
              ? new Date((subscription as any).current_period_end * 1000)
              : null,
          },
        })

        console.log(`Subscription updated for user ${user.id}: ${subscription.status}`)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by Stripe customer ID
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        })

        if (!user) {
          console.error(`User not found for customer ${customerId}`)
          break
        }

        // Revoke Pro access
        await prisma.user.update({
          where: { id: user.id },
          data: {
            isPro: false,
            subscriptionStatus: "canceled",
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
          },
        })

        console.log(`Subscription canceled for user ${user.id}`)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Find user by Stripe customer ID
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        })

        if (!user) {
          console.error(`User not found for customer ${customerId}`)
          break
        }

        // Update subscription status to past_due
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: "past_due",
            // Optionally revoke access immediately or give grace period
            // isPro: false, // Uncomment to revoke access on payment failure
          },
        })

        console.log(`Payment failed for user ${user.id}`)
        // Here you could send an email notification to the user
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: `Webhook handler failed: ${error.message}` },
      { status: 500 }
    )
  }
}

