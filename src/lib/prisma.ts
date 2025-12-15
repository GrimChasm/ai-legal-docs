import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Get database URL - handle undefined or invalid values
function getDatabaseUrl(): string | null {
  let databaseUrl = process.env.DATABASE_URL

  // During build time, DATABASE_URL might not be available
  // Return null instead of throwing to allow build to proceed
  if (!databaseUrl || databaseUrl === "undefined" || String(databaseUrl).trim() === "") {
    // Only throw in runtime, not during build
    if (typeof window === "undefined" && process.env.NEXT_PHASE !== "phase-production-build") {
      return null
    }
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
    if (typeof window === "undefined" && process.env.NEXT_PHASE !== "phase-production-build") {
      return null
    }
    throw new Error("DATABASE_URL is empty or invalid. Please check your .env.local file.")
  }

  if (!databaseUrl.startsWith("postgresql://") && !databaseUrl.startsWith("postgres://") && !databaseUrl.startsWith("file:")) {
    if (typeof window === "undefined" && process.env.NEXT_PHASE !== "phase-production-build") {
      return null
    }
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

// Get validated database URL and ensure it's set in environment
// During build, this might return null, so we handle that case
const databaseUrl = getDatabaseUrl()
if (databaseUrl) {
  process.env.DATABASE_URL = databaseUrl
}

// Create Prisma client lazily - only when actually needed
// This prevents errors during build time when DATABASE_URL might not be available
function createPrismaClient() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "" || process.env.DATABASE_URL === "undefined") {
    throw new Error(
      "DATABASE_URL environment variable is required.\n" +
      "For PostgreSQL: DATABASE_URL=\"postgresql://user:password@localhost:5432/contractvault?schema=public\"\n" +
      "For SQLite (dev only): DATABASE_URL=\"file:./dev.db\"\n" +
      "See POSTGRESQL_MIGRATION.md for setup instructions."
    )
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })
}

// Create Prisma client
// Supports both PostgreSQL (production) and SQLite (development)
export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
