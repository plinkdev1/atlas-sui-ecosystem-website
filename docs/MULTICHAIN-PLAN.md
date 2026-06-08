# Atlas Protocol - Multichain Expansion Plan

## Executive Summary

Adding WalletConnect and multichain support will NOT destroy the current architecture. The widget-based design centralizes wallet state in a provider layer, not inside individual widgets. When the wallet layer is upgraded for multiple chains, every widget inherits that capability without rewriting.

**Every change is additive. Nothing existing needs to be torn down.**

## Why the Current Architecture Supports This

1. **Wallet Layer is Abstracted**: Widgets consume wallet state via `@mysten/dapp-kit` hooks (`useCurrentAccount`, `useSignAndExecuteTransaction`). They don't know how the connection was established.

2. **Widget Registry is Extensible**: Adding a `chain` field to `AtlasWidget` is a non-breaking change. Existing Sui widgets get `chain: 'sui'`. New chain widgets get their chain ID.

3. **Provider Layer is Composable**: Sui dApp Kit and Reown AppKit can coexist -- they manage different wallet namespaces.

## What Changes Per Layer

| Layer | Change | Impact |
|---|---|---|
| Wallet Provider | Add Reown AppKit alongside Sui dApp Kit | Additive only |
| Chain Selector UI | Make chain switcher functional | UI addition only |
| Widget Registry | Add `chain` field to AtlasWidget | Minor, non-breaking |
| Sui Widgets | Add `chain: 'sui'` to definitions | One line per widget |
| New Chain Widgets | Build new modules per chain | New code only |
| State Store | Add `activeChain` to Zustand | Additive |

## Preparations for Phase 1 (Do Now)

### 1. ChainId Type
```typescript
// src/types/chain.ts
export type ChainId = 'sui' | 'ethereum' | 'aptos' | 'bitcoin'
export const ACTIVE_CHAINS: ChainId[] = ['sui'] // expand later
```

### 2. Chain Field on AtlasWidget
Include optional `chain` field from day one. Cost: one line per widget. Payoff: zero refactoring later.

### 3. Abstract the RPC Client
```typescript
// src/hooks/useChainClient.ts
export const useChainClient = () => {
  const activeChain = useWidgetStore(s => s.activeChain)
  return getSuiClient() // Phase 1: always Sui. Phase 2+: per-chain.
}
```

### 4. Keep Wallet Logic Out of Widgets
Hard rule: if any widget directly imports wallet connection logic, multichain becomes a rewrite. Enforce during code review.

## Chain Expansion Priority

| Chain | Phase | Rationale | Wallet Solution |
|---|---|---|---|
| Sui | Phase 1 (now) | Core product, all RFPs | @mysten/dapp-kit |
| Aptos | Phase 2 first | Move language overlap, natural fit | @aptos-labs/wallet-adapter-react |
| Ethereum/EVM | Phase 2-3 | Largest ecosystem, WalletConnect native | Reown AppKit + wagmi |
| Solana | Phase 3 | Large ecosystem, different model | @solana/wallet-adapter-react |
| Bitcoin (native) | Phase 3+ | Complex, growing with Ordinals | Leather, Xverse adapters |

## Phase 2 Implementation Steps

### Step 1: Install WalletConnect / Reown AppKit
1. Install `@reown/appkit` and `@reown/appkit-adapter-wagmi`
2. Get project ID from cloud.reown.com (free)
3. Configure with desired chains and wallet list
4. Wrap app with AppKit provider alongside existing SuiClientProvider

### Step 2: Chain Switcher UI
1. Populate chain selector with chains from `ACTIVE_CHAINS`
2. On switch, update `activeChain` in Zustand
3. Widget grid re-renders showing only widgets for active chain
4. Wallet modal shows wallets compatible with selected chain

### Step 3: First Non-Sui Widget (Aptos)
- Install `@aptos-labs/ts-sdk` and `@aptos-labs/wallet-adapter-react`
- Target: Liquidswap or Joule Finance (largest Aptos DEX/lending)
- Widget only renders when `activeChain === 'aptos'`

## Special Case: Bitcoin Primitives

BTC primitives on Sui (LBTC, xBTC, sBTC, Nativerse LSTs) are wrapped Bitcoin assets living natively on Sui. Users interact via their Sui wallet -- no Bitcoin wallet needed. This means BTC primitive support is a **Sui-layer feature, not a multichain feature**, and can be built in Phase 1.

## Summary

Build Sui first. Build it right. Multichain is a growth path, not a pivot. The three things that make expansion clean:
1. Wallet state is centralized in one provider layer
2. Widgets are chain-agnostic consumers of wallet context
3. The registry pattern supports filtering and extension natively
