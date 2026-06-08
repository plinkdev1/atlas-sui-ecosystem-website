"use client"

import { Button } from "@/components/ui/button"
import { Send, Globe, ArrowRight, Clock, BarChart2, History, Shield } from "lucide-react"
import { RevealSection } from "@/components/reveal-section"

const features = [
  { icon: BarChart2, title: "Route Comparison", description: "See fees, estimated times, and rates across multiple bridges side-by-side." },
  { icon: Clock, title: "Status Tracking", description: "Monitor your bridge transfer in real-time until it lands on the destination chain." },
  { icon: History, title: "Bridge History", description: "View all past transfers and their current status from your dashboard." },
  { icon: BarChart2, title: "Fee Estimation", description: "Know exact bridging costs before you confirm — no surprise fees." },
  { icon: Send, title: "Earn Airpoints", description: "Receive Airpoints rewards for every successful cross-chain bridge." },
  { icon: Shield, title: "Safe Execution", description: "Secure bridge execution via Sui Programmable Transactions." },
]

const chains = [
  { name: "Sui", abbr: "SUI", color: "#4d9fff" },
  { name: "Ethereum", abbr: "ETH", color: "#9b87f5" },
  { name: "Base", abbr: "BASE", color: "#2B7FFF" },
  { name: "Arbitrum", abbr: "ARB", color: "#00d4aa" },
  { name: "Optimism", abbr: "OP", color: "#f97316" },
  { name: "Solana", abbr: "SOL", color: "#9945FF" },
]

const protocols = [
  { name: "Wormhole", desc: "Cross-chain messaging protocol supporting most major chains" },
  { name: "Squid / Axelar", desc: "Interop protocol with native chain integration" },
  { name: "LayerZero", desc: "Omnichain interoperability protocol" },
  { name: "Sui Native Bridge", desc: "Native bridge for Sui-to-Ethereum transfers" },
]

export default function BridgePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 mesh-bg pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(43,127,255,0.18) 0%, transparent 60%)",
          }}
        />
        <div className="container-modern relative z-10">
          <RevealSection className="text-center space-y-6 max-w-3xl mx-auto">
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Cross-Chain</p>
            <h1 className="heading-hero">
              Bridge <span className="text-gradient">Hub</span>
            </h1>
            <p className="text-subtitle mx-auto max-w-2xl">
              Cross-chain bridging aggregation for seamless multi-chain asset transfers — compare routes, fees, and
              times before you bridge.
            </p>
            <a href="https://app.atlasprotocol.space/bridge" target="_blank" rel="noopener noreferrer">
              <Button className="btn-brand-gradient mt-2">
                Start Bridging <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </RevealSection>
        </div>
      </section>

      {/* Supported Chains */}
      <section className="section-default container-modern">
        <RevealSection className="space-y-8">
          <div className="text-center space-y-3">
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Networks</p>
            <h2 className="heading-section">Supported Chains</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {chains.map((chain, idx) => (
              <RevealSection key={chain.name} delay={idx * 60}>
                <div className="card-modern flex items-center gap-4 p-5">
                  <div
                    className="icon-badge"
                    style={{
                      background: `${chain.color}18`,
                      border: `1px solid ${chain.color}30`,
                      width: "3rem",
                      height: "3rem",
                    }}
                  >
                    <span className="text-xs font-bold" style={{ color: chain.color }}>
                      {chain.abbr.slice(0, 3)}
                    </span>
                  </div>
                  <p className="font-semibold text-foreground">{chain.name}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* Bridge Protocols */}
      <section className="section-default container-modern">
        <RevealSection className="space-y-8">
          <div className="text-center space-y-3">
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Infrastructure</p>
            <h2 className="heading-section">Bridge Protocols</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {protocols.map((protocol, idx) => (
              <RevealSection key={protocol.name} delay={idx * 80}>
                <div className="feature-card h-full">
                  <div className="icon-badge flex-shrink-0">
                    <Globe className="h-5 w-5 text-[#2B7FFF]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{protocol.name}</h3>
                    <p className="text-sm text-muted-foreground">{protocol.desc}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* Key Features */}
      <section className="section-default container-modern">
        <RevealSection className="space-y-8">
          <div className="text-center space-y-3">
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Capabilities</p>
            <h2 className="heading-section">Key Features</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, description }, idx) => (
              <RevealSection key={title} delay={idx * 60}>
                <div className="feature-card h-full">
                  <div className="icon-badge flex-shrink-0">
                    <Icon className="h-5 w-5 text-[#2B7FFF]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* CTA */}
      <section className="section-orange-cta py-24">
        <div className="container-modern relative z-10">
          <RevealSection className="text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="heading-section" style={{ color: "white" }}>
              Bridge Your Assets
            </h2>
            <p className="text-subtitle" style={{ color: "rgba(255,255,255,0.8)" }}>
              Transfer assets across chains securely and earn Airpoints on every bridge.
            </p>
            <a href="https://app.atlasprotocol.space/bridge" target="_blank" rel="noopener noreferrer">
              <Button className="btn-brand-gradient mt-2">
                Start Bridging <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </RevealSection>
        </div>
      </section>
    </main>
  )
}
