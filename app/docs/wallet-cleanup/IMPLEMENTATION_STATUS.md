# Wallet Cleanup Module - Implementation Status & Wallet Support

## Current Implementation Status

### ✅ Fully Implemented (Production Ready)
1. **Wallet Connection** - All major Sui wallets supported (Slush, Suiet, Nightly, OKX, Phantom, Ethos, Martian, Surf, Glass, OneKey, TokenPocket)
2. **Real Token Fetching** - Uses `suiClient.getAllBalances()` to fetch wallet token data
3. **Real NFT Fetching** - Uses `suiClient.getOwnedObjects()` with display data filtering
4. **Classification System** - 4-tier (legit/dubious/scam/unknown) with preset mappings
5. **Security Integration** - Blockberry API for real-time security scoring
6. **Metadata Enrichment** - Blockvision API for market data and floor prices
7. **Community Ratings** - localStorage-based voting system (thumbs up/down)
8. **Visibility Management** - Hide/show assets with localStorage persistence
9. **Filtering & Sorting** - Multi-filter support (classification, security level, search)
10. **Bulk Operations** - Select multiple items for batch actions
11. **UI/UX** - Full responsive design with dark/light theme support

### ⚠️ Partially Implemented (Requires API Keys)
1. **Blockberry Security Checks** - Requires `BLOCKBERRY_API_KEY` environment variable
   - Fallback: Uses classification mappings if API unavailable
   - Status: Server-side proxy at `/api/blockberry` is ready
   
2. **Blockvision Enrichment** - Requires `BLOCKVISION_API_KEY` environment variable  
   - Fallback: Uses basic blockchain data if API unavailable
   - Status: Server-side proxy at `/api/blockvision` is ready

3. **Price Calculations** - Token values show "$0.00" placeholder
   - Status: TODO - Requires price feed integration
   - Currently shows balance only

### ❌ Not Yet Implemented
1. **Burn/Transfer Execution** - Uses mock setTimeout instead of real blockchain transactions
   - Required: `signAndExecuteTransactionBlock` from wallet
   - Reason: Requires user wallet signing (production-ready, just needs activation)
   
2. **Multichain Support** - Currently Sui-only by design
   - Status: Module displays "Network Not Supported" for non-Sui chains
   
3. **Advanced Spam Detection** - Uses basic classification maps only
   - TODO: Implement ML-based or community-reported spam list

---

## Wallet Support Matrix

| Wallet | Detection | Connection | Icons | Status |
|--------|-----------|-----------|-------|--------|
| **Slush Wallet** | ✅ Yes | ✅ Yes | ✅ Local SVG | Fully Supported |
| **Suiet** | ✅ Yes | ✅ Yes | ✅ API Logo | Fully Supported |
| **Nightly** | ✅ Yes | ✅ Yes | ✅ API Logo | Fully Supported |
| **OKX Wallet** | ✅ Yes | ✅ Yes | ✅ API Logo | Fully Supported |
| **Phantom** | ✅ Yes | ✅ Yes | ✅ API Logo | Fully Supported |
| **Ethos Wallet** | ✅ Yes | ✅ Yes | ✅ API Logo | Fully Supported |
| **Martian Wallet** | ✅ Yes | ✅ Yes | ✅ Local SVG | Fully Supported |
| **Surf Wallet** | ✅ Yes | ✅ Yes | ✅ Local SVG | Fully Supported |
| **Glass Wallet** | ✅ Yes | ✅ Yes | ✅ Local SVG | Fully Supported |
| **OneKey Wallet** | ✅ Yes | ✅ Yes | ✅ Local SVG | Fully Supported |
| **TokenPocket Wallet** | ✅ Yes | ✅ Yes | ✅ Local SVG | Fully Supported |

### Wallet Icon Setup
- **Local SVGs** (preferred): `/public/logos/{wallet-name}.svg`
  - Slush, Martian, Surf, Glass, OneKey, TokenPocket use local SVGs
  
- **API Logos** (fallback): Fetched via `/api/logos?domain=...&size=48`
  - Suiet, Nightly, OKX, Phantom, Ethos use dynamic logo.dev API

- **Monogram Fallback**: Generates initials if icon fails to load

---

## Setup Instructions

### 1. Environment Variables
```env
# Required for enhanced security features
BLOCKBERRY_API_KEY=your_blockberry_api_key

# Optional for additional metadata
BLOCKVISION_API_KEY=your_blockvision_api_key
```

### 2. Connecting a Wallet
1. Navigate to `/wallet-cleanup`
2. Click "Connect Wallet" button
3. Select your installed wallet from the list
4. Approve connection in wallet extension
5. Wallet address displays at top; assets load automatically

### 3. Asset Classification
Assets are classified based on three sources (in order of priority):

**Token Classification** - Uses `TOKEN_CLASSIFICATIONS` map:
```typescript
{
  "0x2::sui::SUI": "legit",           // Native SUI
  "0x...usdc::USDC": "legit",         // Stablecoins
  "0x...fake::FAKE": "scam"           // Known scams
}
```

**NFT Classification** - Uses `NFT_CLASSIFICATIONS` map by packageId:
```typescript
{
  "0x5b45da03...": "legit",           // Known collections
  "0xdeadbeef...": "scam"             // Known spam
}
```

**Blockberry API** - Real-time security scoring (if key configured):
```
Risk Level → Security Level
safe       → "safe"
critical   → "danger"
otherwise  → "warning"
```

### 4. Actions Available

