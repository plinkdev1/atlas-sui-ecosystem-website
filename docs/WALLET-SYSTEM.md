# Atlas Protocol - Wallet System Documentation

## Overview

Atlas uses the Sui Wallet Standard via `@mysten/dapp-kit` for wallet connections. The wallet layer is centralized in the provider stack -- widgets and pages consume wallet state via hooks, never managing their own connections.

## Architecture

### Provider Stack (layout.tsx)
```
<ThemeProvider>
  <ProProvider>
    <NetworkProvider>
      <SuiClientProvider>
        <WalletProvider>
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </NetworkProvider>
  </ProProvider>
</ThemeProvider>
```

### Key Files
| File | Purpose |
|---|---|
| `lib/sui-provider.tsx` | SuiClientProvider + WalletProvider setup |
| `lib/unified-wallet-context.tsx` | Unified wallet state abstraction |
| `components/wallet-connect-button.tsx` | Connect/disconnect button |
| `components/wallet-connection-modal.tsx` | Wallet selection modal |
| `lib/network-provider.tsx` | Network switching (mainnet/testnet) |

## Wallet Connection Flow

1. User clicks "Connect Wallet" button in header
2. `WalletConnectionModal` opens showing available Sui wallets
3. User selects wallet (Sui Wallet, Phantom, Slick, Splash, etc.)
4. `@mysten/dapp-kit` handles the connection via Sui Wallet Standard
5. Connected account state propagates to all consuming components via hooks
6. Admin/partner pages check `useCurrentAccount()` for gating

## Hooks Used

```typescript
// Get connected wallet account
import { useCurrentAccount } from '@mysten/dapp-kit'
const account = useCurrentAccount()

// Sign and execute transactions
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit'
const { mutate: signAndExecute } = useSignAndExecuteTransaction()

// Connect/disconnect
import { useConnectWallet, useDisconnectWallet } from '@mysten/dapp-kit'
```

## Wallet-Gated Pages

### Admin Dashboard (`/admin`)
- Requires wallet connection to access
- Shows connect prompt if disconnected
- Validates admin wallet address against allowlist

### Partner Pages (`/admin/partners`)
- Requires wallet connection for partner actions
- Partner wallet address stored in Supabase `partners` table

## Design Rule: Wallet Logic Isolation

**Critical for multichain expansion**: Widgets and pages NEVER import wallet connection logic directly. They consume wallet state via hooks provided by the centralized provider layer.

This means when the wallet layer is later extended with WalletConnect/Reown AppKit for multichain support, no widget code needs to change -- they keep consuming the same hooks.

```typescript
// CORRECT - consume wallet context
const account = useCurrentAccount()

// WRONG - don't import wallet internals in widgets
import { WalletProvider } from '@mysten/dapp-kit' // Never in a widget
```

## Supported Wallets

Any wallet implementing the Sui Wallet Standard is automatically supported:
- Sui Wallet (official)
- Phantom
- Slick Wallet
- Splash Wallet
- Ethos Wallet
- Nightly
- Martian
- And others implementing the standard

## Network Configuration

```typescript
const networks = {
  mainnet: { url: getFullnodeUrl('mainnet') },
  testnet: { url: getFullnodeUrl('testnet') },
}
```

Network selection persists to localStorage and is managed by `NetworkProvider`.

## Phase 2: WalletConnect / Multichain

See `MULTICHAIN-PLAN.md` for the expansion strategy. Key point: the current architecture was designed so multichain is an additive extension, not a rewrite.
