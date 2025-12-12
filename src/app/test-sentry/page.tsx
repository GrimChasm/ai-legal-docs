"use client"

import { useEffect, useState } from "react"
import * as Sentry from "@sentry/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

/**
 * Sentry Test Page
 * 
 * Use this page to verify Sentry error tracking is working.
 * Navigate to /test-sentry to test.
 */
export default function TestSentryPage() {
  const [status, setStatus] = useState<{
    dsnSet: boolean
    sentryLoaded: boolean
    lastError: string | null
    sentryObject: string | null
  }>({
    dsnSet: false,
    sentryLoaded: false,
    lastError: null,
    sentryObject: null,
  })

  useEffect(() => {
    // Check if DSN is set
    const dsnSet = !!process.env.NEXT_PUBLIC_SENTRY_DSN
    setStatus((prev) => ({ ...prev, dsnSet }))

    // Wait a bit for Sentry to initialize, then check
    const checkSentry = () => {
      const sentryLoaded = typeof (window as any).Sentry !== "undefined"
      const sentryObject = sentryLoaded ? "✅ Found" : "❌ Not found"
      setStatus((prev) => ({ 
        ...prev, 
        sentryLoaded,
        sentryObject,
      }))

      console.log("Sentry Test - DSN Set:", dsnSet)
      console.log("Sentry Test - Sentry Loaded:", sentryLoaded)
      console.log("Sentry Test - Window.Sentry:", (window as any).Sentry)
      console.log("Sentry Test - Imported Sentry:", Sentry)
      
      if (!sentryLoaded && dsnSet) {
        console.warn("Sentry DSN is set but Sentry is not loaded. This might indicate an initialization issue.")
      }
    }

    // Check immediately
    checkSentry()
    
    // Check again after a short delay (in case Sentry initializes asynchronously)
    const timeout = setTimeout(checkSentry, 1000)
    
    return () => clearTimeout(timeout)
  }, [])

  const testManualCapture = () => {
    try {
      // Check if Sentry is available
      if (typeof window === "undefined" || !(window as any).Sentry) {
        alert("Sentry is not initialized. Check console and environment variables.")
        console.error("Sentry not available:", {
          window: typeof window,
          Sentry: (window as any).Sentry,
          DSN: process.env.NEXT_PUBLIC_SENTRY_DSN ? "Set" : "Not set",
        })
        return
      }

      const error = new Error(`Manual Sentry test - ${new Date().toISOString()}`)
      
      // Use the imported Sentry directly
      Sentry.captureException(error, {
        tags: { testType: "manual" },
        extra: { timestamp: new Date().toISOString() },
      })
      
      setStatus((prev) => ({ ...prev, lastError: error.message }))
      
      console.log("Error sent to Sentry:", error)
      alert("Error sent to Sentry! Check your Sentry dashboard in 10-30 seconds.")
    } catch (err) {
      console.error("Failed to send error to Sentry:", err)
      alert(`Failed to send error: ${err instanceof Error ? err.message : String(err)}. Check console.`)
    }
  }

  const testThrowError = () => {
    throw new Error(`Thrown error test - ${new Date().toISOString()}`)
  }

  const testAsyncError = async () => {
    try {
      // Check if Sentry is available
      if (typeof window === "undefined" || !(window as any).Sentry) {
        alert("Sentry is not initialized. Check console and environment variables.")
        console.error("Sentry not available:", {
          window: typeof window,
          Sentry: (window as any).Sentry,
          DSN: process.env.NEXT_PUBLIC_SENTRY_DSN ? "Set" : "Not set",
        })
        return
      }

      // Create the error first
      const testError = new Error(`Async error test - ${new Date().toISOString()}`)
      
      // Reject with the error
      await Promise.reject(testError)
    } catch (error) {
      // Ensure we have an Error object
      const errorObj = error instanceof Error 
        ? error 
        : new Error(String(error))
      
      // Use the imported Sentry directly
      try {
        Sentry.captureException(errorObj, {
          tags: { testType: "async" },
          extra: { 
            timestamp: new Date().toISOString(),
            originalError: error,
          },
        })
        
        setStatus((prev) => ({ ...prev, lastError: errorObj.message }))
        
        console.log("Async error sent to Sentry:", errorObj)
        alert("Async error sent to Sentry! Check your Sentry dashboard in 10-30 seconds.")
      } catch (sentryError) {
        console.error("Failed to send async error to Sentry:", sentryError)
        alert(`Failed to send error: ${sentryError instanceof Error ? sentryError.message : String(sentryError)}. Check console.`)
      }
    }
  }

  return (
    <div className="min-h-screen bg-bg-muted py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <Card>
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-text-main mb-6">Sentry Test Page</h1>
            
            {/* Status */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${status.dsnSet ? "bg-green-500" : "bg-red-500"}`} />
                <span>DSN Configured: {status.dsnSet ? "Yes" : "No"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${status.sentryLoaded ? "bg-green-500" : "bg-red-500"}`} />
                <span>Sentry Loaded: {status.sentryLoaded ? "Yes" : "No"}</span>
              </div>
              {status.lastError && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800">Last error sent: {status.lastError}</p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h2 className="font-semibold text-yellow-800 mb-2">How to Test:</h2>
              <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
                <li>Click one of the test buttons below</li>
                <li>Check your browser console for Sentry logs</li>
                <li>Go to your Sentry dashboard (https://sentry.io)</li>
                <li>Navigate to Issues → Your Project</li>
                <li>Wait 10-30 seconds for the error to appear</li>
              </ol>
            </div>

            {/* Test Buttons */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-text-main mb-2">Test 1: Manual Error Capture</h3>
                <p className="text-sm text-text-muted mb-2">
                  Uses Sentry.captureException() to manually send an error
                </p>
                <Button onClick={testManualCapture} variant="primary">
                  Test Manual Capture
                </Button>
              </div>

              <div>
                <h3 className="font-semibold text-text-main mb-2">Test 2: Thrown Error</h3>
                <p className="text-sm text-text-muted mb-2">
                  Throws an error that should be caught by ErrorBoundary
                </p>
                <Button onClick={testThrowError} variant="primary">
                  Test Thrown Error
                </Button>
              </div>

              <div>
                <h3 className="font-semibold text-text-main mb-2">Test 3: Async Error</h3>
                <p className="text-sm text-text-muted mb-2">
                  Tests error capture from async operations
                </p>
                <Button onClick={testAsyncError} variant="primary">
                  Test Async Error
                </Button>
              </div>
            </div>

            {/* Debug Info */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-text-main mb-2">Debug Information</h3>
              <div className="text-xs font-mono space-y-1">
                <div>DSN Set: {status.dsnSet ? "✅" : "❌"}</div>
                <div>Sentry Loaded: {status.sentryLoaded ? "✅" : "❌"}</div>
                <div>Environment: {process.env.NODE_ENV}</div>
                {status.sentryObject && (
                  <div>Sentry Object: {status.sentryObject}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

