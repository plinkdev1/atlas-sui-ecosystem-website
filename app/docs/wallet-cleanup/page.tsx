import Link from "next/link"
import { RevealSection } from "@/components/reveal-section"

export default function WalletCleanupDocs() {
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
        <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Module Docs</p>
        <h1 className="heading-hero">Wallet Cleanup</h1>
        <p className="text-subtitle max-w-2xl">
          Comprehensive analysis and cleanup for Sui wallets — spam NFTs, dust tokens, and actionable insights for
          portfolio optimisation.
        </p>
      </div>
      </RevealSection>

      <RevealSection delay={100}><div className="docs-prose space-y-2">
        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Overview</h2>
          <p>
            The Wallet Cleanup module provides comprehensive analysis and cleanup recommendations for Sui wallets. It
            automatically detects spam NFTs, dust tokens, and provides actionable insights for wallet optimisation.
          </p>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Features</h2>
          <ul>
            <li><strong>NFT Classification:</strong> Spam detection, community ratings, floor prices</li>
            <li><strong>Token Analysis:</strong> Identifies low-value tokens and dust</li>
            <li><strong>Action Buttons:</strong> Send, sell, or hide assets</li>
            <li><strong>Real-time Security:</strong> Powered by Blockberry and Blockvision APIs</li>
            <li><strong>Wallet Connection:</strong> Supports all major Sui wallets (Slush, Phantom, OKX, etc.)</li>
          </ul>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Data Sources</h2>
          <ul>
            <li><strong>Sui RPC:</strong> useSuiClient() for wallet balance and asset data</li>
            <li><strong>Blockberry API:</strong> NFT spam detection and security scoring</li>
            <li><strong>Blockvision API:</strong> Token metadata and market data enrichment</li>
          </ul>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Technical Implementation</h2>
          <pre>
            {`// Hook usage example
const { account } = useCurrentAccount();
const suiClient = useSuiClient();

// Fetch wallet data
const fetchWalletAssets = async () => {
  const coins = await suiClient.getCoins({ owner: account.address });
  const nfts = await suiClient.getOwnedObjects({ owner: account.address });
};`}
          </pre>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Filters</h2>
          <ul>
            <li>Asset type (NFTs, Tokens, All)</li>
            <li>Spam confidence level</li>
            <li>Price range</li>
            <li>Custom tags</li>
          </ul>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Integration Points</h2>
          <ul>
            <li>Wallet connection via @mysten/dapp-kit</li>
            <li>Sui RPC for data fetching</li>
            <li>Blockberry for security analysis</li>
            <li>Blockvision for metadata enrichment</li>
          </ul>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Sui-Only Scope</h2>
          <p>
            This module is exclusively available on Sui networks (Mainnet, Testnet, Devnet). When a non-Sui chain is
            selected, the module displays a "Full functionality on Sui" message and disables interactive features.
          </p>
        </section>
      </div></RevealSection>
    </div>
  )
}
