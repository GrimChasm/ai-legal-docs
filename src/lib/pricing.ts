/**
 * Pricing Plans Configuration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create products and prices in Stripe Dashboard:
 *    - Go to: https://dashboard.stripe.com/products
 *    - Create a product (e.g., "Pro Subscription")
 *    - Add prices for Monthly and Yearly
 *    - Create a one-time product for "Single Document Export"
 *    - Copy the price IDs (they start with price_...)
 * 
 * 2. Add price IDs to your .env.local file:
 *    - STRIPE_PRICE_PRO_MONTHLY=price_xxxxx
 *    - STRIPE_PRICE_PRO_YEARLY=price_xxxxx
 *    - STRIPE_PRICE_SINGLE_DOCUMENT=price_xxxxx (for one-time document unlock)
 * 
 * 3. To add a new plan:
 *    - Add it to the PLANS or ONE_TIME_PRODUCTS object below
 *    - Add the corresponding env variable
 *    - Update the pricing page to display it
 */

export type PlanType = "subscription" | "one_time"

export interface Plan {
  id: string
  priceId: string
  label: string
  interval?: "month" | "year"
  type: PlanType
  description?: string
  features: string[]
}

export interface OneTimeProduct {
  id: string
  priceId: string
  label: string
  description: string
}

/**
 * Pricing Plans Configuration
 * 
 * Each plan requires a corresponding STRIPE_PRICE_* environment variable
 * that contains the Stripe Price ID (starts with price_...)
 * 
 * To add a new plan:
 * 1. Create the price in Stripe Dashboard
 * 2. Add a new entry below with the plan key, priceId from env, and features
 * 3. Update the pricing page to display it
 */
export const PLANS: Record<string, Plan> = {
  PRO_MONTHLY: {
    id: "pro_monthly",
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY || "",
    label: "Pro – Monthly",
    interval: "month",
    type: "subscription",
    description: "Unlimited documents and full access to premium features.",
    features: [
      "Unlimited document generation",
      "Unlimited exports (PDF, DOCX)",
      "Copy full document text",
      "Save documents to account",
      "E-signature features",
      "Custom templates",
      "AI document analyzer",
      "Priority support",
    ],
  },
  PRO_YEARLY: {
    id: "pro_yearly",
    priceId: process.env.STRIPE_PRICE_PRO_YEARLY || "",
    label: "Pro – Annual",
    interval: "year",
    type: "subscription",
    description: "Unlimited documents billed annually at a discounted rate.",
    features: [
      "Unlimited document generation",
      "Unlimited exports (PDF, DOCX)",
      "Copy full document text",
      "Save documents to account",
      "E-signature features",
      "Custom templates",
      "AI document analyzer",
      "Priority support",
      "Save 20% vs monthly",
    ],
  },
}

/**
 * One-Time Products Configuration
 * 
 * These are for single document unlocks (pay per document)
 */
export const ONE_TIME_PRODUCTS: Record<string, OneTimeProduct> = {
  SINGLE_DOCUMENT: {
    id: "single_document",
    priceId: process.env.STRIPE_PRICE_SINGLE_DOCUMENT || "",
    label: "Single Document Export",
    description: "Unlock export for this document only. Download as PDF or DOCX, copy text, and save to your account.",
  },
}

/**
 * Map of plan keys to their configuration
 * This helps us identify plans by their key when we only have the priceId
 */
export const PLAN_KEYS = {
  PRO_MONTHLY: "PRO_MONTHLY",
  PRO_YEARLY: "PRO_YEARLY",
  SINGLE_DOC: "SINGLE_DOC",
} as const

/**
 * Get plan key by priceId
 */
export function getPlanKeyByPriceId(priceId: string): string | null {
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.priceId === priceId) {
      return key
    }
  }
  return null
}

/**
 * Get a plan by its key
 */
export function getPlan(planKey: string): Plan | null {
  const plan = PLANS[planKey]
  if (!plan) return null
  
  // Validate that priceId is set
  if (!plan.priceId) {
    console.warn(`Plan ${planKey} is missing a priceId. Check your environment variables.`)
    return null
  }
  
  return plan
}

/**
 * Get all available subscription plans
 */
export function getSubscriptionPlans(): Plan[] {
  return Object.values(PLANS).filter(
    (plan) => plan.type === "subscription" && plan.priceId
  )
}

/**
 * Get all available one-time products
 */
export function getOneTimeProducts(): OneTimeProduct[] {
  return Object.values(ONE_TIME_PRODUCTS).filter(
    (product) => product.priceId
  )
}

/**
 * Get a one-time product by its key
 */
export function getOneTimeProduct(productKey: string): OneTimeProduct | null {
  const product = ONE_TIME_PRODUCTS[productKey]
  if (!product) return null
  
  if (!product.priceId) {
    console.warn(`Product ${productKey} is missing a priceId. Check your environment variables.`)
    return null
  }
  
  return product
}

/**
 * Validate that all required environment variables are set
 */
export function validatePricingConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = []
  
  if (!process.env.STRIPE_PRICE_PRO_MONTHLY) {
    missing.push("STRIPE_PRICE_PRO_MONTHLY")
  }
  if (!process.env.STRIPE_PRICE_PRO_YEARLY) {
    missing.push("STRIPE_PRICE_PRO_YEARLY")
  }
  
  return {
    valid: missing.length === 0,
    missing,
  }
}

