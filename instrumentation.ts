/**
 * Next.js Instrumentation File
 * 
 * This file is used to initialize Sentry on the server and edge runtime.
 * It replaces the old sentry.server.config.ts and sentry.edge.config.ts files.
 */

import * as Sentry from "@sentry/nextjs"

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Server-side initialization
    await import("./sentry.server.config")
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    // Edge runtime initialization
    await import("./sentry.edge.config")
  }
}

/**
 * Handle errors from nested React Server Components
 * 
 * This hook is called when an error occurs in a React Server Component.
 * It reports the error to Sentry.
 */
export function onRequestError(
  err: Error,
  request: {
    path: string
    headers: Headers
    method: string
  }
) {
  Sentry.captureRequestError(err, {
    request: {
      url: request.path,
      headers: Object.fromEntries(request.headers.entries()),
      method: request.method,
    },
  })
}

