/**
 * Sentry Server Configuration
 * 
 * This file is imported by instrumentation.ts for server-side initialization.
 * 
 * To get your DSN, sign up at https://sentry.io and create a project.
 * Then add SENTRY_DSN to your .env.local file.
 */

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === "development",
  
  // Environment
  environment: process.env.NODE_ENV || "development",
  
  // Filter out common errors that aren't actionable
  ignoreErrors: [
    // Prisma connection errors (handled separately)
    "P1001",
    "P1002",
    // Common database errors
    "ECONNREFUSED",
    "ETIMEDOUT",
  ],
})

