"use client"

import { Button } from "@/components/ui/button"
import { Zap, CheckCircle, Trash2, Shield, Star, Gift, ArrowRight } from "lucide-react"
import { RevealSection } from "@/components/reveal-section"

const features = [
  { icon: Zap, title: "AI Spam Detection", description: "Machine learning identifies suspicious tokens and scam assets in your portfolio." },
  { icon: CheckCircle, title: "Community Voting", description: "Help classify tokens and contribute to the community-verified spam database." },
  { icon: Trash2, title: "Safe Token Burning", description: "Burn unwanted tokens securely using Sui Programmable Transaction Blocks." },
  { icon: Shield, title: "Dust Consolidation", description: "Aggregate low-value tokens and clean up your portfolio in one transaction." },
  { icon: Star, title: "NFT Management", description: "Identify suspicious NFTs and organise your digital collectibles." },
  { icon: Gift, title: "Earn Airpoints", description: "Get rewarded with Airpoints for each cleanup operation you perform." },
]

const faqs = [
  {
    q: "Is burning tokens safe?",
    a: "Yes. Wallet Cleanup uses Sui Programmable Transaction Blocks (PTBs) to execute burns safely. You review and approve each transaction before it executes.",
  },
  {
    q: "What does burning a token mean?",
    a: "Burning sends your tokens to a dead address (0x0000...) where they can never be recovered. This permanently removes them from your wallet.",
  },
  {
    q: "How does spam detection work?",
    a: "Our AI analyses token metadata, transaction patterns, and community reports to identify suspicious or scam tokens. Community voting helps improve accuracy over time.",
  },
  {
    q: "Can I recover tokens after burning?",
    a: "No. Once burned, tokens are gone forever. Wallet Cleanup shows you a clear preview before burning — always review carefully.",
  },
  {
    q: "How do I earn Airpoints?",
    a: "You earn Airpoints for each cleanup operation. More tokens cleaned up = more Airpoints earned. Check your balance in the app.",
  },
  {
    q: "Is my wallet data private?",
    a: "Yes. Wallet Cleanup analyses only your public wallet address. Your private keys never leave your device.",
  },
]

export default function WalletCleanupPage() {
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
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Portfolio Tools</p>
            <h1 className="heading-hero">
              <span className="text-gradient">Wallet Cleanup</span>
            </h1>
            <p className="text-subtitle mx-auto max-w-2xl">
              AI-powered spam detection, token organisation, and portfolio management for your Sui wallet.
            </p>
            <a href="https://app.atlasprotocol.space/wallet-cleanup" target="_blank" rel="noopener noreferrer">
              <Button className="btn-brand-gradient mt-2">
                Open Wallet Cleanup <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </RevealSection>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-8 border-y border-border/40">
        <div className="container-modern">
          <RevealSection className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Spam tokens flagged", value: "2.4M+" },
              { label: "Wallets cleaned", value: "18K+" },
              { label: "PTB burns executed", value: "340K+" },
              { label: "Airpoints distributed", value: "1.2M+" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-gradient font-[var(--font-display)]">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
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
              Wallet Cleanup helps you manage your Sui wallet portfolio by automatically detecting spam tokens, scam
              assets, and low-value dust. Clean up your wallet in seconds with AI-powered analysis and
              community-verified spam classifications.
            </p>
            <p className="text-body">
              Every cleanup operation is executed via Sui Programmable Transaction Blocks so you remain in full
              control — you preview and approve every action before anything is finalised.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Zap, label: "AI Detection", color: "#00d4aa" },
              { icon: CheckCircle, label: "Community DB", color: "#2B7FFF" },
              { icon: Trash2, label: "Safe Burns", color: "#00d4aa" },
              { icon: Shield, label: "Privacy-First", color: "#2B7FFF" },
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
              Clean Your Wallet Today
            </h2>
            <p className="text-subtitle" style={{ color: "rgba(255,255,255,0.8)" }}>
              Take control of your Sui portfolio and earn Airpoints while you clean.
            </p>
            <a href="https://app.atlasprotocol.space/wallet-cleanup" target="_blank" rel="noopener noreferrer">
              <Button className="btn-brand-gradient mt-2">
                Open Wallet Cleanup <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </RevealSection>
        </div>
      </section>
    </main>
  )
}
