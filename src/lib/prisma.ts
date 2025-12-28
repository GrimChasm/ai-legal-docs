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

// Lazy initialization - only create client when actually accessed
let prismaInstance: PrismaClient | null = null

function getPrismaClient(): PrismaClient {
  // Return cached instance if available
  if (prismaInstance) {
    return prismaInstance
  }

  // Check if DATABASE_URL is available
  const hasDatabaseUrl = process.env.DATABASE_URL && 
                        process.env.DATABASE_URL.trim() !== "" && 
                        process.env.DATABASE_URL !== "undefined"

  if (!hasDatabaseUrl) {
    const isVercel = !!process.env.VERCEL
    let errorMessage = "DATABASE_URL environment variable is required.\n"
    
    if (isVercel) {
      errorMessage += 
        "\n🔧 For Vercel deployments:\n" +
        "1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables\n" +
        "2. Add DATABASE_URL with your PostgreSQL connection string\n" +
        "3. Make sure it's enabled for Production, Preview, and Development\n" +
        "4. IMPORTANT: Redeploy your project after adding the variable\n" +
        "   (Go to Deployments → Click ⋯ on latest deployment → Redeploy)\n\n" +
        "Example: postgresql://user:password@host:5432/database?schema=public\n\n" +
        "⚠️ Environment variables are only loaded at build/deploy time. " +
        "You MUST redeploy after adding a new variable."
    } else {
      errorMessage +=
        "\nFor PostgreSQL: DATABASE_URL=\"postgresql://user:password@localhost:5432/contractvault?schema=public\"\n" +
        "For SQLite (dev only): DATABASE_URL=\"file:./dev.db\"\n" +
        "See POSTGRESQL_MIGRATION.md for setup instructions."
    }
    
    throw new Error(errorMessage)
  }

  // Get validated database URL and ensure it's set in environment
  const databaseUrl = getDatabaseUrl()
  process.env.DATABASE_URL = databaseUrl

  // Use global instance in development, create new in production
  if (process.env.NODE_ENV !== "production" && globalForPrisma.prisma) {
    prismaInstance = globalForPrisma.prisma
  } else {
    // Create Prisma client
    prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    })

    // Store in global to prevent multiple instances in development
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prismaInstance
    }
  }

  return prismaInstance
}

// Export Prisma client using getter property
// This ensures the client is initialized when first accessed, not at module load time
// The proxy forwards all property access to the actual Prisma client instance
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient()
    const value = (client as any)[prop]
    // For direct methods on the client (like $connect, $disconnect), bind them
    // For model delegates (like user, draft), return them as-is (they're already properly structured)
    if (typeof value === "function" && prop.toString().startsWith("$")) {
      // Prisma client methods like $connect, $disconnect need binding
      return value.bind(client)
    }
    // For everything else (including model delegates), return as-is
    return value
  },
}) as PrismaClient
