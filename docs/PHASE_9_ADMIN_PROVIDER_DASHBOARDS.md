# Phase 9: Admin & Provider Dashboard Enhancements

## Overview
Wired admin dashboard to real Supabase queries and enhanced provider dashboard with analytics.

## 9.1 Admin Dashboard (Real Data)

### Routes Created
- `GET /api/admin/stats` - Aggregated platform stats (user counts, revenue, activity)
- `GET /api/admin/users` - Paginated user list with role/search filters
- `PATCH /api/admin/users` - Change user roles or ban users
- `GET /api/admin/moderation` - Pending listings, moderation logs, partnership inquiries
- `POST /api/admin/moderation` - Approve/reject listings and inquiries with logging

### Admin Dashboard Tabs
1. **Overview** - Real-time stats cards (users, entitlements, revenue, pending actions), platform activity metrics, recent feedback, recent users
2. **Users** - Searchable/filterable user table with role change dropdowns, ban button, pagination (20 per page)
3. **Providers** - Pending listing approval/rejection with moderation logging
4. **Moderation** - Partnership inquiry management + full moderation audit log
5. **Revenue** - Total USD/SUI revenue, active subscription count, revenue records link

### Data Sources (Supabase Tables)
- `user_profiles` - User counts, roles, registration data
- `entitlements` - Active subscription counts
- `revenue_records` - Revenue totals (USD + SUI)
- `feedback` - User feedback with ratings
- `providers` - Provider counts
- `provider_listings` - Pending approval queue
- `moderation_logs` - Audit trail for all admin actions
- `partnership_inquiries` - Partner program requests
- `bridge_logs` / `nft_trade_logs` - Activity metrics

### Security
- Uses `SUPABASE_SERVICE_ROLE_KEY` for admin queries (bypasses RLS)
- Page level auth via `requireAdmin()` server-side check
- All moderation actions logged to `moderation_logs` table

## 9.2 Provider Dashboard Enhancements

### New Features
- **Analytics Tab** with real metrics from `provider_usage` table
  - Total requests, avg response time, uptime %, revenue share
  - Listings status overview (approved/pending/rejected)
  - Usage history table (last 30 days)
- **Revenue Tracking** from `revenue_records` table
- Proper role gating via `useSupabaseUser` hook

### Route Created
- `GET /api/providers/analytics?providerId=<id>` - Provider-specific analytics

### Component Created
- `components/provider-analytics.tsx` - Analytics UI with SWR auto-refresh

## 9.3 Footer & Navigation
- Provider Dashboard link already present in footer (verified)
- Admin dashboard accessible at `/admin/dashboard`

---

## TODO for Production

### Manual Setup Required
1. **Admin Role Assignment** - Manually set `role='admin'` and `is_admin=true` in `user_profiles` for the first admin user via Supabase dashboard
2. **Auth Middleware** - Add middleware to protect `/api/admin/*` routes by checking session token + admin role (currently uses service role key only)
3. **Rate Limiting** - Add rate limiting to admin API endpoints
4. **Audit Logging** - Extend moderation_logs to capture IP address and user agent
5. **Email Notifications** - Send emails when:
   - Provider listing is approved/rejected
   - Partnership inquiry status changes
   - User role changes
6. **Provider Usage Seeding** - Create a cron job or webhook to populate `provider_usage` with real metrics
7. **Revenue Reconciliation** - Add automated revenue share calculations from entitlement payments
8. **Dashboard Access Control** - Currently any authenticated user can hit admin API. Add proper middleware:
   ```ts
   // middleware.ts - add route protection
   if (pathname.startsWith('/api/admin')) {
     // verify admin session from cookie/token
   }
   ```
9. **Charts** - Add Recharts visualizations for:
   - User growth over time
   - Revenue trends (monthly)
   - Provider usage graphs
   - Activity heatmaps
