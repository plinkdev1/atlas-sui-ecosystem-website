# Phase 6: Bridge Hub - Implementation Guide

## Overview
Bridge Hub is a cross-chain bridge aggregator comparing routes from Wormhole, Squid (Axelar), and Sui Native Bridge.

## Architecture

### Database
- **bridge_logs** table - Tracks all bridge transactions
  - wallet_address, source_chain, dest_chain, token, amount
  - provider, source_tx_hash, dest_tx_hash, fee, status
  - RLS: Users see only their own records

### Backend

#### Utilities: `/lib/bridge-aggregator-utils.ts`
- `getBridgeRoutes(source, dest, token, amount)` - Fetches routes from all providers in parallel
- `findBestBridgeRoute(routes)` - Ranks routes by output amount (60%), security (30%), speed (10%)
- `SUPPORTED_CHAINS` - 10 chains: Sui, Ethereum, Arbitrum, Optimism, Polygon, BNB, Avalanche, Base, Solana, Aptos
- `BRIDGE_TOKENS` - 5 tokens: SUI, USDC, USDT, WETH, WBTC

#### API Routes
1. `GET /api/bridge/routes?sourceChain=sui&destChain=ethereum&token=USDC&amount=100`
   - Returns all available routes sorted by output amount
   - Includes `bestRoute` recommendation
2. `POST /api/bridge/execute`
   - Logs bridge transaction to bridge_logs table
   - Awards 15 Airpoints (type: earn_directory)
   - Returns bridge log ID and status

### Frontend: `/components/bridge-hub-content.tsx`
- Chain selectors (From/To) with swap button
- Token selector + amount input
- Auto-fetches routes on 800ms debounce
- Route cards with provider name, time, fee, security score, output amount
- Best route badge highlight
- Execute bridge button (requires wallet connection)

### Navigation
- Added to Tools dropdown menu with GitBranch icon

## Manual Setup for Production

### Environment Variables
```
SQUID_API_KEY=         # For real Squid/Axelar quotes (optional, fallback estimates work)
```

### Real Bridge Provider Integration
Currently using estimated/simulated routes. For production:

1. **Wormhole**: Install `@wormhole-foundation/sdk` and use `wormhole.tokenBridge()` for real routes
2. **Squid**: Set SQUID_API_KEY env var - API integration already built in `fetchSquidRoutes()`
3. **Sui Native Bridge**: Use `@mysten/sui/bridge` package for official Sui bridge transactions

### Wallet Transaction Signing
The execute endpoint currently logs the bridge intent. For real execution:
1. Build PTB (Programmable Transaction Block) for the bridge contract call
2. Return serialized transaction to frontend
3. Frontend signs with connected wallet via `signAndExecuteTransaction()`
4. Update bridge_logs with source_tx_hash and dest_tx_hash

### Testing Checklist
- [ ] GET /api/bridge/routes returns routes for Sui -> Ethereum USDC
- [ ] POST /api/bridge/execute logs to bridge_logs table
- [ ] Airpoints awarded (15 pts per bridge)
- [ ] UI renders routes correctly with selection
- [ ] Chain swap button works
- [ ] Wallet connection required for execution
- [ ] Error handling for missing routes

## Airpoints Integration
- 15 points per bridge execution (type: earn_directory)
- Awarded via /api/airpoints endpoint
- Wallet address extracted from request body

## Security Considerations
- All bridge routes include security scores (0-100)
- Sui Native Bridge has highest score (99) but is slowest
- Routes are ranked with security as 30% weight
- RLS policies ensure users only see their own bridge logs
- No private keys stored - all signing happens client-side
