"use client"

import { ProtocolGrid, type Protocol } from "@/components/protocol-card"
import { Button } from "@/components/ui/button"
import { RevealSection } from "@/components/reveal-section"

const storage: Protocol[] = [
  { name: "Walrus", description: "Sui-native decentralized blob storage protocol using erasure coding for reliable, scalable, and cost-efficient on-chain data availability.", tags: ["Blob Storage", "Data Availability"], url: "https://walrus.xyz" },
  { name: "Seal (Sui Native)", description: "Sui's native decentralized secrets management and access control protocol for encrypted on-chain data storage.", tags: ["Secrets Management", "Encrypted Storage"], url: "https://docs.sui.io/concepts/cryptography/seal" },
  { name: "IPFS via Pinata", description: "InterPlanetary File System pinning service with Sui wallet integration for decentralized NFT and dApp asset storage.", tags: ["IPFS", "NFT Storage"], url: "https://pinata.cloud" },
  { name: "Arweave", description: "Permanent decentralized storage with Sui integration via ArDrive, enabling permanent on-chain data archiving for Sui dApps.", tags: ["Permanent Storage", "Archival"], url: "https://arweave.org" },
  { name: "KYVE Network", description: "Decentralized data lake protocol archiving and validating Sui blockchain data for analytics, indexing, and historical access.", tags: ["Data Archive", "Indexing"], url: "https://kyve.network" },
  { name: "Shinami RPC Storage", description: "High-performance RPC with persistent storage for Sui events, transactions, and object states via Shinami's infrastructure.", tags: ["RPC Storage", "Event Indexing"], url: "https://shinami.com" },
  { name: "NodeReal", description: "Enterprise-grade Sui node infrastructure with archival data access, enhanced RPC, and snapshot storage services.", tags: ["Enterprise", "Archival Nodes"], url: "https://nodereal.io" },
  { name: "Filebase", description: "S3-compatible decentralized storage gateway with Sui integration for IPFS, Arweave, and Filecoin pinning.", tags: ["S3-compatible", "Multi-chain Storage"], url: "https://filebase.com" },
  { name: "Irys (Bundlr on Sui)", description: "Programmable data storage platform enabling permanent, fast uploads to Arweave from Sui applications with SUI payments.", tags: ["Programmable Storage", "SUI Payments"], url: "https://irys.xyz" },
  { name: "4EVERLAND", description: "Decentralized cloud platform with IPFS and Arweave integration for hosting Sui dApp frontends and storing NFT metadata.", tags: ["dApp Hosting", "NFT Metadata"], url: "https://4everland.org" },
]

export default function StoragePage() {
  return (
    <main>
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-28 md:pt-36">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-6 text-center relative z-10">
          <RevealSection>
            <a href="/protocols" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Protocols</a>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Category</p>
            <h1 className="heading-hero">Storage & Data on Sui</h1>
            <p className="text-subtitle mx-auto max-w-2xl">Decentralized storage, data availability, and archival solutions for Sui dApps, NFTs, and on-chain data.</p>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel text-sm">
              <span className="text-gradient font-bold text-xl">10+</span>
              <span className="text-muted-foreground">Storage Protocols Listed</span>
            </div>
          </RevealSection>
        </div>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={100}>
          <ProtocolGrid protocols={storage} />
        </RevealSection>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={200}>
          <div className="card-modern-blue p-10 text-center space-y-4 rounded-3xl">
            <h2 className="heading-section">Store Data on Walrus</h2>
            <p className="text-subtitle">Walrus is Sui's native decentralized storage — the most integrated and recommended option for Sui developers.</p>
            <a href="https://walrus.xyz" target="_blank" rel="noopener noreferrer"><Button className="button-primary-modern">Explore Walrus</Button></a>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
