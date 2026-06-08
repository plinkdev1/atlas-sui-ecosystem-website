"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield, TrendingUp, Send, Lock, BarChart3 } from "lucide-react"
import { RevealSection } from "@/components/reveal-section"

const tools = [
  {
    id: "wallet-cleanup",
    name: "Wallet Cleanup",
    eyebrow: "Portfolio Tools",
    description: "AI-powered spam detection, token organisation, and portfolio management for your Sui wallet.",
    icon: Zap,
    color: "#00d4aa",
    features: [
      "Auto-detect spam tokens and scam assets",
      "Burn unwanted tokens safely via PTB",
      "Community-voted spam classifications",
      "Dust consolidation tools",
      "Earn Airpoints per cleanup",
    ],
    href: "/tools/wallet-cleanup",
    appHref: "https://app.atlasprotocol.space/wallet-cleanup",
  },
  {
    id: "transaction-explainer",
    name: "Transaction Explainer",
    eyebrow: "Security & Analysis",
    description: "Decode complex Sui transactions into plain English with AI-powered risk analysis.",
    icon: Shield,
    color: "#2B7FFF",
    features: [
      "Real-time Sui transaction decoding",
      "AI-powered plain English summaries",
      "Risk analysis and security flags",
      "Token flow visualisation",
      "Free tier + Pro analysis",
    ],
    href: "/tools/transaction-explainer",
    appHref: "https://app.atlasprotocol.space/tx-explainer",
  },
  {
    id: "swap",
    name: "Swap Aggregator",
    eyebrow: "DeFi Tools",
    description: "Multi-DEX swap aggregation finding the best routes across Sui's liquidity pools.",
    icon: TrendingUp,
    color: "#00d4aa",
    features: [
      "Best route finder across DEXes",
      "Price impact analysis",
      "Slippage protection controls",
      "Multi-DEX coverage (Cetus, DeepBook, Turbos)",
      "Earn Airpoints on every swap",
    ],
    href: "/tools/swap",
    appHref: "https://app.atlasprotocol.space/swap",
  },
  {
    id: "bridge",
    name: "Bridge Hub",
    eyebrow: "Cross-Chain",
    description: "Cross-chain bridging aggregation for seamless multi-chain asset transfers.",
    icon: Send,
    color: "#2B7FFF",
    features: [
      "Multi-bridge route comparison",
      "Supported: Sui, Ethereum, Base, Arbitrum, Optimism, Solana",
      "Protocol coverage (Wormhole, Squid, LayerZero)",
      "Real-time bridge status tracking",
      "Earn Airpoints on every bridge",
    ],
    href: "/tools/bridge",
    appHref: "https://app.atlasprotocol.space/bridge",
  },
  {
    id: "stake",
    name: "Stake Hub",
    eyebrow: "Staking",
    description: "Native Sui validator staking with live discovery and APR comparison.",
    icon: Lock,
    color: "#00d4aa",
    features: [
      "Real-time validator APR and uptime data",
      "Commission rate comparison",
      "One-click stake/unstake via PTB",
      "My Stakes portfolio dashboard",
      "Earn Airpoints on delegations",
    ],
    href: "/tools/stake",
    appHref: "https://app.atlasprotocol.space/stake",
  },
  {
    id: "oracle-feeds",
    name: "Oracle Feeds",
    eyebrow: "Market Data",
    description: "Real-time Pyth Network price feeds with a wallet-gated price alert system.",
    icon: BarChart3,
    color: "#2B7FFF",
    features: [
      "Live Pyth Network price feeds",
      "Coverage: SUI, BTC, ETH, SOL, USDC, and more",
      "Price alerts (above/below thresholds)",
      "Wallet-gated alert notifications",
      "Earn Airpoints per alert trigger",
    ],
    href: "/tools/oracle-feeds",
    appHref: "https://app.atlasprotocol.space/oracle-feeds",
  },
]

