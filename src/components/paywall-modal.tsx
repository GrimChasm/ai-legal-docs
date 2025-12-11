"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Modal from "@/components/modal"
import { getPlan, getOneTimeProduct, PLANS, ONE_TIME_PRODUCTS } from "@/lib/pricing"

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
  draftId?: string // Optional: if provided, allows one-time unlock for this document
  action?: string // e.g., "export", "download", "copy", "save"
}

export default function PaywallModal({
  isOpen,
  onClose,
  draftId,
  action = "export",
}: PaywallModalProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async (mode: "subscription" | "payment", productId: string) => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/pricing")
      return
    }

    setLoading(productId)
    setError(null)

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode,
          productId,
          draftId, // Include draftId for one-time unlocks
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

  const proMonthly = getPlan("PRO_MONTHLY")
  const proYearly = getPlan("PRO_YEARLY")
  const singleDocument = draftId ? getOneTimeProduct("SINGLE_DOCUMENT") : null

  const actionText = {
    export: "export this document",
    download: "download this document",
    copy: "copy this document",
    save: "save this document",
  }[action] || "access this feature"

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Unlock Export Features">
      <div className="space-y-6">
        {/* Header with Icon */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-accent/20 to-accent-soft/20 rounded-full flex items-center justify-center mb-4 shadow-lg animate-pulse border-2 border-accent/30">
            <svg
              className="w-8 h-8 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-text-main mb-2">
            Unlock {actionText.charAt(0).toUpperCase() + actionText.slice(1)}
          </h2>
          <p className="text-text-muted text-base">
            Choose how you'd like to unlock export features for this document.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
            <p className="text-red-700 font-medium text-sm">{error}</p>
          </div>
        )}

        {/* One-Time Unlock Option */}
        {singleDocument && draftId && (
          <Card className="border-2 border-accent/50 hover:border-accent hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-accent/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <CardHeader className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
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
                <CardTitle className="text-xl">Unlock This Document</CardTitle>
              </div>
              <CardDescription className="text-base">
                {singleDocument.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-start group">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 group-hover:bg-green-200 transition-colors">
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
                  <span className="text-text-muted group-hover:text-text-main transition-colors">
                    Download as PDF or DOCX
                  </span>
                </li>
                <li className="flex items-start group">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 group-hover:bg-green-200 transition-colors">
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
                  <span className="text-text-muted group-hover:text-text-main transition-colors">
                    Copy full document text
                  </span>
                </li>
                <li className="flex items-start group">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 group-hover:bg-green-200 transition-colors">
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
                  <span className="text-text-muted group-hover:text-text-main transition-colors">
                    Save to your account
                  </span>
                </li>
              </ul>
              <Button
                variant="primary"
                size="lg"
                className="w-full font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => handleCheckout("payment", "SINGLE_DOCUMENT")}
                disabled={loading !== null}
              >
                {loading === "SINGLE_DOCUMENT" ? (
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
                    Unlock This Document
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pro Subscription Options */}
        <div className="space-y-4">
          <div className="text-center relative">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-border"></div>
            <div className="relative inline-block bg-white px-4">
              <h3 className="text-lg font-semibold text-text-main mb-1 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Or Upgrade to Pro
              </h3>
              <p className="text-sm text-text-muted">
                Get unlimited exports and access to all premium features
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {proMonthly && (
              <Card className="hover:shadow-lg hover:border-accent/50 transition-all duration-300 border-2 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -mr-12 -mt-12 blur-xl group-hover:bg-accent/10 transition-colors"></div>
                <CardHeader className="relative">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <CardTitle className="text-lg">{proMonthly.label}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {proMonthly.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <ul className="space-y-2 mb-5 text-sm">
                    {proMonthly.features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-start group/item">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 group-hover/item:bg-blue-200 transition-colors">
                          <svg
                            className="w-3 h-3 text-blue-600"
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
                        <span className="text-text-muted group-hover/item:text-text-main transition-colors text-xs">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full font-medium hover:border-accent hover:bg-accent/5 transition-all duration-200"
                    onClick={() => handleCheckout("subscription", "PRO_MONTHLY")}
                    disabled={loading !== null}
                  >
                    {loading === "PRO_MONTHLY" ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Go Pro – Monthly"
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {proYearly && (
              <Card className="hover:shadow-lg hover:border-accent transition-all duration-300 border-2 border-accent/50 relative overflow-hidden group">
                {proYearly.features.includes("Save 20%") && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent-light border-2 border-accent text-accent px-4 py-1.5 rounded-full text-xs font-semibold shadow-md z-10 animate-bounce">
                    ⭐ Best Value
                  </div>
                )}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-accent/20 transition-colors"></div>
                <CardHeader className="relative">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <CardTitle className="text-lg">{proYearly.label}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {proYearly.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <ul className="space-y-2 mb-5 text-sm">
                    {proYearly.features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-start group/item">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 group-hover/item:bg-green-200 transition-colors">
                          <svg
                            className="w-3 h-3 text-green-600"
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
                        <span className="text-text-muted group-hover/item:text-text-main transition-colors text-xs">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => handleCheckout("subscription", "PRO_YEARLY")}
                    disabled={loading !== null}
                  >
                    {loading === "PRO_YEARLY" ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        Go Pro – Annual
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Link to Pricing Page */}
          <div className="text-center pt-2">
            <Link
              href="/pricing"
              className="text-sm text-accent hover:text-accent-hover font-medium inline-flex items-center gap-1 transition-colors"
              onClick={onClose}
            >
              View all pricing options
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Close Button */}
        <div className="text-center pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-text-muted hover:text-text-main transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Maybe later
          </Button>
        </div>
      </div>
    </Modal>
  )
}

