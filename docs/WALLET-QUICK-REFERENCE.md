# Quick Reference: Wallet System

## Connect Wallet in Any Component

```tsx
import { useUnifiedWallet } from "@/lib/unified-wallet-context"

export function MyComponent() {
  const { address, connected, disconnect } = useUnifiedWallet()

  if (!connected) return <button onClick={() => location.href = "/"}>Connect Wallet</button>
  
  return <div>Connected: {address}</div>
}
```

## Provider Hierarchy (Copy to layout.tsx if needed)

```tsx
<ProProvider>
  <NetworkProvider>
    <SuiProvider>
      <ThemeProvider>
        <PostHogProvider>
          <ClientLayout>{children}</ClientLayout>
        </PostHogProvider>
      </ThemeProvider>
    </SuiProvider>
  </NetworkProvider>
</ProProvider>
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "useUnifiedWallet must be used within..." | Add `"use client"` at top of file |
| Wallet not detected | Verify wallet extension installed & enabled |
| Connection doesn't persist | Check: localStorage enabled, not full |
| ReOwn disabled | Set `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` |
| Wrong hook used | Use `useWallets()`, `useConnect()`, `useCurrentAccount()` |
| Provider nesting error | Ensure one SuiProvider in layout |

## Key Files

| File | Purpose |
|------|---------|
| `lib/unified-wallet-context.tsx` | Global wallet state |
| `lib/wallet-store.ts` | Zustand persistence |
| `lib/sui-provider.tsx` | Provider hierarchy |
| `components/wallet-connect-button.tsx` | Header button |
| `components/wallet-connection-modal.tsx` | Main modal |
| `app/layout.tsx` | Root provider setup |

## Environment Variables

```env
# Optional - for 100+ wallets (ReOwn)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Optional - RPC overrides
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.mainnet.sui.io:443
```

## Testing Checklist

- [ ] Connect Sui wallet → persists across pages
- [ ] Disconnect → clears state completely
- [ ] ReOwn modal → shows 100+ wallets
- [ ] Logos → render correctly
- [ ] Console → no errors/warnings
- [ ] Mobile → responsive, QR works
- [ ] Build → `npm run build` succeeds
- [ ] Types → `npx tsc --noEmit` passes

## dapp-kit Hooks Reference

```tsx
import { 
  useCurrentAccount,           // Get connected wallet
  useWallets,                  // List available wallets
  useConnect,                  // Connect function
  useDisconnectWallet,        // Disconnect function
} from "@mysten/dapp-kit"

// In component:
const currentAccount = useCurrentAccount()
const { wallets, connect } = useWallets()
const { mutate: disconnect } = useDisconnectWallet()
```

## State Type

```tsx
interface UnifiedWalletContextType {
  address: string | null
  connected: boolean
  walletName: string | null
  network: "sui:mainnet" | "sui:testnet" | "sui:devnet"
  disconnect: () => void
  // ... more fields in full documentation
}
```

## localStorage Structure

```json
{
  "atlas-wallet-storage": {
    "state": {
      "currentAccount": "0x1234...",
      "walletName": "Phantom",
      "isConnected": true,
      "authToken": null,
      "isAuthenticated": false,
      "analyticsOptOut": false
    },
    "version": 0
  }
}
```

## Import Paths

```tsx
// Wallet context
import { useUnifiedWallet } from "@/lib/unified-wallet-context"

// Zustand store (rarely used directly)
import { useWalletStore } from "@/lib/wallet-store"

// Sui provider
import { SuiProvider } from "@/lib/sui-provider"

// Components
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { WalletConnectionModal } from "@/components/wallet-connection-modal"
import { ReownWalletModal } from "@/components/reown-wallet-modal"

// dapp-kit (for advanced usage)
import { useCurrentAccount, useWallets } from "@mysten/dapp-kit"
```

## Flow Diagram

```
User clicks "Connect Wallet"
        ↓
WalletConnectionModal opens
        ↓
   ┌────┴────┐
   ↓         ↓
Sui Wallets  More Wallets (100+)
   ↓         ↓
   └────┬────┘
        ↓
User selects wallet
        ↓
dapp-kit connects
        ↓
UnifiedWalletProvider syncs
        ↓
Zustand store persisted
        ↓
Header shows connected ✓
```

## Version Info

- **Atlas Protocol**: 1.0
- **Wallet System**: 1.0
- **@mysten/dapp-kit**: latest
- **zustand**: latest
- **React**: 19.2.0
- **Next.js**: 16.0.10

---

**Documentation**: See `/docs/Wallet-Guide.md` for complete guide  
**Testing**: See `/docs/Wallet-Testing-Guide.md` for test procedures  
**Status**: ✅ Production Ready
