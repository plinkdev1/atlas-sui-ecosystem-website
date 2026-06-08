"use client"

import { ProtocolGrid, type Protocol } from "@/components/protocol-card"
import { Button } from "@/components/ui/button"
import { RevealSection } from "@/components/reveal-section"

const predictionMarkets: Protocol[] = [
  { name: "SuiMarket", description: "Decentralized prediction market platform on Sui enabling users to create and trade binary outcome markets.", tags: ["Binary Markets", "User-created"], url: "https://suimarket.io" },
  { name: "Got Beef?", description: "Peer-to-peer prediction and challenge platform on Sui where users settle disputes with crypto bets.", tags: ["P2P Bets", "Challenges"], url: "https://gotbeef.app" },
  { name: "DoubleUp", description: "On-chain prediction game platform on Sui with coin flips, dice rolls, and sports betting markets.", tags: ["Games", "Sports Betting"], url: "https://doubleup.fun" },
  { name: "FAITH Protocol", description: "Decentralized oracle-based prediction protocol on Sui with community governance and real-world event markets.", tags: ["Oracle-based", "Governance"], url: "https://faithprotocol.io" },
  { name: "AUR Protocol", description: "Permissionless prediction market infrastructure on Sui enabling anyone to create markets on any topic.", tags: ["Permissionless", "Infrastructure"], url: "https://aur.finance" },
  { name: "Koral Finance", description: "Social prediction platform combining community sentiment, on-chain markets, and NFT rewards on Sui.", tags: ["Social", "NFT Rewards"], url: "https://koral.finance" },
  { name: "Typus Finance (Options)", description: "Real-yield DeFi protocol on Sui with options vaults and structured prediction products for sophisticated users.", tags: ["Options", "Real Yield"], url: "https://typus.finance" },
  { name: "Clutchy Predictions", description: "Gamified prediction market experience on Sui with leaderboards, seasons, and NFT prizes for winners.", tags: ["Gamified", "Leaderboards"], url: "https://clutchy.io" },
]

export default function PredictionMarketsPage() {
  return (
    <main>
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-28 md:pt-36">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-6 text-center relative z-10">
          <RevealSection>
            <a href="/protocols" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Protocols</a>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Category</p>
            <h1 className="heading-hero">Prediction Markets on Sui</h1>
            <p className="text-subtitle mx-auto max-w-2xl">Bet on future outcomes. Real-money prediction markets powered by Sui's speed and low costs.</p>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel text-sm">
              <span className="text-gradient font-bold text-xl">8+</span>
              <span className="text-muted-foreground">Prediction Protocols Listed</span>
            </div>
          </RevealSection>
        </div>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={100}>
          <ProtocolGrid protocols={predictionMarkets} />
        </RevealSection>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={200}>
          <div className="card-modern-blue p-10 text-center space-y-4 rounded-3xl">
            <h2 className="heading-section">Building a Prediction Market?</h2>
            <p className="text-subtitle">Submit your protocol to be listed in the Atlas directory.</p>
            <a href="mailto:hello@atlasprotocol.space"><Button className="button-primary-modern">Submit Protocol</Button></a>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
