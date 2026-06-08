# Atlas Protocol Wallet Integration Guide

## Overview
Atlas Protocol provides a unified wallet system supporting:
- **Native Sui Wallets** (via @mysten/dapp-kit) - Primary integration with automatic detection
- **100+ Multi-chain Wallets** (via ReOwn/WalletConnect) - Fallback for non-Sui wallets  
- **Global State Management** (via Zustand) - Persists connection across pages
- **Zero Re-connection** - Once connected, wallet persists during navigation

## Architecture

### Provider Hierarchy
```
<ProProvider>                    // Pro status (team/features)
  <NetworkProvider>              // Network selection (mainnet/testnet/devnet)
    <SuiProvider>                // Sui blockchain integration
      <QueryClientProvider>      // React Query for data fetching
      <SuiClientProvider>        // Sui RPC client
      <WalletProvider>           // dapp-kit wallet detection
      <UnifiedWalletProvider>    // Global wallet state
        <ThemeProvider>          // Dark/light mode
        <PostHogProvider>        // Analytics
        <ClientLayout>           // App routes
```

### Key Components

#### 1. UnifiedWalletProvider (`lib/unified-wallet-context.tsx`)
- **Syncs dapp-kit hooks** (`useCurrentAccount()`, `useDisconnectWallet()`) with Zustand store
- **Provides global context** via `useUnifiedWallet()` hook
- **Persists connection** through Zustand for offline access
- **No manual reconnection** needed when navigating pages

#### 2. WalletConnectButton (`components/wallet-connect-button.tsx`)
- **Single entry point** for wallet connection in header
- Uses `useWallets()`, `useCurrentAccount()`, `useConnect()` from dapp-kit
- Detects installed wallets automatically
- Shows connected account or "Connect Wallet" button

#### 3. WalletConnectionModal (`components/wallet-connection-modal.tsx`)
- **Primary UI** for wallet selection
- **Sui wallets first** - Detects installed dapp-kit wallets
- **"More Wallets" button** - Opens ReOwn modal for 100+ wallets
- **BrandLogo rendering** - Shows proper wallet icons
- **Network indicator** - Displays current network (mainnet/testnet/devnet)

#### 4. ReownWalletModal (`components/reown-wallet-modal.tsx`)
- **100+ wallet support** via WalletConnect bridge
- **Categorized display** - Native Sui, Multi-chain, Hardware, etc.
- **Search functionality** - Filter by name or category
- **Mobile QR support** - Scan for mobile wallets
- **Fallback for non-Sui** - Supports chains other than Sui

### State Management

#### Zustand Store (`lib/wallet-store.ts`)
```typescript
{
  // Connection state
  currentAccount: string | null      // Wallet address
  walletName: string | null           // Wallet name (Phantom, Slush, etc.)
  isConnected: boolean                // Connection status

  // Auth state
  authToken: string | null            // Session token if authenticated
  isAuthenticated: boolean            // Auth status

  // Preferences
  analyticsOptOut: boolean            // Analytics opt-out

  // Methods
  setCurrentAccount(address)          // Set connected address
  setWalletName(name)                 // Set wallet name
  connect(address, walletName)        // Connect wallet
  disconnect()                        // Clear connection
}
```

#### Zustand Persistence
- **LocalStorage key**: `atlas-wallet-store`
- **Persisted fields**: `currentAccount`, `walletName`, `isConnected`
- **Non-persisted**: `authToken`, `isAuthenticated` (refresh on app load)

## Connection Flows

### Flow 1: Connect Sui Native Wallet (Default)
```
1. User clicks "Connect Wallet" in header
   ↓
2. WalletConnectionModal detects installed wallets via dapp-kit
   ↓
3. User selects wallet (e.g., Phantom, Slush)
   ↓
4. dapp-kit handles wallet connection + signing
   ↓
5. UnifiedWalletProvider syncs to global state
   ↓
6. Zustand persists connection to localStorage
   ↓
7. ✓ Connected - navigate pages without re-connect
```

### Flow 2: Connect Non-Sui Wallet (ReOwn Fallback)
```
1. User clicks "More Wallets (100+)" in modal
   ↓
2. ReownWalletModal opens with wallet browser
   ↓
3. User searches/selects wallet (e.g., MetaMask, Trust Wallet)
   ↓
4. If Sui-capable → try native integration
   ↓
5. If no Sui support → WalletConnect bridge
   ↓
6. UnifiedWalletProvider notifies of non-Sui connection
   ↓
7. ⚠ Limited functionality - Some Sui-specific features unavailable
```

### Flow 3: Disconnect Wallet
```
1. User clicks disconnect (in header/profile)
   ↓
2. dapp-kit disconnect called
   ↓
3. UnifiedWalletProvider clears state
   ↓
4. Zustand store cleared
   ↓
5. localStorage cleared
   ↓
6. ✓ Disconnected - back to "Connect Wallet" state
```

