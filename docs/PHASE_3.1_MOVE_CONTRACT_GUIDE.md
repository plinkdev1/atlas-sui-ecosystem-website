# Phase 3.1: Move Smart Contract Development

## Overview
Complete Move smart contract for Atlas Protocol payment processing on Sui blockchain. Handles tier purchases, entitlements, fee distribution, and provider management.

## Contract Structure

### Core Modules
- **atlas_protocol::payments** - Main payment processing logic
- **atlas_protocol::types** - Data structures and types

### Key Components

#### Tier System
- **Starter**: 99 SUI/month, 1M requests
- **Growth**: 299 SUI/month, 5M requests
- **Pro**: 799 SUI/month, 10M requests
- **Enterprise**: Custom pricing via off-chain agreement

#### Fee Distribution
- Atlas Protocol: 20% of each payment
- Providers: 80% of each payment
- Automatic splitting via `coin::split`

#### Entitlement NFT
Each purchase creates an on-chain NFT containing:
- Provider address
- Buyer address
- Tier name
- Monthly quota
- Purchase date
- Expiration date (30 days)
- Active status

### Events
All critical transactions emit events for off-chain tracking:
- **PurchaseEvent** - Emitted on tier purchase
- **RefundEvent** - Emitted on refund
- **FeeSplitEvent** - Emitted on fee distribution

## Deployment Instructions

### Prerequisites
```bash
# Install Sui CLI
curl -sSL https://sui-releases.s3.amazonaws.com/sui-latest-ubuntu-x86_64.tgz | tar xz
export PATH=$PATH:$HOME/.sui/bin

# Create Sui client config
sui client envs

# Add testnet
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
```

### Build Contract
```bash
cd contracts
sui move build --network testnet
```

### Deploy to Testnet
```bash
# Fund your address from testnet faucet
sui client faucet

# Deploy
sui client publish --gas-budget 500000000

# Save the following from output:
# - Package ID
# - Treasury object ID
# - Registry object ID
```

### Update deployed_addresses.json
```json
{
  "testnet": {
    "package_id": "0x...",
    "treasury": "0x...",
    "registry": "0x...",
    "deployment_date": "2026-01-15",
    "deployer": "0x...",
    "status": "deployed"
  }
}
```

## Integration with Backend

### 1. Store deployment info in environment
```env
SUI_PACKAGE_ID=0x...
SUI_TREASURY_ID=0x...
SUI_REGISTRY_ID=0x...
SUI_TESTNET_RPC=https://fullnode.testnet.sui.io:443
```

### 2. Update /api/entitlements/purchase
```typescript
// POST /api/entitlements/purchase
// 1. Call purchase_tier transaction builder
// 2. Return transaction payload
// 3. User signs with wallet
// 4. Backend confirms on-chain
// 5. Record entitlement in Supabase
```

### 3. Verify purchase on-chain
```typescript
// After transaction confirmed
const client = new SuiClient({ url: SUI_TESTNET_RPC });
const tx = await client.getTransactionBlock({ digest: txHash });
// Check events for PurchaseEvent
```

## Testing

### Local Testing
```bash
sui move test
```

### Testnet Testing
```bash
# Create test purchase
sui client call \
  --package $SUI_PACKAGE_ID \
  --module payments \
  --function purchase_tier \
  --args $TIER_NAME $PROVIDER_ADDRESS $PAYMENT_COIN $REGISTRY $TREASURY \
  --gas-budget 500000000
```

## Security Considerations

1. **Fee Validation** - Contract validates amounts match tier prices
2. **Authorization** - Admin functions check ownership
3. **State Management** - Entitlements track active/expired status
4. **Event Logging** - All transactions emit events for audit trail

## Mainnet Migration

### Before Going to Mainnet
1. Audit by third-party security firm
2. Extended testnet testing (2+ weeks)
3. Load testing with multiple providers
4. Backup/recovery procedures tested

### Mainnet Deployment
1. Create mainnet addresses (contracts/deployed_addresses.json)
2. Deploy to Sui mainnet
3. Enable treasury withdrawals
4. Begin provider onboarding

## Troubleshooting

### Build Errors
**Error**: `Cannot find module '@mysten/sui'`
**Solution**: Run `sui move build` from contracts directory

### Deployment Fails
**Error**: `Insufficient gas budget`
**Solution**: Increase `--gas-budget` to 1000000000 (1 SUI)

### Transaction Rejected
**Error**: `Invalid argument at index 2`
**Solution**: Verify argument types match function signature

## File Structure
```
contracts/
├── Move.toml              # Package manifest
├── sources/
│   ├── atlas_protocol.move   # Main payment logic
│   └── types.move            # Type definitions
├── deployed_addresses.json   # Deployment tracking
└── tests/
    └── payments_tests.move   # Test suite
```

## Next Steps
1. Deploy contract to Sui testnet
2. Update environment variables with deployed addresses
3. Integrate purchase_tier into backend API
4. Test end-to-end purchase flow
5. Deploy to mainnet after audit

---
*Last Updated: January 15, 2026*
*Maintained by: Atlas Protocol Team*
