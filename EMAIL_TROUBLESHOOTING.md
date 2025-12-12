# Email Not Sending - Troubleshooting Guide

If emails are not being sent, follow these steps to diagnose and fix the issue.

## Step 1: Check Server Logs

When you try to send a signature invite, check your server terminal (where `npm run dev` is running) for error messages.

Look for:
- `✅ Email sent successfully via Resend` - Success!
- `❌ Resend API error:` - Error from Resend
- `❌ Error sending email via Resend:` - Network/connection error
- `EMAIL (Development Mode - Not Actually Sent)` - No email service configured

## Step 2: Test Email Configuration

Run the email test script:

```bash
node scripts/test-email.js
```

This will:
- Check if your API key is valid
- Test the connection to Resend/SMTP
- Show specific error messages

## Step 3: Common Issues & Fixes

### Issue 1: "Invalid API key" or 401 Error

**Symptoms:**
- Error: `Invalid API key` or status 401
- Email not sending

**Fix:**
1. Go to https://resend.com/api-keys
2. Check if your API key is active
3. Create a new API key if needed
4. Update `.env.local`:
   ```env
   RESEND_API_KEY=re_your_new_key_here
   ```
5. **Restart your server** (important!)

### Issue 2: "Domain not verified" Error

**Symptoms:**
- Error mentions "domain" or "not verified"
- Email not sending

**Fix:**
- **Option A (Quick fix)**: Use Resend's test domain:
  ```env
  EMAIL_FROM=ContractVault <onboarding@resend.dev>
  ```
- **Option B (Production)**: Verify your domain in Resend:
  1. Go to https://resend.com/domains
  2. Add and verify your domain
  3. Use your verified domain:
     ```env
     EMAIL_FROM=ContractVault <noreply@yourdomain.com>
     ```

### Issue 3: "Rate limit exceeded"

**Symptoms:**
- Error mentions "rate limit"
- Email worked before but stopped

**Fix:**
- Wait a few minutes and try again
- Check your Resend dashboard for rate limit status
- Upgrade your Resend plan if needed

### Issue 4: No Error, But Email Not Received

**Possible causes:**

1. **Email in spam folder**
   - Check spam/junk folder
   - Ask recipient to check spam

2. **Wrong email address**
   - Verify the recipient email is correct
   - Try sending to your own email first

3. **Email actually sent but delayed**
   - Resend can take a few seconds
   - Check Resend dashboard for delivery status

4. **Server not restarted**
   - Environment variables only load on server start
   - Restart: `npm run dev`

### Issue 5: "No email service configured"

**Symptoms:**
- Console shows: `EMAIL (Development Mode - Not Actually Sent)`
- No actual email sent

**Fix:**
- Add email configuration to `.env.local`:
  ```env
  RESEND_API_KEY=re_xxxxx
  EMAIL_FROM=ContractVault <onboarding@resend.dev>
  ```
- Restart server

### Issue 6: Environment Variables Not Loading

**Symptoms:**
- Variables set in `.env.local` but not working
- Test script shows variables missing

**Fix:**
1. Verify file is named `.env.local` (not `.env`)
2. Check file is in project root (same level as `package.json`)
3. Restart server after adding variables
4. Check for typos in variable names:
   - `RESEND_API_KEY` (not `RESEND_KEY` or `RESEND_API`)
   - `EMAIL_FROM` (not `EMAIL_FROM_ADDRESS`)

## Step 4: Verify Configuration

Check your `.env.local` has:

```env
# Required for email
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=ContractVault <onboarding@resend.dev>

# OR for SMTP:
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# EMAIL_FROM=ContractVault <your-email@gmail.com>
```

## Step 5: Test with Real Email

1. **Send to yourself first:**
   - Use your own email address as recipient
   - Check inbox and spam folder
   - Verify email arrives

2. **Check Resend dashboard:**
   - Go to https://resend.com/emails
   - See if emails show as "sent"
   - Check for any errors

## Step 6: Debug Mode

Enable more detailed logging by checking server console when sending:

1. Open terminal where server is running
2. Try sending a signature invite
3. Look for detailed logs:
   - `Attempting to send email via Resend...`
   - `From: ...`
   - `To: ...`
   - `Subject: ...`
   - Success or error messages

## Quick Checklist

- [ ] `RESEND_API_KEY` is set in `.env.local`
- [ ] `EMAIL_FROM` is set in `.env.local`
- [ ] Server restarted after adding env vars
- [ ] API key is valid (test with `node scripts/test-email.js`)
- [ ] Using correct email format: `Name <email@domain.com>`
- [ ] For Resend: Using `onboarding@resend.dev` or verified domain
- [ ] Checked server logs for errors
- [ ] Tested with your own email first

## Still Not Working?

1. **Run the test script:**
   ```bash
   node scripts/test-email.js
   ```
   Share the output

2. **Check server logs:**
   - Copy the full error message from terminal
   - Look for lines starting with `❌` or `Error`

3. **Verify Resend account:**
   - Log into https://resend.com
   - Check API keys section
   - Check domains section (if using custom domain)
   - Check emails section for delivery status

4. **Try SMTP instead:**
   - If Resend isn't working, try SMTP
   - See `QUICK_EMAIL_SETUP.md` for SMTP options

## Alternative: Manual Sharing

If email isn't working, the system still creates signature invites. You can:
1. Copy the signing URL from the modal
2. Share it manually (email, Slack, etc.)
3. The signature system works without email!

