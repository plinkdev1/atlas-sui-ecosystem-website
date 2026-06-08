"use client"

import { Button } from "@/components/ui/button"
import { TrendingUp, Zap, ArrowRight, RefreshCw, SlidersHorizontal, GitCompare, Activity } from "lucide-react"
import { RevealSection } from "@/components/reveal-section"

const features = [
  { icon: TrendingUp, title: "Price Impact Analysis", description: "See exactly how much slippage you will experience before submitting." },
  { icon: SlidersHorizontal, title: "Slippage Control", description: "Set custom slippage tolerance and execute swaps with full confidence." },
  { icon: GitCompare, title: "Route Comparison", description: "Compare multiple swap routes side-by-side to choose the best one." },
  { icon: Activity, title: "Real-Time Prices", description: "Live price feeds from all supported DEXes, updated continuously." },
  { icon: Zap, title: "Earn Airpoints", description: "Get rewarded Airpoints for every successful swap you execute." },
  { icon: RefreshCw, title: "Transaction Preview", description: "Review the exact transaction details before confirming in your wallet." },
]

const dexes = [
  { name: "Cetus", type: "CLMM (Concentrated Liquidity)", desc: "Sui's most liquid concentrated liquidity DEX", color: "#00d4aa" },
  { name: "DeepBook", type: "Order Book", desc: "Native Sui order book protocol", color: "#2B7FFF" },
  { name: "Turbos Finance", type: "AMM", desc: "Automated market maker with multiple fee tiers", color: "#00d4aa" },
  { name: "Aftermath Finance", type: "AMM", desc: "Stable swap and farming platform", color: "#2B7FFF" },
]

export default function SwapPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 mesh-bg pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(0,212,170,0.15) 0%, transparent 60%)",
          }}
        />
        <div className="container-modern relative z-10">
          <RevealSection className="text-center space-y-6 max-w-3xl mx-auto">
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">DeFi Tools</p>
            <h1 className="heading-hero">
              Swap <span className="text-gradient">Aggregator</span>
            </h1>
            <p className="text-subtitle mx-auto max-w-2xl">
              Multi-DEX swap aggregation finding the best routes across Sui's liquidity pools — compare rates before
              you trade.
            </p>
            <a href="https://app.atlasprotocol.space/swap" target="_blank" rel="noopener noreferrer">
              <Button className="btn-brand-gradient mt-2">
                Start Swapping <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </RevealSection>
        </div>
      </section>

      {/* What it does */}
      <section className="section-default container-modern">
        <RevealSection className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Overview</p>
            <h2 className="heading-section">What It Does</h2>
            <p className="text-body">
              Swap Aggregator searches across all major Sui DEXes to find the best exchange rates for your token
              swaps. Save on slippage and fees by comparing routes before you trade.
            </p>
            <p className="text-body">
              Whether you are swapping SUI for USDC or routing through multiple pools for an exotic pair, the
              aggregator finds the optimal path automatically.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: TrendingUp, label: "Best Routes", color: "#00d4aa" },
              { icon: Zap, label: "Multi-DEX", color: "#2B7FFF" },
              { icon: SlidersHorizontal, label: "Slippage", color: "#00d4aa" },
              { icon: Activity, label: "Live Prices", color: "#2B7FFF" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="card-modern flex flex-col items-start gap-3 p-5">
                <div className="icon-badge" style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <p className="font-semibold text-sm text-foreground">{label}</p>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* Supported DEXes */}
      <section className="section-default container-modern">
        <RevealSection className="space-y-8">
          <div className="text-center space-y-3">
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Coverage</p>
            <h2 className="heading-section">Supported DEXes</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {dexes.map((dex, idx) => (
              <RevealSection key={dex.name} delay={idx * 80}>
                <div className="card-modern flex items-start gap-4 p-6">
                  <div
                    className="icon-badge flex-shrink-0"
                    style={{ background: `${dex.color}18`, border: `1px solid ${dex.color}28` }}
                  >
                    <span className="text-xs font-bold" style={{ color: dex.color }}>
                      {dex.name[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{dex.name}</h3>
                    <p className="text-xs font-medium mb-1" style={{ color: dex.color }}>{dex.type}</p>
                    <p className="text-sm text-muted-foreground">{dex.desc}</p>
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
              Get the Best Swap Rates
            </h2>
            <p className="text-subtitle" style={{ color: "rgba(255,255,255,0.8)" }}>
              Compare routes and execute swaps with confidence across all major Sui DEXes.
            </p>
            <a href="https://app.atlasprotocol.space/swap" target="_blank" rel="noopener noreferrer">
              <Button className="btn-brand-gradient mt-2">
                Start Swapping <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </RevealSection>
        </div>
      </section>
    </main>
  )
}
