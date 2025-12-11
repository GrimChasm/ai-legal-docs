-- AlterTable
ALTER TABLE "User" ADD COLUMN "stripeCustomerId" TEXT;
ALTER TABLE "User" ADD COLUMN "stripeSubscriptionId" TEXT;
ALTER TABLE "User" ADD COLUMN "stripePriceId" TEXT;
ALTER TABLE "User" ADD COLUMN "stripeCurrentPeriodEnd" DATETIME;
ALTER TABLE "User" ADD COLUMN "isPro" BOOLEAN NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "subscriptionStatus" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
CREATE UNIQUE INDEX "User_stripeSubscriptionId_key" ON "User"("stripeSubscriptionId");




