import Link from "next/link"
import { RevealSection } from "@/components/reveal-section"

export default function ArchitectureDocs() {
  return (
    <div className="space-y-10 pb-16">
      {/* Back */}
      <Link
        href="/docs"
        className="inline-flex items-center gap-1.5 text-sm text-[#4d9fff] hover:text-[#00d4aa] transition-colors"
      >
        ← Back to Docs
      </Link>

      {/* Header */}
      <RevealSection>
      <div className="space-y-3">
        <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Technical Reference</p>
        <h1 className="heading-hero">Atlas Protocol Architecture</h1>
        <p className="text-subtitle max-w-2xl">
          A modular Sui blockchain dApp toolkit built with Next.js 16, React 19, TypeScript, Tailwind CSS, and
          @mysten/dapp-kit.
        </p>
      </div>
      </RevealSection>

      <RevealSection delay={100}><div className="docs-prose space-y-2">
        {/* Overview */}
        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Overview</h2>
          <p>
            Atlas Protocol is a modular Sui blockchain dApp toolkit built with Next.js 16 (App Router), React 19,
            TypeScript, Tailwind CSS, shadcn/ui, and @mysten/dapp-kit for wallet integration.
          </p>
        </section>

        {/* Tech stack */}
        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Technology Stack</h2>
          <ul>
            <li><strong>Framework:</strong> Next.js 16 (App Router)</li>
            <li><strong>UI Framework:</strong> React 19 with TypeScript</li>
            <li><strong>Styling:</strong> Tailwind CSS v4 with custom design tokens</li>
            <li><strong>Components:</strong> shadcn/ui with custom Atlas design system</li>
            <li><strong>Wallet Integration:</strong> @mysten/dapp-kit (Sui Wallet Standard)</li>
            <li><strong>Blockchain:</strong> Sui RPC via useSuiClient()</li>
            <li><strong>APIs:</strong> Blockberry, Blockvision for enrichment (optional)</li>
            <li><strong>State Management:</strong> Zustand (chain-store.tsx)</li>
          </ul>
        </section>

        {/* Project structure */}
        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Project Structure</h2>
          <pre>
            {`atlas-protocol/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Home page with module cards
│   ├── wallet-cleanup/         # Module 1
│   ├── transaction-explainer/  # Module 2
│   ├── infra-discovery/        # Module 3
│   ├── admin/partners/         # Admin dashboard
│   └── docs/                   # Documentation site
├── components/
│   ├── header.tsx
│   ├── mobile-nav.tsx
│   ├── ecosystem-partners-section.tsx
│   ├── wallet-cleanup-content.tsx
│   ├── transaction-explainer-content.tsx
│   └── infra-discovery-content.tsx
├── lib/
│   ├── sui-provider.tsx        # @mysten/dapp-kit setup
│   ├── chain-store.tsx         # Zustand store for chains
│   ├── network-context.tsx     # Network provider
│   ├── wallet-store.ts         # Wallet state
│   ├── partners-data.ts        # Partner listings
│   └── ...
├── utils/api/
│   ├── blockberry.ts
│   └── blockvision.ts
└── globals.css                 # Design tokens & theme`}
          </pre>
        </section>

        {/* State management */}
        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">State Management</h2>
          <ul>
            <li><strong>Chain Store (Zustand):</strong> Current selected chain, supported chains, network sync</li>
            <li><strong>Wallet Store:</strong> Connected wallet, account address, connection status</li>
            <li><strong>React Context:</strong> Network provider for RPC selection</li>
            <li><strong>Local Storage:</strong> Provider login, service listings (MVP)</li>
          </ul>
        </section>

        {/* Data flow */}
        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Data Flow</h2>
          <ol>
            <li>User selects chain in header dropdown</li>
            <li>Chain store updates, triggers network sync</li>
            <li>User connects wallet via dapp-kit modal</li>
            <li>Wallet store persists connection</li>
            <li>Module component fetches data from Sui RPC</li>
            <li>Optional: Enrich with Blockberry/Blockvision APIs</li>
            <li>Display results with Atlas UI components</li>
          </ol>
        </section>

        {/* Wallet integration */}
        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Wallet Integration</h2>
          <p>Built on @mysten/dapp-kit which automatically supports all Sui Wallet Standard-compliant wallets:</p>
          <ul>
            <li>Slush Wallet (original Sui Wallet, rebranded)</li>
            <li>Phantom (Sui support)</li>
            <li>OKX Wallet</li>
            <li>Nightly Wallet</li>
            <li>Suiet Wallet</li>
            <li>Ethos Wallet</li>
            <li>Glass Wallet</li>
            <li>Martian Wallet (Sui)</li>
            <li>Surf Wallet</li>
            <li>Any future standard-compliant wallets</li>
          </ul>
        </section>

        {/* Module architecture */}
        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Module Architecture</h2>
          <p>Each module follows the same pattern:</p>
          <ul>
            <li><strong>Page Component:</strong> <code>app/[module]/page.tsx</code> — Metadata and layout</li>
            <li><strong>Content Component:</strong> <code>components/[module]-content.tsx</code> — Main logic and UI</li>
            <li><strong>Hooks:</strong> <code>useSuiClient</code>, <code>useCurrentAccount</code>, <code>useChainStore</code></li>
            <li><strong>API Calls:</strong> Direct RPC + optional enrichment APIs</li>
            <li><strong>Sui-Only Scope:</strong> Check selected chain, show fallback for non-Sui</li>
          </ul>
        </section>

        {/* Sui RPC */}
        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Sui RPC Calls</h2>
          <p>Each module uses <code>useSuiClient()</code> from @mysten/dapp-kit:</p>
          <ul>
            <li><strong>Wallet Cleanup:</strong> getCoins(), getOwnedObjects(), getOwnedNFTs()</li>
            <li><strong>Transaction Explainer:</strong> getTransactionBlock() with full options</li>
            <li><strong>Infra Discovery:</strong> getValidators(), mock service data</li>
            <li><strong>Usage Tracking:</strong> Mock quota dashboard</li>
          </ul>
        </section>

        {/* Environment variables */}
        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Environment Variables</h2>
          <ul>
            <li><strong>Blockchain Indexing API Key:</strong> Optional client-side key for Blockberry API</li>
            <li><strong>Sui Indexing API Key:</strong> Optional client-side key for Blockvision API</li>
          </ul>
          <p>
            These are public blockchain APIs designed for client-side use with domain restrictions at provider dashboards.
          </p>
        </section>

        {/* Deployment */}
        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Deployment</h2>
          <ul>
            <li>Built for Vercel deployment</li>
            <li>Next.js 16 optimisations enabled</li>
            <li>Environment variables configured in Vercel project settings</li>
            <li>Domain restrictions set in Blockberry/Blockvision dashboards</li>
          </ul>
        </section>

        {/* Future */}
        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Future Enhancements</h2>
          <ul>
            <li>Multichain support (Aptos, Mina with unified SDKs)</li>
            <li>Backend database for service listings</li>
            <li>CMS integration for partner ads</li>
            <li>Real Move smart contracts for payments</li>
            <li>Advanced analytics and user behaviour tracking</li>
            <li>User accounts and saved preferences</li>
          </ul>
        </section>
      </div></RevealSection>
    </div>
  )
}
