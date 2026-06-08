"use client"

import { ProtocolGrid, type Protocol } from "@/components/protocol-card"
import { Button } from "@/components/ui/button"
import { RevealSection } from "@/components/reveal-section"

const launchpads: Protocol[] = [
  { name: "SuiPad", description: "Premier IDO launchpad on Sui. Stake tokens to gain allocation tiers and participate in curated token sales.", tags: ["IDO", "Tier System"], url: "https://suipad.xyz" },
  { name: "SeaPad", description: "Multi-chain launchpad with Sui support, offering IGO, INO, and IDO with guaranteed allocations.", tags: ["Multi-chain", "IGO + INO"], url: "https://seapad.fund" },
  { name: "BlueMove Launch", description: "NFT and token launchpad integrated within the BlueMove ecosystem for Sui-native projects.", tags: ["NFT Launchpad", "IDO"], url: "https://bluemove.net/launch" },
  { name: "BeLaunch", description: "Decentralized launchpad on Sui focusing on community-governed project incubation and fundraising.", tags: ["Community", "Incubation"], url: "https://belaunch.io" },
  { name: "Smithii", description: "No-code token and NFT launch platform on Sui enabling anyone to deploy tokens with custom tokenomics.", tags: ["No-code", "Token Deploy"], url: "https://smithii.io" },
  { name: "Clutchy Launch", description: "GameFi-focused launchpad on Sui specializing in gaming tokens, NFT mints, and in-game item sales.", tags: ["GameFi", "NFT Mints"], url: "https://clutchy.io" },
]

export default function LaunchpadsPage() {
  return (
    <main>
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-28 md:pt-36">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-6 text-center relative z-10">
          <RevealSection>
            <a href="/protocols" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Protocols</a>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Category</p>
            <h1 className="heading-hero">Launchpads on Sui</h1>
            <p className="text-subtitle mx-auto max-w-2xl">IDO, INO, and token launchpads helping new Sui projects raise funds and distribute tokens to the community.</p>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel text-sm">
              <span className="text-gradient font-bold text-xl">6+</span>
              <span className="text-muted-foreground">Launchpad Protocols Listed</span>
            </div>
          </RevealSection>
        </div>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={100}>
          <ProtocolGrid protocols={launchpads} />
        </RevealSection>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={200}>
          <div className="card-modern-blue p-10 text-center space-y-4 rounded-3xl">
            <h2 className="heading-section">Launch Your Project on Sui</h2>
            <p className="text-subtitle">Building on Sui? Submit your project to be featured in the Atlas directory.</p>
            <a href="mailto:hello@atlasprotocol.space"><Button className="button-primary-modern">Submit Your Project</Button></a>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
