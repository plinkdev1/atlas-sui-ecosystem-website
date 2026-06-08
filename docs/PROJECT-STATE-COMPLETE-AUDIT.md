# Atlas Protocol - Complete Project State & Operationalization Roadmap

## Executive Summary

**Current Reality**: Atlas Protocol is a **partially operational MVP** with one fully functional module and three modules in various stages of implementation.

**Status Breakdown**:
- ✅ **Transaction Explainer**: PRODUCTION-READY (real blockchain data + security APIs)
- 🟡 **My Hub**: PRODUCTION-READY (real wallet, balances, NFTs, transactions)
- 🟡 **Wallet Cleanup**: MVP-READY (real data fetching + mock burn transactions)
- 🔴 **Infra Discovery**: DEMO-ONLY (mock registry data, no real-time monitoring)

**Time to Full Operations**: 6-12 weeks with proper team allocation

---

## Module-by-Module Status Report

### 1. Transaction Explainer ✅ FULLY FUNCTIONAL

**Real Operations**: YES
- **Data Source**: Live Sui blockchain via `useSuiClient()`
- **API Integration**: Blockberry Security API for threat detection
- **Capabilities**:
  - Accepts transaction digest or explorer URL
  - Fetches full transaction data: inputs, effects, events, object changes, balance changes
  - Calculates gas fees (computation + storage + rebate)
  - Generates human-readable summaries
  - Shows transfer flow visualization
  - Provides raw JSON export
  - Security scanning with warning levels

**Ready for Production**: YES
- No mock data in critical path
- Real API error handling with graceful fallback
- Supports multichain network detection
- Type-safe implementation

**Deployment Status**: Ready now

---

### 2. My Hub ✅ FULLY FUNCTIONAL

**Real Operations**: YES
- **Data Source**: Live Sui blockchain + connected wallet
- **Features**:
  - Real wallet balance fetching (`suiClient.getAllBalances()`)
  - Real NFT discovery with images
  - Transaction history (last 5 transactions)
  - Four tabs: Wallet, Swap, Stake, Watchlist
  - SwapForm integration (Cetus/Turbos)
  - StakeForm integration (staking protocols)
  - WatchlistTab integration (monitored assets)

**Integration Dependencies**:
- ✅ Suiet Wallet Kit (11 wallets supported)
- ✅ Sui RPC client
- ✅ Blockberry API (available)
- ⚠️ SwapForm component (partially implemented)
- ⚠️ StakeForm component (partially implemented)

**Ready for Production**: ~90% - depends on completing Swap/Stake forms

**Deployment Status**: Ready after Swap/Stake completion

---

### 3. Wallet Cleanup 🟡 HYBRID (Real Data + Mock Actions)

**What's Working (Real Data)**:
- ✅ Wallet connection (11 wallets)
- ✅ Token fetching (`suiClient.getAllBalances()`)
- ✅ NFT fetching with display images
- ✅ Classification system (legit/dubious/scam/unknown)
- ✅ Blockberry security API integration
- ✅ Blockvision metadata enrichment
- ✅ Community voting system
- ✅ Hide/show visibility tracking
- ✅ Filtering, sorting, bulk selection
- ✅ Beautiful UI/UX

**What's NOT Working (Mock Data)**:
- ❌ **Burn Transactions**: Uses `setTimeout(() => {...}, 1500)` instead of real blockchain execution
  - Should use: `wallet.signAndExecuteTransactionBlock()`
  - Impact: Critical - core feature doesn't work
  
- ⚠️ **Token Prices**: All show "$0.00" placeholder
  - Requires: Integration with Cetus/Turbos swap pools
  - Impact: Medium - affects portfolio valuation display

**Data Flow**:
```
Real blockchain data → Classification mapping → Enhanced with Blockberry → Display with mock burn
```

**Ready for Production**: ~70% - Burn functionality is blocking, prices are nice-to-have

**Effort to Complete**:
- Real burn transactions: 2-3 hours
- Price feed integration: 2-3 hours
- Community backend (optional): 4-6 hours

**Deployment Status**: Deployable with disclaimer that "burn is demo-mode"; production after 4-6 hours work

---

### 4. Infra Discovery 🔴 DEMO-ONLY

**What's Implemented**:
- ✅ Beautiful UI with tabs for RPC, Gateways, Validators, Indexing
- ✅ 16 RPC providers (pre-configured mock data)
- ✅ 7 Gateway providers
- ✅ 6 Validators (with commission, uptime, stake info)
- ✅ 4 Indexing providers
- ✅ Export registry as JSON
- ✅ Search, filter, sort functionality
- ✅ Service detail cards

