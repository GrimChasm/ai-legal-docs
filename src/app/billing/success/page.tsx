"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function BillingSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  useEffect(() => {
    // Refresh subscription status after successful payment
    // The webhook should update it, but we can also fetch it here
    if (sessionId) {
      // Give webhook a moment to process
      setTimeout(() => {
        router.refresh()
      }, 2000)
    }
  }, [sessionId, router])

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600"
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
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-text-muted text-center">
            Thank you for your purchase. Your subscription is now active.
          </p>
          <p className="text-text-muted text-center text-sm">
            You now have access to all Pro features. If you don't see the changes immediately,
            please refresh the page.
          </p>
          <div className="flex gap-4">
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/billing")}
            >
              View Billing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function BillingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <p className="text-text-muted">Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <BillingSuccessContent />
    </Suspense>
  )
}







