import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = "test@example.com"
  const password = "test123"
  const name = "Test User"

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Set subscription expiration to 1 year from now
  const oneYearFromNow = new Date()
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

  if (existingUser) {
    // Update existing user to have Pro access
    const user = await prisma.user.update({
      where: { email },
      data: {
        isPro: true,
        subscriptionStatus: "active",
        stripeCurrentPeriodEnd: oneYearFromNow,
        // Update password in case it changed
        password: hashedPassword,
      },
    })

    console.log("✅ Test user updated with Pro access!")
    console.log("Email:", email)
    console.log("Password:", password)
    console.log("User ID:", user.id)
    console.log("Pro Status:", user.isPro)
    console.log("Subscription Status:", user.subscriptionStatus)
  } else {
    // Create new user with Pro access
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        isPro: true,
        subscriptionStatus: "active",
        stripeCurrentPeriodEnd: oneYearFromNow,
      },
    })

    console.log("✅ Test user created with Pro access!")
    console.log("Email:", email)
    console.log("Password:", password)
    console.log("User ID:", user.id)
    console.log("Pro Status:", user.isPro)
    console.log("Subscription Status:", user.subscriptionStatus)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

