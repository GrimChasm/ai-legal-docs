"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface UserSubscription {
  isPro: boolean
  subscriptionStatus: string | null
  stripePriceId: string | null
  stripeCurrentPeriodEnd: string | null
}

export default function BillingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/billing")
      return
    }

    if (status === "authenticated") {
      fetchSubscription()
    }
  }, [status, router])

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/user/subscription")
      if (response.ok) {
        const data = await response.json()
        setSubscription(data)
      }
    } catch (error) {
      console.error("Error fetching subscription:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleManageBilling = async () => {
    setPortalLoading(true)
    try {
      const response = await fetch("/api/stripe/create-billing-portal-session", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create billing portal session")
      }

      // Redirect to Stripe Billing Portal
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error: any) {
      console.error("Error opening billing portal:", error)
      alert(error.message || "Failed to open billing portal. Please try again.")
      setPortalLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-muted">Loading...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string | null) => {
    if (!status) return null

    const statusColors: Record<string, string> = {
      active: "bg-green-100 text-green-700 border-green-300",
      trialing: "bg-blue-100 text-blue-700 border-blue-300",
      past_due: "bg-yellow-100 text-yellow-700 border-yellow-300",
      canceled: "bg-gray-100 text-gray-700 border-gray-300",
      unpaid: "bg-red-100 text-red-700 border-red-300",
    }

    const colorClass = statusColors[status] || "bg-gray-100 text-gray-700 border-gray-300"

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium border ${colorClass}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 md:px-6 max-w-container py-16 md:py-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-text-main mb-4">
            Billing & Subscription
          </h1>
          <p className="text-lg text-text-muted">
            Manage your subscription and billing information
          </p>
        </div>

        {/* Current Plan Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Current Plan</CardTitle>
                <CardDescription className="mt-2">
                  {subscription?.isPro
                    ? "You're on a Pro plan"
                    : "You're on the Free plan"}
                </CardDescription>
              </div>
              {subscription?.isPro && getStatusBadge(subscription.subscriptionStatus)}
            </div>
          </CardHeader>
          <CardContent>
            {subscription?.isPro ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-text-muted mb-1">Subscription Status</p>
                  <p className="text-lg font-medium">
                    {subscription.subscriptionStatus
                      ? subscription.subscriptionStatus
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")
                      : "Active"}
                  </p>
                </div>
                {subscription.stripeCurrentPeriodEnd && (
                  <div>
                    <p className="text-sm text-text-muted mb-1">Renewal Date</p>
                    <p className="text-lg font-medium">
                      {formatDate(subscription.stripeCurrentPeriodEnd)}
                    </p>
                  </div>
                )}
                <div className="pt-4">
                  <Button
                    variant="primary"
                    onClick={handleManageBilling}
                    disabled={portalLoading}
                  >
                    {portalLoading ? "Loading..." : "Manage Billing"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-text-muted">
                  Upgrade to Pro to unlock unlimited document generation, custom templates,
                  and premium features.
                </p>
                <Button
                  variant="primary"
                  onClick={() => router.push("/pricing")}
                >
                  View Plans
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Card */}
        <Card>
          <CardHeader>
            <CardTitle>Pro Features</CardTitle>
            <CardDescription>
              What you get with a Pro subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg
                  className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${
                    subscription?.isPro ? "text-accent" : "text-gray-400"
                  }`}
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
                <span className={subscription?.isPro ? "text-text-main" : "text-text-muted"}>
                  Unlimited document generation
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${
                    subscription?.isPro ? "text-accent" : "text-gray-400"
                  }`}
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
                <span className={subscription?.isPro ? "text-text-main" : "text-text-muted"}>
                  Custom templates
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${
                    subscription?.isPro ? "text-accent" : "text-gray-400"
                  }`}
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
                <span className={subscription?.isPro ? "text-text-main" : "text-text-muted"}>
                  AI document analyzer
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${
                    subscription?.isPro ? "text-accent" : "text-gray-400"
                  }`}
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
                <span className={subscription?.isPro ? "text-text-main" : "text-text-muted"}>
                  Priority support
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${
                    subscription?.isPro ? "text-accent" : "text-gray-400"
                  }`}
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
                <span className={subscription?.isPro ? "text-text-main" : "text-text-muted"}>
                  Advanced export options
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}







