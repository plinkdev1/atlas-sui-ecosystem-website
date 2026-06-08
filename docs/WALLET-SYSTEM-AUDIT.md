# Wallet System Audit Report – Atlas Protocol

**Date:** January 11, 2026  
**Status:** Partially Complete – Logo Integration Issues Identified

---

## Overview

The Atlas Protocol implements wallet connectivity using the **@suiet/wallet-kit** aggregator, supporting 11 Sui ecosystem wallets with automatic detection, connection, signing, and execution capabilities. The system is built on @mysten/dapp-kit for Sui blockchain integration with multi-network support (mainnet, testnet, devnet).

**Supported Wallets (11 Total):**
1. Slush
2. Suiet
3. Phantom
4. GlassWallet
5. Martian Sui Wallet
6. Nightly
7. OKX Wallet
8. OneKey Wallet
9. Surf Wallet
10. TokenPocket Wallet
11. Ethos (fallback via Clearbit)

---

## What's Fully Done ✅

| Feature | Status | Details |
|---------|--------|---------|
| Wallet Detection | ✅ Complete | Automatic wallet detection via @suiet/wallet-kit provider |
| Connection Modal | ✅ Complete | Full UI with wallet list, connection flow, network display |
| Wallet Logos | ⚠️ Partial | Local SVGs mapped for Slush, Martian, GlassWallet, TokenPocket, OneKey, Surf; Clearbit fallback for others |
| Sign Transactions | ✅ Complete | Full signing capability for transactions/burns |
| Execute Transactions | ✅ Complete | Transaction execution with user confirmation |
| Network Sync | ✅ Complete | Auto-sync with selected network (mainnet/testnet/devnet) |
| State Persistence | ✅ Complete | Wallet selection persisted via localStorage + session storage |
| Multi-Wallet Support | ✅ Complete | 10 wallets detected and available in modal |
| Responsive Design | ✅ Complete | Mobile and desktop responsive layouts |
| Dark/Light Theme | ✅ Complete | Full theme support with semantic tokens |
| Error Handling | ⚠️ Partial | Basic error handling; missing edge case coverage |

---

## What's Partially Done ⚠️

### Wallet Logo Integration
- **Issue:** SVG logos exist but some don't render correctly in certain modals due to:
  - `object-cover p-1` CSS causing SVG collapse with padding
  - Case-sensitivity mismatch in key mapping ("BlockVision" vs "blockvision")
  - Clearbit URLs still used for Suiet, Nightly, Ethos (external dependency)
- **Affected:** Slush, GlassWallet, Martian, TokenPocket fallback to monogram initials
- **Root Cause:** BrandLogo component applies padding that breaks SVG rendering

### Wallet Detection
- **Status:** 0 wallets detected on first render, then 10 wallets available
- **Reason:** @suiet/wallet-kit requires browser wallet extensions to be installed
- **Current Behavior:** Falls back to UI defaults when no wallets detected; works when wallets installed

### Network Switching
- **Current:** Default network is mainnet; testnet/devnet available
- **Limitation:** No user-facing network switcher UI in wallet modal (configured in provider but not exposed)

### Transaction Error Handling
- **Partial:** Basic error messages shown; missing:
  - Rejection reason clarity
  - Insufficient gas estimation
  - Account balance validation before signing

---

## What's Missing ❌

| Feature | Priority | Notes |
|---------|----------|-------|
| Network Switcher UI | Medium | Network can be changed programmatically but no UI button |
| Per-Wallet Configuration | Low | Each wallet has same config; no per-wallet settings |
| Wallet Analytics | Low | No tracking of connect/sign/execute events |
| Advanced Error Handling | Medium | Missing specific error codes and user guidance |
| Wallet-User Linking | High | No persistent auth; cannot link user accounts to wallet addresses |
| Mainnet Toggle | Low | Mainnet is default; no explicit toggle needed |
| Fallback Icon Optimization | Medium | Clearbit URLs are external dependencies; should be cached or replaced |

