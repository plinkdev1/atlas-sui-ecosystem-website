"use client"

import { ProtocolGrid, type Protocol } from "@/components/protocol-card"
import { Button } from "@/components/ui/button"
import { RevealSection } from "@/components/reveal-section"

const socialfi: Protocol[] = [
  { name: "Releap Protocol", description: "Decentralized social audio platform on Sui enabling creators to tokenize podcasts and music with on-chain royalties.", tags: ["Social Audio", "Creator Economy"], url: "https://releap.io" },
  { name: "FanTV", description: "Creator-first Web3 social platform on Sui with fan tokens, exclusive content, and creator monetization tools.", tags: ["Fan Tokens", "Creator Platform"], url: "https://fantv.world" },
  { name: "Suia", description: "Social NFT and profile platform on Sui combining on-chain identity, NFT showcasing, and community discovery.", tags: ["Social NFT", "Profiles"], url: "https://suia.io" },
  { name: "ComingChat", description: "Social portal wallet combining AI assistant, encrypted messaging, DeFi, and NFT social features in one Sui app.", tags: ["Social Wallet", "Messaging"], url: "https://coming.chat" },
  { name: "Polymedia Chat", description: "Decentralized group chat protocol on Sui with on-chain message storage, permissionless rooms, and NFT gating.", tags: ["Group Chat", "Permissionless"], url: "https://polymedia.app/chat" },
  { name: "GiveRep", description: "On-chain reputation and endorsement protocol on Sui enabling users to give and receive reputation points.", tags: ["Reputation", "Endorsements"], url: "https://giverep.com" },
  { name: "Polymedia Profile", description: "Decentralized user profile protocol on Sui serving as a base identity layer for social dApps.", tags: ["Identity", "Base Layer"], url: "https://polymedia.app" },
  { name: "DAuth Network", description: "Decentralized authentication protocol on Sui enabling OAuth-like login with wallet-native privacy.", tags: ["Auth", "Privacy"], url: "https://dauth.network" },
  { name: "RECRD", description: "Short-form video social platform on Sui where creators own their content as NFTs and earn from views.", tags: ["Video", "Content NFTs"], url: "https://recrd.xyz" },
  { name: "SLOVE", description: "SocialFi dating and connection platform on Sui with reputation-staked profiles and token-incentivized matching.", tags: ["Dating", "Reputation Staking"], url: "https://slove.io" },
  { name: "Zesh AI Layer", description: "AI-powered social layer on Sui combining natural language bots, on-chain social graphs, and creator monetization.", tags: ["AI Social", "Social Graph"], url: "https://zesh.io" },
  { name: "Bluwhale", description: "AI-powered Web3 user data platform on Sui enabling on-chain insights, user segmentation, and social rewards.", tags: ["AI Analytics", "User Data"], url: "https://bluwhale.com" },
]

export default function SocialFiPage() {
  return (
    <main>
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-28 md:pt-36">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-6 text-center relative z-10">
          <RevealSection>
            <a href="/protocols" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Protocols</a>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Category</p>
            <h1 className="heading-hero">SocialFi on Sui</h1>
            <p className="text-subtitle mx-auto max-w-2xl">Social platforms, creator economies, and decentralized communities built natively on the Sui blockchain.</p>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel text-sm">
              <span className="text-gradient font-bold text-xl">12+</span>
              <span className="text-muted-foreground">SocialFi Protocols Listed</span>
            </div>
          </RevealSection>
        </div>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={100}>
          <ProtocolGrid protocols={socialfi} />
        </RevealSection>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={200}>
          <div className="card-modern-blue p-10 text-center space-y-4 rounded-3xl">
            <h2 className="heading-section">Building Social on Sui?</h2>
            <p className="text-subtitle">Submit your SocialFi project to be listed in the Atlas directory.</p>
            <a href="mailto:hello@atlasprotocol.space"><Button className="button-primary-modern">Submit Protocol</Button></a>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
