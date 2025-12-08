import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Ensure Prisma Client is properly transpiled
  transpilePackages: ["@prisma/client"],
  // Exclude libsql packages from server component processing
  serverExternalPackages: [
    "@libsql/isomorphic-ws",
    "@libsql/client",
    "@prisma/adapter-libsql",
    "@libsql/darwin-arm64",
    "@libsql/darwin-x64",
    "@libsql/linux-arm64-gnu",
    "@libsql/linux-arm64-musl",
    "@libsql/linux-x64-gnu",
    "@libsql/linux-x64-musl",
    "@libsql/win32-x64-msvc",
  ],
  // Configure webpack to handle markdown files and binary files (used with --webpack flag)
  webpack: (config, { isServer }) => {
    // Ignore markdown files
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source',
    })
    
    // Exclude native libsql packages from bundling
    if (isServer) {
      const libsqlPackages = [
        '@libsql/client',
        '@prisma/adapter-libsql',
        '@libsql/isomorphic-ws',
        '@libsql/darwin-arm64',
        '@libsql/darwin-x64',
        '@libsql/linux-arm64-gnu',
        '@libsql/linux-arm64-musl',
        '@libsql/linux-x64-gnu',
        '@libsql/linux-x64-musl',
        '@libsql/win32-x64-msvc',
      ]
      
      config.externals = config.externals || []
      if (Array.isArray(config.externals)) {
        config.externals.push(...libsqlPackages)
      } else {
        libsqlPackages.forEach((pkg) => {
          config.externals[pkg] = `commonjs ${pkg}`
        })
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
