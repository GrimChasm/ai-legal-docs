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

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/account")
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

  const getPlanName = () => {
    if (!subscription?.isPro) {
      return "Free"
    }
    return "Pro"
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

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 md:px-6 max-w-container py-16 md:py-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-text-main mb-4">
            Account Settings
          </h1>
          <p className="text-lg text-text-muted">
            Manage your account information and subscription
          </p>
        </div>

        {/* Account Information Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Account Information</CardTitle>
            <CardDescription>
              Your basic account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-text-muted mb-1">Name</p>
              <p className="text-lg font-medium text-text-main">
                {session.user?.name || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-muted mb-1">Email</p>
              <p className="text-lg font-medium text-text-main">
                {session.user?.email || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plan Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Subscription Plan</CardTitle>
                <CardDescription className="mt-2">
                  Your current subscription plan
                </CardDescription>
              </div>
              {subscription?.isPro && getStatusBadge(subscription.subscriptionStatus)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-text-muted mb-1">Current Plan</p>
                <p className="text-2xl font-bold text-text-main">
                  {getPlanName()}
                </p>
              </div>
              {subscription?.isPro && (
                <>
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
                </>
              )}
              {!subscription?.isPro && (
                <div className="pt-2">
                  <p className="text-text-muted mb-4">
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
              <div className="pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => router.push("/billing")}
                >
                  Manage Billing
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

