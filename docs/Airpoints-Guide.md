# Airpoints Loyalty System - Complete Guide

## Overview

Airpoints is Atlas Protocol's unified loyalty rewards system that syncs across the entire Treezures Labs ecosystem (Atlas Protocol, Flipper, and future apps). Users earn points through subscription engagement and feature usage, then redeem for discounts, premium features, or future token conversion.

## Architecture: Edge Functions + Local Supabase

### System Design

**Primary Path (Production):**
1. UI calls `useAirpointsSync()` hook
2. Hook calls Edge Functions in master Supabase (via `NEXT_PUBLIC_AIRPOINTS_EDGE_FUNCTION_URL`)
3. Edge Functions sync writes to both master and local Supabase
4. Local Supabase tables serve as read-through cache for fast access

**Fallback Path (Development/Misconfigured):**
- If Edge Function URL not set or call fails, automatically falls back to `/api/airpoints` route
- Route makes direct calls to local Supabase
- No data loss, just uses local state until master is available

### Edge Function Endpoints (Master Supabase)

```
GET  /get-airpoints-balance?wallet_address=...
POST /earn-airpoints        { wallet_address, amount, type, project, tier }
POST /redeem-airpoints      { wallet_address, amount, reason, project }
POST /update-airpoints-tier { wallet_address, tier, project }
```

**Payload includes `project: 'atlas'`** to identify source app

### Local Supabase Role (Atlas Protocol)

**Read-Only Public Endpoints:**
- `/api/airpoints?action=balance` - Fast local read of balance
- `/api/airpoints?action=history` - Fast local read of history

**Write Fallback:**
- Used only if Edge Functions unavailable
- All writes eventually sync back via Edge Functions

## ✅ Complete Implementation

### 1. **Database Schema** (Supabase)

#### `airpoints_balance` Table
- `id` - UUID primary key
- `user_id` - References auth.users.id
- `wallet_address` - Unique indexed address for cross-app lookup
- `balance` - Current Airpoints (bigint, default 0)
- `tier` - Subscription tier ('free' | 'pro' | 'pro+')
- `last_earned` - Timestamp of last monthly credit
- `last_updated` - Auto-updated timestamp
- **RLS**: Users can only read/write their own rows

#### `airpoints_history` Table
- `id` - UUID primary key
- `user_id` - User reference
- `wallet_address` - Address reference
- `amount` - Points earned/redeemed (bigint)
- `type` - Transaction type (earn_subscription, earn_cleanup, earn_explainer, earn_directory, redeem_discount, redeem_feature, convert_token)
- `description` - Human-readable description
- `timestamp` - Auto-created timestamp
- **RLS**: Users can only read their own history
- **Indexes**: On user_id, wallet_address, timestamp for fast queries

### 2. **Backend Utilities** (`/lib/supabase/airpoints.ts`)

**Core Functions:**

| Function | Purpose | Returns |
|----------|---------|---------|
| `getUserAirpointsBalance(userId)` | Fetch balance for user | AirpointsBalance \| null |
| `getOrCreateBalance(userId, wallet, tier)` | Get or create new balance | AirpointsBalance \| null |
| `addAirpoints(userId, amount, type, desc)` | Credit points | { success, newBalance } |
| `redeemAirpoints(userId, amount, type, desc)` | Deduct points | { success, newBalance } |
| `getAirpointsHistory(userId, limit, offset)` | Fetch transaction history | AirpointsHistoryEvent[] |
| `updateAirpointsTier(userId, tier)` | Sync tier with subscription | boolean |
| `creditMonthlyAirpoints(userId, tier)` | Check & credit monthly earning | { success, credited, amount } |

### 3. **React Hooks** (`/hooks/use-airpoints*.ts`)

#### `useAirpointsSync()` - Edge Function Hook (NEW)
```typescript
const { getBalance, earnPoints, redeemPoints, updateTier, syncing, isConfigured } = useAirpointsSync()

// Earn points via Edge Function
await earnPoints(100, 'earn_subscription', 'Pro monthly bonus')

// Redeem points via Edge Function
await redeemPoints(100, '10% advertising discount')

// Update tier via Edge Function
await updateTier('pro')
```
- **Calls Edge Functions** for all write operations
- **Auto-fallback** to local Supabase if Edge Function unavailable
- **Tier-aware** earning multipliers
- Returns `{ success, error, newBalance, data }`
- Exports `NEXT_PUBLIC_AIRPOINTS_EDGE_FUNCTION_URL` from environment

