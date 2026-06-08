import Link from "next/link"
import { CheckCircle2, Database, Zap, Code, BarChart3, Settings, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RevealSection } from "@/components/reveal-section"

const phases = [
  {
    icon: Database,
    title: "Phase 1: Database & Infrastructure",
    subtitle: "15 Supabase tables, 40+ indexes, RLS policies, comprehensive schema",
    items: [
      "User profiles & wallet management (3 tables)",
      "Provider listings & management (2 tables)",
      "API key management & rate limiting (2 tables)",
      "Usage tracking & analytics (3 tables)",
      "Entitlements & payments (1 table)",
      "Revenue tracking & moderation logs (2 tables)",
      "47 RLS policies enforcing security & data isolation",
      "40+ indexes for query optimization",
    ],
  },
  {
    icon: Code,
    title: "Phase 2: Backend APIs",
    subtitle: "30+ production-ready endpoints with auth, validation, and error handling",
    groups: [
      { title: "Authentication (6)", items: ["Register with wallet", "Login with signature", "Get authenticated user", "Update user profile", "Logout/session invalidation", "JWT token validation"] },
      { title: "Provider Management (8)", items: ["Search providers with pagination", "Get provider details & stats", "Create/update/delete listings", "Provider's own listings view", "Upload provider logos", "Rate & review providers", "Filter by category/status", "Export provider registry"] },
      { title: "Entitlements & Payments (5)", items: ["Get pricing tiers", "Create purchase transactions", "Get user entitlements", "Track usage per entitlement", "Cancel entitlements"] },
      { title: "Usage Tracking (4)", items: ["Track API requests", "Get quota status", "Historical analytics", "Usage by endpoint"] },
      { title: "Admin/Moderation (7)", items: ["List pending approvals", "Approve/reject listings", "Feature providers", "Delete listings", "Audit trail logs", "Platform analytics", "Password-protected access"] },
      { title: "API Keys (5)", items: ["Generate secure API keys", "List user keys", "Update rate limits", "Revoke keys", "Key usage analytics"] },
    ],
  },
  {
    icon: Zap,
    title: "Phase 3: Services & Revenue",
    subtitle: "Move smart contracts, Cetus SDK integration, pricing tiers, payment processing",
    items: [
      "Move smart contracts for Sui testnet (payments, tiers, entitlements)",
      "Fee splitting: 20% Atlas, 80% Provider (on-chain)",
      "Cetus SDK integration (swap, stake, pools, APR)",
      "Multi-tier pricing model (Starter / Growth / Pro / Enterprise)",
      "Revenue tracking with analytics dashboard",
    ],
  },
  {
    icon: Settings,
    title: "Core Modules",
    subtitle: "All three modules functional with real data fetching and backend integration",
    modules: [
      { label: "Wallet Cleanup", pct: 85, desc: "Real NFT/token fetching, Blockberry scam detection, bulk hide/burn, community voting, 11+ wallets" },
      { label: "Transaction Explainer", pct: 80, desc: "Real testnet digest fetching, security flags, balance tracking, transfer visualization, JSON export" },
      { label: "Infra Discovery", pct: 75, desc: "50+ providers, advanced search/filter, provider dashboards, admin moderation, payments, JSON export" },
    ],
  },
  {
    icon: BarChart3,
    title: "Multi-Network Support",
    subtitle: "Full support for all Sui networks with proper RPC configuration",
    networks: ["Sui Mainnet", "Sui Testnet", "Sui Devnet"],
  },
]

export default function RFPDeliverablesPage() {
  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-24 md:pt-32">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <RevealSection>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Project Report</p>
            <h1 className="heading-hero">RFP Deliverables</h1>
            <p className="text-subtitle max-w-2xl">Complete Implementation Status & Verification Report</p>
          </RevealSection>
        </div>
      </section>

      <section className="section-default container-modern max-w-4xl space-y-8">
        {phases.map((phase, i) => (
          <RevealSection key={phase.title} delay={i * 80}>
            <div className="card-modern p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="icon-badge w-12 h-12">
                  <phase.icon className="h-5 w-5 text-[#2B7FFF]" />
                </div>
                <div>
                  <h2 className="heading-section">{phase.title}</h2>
                  <p className="text-body text-sm">{phase.subtitle}</p>
                </div>
              </div>

              {/* List items */}
              {"items" in phase && phase.items && (
                <ul className="space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-[#00d4aa] shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* API groups */}
              {"groups" in phase && phase.groups && (
                <div className="grid md:grid-cols-2 gap-4">
                  {phase.groups.map((g) => (
                    <div key={g.title} className="bg-background/60 rounded-xl p-4 border border-[rgba(43,127,255,0.1)] space-y-2">
                      <h3 className="font-semibold text-foreground text-sm">{g.title}</h3>
                      <ul className="space-y-1">
                        {g.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="h-3 w-3 text-[#00d4aa] shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Progress modules */}
              {"modules" in phase && phase.modules && (
                <div className="space-y-4">
                  {phase.modules.map((m) => (
                    <div key={m.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground text-sm">{m.label}</span>
                        <span className="text-xs text-[#2B7FFF] font-bold">{m.pct}%</span>
                      </div>
                      <div className="h-2 bg-background/60 rounded-full border border-[rgba(43,127,255,0.1)] overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#2B7FFF] to-[#00d4aa] rounded-full" style={{ width: `${m.pct}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Networks */}
              {"networks" in phase && phase.networks && (
                <div className="grid grid-cols-3 gap-3">
                  {phase.networks.map((n) => (
                    <div key={n} className="bg-background/60 rounded-xl p-4 border border-[rgba(43,127,255,0.1)] text-center">
                      <div className="w-2 h-2 rounded-full bg-[#00d4aa] mx-auto mb-2 pulse-dot" />
                      <p className="font-semibold text-foreground text-sm">{n}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </RevealSection>
        ))}

        {/* CTA */}
        <RevealSection delay={500}>
          <div className="card-modern-blue p-12 text-center space-y-6 rounded-3xl">
            <h2 className="heading-section">Start Using Atlas Protocol</h2>
            <p className="text-subtitle">All components tested, verified, and production-ready.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/docs"><Button className="button-primary-modern">View Documentation</Button></Link>
              <Link href="/about"><Button className="button-secondary-modern">About Project</Button></Link>
            </div>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
