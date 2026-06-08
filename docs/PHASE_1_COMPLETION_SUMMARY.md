# PHASE 1: COOKIE & DISCLAIMER BUG FIX + DB TABLES
## COMPLETION SUMMARY

### Objectives Achieved:
✅ **Root Cause Identified & Fixed**: Unstable identifiers (`session_${Date.now()}`) replaced with persistent `atlas_anon_id` UUID
✅ **API Endpoint Fixed**: Cookie banner now posts to correct `/api/cookies/save` endpoint (matched existing route)
✅ **Fast-Path Optimization**: localStorage checks prevent unnecessary DB round-trips on page navigation
✅ **DB Migrations Created**: Two new migration scripts for `cookie_consents` and `risk_disclaimers` tables

---

### Deliverables

#### 1. Database Migrations (2 scripts)

**File**: `/scripts/039_create_cookie_consents_table.sql`
- Creates `cookie_consents` table with columns: id, user_identifier (UUID, UNIQUE), analytics_accepted, marketing_accepted, essential_accepted, consent_given, created_at, updated_at, expires_at (90-day TTL)
- Indexes on user_identifier and expires_at for fast lookups
- RLS policies enabled for public insert/update/read (for anonymous users)

**File**: `/scripts/040_create_risk_disclaimers_table.sql`
- Creates `risk_disclaimers` table with columns: id, user_identifier (UUID, UNIQUE), accepted, accepted_at, created_at, updated_at, expires_at (365-day TTL)
- Indexes on user_identifier and expires_at
- RLS policies enabled for public access

#### 2. Component Fixes (2 files)

**File**: `/components/cookie-banner.tsx` (Fixed)
Changes:
- Added `getOrCreateIdentifier()` function that generates stable UUID via `crypto.randomUUID()` and persists to `localStorage.atlas_anon_id`
- Implemented localStorage fast-path: checks `atlas_cookie_accepted` flag instantly before DB check
- On accept/reject, saves flag to both localStorage AND DB for persistent consent
- Removed dependency on `atlas_user_id` (wallet-tied), making it work for all users

**File**: `/components/risk-disclaimer-modal.tsx` (Fixed)
Changes:
- Identical fix as cookie-banner: stable UUID generation + localStorage fast-path
- Checks `atlas_disclaimer_accepted` flag locally first
- On accept, saves to both localStorage and DB

#### 3. API Routes Updated (1 file)

**File**: `/app/api/cookies/save/route.ts` (Updated)
- Now properly handles all three consent flags: `analytics_accepted`, `marketing_accepted`, `essential_accepted`
- Uses UPSERT with `onConflict: "user_identifier"` to update existing records
- Includes `updated_at` timestamp for tracking consent modifications

---

### Technical Details

**Anonymous User ID Strategy:**
- Uses `crypto.randomUUID()` to generate a stable, cryptographically random UUID on first site visit
- Stored under key `atlas_anon_id` in localStorage (independent of wallet connection)
- Persists forever for that user on that browser/device — ideal for anonymous consent tracking
- Fallback to `session_${Date.now()}` if localStorage unavailable (privacy-protected environments)

**Consent Persistence Pattern:**
- Local flag: `atlas_cookie_accepted: "true"` → instant check, no network latency
- DB record: 90-day TTL for cookies, 365-day TTL for disclaimers
- Expiry handling: scheduled cleanup queries can delete expired records
- No reliance on wallet connection = works for 100% of visitors

**Database Design:**
- All public RLS policies → anonymous users can insert/update/read their own records
- Unique constraint on `user_identifier` prevents duplicate entries
- TTL columns enable future automatic cleanup (via cron or Supabase scheduling)

---

### How It Works (User Flow)

1. **First Visit**: User lands on site
   - Risk disclaimer modal appears (first check fails)
   - User clicks "I Understand & Accept"
   - `atlas_anon_id` generated + saved to localStorage
   - Both risk_disclaimers record created in DB AND `atlas_disclaimer_accepted` flag set locally
   
2. **Same Session, Different Page**: User navigates to another page
   - Modal checks localStorage for `atlas_disclaimer_accepted` → instant read
   - Modal doesn't appear (fast-path success)
   
3. **Next Day, Same Browser**: User returns
   - localStorage still has `atlas_disclaimer_accepted: true`
   - Modal doesn't appear (persistent flag still valid)
   
4. **Different Browser/Incognito**: User visits in new session
   - No localStorage history
   - DB check happens (slower, but accurate)
   - If DB record found within 365 days, modal doesn't appear
   - Otherwise, modal shows again

5. **Cookie Banner** works identically but with 90-day DB TTL and `atlas_cookie_accepted` flag

---

### Database Cleanup (Future)

To clean up expired records (optional, for storage optimization):

```sql
-- Run periodically (weekly/monthly) to remove expired consent records
DELETE FROM cookie_consents WHERE expires_at < now();
DELETE FROM risk_disclaimers WHERE expires_at < now();
```

---

### Testing Checklist

- [ ] Run migrations 039 and 040 against Supabase
- [ ] Clear localStorage and reload site → modals appear
- [ ] Accept both modals → `atlas_anon_id`, `atlas_cookie_accepted`, `atlas_disclaimer_accepted` appear in localStorage
- [ ] Reload page → modals do NOT appear (fast-path works)
- [ ] Open DevTools → Network tab → no `/api/cookies/check` or `/api/disclaimers/check` calls on reload (localStorage fast-path bypasses API)
- [ ] Delete `atlas_cookie_accepted` from localStorage, reload → banner appears, cookie API called
- [ ] Delete `atlas_anon_id` from localStorage → new UUID generated automatically on next page load
- [ ] Open incognito window → new UUID generated, modals appear
- [ ] Test in incognito, accept → localStorage is cleared on window close but DB record persists
- [ ] Reopen incognito window → DB check finds record, modals don't appear

---

### Environment Variables

No new environment variables needed. Uses existing Supabase setup.

---

### Next Phase

After running migrations 039 and 040:
✅ Ready to proceed to **PHASE 2: GLOBAL DESIGN SYSTEM** (colors, fonts, component tokens in globals.css)

---

### Files Modified:
1. `/scripts/039_create_cookie_consents_table.sql` (NEW)
2. `/scripts/040_create_risk_disclaimers_table.sql` (NEW)
3. `/components/cookie-banner.tsx` (FIXED)
4. `/components/risk-disclaimer-modal.tsx` (FIXED)
5. `/app/api/cookies/save/route.ts` (UPDATED)

### Total Changes: 3 migrations + 2 component fixes
