# Atlas Protocol - Architecture Documentation

## Project Overview

Atlas Protocol is a unified wallet and DeFi hub for the Sui blockchain ecosystem. It addresses three Sui Foundation RFPs (Wallet Cleanup, Transaction Explainer, Infra Discovery) through a single widget-based application where protocol integrations are composable, toggleable modules.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui, Glass Design System |
| State | Zustand (wallet, chain, theme), SWR (data) |
| Blockchain | @mysten/dapp-kit, @mysten/sui, Sui Wallet Standard |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| Deployment | Vercel (Next.js optimized) |

## Module Architecture

### Three Core Modules (Phase 1)

1. **Wallet Cleanup** (`/wallet-cleanup`) - AI-powered spam detection, token organization, bulk cleanup
2. **Transaction Explainer** (`/transaction-explainer`) - AI-assisted decoding of on-chain transactions
3. **Infra Discovery** (`/infra-discovery`) - Directory connecting users with validators, RPCs, oracles, bridges

### Widget System (Phase 2+)

Each protocol integration is a self-contained module following the `AtlasWidget` interface:

```typescript
export interface AtlasWidget {
  id: string
  name: string
  category: WidgetCategory // 'defi' | 'nft' | 'infra' | 'ai'
  chain: ChainId | ChainId[] // 'sui' | 'ethereum' | 'aptos'
  icon: string
  component: React.FC<WidgetProps>
  defaultEnabled: boolean
  requiredPermissions: string[]
}
```

Three integration levels:
- **Level 1 (Display)**: Read-only data display from protocol APIs
- **Level 2 (Interactive)**: Full DeFi interaction via protocol SDKs + wallet signing
- **Level 3 (Embedded)**: Sandboxed iframe with postMessage wallet bridge

## File Structure

```
atlas-protocol/
  app/
    layout.tsx              # Root layout with all providers
    client-layout.tsx       # Client providers wrapper
    page.tsx                # Homepage (11-section glassmorphism)
    globals.css             # Design system tokens + glass classes
    wallet-cleanup/         # Wallet module routes
    transaction-explainer/  # Transaction module routes
    infra-discovery/        # Infra module routes
    protocols/              # 19 protocol category pages
    docs/                   # Documentation pages
    tools/                  # Tool hub pages
    admin/                  # Admin dashboard (wallet-gated)
    api/                    # API routes
  components/
    header.tsx              # Glassmorphism navbar
    footer.tsx              # Glass footer with gradient border
    protocol-card.tsx       # Reusable card with LogoImage fallback
    partner-marquee.tsx     # Infinite scroll logo carousel
    glass-panel.tsx         # Reusable glass container
    reveal-section.tsx      # Scroll reveal animation wrapper
    wallet-connect-button.tsx
    wallet-connection-modal.tsx
    mobile-nav.tsx
    ad-carousel.tsx
    ui/                     # shadcn components
  lib/
    protocol-logos.ts       # 130+ protocol logo URL map
    unified-wallet-context.tsx
    theme-provider.tsx
    sui-provider.tsx
    pro-provider.tsx
    network-provider.tsx
  docs/                     # Project documentation
    ARCHITECTURE.md
    DESIGN-SYSTEM.md
    WALLET-SYSTEM.md
    MULTICHAIN-PLAN.md
```

## State Management

| Store | Purpose | Persistence |
|---|---|---|
| Wallet Store | Connected account, available wallets | Session |
| Chain Store | Selected network (mainnet/testnet) | localStorage |
| Theme Store | Light/dark mode | localStorage |
| Widget Store (Phase 2) | Enabled widgets, active chain | localStorage + Supabase |

## API Routes

- `/api/wallet/*` - Token/NFT fetching, spam detection, cleanup operations
- `/api/transactions/*` - Transaction decoding, simulation, history
- `/api/infra/*` - Infrastructure service listing, ratings
- `/api/cookies/*` - Cookie consent management
- `/api/partners/*` - Partner/ad management

## Deployment

- **Platform**: Vercel with automatic deployments from GitHub
- **Database**: Supabase (managed PostgreSQL)
- **CDN**: Vercel Edge Network for static assets
- **Environment**: Variables managed via Vercel project settings

## Security

- Supabase Row Level Security (RLS) on all tables
- Parameterized queries (no SQL injection)
- HTTP-only cookies for session management
- CORS headers configured for API routes
- No sensitive data stored client-side
- Wallet connections via standard Sui Wallet Standard (no private keys)
