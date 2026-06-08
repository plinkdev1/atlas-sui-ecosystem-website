"use client"

import { ProtocolGrid, type Protocol } from "@/components/protocol-card"
import { Button } from "@/components/ui/button"
import { RevealSection } from "@/components/reveal-section"

const depin: Protocol[] = [
  { name: "Walrus", description: "Decentralized storage and data availability protocol on Sui. Store and retrieve blobs with cryptographic guarantees at scale.", tags: ["Storage", "Data Availability"], url: "https://walrus.xyz" },
  { name: "Chirp", description: "Decentralized wireless network on Sui rewarding node operators for providing LoRaWAN connectivity globally.", tags: ["Wireless", "LoRaWAN"], url: "https://chirptoken.io" },
  { name: "Karrier One", description: "Decentralized telecom network on Sui enabling community-owned cellular infrastructure with token incentives.", tags: ["Telecom", "Cellular"], url: "https://karrierone.com" },
  { name: "Six Clovers", description: "DePIN protocol on Sui building decentralized geospatial data networks with location-verified contributions.", tags: ["Geospatial", "Location Data"], url: "https://sixclovers.com" },
  { name: "Nodeinfra", description: "Node infrastructure and RPC service provider on Sui, supporting validator operations and DePIN deployments.", tags: ["RPC", "Validator Infra"], url: "https://nodeinfra.com" },
  { name: "Notifi Network", description: "Decentralized notification and messaging infrastructure on Sui enabling on-chain alerts for dApps and users.", tags: ["Notifications", "Messaging"], url: "https://notifi.network" },
  { name: "Mentaport", description: "Physical location oracle and DePIN protocol providing verifiable geolocation data for Sui smart contracts.", tags: ["Geolocation", "Oracle"], url: "https://mentaport.xyz" },
  { name: "Sui DePIN Hub", description: "Community-run aggregator tracking all DePIN projects building on Sui with metrics and comparisons.", tags: ["Aggregator", "Community"], url: "https://sui.io/depin" },
]

export default function DePINPage() {
  return (
    <main>
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-28 md:pt-36">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-6 text-center relative z-10">
          <RevealSection>
            <a href="/protocols" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Protocols</a>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Category</p>
            <h1 className="heading-hero">DePIN on Sui</h1>
            <p className="text-subtitle mx-auto max-w-2xl">Decentralized Physical Infrastructure Networks — storage, wireless, telecom, and geospatial data built on Sui.</p>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel text-sm">
              <span className="text-gradient font-bold text-xl">8+</span>
              <span className="text-muted-foreground">DePIN Protocols Listed</span>
            </div>
          </RevealSection>
        </div>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={100}>
          <ProtocolGrid protocols={depin} />
        </RevealSection>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={200}>
          <div className="card-modern-blue p-10 text-center space-y-4 rounded-3xl">
            <h2 className="heading-section">Building Physical Infrastructure on Sui?</h2>
            <p className="text-subtitle">Submit your DePIN project to be featured in the Atlas directory.</p>
            <a href="mailto:hello@atlasprotocol.space"><Button className="button-primary-modern">Submit Protocol</Button></a>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
