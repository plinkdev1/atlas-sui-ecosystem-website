# Database Migration Scripts Verification & Deployment Guide

**Last Updated:** January 13, 2026  
**Status:** ✅ ALL SCRIPTS VERIFIED AND READY FOR DEPLOYMENT

---

## Overview

All 9 migration scripts (009-017) have been created and verified. They implement comprehensive backend database infrastructure needed for the Atlas Protocol production system.

---

## Migration Scripts Summary

### ✅ Script 009: Provider Listings Table
**File:** `scripts/009_create_provider_listings_table.sql`  
**Status:** Verified ✅  
**Purpose:** Store detailed provider information, categories, pricing tiers, and approval status  
**Tables Created:** `provider_listings` (1 table)  
**Policies:** 6 RLS policies  
**Records:** ~80 providers (RPC, Indexing, Validators, Gateways, Services)  
**Indexes:** 4 performance indexes

**Key Features:**
- Provider categorization (RPC, Indexing, Validator, Gateway, Service)
- Pricing tiers (Free, Freemium, Premium, Custom)
- Featured provider support
- Admin approval workflow (pending → approved/rejected/featured)
- JSONB features array for flexible provider attributes

---

### ✅ Script 010: API Keys Table
**File:** `scripts/010_create_api_keys_table.sql`  
**Status:** Verified ✅  
**Purpose:** Manage user API keys with rate limiting and monthly quotas  
**Tables Created:** `api_keys` (1 table)  
**Policies:** 4 RLS policies (SELECT, INSERT, UPDATE, DELETE)  
**Indexes:** 3 performance indexes

**Key Features:**
- User-owned API key generation
- Rate limiting per key (requests/second)
- Monthly quota per key (default 1M requests)
- Key expiration support
- Activity tracking (last_used_at)

---

### ✅ Script 011: Usage Logs Table
**File:** `scripts/011_create_usage_logs_table.sql`  
**Status:** Verified ✅  
**Purpose:** Track every API request for analytics and quota enforcement  
**Tables Created:** `usage_logs` (1 table)  
**Policies:** 1 RLS policy (users see own logs)  
**Indexes:** 4 performance indexes (api_key_id, created_at, endpoint, status_code)

**Key Features:**
- Per-request tracking (endpoint, method, response time, status code)
- IP address and user agent tracking
- Request/response size tracking
- Performance metrics (response_time_ms)
- Queryable by endpoint and status for analytics

---

### ✅ Script 012: Quota Usage Table
**File:** `scripts/012_create_quota_usage_table.sql`  
**Status:** Verified ✅  
**Purpose:** Track monthly quota consumption per API key  
**Tables Created:** `quota_usage` (1 table)  
**Policies:** 1 RLS policy (users see own quota)  
**Indexes:** 2 performance indexes (api_key_id, month)

**Key Features:**
- Monthly quota tracking (date-based)
- Status tracking (active, warning, limited)
- Requests used vs requests limit
- Unique constraint per (api_key_id, month) to prevent duplicates

---

### ✅ Script 013: Enhanced Entitlements Table (ALTER)
**File:** `scripts/013_create_entitlements_enhanced_table.sql`  
**Status:** Verified ✅  
**Purpose:** Add missing columns to existing entitlements table for payment tracking  
**Tables Modified:** `entitlements` (1 table)  
**Columns Added:** 5 new columns  
**Policies:** 4 new policies added (if not exists)  
**Type Casting:** Uses `auth.uid()::text` for proper UUID→text comparison

**Key Features:**
- amount_paid (decimal) - Payment amount in SUI
- coin_type (text) - Token type (SUI, USDC, etc)
- payment_method (text) - Payment method used
- auto_renew (boolean) - Auto-renewal configuration
- created_at, updated_at - Audit timestamps
- Safe ALTER approach (IF NOT EXISTS)

**Important:** This script uses `ALTER TABLE` instead of `CREATE TABLE` because entitlements already exists with data.

---

### ✅ Script 014: Provider Usage Table
**File:** `scripts/014_create_provider_usage_table.sql`  
**Status:** Verified ✅  
**Purpose:** Track usage analytics per entitlement/user  
**Tables Created:** `provider_usage` (1 table)  
**Policies:** 1 RLS policy (users see own usage)  
**Indexes:** 2 performance indexes (entitlement_id, period_date)

**Key Features:**
- Requests count tracking
- Bandwidth tracking (GB)
- Uptime percentage
- Response time averages
- Error rate tracking
- Period-based (daily/monthly)
- **Type Casting:** Uses `auth.uid()::text` for entitlements.user_id comparison

---

