"use client"

import { ProtocolGrid, type Protocol } from "@/components/protocol-card"
import { Button } from "@/components/ui/button"
import { RevealSection } from "@/components/reveal-section"

const oracles: Protocol[] = [
  { name: "Pyth Network", description: "High-fidelity financial market data oracle on Sui. 500+ price feeds with sub-second latency used by top Sui DeFi protocols.", tags: ["Price Feeds", "500+ Assets"], logo: "https://assets.coingecko.com/coins/images/31924/small/pyth.png", url: "https://pyth.network" },
  { name: "Switchboard", description: "Permissionless oracle network on Sui with customizable data feeds. Supports any on-chain data, not just prices.", tags: ["Permissionless", "Custom Feeds"], logo: "https://assets.coingecko.com/coins/images/32776/small/switchboard.png", url: "https://switchboard.xyz" },
  { name: "Supra Oracles", description: "Layer-1 oracle and IntraLayer network delivering fast, accurate cross-chain data to Sui smart contracts.", tags: ["Cross-chain", "Low Latency"], url: "https://supraoracles.com" },
  { name: "Stork Network", description: "Ultra low-latency oracle network designed for high-frequency on-chain applications and derivatives on Sui.", tags: ["Ultra Low Latency", "HFT"], url: "https://stork.network" },
  { name: "DIA Protocol", description: "Open-source, end-to-end transparent oracle platform sourcing data from 100+ exchanges for Sui DeFi.", tags: ["Open Source", "Transparent"], url: "https://diadata.org" },
  { name: "Mentaport", description: "Geolocation oracle on Sui providing verifiable physical location data for DePIN and location-based applications.", tags: ["Geolocation", "DePIN"], url: "https://mentaport.xyz" },
  { name: "RedStone", description: "Modular oracle providing customizable data delivery with pull and push models. Supports Sui with 1000+ price feeds.", tags: ["Modular", "1000+ Feeds"], url: "https://redstone.finance" },
]

export default function OraclesPage() {
  return (
    <main>
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-28 md:pt-36">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-6 text-center relative z-10">
          <RevealSection>
            <a href="/protocols" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Protocols</a>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Category</p>
            <h1 className="heading-hero">Oracle Networks on Sui</h1>
            <p className="text-subtitle mx-auto max-w-2xl">Price feeds, data oracles, and external data providers powering Sui DeFi with reliable on-chain information.</p>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel text-sm">
              <span className="text-gradient font-bold text-xl">7+</span>
              <span className="text-muted-foreground">Oracle Protocols Listed</span>
            </div>
          </RevealSection>
        </div>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={100}>
          <ProtocolGrid protocols={oracles} />
        </RevealSection>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={200}>
          <div className="card-modern-blue p-10 text-center space-y-4 rounded-3xl">
            <h2 className="heading-section">Live Oracle Feeds</h2>
            <p className="text-subtitle">View real-time price data from multiple oracle providers in the Atlas Oracle Dashboard.</p>
            <a href="/tools/oracle-feeds"><Button className="button-primary-modern">View Oracle Feeds</Button></a>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