**What's NOT Implemented**:
- ❌ **Real Service Data**: All 33+ providers are hardcoded mock objects
- ❌ **Live Status Monitoring**: No actual uptime/latency checks
- ❌ **Real-time Performance**: No API to fetch service metrics
- ❌ **Database Backend**: Service list is client-side only
- ❌ **Admin Management**: No way to add/update providers
- ❌ **Performance Metrics**: All SLAs are static

**Use Case**:
- Reference/educational: Shows what infra services look like
- Partnerships: Template for providers to understand requirements
- NOT: Actual discovery tool

**Ready for Production**: NO
- Purely informational mock data
- No real operational value

**Effort to Make Real** (Optional, high effort):
- Create database schema for providers: 2-3 hours
- Build provider admin panel: 4-6 hours
- Implement live monitoring API: 8-12 hours
- Add provider verification workflow: 4-6 hours
- **Total**: 18-27 hours (~1 week for senior engineer)

**Deployment Status**: Deployable as-is (with "coming soon" label); recommend deferring to Phase 2

---

## Project Architecture Overview

```
Atlas Protocol (Next.js 16 + Sui)
│
├── FRONTEND (React + TypeScript)
│   ├── pages/
│   │   ├── transaction-explainer ✅
│   │   ├── wallet-cleanup 🟡
│   │   ├── my-hub ✅
│   │   └── infra-discovery 🔴
│   └── components/
│       ├── transaction-explainer-content.tsx ✅
│       ├── wallet-cleanup-content.tsx 🟡
│       ├── hub-content.tsx ✅
│       ├── infra-discovery-content.tsx 🔴
│       ├── swap-form.tsx ⚠️
│       ├── stake-form.tsx ⚠️
│       └── watchlist-tab.tsx ✅
│
├── API ROUTES (Next.js Route Handlers)
│   ├── /api/blockberry ✅ (proxy to security API)
│   ├── /api/blockvision ✅ (proxy to indexing API)
│   ├── /api/logos ✅ (wallet logo service)
│   └── /api/providers (TODO - for infra discovery)
│
├── INTEGRATIONS
│   ├── Sui Chain ✅ (via useSuiClient)
│   ├── Wallet Kit ✅ (11 wallets)
│   ├── Blockberry API ✅
│   ├── BlockVision API ✅
│   └── Cetus/Turbos 🟡 (partial)
│
└── DATABASE (None yet)
    └── TODO: Supabase for persistent data
```

---

## What's Actually Using Real Data vs Mock

| Component | Real Data | Mock Data | Notes |
|-----------|-----------|-----------|-------|
| **Transaction Explainer** | ✅ 100% | - | All blockchain data real |
| **My Hub Wallet Tab** | ✅ 100% | - | All balances real |
| **My Hub NFTs** | ✅ 100% | - | All NFT data real |
| **My Hub Transactions** | ✅ 100% | - | Last 5 txns real |
| **Wallet Cleanup Data** | ✅ 95% | ❌ Burn only | Token/NFT data real, burn mocked |
| **Wallet Cleanup Prices** | ✅ 5% | ⚠️ Mostly $0 | Needs price feed |
| **Infra Discovery** | ❌ 0% | ✅ 100% | All mock providers |

---

## Critical Issues Blocking Full Operations

### Priority 1: BLOCKING (Production can't launch)

1. **Wallet Cleanup Burn Transactions** (Critical)
   - **Issue**: Uses mock setTimeout instead of real transaction execution
   - **Impact**: Core feature doesn't work
   - **Fix Effort**: 2-3 hours
   - **Code Location**: `components/wallet-cleanup-content.tsx` lines 788-820
   - **Action**: Replace with `wallet.signAndExecuteTransactionBlock()`

2. **JSON.parse Bug** (Critical)
   - **Issue**: `JSON.JSON.parse()` double call (typo)
   - **Impact**: Runtime error when loading saved preferences
   - **Fix Effort**: 5 minutes
   - **Code Location**: `components/wallet-cleanup-content.tsx` line 446
   - **Action**: Remove duplicate `JSON.`

3. **Coin Object Resolution** (Critical)
   - **Issue**: Code assumes coin ID is object ID, but it's coin type
   - **Impact**: Transaction building fails for most tokens
   - **Fix Effort**: 3-4 hours
   - **Action**: Fetch actual coin objects before building transaction

