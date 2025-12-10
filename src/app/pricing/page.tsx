"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getSubscriptionPlans, getOneTimeProducts, type Plan, type OneTimeProduct } from "@/lib/pricing"

export default function PricingPage() {
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
      // Determine mode and productId
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
          // Note: draftId is not available on pricing page, user will unlock from document page
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      // Redirect to Stripe Checkout
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
      <div className="container mx-auto px-4 md:px-6 max-w-container py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-main mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto">
            Unlock unlimited document generation, custom templates, and premium features
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Canceled Message */}
        {canceled && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
            <p className="text-yellow-700 font-medium">
              Checkout was canceled. You can try again anytime.
            </p>
          </div>
        )}

        {/* Subscription Plans */}
        {subscriptionPlans.length > 0 ? (
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-main mb-8 text-center">
              Subscription Plans
            </h2>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
              {subscriptionPlans.map((plan, index) => {
                const planKey = plan.interval === "month" ? "PRO_MONTHLY" : "PRO_YEARLY"
                const isYearly = plan.interval === "year"
                const isLoading = loading === planKey

                return (
                  <Card
                    key={planKey}
                    className={`relative hover:shadow-lg transition-all duration-300 border-2 ${
                      isYearly ? "border-accent/50" : "border-border"
                    } group overflow-hidden`}
                  >
                    {/* Background gradient effect */}
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-2xl opacity-20 transition-opacity group-hover:opacity-30 ${
                      isYearly ? "bg-accent" : "bg-accent-soft"
                    }`}></div>
                    
                    {isYearly && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-accent to-accent-soft text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md z-10">
                        ⭐ Save 20%
                      </div>
                    )}
                    <CardHeader className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isYearly ? "bg-accent/20" : "bg-accent-soft/20"
                        }`}>
                          <svg
                            className={`w-6 h-6 ${isYearly ? "text-accent" : "text-accent-soft"}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                            />
                          </svg>
                        </div>
                        <CardTitle className="text-2xl">{plan.label}</CardTitle>
                      </div>
                      <CardDescription className="text-base mt-2">
                        {isYearly ? "Billed annually" : "Billed monthly"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start group/item">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 group-hover/item:bg-green-200 transition-colors">
                              <svg
                                className="w-4 h-4 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <span className="text-text-muted group-hover/item:text-text-main transition-colors">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        size="lg"
                        variant={isYearly ? "primary" : "outline"}
                        className={`w-full font-semibold transition-all duration-200 ${
                          isYearly
                            ? "shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                            : "hover:border-accent hover:bg-accent/5"
                        }`}
                        onClick={() => handleCheckout(planKey)}
                        disabled={isLoading || status === "loading"}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Get {plan.label}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="mb-16 text-center py-12 bg-bg-muted rounded-lg border border-border">
            <svg className="w-16 h-16 text-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-text-muted text-lg mb-2">Subscription plans coming soon</p>
            <p className="text-text-muted text-sm">
              Please configure STRIPE_PRICE_PRO_MONTHLY and STRIPE_PRICE_PRO_YEARLY in your environment variables.
            </p>
          </div>
        )}

        {/* One-Time Document Option */}
        {oneTimeProducts.length > 0 ? (
          <div className="mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-px bg-border flex-1 max-w-24"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-text-main">
                  Just Need One Document?
                </h2>
                <div className="h-px bg-border flex-1 max-w-24"></div>
              </div>
              <p className="text-center text-text-muted max-w-2xl mx-auto">
                Pay once to unlock export for a single document. Perfect if you only need one document exported.
              </p>
            </div>
            <div className="max-w-md mx-auto">
              {oneTimeProducts.map((product) => {
                const isLoading = loading === "SINGLE_DOCUMENT"

                return (
                  <Card
                    key={product.id}
                    className="hover:shadow-lg transition-all duration-300 border-2 border-accent/30 bg-gradient-to-br from-white to-accent/5 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-accent/20 transition-colors"></div>
                    <CardHeader className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                          <svg
                            className="w-6 h-6 text-accent"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <CardTitle className="text-xl">{product.label}</CardTitle>
                      </div>
                      <CardDescription className="text-base mt-2">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start group/item">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 group-hover/item:bg-green-200 transition-colors">
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="text-text-muted group-hover/item:text-text-main transition-colors">
                            Download as PDF or DOCX
                          </span>
                        </li>
                        <li className="flex items-start group/item">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 group-hover/item:bg-green-200 transition-colors">
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="text-text-muted group-hover/item:text-text-main transition-colors">
                            Copy full document text
                          </span>
                        </li>
                        <li className="flex items-start group/item">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 group-hover/item:bg-green-200 transition-colors">
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="text-text-muted group-hover/item:text-text-main transition-colors">
                            Save to your account
                          </span>
                        </li>
                      </ul>
                      <Button
                        size="lg"
                        variant="primary"
                        className="w-full font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                        onClick={() => handleCheckout("SINGLE_DOCUMENT")}
                        disabled={isLoading || status === "loading"}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Pay per Document
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-text-muted text-center mt-4 p-3 bg-bg-muted rounded-lg border border-border">
                        <strong>Note:</strong> You'll need to generate a document first, then unlock it for export from the document page.
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="mb-16 text-center py-12 bg-bg-muted rounded-lg border border-border">
            <svg className="w-16 h-16 text-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-text-muted text-lg mb-2">One-time payment option coming soon</p>
            <p className="text-text-muted text-sm">
              Please configure STRIPE_PRICE_SINGLE_DOCUMENT in your environment variables.
            </p>
          </div>
        )}


        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-text-main mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Can I cancel anytime?</h3>
                <p className="text-text-muted">
                  Yes, you can cancel your subscription at any time. You'll continue to have
                  access until the end of your billing period.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
                <p className="text-text-muted">
                  We accept all major credit cards, debit cards, and other payment methods
                  supported by Stripe.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Is there a free trial?</h3>
                <p className="text-text-muted">
                  Currently, we don't offer a free trial, but you can try our free templates
                  to see the quality of our documents.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

