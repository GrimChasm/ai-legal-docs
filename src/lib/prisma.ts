import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Get database URL - handle undefined or invalid values
function getDatabaseUrl(): string {
  let databaseUrl = process.env.DATABASE_URL

  // If DATABASE_URL is not set, is "undefined" string, or empty, use default
  if (!databaseUrl || databaseUrl === "undefined" || String(databaseUrl).trim() === "") {
    // Default to dev.db in the project root (where it currently exists)
    return "file:./dev.db"
  }

  // Remove quotes if present (sometimes .env files have quotes)
  databaseUrl = String(databaseUrl).replace(/^["']|["']$/g, "").trim()

  // Final validation - ensure we have a valid URL
  if (!databaseUrl || databaseUrl === "undefined" || databaseUrl.length === 0) {
    return "file:./dev.db"
  }

  return databaseUrl
}

// Get validated database URL and ensure it's set in environment
const databaseUrl = getDatabaseUrl()
process.env.DATABASE_URL = databaseUrl

// Create Prisma client with standard SQLite (Prisma 5 supports this natively)
// No adapter needed - Prisma 5 handles SQLite directly
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
