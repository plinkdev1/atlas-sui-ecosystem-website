"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { RevealSection } from "@/components/reveal-section"

const GRAD_COLORS = [
  ["#00d4aa", "#1a6b5a"],
  ["#4d9fff", "#1a3b8c"],
  ["#F97316", "#7c3300"],
  ["#8b5cf6", "#3b1a7a"],
  ["#0ea5e9", "#0369a1"],
]

function ProviderLogo({ name, logo, url }: { name: string; logo: string; url: string }) {
  const domain = (() => { try { return new URL(url).hostname.replace("www.", "") } catch { return "" } })()
  const clearbit = domain ? `https://logo.clearbit.com/${domain}` : null
  const sources = [
    ...(logo && !logo.includes("sui.jpg") ? [logo] : []),
    ...(clearbit ? [clearbit] : []),
  ]
  const [idx, setIdx] = useState(0)
  const [failed, setFailed] = useState(false)
  const [from, to] = GRAD_COLORS[name.charCodeAt(0) % GRAD_COLORS.length]

  if (failed || sources.length === 0) {
    return (
      <div className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
        {name[0].toUpperCase()}
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sources[idx]}
      alt={`${name} logo`}
      width={36}
      height={36}
      className="h-9 w-9 rounded-full object-contain bg-white/5 shrink-0"
      onError={() => {
        if (idx + 1 < sources.length) setIdx(idx + 1)
        else setFailed(true)
      }}
    />
  )
}

