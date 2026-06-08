"use client"

import { Button } from "@/components/ui/button"
import { Lock, TrendingUp, ArrowRight, BarChart2, Star, Gift, RefreshCw } from "lucide-react"
import { RevealSection } from "@/components/reveal-section"

const features = [
  { icon: BarChart2, title: "Live Validator Data", description: "Real-time APR, uptime, and commission rates for every active Sui validator." },
  { icon: TrendingUp, title: "Commission Comparison", description: "Instantly find validators with the lowest fees and highest uptime." },
  { icon: Lock, title: "One-Click Staking", description: "Stake and unstake with a single Programmable Transaction Block." },
  { icon: Star, title: "My Stakes Dashboard", description: "Track all your delegations and pending rewards in one place." },
  { icon: RefreshCw, title: "Reward Tracking", description: "See pending and claimed rewards for each validator you delegate to." },
  { icon: Gift, title: "Earn Airpoints", description: "Receive Airpoints rewards for staking with Atlas." },
]

const concepts = [
  {
    title: "Validator Staking vs LP Pools",
    desc: "Validator staking directly delegates SUI to validators for rewards. LP staking means providing liquidity to DEX pools. Stake Hub focuses on validator staking.",
  },
  {
    title: "APR (Annual Percentage Rate)",
    desc: "Your annualised staking reward rate. Higher APR means higher potential returns, but always check validator uptime and reliability.",
  },
  {
    title: "Commission Rate",
    desc: "The percentage of staking rewards the validator keeps. Lower commission means more rewards flow directly to you.",
  },
  {
    title: "Unstaking",
    desc: "Unstaking withdraws your delegation after the current epoch ends. Rewards are finalised and sent to your wallet automatically.",
  },
]

export default function StakePage() {
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
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Staking</p>
            <h1 className="heading-hero">
              Stake <span className="text-gradient">Hub</span>
            </h1>
            <p className="text-subtitle mx-auto max-w-2xl">
              Native Sui validator staking with live discovery, APR comparison, and a personal rewards dashboard.
            </p>

            {/* Mock validator row */}
            <div className="card-modern text-left max-w-lg mx-auto p-5 space-y-3 mt-4">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Top Validator</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="icon-badge" style={{ background: "#00d4aa18", border: "1px solid #00d4aa30" }}>
                    <TrendingUp className="h-4 w-4 text-[#00d4aa]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">Mysten Labs Validator</p>
                    <p className="text-xs text-muted-foreground">Commission: 2%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#00d4aa] text-sm">APR 4.8%</p>
                  <p className="text-xs text-muted-foreground">Uptime 99.9%</p>
                </div>
              </div>
            </div>

            <a href="https://app.atlasprotocol.space/stake" target="_blank" rel="noopener noreferrer">
              <Button className="btn-brand-gradient mt-2">
                Start Staking <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </RevealSection>
        </div>
      </section>

      {/* Understanding staking */}
      <section className="section-default container-modern">
        <RevealSection className="space-y-8">
          <div className="text-center space-y-3">
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Education</p>
            <h2 className="heading-section">Understanding Sui Staking</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {concepts.map((item, idx) => (
              <RevealSection key={item.title} delay={idx * 80}>
                <div className="card-modern p-6 space-y-2 h-full">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
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
              Start Earning Staking Rewards
            </h2>
            <p className="text-subtitle" style={{ color: "rgba(255,255,255,0.8)" }}>
              Find the best validator and stake your SUI today — one click, full control.
            </p>
            <a href="https://app.atlasprotocol.space/stake" target="_blank" rel="noopener noreferrer">
              <Button className="btn-brand-gradient mt-2">
                Start Staking <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </RevealSection>
        </div>
      </section>
    </main>
  )
}