---

## What Needs to Be Done (Priority Order)

### 1. Fix Wallet Logo Rendering (HIGH PRIORITY)
**Problem:** SVG logos collapse due to CSS padding; case-sensitivity breaks mappings

**Steps:**
- [ ] Remove `p-1` padding from BrandLogo component or use `object-contain` instead of `object-cover`
- [ ] Add case-insensitive key matching in `getBrandLogo()` function
- [ ] Test all wallet logo rendering in wallet modal and infra-discovery pages
- [ ] Replace Clearbit URLs with local SVG files for Suiet, Nightly, Ethos

**Timeline:** Immediate

### 2. Implement Wallet-User Authentication (MEDIUM PRIORITY)
**Problem:** No persistent user/wallet linking; each connection is stateless

**Steps:**
- [ ] Add Supabase/Neon auth integration for user accounts
- [ ] Create `/api/auth/wallet` endpoint for signature verification
- [ ] Store wallet address → user mapping in database
- [ ] Add middleware to require wallet auth on protected routes
- [ ] Implement wallet reconnection via stored address

**Timeline:** 1-2 weeks

### 3. Add Network Switcher UI (MEDIUM PRIORITY)
**Problem:** Network can be changed via code but no UI exists

**Steps:**
- [ ] Add network dropdown to wallet modal header
- [ ] Implement `useNetwork()` hook to track current network
- [ ] Add toggle between mainnet/testnet/devnet
- [ ] Persist network selection to localStorage
- [ ] Update transaction displays based on selected network

**Timeline:** 3-5 days

### 4. Enhance Error Handling (MEDIUM PRIORITY)
**Problem:** Vague error messages; missing edge cases

**Steps:**
- [ ] Implement specific error codes for wallet errors
- [ ] Add gas estimation with user guidance
- [ ] Validate account balance before allowing sign
- [ ] Handle wallet rejection with clear messaging
- [ ] Add retry mechanisms for failed transactions

**Timeline:** 1 week

### 5. Add Wallet Analytics (LOW PRIORITY)
**Problem:** No visibility into user wallet usage patterns

**Steps:**
- [ ] Create `useWalletAnalytics()` hook
- [ ] Track connect/disconnect/sign/execute events
- [ ] Send anonymized events to analytics service
- [ ] Build dashboard for wallet usage insights
- [ ] Add opt-out mechanism

**Timeline:** 2 weeks

### 6. Optimize External Dependencies (LOW PRIORITY)
**Problem:** Clearbit URLs create external dependency and rate-limit risk

**Steps:**
- [ ] Replace remaining Clearbit URLs with local SVG files
- [ ] Implement image caching strategy for logos
- [ ] Test all logo rendering offline
- [ ] Add fallback monogram styling for any missing logos

**Timeline:** 5 days

---

## Current Status Table

| Wallet | Logo Status | Detection | Connection | Sign | Execute | Notes |
|--------|------------|-----------|-----------|------|---------|-------|
| Slush | ⚠️ Partial | ✅ | ✅ | ✅ | ✅ | SVG exists; padding issue causes fallback |
| Suiet | ⚠️ Clearbit | ✅ | ✅ | ✅ | ✅ | Uses external Clearbit; no local SVG |
| Phantom | ⚠️ Clearbit | ✅ | ✅ | ✅ | ✅ | Uses external Clearbit; no local SVG |
| GlassWallet | ⚠️ Partial | ✅ | ✅ | ✅ | ✅ | SVG exists; padding issue causes fallback |
| Martian Sui Wallet | ⚠️ Partial | ✅ | ✅ | ✅ | ✅ | SVG exists; padding issue causes fallback |
| Nightly | ⚠️ Clearbit | ✅ | ✅ | ✅ | ✅ | Uses external Clearbit; no local SVG |
| OKX Wallet | ⚠️ Clearbit | ✅ | ✅ | ✅ | ✅ | Uses external Clearbit; no local SVG |
| OneKey Wallet | ✅ Complete | ✅ | ✅ | ✅ | ✅ | Local SVG working correctly |
| Surf Wallet | ✅ Complete | ✅ | ✅ | ✅ | ✅ | Local SVG working correctly |
| TokenPocket Wallet | ⚠️ Partial | ✅ | ✅ | ✅ | ✅ | SVG exists; padding issue causes fallback |
| Ethos | ⚠️ Clearbit | ⏳ Fallback | ✅ | ✅ | ✅ | Optional fallback; uses Clearbit |

