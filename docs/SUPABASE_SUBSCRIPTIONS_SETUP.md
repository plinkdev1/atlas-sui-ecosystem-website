# Supabase Pro Subscriptions Setup Guide

## Overview

This guide explains how to set up and use the Pro subscription database tables in Atlas Protocol's Supabase instance.

## Database Architecture

### 1. Subscriptions Table

Stores the current Pro subscription status for each user.

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL (unique),
  tier TEXT ('free' | 'pro' | 'pro+'),
  status TEXT ('active' | 'expired' | 'canceled'),
  expiry TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ (auto-updated)
)
```

**Key Features:**
- One subscription per user (UNIQUE constraint)
- Auto-timestamp on creation and updates
- RLS policies ensure users only see their own subscription
- Service role can manage all subscriptions

### 2. Subscription History Table

Audit trail for subscription events (created, renewed, canceled, upgraded, downgraded).

```sql
CREATE TABLE subscription_history (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type TEXT ('created' | 'renewed' | 'canceled' | 'upgraded' | 'downgraded'),
  tier TEXT ('free' | 'pro' | 'pro+'),
  previous_tier TEXT (optional),
  duration_days INTEGER (optional),
  timestamp TIMESTAMPTZ
)
```

## Setup Instructions

### Step 1: Run Migrations

Execute both SQL migration scripts in your Supabase SQL Editor:

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **SQL Editor**
3. Create new query
4. Copy contents of `/scripts/01-create-subscriptions-table.sql`
5. Execute
6. Create another query
7. Copy contents of `/scripts/02-create-subscription-history-table.sql`
8. Execute

### Step 2: Verify Environment Variables

Ensure these are set in your `.env.local` or Vercel project settings:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
```

Check Supabase > Settings > API for these values.

### Step 3: Test Connection

Make a test API call:

```bash
curl -X GET http://localhost:3000/api/subscription \
  -H "Authorization: Bearer [user-session-token]"
```

Should return:
```json
{ "subscription": { "user_id": "...", "tier": "free", "status": "active", ... } }
```

## Using the Subscription API

### Get User's Subscription

```typescript
import { getUserSubscription } from "@/lib/supabase/subscriptions"

const subscription = await getUserSubscription(userId)
// Returns: { tier: 'pro', status: 'active', expiry: '2024-03-15T...', ... }
```

### Upgrade to Pro

```typescript
import { updateSubscription } from "@/lib/supabase/subscriptions"

// Upgrade to Pro for 30 days
await updateSubscription(userId, 'pro', 30)

// Upgrade to Pro+ for 365 days
await updateSubscription(userId, 'pro+', 365)
```

### Cancel Subscription

```typescript
import { cancelSubscription } from "@/lib/supabase/subscriptions"

await cancelSubscription(userId)
// Sets tier to 'free', status to 'canceled', expiry to null
```

### Get Subscription History

```typescript
import { getUserSubscriptionHistory } from "@/lib/supabase/subscriptions"

const history = await getUserSubscriptionHistory(userId)
// Returns array of events: created, renewed, canceled, etc.
```

### Check Expiry Status

```typescript
import { isSubscriptionExpired, getDaysRemaining } from "@/lib/supabase/subscriptions"

if (isSubscriptionExpired(subscription)) {
  console.log("Subscription has expired")
}

const daysLeft = getDaysRemaining(subscription)
console.log(`${daysLeft} days remaining`)
```

## API Endpoints

### GET /api/subscription
Fetch current user's subscription. Creates free tier if doesn't exist.

**Response:**
```json
{
  "subscription": {
    "id": "uuid",
    "user_id": "uuid",
    "tier": "pro",
    "status": "active",
    "expiry": "2024-03-15T00:00:00Z",
    "created_at": "2024-02-13T12:00:00Z",
    "updated_at": "2024-02-13T12:00:00Z"
  }
}
```

### POST /api/subscription
Perform subscription actions (upgrade, cancel, get history).

**Request Body:**
```json
{
  "action": "upgrade" | "cancel" | "history",
  "tier": "pro" | "pro+" (required for upgrade),
  "expiryDays": 30 (optional, default 30)
}
```

**Example - Upgrade:**
```json
{ "action": "upgrade", "tier": "pro", "expiryDays": 30 }
```

**Example - Cancel:**
```json
{ "action": "cancel" }
```

**Example - Get History:**
```json
{ "action": "history" }
```

## Row Level Security (RLS) Policies

### Users Table

```
✓ Users can READ their own subscription
✓ Users can UPDATE their own subscription
✓ Service role can do anything
```

### Subscription History Table

```
✓ Users can READ their own history
✓ Service role can do anything
```

### Why RLS?

- **Security**: Prevents unauthorized access to other users' subscriptions
- **Privacy**: Users only see their own data
- **Compliance**: Aligns with privacy regulations
- **Admin Access**: Service role has full access for backend operations

## Testing in Development

### Mock Mode (localStorage)

The Pro system falls back to localStorage mocking if Supabase isn't configured:

```typescript
// In pro-status-context.tsx
const { status, upgradeToPro } = useProStatus()

// Upgrades to Pro for 30 days (stored in localStorage)
upgradeToPro("pro", 30)
```

### Production Mode (Supabase)

When SUPABASE_ANON_KEY is configured, the system uses the database instead of localStorage.

### Switching Between Modes

- **Development**: Use localStorage for quick testing
- **Staging**: Use Supabase for realistic testing
- **Production**: Always use Supabase

## Monitoring & Analytics

Query subscription statistics in Supabase SQL Editor:

```sql
-- Total Pro subscribers
SELECT COUNT(*) as pro_users, tier
FROM subscriptions
WHERE status = 'active'
GROUP BY tier;

-- Recently upgraded
SELECT user_id, event_type, tier, timestamp
FROM subscription_history
WHERE event_type IN ('upgraded', 'renewed')
ORDER BY timestamp DESC
LIMIT 20;

-- Churn analysis
SELECT COUNT(*) as cancellations, DATE(timestamp) as date
FROM subscription_history
WHERE event_type = 'canceled'
GROUP BY DATE(timestamp);
```

## Troubleshooting

### "useProStatus must be used within ProProvider"
- Ensure ProProvider wraps your component in layout.tsx
- Check that the component is marked with "use client"

### Subscription not persisting
- Verify Supabase env vars are set correctly
- Check RLS policies are enabled
- Look for errors in browser console

### API returns 401 Unauthorized
- User session may have expired
- Check auth token is valid
- Verify user exists in auth.users

### Empty subscription after upgrade
- Wait for real-time sync (usually instant)
- Refresh page manually
- Check Supabase > Table Editor to verify insert

## Next Steps

1. ✅ Run migrations
2. ✅ Set environment variables
3. ✅ Test API endpoints
4. ✅ Integrate with Pro upgrade flow
5. ✅ Monitor usage and analytics
6. ✅ Set up payment processing (Stripe, etc.)
