"use client"

import { RevealSection } from "@/components/reveal-section"
import { ArrowRight, Wallet, TrendingUp, BarChart3, Bitcoin, Image as ImageIcon, Target, DollarSign, Gamepad2, Music, Database, Layers, Lock, Bot, Zap, ArrowLeftRight, Eye, Radio, Globe, HardDrive } from "lucide-react"

export default function ProtocolsHubPage() {
  const allCategories = [
    { name: "Wallets", href: "/protocols/wallets", icon: Wallet, count: 10, description: "Self-custody & enterprise wallets" },
    { name: "DEXes", href: "/protocols/dex", icon: ArrowLeftRight, count: 15, description: "AMM, CLMM, and orderbook DEXes" },
    { name: "Bridges", href: "/protocols/bridges", icon: Globe, count: 8, description: "Cross-chain token bridging" },
    { name: "Perps", href: "/protocols/perps", icon: TrendingUp, count: 6, description: "Perpetual futures trading" },
    { name: "Lending", href: "/protocols/lending", icon: DollarSign, count: 11, description: "Lending & borrowing protocols" },
    { name: "Oracles", href: "/protocols/oracles", icon: Eye, count: 7, description: "Price feeds & data oracles" },
    { name: "BTC Primitives", href: "/protocols/btc-primitives", icon: Bitcoin, count: 10, description: "Bitcoin-backed assets" },
    { name: "NFTs", href: "/protocols/nft", icon: ImageIcon, count: 12, description: "NFT marketplaces & standards" },
    { name: "Liquid Staking", href: "/protocols/liquid-staking", icon: TrendingUp, count: 12, description: "LSD & yield derivatives" },
    { name: "Gaming", href: "/protocols/gaming", icon: Gamepad2, count: 20, description: "GameFi & on-chain games" },
    { name: "SocialFi", href: "/protocols/socialfi", icon: Music, count: 12, description: "Social & community platforms" },
    { name: "DePIN", href: "/protocols/depin", icon: Radio, count: 8, description: "Decentralized infrastructure" },
    { name: "AI Agents", href: "/protocols/ai-agents", icon: Bot, count: 12, description: "AI-powered protocols" },
    { name: "RWA", href: "/protocols/rwa", icon: Layers, count: 10, description: "Real-world asset tokenization" },
    { name: "Identity", href: "/protocols/identity", icon: Lock, count: 10, description: "Decentralized identity & DNS" },
    { name: "Launchpads", href: "/protocols/launchpads", icon: Zap, count: 6, description: "IDO & INO platforms" },
    { name: "Storage", href: "/protocols/storage", icon: HardDrive, count: 10, description: "Decentralized storage" },
    { name: "Hardware Wallets", href: "/protocols/hardware-wallets", icon: Lock, count: 8, description: "Cold storage devices for Sui" },
    { name: "Prediction Markets", href: "/protocols/prediction-markets", icon: Target, count: 8, description: "Prediction & betting platforms" },
  ]

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div className="container-modern relative z-10 text-center space-y-6">
          <RevealSection>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa] mb-4">Protocol Directory</p>
            <h1 className="text-4xl md:text-6xl font-bold font-[var(--font-display)]">
              {'Everything Built on '}
              <span className="text-gradient">Sui</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4 leading-relaxed">
              Curated, verified, and explained. Explore the entire Sui protocol ecosystem organized across 19 categories.
            </p>
          </RevealSection>

          <RevealSection delay={200} className="glass-panel p-4 rounded-2xl inline-flex gap-6 sm:gap-8 items-center shimmer-bg">
            <div className="text-center">
              <div className="text-xl font-bold text-gradient">200+</div>
              <div className="text-xs text-muted-foreground">Protocols</div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <div className="text-xl font-bold text-gradient">19</div>
              <div className="text-xs text-muted-foreground">Categories</div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <div className="text-xl font-bold text-[#00d4aa]">Live</div>
              <div className="text-xs text-muted-foreground">Directory</div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section-default container-modern">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allCategories.map((cat, i) => {
            const Icon = cat.icon
            return (
              <RevealSection key={cat.name} delay={i * 30}>
                <a href={cat.href} className="block h-full">
                  <div className="glass-panel p-5 h-full flex flex-col gap-3 group rounded-xl">
                    <div className="flex items-start justify-between">
                      <Icon className="h-6 w-6 text-[#4d9fff] icon-glow group-hover:text-[#00d4aa] transition-colors" />
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#F97316]/15 text-[#F97316]">
                        {cat.count}+
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-foreground text-sm">{cat.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{cat.description}</p>
                    </div>
                    <div className="flex items-center text-[#4d9fff] font-semibold text-xs pt-2 border-t border-white/5 group-hover:text-[#00d4aa] transition-colors group-hover:gap-2 gap-1">
                      Explore <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </a>
              </RevealSection>
            )
          })}
        </div>
      </section>

      {/* Submit CTA */}
      <section className="py-16 relative overflow-hidden" style={{
        background: 'linear-gradient(180deg, rgba(249,115,22,0.85) 0%, rgba(60,25,0,0.9) 60%, #080d14 100%)'
      }}>
        <div className="container-modern text-center space-y-6 relative z-10">
          <RevealSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-[var(--font-display)]">Building on Sui?</h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto mt-4">Submit your protocol to be featured in the Atlas directory</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a href="/contact">
                <button className="bg-white text-[#080d14] font-bold rounded-full px-8 py-3 hover:bg-white/90 transition-all hover:-translate-y-1">
                  Submit Protocol <ArrowRight className="h-4 w-4 inline ml-1" />
                </button>
              </a>
              <a href="/docs">
                <button className="border border-white/30 text-white font-semibold rounded-full px-8 py-3 hover:bg-white/10 transition-all">
                  Integration Guide
                </button>
              </a>
            </div>
          </RevealSection>
        </div>
      </section>
    </main>
  )
}
