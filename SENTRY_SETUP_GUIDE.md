# Sentry Setup Guide - Step by Step

This guide will walk you through getting all the Sentry credentials you need.

## Step 1: Sign Up for Sentry

1. Go to **https://sentry.io**
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up with:
   - Email address, OR
   - GitHub account (recommended - easier integration)
4. Verify your email if required

## Step 2: Create a New Project

1. After signing in, you'll see the Sentry dashboard
2. Click **"Create Project"** or **"Add Project"** (usually a button in the top right or on the welcome screen)
3. Select **"Next.js"** as your platform
4. Give your project a name (e.g., "ContractVault" or "AI Legal Docs")
5. Click **"Create Project"**

## Step 3: Get Your DSN (Data Source Name)

After creating the project, Sentry will show you a setup page with code snippets.

### Option A: From the Setup Page
1. Look for a section that says **"Configure your SDK"** or **"Client Configuration"**
2. You'll see code like this:
   ```javascript
   Sentry.init({
     dsn: "https://xxxxx@xxxxx.ingest.sentry.io/xxxxx",
     // ...
   })
   ```
3. Copy the DSN value (the URL starting with `https://`)

### Option B: From Project Settings
1. In your Sentry dashboard, go to **Settings** (gear icon in left sidebar)
2. Click **Projects** → Select your project
3. Click **Client Keys (DSN)** in the left sidebar
4. You'll see your DSN listed there
5. Click the **copy icon** next to the DSN to copy it

**You need TWO DSN values:**
- **NEXT_PUBLIC_SENTRY_DSN** - Same DSN for client-side
- **SENTRY_DSN** - Same DSN for server-side

*(They're the same value, but we use different env var names for clarity)*

## Step 4: Get Your Organization and Project Names

### Organization Name
1. In Sentry dashboard, look at the top left corner
2. You'll see your organization name (usually your username or company name)
3. Click on it to see the organization slug
4. The slug is what you need (e.g., if it shows "my-company", that's your org name)

**OR:**
1. Go to **Settings** → **Organization Settings**
2. The organization slug is shown at the top

### Project Name
1. Go to **Settings** → **Projects** → Select your project
2. The project slug is shown in the URL or at the top of the page
3. It's usually lowercase with hyphens (e.g., "contractvault" or "ai-legal-docs")

**OR:**
1. Look at the URL when viewing your project
2. It will be: `https://sentry.io/organizations/YOUR-ORG/projects/YOUR-PROJECT/`
3. Extract the org and project names from the URL

## Step 5: Add to Your .env.local File

Open your `.env.local` file and add:

```env
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN="https://YOUR-DSN-HERE@YOUR-ORG.ingest.sentry.io/YOUR-PROJECT-ID"
SENTRY_DSN="https://YOUR-DSN-HERE@YOUR-ORG.ingest.sentry.io/YOUR-PROJECT-ID"
SENTRY_ORG="your-org-name"
SENTRY_PROJECT="your-project-name"
```

**Example:**
```env
NEXT_PUBLIC_SENTRY_DSN="https://abc123def456@o1234567.ingest.sentry.io/1234567"
SENTRY_DSN="https://abc123def456@o1234567.ingest.sentry.io/1234567"
SENTRY_ORG="my-company"
SENTRY_PROJECT="contractvault"
```

## Step 6: Verify It's Working

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Trigger a test error (you can add this temporarily to a page):
   ```typescript
   // Test error - remove after testing
   throw new Error("Test Sentry error")
   ```

3. Check your Sentry dashboard:
   - Go to **Issues** in the left sidebar
   - You should see the test error appear within a few seconds

4. Remove the test error code

## Quick Reference: Where to Find Everything

| What You Need | Where to Find It |
|--------------|------------------|
| **DSN** | Settings → Projects → Your Project → Client Keys (DSN) |
| **Organization Name** | Top left of dashboard, or Settings → Organization Settings |
| **Project Name** | Settings → Projects → Your Project, or in the URL |
| **All Settings** | Click the gear icon (⚙️) in the left sidebar |

## Troubleshooting

### "DSN not found" error
- Make sure you copied the entire DSN URL
- Check that there are no extra spaces in your `.env.local` file
- Restart your dev server after adding env vars

### "Organization not found" error
- Make sure the org name matches exactly (case-sensitive)
- Check for typos in `SENTRY_ORG`

### "Project not found" error
- Make sure the project name matches exactly (case-sensitive)
- Check for typos in `SENTRY_PROJECT`

### Errors not showing up in Sentry
- Check that `NEXT_PUBLIC_SENTRY_DSN` is set (required for client-side)
- Check browser console for Sentry errors
- Make sure you're in production mode or have debug enabled
- Check Sentry dashboard → Settings → Projects → Your Project → Client Keys to verify DSN is active

## Free Tier Limits

Sentry's free tier includes:
- ✅ 5,000 events per month
- ✅ 1 project
- ✅ 30-day error history
- ✅ Basic performance monitoring

This is usually enough for development and early production. You can upgrade later if needed.

## Next Steps

Once Sentry is set up:
1. ✅ Errors will automatically be tracked
2. ✅ You'll get email alerts for new errors
3. ✅ You can set up alerts in Sentry dashboard
4. ✅ Performance monitoring is enabled
5. ✅ User session replay is available (for debugging)

## Need Help?

- Sentry Docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- Sentry Support: https://sentry.io/support/


