# Lemon Squeezy Payment Integration Setup

## Overview

This guide explains how to set up Lemon Squeezy payment processing for Atlas Protocol Pro subscriptions.

## Prerequisites

- Lemon Squeezy account (https://www.lemonsqueezy.com)
- Store ID from your Lemon Squeezy dashboard
- Product variant IDs for Pro and Pro+ plans
- API key for webhook signature verification

## Environment Variables

Add these to your `.env.local` and Vercel project settings:

```
NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID=<your-store-id>
NEXT_PUBLIC_LEMONSQUEEZY_PRO_VARIANT_ID=<pro-variant-id>
NEXT_PUBLIC_LEMONSQUEEZY_PROPLUS_VARIANT_ID=<pro-plus-variant-id>
LEMONSQUEEZY_WEBHOOK_SECRET=<your-webhook-secret>
LEMONSQUEEZY_API_KEY=<your-api-key>
```

### Finding These Values

1. **Store ID**: Lemon Squeezy Dashboard → Settings → Store Settings → Copy Store ID
2. **Variant IDs**: Create products in Lemon Squeezy:
   - Product: "Atlas Protocol Pro" → Variant: "$10/month"
   - Product: "Atlas Protocol Pro+" → Variant: "$30/month"
   - Copy variant IDs from product settings
3. **Webhook Secret**: Generate in Lemon Squeezy → Settings → Webhooks → Create new webhook
   - Endpoint: `https://yourdomain.com/api/lemon-webhook`
   - Select events: `order:created`, `subscription:created`, `subscription:renewed`, `subscription:cancelled`
   - Copy the signature secret

## Webhook Configuration

### Lemon Squeezy Dashboard

1. Go to Settings → Webhooks
2. Click "Create Webhook"
3. Set endpoint URL to: `https://yourdomain.com/api/lemon-webhook`
4. Enable these events:
   - `order:created`
   - `subscription:created`
   - `subscription:updated`
   - `subscription:cancelled`
   - `subscription:paused`
5. Copy the webhook signature secret to `LEMONSQUEEZY_WEBHOOK_SECRET`

### How Webhooks Work

When users complete payment in Lemon Squeezy:

1. Webhook sends event to `/api/lemon-webhook`
2. Signature is verified using `LEMONSQUEEZY_WEBHOOK_SECRET`
3. Event type determines action:
   - `order:created` / `subscription:created` / `subscription:updated` → Updates Supabase with active subscription
   - `subscription:cancelled` / `subscription:paused` → Downgrades to free tier
4. `subscription_history` table is updated for audit logging

## Components

### LemonSqueezyCheckout Component

Located at `/components/lemon-squeezy-checkout.tsx`

**Props:**
- `tier: "pro" | "pro+"` - Which tier to checkout
- `email?: string` - Pre-fill email in Lemon Squeezy
- `onSuccess?: () => void` - Callback when checkout completes
- `onError?: (error: string) => void` - Error callback

**Features:**
- Loads Lemon Squeezy SDK dynamically
- Automatically falls back to mock mode if env vars missing
- Theme-aware styling (blue light, purple dark)
- Shows clear messaging about test mode

### Webhook Endpoint

Located at `/app/api/lemon-webhook/route.ts`

**Functionality:**
- Verifies webhook signature for security
- Extracts customer email and product info
- Finds user in Supabase auth
- Creates/updates subscription record
- Logs to `subscription_history` table
- Handles async user lookups

## Testing

### Test Mode Flow

1. Leave env vars unconfigured → Component automatically uses mock mode
2. Click "Upgrade Now" → Mock checkout button appears
3. Click "Complete Mock Checkout" → Subscription saved to localStorage
4. For authenticated users with Lemon Squeezy configured:
   - Real Lemon Squeezy embed opens
   - Can use Lemon Squeezy test cards
   - Webhook updates Supabase on completion

### Test Payment Methods

Use these with Lemon Squeezy test mode:

- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

### Webhook Testing

Use Lemon Squeezy's webhook testing tool or `curl`:

```bash
curl -X POST https://yourdomain.com/api/lemon-webhook \
  -H "X-Signature: <calculated-signature>" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "type": "subscription:created",
      "attributes": {
        "status": "active",
        "customer_email": "user@example.com",
        "variant_name": "Pro"
      }
    },
    "meta": {
      "custom_data": {
        "user_id": "user-id-here"
      }
    }
  }'
```

## Fallback Behavior

### Missing Environment Variables

If Lemon Squeezy env vars are not configured:

- Checkout component shows **"Test Mode"** notice
- Mock checkout button appears
- For authenticated users: Saves to Supabase directly
- For non-authenticated users: Saves to localStorage only
- UI clearly indicates mock behavior

### Benefits of Fallback

- **Development**: Works without Lemon Squeezy setup
- **Testing**: Complete flow testable locally
- **Graceful degradation**: Never blocks checkout flow
- **User experience**: Clear indication of test mode

## Data Flow

```
User clicks "Upgrade Now"
           ↓
[/pro-upgrade page opens]
           ↓
User enters email
           ↓
LemonSqueezyCheckout component loads
           ↓
[If env vars present]
  └─→ Lemon Squeezy SDK loads
      └─→ Opens Lemon Squeezy checkout
          └─→ User enters payment info
              └─→ Payment processed
                  └─→ Webhook sent to /api/lemon-webhook
                      └─→ Supabase subscription updated
                          └─→ useProStatus fetches new status
                              └─→ Pro features unlock
[If env vars missing]
  └─→ Mock checkout button shown
      └─→ User clicks "Complete Mock Checkout"
          └─→ localStorage updated
              └─→ useProStatus fetches from localStorage
                  └─→ Pro features unlock
```

## Troubleshooting

### Webhook Not Firing

1. Check webhook URL in Lemon Squeezy settings matches your domain
2. Verify signature secret is correct
3. Check server logs for webhook receipt
4. Use Lemon Squeezy's webhook testing tool

### Signature Verification Failing

1. Confirm `LEMONSQUEEZY_WEBHOOK_SECRET` is correct
2. Ensure it's the raw secret, not base64 encoded
3. Check timestamp hasn't expired

### Subscription Not Updating

1. Verify customer email is in Supabase auth
2. Check that variant name matches "pro" or "pro+" pattern
3. Ensure `user_id` is being passed in webhook custom_data
4. Check Supabase RLS policies allow updates

### Mock Checkout Not Working

1. Verify localStorage is enabled
2. Check browser console for errors
3. Ensure `useProStatus` is within `ProProvider`

## Next Steps

1. **Get Lemon Squeezy account** at https://www.lemonsqueezy.com
2. **Create products and variants**
3. **Add environment variables** to `.env.local` and Vercel
4. **Configure webhook** in Lemon Squeezy dashboard
5. **Test locally** with mock mode first
6. **Test with real Lemon Squeezy** using test cards
7. **Deploy** to production
8. **Monitor webhooks** in Lemon Squeezy dashboard

## Production Checklist

- [ ] All env vars set in Vercel
- [ ] Webhook URL uses HTTPS
- [ ] Webhook events selected correctly
- [ ] Signature secret copied accurately
- [ ] Error handling tested
- [ ] Test payment verified subscription was created
- [ ] Monitor Lemon Squeezy webhook logs
- [ ] Set up monitoring/alerts for webhook failures
