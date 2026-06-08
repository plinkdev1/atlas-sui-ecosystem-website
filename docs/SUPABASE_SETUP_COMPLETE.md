# Supabase Pro Subscriptions Setup - Complete ✅

## Tables Created Successfully

Both migration scripts have been executed successfully:

### 1. `subscriptions` Table
**Columns:**
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users.id)
- `tier` (text: 'free' | 'pro' | 'pro+')
- `status` (text: 'active' | 'expired' | 'canceled')
- `expiry` (timestamptz)
- `created_at` (timestamptz, auto-set)
- `updated_at` (timestamptz, auto-updated)

**RLS Policies:**
- Users can READ only their own row
- Users can UPDATE only their own row
- Admins (service role) can READ/UPDATE all rows

### 2. `subscription_history` Table
**Columns:**
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users.id)
- `event_type` (text: 'created' | 'renewed' | 'canceled')
- `tier` (text: 'free' | 'pro' | 'pro+')
- `timestamp` (timestamptz, auto-set)

**RLS Policies:**
- Users can READ only their own history
- Only service role can INSERT (via API routes)

## Environment Variables

Required (add to `.env.local` or Vercel project settings):
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

## Database Helper Functions

Available in `/lib/supabase/subscriptions.ts`:
- `getUserSubscription(userId)` - Fetch user's current subscription
- `upgradeSubscription(userId, tier, days)` - Upgrade to Pro/Pro+
- `cancelSubscription(userId)` - Downgrade to free
- `getSubscriptionHistory(userId)` - Get user's subscription events
- `checkExpiredSubscriptions()` - Find and expire old subscriptions

## API Routes

### GET `/api/subscription`
Fetch current user's subscription status
```json
{ "subscription": { "tier": "pro", "status": "active", "expiry": "2024-12-31" } }
```

### POST `/api/subscription`
Upgrade subscription (body: `{ tier: "pro", days: 30 }`)

### DELETE `/api/subscription`
Cancel subscription

## Quick Test

```typescript
// In any server component or API route:
import { getUserSubscription } from "@/lib/supabase/subscriptions"

const sub = await getUserSubscription(userId)
console.log(sub.tier) // "free" | "pro" | "pro+"
```

## Next Steps

1. **Verify tables** in Supabase Dashboard → SQL Editor
2. **Test API routes** via `/api/subscription` endpoint
3. **Connect to Pro status context** to load real data from DB
4. **Update frontend** to use `useQuery` to fetch from API instead of localStorage only

## Troubleshooting

- **"User not found"**: Ensure user is authenticated before making requests
- **"No rows returned"**: User may not have a subscription row yet (create on first upgrade)
- **RLS permission denied**: Check service role key is set in env vars