#### `useAirpoints()` - Main Hook (Read-Only)
```typescript
const { balance, tier, history, loading, error, isAuthenticated } = useAirpoints()
```
- Fetches balance from `/api/airpoints?action=balance` (local fast read)
- Fetches history from `/api/airpoints?action=history` (local fast read)
- Uses SWR for caching and auto-revalidation
- Returns 0 balance for unauthenticated users

#### `useAirpointsEarn()` - Earning Hook (Backward Compatible)
```typescript
const { earn, loading, error } = useAirpointsEarn()
await earn({ amount: 25, type: 'earn_cleanup', description: 'Cleanup scan' })
```
- Maintained for backward compatibility
- Can use either local API or Edge Function (configurable)
- Tier-based multipliers: Free=0x, Pro=1x, Pro+=3x
- Returns success/error status

### 4. **API Routes** (`/app/api/airpoints/route.ts`)

**GET Endpoints:**
- `?action=balance` - Returns current balance and tier
- `?action=history&limit=50&offset=0` - Returns paginated history

**POST Endpoints:**
- `action: "earn"` - Credit points (action bonuses)
- `action: "redeem"` - Deduct points (redemptions)
- `action: "creditMonthly"` - Check and credit monthly bonus
- `action: "update-tier"` - Sync tier from subscription

### 5. **UI Components**

#### `AirpointsDisplay` (`/components/airpoints-display.tsx`)
**Features:**
- Balance display with tier badge
- Monthly earning rate indicator (Free: 0, Pro: 1,250, Pro+: 3,500 pts/month)
- Progress bar to next milestone (blue/purple theme)
- Recent activity list (last 5 transactions)
- **Redemption Section** (when `showRedemption={true}`):
  - 10% Ad Discount: 100 pts (Pro/Pro+ only)
  - Convert to $ATLAS: 500 pts (Future feature)
  - Balance checking before redemption
  - Theme-aware buttons and toasts
- **Compact Mode** - Reduced layout for sidebars
- **History Display** - Full transaction log with timestamps and descriptions

**Props:**
```typescript
interface AirpointsDisplayProps {
  showHistory?: boolean      // Show recent activity
  compact?: boolean          // Compact layout
  showRedemption?: boolean   // Show redemption options
}
```

### 6. **Subscription Integration**

#### Pro Context Sync (`/lib/pro-status-context.tsx`)
- **upgradeToPro()** → Syncs to Airpoints:
  - Creates balance if needed
  - Updates tier (pro | pro+)
  - Credits initial points (100 or 300)
  - Logs to history

- **downgradeToFree()** → Syncs to Airpoints:
  - Updates tier to "free"
  - Keeps existing balance
  - Stops earning

#### Lemon Squeezy Webhook (`/app/api/lemon-webhook/route.ts`)
- **subscription:created** → Credit initial points + sync tier
- **subscription:updated** → Update tier
- **subscription:cancelled** → Set tier to free, keep balance

#### Client Layout Trigger (`/app/client-layout.tsx`)
- On login: Check if monthly earning is due (>30 days)
- Auto-credits Pro (100) or Pro+ (300) points
- Silent success, no disruption

### 7. **Cross-App Ecosystem**

**Shared Supabase Tables:**
- Both Atlas Protocol and Flipper use identical `airpoints_balance` and `airpoints_history` tables
- Tier changes in one app immediately reflect in others
- Balance accumulates across all apps
- Earning multipliers apply per-app based on local tier

**Sync Mechanism:**
- Users have single unified balance across Treezures Labs ecosystem
- Wallet address is primary identifier
- Earning in Atlas Protocol → Redeemable in Flipper
- Future apps automatically inherit same earning/redemption logic

## 📋 Complete Testing Guide

### Test 1: Free User Experience

**Setup:** Unauthenticated user or user with free tier

