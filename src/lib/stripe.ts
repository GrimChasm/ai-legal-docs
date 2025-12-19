/**
 * Stripe Configuration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Get your Stripe API keys from: https://dashboard.stripe.com/apikeys
 * 2. Add to your .env.local file:
 *    - STRIPE_SECRET_KEY=sk_test_... (or sk_live_... for production)
 *    - STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_... for production)
 *    - STRIPE_WEBHOOK_SECRET=whsec_... (get from Stripe Dashboard > Webhooks)
 * 
 * 3. For testing, use Stripe test mode keys and test cards:
 *    - Test card: 4242 4242 4242 4242
 *    - Any future expiry date, any CVC
 *    - See: https://stripe.com/docs/testing
 * 
 * 4. To switch between test and live:
 *    - Update the keys in .env.local
 *    - Test keys start with sk_test_/pk_test_
 *    - Live keys start with sk_live_/pk_live_
 */

import Stripe from "stripe"

// Lazy initialization function for Stripe client
// This prevents build-time errors when STRIPE_SECRET_KEY is not set
function getStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY is missing. Please add it to your .env.local file.\n" +
      "Get your keys from: https://dashboard.stripe.com/apikeys"
    )
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-12-15.clover", // Use the latest API version
    typescript: true,
  })
}

// Use a Proxy to lazily initialize Stripe only when actually used
// This allows the module to be imported during build without errors
let stripeInstance: Stripe | null = null

export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    if (!stripeInstance) {
      stripeInstance = getStripeClient()
    }
    const value = (stripeInstance as any)[prop]
    if (typeof value === "function") {
      return value.bind(stripeInstance)
    }
    return value
  },
})

// Get the publishable key (safe to use on client-side)
export const getStripePublishableKey = () => {
  if (!process.env.STRIPE_PUBLISHABLE_KEY) {
    throw new Error(
      "STRIPE_PUBLISHABLE_KEY is missing. Please add it to your .env.local file."
    )
  }
  return process.env.STRIPE_PUBLISHABLE_KEY
}







