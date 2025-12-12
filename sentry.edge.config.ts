/**
 * Sentry Edge Configuration
 * 
 * This file is imported by instrumentation.ts for edge runtime initialization.
 */

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Adjust this value in production
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  debug: process.env.NODE_ENV === "development",
  environment: process.env.NODE_ENV || "development",
})

