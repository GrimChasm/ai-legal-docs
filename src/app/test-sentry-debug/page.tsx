"use client"

import { useState } from "react"
import * as Sentry from "@sentry/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

/**
 * Sentry Debug Page
 * 
 * This page helps debug why errors aren't appearing in Sentry.
 */
export default function SentryDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [networkLogs, setNetworkLogs] = useState<string[]>([])

  const checkSentryConfig = () => {
    const info: any = {
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ? "Set (hidden)" : "Not set",
      dsnSet: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      windowSentryExists: typeof window !== "undefined" ? typeof (window as any).Sentry !== "undefined" : "N/A",
      windowSentryType: typeof window !== "undefined" && (window as any).Sentry ? typeof (window as any).Sentry : "N/A",
      importedSentryExists: typeof Sentry !== "undefined",
      sentryClientExists: typeof window !== "undefined" ? typeof (window as any).__SENTRY__ !== "undefined" : "N/A",
    }

    // Check if Sentry is initialized
    if (typeof window !== "undefined" && (window as any).Sentry) {
      try {
        const sentry = (window as any).Sentry
        const hub = sentry.getCurrentHub?.()
        const client = hub?.getClient?.()
        const dsn = client?.getDsn?.()
        
        info.sentryInit = {
          hubExists: !!hub,
          clientExists: !!client,
          dsnConfigured: !!dsn,
          dsnString: dsn?.toString() || "Not configured",
        }
        
        const options = client?.getOptions?.()
        if (options) {
          info.sentryOptions = {
            dsn: options.dsn ? "Set" : "Not set",
            environment: options.environment,
            debug: options.debug,
            tracesSampleRate: options.tracesSampleRate,
            integrations: options.integrations?.map((i: any) => i.name || String(i)).filter(Boolean) || [],
          }
        }
      } catch (e) {
        info.sentryInitError = String(e)
      }
    }

    setDebugInfo(info)
    console.log("Sentry Debug Info:", info)
  }

  const testWithNetworkCheck = async () => {
    // Clear previous logs
    setNetworkLogs([])
    
    // Monitor network requests
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const url = args[0]?.toString() || ""
      if (url.includes("sentry.io") || url.includes("ingest.sentry.io")) {
        const log = `Sentry Request: ${url}`
        setNetworkLogs((prev) => [...prev, log])
        console.log(log, args)
      }
      return originalFetch(...args)
    }

    // Create and send error
    const error = new Error(`Network test error - ${new Date().toISOString()}`)
    
    try {
      Sentry.captureException(error, {
        tags: { debug: "network-test" },
      })
      
      // Wait a bit to see network requests
      setTimeout(() => {
        window.fetch = originalFetch
        setNetworkLogs((prev) => [...prev, "Network monitoring stopped"])
      }, 2000)
      
      alert("Error sent. Check console and network tab for Sentry requests.")
    } catch (err) {
      window.fetch = originalFetch
      console.error("Failed to send error:", err)
      alert(`Failed: ${err}`)
    }
  }

  const testDirectSentryCall = () => {
    const error = new Error(`Direct Sentry call test - ${new Date().toISOString()}`)
    
    // Try using the imported Sentry directly (this should work even if window.Sentry doesn't exist)
    try {
      console.log("Trying Sentry.captureException (imported module)...")
      Sentry.captureException(error, {
        tags: { testType: "direct-import" },
      })
      console.log("✅ Sentry.captureException called successfully")
    } catch (err) {
      console.error("❌ Sentry.captureException failed:", err)
    }
    
    // Try window.Sentry if it exists
    if (typeof window !== "undefined" && (window as any).Sentry) {
      try {
        const sentry = (window as any).Sentry
        console.log("Trying window.Sentry.captureException...")
        sentry.captureException?.(error)
        
        console.log("Trying getCurrentHub...")
        const hub = sentry.getCurrentHub?.()
        hub?.captureException?.(error)
      } catch (err) {
        console.error("window.Sentry methods failed:", err)
      }
    } else {
      console.warn("window.Sentry not available - using imported Sentry module instead")
    }
    
    alert("Tried multiple methods. Check console and network tab. The imported Sentry module should work even if window.Sentry doesn't exist.")
  }

  return (
    <div className="min-h-screen bg-bg-muted py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <Card>
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-text-main mb-6">Sentry Debug Page</h1>
            
            <div className="space-y-4 mb-6">
              <Button onClick={checkSentryConfig} variant="primary">
                Check Sentry Configuration
              </Button>
              
              <Button onClick={testWithNetworkCheck} variant="primary">
                Test with Network Monitoring
              </Button>
              
              <Button onClick={testDirectSentryCall} variant="primary">
                Test Direct Sentry Calls
              </Button>
            </div>

            {debugInfo && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Configuration Info:</h3>
                <pre className="text-xs overflow-auto max-h-96">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )}

            {networkLogs.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Network Logs:</h3>
                <div className="space-y-1">
                  {networkLogs.map((log, i) => (
                    <div key={i} className="text-xs font-mono">{log}</div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Troubleshooting Steps:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
                <li>Click "Check Sentry Configuration" and verify DSN is set</li>
                <li>Click "Test with Network Monitoring" and check browser Network tab for requests to sentry.io</li>
                <li>Open browser DevTools → Network tab → Filter by "sentry"</li>
                <li>Look for requests to "ingest.sentry.io" - they should return 200 status</li>
                <li>If no requests appear, Sentry might not be initialized</li>
                <li>Check browser console for any Sentry-related errors</li>
                <li>Verify your DSN in Sentry dashboard matches your .env.local</li>
                <li>Make sure you're looking at the correct project in Sentry</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

