"use client"

import { ProtocolGrid, type Protocol } from "@/components/protocol-card"
import { Button } from "@/components/ui/button"
import { RevealSection } from "@/components/reveal-section"

const dexes: Protocol[] = [
  {
    name: "Cetus",
    description: "Pioneer CLMM DEX on Sui. Concentrated liquidity protocol with multi-tier pools, LP rewards, and SDK for builders.",
    tags: ["CLMM", "Top TVL"],
    logo: "https://assets.coingecko.com/coins/images/30395/small/logo.png",
    url: "https://cetus.zone",
  },
  {
    name: "DeepBook",
    description: "Native Sui central limit order book (CLOB) built as foundational liquidity infrastructure in Sui Framework.",
    tags: ["Order Book", "Infra"],
    logo: "https://assets.coingecko.com/coins/images/39651/small/deepbook.jpg",
    url: "https://deepbook.tech",
  },
  {
    name: "Turbos Finance",
    description: "Non-custodial hyper-efficient CLMM DEX backed by Jump Crypto and Mysten Labs.",
    tags: ["CLMM", "Jump Crypto"],
    logo: "https://assets.coingecko.com/coins/images/30271/small/turbos.png",
    url: "https://turbos.finance",
  },
  {
    name: "Aftermath Finance",
    description: "CEX-like on-chain DeFi hub — DEX aggregator, AMM pools, staking, and yield strategies on Sui.",
    tags: ["Aggregator", "AMM"],
    logo: "https://assets.coingecko.com/coins/images/33046/small/aftermath.png",
    url: "https://aftermath.finance",
  },
  {
    name: "FlowX Finance",
    description: "AMM DEX on Sui with concentrated liquidity, launchpad, and multi-hop routing for best swap rates.",
    tags: ["AMM", "Launchpad"],
    url: "https://flowx.finance",
  },
  {
    name: "Kriya DEX",
    description: "Fastest on-chain exchange for derivatives and spot trading built on Sui with 20x leverage.",
    tags: ["Derivatives", "High Leverage"],
    url: "https://kriya.finance",
  },
  {
    name: "BlueMove DEX",
    description: "Super app on Sui with AMM DEX, NFT marketplace, and launchpad with full functionality.",
    tags: ["AMM", "NFT + DEX"],
    url: "https://bluemove.net",
  },
  {
    name: "7K Aggregator",
    description: "DEX aggregator on Sui routing through multiple sources for best swap rates with zero extra fees.",
    tags: ["Aggregator", "Best Rates"],
    url: "https://7k.ag",
  },
  {
    name: "Magma Finance",
    description: "DeFi protocol focused on Sui and MOVE-based blockchains with AMM and liquidity optimization.",
    tags: ["AMM", "MOVE Chains"],
    url: "https://magmafinance.io",
  },
  {
    name: "Momentum",
    description: "Sui-based CLMM protocol for capital-efficient liquidity provisioning with liquid staking integration.",
    tags: ["CLMM", "Liquid Staking"],
    url: "https://momentum.xyz",
  },
  {
    name: "OKX DEX",
    description: "Aggregates 100+ DEX from ETH, Sui, BSC, and other chains for best crypto swap rates.",
    tags: ["Aggregator", "Multi-chain"],
    url: "https://www.okx.com/dex",
  },
  {
    name: "OmniBTC",
    description: "Omnichain DeFi platform connecting on-chain liquidity across Sui and other ecosystems.",
    tags: ["Cross-chain", "DEX + Lend"],
    url: "https://omnibtc.finance",
  },
  {
    name: "Interest Protocol",
    description: "DeFi protocol built in Move language with DEX, lending, and stablecoin primitives.",
    tags: ["AMM", "Move Native"],
    url: "https://interestprotocol.com",
  },
  {
    name: "ABExFinance",
    description: "Pioneering on-chain derivatives and swap protocol with zero slippage and high leverage trading.",
    tags: ["Derivatives", "Zero Slippage"],
    url: "https://abex.fi",
  },
  {
    name: "Ferra",
    description: "Decentralized liquidity protocol built on the Sui blockchain with efficient swap routing.",
    tags: ["Liquidity", "Routing"],
    url: "https://ferra.finance",
  },
  {
    name: "Hop Aggregator",
    description: "Zero-fee trading aggregator across multiple DEXs in the Sui ecosystem with optimal rates.",
    tags: ["Aggregator", "Zero Fee"],
    url: "https://hop.ag",
  },
  {
    name: "Flame Protocol",
    description: "NFT AMM Swap and Coin Swap platform with GameFi ecological infrastructure on Sui.",
    tags: ["NFT AMM", "GameFi"],
    url: "https://flame.finance",
  },
  {
    name: "DipCoin",
    description: "Sui-based DEX for perpetual futures trading combining order book architecture with vaults.",
    tags: ["Perps", "Order Book"],
    url: "https://dipcoin.app",
  },
  {
    name: "Bluefin",
    description: "Decentralized orderbook-based exchange for spot and perpetuals built on Sui.",
    tags: ["Order Book", "Perps"],
    logo: "https://assets.coingecko.com/coins/images/30982/small/bluefin.png",
    url: "https://bluefin.io",
  },
  {
    name: "Scallop DEX",
    description: "Next-generation money market on Sui with integrated swap and concentrated liquidity pools.",
    tags: ["Money Market", "CLMM"],
    logo: "https://assets.coingecko.com/coins/images/33361/small/scallop.png",
    url: "https://scallop.io",
  },
]

export default function DEXPage() {
  return (
    <main>
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-24 md:pt-32">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-6 text-center relative z-10">
          <RevealSection>
          <a href="/protocols" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Protocols
          </a>
          <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Category</p>
          <h1 className="heading-hero">DEX & Trading on Sui</h1>
          <p className="text-subtitle mx-auto max-w-2xl">
            Swap tokens via CLMMs, order books, and AMMs. Compare liquidity, fees, and interfaces across 20+ protocols.
          </p>
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel text-sm">
            <span className="text-gradient font-bold text-xl">20+</span>
            <span className="text-muted-foreground">DEX Protocols</span>
          </div>
          </RevealSection>
        </div>
      </section>

      <section className="section-default container-modern">
        <RevealSection delay={100}>
        <ProtocolGrid protocols={dexes} />
        </RevealSection>
      </section>

      <section className="section-default container-modern">
        <RevealSection delay={200}>
        <div className="card-modern-blue p-10 text-center space-y-4 rounded-3xl">
          <h2 className="heading-section">Find the Best Swap Rates</h2>
          <p className="text-subtitle">Use the Atlas Swap Aggregator to compare routes in real time.</p>
          <a href="/tools/swap">
            <Button className="button-primary-modern">Open Swap Tool</Button>
          </a>
        </div>
        </RevealSection>
      </section>
    </main>
  )
}