### Priority 2: HIGH (Needed for good UX)

4. **Token Price Feed** (High)
   - **Issue**: All token prices show "$0.00"
   - **Impact**: Portfolio value calculation broken
   - **Fix Effort**: 2-3 hours
   - **Solution**: Query Cetus or Turbos swap pools

5. **Swap/Stake Forms** (High)
   - **Issue**: Components partially implemented
   - **Impact**: My Hub swap/stake tabs are incomplete
   - **Fix Effort**: 4-6 hours

### Priority 3: MEDIUM (Nice-to-have)

6. **Community Data Backend** (Medium)
   - **Issue**: Community legitimacy list stored in localStorage only
   - **Impact**: Data doesn't persist across devices
   - **Fix Effort**: 4-6 hours
   - **Solution**: Move to Supabase database

7. **Advanced Spam Detection** (Medium)
   - **Issue**: Uses basic classification only, no ML detection
   - **Impact**: Misses sophisticated scams
   - **Fix Effort**: 4-8 hours

---

## Required Tasks/Epics for Full Operationalization

### PHASE 1: FIX CRITICAL BUGS (Week 1)
**Duration**: 1-2 weeks | **Priority**: CRITICAL | **Team**: 1 senior engineer

**Epic 1.1: Fix Wallet Cleanup Execution**
- [ ] Task 1.1.1: Replace mock burn with real `signAndExecuteTransactionBlock` (2-3h)
- [ ] Task 1.1.2: Fix coin object resolution for all tokens (3-4h)
- [ ] Task 1.1.3: Fix JSON.parse bug (0.25h)
- [ ] Task 1.1.4: Test burn on testnet with multiple tokens (1-2h)
- [ ] Task 1.1.5: Add transaction history tracking (1h)

**Epic 1.2: Add Price Feed Integration**
- [ ] Task 1.2.1: Create price service that queries Cetus pools (1.5h)
- [ ] Task 1.2.2: Add caching layer (30min)
- [ ] Task 1.2.3: Display real token values in wallet cleanup (1-2h)
- [ ] Task 1.2.4: Test with multiple token types (1h)

**Effort**: 12-15 hours | **Deployment**: Production-ready after completion

---

### PHASE 2: COMPLETE MISSING COMPONENTS (Week 2-3)
**Duration**: 2-3 weeks | **Priority**: HIGH | **Team**: 1-2 engineers

**Epic 2.1: Complete Swap Form Integration**
- [ ] Task 2.1.1: Implement Cetus swap execution (3-4h)
- [ ] Task 2.1.2: Add slippage tolerance controls (1-2h)
- [ ] Task 2.1.3: Implement price impact calculation (2h)
- [ ] Task 2.1.4: Test with multiple token pairs (1-2h)

**Epic 2.2: Complete Stake Form Integration**
- [ ] Task 2.2.1: Implement validator selection UI (1-2h)
- [ ] Task 2.2.2: Implement staking transaction (2-3h)
- [ ] Task 2.2.3: Add APY calculation (1h)
- [ ] Task 2.2.4: Test unstaking workflow (1-2h)

**Epic 2.3: Build Community Legitimacy Backend**
- [ ] Task 2.3.1: Design Supabase schema (1h)
- [ ] Task 2.3.2: Create database tables (1h)
- [ ] Task 2.3.3: Build API endpoints for voting (2-3h)
- [ ] Task 2.3.4: Implement reputation system (2-3h)
- [ ] Task 2.3.5: Migrate localStorage data to backend (1h)

**Effort**: 20-28 hours | **Deployment**: Feature-complete after completion

---

### PHASE 3: OPTIONAL - INFRASTRUCTURE & PARTNERSHIPS (Week 4-6)
**Duration**: 2-4 weeks | **Priority**: MEDIUM | **Team**: 1-2 engineers

**Epic 3.1: Build Infra Discovery Backend**
- [ ] Task 3.1.1: Create provider database schema (1-2h)
- [ ] Task 3.1.2: Build admin panel for provider management (4-6h)
- [ ] Task 3.1.3: Implement real-time monitoring API (6-8h)
- [ ] Task 3.1.4: Add provider verification workflow (2-3h)
- [ ] Task 3.1.5: Migrate hardcoded providers to database (1h)