## Usage Examples

### Connect Wallet in Header
```tsx
import { useUnifiedWallet } from "@/lib/unified-wallet-context"

export function HeaderWallet() {
  const { address, connected, walletName, disconnect } = useUnifiedWallet()

  if (!connected) {
    return <WalletConnectButton />
  }

  return (
    <button onClick={disconnect}>
      {walletName}: {address?.slice(0, 8)}...
    </button>
  )
}
```

### Check Wallet in Component
```tsx
import { useUnifiedWallet } from "@/lib/unified-wallet-context"

export function MyComponent() {
  const { address, connected } = useUnifiedWallet()

  if (!connected) {
    return <p>Please connect wallet</p>
  }

  return <p>Connected: {address}</p>
}
```

### Perform Action After Connection
```tsx
import { useEffect } from "react"
import { useUnifiedWallet } from "@/lib/unified-wallet-context"

export function DataFetcher() {
  const { address, connected } = useUnifiedWallet()

  useEffect(() => {
    if (connected && address) {
      // Fetch data for this address
      fetchUserData(address)
    }
  }, [connected, address])

  return <>...</>
}
```

## Persistence & Offline Behavior

### How Persistence Works
1. **On connection**: Zustand store saves to localStorage
2. **On page reload**: Store hydrates from localStorage
3. **On navigation**: Store maintained across pages (no API call needed)
4. **On app restart**: Store restored, dapp-kit wallet re-detected

### Edge Cases Handled
- **Wallet disconnected externally** → dapp-kit hook detects, clears store
- **Network changed in wallet** → dapp-kit hook updates, global state syncs
- **localStorage cleared** → Falls back to dapp-kit current account
- **Both sources empty** → User sees "Connect Wallet"

## Testing Checklist

- [ ] **Sui wallet connection**: Connect in header → navigate pages → still connected
- [ ] **ReOwn wallet connection**: Open modal → "More Wallets" → select → connects
- [ ] **Disconnect**: Disconnect button works → state cleared globally
- [ ] **Logo rendering**: Wallet logos show in modal + pages
- [ ] **Network indicator**: Shows correct network badge
- [ ] **No errors**: Browser console clear, no provider nesting errors
- [ ] **Mobile**: QR modal works for mobile wallets
- [ ] **Persistence**: Reload page → wallet still connected

## Troubleshooting

### Wallet Not Detected
**Problem**: "No wallet extensions detected"
**Solution**: 
- Install Sui wallet (Phantom, Slush, Martian, etc.)
- Reload browser
- Check if extension is enabled in browser settings

### Connection Fails
**Problem**: "Failed to connect wallet"
**Solution**:
- Check browser console for errors
- Verify wallet extension is latest version
- Try different wallet
- Check network (mainnet/testnet/devnet)

### Wallet Disconnects on Navigation
**Problem**: Need to reconnect after page change
**Solution**:
- Clear localStorage: `localStorage.clear()`
- Reload page
- Report issue with browser/wallet version info

### ReOwn Modal Disabled
**Problem**: "More Wallets" button grayed out
**Solution**:
- Set `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` in `.env.local`
- Get Project ID from https://cloud.walletconnect.com
- Redeploy or restart dev server

## Environment Variables

### Required for ReOwn Support
```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
```

### Optional
```env
# RPC Overrides (defaults to fullnode.mainnet.sui.io)
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.mainnet.sui.io:443
NEXT_PUBLIC_TESTNET_RPC_URL=https://fullnode.testnet.sui.io:443
NEXT_PUBLIC_DEVNET_RPC_URL=https://fullnode.devnet.sui.io:443
```

## API Reference

### useUnifiedWallet()
```tsx
const {
  // Connection state
  address: string | null
  connected: boolean
  walletName: string | null
  
  // Auth state  
  authToken: string | null
  isAuthenticated: boolean
  
  // Network
  network: ChainId
  setNetwork: (network: ChainId) => void
  chainGroup: "Sui" | "Aptos" | "Ethereum" | "Mina" | "IOTA" | "Monad"
  shortNetwork: string
  
  // Actions
  disconnect: () => void
  select: (walletName: string) => Promise<void>
  
  // Detected wallets (from dapp-kit)
  detectedWallets: DetectedWallet[]
  configuredWallets: DetectedWallet[]
} = useUnifiedWallet()
```

## Summary
Atlas Protocol's wallet system prioritizes **Sui native wallets** with a **ReOwn fallback** for 100+ additional chains. The **global state** persists connections across pages, while **zero reconnection** provides a seamless UX. All integrations follow **best practices** for security and maintainability.
