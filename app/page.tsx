"use client"

import { RevealSection } from "@/components/reveal-section"
import { PartnerMarquee } from "@/components/partner-marquee"
import { ThreeDCube } from "@/components/three-d-loaders"
import { ArrowRight, Zap, Shield, Rocket, Sparkles, Wallet, TrendingUp, BarChart3, Image as ImageIcon, Bitcoin, Bot, Lock, DollarSign, Gamepad2, Music, Database, ArrowLeftRight, Globe, Layers, Eye, Cpu, Gauge, Users, Code, Coins, Radio, BookOpen } from "lucide-react"

export default function HomePage() {
  const categories = [
    { name: "Wallets", icon: Wallet, href: "/protocols/wallets", count: 10 },
    { name: "DEXes", icon: ArrowLeftRight, href: "/protocols/dex", count: 15 },
    { name: "Bridges", icon: Globe, href: "/protocols/bridges", count: 8 },
    { name: "Perps", icon: TrendingUp, href: "/protocols/perps", count: 6 },
    { name: "Lending", icon: DollarSign, href: "/protocols/lending", count: 11 },
    { name: "Oracles", icon: Eye, href: "/protocols/oracles", count: 7 },
    { name: "NFTs", icon: ImageIcon, href: "/protocols/nft", count: 12 },
    { name: "Gaming", icon: Gamepad2, href: "/protocols/gaming", count: 20 },
    { name: "SocialFi", icon: Users, href: "/protocols/socialfi", count: 12 },
    { name: "DePIN", icon: Radio, href: "/protocols/depin", count: 8 },
    { name: "AI Agents", icon: Bot, href: "/protocols/ai-agents", count: 12 },
    { name: "Identity", icon: Lock, href: "/protocols/identity", count: 10 },
  ]

  const comingSoon = [
    { title: "Lend & Borrow", quarter: "Q2", progress: 60 },
    { title: "Liquidity Farming", quarter: "Q2", progress: 45 },
    { title: "Staking Dashboard", quarter: "Q2", progress: 50 },
    { title: "SuiNS Domains", quarter: "Q2", progress: 30 },
    { title: "BTC Primitives", quarter: "Q3", progress: 25 },
    { title: "Explorer Tools", quarter: "Q3", progress: 20 },
    { title: "NFT Aggregator", quarter: "Q3", progress: 15 },
    { title: "AI Decoder", quarter: "Q3", progress: 10 },
    { title: "Wallet Shield", quarter: "Q3", progress: 10 },
    { title: "GameFi Hub", quarter: "Q4", progress: 5 },
    { title: "Social Trading", quarter: "Q4", progress: 5 },
    { title: "Walrus Storage", quarter: "Q4", progress: 5 },
    { title: "SuiPlay Ecosystem", quarter: "Q4", progress: 3 },
    { title: "Multi-Chain View", quarter: "Q4+", progress: 2 },
  ]

  return (
    <main>
      {/* ===== SECTION 1: HERO ===== */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container-modern relative z-10">
          <RevealSection className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">The Sui Ecosystem Hub</p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] font-[var(--font-display)]">
                {'The Infrastructure & '}
                <span className="text-gradient">Security Hub</span>
                {' for Sui'}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Discover protocols, explore infrastructure, and access the tools you need to build, trade, and manage your assets on Sui.
              </p>
            </div>

            {/* Shimmer stat bar */}
            <div 
              className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row gap-6 sm:gap-0 justify-around items-center"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(77,159,255,0.15)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gradient">200+</div>
                <div className="text-sm text-muted-foreground mt-1">Protocols Listed</div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/10"></div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gradient">19</div>
                <div className="text-sm text-muted-foreground mt-1">Categories</div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/10"></div>
              <div className="text-center flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00d4aa] animate-pulse"></span>
                <div className="text-2xl md:text-3xl font-bold text-gradient">Live</div>
                <div className="text-sm text-muted-foreground mt-1 hidden sm:block">on Mainnet</div>
              </div>
            </div>

            {/* 3D Cube visual */}
            <div className="flex justify-center pt-4 pb-4 perspective" style={{ perspective: "1200px" }}>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <ThreeDCube />
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <a href="https://app.atlasprotocol.space" target="_blank" rel="noopener noreferrer">
                <button className="btn-brand-gradient text-base px-8 py-3">
                  Open App <ArrowRight className="h-4 w-4" />
                </button>
              </a>
              <a href="#roadmap">
              <button 
                className="glass-panel px-8 py-3 text-foreground font-semibold rounded-full hover:bg-white/5 text-base"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(77,159,255,0.15)",
                }}
              >
                View Roadmap
              </button>
              </a>
            </div>
          </RevealSection>
        </div>

        {/* 3D Wireframe Sphere background element */}
        <div className="absolute right-[5%] top-[15%] w-[300px] h-[300px] opacity-[0.12] pointer-events-none hidden" style={{perspective: '1000px'}} aria-hidden="true">
          <div className="w-full h-full relative sphere-3d">
            {[200, 180, 150, 120, 90, 60].map((size, i) => (
              <div key={i} className="absolute top-1/2 left-1/2 rounded-full border border-[#00d4aa]" style={{
                width: size, height: size, transform: `translate(-50%, -50%) rotateX(${i * 30}deg)`,
                boxShadow: '0 0 10px rgba(0,212,170,0.2)'
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: WHAT IS ATLAS ===== */}
      <section className="section-default container-modern">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <RevealSection className="space-y-6">
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">About</p>
            <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-display)]">What is Atlas Protocol?</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Atlas Protocol is the definitive knowledge, discovery, and entry portal for the Sui ecosystem. We are building the infrastructure layer that sits above everything Sui.
              </p>
              <p>
                A single place to discover, learn, and interact with protocols, tools, and services. From casual users to developers to enterprises.
              </p>
            </div>
            <a href="/infra-discovery">
              <button className="btn-brand-gradient">
                Explore Providers <ArrowRight className="h-4 w-4" />
              </button>
            </a>
          </RevealSection>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Shield, title: "Curated", desc: "Verified providers, vetted protocols", color: "#00d4aa" },
              { icon: Rocket, title: "Native on Sui", desc: "Built for performance and scale", color: "#4d9fff" },
              { icon: Zap, title: "User-Centric", desc: "Tools designed for real needs", color: "#00d4aa" },
              { icon: Sparkles, title: "Always Evolving", desc: "New tools every quarter", color: "#4d9fff" },
            ].map((card) => (
              <RevealSection key={card.title} delay={200} className="glass-panel p-5 rounded-xl">
                <card.icon className="h-7 w-7 mb-3 icon-glow" style={{ color: card.color }} />
                <h3 className="font-semibold text-foreground mb-1.5 text-sm">{card.title}</h3>
                <p className="text-xs text-muted-foreground">{card.desc}</p>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: AVAILABLE NOW ===== */}
      <section className="section-default container-modern">
        <RevealSection className="text-center space-y-4 mb-10">
          <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Tools</p>
          <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-display)]">Available Now</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Start exploring these live tools built on Sui</p>
        </RevealSection>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Transaction Explainer", desc: "Decode Sui transactions into human-readable format with security analysis.", badge: "LIVE", badgeColor: "#00d4aa", icon: Shield, href: "https://app.atlasprotocol.space/tx-explainer", external: true },
            { title: "Infrastructure Directory", desc: "Discover Sui infrastructure providers: RPCs, validators, oracles, and more.", badge: "LIVE", badgeColor: "#00d4aa", icon: Rocket, href: "/infra-discovery", external: false },
            { title: "Protocol Directory", desc: "Browse 200+ protocols across 19 categories on Sui.", badge: "BETA", badgeColor: "#4d9fff", icon: Layers, href: "/protocols", external: false },
          ].map((tool) => (
            <RevealSection key={tool.title} delay={100}>
              <a href={tool.href} target={tool.external ? "_blank" : undefined} rel={tool.external ? "noopener noreferrer" : undefined} className="block h-full">
                <div className="glass-panel p-8 h-full flex flex-col gap-4 group">
                  {/* Glow orb */}
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none" style={{background: `radial-gradient(circle, ${tool.badgeColor}, transparent)`}} />
                  <div className="flex items-center justify-between relative">
                    <tool.icon className="h-8 w-8 icon-glow" style={{color: tool.badgeColor}} />
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{background: `${tool.badgeColor}20`, border: `1px solid ${tool.badgeColor}40`, color: tool.badgeColor}}>
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground flex-grow">{tool.desc}</p>
                  <div className="flex items-center text-sm font-semibold group-hover:gap-3 gap-2 transition-all" style={{color: tool.badgeColor}}>
                    Open Tool <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </a>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ===== SECTION 4: WHY SUI ===== */}
      <section className="section-default container-modern">
        <RevealSection className="text-center space-y-4 mb-10">
          <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Technology</p>
          <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-display)]">Why Build on Sui?</h2>
        </RevealSection>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Cpu, title: "Parallel Execution", desc: "Process multiple transactions simultaneously" },
            { icon: Layers, title: "Object-Centric", desc: "Native asset ownership model for better UX" },
            { icon: Code, title: "Move Language", desc: "Secure smart contracts with resource safety" },
            { icon: Coins, title: "Stable Fees", desc: "Transactions cost fractions of a cent" },
            { icon: Lock, title: "On-Chain Identity", desc: "SuiNS domains and identity primitives" },
            { icon: Gauge, title: "Sub-Second Finality", desc: "Real-time interaction speeds" },
          ].map((card) => (
            <RevealSection key={card.title} delay={100} className="glass-panel p-6 rounded-xl">
              <card.icon className="h-6 w-6 text-[#00d4aa] mb-3 icon-glow" />
              <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.desc}</p>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ===== SECTION 5: ECOSYSTEM CATEGORIES ===== */}
      <section className="section-default container-modern">
        <RevealSection className="text-center space-y-4 mb-10">
          <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Ecosystem</p>
          <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-display)]">Sui Protocol Categories</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Explore 19+ categories of protocols in the Sui ecosystem</p>
        </RevealSection>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <RevealSection key={cat.name} delay={50}>
                <a href={cat.href} className="block">
                  <div className="glass-panel p-5 rounded-xl text-center group">
                    <Icon className="h-7 w-7 mx-auto mb-3 icon-glow text-[#4d9fff] group-hover:text-[#00d4aa] transition-colors" />
                    <p className="font-semibold text-foreground text-sm">{cat.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{cat.count}+ protocols</p>
                  </div>
                </a>
              </RevealSection>
            )
          })}
        </div>

        <RevealSection className="text-center mt-8">
          <a href="/protocols">
            <button className="glass-panel px-6 py-3 rounded-full text-sm font-semibold text-foreground hover:text-[#4d9fff] transition-colors">
              View All Categories <ArrowRight className="h-4 w-4 inline ml-1" />
            </button>
          </a>
        </RevealSection>
      </section>

      {/* ===== SECTION 6: COMING SOON ===== */}
      <section className="section-default container-modern">
        <RevealSection className="text-center space-y-4 mb-10">
          <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Roadmap</p>
          <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-display)]">{"What's Coming Soon"}</h2>
        </RevealSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comingSoon.map((item) => (
            <RevealSection key={item.title} delay={50} className="glass-panel p-5 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#4d9fff]/15 text-[#4d9fff]">{item.quarter}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full" style={{
                  width: `${item.progress}%`,
                  background: 'linear-gradient(90deg, #00d4aa, #4d9fff)'
                }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{item.progress}% complete</p>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ===== SECTION 7: ROADMAP TIMELINE ===== */}
      <section id="roadmap" className="section-default container-modern">
        <RevealSection className="text-center space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-display)]">Roadmap</h2>
        </RevealSection>

        <div className="relative roadmap-line">
          <div className="grid md:grid-cols-4 gap-4 relative z-10">
            {[
              { q: "Q1 2026", title: "Foundation", items: ["Hub landing page", "TX Explainer beta", "Infra directory"], done: true },
              { q: "Q2 2026", title: "Expansion", items: ["Wallet cleanup", "Lend & borrow", "Staking tools"] },
              { q: "Q3 2026", title: "Intelligence", items: ["Analytics suite", "GameFi hub", "SocialFi tools"] },
              { q: "Q4 2026", title: "Decentralization", items: ["Multichain support", "Advanced features", "Mainnet release"] },
            ].map((phase, i) => (
              <RevealSection key={phase.q} delay={i * 150} className="glass-panel p-6 rounded-xl">
                {/* Dot on the roadmap line */}
                <div className="w-6 h-6 rounded-full mb-4 flex items-center justify-center" style={{background: phase.done ? '#00d4aa' : 'rgba(77,159,255,0.3)'}}>
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <h3 className="font-bold text-[#4d9fff] mb-1">{phase.q}</h3>
                <h4 className="font-semibold text-foreground mb-3">{phase.title}</h4>
                <ul className="space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className={phase.done ? "text-[#00d4aa]" : "text-[#4d9fff]"}>{phase.done ? "+" : ">"}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 8: ORANGE GRADIENT CTA ===== */}
      <section className="py-20 md:py-28 relative overflow-hidden" style={{
        background: 'linear-gradient(180deg, rgba(249,115,22,0.9) 0%, rgba(60,25,0,0.95) 60%, #080d14 100%)'
      }}>
        <div className="container-modern relative z-10 text-center space-y-6">
          <RevealSection>
            <h2 className="text-3xl md:text-5xl font-bold text-white font-[var(--font-display)]">Start Exploring Atlas</h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mt-4">
              Access the tools and infrastructure you need to build, trade, and manage on Sui
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a href="https://app.atlasprotocol.space" target="_blank" rel="noopener noreferrer">
                <button className="bg-white text-[#080d14] font-bold rounded-full px-8 py-3 hover:bg-white/90 transition-all hover:-translate-y-1 shadow-lg">
                  Open Atlas <ArrowRight className="h-4 w-4 inline ml-1" />
                </button>
              </a>
              <a href="/protocols">
                <button className="border border-white/30 text-white font-semibold rounded-full px-8 py-3 hover:bg-white/10 transition-all">
                  Browse Protocols
                </button>
              </a>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ===== SECTION 9: PARTNER LOGO CAROUSEL ===== */}
      <PartnerMarquee />
    </main>
  )
}