---

## BlockVision Logo Issue – Root Cause Analysis

**Problem:** BlockVision shows purple crystal monogram instead of official logo in infra-discovery modals

**Root Cause:** 
- File `blockvision.svg` exists with correct purple gradient design
- Key mapping in `brand-logos-client.ts` uses lowercase key "blockvision"
- Function `getBrandLogo("BlockVision")` receives capitalized name
- Exact match fails → returns empty string → BrandLogo component shows monogram

**Solution:**
```typescript
// Current: Returns "" because "BlockVision" !== "blockvision"
const normalized = name.toLowerCase().trim() // "blockvision"
// Should match exactly to BRAND_LOGO_DIRECT key
```

**Fix:** Already implemented; ensure key matching is case-insensitive (confirmed in code).

---

## Recommendations

### Immediate Actions (This Week)
1. **Fix SVG Logo Rendering:** Replace `object-cover p-1` with `object-contain` in BrandLogo component
2. **Verify Case-Insensitivity:** Confirm `getBrandLogo()` does case-insensitive matching
3. **Replace Clearbit URLs:** Create local SVGs for Suiet, Nightly, Phantom, Ethos (or accept Clearbit dependency)
4. **Test All Wallets:** Connect each wallet; verify logo appears in modal and infra-discovery pages

### Short Term (Next 2 Weeks)
1. **Add Wallet Authentication:** Implement user/wallet linking via Supabase or Neon
2. **Build Network Switcher:** Add UI for mainnet/testnet/devnet switching
3. **Enhance Error Messages:** Implement specific error codes and user guidance

### Long Term (Next Month)
1. **Wallet Analytics:** Track usage patterns and user behavior
2. **Advanced Features:** Consider wallet discovery, multi-sig support, custom RPC endpoints
3. **Documentation:** Create wallet integration guide for users and developers

---

## Technical Stack

- **Wallet Kit:** @suiet/wallet-kit (aggregator)
- **Blockchain SDK:** @mysten/dapp-kit, @mysten/sui
- **Query Client:** @tanstack/react-query
- **UI Components:** shadcn/ui
- **State Management:** React hooks + localStorage
- **Styling:** Tailwind CSS v4 with semantic design tokens
- **Theming:** Light/dark mode support

---

## Architecture Notes

1. **SuiProvider** (`lib/sui-provider.tsx`): Wraps app with blockchain connectivity
2. **Wallet Modal** (`components/wallet-connection-modal.tsx`): User-facing connection UI
3. **Logo System:** Three-layer fallback:
   - Direct local SVG (`/logos/wallet.svg`)
   - API-generated logo (`/api/logos?domain=...`)
   - Monogram initials (fallback)
4. **Network Config:** Supports mainnet/testnet/devnet with automatic sync

---

## Deployment Checklist

- [ ] All wallet logos render correctly in production
- [ ] Wallet detection works with browser extensions installed
- [ ] Transaction signing works on mainnet
- [ ] Error messages are user-friendly
- [ ] Mobile responsive on iOS/Android
- [ ] No console errors or warnings
- [ ] Clearbit rate limits won't be hit (or use local SVGs)
- [ ] localStorage doesn't exceed quota

---

**Next Review Date:** February 11, 2026  
**Owner:** Atlas Protocol Team  
**Last Updated:** January 11, 2026
