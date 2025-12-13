# Deployment Guide

This guide will help you deploy your AI Legal Docs application to production.

## Quick Start: Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications and is made by the creators of Next.js.

### Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Database** - You'll need a PostgreSQL database (see Database Setup below)
4. **API Keys** - Gather all required environment variables (see below)

### Step 1: Prepare Your Repository

Make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel will auto-detect Next.js settings
4. **Important**: Before clicking "Deploy", configure environment variables (see below)

### Step 3: Configure Environment Variables

In Vercel, go to your project settings → Environment Variables and add:

#### Required Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# NextAuth Authentication
AUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="https://your-domain.com"  # Your production URL

# OpenAI (for document generation)
OPENAI_API_KEY="sk-..."

# Stripe (for payments)
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."  # From Stripe dashboard

# Email (Resend - recommended)
RESEND_API_KEY="re_..."

# Sentry (optional but recommended)
SENTRY_DSN="https://..."
SENTRY_ORG="your-org"
SENTRY_PROJECT="your-project"
SENTRY_AUTH_TOKEN="your-token"

# Application URL (fallback)
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Step 4: Database Setup

You need a PostgreSQL database. Options:

#### Option A: Vercel Postgres (Easiest)
1. In Vercel dashboard, go to Storage → Create Database
2. Select "Postgres"
3. Copy the `DATABASE_URL` connection string
4. Add it to your environment variables

#### Option B: External Database Providers
- **Neon** (recommended): [neon.tech](https://neon.tech) - Free tier available
- **Supabase**: [supabase.com](https://supabase.com) - Free tier available
- **Railway**: [railway.app](https://railway.app) - Easy setup
- **Render**: [render.com](https://render.com) - Free tier available

After setting up your database:

```bash
# Run migrations
npx prisma migrate deploy
# Or if using Vercel, add this as a build command:
# npx prisma generate && npx prisma migrate deploy
```

### Step 5: Configure Vercel Build Settings

In Vercel project settings → Build & Development Settings:

**Build Command:**
```bash
npm run build
```

**Install Command:**
```bash
npm install
```

**Output Directory:**
```
.next
```

**Root Directory:**
```
./
```

### Step 6: Playwright Configuration (Important!)

Your app uses Playwright for PDF exports. Vercel needs special configuration:

1. **Add Playwright to Vercel Build:**
   - In Vercel dashboard → Settings → Functions
   - Set "Serverless Function Region" to a region that supports Playwright
   - Add build environment variable: `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`

2. **Create `vercel.json`** in your project root:

```json
{
  "functions": {
    "src/app/api/export/pdf/route.ts": {
      "maxDuration": 30
    }
  },
  "build": {
    "env": {
      "PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD": "1"
    }
  }
}
```

**Alternative**: Consider using a separate service for PDF generation (see "Alternative Deployment Options" below).

### Step 7: Deploy!

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be live at `https://your-project.vercel.app`
4. Set up a custom domain (optional) in Vercel settings

---

## Alternative Deployment Options

### Option 2: Railway

[Railway](https://railway.app) is great for full-stack apps with databases.

1. Connect your GitHub repo
2. Railway auto-detects Next.js
3. Add a PostgreSQL database
4. Configure environment variables
5. Deploy!

**Note**: Playwright works better on Railway than Vercel for serverless functions.

### Option 3: Render

[Render](https://render.com) offers free hosting with PostgreSQL.

1. Create a new Web Service
2. Connect your GitHub repo
3. Add a PostgreSQL database
4. Configure environment variables
5. Set build command: `npm run build`
6. Set start command: `npm start`

### Option 4: Self-Hosted (VPS)

For more control, deploy to a VPS (DigitalOcean, AWS EC2, etc.):

1. **Set up server:**
   ```bash
   # Install Node.js, PostgreSQL, etc.
   ```

2. **Clone repository:**
   ```bash
   git clone your-repo-url
   cd ai-legal-docs
   npm install
   ```

3. **Set up database:**
   ```bash
   npx prisma migrate deploy
   ```

4. **Build and run:**
   ```bash
   npm run build
   npm start
   ```

5. **Use PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "ai-legal-docs" -- start
   pm2 save
   pm2 startup
   ```

6. **Set up Nginx reverse proxy** (recommended)

---

## Post-Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Environment variables are set correctly
- [ ] Test user registration/login
- [ ] Test document generation
- [ ] Test PDF export (Playwright)
- [ ] Test DOCX export
- [ ] Test Stripe payments (use test mode first)
- [ ] Test email notifications
- [ ] Set up custom domain
- [ ] Configure SSL certificate (automatic with Vercel)
- [ ] Set up monitoring (Sentry)
- [ ] Test signature flow end-to-end

---

## Environment Variables Reference

### Required

| Variable | Description | How to Get |
|----------|-------------|------------|
| `DATABASE_URL` | PostgreSQL connection string | From your database provider |
| `AUTH_SECRET` | NextAuth secret key | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your production URL | `https://your-domain.com` |
| `OPENAI_API_KEY` | OpenAI API key | From [platform.openai.com](https://platform.openai.com) |

### Optional but Recommended

| Variable | Description | How to Get |
|----------|-------------|------------|
| `RESEND_API_KEY` | Email service API key | From [resend.com](https://resend.com) |
| `STRIPE_SECRET_KEY` | Stripe secret key | From [stripe.com](https://stripe.com) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | From Stripe dashboard |
| `SENTRY_DSN` | Sentry DSN | From [sentry.io](https://sentry.io) |
| `NEXT_PUBLIC_APP_URL` | Public app URL | Your production URL |

---

## Troubleshooting

### Build Fails

- Check that all environment variables are set
- Ensure `DATABASE_URL` is correct
- Check build logs in Vercel dashboard

### PDF Export Not Working

- Playwright may not work in serverless functions
- Consider using a separate service for PDF generation
- Or use a different deployment platform (Railway, Render)

### Database Connection Issues

- Verify `DATABASE_URL` format
- Check database firewall settings
- Ensure SSL is enabled (add `?sslmode=require`)

### Authentication Not Working

- Verify `AUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure cookies are enabled in browser

---

## Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use strong `AUTH_SECRET`** - Generate with OpenSSL
3. **Enable database SSL** - Always use `?sslmode=require`
4. **Use environment-specific keys** - Different keys for dev/staging/prod
5. **Enable Vercel security headers** - Automatic with Vercel
6. **Regularly update dependencies** - `npm audit` and `npm update`

---

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Playwright on Vercel](https://playwright.dev/docs/ci#vercel)

