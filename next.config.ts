import { withSentryConfig } from "@sentry/nextjs"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Instrumentation is enabled by default in Next.js 16
  // No need for experimental.instrumentationHook
  // Ensure Prisma Client is properly transpiled
  transpilePackages: ["@prisma/client"],
  // Configure webpack to handle markdown files and binary files (used with --webpack flag)
  webpack: (config, { isServer }) => {
    // Ignore markdown files
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source',
    })
    
    // Exclude Prisma from bundling
    if (isServer) {
      config.externals = config.externals || []
      if (Array.isArray(config.externals)) {
        config.externals.push('@prisma/client')
      } else {
        config.externals['@prisma/client'] = 'commonjs @prisma/client'
      }
    }
    
    // Exclude native modules from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }
    
    return config
  },
  // Configure Turbopack (for when using --turbopack flag)
  turbopack: {
    resolveExtensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".mjs", ".cjs"],
  },
}

// Wrap the Next.js config with Sentry
export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors.
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
})
