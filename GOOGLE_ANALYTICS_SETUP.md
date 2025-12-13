# Google Analytics Setup Guide

This guide will walk you through setting up Google Analytics for your application.

## Step 1: Create Google Analytics Account

1. Go to **https://analytics.google.com**
2. Click **"Start measuring"** or **"Get started"**
3. Sign in with your Google account (or create one)

## Step 2: Create an Account (if needed)

1. If you don't have an account, you'll be prompted to create one
2. Enter an **Account name** (e.g., "ContractVault" or "My Business")
3. Configure account data sharing settings (you can customize these)
4. Click **"Next"**

## Step 3: Create a Property

1. Enter a **Property name** (e.g., "ContractVault Web App" or "AI Legal Docs")
2. Select your **Reporting time zone**
3. Select your **Currency**
4. Click **"Next"**

## Step 4: Configure Business Information

1. Select your **Industry category** (e.g., "Technology", "Business")
2. Select your **Business size** (e.g., "Small", "Medium")
3. Select how you plan to use Google Analytics (you can select multiple)
4. Click **"Create"**

## Step 5: Accept Terms of Service

1. Review and accept Google Analytics Terms of Service
2. Click **"I Accept"**

## Step 6: Set Up a Data Stream

1. You'll see options for different platforms:
   - **Web** (for websites)
   - **iOS app**
   - **Android app**
2. Click **"Web"** for your Next.js application

## Step 7: Configure Web Stream

1. Enter your **Website URL** (e.g., `https://yourdomain.com` or `http://localhost:3000` for testing)
2. Enter a **Stream name** (e.g., "ContractVault Production" or "ContractVault Development")
3. Click **"Create stream"**

## Step 8: Get Your Measurement ID

After creating the stream, you'll see a page with your stream details. Look for:

**Measurement ID** - It looks like: `G-XXXXXXXXXX`

This is what you need!

## Step 9: Add to Your .env.local File

1. Open your `.env.local` file in the project root
2. Add the following line:

```env
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

**Example:**
```env
NEXT_PUBLIC_GA_ID="G-ABC123XYZ"
```

## Step 10: Restart Your Dev Server

**IMPORTANT:** After adding the environment variable, restart your dev server:

```bash
# Stop the server (Ctrl+C), then:
npm run dev
```

## Step 11: Verify It's Working

### Method 1: Check Browser Console
1. Open your app in the browser
2. Open DevTools (F12)
3. Go to **Console** tab
4. Look for Google Analytics requests (you might see `gtag` calls)

### Method 2: Check Network Tab
1. Open DevTools (F12)
2. Go to **Network** tab
3. Filter by "google-analytics" or "gtag"
4. You should see requests to `www.google-analytics.com` or `www.googletagmanager.com`

### Method 3: Check Google Analytics Dashboard
1. Go to https://analytics.google.com
2. Select your property
3. Go to **Reports** → **Realtime**
4. Visit your website
5. You should see yourself as an active user within a few seconds

### Method 4: Use Google Tag Assistant (Chrome Extension)
1. Install [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk) Chrome extension
2. Visit your website
3. Click the extension icon
4. It will show if Google Analytics is working

## Quick Reference: Where to Find Your Measurement ID

1. Go to https://analytics.google.com
2. Click **Admin** (gear icon) in the bottom left
3. Under **Property**, click **Data Streams**
4. Click on your web stream
5. Your **Measurement ID** is shown at the top (format: `G-XXXXXXXXXX`)

## Troubleshooting

### Issue: No data appearing in Google Analytics

**Solutions:**
- Make sure you restarted your dev server after adding `NEXT_PUBLIC_GA_ID`
- Check that the Measurement ID is correct (starts with `G-`)
- Verify the ID in `.env.local` matches the one in Google Analytics
- Check browser console for any errors
- Make sure you're looking at the correct property in Google Analytics
- Wait a few minutes - data can take 24-48 hours to appear in standard reports (but Realtime should show immediately)

### Issue: "Measurement ID not found" error

**Solutions:**
- Verify the ID format: `G-XXXXXXXXXX` (must start with `G-`)
- Check for typos in `.env.local`
- Make sure there are no extra spaces
- Restart your dev server

### Issue: Not seeing real-time data

**Solutions:**
- Make sure you're in **Realtime** report (not standard reports)
- Check that ad blockers aren't blocking Google Analytics
- Try in an incognito/private window
- Verify the Measurement ID is correct

## What Gets Tracked

With the current setup, Google Analytics will automatically track:
- ✅ Page views
- ✅ User sessions
- ✅ Basic user behavior
- ✅ Traffic sources
- ✅ Device and browser information

## Optional: Enhanced Tracking

You can extend the Google Analytics component to track custom events. For example:

```typescript
// Track custom events
gtag('event', 'document_generated', {
  'document_type': 'NDA',
  'user_type': 'pro'
})
```

But the basic setup is complete and working!

## Next Steps

Once Google Analytics is set up:
1. ✅ Page views are automatically tracked
2. ✅ You can view reports in Google Analytics dashboard
3. ✅ Monitor user behavior and traffic
4. ✅ Set up goals and conversions (optional)
5. ✅ Create custom reports (optional)

## Support

- Google Analytics Help: https://support.google.com/analytics
- Google Analytics Academy: https://analytics.google.com/analytics/academy/


