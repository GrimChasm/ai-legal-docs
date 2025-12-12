# Send for Signature System Guide

## Overview

The send for signature system allows document creators to invite recipients to electronically sign documents. The system creates secure, token-based signing links that recipients can use to review and sign documents without needing an account.

## How It Works

### 1. **Document Creator Flow**
   - User creates/edits a document in the contract form
   - Clicks "Send for Signature" button
   - Modal opens to add recipient(s) (name and email)
   - System creates a `SignatureInvite` record in the database
   - Generates a unique token and signing URL
   - Attempts to send email with signing link (optional)
   - Returns signing URL(s) for manual sharing if email fails

### 2. **Recipient Flow**
   - Recipient receives email (or gets link manually)
   - Clicks link: `/sign/[token]`
   - System validates token and loads document
   - Recipient reviews document
   - Recipient enters name/email and creates signature
   - Signature is saved to database
   - Invite status updated to "signed"

### 3. **Database Models**

The system uses three main Prisma models:

- **`SignatureInvite`**: Stores invite information
  - `token`: Unique token for signing link
  - `recipientName`, `recipientEmail`: Recipient info
  - `status`: "pending" | "signed" | "declined"
  - `draftId`: Links to the document

- **`Signature`**: Stores actual signatures
  - `signatureData`: Base64 encoded signature image/text
  - `signatureType`: "drawn" | "typed" | "uploaded"
  - `role`: "creator" | "counterparty"
  - `draftId`: Links to the document

- **`Draft`**: The document being signed
  - Contains the markdown content that recipients see

## Components

### Frontend Components

1. **`SendForSignatureModal`** (`src/components/send-for-signature-modal.tsx`)
   - Modal for adding recipients
   - Handles form submission
   - Shows success with signing URLs

2. **Sign Page** (`src/app/sign/[token]/page.tsx`)
   - Public page for recipients to sign
   - Shows document preview
   - Signature pad interface

3. **`ContractForm`** (`src/components/contract-form.tsx`)
   - Triggers the send for signature modal
   - Shows signature status for existing invites

### API Routes

1. **`POST /api/signature-invites`**
   - Creates new signature invite
   - Generates token and signing URL
   - Sends email (if configured)
   - Returns signing URL

2. **`GET /api/signature-invites?draftId=xxx`**
   - Gets all invites for a document
   - Used to show signature status

3. **`GET /api/signature-invites/[token]`**
   - Public endpoint to load invite details
   - Used by signing page

4. **`POST /api/signature-invites/[token]`**
   - Submits signature from recipient
   - Creates Signature record
   - Updates invite status to "signed"

## Configuration Required

### 1. Environment Variables

The system needs these environment variables to work properly:

```env
# Base URL for generating signing links (REQUIRED)
NEXTAUTH_URL=http://localhost:3000
# OR for production:
NEXTAUTH_URL=https://yourdomain.com

# Email Configuration (OPTIONAL but recommended)
# Option 1: Resend (Recommended - easiest)
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=ContractVault <noreply@yourdomain.com>

# Option 2: SMTP (Alternative)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=ContractVault <your-email@gmail.com>
```

### 2. Database

The system requires the `SignatureInvite` and `Signature` tables. These should already exist if you've run migrations:

```bash
npx prisma migrate dev
```

Check your `prisma/schema.prisma` to ensure these models exist:
- `SignatureInvite`
- `Signature`
- `Draft` (with `signatureInvites` and `signatures` relations)

## What You Need to Do

### Step 1: Set Base URL

**CRITICAL**: Set `NEXTAUTH_URL` in your `.env` file:

```env
NEXTAUTH_URL=http://localhost:3000
```

Without this, signing URLs will be incorrect and won't work.

### Step 2: Configure Email (Optional but Recommended)

The system works without email, but it's much better with it. Choose one:

#### Option A: Resend (Easiest)
1. Sign up at https://resend.com (free tier: 3,000 emails/month)
2. Get API key from dashboard
3. Add to `.env`:
   ```env
   RESEND_API_KEY=re_your_key_here
   EMAIL_FROM=ContractVault <onboarding@resend.dev>
   ```

#### Option B: SMTP
1. Use any SMTP service (Gmail, SendGrid, Mailgun, etc.)
2. Add credentials to `.env`:
   ```env
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your-email@example.com
   SMTP_PASS=your-password
   EMAIL_FROM=ContractVault <your-email@example.com>
   ```

#### Option C: Development Mode (No Email)
- System will still work
- Emails logged to console
- Signing URLs shown in modal for manual sharing

