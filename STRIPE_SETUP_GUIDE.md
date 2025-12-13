# Stripe Payment System Setup Guide

This guide will walk you through setting up the Stripe payment system for your legal document generator.

## Overview

The payment system includes:
- **Subscription plans** (Monthly and Yearly)
- **One-time payments** (optional)
- **Stripe Checkout** for secure payment processing
- **Webhook handling** for subscription updates
- **Billing portal** for customer self-service
- **Access control** to gate premium features

## Step 1: Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
npm install stripe @stripe/stripe-js
```

## Step 2: Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up or log in
3. Go to **Developers > API keys**
4. Copy your keys:
   - **Publishable key** (starts with `pk_test_` for test mode)
   - **Secret key** (starts with `sk_test_` for test mode)

⚠️ **Important**: Use test mode keys during development. Switch to live keys (`pk_live_` and `sk_live_`) only in production.

## Step 3: Create Products and Prices in Stripe

1. Go to **Products** in Stripe Dashboard
2. Click **+ Add product**
3. Create a product called "Pro Subscription"
4. Add two prices:
   - **Monthly**: Recurring, $X/month (or your price)
   - **Yearly**: Recurring, $Y/year (or your price)
5. Copy the **Price IDs** (they start with `price_...`)

If you want one-time payments:
1. Create another product called "Single Document Pack"
2. Add a one-time price
3. Copy the Price ID

## Step 4: Configure Environment Variables

Add these to your `.env.local` file:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx

# Stripe Price IDs (from Step 3)
STRIPE_PRICE_PRO_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_PRO_YEARLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_SINGLE_DOC=price_xxxxxxxxxxxxx  # Optional

# Stripe Webhook Secret (see Step 5)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

## Step 5: Set Up Webhooks

### For Local Development:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_...`) and add it to `.env.local`

### For Production:

1. Go to **Developers > Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Enter your URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed` (optional)
5. Copy the **Signing secret** and add it to your production environment variables

## Step 6: Configure Stripe Billing Portal (Optional but Recommended)

1. Go to **Settings > Billing > Customer portal** in Stripe Dashboard
2. Configure what customers can do:
   - Update payment methods
   - Cancel subscriptions
   - View invoices
3. Set a return URL (e.g., `https://yourdomain.com/billing`)

## Step 7: Run Database Migration

The migration has been created. Apply it:

```bash
# If not already applied
npx prisma migrate deploy
# Or for development
npx prisma db push
```

## Step 8: Test the Integration

### Test Cards (Stripe Test Mode):

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Use any future expiry date, any CVC, any ZIP

### Test Flow:

1. Start your dev server: `npm run dev`
2. Go to `/pricing`
3. Click "Get Pro – Monthly"
4. Complete checkout with test card
5. Check that webhook updates user in database
6. Verify user has `isPro: true` in database

## Step 9: Gate Premium Features

Use the access control helpers to gate premium features:

### In API Routes:

```typescript
import { requirePro } from "@/lib/subscription"

export async function GET(request: NextRequest) {
  const user = await requirePro(request)
  
  // If user is not Pro, requirePro returns an error response
  if (user instanceof NextResponse) {
    return user
  }
  
  // User has Pro access, continue...
}
```

### In React Components:

```typescript
import { useSession } from "next-auth/react"

function MyComponent() {
  const { data: session } = useSession()
  const isPro = session?.user?.isPro
  
  if (!isPro) {
    return <UpgradePrompt />
  }
  
  return <PremiumFeature />
}
```

## File Structure

```
src/
├── lib/
│   ├── stripe.ts              # Stripe client initialization
│   ├── pricing.ts             # Pricing plans configuration
│   └── subscription.ts        # Access control helpers
├── app/
│   ├── api/
│   │   └── stripe/
│   │       ├── create-checkout-session/route.ts
│   │       ├── create-billing-portal-session/route.ts
│   │       └── webhook/route.ts
│   ├── pricing/
│   │   └── page.tsx           # Pricing page
│   └── billing/
│       ├── page.tsx           # Billing management page
│       └── success/
│           └── page.tsx       # Success page after checkout
```

## Adding New Plans

1. Create the price in Stripe Dashboard
2. Add the price ID to `.env.local`: `STRIPE_PRICE_NEW_PLAN=price_xxx`
3. Add the plan to `src/lib/pricing.ts`:

```typescript
export const PLANS: Record<string, Plan> = {
  // ... existing plans
  NEW_PLAN: {
    priceId: process.env.STRIPE_PRICE_NEW_PLAN || "",
    label: "New Plan Name",
    interval: "month", // or "year" for subscriptions
    type: "subscription", // or "one_time"
    features: [
      "Feature 1",
      "Feature 2",
    ],
  },
}
```

4. The pricing page will automatically display it

## Troubleshooting

### Webhook not working?

- Check that `STRIPE_WEBHOOK_SECRET` is set correctly
- Verify webhook endpoint URL is correct
- Check Stripe Dashboard > Webhooks for event logs
- For local dev, make sure Stripe CLI is running

### User not getting Pro access after payment?

- Check webhook logs in Stripe Dashboard
- Verify webhook is receiving `checkout.session.completed` event
- Check database to see if user fields are being updated
- Ensure webhook secret matches

### Checkout session creation fails?

- Verify Stripe keys are correct
- Check that price IDs exist in Stripe
- Ensure user is authenticated
- Check server logs for error messages

## Security Notes

- ✅ Never expose `STRIPE_SECRET_KEY` to the client
- ✅ Always verify webhook signatures
- ✅ Use environment variables for all secrets
- ✅ Validate user authentication before creating checkout sessions
- ✅ Use HTTPS in production

## Next Steps

- Customize pricing page styling
- Add more premium features
- Implement usage limits for free users
- Add email notifications for subscription events
- Set up analytics for subscription metrics

## Support

For Stripe-specific issues, check:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Testing Guide](https://stripe.com/docs/testing)