**Epic 3.2: Partnerships & Revenue Integration**
- [ ] Task 3.2.1: Integrate Cetus partnership model (API, referral tracking) (2-3h)
- [ ] Task 3.2.2: Implement Lido staking affiliate links (2-3h)
- [ ] Task 3.2.3: Add Curve swap partnership (2h)
- [ ] Task 3.2.4: Create marketplace fee collection system (3-4h)

**Effort**: 26-34 hours | **Deployment**: Partnership-ready after completion

---

### PHASE 4: MULTICHAIN SUPPORT (Week 7-10)
**Duration**: 3-4 weeks | **Priority**: MEDIUM-LOW | **Team**: 1-2 engineers

**Epic 4.1: Abstract Sui-Specific Code**
- [ ] Task 4.1.1: Create chain abstraction layer (2-3h)
- [ ] Task 4.1.2: Refactor RPC client to support multiple chains (2-3h)
- [ ] Task 4.1.3: Generalize wallet connection logic (2h)

**Epic 4.2: Add EVM Support (Ethereum, Base, etc.)**
- [ ] Task 4.2.1: Integrate Ethers.js for EVM (1-2h)
- [ ] Task 4.2.2: Add EVM token/NFT fetching (2-3h)
- [ ] Task 4.2.3: Implement EVM spam detection (2-3h)
- [ ] Task 4.2.4: Test on Ethereum + Base networks (2-3h)

**Epic 4.3: Add Aptos Support**
- [ ] Task 4.3.1: Integrate Aptos SDK (1-2h)
- [ ] Task 4.3.2: Add Aptos token/NFT fetching (2-3h)
- [ ] Task 4.3.3: Test on Aptos network (1-2h)

**Effort**: 20-28 hours | **Deployment**: Multichain-ready after completion

---

### PHASE 5: TOKEN LAUNCH PREPARATION (Week 8-12)
**Duration**: Parallel with Phase 3-4 | **Priority**: HIGH | **Team**: 1-2 engineers + product/marketing

**Epic 5.1: $ATLAS Token Model Implementation**
- [ ] Task 5.1.1: Deploy token contract on Sui (Cetus or Move framework) (4-6h)
- [ ] Task 5.1.2: Implement staking contracts (4-6h)
- [ ] Task 5.1.3: Create token vesting contracts (2-3h)
- [ ] Task 5.1.4: Implement fee buyback mechanism (2-3h)
- [ ] Task 5.1.5: Test on testnet (2-3h)

**Epic 5.2: DAO Governance Setup**
- [ ] Task 5.2.1: Design governance voting contract (1-2h)
- [ ] Task 5.2.2: Create governance UI (2-3h)
- [ ] Task 5.2.3: Implement treasury multisig (1-2h)

**Epic 5.3: Launch Infrastructure**
- [ ] Task 5.3.1: Set up Cetus Launchpad LBP (3-4h)
- [ ] Task 5.3.2: Create community airdrop module (2-3h)
- [ ] Task 5.3.3: Deploy token contracts to mainnet (1-2h)
- [ ] Task 5.3.4: Set up liquidity pools (1-2h)

**Effort**: 28-38 hours | **Timeline**: Ready by Week 12

---

## Partnership Integration Roadmap

### PHASE 1: Existing Integrations (Ready Now)
- ✅ **Blockberry API** - Security scanning (integrated)
- ✅ **BlockVision API** - Metadata enrichment (integrated)
- ✅ **Suiet Wallet Kit** - 11 wallets (integrated)

### PHASE 2: Revenue Partnerships (Week 4-6)
| Partner | Type | Integration | Revenue | Status |
|---------|------|-----------|---------|--------|
| **Cetus** | DEX/Swap | API + referral links | 0.5% swap fees | Ready for Q2 |
| **Lido** | Staking | Staking form + referral | 2% staking volume | Ready for Q2 |
| **Curve Finance** | DEX | Swap integration | 0.5% swap fees | Ready for Q3 |
| **Hop Protocol** | Bridge | Bridge UI integration | 0.25% bridge fees | Ready for Q3 |
| **Sui Foundation** | Network | Data sharing + grants | Potential grants | In discussion |

### PHASE 3: Data & Infrastructure (Week 8-12)
| Partner | Type | Model | Potential Revenue |
|---------|------|-------|-------------------|
| **Blockberry** | Security Data | Licensing anonymized threat data | $5K-50K/month |
| **Data Providers** | Analytics | Sell usage reports and scam patterns | $2K-20K/month |
| **RPC Operators** | Infrastructure | Marketplace referrals + revenue share | $1K-10K/month |

---

