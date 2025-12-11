/**
 * Monitoring and Error Tracking
 * 
 * Centralized error tracking and monitoring utilities.
 * Currently uses console logging, but can be extended to use Sentry, LogRocket, etc.
 */

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

  // In production, send to error tracking service (e.g., Sentry)
  if (process.env.NODE_ENV === "production") {
    // TODO: Integrate with Sentry or other error tracking service
    // Example:
    // if (typeof Sentry !== "undefined") {
    //   Sentry.captureException(error, { contexts: { custom: context } })
    // }
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
  if (process.env.NODE_ENV === "production") {
    // TODO: Send to monitoring service
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
  if (process.env.NODE_ENV === "production") {
    // TODO: Send to analytics/monitoring service
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
  if (process.env.NODE_ENV === "production") {
    // TODO: Send to analytics service (e.g., Mixpanel, Amplitude)
  }

  if (process.env.NODE_ENV === "development") {
    console.log("Event:", eventName, {
      properties,
      timestamp: new Date().toISOString(),
    })
  }
}