export default function ToolsHubPage() {
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
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">
              Atlas Protocol Suite
            </p>
            <h1 className="heading-hero">
              Every Tool You Need{" "}
              <span className="text-gradient">for Sui</span>
            </h1>
            <p className="text-subtitle mx-auto max-w-2xl">
              A complete suite of utilities for managing, analysing, and optimising your Sui experience. All tools
              available in the Atlas app.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <a href="https://app.atlasprotocol.space" target="_blank" rel="noopener noreferrer">
                <Button className="btn-brand-gradient">
                  Open App <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="section-default container-modern">
        <div className="space-y-16">
          {tools.map((tool, idx) => {
            const Icon = tool.icon
            const isEven = idx % 2 === 0

            return (
              <RevealSection key={tool.id} delay={idx * 60} className="grid md:grid-cols-2 gap-10 items-center">
                {isEven ? (
                  <>
                    {/* Content left */}
                    <div className="space-y-6">
                      <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">
                        {tool.eyebrow}
                      </p>
                      <h2 className="heading-section">{tool.name}</h2>
                      <p className="text-body">{tool.description}</p>
                      <ul className="space-y-3">
                        {tool.features.map((f, fi) => (
                          <li key={fi} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <span
                              className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: tool.color, marginTop: "0.45rem" }}
                            />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <a href={tool.appHref} target="_blank" rel="noopener noreferrer">
                          <Button className="button-primary-modern">Try Now</Button>
                        </a>
                        <a href={tool.href}>
                          <Button variant="outline" className="button-secondary-modern">
                            Learn More
                          </Button>
                        </a>
                      </div>
                    </div>
                    {/* Visual right */}
                    <div
                      className="card-modern flex items-center justify-center"
                      style={{ minHeight: "16rem" }}
                    >
                      <div className="text-center space-y-4">
                        <div
                          className="icon-badge mx-auto"
                          style={{
                            width: "4.5rem",
                            height: "4.5rem",
                            borderRadius: "1.25rem",
                            background: `linear-gradient(135deg, ${tool.color}28, ${tool.color}10)`,
                            border: `1px solid ${tool.color}30`,
                          }}
                        >
                          <Icon className="h-8 w-8" style={{ color: tool.color }} />
                        </div>
                        <p className="text-xs text-muted-foreground tracking-widest uppercase">{tool.name}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Visual left */}
                    <div
                      className="card-modern flex items-center justify-center order-last md:order-first"
                      style={{ minHeight: "16rem" }}
                    >
                      <div className="text-center space-y-4">
                        <div
                          className="icon-badge mx-auto"
                          style={{
                            width: "4.5rem",
                            height: "4.5rem",
                            borderRadius: "1.25rem",
                            background: `linear-gradient(135deg, ${tool.color}28, ${tool.color}10)`,
                            border: `1px solid ${tool.color}30`,
                          }}
                        >
                          <Icon className="h-8 w-8" style={{ color: tool.color }} />
                        </div>
                        <p className="text-xs text-muted-foreground tracking-widest uppercase">{tool.name}</p>
                      </div>
                    </div>
                    {/* Content right */}
                    <div className="space-y-6">
                      <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">
                        {tool.eyebrow}
                      </p>
                      <h2 className="heading-section">{tool.name}</h2>
                      <p className="text-body">{tool.description}</p>
                      <ul className="space-y-3">
                        {tool.features.map((f, fi) => (
                          <li key={fi} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <span
                              className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: tool.color, marginTop: "0.45rem" }}
                            />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <a href={tool.appHref} target="_blank" rel="noopener noreferrer">
                          <Button className="button-primary-modern">Try Now</Button>
                        </a>
                        <a href={tool.href}>
                          <Button variant="outline" className="button-secondary-modern">
                            Learn More
                          </Button>
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </RevealSection>
            )
          })}
        </div>
      </section>

      {/* Airpoints CTA */}
      <section className="section-orange-cta py-24">
        <div className="container-modern relative z-10">
          <RevealSection className="text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="heading-section" style={{ color: "white" }}>
              Earn Airpoints on Every Tool
            </h2>
            <p className="text-subtitle" style={{ color: "rgba(255,255,255,0.8)" }}>
              Use any Atlas tool and earn Airpoints rewards. The more you use, the more you earn. Track your balance
              and redeem in-app.
            </p>
            <a href="https://app.atlasprotocol.space" target="_blank" rel="noopener noreferrer">
              <Button className="btn-brand-gradient mt-2">
                Check Your Airpoints <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </RevealSection>
        </div>
      </section>
    </main>
  )
}
