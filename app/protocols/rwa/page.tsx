"use client"

import { ProtocolGrid, type Protocol } from "@/components/protocol-card"
import { Button } from "@/components/ui/button"
import { RevealSection } from "@/components/reveal-section"

const rwa: Protocol[] = [
  { name: "Panzerdogs RWA", description: "Tokenized gaming collectibles protocol on Sui bridging physical trading cards and digital assets with RWA standards.", tags: ["Gaming RWA", "Collectibles"], url: "https://panzerdogs.io" },
  { name: "Artfi", description: "Fractional fine art investment platform on Sui. Own a share of Picasso, Basquiat, and other blue-chip artworks on-chain.", tags: ["Fine Art", "Fractional Ownership"], url: "https://artfi.world" },
  { name: "Creek Finance", description: "Tokenized gold and commodity-backed stablecoins on Sui, bridging traditional commodity markets to DeFi.", tags: ["Tokenized Gold", "Commodities"], url: "https://creek.finance" },
  { name: "Suinova", description: "Real-world asset tokenization platform on Sui enabling businesses to tokenize real estate, invoices, and treasury bonds.", tags: ["Real Estate", "Tokenization"], url: "https://suinova.io" },
  { name: "Midas Markets", description: "Institutional-grade tokenized US Treasuries on Sui, providing on-chain access to T-bill yields for DeFi protocols.", tags: ["US Treasuries", "Institutional"], url: "https://midas.app" },
  { name: "NX Finance", description: "Yield-bearing RWA protocol on Sui converting real-world bond yields into composable on-chain interest rate products.", tags: ["Bonds", "Yield Bearing"], url: "https://nx.finance" },
  { name: "Fasset", description: "Regulated real-world asset tokenization platform with Sui integration for emerging market assets and sukuk bonds.", tags: ["Regulated", "Emerging Markets"], url: "https://fasset.com" },
  { name: "Polytrade", description: "Trade finance and RWA marketplace on Sui enabling tokenization of invoices, purchase orders, and trade receivables.", tags: ["Trade Finance", "Invoices"], url: "https://polytrade.finance" },
  { name: "PropBase", description: "Fractional real estate investment protocol on Sui enabling retail investors to own tokenized property shares.", tags: ["Real Estate", "Fractional"], url: "https://propbase.app" },
  { name: "Centrifuge on Sui", description: "Pioneer RWA protocol bridging DeFi and real-world credit markets via Centrifuge Prime, now expanding to Sui.", tags: ["Credit Markets", "DeFi Bridge"], url: "https://centrifuge.io" },
]

export default function RWAPage() {
  return (
    <main>
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-28 md:pt-36">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-6 text-center relative z-10">
          <RevealSection>
            <a href="/protocols" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Protocols</a>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Category</p>
            <h1 className="heading-hero">Real World Assets on Sui</h1>
            <p className="text-subtitle mx-auto max-w-2xl">Tokenized real estate, fine art, treasury bonds, gold, and trade finance — bringing the $500T real-world asset market on-chain via Sui.</p>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel text-sm">
              <span className="text-gradient font-bold text-xl">10+</span>
              <span className="text-muted-foreground">RWA Protocols Listed</span>
            </div>
          </RevealSection>
        </div>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={100}>
          <ProtocolGrid protocols={rwa} />
        </RevealSection>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={200}>
          <div className="card-modern-blue p-10 text-center space-y-4 rounded-3xl">
            <h2 className="heading-section">Tokenize Real-World Assets on Sui</h2>
            <p className="text-subtitle">Submit your RWA protocol to be listed in the Atlas directory.</p>
            <a href="mailto:hello@atlasprotocol.space"><Button className="button-primary-modern">Submit Protocol</Button></a>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
