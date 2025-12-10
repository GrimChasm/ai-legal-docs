import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Ensure Prisma is available and database is connected
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          })

          if (!user || !user.password) {
            return null
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name || user.email,
          }
        } catch (error: any) {
          console.error("Auth error:", error)
          // Log the specific error for debugging
          if (error?.message) {
            console.error("Auth error details:", error.message)
          }
          // Return null to indicate authentication failed
          // This prevents the error from bubbling up and causing HTML responses
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
        
        // Fetch user's Pro status from database
        // Note: This adds a DB query to every session, but ensures fresh subscription status
        // For better performance, you could cache this in the JWT token and refresh periodically
        try {
          const { getUserProStatus } = await import("@/lib/subscription")
          const isPro = await getUserProStatus(token.id as string)
          session.user.isPro = isPro
        } catch (error) {
          console.error("Error fetching Pro status in session callback:", error)
          session.user.isPro = false
        }
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
}
