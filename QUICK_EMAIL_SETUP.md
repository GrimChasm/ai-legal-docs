# Quick Email Setup Guide

## Why App Passwords Might Not Be Available

If you don't see "App Passwords" in your Google Account settings, it's usually because:
- 2-Factor Authentication (2FA) is not enabled
- You're using a Google Workspace account with restrictions
- Your account type doesn't support app passwords

## ✅ Easiest Solution: Use Resend (Recommended)

Resend is a modern email API that's much easier to set up than SMTP and doesn't require app passwords.

### Step 1: Sign Up for Resend
1. Go to https://resend.com
2. Click "Sign Up" (free tier available - 3,000 emails/month)
3. Verify your email address

### Step 2: Get Your API Key
1. After signing in, go to the **API Keys** section in the dashboard
2. Click **"Create API Key"**
3. Give it a name (e.g., "ContractVault Development")
4. Copy the API key (starts with `re_`)

### Step 3: Add to Your .env File
Open your `.env` file in the project root and add:

```env
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=ContractVault <noreply@yourdomain.com>
```

**Note:** For the `EMAIL_FROM` address:
- If you verified a domain in Resend, use: `ContractVault <noreply@yourdomain.com>`
- If you're just testing, Resend provides a test domain: `ContractVault <onboarding@resend.dev>`

### Step 4: Restart Your Server
```bash
# Stop your current server (Ctrl+C or Cmd+C)
# Then restart:
npm run dev
```

### Step 5: Test It
1. Create a document
2. Click "Send for Signature"
3. Add a recipient
4. Submit - you should see "✓ Email sent successfully"

That's it! Resend handles all the email delivery for you.

---

## Alternative: Other Email Services

If you prefer not to use Resend, here are other options:

### SendGrid (Free Tier: 100 emails/day)
1. Sign up at https://sendgrid.com
2. Get API key from Settings → API Keys
3. Add to `.env`:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your_sendgrid_api_key
   EMAIL_FROM=ContractVault <noreply@yourdomain.com>
   ```

### Mailgun (Free Tier: 5,000 emails/month)
1. Sign up at https://mailgun.com
2. Get SMTP credentials from your dashboard
3. Add to `.env`:
   ```env
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   SMTP_USER=your_mailgun_username
   SMTP_PASS=your_mailgun_password
   EMAIL_FROM=ContractVault <noreply@yourdomain.com>
   ```

### Gmail (If You Can Enable 2FA)
If you want to use Gmail and app passwords aren't available:
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (this is required for app passwords)
3. After enabling 2FA, "App passwords" will appear in your security settings
4. Generate an app password and use it in your `.env` file

---

## Development Mode (No Email Service)

If you don't want to set up email right now, the app will:
- Still create signature invites (they'll show as "Pending")
- Log email content to your server console
- Provide signing URLs that you can manually share

To see the email content and signing URLs:
1. Check your terminal where `npm run dev` is running
2. Look for the email output when you send an invite
3. Copy the signing URL and share it manually with recipients

---

## Troubleshooting

**"Email not configured" warning:**
- Make sure your `.env` file has the correct variable names
- Restart your dev server after adding environment variables
- Check that there are no typos in your API key

**"Email send failed" error:**
- Verify your API key is correct
- Check Resend dashboard for any errors
- Make sure your `EMAIL_FROM` address is valid

**Need help?**
- Check `EMAIL_SETUP.md` for more detailed instructions
- Resend documentation: https://resend.com/docs

