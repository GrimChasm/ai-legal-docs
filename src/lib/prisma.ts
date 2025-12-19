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

// Check if we're in a build context (Next.js build phase)
// During build, we should allow the module to be imported without errors
// Vercel sets VERCEL_ENV during builds, and Next.js sets NEXT_PHASE
const isBuildTime = process.env.NEXT_PHASE === "phase-production-build" || 
                    process.env.NEXT_PHASE === "phase-development-build" ||
                    (typeof process.env.NEXT_PHASE !== "undefined" && process.env.NEXT_PHASE.includes("build")) ||
                    (process.env.VERCEL === "1" && !process.env.DATABASE_URL && process.env.VERCEL_ENV)

function getPrismaClient(): PrismaClient {
  if (prismaInstance) {
    return prismaInstance
  }

  // Check if DATABASE_URL is available
  const hasDatabaseUrl = process.env.DATABASE_URL && 
                        process.env.DATABASE_URL.trim() !== "" && 
                        process.env.DATABASE_URL !== "undefined"

  if (!hasDatabaseUrl) {
    // During build time, we might not have DATABASE_URL - this is OK
    // We'll create a stub that throws only when actually used at runtime
    if (isBuildTime) {
      // Return a mock client that will fail gracefully when used
      // This allows the build to complete
      return {} as PrismaClient
    }
    
    // At runtime, throw an error if DATABASE_URL is missing
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
    // During build time, if DATABASE_URL is not available, return a stub
    // This prevents build errors while still allowing the code to compile
    if (isBuildTime && (!process.env.DATABASE_URL || 
                       process.env.DATABASE_URL.trim() === "" || 
                       process.env.DATABASE_URL === "undefined")) {
      // Return a function that throws when called, or undefined for properties
      if (typeof prop === "string" && prop !== "then" && prop !== "constructor") {
        return () => {
          throw new Error(
            "DATABASE_URL is required at runtime. Please ensure it's set in your environment variables."
          )
        }
      }
      return undefined
    }
    
    // At runtime or when DATABASE_URL is available, get the real client
    try {
      const client = getPrismaClient()
      const value = (client as any)[prop]
      if (typeof value === "function") {
        return value.bind(client)
      }
      return value
    } catch (error) {
      // If we're in build time and this fails, return a stub
      if (isBuildTime) {
        return () => {
          throw new Error(
            "DATABASE_URL is required at runtime. Please ensure it's set in your environment variables."
          )
        }
      }
      throw error
    }
  },
})

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