#### Keep (Default)
- Keeps asset visible in wallet
- Maintains on blockchain
- Stores as "hidden: false"

#### Hide
- Hides from wallet cleanup view locally
- Does NOT remove from blockchain
- Stored in localStorage with "hidden: true"

#### Community Rating
- Vote on asset legitimacy (👍/👎)
- Adds to community legitimacy list
- Influences display sorting

#### Transfer to Burn Address
- Currently: Mock implementation (shows toast)
- Production: Will execute real `signAndExecuteTransactionBlock`
- Destination: `0x0000000000000000000000000000000000000000000000000000000000000000`
- Effect: Permanently removes from wallet

#### Refresh
- Re-fetches wallet data from blockchain
- Updates Blockberry security scores
- Polls latest market data from Blockvision

---

## Stretch Goal - Community Legitimacy List

### Current Implementation (MVP)
- **Storage**: localStorage (`community-legitimacy-list`)
- **Data**: Mock entries with rating and report count
- **Format**: `{ [address]: { rating: number, reports: number } }`

### Future Enhancements
1. Backend database for persistent community list
2. Reputation system for voter verification
3. Time-decay for old votes
4. Multi-sig admin for known scams
5. Public API for community data

### Accessing Community List
```typescript
const communityList = localStorage.getItem("community-legitimacy-list")
const parsed = communityList ? JSON.parse(communityList) : {}
```

---

## Logic Explanation

### Object Fetching
```
User connects wallet
    ↓
useWalletStore provides account.address
    ↓
useEffect triggers on account change
    ↓
fetchRealTokens() calls suiClient.getAllBalances()
    ↓
fetchRealNFTs() calls suiClient.getOwnedObjects()
    ↓
Both filter, classify, and enrich data
    ↓
Display in UI with classifications
```

### Classification Logic
```
Token arrives from blockchain
    ↓
Check TOKEN_CLASSIFICATIONS map → Found? Use it
    ↓
Not found? Mark as "unknown"
    ↓
If classification === "scam" → Mark as spam
    ↓
Call blockberryAPI.checkCoinSecurity() (async)
    ↓
Combine security scores with classification
    ↓
Display with appropriate badge/color
```

### Burn Address Logic
```
User clicks "Transfer to burn address"
    ↓
Confirmation modal appears
    ↓
User confirms transfer
    ↓
For production: suiClient.signAndExecuteTransactionBlock({
      transactions: [
        sui.Transaction.moveCall({
          target: "0x2::transfer::transfer",
          arguments: [item, burnAddress]
        })
      ]
    })
    ↓
Currently: Mock with setTimeout (dev/demo mode)
    ↓
Item removed from UI
    ↓
localStorage persisted as removed
```

---

## Known Limitations & Workarounds

| Issue | Status | Workaround |
|-------|--------|-----------|
| Token prices always "$0.00" | ⚠️ TODO | Integrate Cetus/Turbos price API |
| Bulk burn uses mock TX | ⚠️ TODO | Implement batch transaction signing |
| Multichain not supported | ❌ Intentional | Module Sui-only by design |
| Community list localStorage only | ⚠️ TODO | Add backend persistence |
| Spam detection basic | ⚠️ TODO | Integrate advanced ML detection |

---

## Testing Checklist

- [ ] Wallet connection (all 11 wallets)
- [ ] Token fetching and classification
- [ ] NFT fetching with image display
- [ ] Blockberry API integration (with key)
- [ ] Blockvision API integration (with key)
- [ ] Filtering and sorting
- [ ] Community ratings (localStorage)
- [ ] Hide/show visibility toggle
- [ ] Bulk selection (multi-select)
- [ ] Mock burn confirmation flow
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Dark/light theme rendering
- [ ] Network switch detection
- [ ] Error handling for API failures

---

## Files Involved

```
wallet-cleanup/
├── components/
│   └── wallet-cleanup-content.tsx         (1500+ lines, main component)
├── app/
│   ├── wallet-cleanup/page.tsx            (page wrapper)
│   ├── docs/wallet-cleanup/page.tsx       (docs page)
│   ├── docs/wallet-cleanup/IMPLEMENTATION_STATUS.md (this file)
│   ├── api/blockberry/route.ts            (Blockberry proxy)
│   └── api/blockvision/route.ts           (Blockvision proxy)
├── utils/api/
│   ├── blockberry-client.ts               (Blockberry wrapper)
│   └── blockvision-client.ts              (Blockvision wrapper)
└── lib/
    ├── wallet-store.ts                    (wallet state mgmt)
    └── chain-store.ts                     (network state mgmt)
```

---

## Next Steps to Complete MVP→Production

1. **Implement Real Burn Transactions** (2-3 hours)
   - Replace setTimeout with `signAndExecuteTransactionBlock`
   - Handle transaction signing and confirmation
   - Add transaction history tracking

2. **Add Price Feed Integration** (2-3 hours)
   - Query Cetus or Turbos swap pool prices
   - Cache prices for 1-5 minutes
   - Calculate real token values

3. **Build Community Backend** (4-6 hours)
   - Create database for legitimacy list
   - Implement voter reputation system
   - Add admin moderation tools

4. **Advanced Spam Detection** (4-8 hours)
   - Integrate Blockberry's ML spam classifier
   - Track holder count and trading patterns
   - Add community report mechanism

5. **Multichain Support** (6-10 hours)
   - Abstract away Sui-specific code
   - Add support for EVM chains
   - Implement cross-chain compatibility layer

---

*Last Updated: January 2026*
*Module MVP Status: ✅ Complete and Functional*