### ✅ Script 015: Transactions Table
**File:** `scripts/015_create_transactions_table.sql`  
**Status:** Verified ✅  
**Purpose:** Record all on-chain transactions (burns, hides, purchases, swaps, stakes, claims)  
**Tables Created:** `transactions` (1 table)  
**Policies:** 2 RLS policies (SELECT, INSERT own transactions)  
**Indexes:** 5 performance indexes

**Key Features:**
- Multi-type transaction support (burn, hide, purchase, stake, swap, claim)
- Transaction status tracking (pending, success, failed)
- Network tracking (testnet, devnet, mainnet)
- Gas usage tracking
- Error message storage
- On-chain confirmation tracking

---

### ✅ Script 016: Moderation Logs Table
**File:** `scripts/016_create_moderation_logs_table.sql`  
**Status:** Verified ✅  
**Purpose:** Audit trail for all admin moderation actions  
**Tables Created:** `moderation_logs` (1 table)  
**Policies:** 2 RLS policies (admins only)  
**Indexes:** 4 performance indexes

**Key Features:**
- Admin action tracking (approve, reject, feature, unfeature, remove, suspend)
- Provider and listing references
- Reason/justification for actions
- JSONB metadata for flexible data storage
- Admin ID tracking
- Complete audit trail

---

### ✅ Script 017: Revenue Records Table
**File:** `scripts/017_create_revenue_records_table.sql`  
**Status:** Verified ✅  
**Purpose:** Track financial records and revenue sharing  
**Tables Created:** `revenue_records` (1 table)  
**Policies:** 2 RLS policies (admins only)  
**Indexes:** 4 performance indexes

**Key Features:**
- Entitlement reference for traceability
- On-chain transaction hash storage
- Dual currency tracking (USD, SUI)
- Revenue sharing breakdown (Atlas vs Provider)
- Monthly period tracking
- Payout status tracking (pending, recorded, paid)
- Payout address storage
- Audit timestamps

---

## Deployment Procedure

### Prerequisites
✅ Supabase project connected  
✅ Database credentials available  
✅ Users table already exists  
✅ Providers table already exists  
✅ Entitlements table already exists  

### Step-by-Step Deployment

1. **Run Script 009** - Provider Listings
   ```
   Navigate to Supabase SQL Editor
   Copy entire contents of scripts/009_create_provider_listings_table.sql
   Execute
   Wait for: ✓ Success
   ```

2. **Run Script 010** - API Keys
   ```
   Copy scripts/010_create_api_keys_table.sql
   Execute
   Wait for: ✓ Success
   ```

3. **Run Script 011** - Usage Logs
   ```
   Copy scripts/011_create_usage_logs_table.sql
   Execute
   Wait for: ✓ Success
   ```

4. **Run Script 012** - Quota Usage
   ```
   Copy scripts/012_create_quota_usage_table.sql
   Execute
   Wait for: ✓ Success
   ```

5. **Run Script 013** - Enhanced Entitlements (ALTER)
   ```
   Copy scripts/013_create_entitlements_enhanced_table.sql
   Execute
   Wait for: ✓ Success
   Note: Uses ALTER TABLE (safe for existing data)
   ```

6. **Run Script 014** - Provider Usage
   ```
   Copy scripts/014_create_provider_usage_table.sql
   Execute
   Wait for: ✓ Success
   ```

7. **Run Script 015** - Transactions
   ```
   Copy scripts/015_create_transactions_table.sql
   Execute
   Wait for: ✓ Success
   ```

8. **Run Script 016** - Moderation Logs
   ```
   Copy scripts/016_create_moderation_logs_table.sql
   Execute
   Wait for: ✓ Success
   ```

9. **Run Script 017** - Revenue Records
   ```
   Copy scripts/017_create_revenue_records_table.sql
   Execute
   Wait for: ✓ Success
   ```

### Post-Deployment Verification

After all scripts execute successfully, verify in Supabase:

```sql
-- Check all new tables exist
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN (
  'provider_listings', 'api_keys', 'usage_logs', 'quota_usage', 
  'provider_usage', 'transactions', 'moderation_logs', 'revenue_records'
);

-- Verify RLS is enabled on all
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = true;

-- Count policies per table
SELECT tablename, count(*) as policy_count FROM pg_policies
WHERE schemaname = 'public' GROUP BY tablename;
```

---

## Critical Type Casting Notes

### UUID vs TEXT Comparison Issue
**Problem:** `entitlements.user_id` is stored as `text`, but `auth.uid()` returns `uuid`

**Solution:** Use explicit type casting: `auth.uid()::text`

**Affected Scripts:**
- Script 013: Uses `auth.uid()::text` in RLS policies ✅
- Script 014: Uses `auth.uid()::text` in RLS policies ✅

**Scripts without this issue:**
- Scripts 015-017: Compare UUID to UUID (no casting needed)

---

## RLS Policy Summary

