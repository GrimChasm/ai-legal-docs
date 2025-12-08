import { authOptions } from "./auth"
import NextAuth from "next-auth"

// Validate AUTH_SECRET is set
if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
  console.warn(
    "Warning: AUTH_SECRET or NEXTAUTH_SECRET is not set. " +
    "This may cause authentication errors. " +
    "Set AUTH_SECRET in your environment variables."
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)

