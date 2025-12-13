# Resend Domain Verification Guide

## The Problem

You're seeing this error:
```
You can only send testing emails to your own email address (juveellis@gmail.com). 
To send emails to other recipients, please verify a domain at resend.com/domains
```

This means Resend is in **test mode** and can only send to your account email.

## Solution: Verify Your Domain

To send emails to any recipient, you need to verify a domain in Resend.

### Step 1: Add Domain in Resend

1. Go to https://resend.com/domains
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourdomain.com` or `mail.yourdomain.com`)
4. Click **"Add"**

### Step 2: Add DNS Records

Resend will show you DNS records to add. You need to add these to your domain's DNS settings:

**Example records:**
```
Type: TXT
Name: @
Value: resend-domain-verification=abc123...

Type: MX
Name: @
Host: feedback-smtp.resend.com
Priority: 10

Type: CNAME
Name: resend
Value: resend.com
```

**Where to add DNS records:**
- **Cloudflare**: DNS → Records → Add record
- **GoDaddy**: DNS Management → Add
- **Namecheap**: Advanced DNS → Add New Record
- **Google Domains**: DNS → Custom records

### Step 3: Wait for Verification

- DNS changes can take a few minutes to propagate
- Resend will automatically verify when DNS is ready
- Check status at https://resend.com/domains
- Status should change from "Pending" to "Verified"

### Step 4: Update Your .env.local

Once verified, update your `.env.local`:

```env
EMAIL_FROM=ContractVault <noreply@yourdomain.com>
```

Replace `yourdomain.com` with your actual verified domain.

### Step 5: Restart Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 6: Test

Now you can send emails to any recipient!

## Quick Test (Without Domain Verification)

If you just want to test the system quickly:

1. **Send to your own email** (`juveellis@gmail.com`)
   - This works immediately
   - Good for testing the signature flow

2. **Use the signing URL manually**
   - The system still creates signature invites
   - Copy the signing URL from the modal
   - Share it manually (email, Slack, etc.)

## Domain Options

### Option 1: Use Your Main Domain
- If you own `yourdomain.com`
- Verify it in Resend
- Use `noreply@yourdomain.com` or `hello@yourdomain.com`

### Option 2: Use a Subdomain
- Create a subdomain like `mail.yourdomain.com`
- Verify the subdomain
- Use `noreply@mail.yourdomain.com`

### Option 3: Buy a Domain for Email
- Buy a cheap domain (e.g., `yourproductmail.com`)
- Verify it in Resend
- Use it only for sending emails

## Free Domain Options

If you don't have a domain yet:

1. **Freenom** (free domains): https://www.freenom.com
2. **Namecheap** ($1-2/year): https://www.namecheap.com
3. **Cloudflare** ($8-10/year): https://www.cloudflare.com/products/registrar

## Troubleshooting

### "Domain verification failed"

**Check:**
- DNS records are correct (copy exactly from Resend)
- DNS has propagated (can take up to 48 hours, usually minutes)
- No typos in domain name
- Using correct DNS record types (TXT, MX, CNAME)

**Test DNS propagation:**
```bash
# Check TXT record
dig TXT yourdomain.com

# Check MX record
dig MX yourdomain.com
```

### "Still getting 403 error after verification"

**Check:**
- Domain status shows "Verified" in Resend dashboard
- `.env.local` has correct domain in `EMAIL_FROM`
- Server restarted after updating `.env.local`
- Using verified domain email (not `onboarding@resend.dev`)

### "Can't add DNS records"

**Common issues:**
- Don't have access to DNS settings (contact domain provider)
- DNS provider doesn't support all record types
- Try a different DNS provider (Cloudflare is free and works well)

## Next Steps

Once your domain is verified:
1. ✅ Update `EMAIL_FROM` in `.env.local`
2. ✅ Restart server
3. ✅ Test sending to any email address
4. ✅ Production ready!

## Need Help?

- Resend Domain Docs: https://resend.com/docs/dashboard/domains/introduction
- Resend Support: https://resend.com/support



