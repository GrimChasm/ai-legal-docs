import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
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

export default nextConfig
