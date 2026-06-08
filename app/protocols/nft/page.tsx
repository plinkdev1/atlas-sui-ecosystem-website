"use client"

import { ProtocolGrid, type Protocol } from "@/components/protocol-card"
import { Button } from "@/components/ui/button"
import { RevealSection } from "@/components/reveal-section"

const nftProtocols: Protocol[] = [
  { name: "Tradeport", description: "Largest NFT marketplace on Sui by trading volume. Supports all major collections with advanced filtering and rarity tools.", tags: ["Marketplace", "High Volume"], url: "https://tradeport.xyz" },
  { name: "BlueMove", description: "All-in-one NFT super app on Sui with marketplace, launchpad, DEX, and creator tools for artists and collectors.", tags: ["Marketplace", "Launchpad"], url: "https://bluemove.net" },
  { name: "Hyperspace", description: "NFT marketplace and analytics platform for Sui. Deep rarity data, portfolio tracking, and sweeping tools.", tags: ["Marketplace", "Analytics"], url: "https://sui.hyperspace.xyz" },
  { name: "Keepsake", description: "Sui NFT marketplace with a focus on curated collections and premium digital art with lending support.", tags: ["Curated", "NFT Lending"], url: "https://keepsake.gg" },
  { name: "OKX NFT Marketplace", description: "Multi-chain NFT marketplace from OKX supporting Sui collections with zero marketplace fees.", tags: ["Zero Fees", "Multi-chain"], url: "https://www.okx.com/web3/marketplace/nft" },
  { name: "Artfi", description: "Fractional art investment platform tokenizing fine art on Sui, enabling retail investors to own blue-chip artworks.", tags: ["Fractional Art", "RWA"], url: "https://artfi.world" },
  { name: "Suia", description: "Social NFT platform on Sui with creator profiles, community feeds, and on-chain social interactions.", tags: ["Social", "Creator Tools"], url: "https://suia.io" },
  { name: "PopRare", description: "Physical collectibles NFT platform on Sui bridging physical trading cards and toys to digital ownership.", tags: ["Physical + Digital", "Collectibles"], url: "https://poprare.com" },
  { name: "OriginByte", description: "NFT protocol and infrastructure layer for Sui providing composable NFT standards and marketplace primitives.", tags: ["NFT Protocol", "Infrastructure"], url: "https://originbyte.io" },
  { name: "Capsules Protocol", description: "Digital asset protocol providing reusable display standards, type-based ownership, and metadata frameworks on Sui.", tags: ["Protocol", "Standards"], url: "https://capsulecraft.dev" },
  { name: "LaunchMyNFT", description: "Zero-code NFT launchpad on Sui enabling artists to create, mint, and sell NFT collections without technical knowledge.", tags: ["Launchpad", "No-code"], url: "https://launchmynft.io" },
  { name: "Dragon SUI", description: "Community-driven generative NFT collection and GameFi ecosystem built natively on Sui blockchain.", tags: ["Generative", "GameFi"], url: "https://dragonsui.io" },
  { name: "OVERTAKE", description: "Racing NFT game on Sui where NFT cars compete, earn rewards, and can be upgraded with on-chain mechanics.", tags: ["Racing Game", "Play-to-Earn"], url: "https://overtake.gg" },
  { name: "Flame Protocol NFT", description: "NFT AMM swap protocol on Sui enabling instant NFT liquidity through automated market-making pools.", tags: ["NFT AMM", "Instant Liquidity"], url: "https://flame.finance" },
  { name: "Subber", description: "Subscription NFT marketplace on Sui enabling recurring revenue for creators through NFT-gated content.", tags: ["Subscriptions", "Creator Economy"], url: "https://subber.xyz" },
]

export default function NFTPage() {
  return (
    <main>
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-28 md:pt-36">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-6 text-center relative z-10">
          <RevealSection>
            <a href="/protocols" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Protocols</a>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Category</p>
            <h1 className="heading-hero">NFT Ecosystem on Sui</h1>
            <p className="text-subtitle mx-auto max-w-2xl">Marketplaces, launchpads, and NFT infrastructure built on Sui's object-centric model for true digital ownership.</p>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel text-sm">
              <span className="text-gradient font-bold text-xl">15+</span>
              <span className="text-muted-foreground">NFT Protocols Listed</span>
            </div>
          </RevealSection>
        </div>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={100}>
          <ProtocolGrid protocols={nftProtocols} />
        </RevealSection>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={200}>
          <div className="card-modern-blue p-10 text-center space-y-4 rounded-3xl">
            <h2 className="heading-section">Start Collecting on Sui</h2>
            <p className="text-subtitle">Explore collections and build your Sui NFT portfolio.</p>
            <a href="/protocols"><Button className="button-primary-modern">Explore More Protocols</Button></a>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
