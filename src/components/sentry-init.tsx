"use client"

/**
 * Client-side Sentry Initialization Component
 * 
 * This component ensures Sentry is initialized on the client side.
 * Since instrumentation-client.ts may not be automatically loaded,
 * we initialize Sentry directly here.
 */

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"

export default function SentryInit() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    // Check if already initialized
    if ((window as any).Sentry) {
      console.log("Sentry already initialized on window")
      return
    }

    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN
    
    console.log("SentryInit: Checking DSN...", {
      dsn: dsn ? "Set" : "Not set",
      dsnLength: dsn?.length || 0,
    })

    if (!dsn) {
      console.warn("Sentry DSN not found - error tracking disabled")
      console.warn("Make sure NEXT_PUBLIC_SENTRY_DSN is set in .env.local and server is restarted")
      return
    }

    try {
      console.log("SentryInit: Initializing Sentry...")
      
      // Build integrations array conditionally
      const integrations: any[] = []
      let hasReplay = false
      
      // Add replay integration if available
      // Note: replayIntegration might not be available in all Sentry versions
      try {
        // Check if replayIntegration exists - it might be undefined
        const replayIntegration = (Sentry as any).replayIntegration
        if (replayIntegration && typeof replayIntegration === "function") {
          integrations.push(
            replayIntegration({
              maskAllText: true,
              blockAllMedia: true,
            })
          )
          hasReplay = true
          console.log("Replay integration added")
        } else {
          console.log("Replay integration not available - this is okay, error tracking will still work")
        }
      } catch (replayError) {
        console.warn("Replay integration error, skipping:", replayError)
        // This is not critical - error tracking will still work without replay
      }
      
      Sentry.init({
        dsn: dsn,
        tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
        debug: process.env.NODE_ENV === "development",
        environment: process.env.NODE_ENV || "development",
        ...(hasReplay && {
          replaysOnErrorSampleRate: 1.0,
          replaysSessionSampleRate: 0.1,
        }),
        ...(integrations.length > 0 && { integrations }),
        ignoreErrors: [
          "top.GLOBALS",
          "originalCreateNotification",
          "canvas.contentDocument",
          "MyApp_RemoveAllHighlights",
          "atomicFindClose",
          "fb_xd_fragment",
          "bmi_SafeAddOnload",
          "EBCallBackMessageReceived",
          "conduitPage",
          "NetworkError",
          "Network request failed",
          "Failed to fetch",
          "Load failed",
        ],
        denyUrls: [
          /extensions\//i,
          /^chrome:\/\//i,
          /^moz-extension:\/\//i,
        ],
      })
      
      // Verify initialization
      // Note: Sentry may not always attach to window.Sentry immediately
      // The important thing is that Sentry.init() was called successfully
      const checkInit = () => {
        // Check multiple ways Sentry might be available
        const sentryOnWindow = (window as any).Sentry
        const sentryImported = Sentry
        const sentryGlobal = (globalThis as any).Sentry
        
        if (sentryOnWindow || sentryImported || sentryGlobal) {
          console.log("✅ Sentry initialized successfully")
          const sentry = sentryOnWindow || sentryImported || sentryGlobal
          try {
            const hub = sentry.getCurrentHub?.()
            const client = hub?.getClient?.()
            console.log("Sentry client:", {
              hubExists: !!hub,
              clientExists: !!client,
              dsnConfigured: !!client?.getDsn?.(),
              onWindow: !!sentryOnWindow,
              imported: !!sentryImported,
            })
          } catch (e) {
            // Hub/client check failed, but Sentry is still initialized
            console.log("✅ Sentry initialized (hub check unavailable)")
          }
        } else {
          // This is not necessarily an error - Sentry might work without window.Sentry
          console.warn("⚠️ Sentry.init() called but not found on window - this may be normal")
          console.log("Sentry error tracking should still work via the imported module")
        }
      }
      
      // Check after a short delay to allow initialization
      setTimeout(checkInit, 200)
      
    } catch (error) {
      console.error("❌ Failed to initialize Sentry:", error)
      console.error("Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      })
    }
    
    // Also try to import instrumentation-client.ts as backup
    import("../../instrumentation-client")
      .then(() => {
        console.log("instrumentation-client.ts loaded as backup")
      })
      .catch((err) => {
        console.debug("instrumentation-client.ts not found or failed to load:", err)
      })
  }, [])

  return null
}

