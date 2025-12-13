# Environment Variables Template

Copy these to your `.env.local` file and fill in your values.

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/contractvault?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# OpenAI
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_PRO_MONTHLY="price_..."
STRIPE_PRICE_PRO_YEARLY="price_..."
STRIPE_PRICE_SINGLE_DOCUMENT="price_..."

# Sentry (Error Monitoring)
# Get your DSN from https://sentry.io
NEXT_PUBLIC_SENTRY_DSN="https://...@....ingest.sentry.io/..."
SENTRY_DSN="https://...@....ingest.sentry.io/..."
SENTRY_ORG="your-org"
SENTRY_PROJECT="your-project"

# Google Analytics
# Get your Measurement ID from https://analytics.google.com
NEXT_PUBLIC_GA_ID="G-..."

# Redis (Rate Limiting)
# For local: redis://localhost:6379
# For Upstash: Get connection string from https://upstash.com
REDIS_URL="redis://localhost:6379"

# Email (Optional - choose one)
# Option 1: Resend
RESEND_API_KEY="re_..."
EMAIL_FROM="onboarding@resend.dev"

# Option 2: SMTP
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT="587"
# SMTP_USER="your-email@gmail.com"
# SMTP_PASS="your-app-password"
# EMAIL_FROM="your-email@gmail.com"
```

## Quick Setup Guide

### Sentry
1. Go to https://sentry.io and sign up
2. Create a new project (Next.js)
3. Copy the DSN values
4. Add to `.env.local`

### Google Analytics
1. Go to https://analytics.google.com
2. Create a property
3. Get your Measurement ID (G-XXXXXXXXXX)
4. Add to `.env.local`

### Redis (Upstash - Recommended)
1. Go to https://upstash.com and sign up
2. Create a Redis database
3. Copy the connection string
4. Add to `.env.local`
5. Install: `npm install ioredis`