export default function InfraDiscoveryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const handleStripeCheckout = async (tier: 'verified' | 'premium') => {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier, provider_id: null })
    })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  const categories = ["All", "RPC", "Validator", "Indexer", "Oracle", "DEX", "Bridge", "Analytics"]

  const providers = [
    { id: 1, name: "Shinami", category: "RPC", tier: "Premium", logo: "", description: "Enterprise-grade RPC and API platform with high-availability infrastructure", url: "https://shinami.io" },
    { id: 2, name: "QuickNode", category: "RPC", tier: "Verified", logo: "", description: "Fast, reliable RPC endpoints for Sui with advanced analytics", url: "https://quicknode.com" },
    { id: 3, name: "Ankr", category: "RPC", tier: "Verified", logo: "", description: "RPC infrastructure with load balancing across global nodes", url: "https://ankr.com" },
    { id: 4, name: "Figment", category: "RPC", tier: "Verified", logo: "", description: "Staking and API infrastructure services for Sui", url: "https://figment.io" },
    { id: 5, name: "GetBlock", category: "RPC", tier: "Verified", logo: "", description: "Reliable RPC nodes with real-time data updates", url: "https://getblock.io" },
    { id: 6, name: "Staked", category: "Validator", tier: "Premium", logo: "", description: "Enterprise validator operations and delegation services", url: "https://staked.us" },
    { id: 7, name: "Lido", category: "Validator", tier: "Premium", logo: "", description: "Liquid staking infrastructure and validator ecosystem", url: "https://lido.fi" },
    { id: 8, name: "Haedal", category: "Validator", tier: "Verified", logo: "", description: "Sui-native liquid staking and validator delegation", url: "https://haedal.xyz" },
    { id: 9, name: "GraphQL on Sui", category: "Indexer", tier: "Premium", logo: "", description: "Native GraphQL indexing service for Sui blockchain data", url: "https://graphql.sui.io" },
    { id: 10, name: "BlockVision", category: "Indexer", tier: "Verified", logo: "", description: "Real-time block, transaction, and NFT indexing for Sui", url: "https://blockvision.org" },
    { id: 11, name: "Pyth Network", category: "Oracle", tier: "Premium", logo: "", description: "High-fidelity price feeds with 500+ assets, sub-second latency", url: "https://pyth.network" },
    { id: 12, name: "Switchboard", category: "Oracle", tier: "Verified", logo: "", description: "Permissionless oracle network with custom data feeds", url: "https://switchboard.xyz" },
    { id: 13, name: "Supra Oracles", category: "Oracle", tier: "Verified", logo: "", description: "Cross-chain oracle layer with fast finality", url: "https://supraoracles.com" },
    { id: 14, name: "Stork Network", category: "Oracle", tier: "Verified", logo: "", description: "Publisher-specific signed data oracle", url: "https://stork.network" },
    { id: 15, name: "Cetus", category: "DEX", tier: "Premium", logo: "", description: "CLMM DEX protocol with concentrated liquidity pools", url: "https://cetus.zone" },
    { id: 16, name: "Kriya", category: "DEX", tier: "Verified", logo: "", description: "Fastest on-chain exchange with CEX-like UX", url: "https://kriya.finance" },
    { id: 17, name: "DeepBook", category: "DEX", tier: "Premium", logo: "", description: "Native on-chain orderbook DEX by Mysten Labs", url: "https://deepbook.tech" },
    { id: 18, name: "Wormhole", category: "Bridge", tier: "Premium", logo: "", description: "Open cross-chain messaging protocol connecting 30+ chains", url: "https://wormhole.com" },
    { id: 19, name: "Axelar", category: "Bridge", tier: "Verified", logo: "", description: "Decentralized interoperability platform", url: "https://axelar.network" },
    { id: 20, name: "LayerZero", category: "Bridge", tier: "Verified", logo: "", description: "Omnichain interoperability protocol", url: "https://layerzero.network" },
    { id: 21, name: "SuiVision", category: "Analytics", tier: "Verified", logo: "", description: "On-chain analytics and dashboards for Sui", url: "https://suivision.io" },
    { id: 22, name: "DefiLlama", category: "Analytics", tier: "Verified", logo: "", description: "Multi-chain DeFi analytics and TVL tracking", url: "https://defillama.com" },
    { id: 23, name: "Suiscan", category: "Analytics", tier: "Verified", logo: "", description: "Sui blockchain explorer with transaction analytics", url: "https://suiscan.xyz" },
  ]

  const filteredProviders = selectedCategory === "All" ? providers : providers.filter(p => p.category === selectedCategory)

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div className="container-modern relative z-10 text-center space-y-6">
          <RevealSection>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa] mb-4">Infrastructure</p>
            <h1 className="text-4xl md:text-6xl font-bold font-[var(--font-display)]">
              {'Discover Sui '}
              <span className="text-gradient">Infrastructure</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4 leading-relaxed">
              Browse 40+ verified infrastructure providers, integrations, and developer tools powering the Sui ecosystem
            </p>
          </RevealSection>

          <RevealSection delay={200} className="glass-panel p-4 rounded-2xl inline-flex gap-6 sm:gap-8 items-center shimmer-bg">
            <div className="text-center">
              <div className="text-xl font-bold text-gradient">40+</div>
              <div className="text-xs text-muted-foreground">Providers</div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <div className="text-xl font-bold text-gradient">8</div>
              <div className="text-xs text-muted-foreground">Categories</div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <div className="text-xl font-bold text-[#00d4aa]">100%</div>
              <div className="text-xs text-muted-foreground">Verified</div>
            </div>
          </RevealSection>

          <RevealSection delay={300} className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#providers">
              <button className="btn-brand-gradient">Browse Directory <ArrowRight className="h-4 w-4" /></button>
            </a>
            <a href="mailto:hello@atlasprotocol.space">
              <button className="glass-panel px-8 py-3 rounded-full text-foreground font-semibold hover:bg-white/5 text-sm">List Your Project</button>
            </a>
          </RevealSection>
        </div>
      </section>

      {/* Directory */}
      <section id="providers" className="section-default container-modern">
        <RevealSection className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-display)]">Infrastructure Directory</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Trusted providers powering the Sui ecosystem</p>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-[#00d4aa] to-[#4d9fff] text-[#080d14] font-bold shadow-lg"
                    : "glass-panel text-muted-foreground hover:text-foreground"
                }`}
                style={selectedCategory !== cat ? {transform: 'none'} : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        </RevealSection>

        {/* Provider Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {filteredProviders.map((provider) => (
            <RevealSection key={provider.id} delay={50}>
              <a href={provider.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                <div className="glass-panel p-6 rounded-xl h-full flex flex-col gap-4 group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <ProviderLogo name={provider.name} logo={provider.logo} url={provider.url} />
                      <div>
                        <h3 className="font-semibold text-foreground text-sm group-hover:text-[#4d9fff] transition-colors">{provider.name}</h3>
                        <p className="text-xs text-muted-foreground">{provider.category}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      provider.tier === "Premium"
                        ? "bg-[#F97316]/15 text-[#F97316]"
                        : "bg-[#4d9fff]/15 text-[#4d9fff]"
                    }`}>
                      {provider.tier}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground flex-grow">{provider.description}</p>
                  <div className="flex items-center gap-1 text-[#4d9fff] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity group-hover:gap-2">
                    Visit <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </a>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* Tier Comparison */}
      <section className="section-default container-modern">
        <RevealSection className="text-center space-y-4 mb-10">
          <h2 className="text-3xl font-bold font-[var(--font-display)]">Provider Tiers</h2>
        </RevealSection>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Explorer Free */}
          <RevealSection delay={100}>
            <div className="card-modern rounded-2xl p-8 h-full flex flex-col">
              <div className="text-xs font-bold px-3 py-1 rounded-full inline-block mb-4 bg-white/5 text-muted-foreground w-fit">Explorer</div>
              <p className="text-lg font-bold text-foreground mb-1">Free</p>
              <ul className="space-y-3 text-sm text-muted-foreground flex-grow">
                <li className="flex items-center gap-2">
                  <span className="text-[#00d4aa]">•</span> Basic listing
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00d4aa]">•</span> Category tags
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00d4aa]">•</span> Website link
                </li>
              </ul>
            </div>
          </RevealSection>

          {/* Verified */}
          <RevealSection delay={150}>
            <div className="card-modern rounded-2xl p-8 border-[#00d4aa]/30 h-full flex flex-col">
              <div className="text-xs font-bold px-3 py-1 rounded-full inline-block mb-4 bg-[#00d4aa]/15 text-[#00d4aa] w-fit">Verified</div>
              <p className="text-lg font-bold text-foreground mb-1">$49<span className="text-sm text-muted-foreground">/mo</span></p>
              <ul className="space-y-3 text-sm text-muted-foreground flex-grow">
                <li className="flex items-center gap-2">
                  <span className="text-[#00d4aa]">•</span> Everything in Free
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00d4aa]">•</span> Verified badge
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00d4aa]">•</span> Analytics dashboard
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00d4aa]">•</span> Priority support
                </li>
              </ul>
              <button
                onClick={() => handleStripeCheckout('verified')}
                className="button-primary-modern w-full mt-6"
              >
                Upgrade to Verified
              </button>
            </div>
          </RevealSection>

          {/* Premium */}
          <RevealSection delay={200}>
            <div className="card-modern-blue rounded-2xl p-8 ring-2 ring-[#2B7FFF]/30 h-full flex flex-col">
              <div className="text-xs font-bold px-3 py-1 rounded-full inline-block mb-4 bg-[#2B7FFF]/15 text-[#2B7FFF] w-fit">Premium</div>
              <p className="text-lg font-bold text-foreground mb-1">$149<span className="text-sm text-muted-foreground">/mo</span></p>
              <ul className="space-y-3 text-sm text-muted-foreground flex-grow">
                <li className="flex items-center gap-2">
                  <span className="text-[#2B7FFF]">•</span> Everything in Verified
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#2B7FFF]">•</span> Premium badge
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#2B7FFF]">•</span> Featured placement
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#2B7FFF]">•</span> Custom branding
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#2B7FFF]">•</span> API access
                </li>
              </ul>
              <button
                onClick={() => handleStripeCheckout('premium')}
                className="btn-brand-gradient w-full mt-6"
              >
                Upgrade to Premium
              </button>
              <a href="mailto:hello@atlasprotocol.space" className="text-sm text-[#2B7FFF] hover:underline block text-center mt-3">
                Or contact sales for custom plans
              </a>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Orange CTA */}
      <section className="py-20 relative overflow-hidden" style={{
        background: 'linear-gradient(180deg, rgba(249,115,22,0.9) 0%, rgba(60,25,0,0.95) 60%, #080d14 100%)'
      }}>
        <div className="container-modern text-center space-y-6 relative z-10">
          <RevealSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-[var(--font-display)]">Building Infrastructure for Sui?</h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto mt-4">Get listed and reach millions of Sui developers and users</p>
            <div className="mt-8">
              <a href="mailto:hello@atlasprotocol.space">
                <button className="bg-white text-[#080d14] font-bold rounded-full px-8 py-3 hover:bg-white/90 transition-all hover:-translate-y-1 shadow-lg">
                  Submit Your Provider <ArrowRight className="h-4 w-4 inline ml-1" />
                </button>
              </a>
            </div>
          </RevealSection>
        </div>
      </section>
    </main>
  )
}
