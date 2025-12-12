/**
 * Monitoring and Error Tracking
 * 
 * Centralized error tracking and monitoring utilities.
 * Uses Sentry for error tracking in production.
 */

import * as Sentry from "@sentry/nextjs"

interface ErrorContext {
  userId?: string
  email?: string
  path?: string
  method?: string
  [key: string]: any
}

/**
 * Log an error with context
 */
export function logError(error: Error | string, context?: ErrorContext) {
  const errorMessage = typeof error === "string" ? error : error.message
  const errorStack = typeof error === "string" ? undefined : error.stack

  // Send to Sentry in production
  if (process.env.NODE_ENV === "production" && typeof Sentry !== "undefined") {
    if (typeof error === "string") {
      Sentry.captureMessage(error, {
        level: "error",
        contexts: {
          custom: context || {},
        },
      })
    } else {
      Sentry.captureException(error, {
        contexts: {
          custom: context || {},
        },
      })
    }
  }

  // Always log to console for development
  console.error("Error:", errorMessage, {
    stack: errorStack,
    context,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Log a warning
 */
export function logWarning(message: string, context?: ErrorContext) {
  if (process.env.NODE_ENV === "production" && typeof Sentry !== "undefined") {
    Sentry.captureMessage(message, {
      level: "warning",
      contexts: {
        custom: context || {},
      },
    })
  }

  console.warn("Warning:", message, {
    context,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Log an info message
 */
export function logInfo(message: string, context?: ErrorContext) {
  if (process.env.NODE_ENV === "development") {
    console.info("Info:", message, {
      context,
      timestamp: new Date().toISOString(),
    })
  }
}

/**
 * Track API performance
 */
export function trackPerformance(
  endpoint: string,
  duration: number,
  statusCode: number
) {
  // Track slow requests in Sentry
  if (process.env.NODE_ENV === "production" && typeof Sentry !== "undefined" && duration > 2000) {
    Sentry.captureMessage(`Slow API endpoint: ${endpoint}`, {
      level: "warning",
      contexts: {
        performance: {
          endpoint,
          duration,
          statusCode,
        },
      },
    })
  }

  if (process.env.NODE_ENV === "development" || duration > 1000) {
    console.log("Performance:", {
      endpoint,
      duration: `${duration}ms`,
      statusCode,
      timestamp: new Date().toISOString(),
    })
  }
}

/**
 * Track business events (e.g., document generation, payment)
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  // Track business events in Sentry (can be extended to analytics service later)
  if (process.env.NODE_ENV === "production" && typeof Sentry !== "undefined") {
    Sentry.addBreadcrumb({
      category: "business",
      message: eventName,
      level: "info",
      data: properties,
    })
  }

  if (process.env.NODE_ENV === "development") {
    console.log("Event:", eventName, {
      properties,
      timestamp: new Date().toISOString(),
    })
  }
}





