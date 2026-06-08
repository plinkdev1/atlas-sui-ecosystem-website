"use client"

import { ProtocolGrid, type Protocol } from "@/components/protocol-card"
import { Button } from "@/components/ui/button"
import { RevealSection } from "@/components/reveal-section"

const aiAgents: Protocol[] = [
  { name: "Atoma Network", description: "Decentralized AI inference network on Sui. Run AI models on-chain with verifiable computation and token incentives for nodes.", tags: ["AI Inference", "Verifiable Compute"], url: "https://atoma.network" },
  { name: "SuiGPT", description: "AI-powered Sui ecosystem assistant providing natural language queries for on-chain data, contracts, and protocol info.", tags: ["AI Assistant", "On-chain Data"], url: "https://suigpt.tools" },
  { name: "Bluwhale", description: "AI user intelligence platform on Sui offering on-chain behavioral analytics, segmentation, and AI-driven marketing.", tags: ["AI Analytics", "User Intelligence"], url: "https://bluwhale.com" },
  { name: "Zesh AI", description: "AI social layer on Sui with autonomous agents, natural language DeFi interactions, and on-chain AI social graphs.", tags: ["AI Agents", "Social Layer"], url: "https://zesh.io" },
  { name: "Aftermath AI", description: "AI-powered DeFi routing and yield optimization on Aftermath Finance, using ML to find optimal trade paths.", tags: ["AI DeFi", "Yield Optimization"], logo: "https://assets.coingecko.com/coins/images/33046/small/aftermath.png", url: "https://aftermath.finance" },
  { name: "Recrd AI", description: "AI-powered content moderation and recommendation engine for the RECRD social video platform on Sui.", tags: ["Content AI", "Recommendations"], url: "https://recrd.xyz" },
  { name: "Move Agent Kit", description: "Open-source toolkit for building AI agents that interact natively with the Sui blockchain via Move smart contracts.", tags: ["Developer Toolkit", "Open Source"], url: "https://github.com/sui-foundation/move-agent-kit" },
  { name: "SentientAI", description: "Autonomous AI trading agents on Sui executing DeFi strategies 24/7 with risk-adjusted portfolio management.", tags: ["Trading Agents", "Autonomous DeFi"], url: "https://sentientai.xyz" },
  { name: "Ika Protocol", description: "Decentralized MPC threshold signing and AI-assisted key management infrastructure built natively on Sui.", tags: ["MPC", "AI Key Management"], url: "https://ika.xyz" },
  { name: "Nimbus Intelligence", description: "AI portfolio intelligence layer on Sui providing predictive analytics, risk scoring, and strategy recommendations.", tags: ["Portfolio AI", "Predictive Analytics"], url: "https://nimbus.land" },
  { name: "ChatSui", description: "Natural language interface for interacting with Sui DeFi protocols — swap, stake, and bridge with plain English.", tags: ["Natural Language", "DeFi Interface"], url: "https://chatsui.xyz" },
  { name: "Eliza on Sui", description: "Eliza AI agent framework deployment on Sui enabling autonomous on-chain agent interactions and DeFi execution.", tags: ["AI Framework", "Autonomous Agents"], url: "https://elizaos.github.io" },
]

export default function AIAgentsPage() {
  return (
    <main>
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-28 md:pt-36">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-6 text-center relative z-10">
          <RevealSection>
            <a href="/protocols" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Protocols</a>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Category</p>
            <h1 className="heading-hero">AI Agents on Sui</h1>
            <p className="text-subtitle mx-auto max-w-2xl">Autonomous agents, AI inference networks, and intelligent DeFi tools built on Sui's programmable architecture.</p>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel text-sm">
              <span className="text-gradient font-bold text-xl">12+</span>
              <span className="text-muted-foreground">AI Agent Protocols Listed</span>
            </div>
          </RevealSection>
        </div>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={100}>
          <ProtocolGrid protocols={aiAgents} />
        </RevealSection>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={200}>
          <div className="card-modern-blue p-10 text-center space-y-4 rounded-3xl">
            <h2 className="heading-section">Building AI on Sui?</h2>
            <p className="text-subtitle">The Move Agent Kit and Atoma Network make Sui the ideal chain for autonomous AI agent deployments.</p>
            <a href="https://github.com/sui-foundation/move-agent-kit" target="_blank" rel="noopener noreferrer"><Button className="button-primary-modern">Explore Move Agent Kit</Button></a>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