**Expected Results:**
- ✅ Balance shows 0 Airpoints
- ✅ Tier displays "Free"
- ✅ Monthly earning rate shows "0 pts/month"
- ✅ Redemption options locked with "Upgrade to Pro" message
- ✅ No earning on login (no monthly credit)
- ✅ Action bonuses locked (cleanup, analysis, etc.)

**Test Steps:**
1. Visit `/subscription` page as free user
2. View AirpointsDisplay component
3. Click "Redeem Now" button → Shows "Upgrade to Pro"
4. Attempt mock "Simulate Earn" button → Toast: "Upgrade to Pro to earn"

### Test 2: Pro User Monthly Earning

**Setup:** User upgraded to Pro tier

**Expected Results:**
- ✅ Balance updates on login (if >30 days since last earn)
- ✅ Balance increases by 100 points
- ✅ Tier shows "Pro" with earning rate 1,250 pts/month
- ✅ History shows `earn_subscription` entry
- ✅ `last_earned` timestamp updated

**Test Steps:**
1. Click "Test Pro Activation" button on `/subscription` page
2. Observe balance increases by 100 points
3. Refresh page → Monthly check runs, no additional credit (same day)
4. Open browser console → See `[v0] Monthly Airpoints credited: +100 pts`
5. Check history → New `earn_subscription` entry

### Test 3: Pro+ User Earning

**Setup:** User upgraded to Pro+ tier

**Expected Results:**
- ✅ Initial credit: 300 points (vs 100 for Pro)
- ✅ Monthly earning rate: 3,500 pts/month (vs 1,250 for Pro)
- ✅ Tier shows "Pro+" in badge
- ✅ All Pro features unlocked plus exclusive features

**Test Steps:**
1. Manually set tier to "pro+" in Supabase (or via test button when added)
2. Refresh page
3. Balance shows 300 points
4. Monthly earning rate shows "3,500 pts/month"

### Test 4: Action Bonuses (Earning)

**Setup:** Pro or Pro+ user

**Expected Results:**
- ✅ Mock "Simulate Earn" button credits 25 points
- ✅ Balance updates immediately
- ✅ History shows `earn_cleanup` entry
- ✅ Toast shows success with blue/purple styling

**Test Steps:**
1. Login as Pro user
2. Navigate to `/subscription` page
3. Click "Simulate Earn (+25 pts)" button
4. Observe toast: "Simulated earning: +25 Airpoints!"
5. Balance increases by 25 points
6. History shows new `earn_cleanup` transaction

### Test 5: Redemption (Mock Discount)

**Setup:** Pro/Pro+ user with ≥100 points

**Expected Results:**
- ✅ Balance decreases by 100 points
- ✅ History shows `redeem_discount` entry
- ✅ Toast: "Redeemed 100 Airpoints! Balance: [new amount]"
- ✅ Redemption button disabled while processing
- ✅ Page refreshes after 1.5 seconds to reflect changes

**Test Steps:**
1. Ensure Pro user has ≥100 points
2. Navigate to `/subscription` page
3. Scroll to Redemption section
4. Click "Redeem Now" on "10% Ad Discount"
5. Observe toast and balance decrease
6. Check history for `redeem_discount` entry

### Test 6: Insufficient Balance Lock

**Setup:** Pro user with <100 points

**Expected Results:**
- ✅ Redeem button disabled with gray styling
- ✅ Clicking shows error toast: "Insufficient balance. You need X more Airpoints."
- ✅ Button remains clickable but non-functional

**Test Steps:**
1. Create/test with user having exactly 50 points
2. Try to click "10% Ad Discount" button (100 pts)
3. See error toast with exact deficit amount

### Test 7: Subscription Change → Tier/Earning Sync

**Setup:** User initially Free, then upgrade

**Expected Results:**
- ✅ Tier syncs from "free" to "pro"
- ✅ Earning rate changes from 0 to 1,250 pts/month
- ✅ Initial 100 points credited
- ✅ Next monthly check uses new tier

**Test Steps:**
1. Start as Free user (0 balance)
2. Click "Test Pro Activation"
3. Observe tier changes to "Pro"
4. Balance becomes 100 (initial credit)
5. Monthly earning rate updates to "1,250 pts/mo"