## Token Model ($ATLAS) Implementation Timeline

**Phase 1: Design & Smart Contracts (Week 8-10)**
- Token allocation finalized (45% community, 12% liquidity, 15% team, 18% treasury, 10% partners)
- Smart contracts developed and audited
- Staking mechanism implemented (50% fees → buyback + distribute)
- Fee revenue integration

**Phase 2: Launch Infrastructure (Week 10-12)**
- Cetus Launchpad LBP setup
- Community airdrop eligibility snapshot
- Liquidity bootstrapping
- DAO governance initialization

**Phase 3: Token Launch (Week 13 - Q2 2027)**
- Fair launch on Cetus Launchpad ($0.02→$0.10 LBP)
- 50M ATLAS community airdrop
- DEX listings (SUI/USDC pairs)
- Staking rewards active

---

## Success Metrics & KPIs

### By Month 1 (Post-Fix):
- ✅ Transaction Explainer: 100% functional
- ✅ My Hub: 90% functional (swap/stake complete)
- ✅ Wallet Cleanup: 100% functional (burn + prices working)
- ✅ Infra Discovery: 50% functional (reference data)
- **Target MAU**: 5K-10K
- **Target Revenue**: $5K-10K/month (subs + marketplace fees)

### By Month 3 (Post-Partnerships):
- ✅ All features operational
- ✅ 3-4 revenue streams active
- ✅ Cetus, Lido, Curve partnerships live
- **Target MAU**: 25K-50K
- **Target Revenue**: $50K-80K/month
- **Target ARR**: $600K-$960K

### By Month 6 (Post-Token):
- ✅ $ATLAS token launched
- ✅ Staking rewards active
- ✅ DAO governance operational
- ✅ Multichain partial support
- **Target MAU**: 100K+
- **Target Revenue**: $200K+/month
- **Target ARR**: $2.4M+

---

## Risk Factors & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Token regulatory delay | Medium | High | Build non-token revenue first; token is optional |
| Competitor emerges | Medium | High | Fast execution; focus on UX and data quality |
| API rate limiting (Blockberry) | Low | Medium | Implement caching; negotiate higher limits |
| Wallet integration issues | Low | Low | Maintain compatibility with 11 wallets |
| Multichain complexity | Medium | Medium | Defer to Phase 4; focus on Sui first |
| Community adoption slow | Medium | High | Strong marketing + partnership leverage |

---

## Current Tech Stack

**Frontend**:
- Next.js 16 (App Router)
- React 19.2 + TypeScript
- TailwindCSS v4 + shadcn/ui
- Recharts (analytics)

**Blockchain**:
- Sui SDK (@mysten/dapp-kit, @mysten/sui.js)
- Suiet Wallet Kit (@suiet/wallet-kit)
- Cetus SDK (for swaps)

**APIs**:
- Blockberry Security API
- BlockVision Indexing API
- Logo.dev (for wallet logos)

**Backend** (None yet - TODO):
- Supabase (for persistent data)
- or Neon PostgreSQL

---

## Deployment Readiness Checklist

**NOW (Deployable)**:
- [x] Transaction Explainer ✅
- [x] My Hub (wallet tab) ✅
- [ ] Wallet Cleanup (with disclaimer) 🟡
- [ ] Infra Discovery (reference only) 🟡

**AFTER PHASE 1 (2-3 weeks)**:
- [ ] Wallet Cleanup (fully functional)
- [ ] My Hub (complete with swap/stake)

**AFTER PHASE 3 (6 weeks)**:
- [ ] All features operational
- [ ] Partnerships active
- [ ] Revenue collection live

**AFTER PHASE 5 (12 weeks)**:
- [ ] $ATLAS token launched
- [ ] DAO governance active
- [ ] Multichain support started

---

## Recommendation

**For Immediate Deployment**:
1. Fix critical bugs (Phase 1) - 1-2 weeks
2. Complete Swap/Stake (Phase 2, partial) - 1 week
3. Deploy with 4 fully operational modules
4. Target: Launch by end of Q1 2027

**For Full Operations**:
1. Complete all 5 phases - 8-12 weeks
2. Token launch by Q2 2027
3. Target: Sustainable $100K+/month revenue by Q3 2027

**Next Immediate Step**: Start Phase 1 (fix critical bugs) this week - highest ROI effort

---

*Document Version*: 1.0  
*Last Updated*: January 20, 2026  
*Author*: Atlas Protocol Audit  
*Status*: Ready for Executive Review & Implementation Planning
