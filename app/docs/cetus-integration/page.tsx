"use client"

import { ArrowLeft, Code2, Zap, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { RevealSection } from "@/components/reveal-section"

const swapFlow = [
  'User selects tokens and amount',
  '"Get Quote" fetches price from /api/cetus/swap-quote',
  'Quote validated against slippage tolerance',
  '"Swap" executes via /api/cetus/swap-execute',
  'Transaction signed and broadcast to Testnet',
]

const pools = [
  { pair: "SUI/USDC", apr: "12.5%" },
  { pair: "SUI/USDT", apr: "9.8%" },
  { pair: "USDC/USDT", apr: "3.2%" },
  { pair: "SUI/ETH", apr: "15.3%" },
]

const checklist = [
  "Wallet connects successfully",
  "SUI/USDC swap quote fetches",
  "Multi-pair swaps work (SUI/USDT, USDC/USDT, SUI/ETH)",
  "Insufficient balance error shows correctly",
  "Slippage tolerance validation works",
  "Pool APRs display correctly",
  "Stake transaction executes",
]

const nextSteps = [
  "Real multi-hop swap routing with optimal path finding",
  "Live APR data from Cetus pools",
  "Cetus Terminal embed as professional trading UI",
  "Advanced position management for LPs",
  "Real-time portfolio tracking",
]

export default function CetusIntegrationDocs() {
  const router = useRouter()

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-16 pb-12">
        <div className="max-w-4xl space-y-4">
          <RevealSection>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <p className="text-sm font-medium tracking-widest uppercase text-[#4d9fff]">Integration</p>
            <h1 className="text-4xl md:text-5xl font-bold font-[var(--font-display)]">
              Cetus SDK v2 <span className="text-gradient">Integration Guide</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Complete guide to using Cetus protocol for swaps, staking, and liquidity management on Sui Testnet.
            </p>
          </RevealSection>
        </div>
      </section>

      <div className="max-w-4xl space-y-8">
        {/* Overview */}
        <RevealSection>
          <div className="glass-panel rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="icon-badge"><Zap className="h-4 w-4 text-[#4d9fff]" /></div>
              <h2 className="text-xl font-bold text-foreground">Integration Overview</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Atlas Protocol integrates Cetus SDK v2 for decentralized swaps, liquidity pools, and yield farming on Sui. All features are tested on Sui Testnet.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { title: "Smart Router", desc: "Multi-hop routing with optimal path finding" },
                { title: "Pool APRs", desc: "Real-time liquidity pool yields" },
                { title: "Referrals", desc: "Atlas earns partner commission" },
              ].map((item) => (
                <div key={item.title} className="feature-card !flex-col !items-start">
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* Swap */}
        <RevealSection delay={80}>
          <div className="glass-panel rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="icon-badge"><Code2 className="h-4 w-4 text-[#4d9fff]" /></div>
              <h2 className="text-xl font-bold text-foreground">Swap Feature</h2>
            </div>
            <div className="docs-prose">
              <h3>Supported Trading Pairs</h3>
              <ul>
                <li>SUI/USDC</li>
                <li>SUI/USDT</li>
                <li>USDC/USDT</li>
                <li>SUI/ETH</li>
              </ul>
              <h3>Error Handling</h3>
              <ul>
                <li><strong>Insufficient Balance</strong> — validates wallet balance before swap</li>
                <li><strong>Slippage Exceeded</strong> — compares price impact against tolerance</li>
                <li><strong>Network Error</strong> — graceful retry with toast notifications</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Swap Flow</p>
              <ol className="space-y-2">
                {swapFlow.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2B7FFF]/15 text-[#4d9fff] text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </RevealSection>

        {/* Staking */}
        <RevealSection delay={120}>
          <div className="glass-panel rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="icon-badge"><TrendingUp className="h-4 w-4 text-[#00d4aa]" /></div>
              <h2 className="text-xl font-bold text-foreground">Staking & Liquidity</h2>
            </div>
            <p className="text-sm text-muted-foreground">Available Pools (with APR)</p>
            <div className="space-y-2">
              {pools.map((pool) => (
                <div key={pool.pair} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/10">
                  <span className="text-sm font-medium text-foreground">{pool.pair}</span>
                  <span className="text-sm font-bold text-[#00d4aa]">{pool.apr} APR</span>
                </div>
              ))}
            </div>
            <div className="docs-prose">
              <h3>Staking Flow</h3>
              <ol>
                <li>Select a pool from available options</li>
                <li>Enter stake amount (must have sufficient balance)</li>
                <li>Click "Stake" to create liquidity position</li>
                <li>Transaction is signed and executed on Testnet</li>
                <li>Earn APR rewards from trading fees</li>
              </ol>
            </div>
          </div>
        </RevealSection>

        {/* Testing checklist */}
        <RevealSection delay={160}>
          <div className="glass-panel rounded-2xl p-6 space-y-5">
            <h2 className="text-xl font-bold text-foreground">Testing on Sui Testnet</h2>
            <div className="docs-prose">
              <h3>Prerequisites</h3>
              <ul>
                <li>Testnet wallet with sufficient SUI</li>
                <li>Request testnet tokens via faucet</li>
                <li>Network set to Sui Testnet in wallet</li>
              </ul>
            </div>
            <p className="text-sm font-semibold text-foreground">Verification Checklist</p>
            <div className="space-y-2">
              {checklist.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground p-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00d4aa] flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* Next steps */}
        <RevealSection delay={200}>
          <div className="glass-panel rounded-2xl p-6 border border-[#4d9fff]/20 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Next Steps</h2>
            <p className="text-muted-foreground text-sm">
              Once Cetus SDK is fully integrated on the backend, the following features will be enabled:
            </p>
            <ul className="space-y-2">
              {nextSteps.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ArrowRight className="h-3.5 w-3.5 text-[#4d9fff] mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </RevealSection>

        <div className="pb-16">
          <button
            onClick={() => history.back()}
            className="inline-flex items-center gap-2 text-sm text-[#4d9fff] hover:text-[#00d4aa] transition-colors"
          >
            <ArrowRight className="h-3 w-3 rotate-180" /> Back to Docs
          </button>
        </div>
      </div>
    </main>
  )
}
