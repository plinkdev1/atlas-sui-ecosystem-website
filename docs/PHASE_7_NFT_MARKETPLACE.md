# Phase 7: NFT Marketplace Aggregator - Implementation Guide

## Overview
Full NFT marketplace aggregator for Sui blockchain. Aggregates listings from TradePort and BlueMove, supports buying/selling via PTB, tracks trades, and awards Airpoints.

## Architecture

### Database
- **nft_trade_logs** table (created via scripts/034)
  - Tracks: wallet_address, action, nft_object_id, collection_name, price_sui, marketplace_source, tx_digest, status
  - RLS: Users see only their own trade logs

### Backend Files
1. **lib/nft-aggregator-utils.ts** - Core utility library
   - `getNFTListings(filters)` - Aggregates from TradePort + BlueMove APIs
   - `getNFTSummary(objectId)` - Detailed NFT info via Sui SDK getObject
   - `getOwnedNFTs(wallet)` - Wallet NFTs via getOwnedObjects
   - `buildBuyPTBParams(nftId, price, marketplace)` - Buy transaction params
   - `buildSellPTBParams(nftId, price, marketplace)` - List transaction params
   - Mock data fallback when API keys not configured

2. **app/api/nft/listings/route.ts** - GET listings with filters
   - Query params: collection, minPrice, maxPrice, sortBy, marketplace, page, limit
   
3. **app/api/nft/[id]/route.ts** - GET single NFT details
   - Returns: name, description, image, attributes, owner, type

4. **app/api/nft/trade/route.ts** - POST buy/sell/list actions
   - Awards 15 Airpoints per trade (earn_directory type)
   - Logs to nft_trade_logs table

5. **app/api/nft/owned/route.ts** - GET wallet's owned NFTs
   - Uses Sui SDK getOwnedObjects with display data

### Frontend
- **components/nft-marketplace-content.tsx** - Full UI component
  - Explore tab: NFT grid with images, prices, collection names, marketplace badges, rarity ranks
  - Filters: search, min/max price, sort (recent/price/rarity)
  - Buy button with wallet-gated execution
  - My NFTs tab: owned NFTs with list-for-sale functionality
  - Activity tab: trade history placeholder

- **app/nft/page.tsx** - Page wrapper with Header/Footer/BackButton/MobileNav

### Navigation
- Added to Tools dropdown menu with Image icon

## Environment Variables (Manual Setup)

```
TRADEPORT_API_KEY=your_tradeport_api_key    # For TradePort marketplace data
BLUEMOVE_API_KEY=your_bluemove_api_key       # Optional: for BlueMove data
```

## How to Get API Keys

### TradePort
1. Visit https://tradeport.xyz
2. Apply for API access via their developer program
3. API docs: https://docs.tradeport.xyz

### BlueMove
1. Visit https://bluemove.net
2. Contact developer relations for API key
3. API docs available upon approval

## Mock Data
When API keys are not configured, the system returns realistic mock listings from 6 popular Sui collections (SuiFrens, Sui Punks, BlueMove OG, Sui Monkeys, Fuddies, Prime Machin) with randomized prices and rarity data.

## Airpoints Integration
- 15 points per NFT trade (buy, sell, or list)
- Type: earn_directory
- Awarded via /api/airpoints endpoint
- Wallet address extracted from trade request

## Testing Checklist
- [ ] Visit /nft page - should load with mock listings
- [ ] Filter by price range
- [ ] Sort by different criteria
- [ ] Connect wallet - My NFTs tab should load owned NFTs
- [ ] Click Buy - should show wallet signing toast
- [ ] Enter price and click List - should show listing toast
- [ ] Verify nft_trade_logs table receives entries
- [ ] Verify Airpoints awarded (15 pts per trade)

## Production Upgrades (Future)
1. Real PTB execution via @mysten/sui/transactions Transaction class
2. TradePort SDK integration for direct marketplace interaction
3. Collection-level analytics and floor price tracking
4. NFT rarity scoring via on-chain attribute analysis
5. Activity feed from Sui indexer events
6. Offer/bid system integration
