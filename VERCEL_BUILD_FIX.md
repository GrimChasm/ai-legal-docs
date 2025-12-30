# Vercel Build Fix - "Provisioning integrations failed"

## Issue
Build failed with error: "Provisioning integrations failed"

## Common Causes

1. **Custom install script failing** - The `vercel.json` uses a custom install script
2. **Vercel integration not configured** - Database or other integration not set up
3. **Build command issues** - The build process failing early

## Solution 1: Simplify vercel.json (Try This First)

The current `vercel.json` uses a custom install script. Let's simplify it to use standard npm install:

### Updated vercel.json:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "functions": {
    "src/app/api/export/pdf/route.ts": {
      "maxDuration": 30
    }
  },
  "build": {
    "env": {
      "PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD": "1"
    }
  },
  "regions": ["iad1"]
}
```

## Solution 2: Check Vercel Dashboard

1. **Go to Vercel Dashboard** → Your Project → Settings → Integrations
2. Check if there are any integrations that failed:
   - Vercel Postgres
   - Vercel KV
   - Other integrations
3. If an integration is failing, try:
   - Removing and re-adding it
   - Or removing it if not needed

## Solution 3: Check Build Logs

1. Go to Vercel Dashboard → Deployments → Failed deployment
2. Click on the failed deployment
3. Look for the specific error message
4. Common errors:
   - "Install command failed"
   - "Database connection failed"
   - "Integration not found"

## Solution 4: Remove Custom Install Script (Recommended)

The custom install script might be causing issues. Try removing it and using standard npm install.

## Next Steps

1. **Update vercel.json** to use standard install command
2. **Commit and push** the change
3. **Redeploy** on Vercel
4. **Check logs** if it still fails

## If Using Vercel Postgres

If you're using Vercel Postgres integration:
1. Go to Vercel Dashboard → Storage
2. Ensure Postgres database is created
3. Check that `DATABASE_URL` environment variable is automatically set
4. Verify the integration is connected to your project
