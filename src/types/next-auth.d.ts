import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      isPro?: boolean // Pro subscription status
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    isPro?: boolean // Pro subscription status
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
  }
}

