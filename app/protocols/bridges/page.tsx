"use client"

import { ProtocolGrid, type Protocol } from "@/components/protocol-card"
import { Button } from "@/components/ui/button"
import { RevealSection } from "@/components/reveal-section"

const bridges: Protocol[] = [
  { name: "Wormhole", description: "Open-source cross-chain messaging protocol connecting 30+ blockchains including Sui. Foundation of the official Sui Bridge.", tags: ["Cross-chain", "Messaging"], logo: "https://assets.coingecko.com/coins/images/30323/small/wormhole.jpg", url: "https://wormhole.com" },
  { name: "Axelar / Squid", description: "Decentralized interoperability platform enabling cross-chain token transfers and general message passing to Sui.", tags: ["Interop", "GMP"], logo: "https://assets.coingecko.com/coins/images/27277/small/axelar.jpg", url: "https://axelar.network" },
  { name: "Portal Bridge", description: "Token bridge built on Wormhole Connect enabling transfers of tokens to and from Sui across 30+ chains.", tags: ["Token Bridge", "Wormhole"], url: "https://portalbridge.com" },
  { name: "Celer Network", description: "Inter-blockchain and cross-layer communication platform with Sui support via cBridge and fast finality.", tags: ["cBridge", "Fast"], url: "https://celer.network" },
  { name: "Meson Finance", description: "Cross-chain stablecoin swaps protocol with fast finality and low-cost transfers to Sui.", tags: ["Stablecoin", "Low Cost"], url: "https://meson.fi" },
  { name: "Allbridge Core", description: "Multichain bridging solution supporting 14+ chains with USDC and stablecoin transfers to Sui.", tags: ["Stablecoin", "14+ chains"], url: "https://core.allbridge.io" },
  { name: "RocketX", description: "Hybrid CEX and DEX aggregator enabling cross-chain swaps and optimal routing to Sui ecosystem.", tags: ["CEX+DEX", "Aggregator"], url: "https://rocketx.exchange" },
  { name: "Rubic", description: "Cross-chain tech aggregator supporting 45+ chains including Sui for best bridge rates and routing.", tags: ["Aggregator", "45+ chains"], url: "https://rubic.exchange" },
  { name: "DZap", description: "Multi-chain DeFi meta-aggregator for one-click swaps, bridges, and automated actions with optimal routing.", tags: ["Meta-aggregator", "One-click"], url: "https://dzap.io" },
  { name: "Nitro (Router Protocol)", description: "Cross-chain bridge by Router Protocol with intent-based fast transfers and native Sui support.", tags: ["Router Protocol", "Intent-based"], url: "https://app.routernitro.com" },
  { name: "Rango Exchange", description: "Cross-chain swap aggregator connecting 45+ chains with best routing and lowest fees through Sui.", tags: ["45+ chains", "Best Routing"], url: "https://rango.exchange" },
  { name: "OmniBTC", description: "Decentralized cross-chain swap and lend/borrow platform connecting all DeFi liquidity through Sui.", tags: ["Cross-chain", "DeFi"], url: "https://omnibtc.finance" },
  { name: "TeleSwap TON", description: "Bridge aggregator connecting TON and 14+ other chains to the Sui ecosystem with competitive rates.", tags: ["TON Bridge", "14+ chains"], url: "https://teleswap.xyz" },
  { name: "Sui Bridge (Official)", description: "Official native Sui bridge for ETH and USDC transfers between Ethereum and Sui mainnet, built by Mysten Labs.", tags: ["Official", "ETH <> Sui"], logo: "https://assets.coingecko.com/coins/images/30315/small/sui.jpg", url: "https://bridge.sui.io" },
  { name: "WELLDONE Bridge", description: "Non-custodial multi-chain wallet with native bridge functionality across Sui and 10+ other networks.", tags: ["Wallet Bridge", "Non-custodial"], url: "https://welldonestudio.io" },
]

export default function BridgesPage() {
  return (
    <main>
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-28 md:pt-36">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-6 text-center relative z-10">
          <RevealSection>
            <a href="/protocols" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Protocols</a>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Category</p>
            <h1 className="heading-hero">Bridges to Sui</h1>
            <p className="text-subtitle mx-auto max-w-2xl">Move assets from Ethereum, Solana, BNB Chain, and 40+ other networks to Sui.</p>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel text-sm">
              <span className="text-gradient font-bold text-xl">15+</span>
              <span className="text-muted-foreground">Bridge Protocols Listed</span>
            </div>
          </RevealSection>
        </div>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={100}>
          <ProtocolGrid protocols={bridges} />
        </RevealSection>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={200}>
          <div className="card-modern-blue p-10 text-center space-y-4 rounded-3xl">
            <h2 className="heading-section">Find the Cheapest Route</h2>
            <p className="text-subtitle">Use the Atlas Bridge Hub to compare fees across all bridges in real time.</p>
            <a href="/tools/bridge"><Button className="button-primary-modern">Open Bridge Hub</Button></a>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
