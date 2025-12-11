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

  // Final validation
  if (!databaseUrl || databaseUrl === "undefined" || databaseUrl.length === 0) {
    throw new Error("DATABASE_URL is empty or invalid. Please check your .env.local file.")
  }

  return databaseUrl
}

// Get validated database URL and ensure it's set in environment
const databaseUrl = getDatabaseUrl()
process.env.DATABASE_URL = databaseUrl

// Create Prisma client
// Supports both PostgreSQL (production) and SQLite (development)
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
