# Atlas Protocol Backend Architecture Review & Execution Plan

This document provides a comprehensive review of the current backend state and outlines the roadmap for **Phase 2: Backend & Data Layer**.

## 1. Existing API Route Mapping

| Endpoint | Purpose | Status | Data Source / Dependencies |
| :--- | :--- | :--- | :--- |
| `/api/admin/*` | Moderation, Analytics, User Management | **Functional** | `user_profiles`, `provider_listings`, `transactions`, `revenue_records` |
| `/api/auth/wallet` | Sui Wallet connection & signature verify | **Functional** | `wallet_users`, `wallet_sessions`, `@mysten/sui/verify` |
| `/api/auth/profile` | Fetch/Update user profile | **Functional** | `user_profiles` |
| `/api/subscription` | User Pro tier management | **Functional** | `subscriptions`, `subscription_history` |
| `/api/ai/explain` | Transaction explanation via AI | **Functional** | Sui RPC, `ai-explain-utils`, `airpoints` (internal call) |
| `/api/airpoints` | Balance tracking and earning | **Functional** | `airpoints_balance`, `airpoints_history` |
| `/api/cookies/*` | Consent persistence | **Functional** | `cookie_consents` |
| `/api/disclaimers/*` | Risk agreement persistence | **Functional** | `risk_disclaimers` |
| `/api/advertising/*` | Sponsored partner slots | **Functional** | `advertising_partners` |
| `/api/ads/*` | Footer Ad slots (Featured Partners) | **Functional** | `ads_slots` |
| `/api/entitlements/*` | Provider tier & usage gating | **Functional** | `entitlements`, `provider_usage` |
| `/api/bridge/*` | Aggregator for cross-chain routes | **Hybrid** | Squid API, Wormhole/Across fallbacks (Partial Mock) |
| `/api/swap/*` | DEX aggregator quotes/execution | **Hybrid** | Cetus SDK, Aftermath/Hop (Partial Mock) |
| `/api/stake/*` | Validator info and delegation | **Hybrid** | Sui Client, `sui-staking` utils |
| `/api/explorer/*` | Simple Sui explorer wrappers | **Functional** | Sui JSON-RPC |

---

## 2. Data Model (Supabase)

### Core User Entities
- **`user_profiles`**: Central user record. Links Supabase `auth.users` to app logic.
    - Fields: `id`, `wallet_address`, `role` (user/provider/admin), `is_pro`, `full_name`, `avatar_url`.
- **`wallet_users`**: Mapping for Sui addresses.
    - Fields: `wallet_address`, `last_connected_at`.
- **`wallet_sessions`**: Temporary records for signature verification.
    - Fields: `wallet_address`, `session_token`, `message_to_sign`, `verified_at`, `expires_at`.

### Monetization & Gating
- **`subscriptions`**: Records for "Pro" users.
    - Fields: `user_id`, `tier` (free/pro/pro+), `status`, `expiry`.
- **`subscription_history`**: Audit log of tier changes.
- **`entitlements`**: Records for Infrastructure Providers.
    - Fields: `provider_id`, `tier`, `quota_limit`, `status`.
- **`provider_usage`**: Tracking metrics for paywalled providers.

### Marketing & Directory
- **`provider_listings`**: The public directory entries.
    - Fields: `id`, `name`, `tagline`, `category`, `status` (pending/approved).
- **`advertising_partners`**: Premium carousel data.
- **`ads_slots`**: Footer "Featured Partners" data.

### Loyalty
- **`airpoints_balance`**: Points ledger per user.
- **`airpoints_history`**: Transaction log for points (earning/redemption).

---

## 3. Auth & Session Strategy

### Current Workflow
1.  **Handshake**: Client requests a session via `/api/auth/wallet` (action: `create_session`).
2.  **Challenge**: Server generates a `message_to_sign` and a `session_token`.
3.  **Verify**: Client signs message with Sui Wallet; Server verifies via `@mysten/sui/verify` (action: `verify_signature`).
4.  **Token**: Server returns a base64 `authToken`.

### Optimization Needs
- **JWT Implementation**: Convert the simple base64 token to a proper JWT signed by `SUPABASE_JWT_SECRET` to allow seamless integration with Supabase RLS.
- **Middleware Protection**: Implement a global middleware to check `x-wallet-session` headers for protected `/api/admin` and `/api/user` routes.

---

## 4. Paywall & Gating Logic

### Tiers
- **Tier 0 (Free)**: Public directory access, basic swap/bridge tools.
- **Tier 1 (Pro)**: Unlimited AI explanations, priority support, ad-free experience, historical analytics.
- **Tier 2 (Provider Verified)**: Verified badge in directory, custom branding, lead generation data.

### Implementation Pattern
- **Request Decorators**: Use a `withProGate` higher-order function for API routes.
```typescript
// Example Logic
const { isPro } = await getUserSubscription(userId);
if (!isPro && requestedFeature === 'pro_only') return forbiddenResponse();
```

---

## 5. Execution Roadmap (Phase 2)

### Phase 2.1: Infrastructure & Auth Hardening
1.  **JWT Transition**: Update `api/auth/wallet` to issue a signed JWT.
2.  **Global Middleware**: Create `middleware.ts` to validate JWTs and populate `x-user-id` headers.
3.  **Supabase RLS Audit**: Enable RLS on all tables, granting `SELECT` to `authenticated` users where applicable.

### Phase 2.2: Persistence & Sync (**Completed**)
1.  **Persistence Fix**: Implemented `lib/consent-utils.ts` and updated `CookieBanner` / `RiskDisclaimerModal` to use a multi-layer check (LocalStorage -> HTTP Cookie -> Supabase DB).
2.  **Internal Sync API**: Created `/api/internal/user-status` to allow the App repository to securely verify user Pro status and Airpoints balances using a shared secret.

### Phase 2.3: Directory & Paywall Completion (**Completed**)
1.  **Provider Onboarding**: Updated `/api/providers` to use JWT-based `withAuth`. New submissions are tagged as `pending` for admin review.
2.  **Dual Payment Hooks**: Implemented both `stripe-webhook` and refined `lemon-webhook` for cross-platform flexibility. Both sync to the same `subscriptions` table.
3.  **Pro Gating**: Integrated tier-checks in `/api/ai/explain`. Pro users now get deeper analysis while Free users get standard summaries.

### Phase 2.4: Loyalty (Airpoints) Integration (**Completed**)
1.  **Earning Engine**: Created `lib/airpoints-engine.ts` to centralize all point-awarding logic with built-in action rate-limiting.
2.  **Master Sync**: Integrated the "Master Sync" fallback pattern. The engine is ready to sync with `airpoints.space` once `NEXT_PUBLIC_AIRPOINTS_EDGE_FUNCTION_URL` is configured.
