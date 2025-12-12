/**
 * Client-side Sentry Initialization
 * 
 * This file replaces the deprecated sentry.client.config.ts file.
 * It's used for client-side error tracking in Next.js App Router.
 */

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === "development",
  
  // Environment
  environment: process.env.NODE_ENV || "development",
  
  // Replay can be used to record user sessions (if available)
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  
  // Integrations
  integrations: (() => {
    const integrations: any[] = []
    // Add replay integration if available
    if (Sentry.replayIntegration) {
      try {
        integrations.push(
          Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
          })
        )
      } catch (error) {
        // Replay integration not available, skip it
        console.warn("Sentry replay integration not available")
      }
    }
    return integrations.length > 0 ? integrations : undefined
  })(),
  
  // Filter out common errors that aren't actionable
  ignoreErrors: [
    // Browser extensions
    "top.GLOBALS",
    "originalCreateNotification",
    "canvas.contentDocument",
    "MyApp_RemoveAllHighlights",
    "atomicFindClose",
    "fb_xd_fragment",
    "bmi_SafeAddOnload",
    "EBCallBackMessageReceived",
    "conduitPage",
    // Network errors that are often not actionable
    "NetworkError",
    "Network request failed",
    "Failed to fetch",
    "Load failed",
  ],
  
  // Filter out URLs that shouldn't be tracked
  denyUrls: [
    // Chrome extensions
    /extensions\//i,
    /^chrome:\/\//i,
    // Other browser extensions
    /^moz-extension:\/\//i,
  ],
})

