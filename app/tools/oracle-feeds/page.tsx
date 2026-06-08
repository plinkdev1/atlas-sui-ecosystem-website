"use client"

import { Button } from "@/components/ui/button"
import { BarChart3, Bell, ArrowRight, Clock, Target, Radio, Gift, Database } from "lucide-react"
import { RevealSection } from "@/components/reveal-section"

const features = [
  { icon: Clock, title: "15-Second Refresh", description: "Price feeds update every 15 seconds for near real-time data." },
  { icon: Target, title: "Above/Below Alerts", description: "Set price alerts for any threshold on any supported asset." },
  { icon: Radio, title: "Wallet-Gated Notifications", description: "Connect your wallet to receive and manage alerts securely." },
  { icon: Database, title: "Multiple Assets", description: "Track SUI, BTC, ETH, SOL, USDC, USDT, and more." },
  { icon: BarChart3, title: "Pyth Network Powered", description: "Trusted price data from Pyth's network of institutional publishers." },
  { icon: Gift, title: "Earn Airpoints", description: "Receive Airpoints rewards for each price alert that triggers." },
]

const feeds = [
  { name: "SUI", symbol: "SUI/USD", color: "#4d9fff" },
  { name: "Bitcoin", symbol: "BTC/USD", color: "#f7931a" },
  { name: "Ethereum", symbol: "ETH/USD", color: "#9b87f5" },
  { name: "Solana", symbol: "SOL/USD", color: "#9945FF" },
  { name: "USD Coin", symbol: "USDC/USD", color: "#2B7FFF" },
  { name: "Tether", symbol: "USDT/USD", color: "#26a17b" },
]

const faqs = [
  {
    q: "What is Pyth Network?",
    a: "Pyth Network is a decentralised oracle that provides real-time price data to blockchain applications. Atlas uses Pyth for reliable, low-latency price feeds.",
  },
  {
    q: "How often do prices update?",
    a: "Prices update every 15 seconds — not minutes. This low latency gives you near real-time price information.",
  },
  {
    q: "How do price alerts work?",
    a: "Set a price threshold (above or below). When the live price crosses that threshold, you get notified. Alerts are wallet-gated for security.",
  },
  {
    q: "Is there a limit to alerts?",
    a: "No limit on the free tier. Set as many price alerts as you want for any supported assets.",
  },
  {
    q: "What happens after an alert triggers?",
    a: "You receive an instant notification. The alert remains active unless you manually disable it.",
  },
  {
    q: "Can I set alerts for multiple assets?",
    a: "Yes. Set individual alerts for different assets or multiple thresholds on the same asset.",
  },
]

export default function OracleFeedsPage() {
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
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Market Data</p>
            <h1 className="heading-hero">
              Oracle <span className="text-gradient">Feeds</span>
            </h1>
            <p className="text-subtitle mx-auto max-w-2xl">
              Real-time Pyth Network price feeds with a wallet-gated price alert system — know the moment prices
              hit your target.
            </p>

            {/* Live feed preview */}
            <div className="card-modern text-left max-w-lg mx-auto p-5 space-y-3 mt-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#00d4aa] pulse-dot" />
                <span className="text-xs font-medium text-[#00d4aa]">Live — updates every 15s</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {feeds.slice(0, 3).map((f) => (
                  <div key={f.symbol} className="text-center">
                    <p className="text-xs font-bold" style={{ color: f.color }}>{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.symbol}</p>
                  </div>
                ))}
              </div>
            </div>

            <a href="https://app.atlasprotocol.space/oracle-feeds" target="_blank" rel="noopener noreferrer">
              <Button className="btn-brand-gradient mt-2">
                View Live Feeds <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </RevealSection>
        </div>
      </section>

      {/* Live Feeds Grid */}
      <section className="section-default container-modern">
        <RevealSection className="space-y-8">
          <div className="text-center space-y-3">
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Coverage</p>
            <h2 className="heading-section">Live Price Feeds</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feeds.map((feed, idx) => (
              <RevealSection key={feed.symbol} delay={idx * 60}>
                <div className="card-modern flex items-center gap-4 p-5">
                  <div
                    className="icon-badge"
                    style={{
                      background: `${feed.color}18`,
                      border: `1px solid ${feed.color}30`,
                      width: "3rem",
                      height: "3rem",
                    }}
                  >
                    <span className="text-xs font-bold" style={{ color: feed.color }}>
                      {feed.name.slice(0, 3).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{feed.name}</p>
                    <p className="text-xs font-medium" style={{ color: feed.color }}>{feed.symbol}</p>
                    <p className="text-xs text-muted-foreground">Live · 15s refresh</p>
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

      {/* FAQ */}
      <section className="section-default container-medium">
        <RevealSection className="space-y-8">
          <div className="text-center space-y-3">
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Support</p>
            <h2 className="heading-section">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((item) => (
              <div key={item.q} className="card-modern p-6 space-y-2">
                <h3 className="font-semibold text-foreground">{item.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* CTA */}
      <section className="section-orange-cta py-24">
        <div className="container-modern relative z-10">
          <RevealSection className="text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="heading-section" style={{ color: "white" }}>
              Monitor Live Prices
            </h2>
            <p className="text-subtitle" style={{ color: "rgba(255,255,255,0.8)" }}>
              Set alerts and stay informed with real-time Pyth Network price feeds.
            </p>
            <a href="https://app.atlasprotocol.space/oracle-feeds" target="_blank" rel="noopener noreferrer">
              <Button className="btn-brand-gradient mt-2">
                View Live Feeds <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </RevealSection>
        </div>
      </section>
    </main>
  )
}
