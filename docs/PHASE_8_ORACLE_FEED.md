# Phase 8: Oracle Feed Tool - Implementation Guide

## Architecture

### Database
- `oracle_alerts` table in Supabase (executed via scripts/035)
  - Columns: id, wallet_address, asset_symbol, direction (above/below), threshold_price, is_active, triggered_at, created_at
  - RLS: Users can only manage their own alerts

### Backend
- `lib/oracle-feed-utils.ts` - Core oracle utilities
  - Pyth Network Hermes API integration for real-time prices
  - Supports SUI, BTC, ETH, SOL, USDC, USDT feed IDs
  - `fetchPythPrices(symbols?)` - Fetch latest from Pyth Hermes v2
  - `checkAlerts(alerts, prices)` - Compare alerts against live prices
  - `fetchOnChainPythPrice(feedId)` - On-chain verification stub
  - Fallback mock prices when Pyth API unavailable

- `app/api/oracle/prices/route.ts` - GET live prices
  - Optional `?symbols=SUI,BTC,ETH` query parameter
  - Returns price, confidence, EMA, 24h change, publish time

- `app/api/oracle/alerts/route.ts` - CRUD for price alerts
  - GET: Fetch user alerts by wallet address
  - POST: Create alert (awards 2 Airpoints via earn_directory)
  - DELETE: Remove alert by ID + wallet

### Frontend
- `components/oracle-feed-content.tsx` - Main UI component
  - Live Prices tab: 6 token cards with price, confidence, EMA, 24h change
  - Price Alerts tab: Create/manage alerts with wallet gating
  - Auto-refresh every 15 seconds via SWR
  - Pro upgrade CTA for unlimited alerts

- `app/oracle-feeds/page.tsx` - Page wrapper with Header/Footer/BackButton

### Navigation
- Added to Tools dropdown menu with Radio icon

## Airpoints Integration
- 2 Airpoints per alert created (type: earn_directory)

## Manual Setup for Production

### Required
- No additional API keys needed - Pyth Hermes API is free and public
- Supabase env vars must be configured (already done)

### Optional Enhancements
1. **SMS/Email Notifications** - Integrate Twilio or SendGrid for alert triggers
2. **Webhook Support** - POST to user-defined URLs when alerts fire
3. **Cron Job** - Set up Vercel Cron to check alerts every 60s:
   - Create `/app/api/cron/check-alerts/route.ts`
   - Call `fetchPythPrices()` + `checkAlerts()` + mark triggered
4. **More Tokens** - Add new Pyth feed IDs to PYTH_PRICE_FEED_IDS map
5. **On-Chain Verification** - Implement Move call to verify Pyth prices on-chain
6. **Historical Charts** - Store price snapshots and render with Recharts

## Testing Checklist
- [ ] GET /api/oracle/prices returns 6 token prices
- [ ] GET /api/oracle/prices?symbols=SUI,BTC returns filtered prices
- [ ] POST /api/oracle/alerts creates alert and awards 2 Airpoints
- [ ] GET /api/oracle/alerts?wallet=0x... returns user alerts
- [ ] DELETE /api/oracle/alerts?id=...&wallet=0x... removes alert
- [ ] Frontend auto-refreshes prices every 15s
- [ ] Alert creation form validates inputs
- [ ] Pro CTA shows for non-pro users
