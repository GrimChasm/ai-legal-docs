# .env.local File Verification Checklist

Use this checklist to verify your `.env.local` file is structured correctly for the send for signature system.

## ✅ Required for Send for Signature

These are **critical** for the signature system to work:

```env
# REQUIRED: Base URL for generating signing links
# For local development:
NEXTAUTH_URL=http://localhost:3000

# For production, use your actual domain:
# NEXTAUTH_URL=https://yourdomain.com
```

**Check**:
- [ ] `NEXTAUTH_URL` is present
- [ ] No quotes around the value (or consistent quotes if you use them)
- [ ] URL matches your current setup (localhost:3000 for dev)
- [ ] No trailing slash

**Note**: The system also checks `NEXT_PUBLIC_APP_URL` as a fallback, but `NEXTAUTH_URL` is preferred.

## ✅ Required for Application

These are needed for the app to function:

```env
# Database connection
DATABASE_URL="postgresql://user:password@localhost:5432/contractvault?schema=public"
# OR for SQLite (development only):
# DATABASE_URL="file:./dev.db"

# NextAuth authentication secret
NEXTAUTH_SECRET=your-secret-key-here
# OR (alternative name):
# AUTH_SECRET=your-secret-key-here

# OpenAI API (required for document generation)
OPENAI_API_KEY=sk-...
```

**Check**:
- [ ] `DATABASE_URL` is set and valid
- [ ] `NEXTAUTH_SECRET` or `AUTH_SECRET` is set
- [ ] `OPENAI_API_KEY` is set (starts with `sk-`)

## 📧 Optional: Email Configuration

Email is **optional** but recommended. The signature system works without it, but you'll need to manually share signing URLs.

### Option 1: Resend (Recommended - Easiest)

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=ContractVault <noreply@yourdomain.com>
# OR for testing with Resend's test domain:
# EMAIL_FROM=ContractVault <onboarding@resend.dev>
```

**Check**:
- [ ] `RESEND_API_KEY` starts with `re_`
- [ ] `EMAIL_FROM` is in format: `Name <email@domain.com>`

### Option 2: SMTP (Alternative)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=ContractVault <your-email@gmail.com>
```

**Check**:
- [ ] `SMTP_HOST` is set
- [ ] `SMTP_PORT` is set (usually 587 or 465)
- [ ] `SMTP_USER` is set
- [ ] `SMTP_PASS` is set (use app password for Gmail)
- [ ] `EMAIL_FROM` is set

**Note**: You only need ONE email method (Resend OR SMTP), not both.

## 💳 Optional: Stripe (for payments)

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...
STRIPE_PRICE_SINGLE_DOCUMENT=price_...
```

**Check**:
- [ ] Only needed if using payment features
- [ ] Test keys start with `sk_test_` and `pk_test_`
- [ ] Production keys start with `sk_live_` and `pk_live_`

## 📝 File Format Checklist

**General format rules**:
- [ ] No spaces around `=` sign
- [ ] Values can be quoted or unquoted (be consistent)
- [ ] No comments on same line as variable
- [ ] One variable per line
- [ ] No empty lines with just spaces
- [ ] File ends with newline (optional but good practice)

**Good examples**:
```env
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
RESEND_API_KEY=re_abc123
```

**Bad examples**:
```env
NEXTAUTH_URL = http://localhost:3000  # ❌ Spaces around =
NEXTAUTH_URL=http://localhost:3000/    # ❌ Trailing slash
NEXTAUTH_URL                            # ❌ Missing value
```

## 🔍 Quick Verification Script

You can verify your environment variables are being read correctly by checking the server logs when you start:

```bash
npm run dev
```

Look for:
- ✅ No errors about missing `DATABASE_URL`
- ✅ No errors about missing `NEXTAUTH_SECRET`
- ✅ No errors about missing `OPENAI_API_KEY`
- ⚠️ Warning about email not configured (OK if you haven't set it up)

## 🧪 Test Signature System Variables

To test if your signature-related variables are working:

1. **Check NEXTAUTH_URL**:
   - When you create a signature invite, the signing URL should start with your `NEXTAUTH_URL`
   - Example: If `NEXTAUTH_URL=http://localhost:3000`, URLs should be `http://localhost:3000/sign/...`

2. **Check Email** (if configured):
   - Try sending a signature invite
   - Check if email is sent or if you see "EMAIL_NOT_CONFIGURED" message
   - If email fails, check server logs for specific error

## 📋 Complete Template

Here's a complete template with all possible variables (remove what you don't need):

```env
# ============================================
# REQUIRED - Application Core
# ============================================

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/contractvault?schema=public"

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# AI/OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4

# ============================================
# REQUIRED FOR SIGNATURE SYSTEM
# ============================================

# Base URL for signing links (already set above as NEXTAUTH_URL)
# NEXTAUTH_URL is used for signature URLs

# ============================================
# OPTIONAL - Email (Choose ONE method)
# ============================================

# Option 1: Resend (Recommended)
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=ContractVault <noreply@yourdomain.com>

# Option 2: SMTP (Alternative)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# EMAIL_FROM=ContractVault <your-email@gmail.com>

# ============================================
# OPTIONAL - Payments (Stripe)
# ============================================

# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_PRICE_PRO_MONTHLY=price_...
# STRIPE_PRICE_PRO_YEARLY=price_...
# STRIPE_PRICE_SINGLE_DOCUMENT=price_...

# ============================================
# OPTIONAL - External Services
# ============================================

# DOCUSIGN_INTEGRATION_KEY=...
# DOCUSIGN_USER_ID=...
# DOCUSIGN_ACCOUNT_ID=...
# DOCUSIGN_RSA_PRIVATE_KEY=...
# DOCUSIGN_API_BASE_URL=https://demo.docusign.net/restapi

# HELLOSIGN_API_KEY=...
```

## 🚨 Common Issues

### Issue: "Signing URLs are wrong"
**Cause**: Missing or incorrect `NEXTAUTH_URL`
**Fix**: Set `NEXTAUTH_URL=http://localhost:3000` (or your production URL)

### Issue: "Email not configured" warning
**Cause**: No email service configured
**Fix**: This is OK! System still works, you just need to share URLs manually. Or add Resend/SMTP config.

### Issue: "Environment variable not found"
**Cause**: 
- Variable name typo
- Server not restarted after adding variable
- Variable in wrong file (should be `.env.local`)

**Fix**: 
- Check spelling
- Restart server: `npm run dev`
- Verify file is named `.env.local` (not `.env`)

### Issue: "Database connection failed"
**Cause**: Invalid `DATABASE_URL`
**Fix**: Check connection string format and credentials

## ✅ Final Checklist

Before testing the signature system, verify:

- [ ] `.env.local` file exists in project root
- [ ] `NEXTAUTH_URL` is set correctly
- [ ] `DATABASE_URL` is set and valid
- [ ] `NEXTAUTH_SECRET` is set
- [ ] `OPENAI_API_KEY` is set
- [ ] Server has been restarted after any changes
- [ ] No syntax errors in `.env.local` file
- [ ] Email config added (optional but recommended)

## 🎯 Minimum for Signature System

**Absolute minimum** to get signature system working:

```env
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET=...
OPENAI_API_KEY=...
```

Everything else is optional, but email makes it much better!


