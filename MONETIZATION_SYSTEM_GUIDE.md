# Monetization System Implementation Guide

This document describes the complete monetization system for the AI legal document generator, including paywalled exports, subscription plans, and one-time document unlocks.

## Overview

The monetization system allows users to:
- **Generate documents for free** - Users can fill out forms, preview documents, and read them in the browser
- **Pay to export** - Exporting/downloading/saving requires either:
  - A Pro subscription (unlimited exports)
  - A one-time payment per document

## Architecture

### Core Components

1. **Database Schema**
   - `User.isPro` - Boolean flag for Pro subscription status
   - `Draft.hasPaidExport` - Boolean flag for per-document unlock
   - Stripe customer/subscription IDs stored on User model

2. **Pricing Configuration** (`src/lib/pricing.ts`)
   - `PLANS` - Subscription plans (Monthly, Yearly)
   - `ONE_TIME_PRODUCTS` - One-time payment products (Single Document)

3. **Export Permissions** (`src/lib/export-permissions.ts`)
   - `canExportDocument()` - Centralized permission check
   - Returns `true` if user has Pro OR document has `hasPaidExport = true`

4. **Paywall Modal** (`src/components/paywall-modal.tsx`)
   - Shows when user tries to export without access
   - Offers one-time unlock or Pro subscription

5. **API Routes**
   - `/api/stripe/create-checkout-session` - Creates Stripe checkout
   - `/api/stripe/webhook` - Handles payment events
   - `/api/drafts/[id]/export-permission` - Checks export permissions

## User Flow

### Free User Flow

1. User generates a document (free)
2. User previews document in browser (free)
3. User clicks "Export PDF" or "Export DOCX"
4. **Paywall modal appears** with two options:
   - Unlock this document (one-time payment)
   - Upgrade to Pro (subscription)

### Pro User Flow

1. User has active Pro subscription
2. User can export unlimited documents
3. No paywall appears

### One-Time Unlock Flow

1. User pays for single document unlock
2. Webhook marks `Draft.hasPaidExport = true`
3. User can now export that specific document
4. Other documents still require payment or Pro

## Implementation Details

### Export Permission Logic

```typescript
// User can export if:
// 1. User has Pro subscription (isPro = true), OR
// 2. Document has been unlocked (hasPaidExport = true)

async function canExportDocument(userId: string, draftId?: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  
  if (user?.isPro) return true // Pro users can export everything
  
  if (!draftId) return false // Need draftId for document-specific check
  
  const draft = await prisma.draft.findUnique({ where: { id: draftId } })
  return draft?.hasPaidExport === true
}
```

### Paywall Integration

The paywall is integrated into the contract form export buttons:

```typescript
// In contract-form.tsx
onClick={async () => {
  if (canExport === false) {
    setShowPaywallModal(true)
    return
  }
  // Proceed with export...
}}
```

### Checkout Session Creation

The checkout API accepts:
- `mode`: "subscription" or "payment"
- `productId`: "PRO_MONTHLY", "PRO_YEARLY", or "SINGLE_DOCUMENT"
- `draftId`: Optional, required for one-time unlocks

### Webhook Handling

The webhook handles:
- `checkout.session.completed` (subscription) → Set `user.isPro = true`
- `checkout.session.completed` (payment) → Set `draft.hasPaidExport = true`
- `customer.subscription.updated` → Update Pro status
- `customer.subscription.deleted` → Revoke Pro status

## Environment Variables

Required Stripe configuration:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs (from Stripe Dashboard)
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...
STRIPE_PRICE_SINGLE_DOCUMENT=price_...
```

## Setup Instructions

1. **Create Products in Stripe Dashboard**
   - Create "Pro Subscription" product
   - Add Monthly and Yearly recurring prices
   - Create "Single Document Export" product
   - Add one-time price
   - Copy price IDs to `.env.local`

2. **Configure Webhooks**
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Listen to: `checkout.session.completed`, `customer.subscription.*`
   - Copy webhook secret to `.env.local`

3. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

4. **Test the Flow**
   - Generate a document as free user
   - Try to export → paywall should appear
   - Complete test payment → document should unlock
   - Verify Pro subscription grants unlimited access

## Gated Features

The following features are paywalled:

- ✅ **Export as PDF** - Requires Pro or one-time unlock
- ✅ **Export as DOCX** - Requires Pro or one-time unlock
- ✅ **Copy full text** - Requires Pro or one-time unlock (future)
- ✅ **Save to account** - Requires Pro or one-time unlock (future)
- ✅ **E-signature** - Requires Pro subscription (future)

## Free Features

These features remain free:

- ✅ **Document generation** - Fill out forms and generate documents
- ✅ **Document preview** - View and read documents in browser
- ✅ **Scroll and read** - Full document viewing

## Code Organization

```
src/
├── lib/
│   ├── pricing.ts              # Pricing plans configuration
│   ├── export-permissions.ts    # Permission checking logic
│   └── stripe.ts                # Stripe client setup
├── components/
│   └── paywall-modal.tsx        # Paywall UI component
├── app/
│   ├── api/
│   │   ├── stripe/
│   │   │   ├── create-checkout-session/route.ts
│   │   │   └── webhook/route.ts
│   │   └── drafts/[id]/
│   │       └── export-permission/route.ts
│   ├── pricing/
│   │   └── page.tsx             # Pricing page
│   └── billing/
│       └── page.tsx             # Billing management
```

## Testing

### Test Cards (Stripe Test Mode)

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Use any future expiry, any CVC

### Test Scenarios

1. **Free user tries to export**
   - Should see paywall modal
   - Can choose one-time or subscription

2. **One-time payment flow**
   - Complete payment
   - Webhook unlocks document
   - User can now export

3. **Pro subscription flow**
   - Subscribe to Pro
   - Webhook grants Pro status
   - User can export all documents

4. **Subscription cancellation**
   - Cancel subscription
   - Webhook revokes Pro status
   - User loses export access (except previously unlocked docs)

## Future Enhancements

- Copy full text paywall
- Save document paywall
- E-signature paywall
- Usage limits for free users
- Document pack purchases
- Team/organization plans

## Troubleshooting

### Paywall not showing
- Check `canExport` state in contract form
- Verify API route `/api/drafts/[id]/export-permission` works
- Check browser console for errors

### Webhook not unlocking documents
- Verify webhook secret is correct
- Check Stripe Dashboard webhook logs
- Ensure `draftId` is in checkout session metadata

### Pro status not updating
- Check webhook is receiving events
- Verify database updates are happening
- Check user's `isPro` field in database

## Support

For issues or questions:
- Check Stripe Dashboard for payment logs
- Review webhook event logs
- Check database for user/draft status
- Review server logs for errors

