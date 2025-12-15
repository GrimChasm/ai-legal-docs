import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Get database URL - handle undefined or invalid values
function getDatabaseUrl(): string {
  let databaseUrl = process.env.DATABASE_URL

  // If DATABASE_URL is not set, throw an error (required for production)
  if (!databaseUrl || databaseUrl === "undefined" || String(databaseUrl).trim() === "") {
    throw new Error(
      "DATABASE_URL environment variable is required.\n" +
      "For PostgreSQL: DATABASE_URL=\"postgresql://user:password@localhost:5432/contractvault?schema=public\"\n" +
      "For SQLite (dev only): DATABASE_URL=\"file:./dev.db\"\n" +
      "See POSTGRESQL_MIGRATION.md for setup instructions."
    )
  }

  // Remove quotes if present (sometimes .env files have quotes)
  databaseUrl = String(databaseUrl).replace(/^["']|["']$/g, "").trim()

  // Final validation - ensure it starts with postgresql:// or postgres://
  if (!databaseUrl || databaseUrl === "undefined" || databaseUrl.length === 0) {
    throw new Error("DATABASE_URL is empty or invalid. Please check your .env.local file.")
  }

  if (!databaseUrl.startsWith("postgresql://") && !databaseUrl.startsWith("postgres://") && !databaseUrl.startsWith("file:")) {
    throw new Error(
      `DATABASE_URL must start with postgresql://, postgres://, or file://. Got: ${databaseUrl.substring(0, 50)}...`
    )
  }

  return databaseUrl
}

// CRITICAL: Set DATABASE_URL in process.env BEFORE PrismaClient is instantiated
// Prisma validates the schema when PrismaClient is created, so the env var must be available
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "" || process.env.DATABASE_URL === "undefined") {
  // Try to load from .env.local if not set (for development)
  try {
    const fs = require("fs")
    const path = require("path")
    const envPath = path.join(process.cwd(), ".env.local")
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8")
      const match = envContent.match(/^DATABASE_URL=(.+)$/m)
      if (match) {
        const url = match[1].trim().replace(/^["']|["']$/g, "")
        process.env.DATABASE_URL = url
      }
    }
  } catch (e) {
    // Ignore errors - Next.js will load .env.local automatically
  }
}

// Only initialize Prisma if DATABASE_URL is available
// This prevents build errors when DATABASE_URL is not set
let prismaInstance: PrismaClient | null = null

function getPrismaClient(): PrismaClient {
  if (prismaInstance) {
    return prismaInstance
  }

  // Check if DATABASE_URL is available
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "" || process.env.DATABASE_URL === "undefined") {
    // During build, we might not have DATABASE_URL - create a mock client that will fail at runtime
    // This allows the build to complete but will error when actually used
    throw new Error(
      "DATABASE_URL environment variable is required.\n" +
      "For PostgreSQL: DATABASE_URL=\"postgresql://user:password@localhost:5432/contractvault?schema=public\"\n" +
      "For SQLite (dev only): DATABASE_URL=\"file:./dev.db\"\n" +
      "See POSTGRESQL_MIGRATION.md for setup instructions."
    )
  }

  // Get validated database URL and ensure it's set in environment
  const databaseUrl = getDatabaseUrl()
  process.env.DATABASE_URL = databaseUrl

  // Create Prisma client
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance
  }

  return prismaInstance
}

// Export a getter function that lazily initializes Prisma
// This allows the module to be imported during build without errors
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    const client = getPrismaClient()
    const value = (client as any)[prop]
    if (typeof value === "function") {
      return value.bind(client)
    }
    return value
  },
})

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