### Test 8: Downgrade to Free

**Setup:** User Pro, then downgrade

**Expected Results:**
- ✅ Tier changes to "free"
- ✅ Earning rate changes to 0
- ✅ Existing balance preserved (not reset)
- ✅ Redemption options lock
- ✅ Next monthly check produces 0 credit

**Test Steps:**
1. Start with Pro user (has balance)
2. Click "Test Downgrade"
3. Observe tier changes to "Free"
4. Balance unchanged (preserved)
5. Earning rate shows "0 pts/month"
6. Redemption locked with "Upgrade to Pro"

### Test 9: History Logging

**Setup:** User with multiple transactions

**Expected Results:**
- ✅ Each action (earn/redeem) creates history entry
- ✅ Type field correctly set (earn_subscription, earn_cleanup, redeem_discount)
- ✅ Description field has human-readable text
- ✅ Timestamp auto-set
- ✅ History sorted newest-first
- ✅ Pagination works with limit/offset

**Test Steps:**
1. Perform multiple earning and redemption actions
2. View history in AirpointsDisplay
3. Check each entry has: amount, type, description, timestamp
4. Open Dev Tools → Network → Check `/api/airpoints?action=history`
5. Verify response includes all transactions

### Test 10: Cross-App Sync Note

**Expected Results:**
- ✅ Redemption section displays: "Earn Airpoints in Atlas Protocol, redeem in Flipper and other Treezures Labs apps"
- ✅ Same note visible in all Airpoints displays
- ✅ Reminds users of cross-app ecosystem benefits

**Test Steps:**
1. Navigate to `/subscription` page
2. Scroll to redemption section
3. See ecosystem note at bottom
4. Verify text mentions Flipper and ecosystem

## 🔧 Implementation Checklist

- ✅ Database tables created with proper RLS
- ✅ Supabase migrations executed
- ✅ Backend utility functions fully implemented
- ✅ React hooks (useAirpoints, useAirpointsEarn)
- ✅ API routes with GET/POST actions
- ✅ AirpointsDisplay component with all features
- ✅ Subscription integration (Pro context sync)
- ✅ Lemon Squeezy webhook sync
- ✅ Client layout monthly earning trigger
- ✅ Theme-aware styling (blue light, purple dark)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Error handling and validation
- ✅ Toast notifications (success, error, info)
- ✅ Cross-app ecosystem note

## 🚀 Deployment Checklist

Before going to production:
1. Verify all Supabase migrations have been executed
2. Test with real Lemon Squeezy webhooks in production
3. Set environment variables: SUPABASE_URL, SUPABASE_ANON_KEY
4. Verify RLS policies in Supabase console
5. Test cross-app sync with Flipper using shared tables
6. Monitor console logs for "[v0]" debug messages
7. Verify toasts display correctly in production theme
8. Test on mobile devices and different browsers

## 📱 User Flows

### New Pro User
1. Signup/Login
2. Upgrade to Pro via checkout
3. Webhook updates subscriptions table
4. Airpoints tier synced to "pro"
5. Initial 100 points credited
6. User sees balance in `/subscription` page
7. Monthly earning clock resets

### Earning Points
1. User logs in
2. Client layout checks if >30 days since last earn
3. If due, auto-credits 100/300 points
4. User performs action (cleanup scan)
5. Action bonus credited (10-25 points)
6. Balance updates in real-time
7. All transactions logged to history

### Redeeming Points
1. User clicks "Redeem Now" on discount option
2. Balance checked (must be ≥100 for discount)
3. API call made with redeem action
4. Points deducted from balance
5. History entry created
6. Toast confirms redemption
7. Page refreshes to reflect new balance
8. User can use discount in advertising settings

## 🎯 Future Enhancements

- Token conversion: Move from mock "Future" to real $ATLAS conversion queue
- Action-based bonuses: Integrate with cleanup, analysis, and directory modules
- Leaderboards: Show top earning users per tier
- Seasonal promotions: Bonus earning events
- Tier-specific perks: Additional unlock at higher tiers
- Referral earning: Bonus for inviting friends
- Cross-app redemption: Flipper integration for shared redemptions
