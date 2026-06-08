"use client"

import { Button } from "@/components/ui/button"
import { Shield, AlertCircle, Eye, ArrowRight, Cpu, Layers, GitMerge } from "lucide-react"
import { RevealSection } from "@/components/reveal-section"

const features = [
  { icon: Eye, title: "Real-Time Decoding", description: "Paste any Sui transaction digest and get an instant breakdown of every action." },
  { icon: Cpu, title: "AI Analysis (Pro)", description: "Advanced AI summarisation for complex multi-step transactions — free tier included." },
  { icon: AlertCircle, title: "Risk Flags", description: "Automatic detection of unusual patterns, suspicious contracts, and potential threats." },
  { icon: Layers, title: "Token Flow Viz", description: "Visual diagram showing which tokens moved, how much, and where they went." },
  { icon: GitMerge, title: "Vesting Detection", description: "Identify token vesting schedules, locked assets, and time-bound transactions." },
  { icon: Shield, title: "Free + Pro Tiers", description: "Basic decoding free forever. Pro tier brings unlimited AI analysis and priority processing." },
]

const faqs = [
  { q: "Is it free to use?", a: "Yes. Basic transaction decoding is completely free. Pro tier with AI analysis is coming soon." },
  { q: "How do I decode a transaction?", a: "Copy a Sui transaction digest (starts with 0x or a Base64 string), paste it into the tool, and click Decode. Results appear instantly." },
  { q: "What do risk flags mean?", a: "Risk flags alert you to unusual patterns like extremely high gas fees, suspicious token transfers, or unverified contract interactions." },
  { q: "Can I decode old transactions?", a: "Yes. You can decode any transaction on Sui Mainnet, Testnet, or Devnet as long as the transaction digest is valid." },
  { q: "What is the difference between Free and Pro?", a: "Free tier offers basic decoding. Pro tier adds AI-powered explanations, priority processing, and unlimited queries." },
  { q: "Is my transaction data private?", a: "Your transactions are public on the Sui blockchain. We do not store your queries or any personal data." },
]

export default function TransactionExplainerPage() {
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
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Security & Analysis</p>
            <h1 className="heading-hero">
              <span className="text-gradient">Transaction</span> Explainer
            </h1>
            <p className="text-subtitle mx-auto max-w-2xl">
              Decode complex Sui transactions into plain English with AI-powered analysis and risk assessment.
            </p>

            {/* Mock decoded card */}
            <div className="card-modern text-left max-w-lg mx-auto p-5 space-y-3 mt-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
                <span className="text-xs font-medium text-green-400">Decoded</span>
              </div>
              <p className="text-sm font-mono text-muted-foreground truncate">
                5JGH7XT23NoS5XWmsxS71LU7GgFCek5c...
              </p>
              <p className="text-sm font-semibold text-foreground">
                Transferred <span className="text-[#00d4aa]">12.5 SUI</span> to{" "}
                <span className="text-[#4d9fff]">0x3a12...f891</span>
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 text-xs rounded-full bg-green-400/10 text-green-400 border border-green-400/20">
                  Low Risk
                </span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-[#2B7FFF]/10 text-[#4d9fff] border border-[#2B7FFF]/20">
                  Gas: 0.0012 SUI
                </span>
              </div>
            </div>

            <a href="https://app.atlasprotocol.space/tx-explainer" target="_blank" rel="noopener noreferrer">
              <Button className="btn-brand-gradient mt-2">
                Decode a Transaction <ArrowRight className="ml-2 h-4 w-4" />
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
              Transaction Explainer transforms Sui transaction digests into human-readable explanations. No more
              decoding complex Move code — paste a transaction hash and get a clear breakdown of what happened, which
              tokens moved, and whether there are any security concerns.
            </p>
            <p className="text-body">
              Built for users and developers alike: use the free tier daily to verify transactions before signing, or
              enable Pro for deep AI-powered analysis of complex DeFi interactions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Shield, label: "Plain English", color: "#2B7FFF" },
              { icon: AlertCircle, label: "Risk Analysis", color: "#00d4aa" },
              { icon: Layers, label: "Token Flow", color: "#2B7FFF" },
              { icon: Cpu, label: "AI Pro", color: "#00d4aa" },
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
              Understand Your Transactions
            </h2>
            <p className="text-subtitle" style={{ color: "rgba(255,255,255,0.8)" }}>
              Paste a transaction digest and decode it instantly — no wallet required.
            </p>
            <a href="https://app.atlasprotocol.space/tx-explainer" target="_blank" rel="noopener noreferrer">
              <Button className="btn-brand-gradient mt-2">
                Decode a Transaction <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </RevealSection>
        </div>
      </section>
    </main>
  )
}
