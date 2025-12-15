"use client"

import { Suspense, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getSubscriptionPlans, getOneTimeProducts, type Plan, type OneTimeProduct } from "@/lib/pricing"

function PricingContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const canceled = searchParams.get("canceled") === "true"
  
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const subscriptionPlans = getSubscriptionPlans()
  const oneTimeProducts = getOneTimeProducts()

  const handleCheckout = async (productKey: string) => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/pricing")
      return
    }

    setLoading(productKey)
    setError(null)

    try {
      const isSubscription = productKey === "PRO_MONTHLY" || productKey === "PRO_YEARLY"
      const mode = isSubscription ? "subscription" : "payment"
      const productId = isSubscription ? productKey : "SINGLE_DOCUMENT"

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode,
          productId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (err: any) {
      console.error("Checkout error:", err)
      setError(err.message || "Something went wrong. Please try again.")
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-text-main mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto leading-relaxed">
            Choose the plan that works for you. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Canceled Message */}
        {canceled && (
          <div className="max-w-2xl mx-auto mb-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
            <p className="text-yellow-700 font-medium">
              Checkout was canceled. You can try again anytime.
            </p>
          </div>
        )}

        {/* Pricing Preview Cards */}
        <div className="mb-20">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Pay Per Document */}
            <Card className="bg-bg-card border-2 border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 md:p-10 flex flex-col h-full">
                <h3 className="text-2xl font-bold text-text-main mb-2">Pay per document</h3>
                <div className="text-5xl font-bold text-text-main mb-2">
                  $3.99
                </div>
                <p className="text-text-muted mb-8">One-time payment per document</p>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-main">PDF & DOCX export</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-main">Unlimited edits</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-main">E-signature support</span>
                  </li>
                </ul>
                <Link href="/templates-library" className="block mt-auto">
                  <Button variant="outline" className="w-full" size="lg">
                    Get started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Subscription */}
            <Card className="bg-bg-card border-2 border-accent hover:shadow-xl transition-all duration-300 relative">
              <CardContent className="p-8 md:p-10 flex flex-col h-full">
                <h3 className="text-2xl font-bold text-text-main mb-2">Pro Subscription</h3>
                <div className="mb-4">
                  <div className="text-5xl font-bold text-text-main mb-1">
                    $12.99<span className="text-xl text-text-muted font-normal">/month</span>
                  </div>
                  <div className="text-lg text-text-muted mb-2">or</div>
                  <div className="text-4xl font-bold text-text-main mb-1">
                    $99.99<span className="text-lg text-text-muted font-normal">/year</span>
                  </div>
                  <p className="text-sm text-accent font-medium">Save 36% with annual billing</p>
                </div>
                <p className="text-text-muted mb-8">Unlimited documents and features</p>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-main">Unlimited document generation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-main">Priority support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-main">Advanced features</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-main">Custom templates</span>
                  </li>
                </ul>
                <div className="block mt-auto space-y-3">
                  <Button 
                    variant="primary" 
                    className="w-full" 
                    size="lg"
                    onClick={() => handleCheckout("PRO_MONTHLY")}
                    disabled={loading === "PRO_MONTHLY"}
                  >
                    {loading === "PRO_MONTHLY" ? "Processing..." : "Start monthly"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="lg"
                    onClick={() => handleCheckout("PRO_YEARLY")}
                    disabled={loading === "PRO_YEARLY"}
                  >
                    {loading === "PRO_YEARLY" ? "Processing..." : "Start yearly ($99.99/year)"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Subscription Plans */}
        {subscriptionPlans.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-12 text-center">
              Subscription Plans
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {subscriptionPlans.map((plan) => {
                const planKey = plan.interval === "month" ? "PRO_MONTHLY" : "PRO_YEARLY"
                const isYearly = plan.interval === "year"
                const isLoading = loading === planKey

                return (
                  <Card
                    key={planKey}
                    className={`relative hover:shadow-xl transition-all duration-300 border-2 ${
                      isYearly ? "border-accent shadow-lg" : "border-border"
                    }`}
                  >
                    <CardHeader className="pb-6">
                      <CardTitle className="text-3xl mb-2">{plan.label}</CardTitle>
                      <CardDescription className="text-lg">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      {/* Price - Extract from Stripe or show placeholder */}
                      <div className="mb-8">
                        <div className="text-5xl font-bold text-text-main mb-2">
                          {isYearly ? "$99.99" : "$12.99"}
                          <span className="text-2xl text-text-muted font-normal">/{plan.interval === "year" ? "year" : "month"}</span>
                        </div>
                        {isYearly && (
                          <p className="text-sm text-accent font-medium">Save 36% vs monthly</p>
                        )}
                      </div>

                      {/* Features */}
                      <ul className="space-y-4 mb-10">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-text-main leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <Button
                        variant={isYearly ? "primary" : "outline"}
                        size="lg"
                        className="w-full"
                        onClick={() => handleCheckout(planKey)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : `Get ${plan.label}`}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* One-Time Products */}
        {oneTimeProducts.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">
                Just need one document?
              </h2>
              <p className="text-xl text-text-muted max-w-2xl mx-auto">
                Pay per document when you need it. No subscription required.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {oneTimeProducts.map((product) => {
                const productKey = "SINGLE_DOCUMENT"
                const isLoading = loading === productKey

                return (
                  <Card
                    key={product.id}
                    className="border-2 border-border hover:shadow-lg transition-all duration-300"
                  >
                    <CardHeader>
                      <CardTitle className="text-2xl mb-2">{product.label}</CardTitle>
                      <CardDescription className="text-base">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="mb-8">
                        <div className="text-4xl font-bold text-text-main mb-2">
                          $3.99
                        </div>
                        <p className="text-text-muted">One-time payment</p>
                      </div>

                      <ul className="space-y-3 mb-10">
                        <li className="flex items-start gap-3">
                          <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-text-main">Unlock export for this document</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-text-main">PDF & DOCX download</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-text-main">E-signature support</span>
                        </li>
                      </ul>

                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onClick={() => handleCheckout(productKey)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Pay per document"}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-12 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            <Card className="border border-border">
              <CardContent className="p-8 pt-10">
                <h3 className="text-xl font-semibold text-text-main mb-3">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="text-text-muted leading-relaxed">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="p-8 pt-10">
                <h3 className="text-xl font-semibold text-text-main mb-3">
                  What payment methods do you accept?
                </h3>
                <p className="text-text-muted leading-relaxed">
                  We accept all major credit cards, debit cards, and other payment methods through Stripe.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="p-8 pt-10">
                <h3 className="text-xl font-semibold text-text-main mb-3">
                  Do you offer refunds?
                </h3>
                <p className="text-text-muted leading-relaxed">
                  We offer a 30-day money-back guarantee on all subscriptions. Contact support for assistance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28" style={{ maxWidth: '1200px' }}>
          <div className="text-center">
            <p className="text-text-muted">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <PricingContent />
    </Suspense>
  )
}