### Total Policies: 22 policies across 8 new tables

| Table | Policies | Access Level |
|-------|----------|--------------|
| provider_listings | 6 | Public read, Provider write |
| api_keys | 4 | User private |
| usage_logs | 1 | User private |
| quota_usage | 1 | User private |
| entitlements | 4 | User + Admin |
| provider_usage | 1 | User private |
| transactions | 2 | User private |
| moderation_logs | 2 | Admin only |
| revenue_records | 2 | Admin only |

---

## Performance Indexes

### Total Indexes: 28 indexes across new tables

**Purpose:** Enable fast queries for:
- User-specific data lookups (user_id, entitlement_id)
- Time-series analytics (created_at, period_date)
- Endpoint-specific usage (endpoint filtering)
- Status-based filtering (status, tx_type)

---

## Data Relationships

```
auth.users
  ↓
user_profiles (id) ← [admin_id] moderation_logs
  ↓                    ↓
  ├→ [user_id] api_keys
  │   ├→ [api_key_id] usage_logs
  │   └→ [api_key_id] quota_usage
  │
  ├→ [user_id] entitlements (text id)
  │   ├→ [entitlement_id] provider_usage
  │   └→ [entitlement_id] revenue_records
  │
  ├→ [user_id] transactions (UUID id)
  │
  └→ providers
      ├→ [provider_id] provider_listings
      └→ [provider_id] moderation_logs
```

---

## Column Types & Constraints

### Numeric Precision
- **Decimals:** `decimal(20, 8)` for SUI amounts (8 decimal places)
- **USD Amounts:** `decimal(20, 2)` for USD (2 decimal places)
- **Percentages:** `decimal(5, 2)` for uptime/error rates
- **Integers:** For counts and gas usage

### String Fields
- **UUIDs:** `uuid` (database-native)
- **Addresses:** `text` (flexible for chain differences)
- **Hashes:** `text` (tx_hash, key_hash)
- **Enums:** `text` with CHECK constraints

### Temporal Fields
- **Timestamps:** `timestamp with time zone` (UTC)
- **Dates:** `date` for monthly periods
- **Audit Fields:** `created_at`, `updated_at`

---

## Important Notes

1. **Do NOT run scripts out of order** - Dependencies exist
   - Scripts 010-017 depend on existing users/providers tables
   - Script 013 modifies existing entitlements table

2. **Type Casting is Critical**
   - Scripts 013-014 use `::text` for UUID→text comparisons
   - Other scripts don't need casting (UUID→UUID is native)

3. **IF NOT EXISTS Clauses**
   - All tables use `CREATE TABLE IF NOT EXISTS`
   - Script 013 uses `ALTER TABLE ADD COLUMN IF NOT EXISTS`
   - Policies use `DO $$` blocks with existence checks

4. **RLS Must Be Enabled**
   - All tables have RLS enabled
   - All policies are active by default
   - Admin users need `is_admin = true` in user_profiles

5. **Indexes Are Automatic**
   - Primary keys create indexes automatically
   - Foreign key columns create indexes automatically
   - Explicitly created indexes are for performance optimization

---

## Rollback Procedure (if needed)

If a script fails or needs to be rolled back:

```sql
-- Drop entire table (deletes all data)
DROP TABLE IF EXISTS table_name CASCADE;

-- Or drop specific policies
DROP POLICY IF EXISTS "policy_name" ON table_name;

-- Then re-run the script
```

⚠️ **WARNING:** Dropping tables deletes all data. Only do this in development/testing.

---

## Next Steps After Deployment

1. **Verify Data Integrity**
   - Check row counts
   - Verify RLS policies are enforced
   - Test policy access controls

2. **Create Backend APIs**
   - API routes for CRUD operations
   - Rate limiting middleware
   - Usage tracking middleware

3. **Implement Usage Tracking**
   - Log API calls to usage_logs
   - Update quota_usage monthly
   - Calculate revenue_records

4. **Enable Provider Dashboard**
   - Providers can view own listings
   - Analytics from provider_usage
   - Revenue tracking from revenue_records

5. **Enable Admin Dashboard**
   - View all moderation_logs
   - Approve/reject provider_listings
   - Manage revenue_records and payouts

---

## Success Criteria

✅ All 9 scripts execute without errors  
✅ 8 new tables created with correct columns  
✅ 22 RLS policies active and enforced  
✅ 28 performance indexes created  
✅ Zero data loss in existing tables (script 013 uses ALTER)  
✅ All foreign key relationships valid  
✅ RLS policies tested and working  

---

**Status:** READY FOR DEPLOYMENT ✅  
**Estimated Deployment Time:** 5-10 minutes  
**Risk Level:** LOW (new tables, no existing data affected except script 013 which uses ALTER)
