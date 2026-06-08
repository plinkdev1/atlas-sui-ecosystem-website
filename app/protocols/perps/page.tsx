"use client"

import { ProtocolGrid, type Protocol } from "@/components/protocol-card"
import { Button } from "@/components/ui/button"
import { RevealSection } from "@/components/reveal-section"

const perps: Protocol[] = [
  { name: "Bluefin", description: "Decentralized orderbook-based exchange for spot and perpetuals on Sui. Up to 20x leverage with deep liquidity.", tags: ["Order Book", "20x Leverage"], logo: "https://assets.coingecko.com/coins/images/30982/small/bluefin.png", url: "https://bluefin.io" },
  { name: "HyperSui", description: "High-performance perpetuals DEX on Sui with CEX-like UX, deep order books, and advanced trading features.", tags: ["Perps", "CEX-like"], url: "https://hypersui.io" },
  { name: "Typus Finance", description: "Real yield infrastructure integrating swap, lending, and derivatives on Sui with sustainable yield generation.", tags: ["Derivatives", "Real Yield"], url: "https://typus.finance" },
  { name: "KriyaDEX Perps", description: "Fastest on-chain exchange for derivatives built on Sui. Trade perps with 20x leverage, plus OTC-RFQ desk.", tags: ["20x Leverage", "OTC Desk"], url: "https://kriya.finance" },
  { name: "ABExFinance", description: "Pioneering on-chain derivatives and swap protocol with zero slippage and high leverage trading services.", tags: ["Zero Slippage", "High Leverage"], url: "https://abex.fi" },
  { name: "ZO Protocol", description: "Decentralized protocol for trading perpetual contracts on the Sui network with capital-efficient architecture.", tags: ["Perps", "Capital Efficient"], url: "https://zo.xyz" },
  { name: "Sudo Finance", description: "On-chain perpetual protocol built with Move on Sui combining perps with real-world asset primitives.", tags: ["Perps", "RWA"], url: "https://sudo.finance" },
  { name: "DipCoin", description: "Sui-based DEX for perpetual futures trading combining order book architecture with vault strategies.", tags: ["Order Book", "Vaults"], url: "https://dipcoin.app" },
  { name: "Elixir", description: "Modular DPoS network built to power liquidity on orderbook exchanges, with Sui integration.", tags: ["Liquidity", "DPoS"], url: "https://elixir.finance" },
  { name: "Siphon Lab", description: "Next-generation perps protocol on Sui with innovative market-making and risk management systems.", tags: ["Perps", "Market Making"], url: "https://siphon.fi" },
  { name: "Aftermath Perps", description: "Perpetuals trading integrated into Aftermath Finance DeFi hub, combining perps with AMM liquidity.", tags: ["Integrated", "AMM"], logo: "https://assets.coingecko.com/coins/images/33046/small/aftermath.png", url: "https://aftermath.finance" },
  { name: "Scallop Trading", description: "Leveraged trading on Scallop money market using lend positions as collateral for perps exposure.", tags: ["Leveraged", "Money Market"], logo: "https://assets.coingecko.com/coins/images/33361/small/scallop.png", url: "https://scallop.io" },
]

export default function PerpsPage() {
  return (
    <main>
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-28 md:pt-36">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-6 text-center relative z-10">
          <RevealSection>
            <a href="/protocols" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Protocols</a>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Category</p>
            <h1 className="heading-hero">Perpetuals on Sui</h1>
            <p className="text-subtitle mx-auto max-w-2xl">Trade leveraged perpetual futures on Sui — up to 20x leverage with on-chain orderbooks and AMM-based perps.</p>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel text-sm">
              <span className="text-gradient font-bold text-xl">12+</span>
              <span className="text-muted-foreground">Perp Protocols Listed</span>
            </div>
          </RevealSection>
        </div>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={100}>
          <ProtocolGrid protocols={perps} />
        </RevealSection>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={200}>
          <div className="card-modern-blue p-10 text-center space-y-4 rounded-3xl">
            <h2 className="heading-section">Trade Perpetuals</h2>
            <p className="text-subtitle">High risk, high reward. Only trade with capital you can afford to lose.</p>
            <a href="/protocols"><Button className="button-primary-modern">Browse More Protocols</Button></a>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
