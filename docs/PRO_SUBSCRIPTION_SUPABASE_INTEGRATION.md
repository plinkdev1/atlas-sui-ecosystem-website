# Pro Subscription Supabase Integration - Complete Guide

## Overview

The Pro subscription system now integrates with Supabase for authenticated users while maintaining localStorage fallback for non-authenticated testing.

## Architecture

### Authentication Flow
1. **useProStatus Context** - Reads from Supabase for authenticated users
2. **Fallback** - Uses localStorage for non-authenticated users
3. **Expiry Checking** - Automatically downgrades expired subscriptions

### Database Tables
- `subscriptions` - Current subscription state per user
- `subscription_history` - Audit log of subscription events

## How It Works

### For Authenticated Users
```typescript
// 1. ProProvider initializes and fetches user
const { user } = useSupabaseUser() // Gets Supabase auth user

// 2. Loads subscription from Supabase
const sub = await supabase
  .from("subscriptions")
  .select("*")
  .eq("user_id", user.id)
  .single()

// 3. Updates local state with fetched subscription
```

### For Non-Authenticated Users
```typescript
// Falls back to localStorage
const stored = localStorage.getItem("proStatus")
// Returns mock data for testing
```

### Upgrade Flow
```typescript
// When user clicks "Upgrade Now"
await upgradeToPro("pro", 30) // tier and days

// 1. Creates/updates Supabase row
await supabase.from("subscriptions").upsert({
  user_id: user.id,
  tier: "pro",
  status: "active",
  expiry: new Date(+30 days)
})

// 2. Updates local state
setStatus({ isPro: true, tier: "pro", expiry })

// 3. Syncs to localStorage as backup
localStorage.setItem("proStatus", JSON.stringify(...))
```

## Key Features

### Dual Persistence
- **Supabase**: Primary storage for authenticated users
- **localStorage**: Fallback for non-authenticated and offline

### Expiry Validation
- Subscriptions expire automatically after expiry date
- System downgrades to "free" tier on load if expired
- Automatic sync between Supabase and localStorage

### Async Operations
- `upgradeToPro()` now returns a Promise
- Properly handles Supabase errors with fallback
- Shows appropriate error toasts

## Testing Scenarios

### Scenario 1: Signed-In User Upgrades
1. User signs in with Supabase auth
2. Visits `/pro-upgrade`
3. ProContext fetches user's subscription from Supabase
4. Clicks "Upgrade to Pro"
5. **Result**: Row created in `subscriptions` table + local state updated

### Scenario 2: Non-Signed-In User Upgrades
1. User not signed in
2. Visits `/pro-upgrade`
3. ProContext uses localStorage only
4. Clicks "Upgrade to Pro"
5. **Result**: Data saved to localStorage only (localStorage fallback)
6. **Note**: Shows "Mock Mode" notice

### Scenario 3: Subscription Expires
1. User has active subscription with past expiry date
2. Refreshes page or comes back later
3. ProContext checks expiry on load
4. **Result**: Automatically downgrades to "free", clears localStorage

## Component Usage

### In Your Components
```tsx
import { useProStatus } from "@/lib/pro-status-context"

export function MyComponent() {
  const { status, upgradeToPro, downgradeToFree, isLoading } = useProStatus()

  // Check if user is pro
  if (status.isPro) {
    return <ProFeature />
  }

  // Render free tier
  return (
    <>
      <FreeFeature />
      <button onClick={() => upgradeToPro("pro", 30)}>
        Upgrade
      </button>
    </>
  )
}
```

## API Reference

### useProStatus Hook
```typescript
const { status, upgradeToPro, downgradeToFree, isLoading } = useProStatus()

// status
{ 
  isPro: boolean
  tier: "free" | "pro" | "pro+"
  expiry: Date | null
}

// async methods
await upgradeToPro("pro", 30)  // tier, days
await downgradeToFree()

// loading state
isLoading: boolean  // true while fetching from Supabase
```

## Error Handling

### Supabase Connection Fails
- Falls back to localStorage
- Shows error in console
- Continues working with cached data

### Checkout Fails
- User not authenticated → Shows auth reminder
- Supabase error → Shows error toast + continues with localStorage
- Form validation → Shows field validation errors

## Testing Checklist

- [ ] Sign in user can see their Pro status from Supabase
- [ ] Non-signed-in user can upgrade (localStorage mode)
- [ ] Pro features are gated based on tier
- [ ] Expired subscriptions auto-downgrade
- [ ] Upgrade toast shows correct tier
- [ ] User redirects to /hub after upgrade
- [ ] Refresh page maintains Pro status
- [ ] Sign out/in clears old Pro status
- [ ] Downgrade sets tier to "free"

## Next Steps for Production

1. **Real Payment** - Replace mock checkout with Stripe/Paddle
2. **Webhook** - Listen for payment events to update subscriptions
3. **Invoice** - Generate and email invoices
4. **Admin Dashboard** - View/manage user subscriptions
5. **Metrics** - Track upgrades, churn, LTV
6. **Support** - Refund/cancel endpoints