### Step 3: Restart Server

After adding environment variables:
```bash
# Stop server (Ctrl+C or Cmd+C)
npm run dev
```

### Step 4: Test

1. Create or open a document
2. Click "Send for Signature" button
3. Add recipient name and email
4. Click "Send Invites"
5. Check:
   - If email configured: Recipient should receive email
   - If not: Modal shows signing URL to copy/share manually

## Troubleshooting

### "Send for Signature doesn't appear to work"

**Check 1: Is the button visible?**
- The button only appears when you have a saved draft
- Make sure you've generated the document first

**Check 2: Check browser console**
- Open DevTools (F12)
- Look for errors when clicking "Send for Signature"
- Check Network tab for failed API calls

**Check 3: Check server logs**
- Look at terminal where `npm run dev` is running
- Check for error messages

**Check 4: Verify NEXTAUTH_URL**
```bash
# In your .env file, make sure you have:
NEXTAUTH_URL=http://localhost:3000
```
Without this, signing URLs will be wrong.

**Check 5: Database issues**
```bash
# Make sure migrations are up to date
npx prisma migrate dev

# Check if tables exist
npx prisma studio
# Look for SignatureInvite and Signature tables
```

**Check 6: API route errors**
- Try calling the API directly:
  ```bash
  curl -X POST http://localhost:3000/api/signature-invites \
    -H "Content-Type: application/json" \
    -H "Cookie: your-session-cookie" \
    -d '{"draftId":"xxx","recipientName":"Test","recipientEmail":"test@example.com"}'
  ```

### "Email not sent" warning

This is **normal** if email isn't configured. The system will:
- Still create the invite
- Show the signing URL in the modal
- You can copy and share it manually

To enable email, see Step 2 above.

### "Invite not found" error

This usually means:
- Token is invalid/expired
- Database connection issue
- Invite was deleted

Check:
- Database connection
- Token in URL matches database
- Invite still exists in database

### Signing page shows error

**Check 1: Token format**
- Token should be 64-character hex string
- Check URL: `/sign/[token]` - token should be long

**Check 2: Database**
- Make sure invite exists: `npx prisma studio`
- Check `SignatureInvite` table

**Check 3: API route**
- Test: `GET /api/signature-invites/[token]`
- Should return invite with draft data

## System Flow Diagram

```
┌─────────────────┐
│ Document Creator │
└────────┬────────┘
         │
         │ Clicks "Send for Signature"
         ▼
┌─────────────────────────┐
│ SendForSignatureModal   │
│ - Add recipients        │
│ - Submit form           │
└────────┬────────────────┘
         │
         │ POST /api/signature-invites
         ▼
┌─────────────────────────┐
│ API Route               │
│ - Create SignatureInvite│
│ - Generate token        │
│ - Create signing URL    │
│ - Send email (optional) │
└────────┬────────────────┘
         │
         │ Returns signing URL
         ▼
┌─────────────────────────┐
│ Modal shows success     │
│ - Signing URL displayed │
│ - Can copy/share        │
└─────────────────────────┘

         │
         │ Recipient clicks link
         ▼
┌─────────────────────────┐
│ /sign/[token] page      │
│ - GET /api/signature-   │
│   invites/[token]       │
│ - Loads document        │
│ - Shows signature form  │
└────────┬────────────────┘
         │
         │ Recipient signs
         ▼
┌─────────────────────────┐
│ POST /api/signature-    │
│   invites/[token]       │
│ - Create Signature      │
│ - Update invite status  │
└────────┬────────────────┘
         │
         │ Success
         ▼
┌─────────────────────────┐
│ "Document Signed!"      │
│ - Creator can see       │
│   signature status      │
└─────────────────────────┘
```

## Key Files

- **Frontend**: `src/components/send-for-signature-modal.tsx`
- **Signing Page**: `src/app/sign/[token]/page.tsx`
- **API Routes**: 
  - `src/app/api/signature-invites/route.ts`
  - `src/app/api/signature-invites/[token]/route.ts`
- **Email Service**: `src/lib/email.ts`
- **Database Schema**: `prisma/schema.prisma`

## Next Steps

1. **Set `NEXTAUTH_URL`** in `.env` (required)
2. **Configure email** (optional but recommended - see `QUICK_EMAIL_SETUP.md`)
3. **Test the flow** with a test document
4. **Check signature status** in the contract form after sending

For email setup details, see:
- `QUICK_EMAIL_SETUP.md` - Quick guide (recommended)
- `EMAIL_SETUP.md` - Detailed guide


