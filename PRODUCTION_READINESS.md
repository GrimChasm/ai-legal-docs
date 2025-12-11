# Production Readiness Guide

This document outlines the critical fixes and improvements needed before launching to production.

## ✅ Completed Critical Fixes

### 1. Input Validation ✅
- **Status**: Complete
- **Location**: `src/lib/validation.ts`
- **Coverage**: All API routes now validate inputs
- **Features**:
  - String, email, ID validation
  - Request body structure validation
  - XSS prevention (sanitization)
  - Field length limits

### 2. Error Boundaries ✅
- **Status**: Complete
- **Location**: `src/components/error-boundary.tsx`
- **Coverage**: Root layout wrapped with ErrorBoundary
- **Features**:
  - Catches React errors
  - User-friendly error display
  - Development error details
  - Reset functionality

### 3. Rate Limiting ✅
- **Status**: Complete
- **Location**: `src/lib/rate-limit.ts`
- **Coverage**: All critical API routes
- **Limits**:
  - Document generation: 20 requests/minute
  - Drafts: 60 requests/minute
  - Checkout: 10 requests/minute
  - Default: 100 requests/minute
- **Note**: Currently in-memory. For production, migrate to Redis.

## ⚠️ Remaining Critical Tasks

### 4. Error Monitoring (Recommended: Sentry)

**Setup Instructions:**

1. Install Sentry:
```bash
npm install @sentry/nextjs
```

2. Initialize Sentry in `sentry.client.config.ts`:
```typescript
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})
```

3. Initialize in `sentry.server.config.ts`:
```typescript
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

4. Update `next.config.ts`:
```typescript
import { withSentryConfig } from "@sentry/nextjs"

export default withSentryConfig(nextConfig, {
  // Sentry options
})
```

5. Add to `.env.local`:
```
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_DSN=your-sentry-dsn
```

6. Update ErrorBoundary to send errors to Sentry:
```typescript
componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  Sentry.captureException(error, { contexts: { react: errorInfo } })
  // ... rest of code
}
```

### 5. PostgreSQL Migration

**Current**: SQLite (not suitable for production)
**Target**: PostgreSQL

**Migration Steps:**

1. **Update Prisma Schema** (`prisma/schema.prisma`):
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. **Update Environment Variables**:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/contractvault?schema=public"
```

3. **Create Migration**:
```bash
npx prisma migrate dev --name migrate_to_postgresql
```

4. **For Production**:
- Use a managed PostgreSQL service (Vercel Postgres, Supabase, AWS RDS, etc.)
- Set up connection pooling
- Configure backups
- Set up read replicas if needed

**Recommended Services:**
- **Vercel Postgres**: Easy integration with Vercel deployments
- **Supabase**: Free tier, good for startups
- **AWS RDS**: Enterprise-grade, scalable
- **Neon**: Serverless PostgreSQL

### 6. Critical Path Tests

**Priority Test Cases:**

1. **Authentication Tests**:
   - User signup
   - User login
   - Session management
   - Password validation

2. **Document Generation Tests**:
   - Generate document with valid inputs
   - Handle invalid inputs
   - Handle OpenAI API errors
   - Rate limiting

3. **Payment Tests**:
   - Create checkout session
   - Handle webhook events
   - Subscription activation
   - One-time payment unlock

**Test Setup:**

Create `__tests__/` directory and add:
- `auth.test.ts`
- `document-generation.test.ts`
- `payment.test.ts`

Use Jest or Vitest for testing.

### 7. Security Audit Checklist

- [ ] Review all API routes for authentication
- [ ] Verify input validation on all endpoints
- [ ] Check for SQL injection vulnerabilities (Prisma helps, but verify)
- [ ] Review XSS prevention (sanitization)
- [ ] Verify CSRF protection (NextAuth handles this)
- [ ] Check environment variable security
- [ ] Review Stripe webhook signature verification
- [ ] Verify rate limiting is effective
- [ ] Check for sensitive data in logs
- [ ] Review error messages (don't leak sensitive info)

### 8. Performance Optimization

- [ ] Enable Next.js Image Optimization
- [ ] Implement caching for static content
- [ ] Add database query optimization
- [ ] Implement API response caching where appropriate
- [ ] Set up CDN for static assets
- [ ] Monitor API response times

### 9. Monitoring & Observability

**Required:**
- Error tracking (Sentry recommended)
- Performance monitoring
- Uptime monitoring
- Database query monitoring

**Optional but Recommended:**
- User analytics
- API usage metrics
- Cost tracking (OpenAI, Stripe)

### 10. Backup & Disaster Recovery

- [ ] Set up automated database backups
- [ ] Test backup restoration
- [ ] Document recovery procedures
- [ ] Set up alerts for critical failures

## Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] Database migrated to PostgreSQL
- [ ] Error monitoring configured
- [ ] Rate limiting tested
- [ ] Input validation verified
- [ ] Security audit completed
- [ ] Critical path tests passing
- [ ] Backup strategy in place
- [ ] Monitoring alerts configured
- [ ] Documentation updated

## Quick Wins (Can Do Now)

1. **Add Sentry** (30 minutes)
2. **Set up basic tests** (1-2 hours)
3. **Create PostgreSQL migration** (1 hour)
4. **Add API response logging** (30 minutes)

## Production Environment Variables

Required for production:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="..."

# OpenAI
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_PRO_MONTHLY="price_..."
STRIPE_PRICE_PRO_YEARLY="price_..."
STRIPE_PRICE_SINGLE_DOCUMENT="price_..."

# Monitoring (Optional)
NEXT_PUBLIC_SENTRY_DSN="..."
SENTRY_DSN="..."

# Email (Optional)
RESEND_API_KEY="..."
# OR
SMTP_HOST="..."
SMTP_USER="..."
SMTP_PASS="..."
```

## Support & Resources

- **Next.js Production Deployment**: https://nextjs.org/docs/deployment
- **Prisma Production Guide**: https://www.prisma.io/docs/guides/deployment
- **Stripe Production Checklist**: https://stripe.com/docs/keys
- **Sentry Setup**: https://docs.sentry.io/platforms/javascript/guides/nextjs/




