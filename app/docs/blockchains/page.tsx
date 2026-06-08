"use client"

import { useState } from "react"
import { PROTOCOL_LOGOS } from "@/lib/protocol-logos"
import { RevealSection } from "@/components/reveal-section"

function ChainLogo({ name, src, docsUrl }: { name: string; src: string; docsUrl: string }) {
  const domain = (() => { try { return new URL(docsUrl).hostname.replace("www.docs.", "").replace("docs.", "").replace("www.", "") } catch { return "" } })()
  const clearbit = domain ? `https://logo.clearbit.com/${domain}` : null
  const sources = [src, ...(clearbit ? [clearbit] : [])].filter(Boolean)
  const [idx, setIdx] = useState(0)
  const [failed, setFailed] = useState(false)
  if (failed) return (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4d9fff] to-[#1a3b8c] flex items-center justify-center text-white font-bold text-lg">{name[0]}</div>
  )
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={sources[idx]} alt={`${name} logo`} width={48} height={48} className="w-12 h-12 object-contain"
      onError={() => { if (idx + 1 < sources.length) setIdx(idx + 1); else setFailed(true) }} />
  )
}

export default function BlockchainsPage() {
  const blockchains = [
    {
      name: "Sui",
      logoUrl: PROTOCOL_LOGOS.sui,
      description: "Layer 1 blockchain enabling low-cost, high-speed transactions with the Move programming language.",
      docsUrl: "https://docs.sui.io",
      status: "Live" as const,
      networks: ["Mainnet", "Testnet", "Devnet"],
    },
    {
      name: "Aptos",
      logoUrl: PROTOCOL_LOGOS.aptos,
      description: "Move-based Layer 1 blockchain focused on scalability, safety, and reliability.",
      docsUrl: "https://aptos.dev/en/build/guides",
      status: "Coming Soon" as const,
      networks: ["Mainnet", "Testnet"],
    },
    {
      name: "Ethereum",
      logoUrl: PROTOCOL_LOGOS.ethereum,
      description: "The leading smart contract platform with massive ecosystem and DeFi liquidity.",
      docsUrl: "https://ethereum.org/en/developers/docs/",
      status: "Coming Soon" as const,
      networks: ["Mainnet", "Sepolia", "Base"],
    },
    {
      name: "Solana",
      logoUrl: PROTOCOL_LOGOS.solana,
      description: "High-performance blockchain optimized for throughput and cost-efficiency.",
      docsUrl: "https://solana.com/docs",
      status: "Coming Soon" as const,
      networks: ["Mainnet", "Devnet", "Testnet"],
    },
    {
      name: "Bitcoin",
      logoUrl: PROTOCOL_LOGOS.bitcoin,
      description: "The original blockchain with native Bitcoin support via bridges and primitives.",
      docsUrl: "https://developer.bitcoin.org/docs/",
      status: "Coming Soon" as const,
      networks: ["Mainnet", "Testnet"],
    },
    {
      name: "Polygon",
      logoUrl: PROTOCOL_LOGOS.polygon,
      description: "EVM-compatible Layer 2 scaling solution with strong ecosystem.",
      docsUrl: "https://polygon.technology/developers",
      status: "Coming Soon" as const,
      networks: ["Mainnet", "Mumbai Testnet"],
    },
  ]

  return (
    <main>
      <section className="section-gradient-blue relative">
        <div className="container-modern space-y-6 text-center">
          <RevealSection>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Reference</p>
            <h1 className="heading-hero">Blockchain Resources</h1>
            <p className="text-subtitle mx-auto max-w-2xl">
              Official documentation and developer resources for all supported blockchains. Each blockchain has unique features, tools, and developer ecosystems.
            </p>
          </RevealSection>
        </div>
      </section>

      <section className="section-default container-modern">
        <div className="grid md:grid-cols-2 gap-6">
          {blockchains.map((blockchain, i) => (
            <RevealSection key={blockchain.name} delay={i * 70}>
            <a
              href={blockchain.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group card-modern hover:border-primary/50 hover:shadow-lg transition-all block"
            >
              <div className="mb-4">
                <ChainLogo name={blockchain.name} src={blockchain.logoUrl} docsUrl={blockchain.docsUrl} />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                {blockchain.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">{blockchain.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {blockchain.networks.map((network) => (
                  <span key={network} className="px-2 py-1 text-xs rounded bg-primary/10 text-primary">
                    {network}
                  </span>
                ))}
              </div>
              <div
                className={`inline-flex items-center gap-2 text-sm font-medium ${
                  blockchain.status === "Live" ? "text-green-500" : "text-yellow-500"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${blockchain.status === "Live" ? "bg-green-500" : "bg-yellow-500"}`}
                ></span>
                {blockchain.status}
              </div>
            </a>
            </RevealSection>
          ))}
        </div>
      </section>

      <section className="section-default container-modern">
        <RevealSection>
        <div className="card-modern-blue p-8">
          <h2 className="heading-section mb-4">Getting Help</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              Each blockchain has a vibrant developer community. Visit their official documentation sites above to access tutorials, API references, and community forums.
            </p>
            <p>
              For Atlas Protocol-specific questions about multi-chain support, reach out to our team through the contact page or Discord community.
            </p>
          </div>
        </div>
        </RevealSection>
      </section>
    </main>
  )
}
