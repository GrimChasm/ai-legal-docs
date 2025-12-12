# Sentry Troubleshooting Guide

If you're not seeing errors in Sentry, follow these steps to diagnose the issue.

## Step 1: Verify Environment Variables

Check that you have all required Sentry environment variables in your `.env.local` file:

```env
NEXT_PUBLIC_SENTRY_DSN="https://...@....ingest.sentry.io/..."
SENTRY_DSN="https://...@....ingest.sentry.io/..."
SENTRY_ORG="your-org"
SENTRY_PROJECT="your-project"
```

**To verify:**
1. Open `.env.local` in your project root
2. Make sure all four variables are set
3. Make sure there are no typos
4. Make sure the DSN URLs are complete (they should start with `https://` and end with a number)

## Step 2: Restart Your Dev Server

After adding/updating environment variables, you MUST restart your dev server:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

Environment variables are only loaded when the server starts.

## Step 3: Check Sentry Initialization

### Check Console for Sentry Messages

When your app starts, you should see Sentry initialization messages in the console. Look for:
- No errors about missing DSN
- No errors about Sentry initialization

### Verify Sentry is Loaded

Open your browser's developer console (F12) and check:
1. Go to the **Console** tab
2. Type: `window.Sentry` or `window.__SENTRY__`
3. If Sentry is loaded, you should see an object (not `undefined`)

## Step 4: Test Error Reporting

### Test Client-Side Error

1. Create a test page or temporarily add to any page:

```typescript
"use client"

import { useEffect } from "react"

export default function TestError() {
  useEffect(() => {
    // This will trigger a client-side error
    throw new Error("Test Sentry client error - " + new Date().toISOString())
  }, [])

  return <div>Testing Sentry...</div>
}
```

2. Navigate to this page
3. Check Sentry dashboard within 10-30 seconds

### Test Server-Side Error

1. Create or modify an API route:

```typescript
// app/api/test-sentry/route.ts
export async function GET() {
  throw new Error("Test Sentry server error - " + new Date().toISOString())
}
```

2. Navigate to `/api/test-sentry` in your browser
3. Check Sentry dashboard

### Test React Error Boundary

1. Add to any component:

```typescript
"use client"

export default function TestComponent() {
  throw new Error("Test React error boundary - " + new Date().toISOString())
}
```

2. Navigate to a page that uses this component
3. Check Sentry dashboard

## Step 5: Check Sentry Dashboard

1. Go to https://sentry.io
2. Log in to your account
3. Select your organization
4. Select your project
5. Go to **Issues** in the left sidebar
6. Check if any errors appear

**Note:** It can take 10-30 seconds for errors to appear in Sentry.

## Step 6: Verify DSN is Correct

1. In Sentry dashboard, go to **Settings** → **Projects** → Your Project
2. Click **Client Keys (DSN)** in the left sidebar
3. Copy the DSN
4. Compare it with your `.env.local` file
5. Make sure they match exactly (including the `https://` prefix)

## Step 7: Check Network Requests

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Filter by "sentry" or "ingest.sentry.io"
4. Trigger a test error
5. Look for requests to `ingest.sentry.io`
6. Check if the request succeeds (status 200) or fails

**If you see failed requests:**
- Check the error message
- Verify your DSN is correct
- Check if you're being rate-limited

## Step 8: Check Development vs Production

Sentry behavior can differ between development and production:

### Development Mode
- Errors are sent to Sentry
- Debug mode is enabled (check console for Sentry logs)
- More verbose logging

### Production Mode
- Errors are sent to Sentry
- Less verbose logging
- Better performance

**To test in production mode:**
```bash
npm run build
npm start
```

## Step 9: Common Issues

### Issue: "DSN is not defined"

**Solution:**
- Make sure `NEXT_PUBLIC_SENTRY_DSN` is set in `.env.local`
- Restart your dev server
- Check for typos in the variable name

### Issue: "Sentry not initialized"

**Solution:**
- Check that `instrumentation.ts` exists in project root
- Check that `instrumentation-client.ts` exists in project root
- Verify `next.config.ts` has `experimental.instrumentationHook: true`
- Restart dev server

### Issue: "Errors not appearing in Sentry"

**Possible causes:**
1. **Wrong project selected** - Make sure you're looking at the correct project in Sentry
2. **Filters applied** - Check if any filters are hiding errors in Sentry dashboard
3. **Rate limiting** - Free tier has limits, check if you've exceeded them
4. **Network issues** - Check browser console for failed requests
5. **Wrong environment** - Make sure you're testing in the environment where Sentry is configured

### Issue: "Only seeing some errors"

**Solution:**
- Check `ignoreErrors` in Sentry config - some errors might be filtered out
- Check `denyUrls` in Sentry config - some URLs might be excluded
- Verify error is actually being thrown (check browser console)

## Step 10: Enable Debug Mode

To see more detailed Sentry logs, make sure debug is enabled:

In `sentry.server.config.ts` and `instrumentation-client.ts`:
```typescript
debug: process.env.NODE_ENV === "development", // Should be true in dev
```

Then check your console for Sentry debug messages.

## Step 11: Manual Test Script

Create a test script to verify Sentry is working:

```typescript
// app/test-sentry/page.tsx
"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"

export default function TestSentryPage() {
  useEffect(() => {
    console.log("Sentry DSN:", process.env.NEXT_PUBLIC_SENTRY_DSN ? "Set" : "Not set")
    console.log("Sentry object:", typeof window !== "undefined" ? window.Sentry : "N/A")
    
    // Test manual error capture
    const testError = () => {
      try {
        throw new Error("Manual Sentry test - " + new Date().toISOString())
      } catch (error) {
        Sentry.captureException(error)
        console.log("Error sent to Sentry:", error)
      }
    }
    
    // Test after 2 seconds
    setTimeout(testError, 2000)
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Sentry Test Page</h1>
      <p className="mb-4">Check the console and Sentry dashboard.</p>
      <button
        onClick={() => {
          throw new Error("Button click test - " + new Date().toISOString())
        }}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Trigger Error
      </button>
    </div>
  )
}
```

Navigate to `/test-sentry` and check:
1. Browser console for Sentry logs
2. Sentry dashboard for the error

## Quick Checklist

- [ ] Environment variables set in `.env.local`
- [ ] Dev server restarted after adding env vars
- [ ] DSN matches Sentry dashboard
- [ ] No console errors about Sentry
- [ ] Test error triggered
- [ ] Checked Sentry dashboard (Issues page)
- [ ] Waited 10-30 seconds for error to appear
- [ ] Checked correct project in Sentry
- [ ] No filters hiding errors in Sentry
- [ ] Network requests to Sentry are succeeding

## Still Not Working?

If you've tried everything above:

1. **Check Sentry Status**: https://status.sentry.io
2. **Check Sentry Documentation**: https://docs.sentry.io/platforms/javascript/guides/nextjs/
3. **Check Browser Console**: Look for any Sentry-related errors
4. **Check Server Logs**: Look for Sentry initialization messages
5. **Verify Project Settings**: In Sentry dashboard, check project settings and make sure it's active

## Getting Help

If you're still having issues:
1. Share your `.env.local` structure (without actual keys)
2. Share any console errors
3. Share Sentry dashboard screenshots
4. Check Sentry's status page for outages

