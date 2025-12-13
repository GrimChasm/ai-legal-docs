# Fix: Sentry DSN Not Set

Your debug page shows `"dsnSet": false`, which means the `NEXT_PUBLIC_SENTRY_DSN` environment variable is not set.

## Quick Fix Steps

### Step 1: Check if .env.local exists

In your project root, check if you have a `.env.local` file:

```bash
ls -la .env.local
```

If it doesn't exist, create it:

```bash
touch .env.local
```

### Step 2: Add Your Sentry DSN

Open `.env.local` and add:

```env
NEXT_PUBLIC_SENTRY_DSN="https://YOUR-DSN-HERE@YOUR-ORG.ingest.sentry.io/YOUR-PROJECT-ID"
SENTRY_DSN="https://YOUR-DSN-HERE@YOUR-ORG.ingest.sentry.io/YOUR-PROJECT-ID"
SENTRY_ORG="your-org-name"
SENTRY_PROJECT="your-project-name"
```

**To get your DSN:**
1. Go to https://sentry.io
2. Log in to your account
3. Go to **Settings** → **Projects** → Your Project
4. Click **Client Keys (DSN)** in the left sidebar
5. Copy the DSN (it looks like: `https://abc123@o1234567.ingest.sentry.io/1234567`)

### Step 3: Restart Your Dev Server

**IMPORTANT:** After adding/changing environment variables, you MUST restart your dev server:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

Environment variables are only loaded when the server starts.

### Step 4: Verify It's Working

1. Go to `/test-sentry-debug`
2. Click "Check Sentry Configuration"
3. You should now see:
   - `"dsn": "Set (hidden)"`
   - `"dsnSet": true`
   - `"windowSentryExists": true`

### Step 5: Test Error Reporting

1. Go to `/test-sentry`
2. Click any test button
3. Check your Sentry dashboard - errors should appear within 10-30 seconds

## Common Issues

### Issue: Still shows "Not set" after adding DSN

**Solutions:**
- Make sure you restarted the dev server
- Check for typos in the variable name: `NEXT_PUBLIC_SENTRY_DSN` (must be exact)
- Make sure there are no spaces around the `=` sign
- Make sure the DSN is in quotes: `"https://..."`
- Check that `.env.local` is in the project root (same folder as `package.json`)

### Issue: DSN is set but Sentry still not working

**Check:**
1. Verify the DSN is correct (copy it again from Sentry dashboard)
2. Check browser console for Sentry errors
3. Check Network tab for requests to `ingest.sentry.io`
4. Make sure you're looking at the correct project in Sentry dashboard

## Example .env.local File

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."

# OpenAI
OPENAI_API_KEY="sk-..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."

# Sentry (ADD THESE)
NEXT_PUBLIC_SENTRY_DSN="https://abc123def456@o1234567.ingest.sentry.io/1234567"
SENTRY_DSN="https://abc123def456@o1234567.ingest.sentry.io/1234567"
SENTRY_ORG="your-org"
SENTRY_PROJECT="your-project"

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID="G-..."
```

## After Fixing

Once you've added the DSN and restarted:
1. ✅ Debug page should show `dsnSet: true`
2. ✅ Test errors should appear in Sentry dashboard
3. ✅ Real errors from your app will be tracked automatically


