# Email Integration Setup

The e-signature feature includes automatic email sending for signature invites. This guide explains how to configure email services.

## Supported Email Services

### Option 1: Resend (Recommended)

Resend is a modern email API service that's easy to set up and use.

1. **Sign up** at [https://resend.com](https://resend.com)
2. **Get your API key** from the dashboard
3. **Add to `.env`**:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   EMAIL_FROM=ContractVault <noreply@yourdomain.com>
   ```

### Option 2: SMTP (Nodemailer)

Use any SMTP service (Gmail, SendGrid, Mailgun, etc.).

1. **Add SMTP credentials to `.env`**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   EMAIL_FROM=ContractVault <your-email@gmail.com>
   ```

   **For Gmail:**
   - Enable 2-factor authentication
   - Generate an "App Password" (not your regular password)
   - Use `smtp.gmail.com` as host and `587` as port

### Option 3: Development Mode (No Email Service)

If no email service is configured, the app will:
- Log emails to the console in development mode
- Return the signing URL in the API response for manual sharing
- Continue working normally (emails just won't be sent)

## Environment Variables

Add these to your `.env` file:

```env
# Required for production email sending (choose one method above)
RESEND_API_KEY=your-resend-api-key
# OR
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password

# Optional: Custom "from" address
EMAIL_FROM=ContractVault <noreply@yourdomain.com>

# Required: Base URL for signature links
NEXTAUTH_URL=http://localhost:3000
# OR for production:
NEXTAUTH_URL=https://yourdomain.com
```

## Testing

1. **Start your development server**: `npm run dev`
2. **Create a document** and click "Send for Signature"
3. **Add a recipient** and submit
4. **Check**:
   - If email is configured: Check the recipient's inbox
   - If not configured: Check the console for the email content and signing URL

## Email Template

The email template includes:
- Professional branding
- Document title
- Clear call-to-action button
- Signing link
- Security notice

You can customize the template in `src/lib/email.ts` in the `generateSignatureInviteEmail` function.

