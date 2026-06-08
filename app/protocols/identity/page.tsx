"use client"

import { ProtocolGrid, type Protocol } from "@/components/protocol-card"
import { Button } from "@/components/ui/button"
import { RevealSection } from "@/components/reveal-section"

const identity: Protocol[] = [
  { name: "zkLogin (Sui Native)", description: "Sui's native zero-knowledge login primitive enabling users to sign in with Google, Apple, or Facebook to create Sui wallets without seed phrases.", tags: ["zkLogin", "ZK Proof"], url: "https://docs.sui.io/concepts/cryptography/zklogin" },
  { name: "Suins (Sui Name Service)", description: "The official Sui Name Service. Register .sui domain names and use them as human-readable addresses across the ecosystem.", tags: ["Name Service", ".sui Domains"], url: "https://suins.io" },
  { name: "DAuth Network", description: "Decentralized OAuth-compatible authentication protocol on Sui providing privacy-preserving login for dApps.", tags: ["Decentralized Auth", "Privacy"], url: "https://dauth.network" },
  { name: "Polymedia Profile", description: "Open decentralized profile protocol on Sui serving as a composable identity layer for SocialFi and Web3 apps.", tags: ["Identity Layer", "Composable"], url: "https://polymedia.app" },
  { name: "GiveRep", description: "On-chain reputation scoring and peer endorsement protocol on Sui — establish credibility through verifiable on-chain activity.", tags: ["Reputation", "On-chain Score"], url: "https://giverep.com" },
  { name: "Worldcoin on Sui", description: "World ID proof-of-personhood integration with Sui enabling Sybil-resistant dApp access using biometric verification.", tags: ["Proof of Personhood", "Anti-Sybil"], url: "https://worldcoin.org" },
  { name: "Enoki (Shinami)", description: "Gasless transaction and identity abstraction layer by Shinami, enabling Web2-like onboarding with wallet abstraction on Sui.", tags: ["Gas Abstraction", "Onboarding"], url: "https://shinami.com/enoki" },
  { name: "Mysten zkSend", description: "Zero-knowledge link-based wallet sharing protocol by Mysten Labs enabling gasless asset transfers to non-Sui users.", tags: ["zkSend", "Gasless Transfers"], url: "https://zksend.com" },
  { name: "Capsules Protocol", description: "On-chain display and identity standards for Sui objects, providing unified metadata frameworks for NFTs and digital identities.", tags: ["Identity Standards", "Metadata"], url: "https://capsulecraft.dev" },
  { name: "KioskOwner (Sui Kiosk)", description: "Sui's native kiosk and ownership standard enabling programmable, policy-enforced digital asset ownership and transfer rules.", tags: ["Ownership Standard", "Policy Rules"], url: "https://docs.sui.io/standards/kiosk" },
]

export default function IdentityPage() {
  return (
    <main>
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-28 md:pt-36">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-6 text-center relative z-10">
          <RevealSection>
            <a href="/protocols" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Protocols</a>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Category</p>
            <h1 className="heading-hero">Identity & Auth on Sui</h1>
            <p className="text-subtitle mx-auto max-w-2xl">Name services, decentralized identity, zkLogin, and reputation protocols building the trust layer of the Sui ecosystem.</p>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel text-sm">
              <span className="text-gradient font-bold text-xl">10+</span>
              <span className="text-muted-foreground">Identity Protocols Listed</span>
            </div>
          </RevealSection>
        </div>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={100}>
          <ProtocolGrid protocols={identity} />
        </RevealSection>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={200}>
          <div className="card-modern-blue p-10 text-center space-y-4 rounded-3xl">
            <h2 className="heading-section">Register Your .sui Name</h2>
            <p className="text-subtitle">Claim your human-readable Sui address at SuiNS — the official Sui Name Service.</p>
            <a href="https://suins.io" target="_blank" rel="noopener noreferrer"><Button className="button-primary-modern">Go to SuiNS</Button></a>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
