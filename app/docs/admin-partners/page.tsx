import { Shield, Code2, Database, Rocket, ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { RevealSection } from "@/components/reveal-section"

const defaultPartners = [
  "Blockberry — Blockchain indexing",
  "Blockvision — Sui indexing",
  "Shinami — RPC provider",
  "Mysten Labs — Core Sui team",
  "OKX Wallet — Multi-chain wallet",
  "Nightly — Wallet provider",
  "Suiet — Sui wallet",
  "Aptos Labs — Multichain relevance",
]

const roadmap = [
  "Admin authentication and authorization",
  "CMS backend integration (Sanity, Strapi, Contentful)",
  "Partner application forms",
  "Analytics dashboard for ad impressions/clicks",
  "Verification workflow automation",
  "Dynamic pricing tiers management",
]

export default function AdminPartnersDocs() {
  return (
    <main>
      {/* Hero */}
      <section className="relative pt-16 pb-12">
        <div className="max-w-4xl space-y-4">
          <RevealSection>
            <p className="text-sm font-medium tracking-widest uppercase text-[#F97316]">Admin</p>
            <h1 className="text-4xl md:text-5xl font-bold font-[var(--font-display)]">
              Admin Partners <span className="text-gradient">System</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Development-mode interface for managing ecosystem partner listings and advertisements.
              A stub for future CMS integration.
            </p>
          </RevealSection>
        </div>
      </section>

      <div className="max-w-4xl space-y-8">
        {/* Access */}
        <RevealSection>
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="icon-badge"><Shield className="h-4 w-4 text-[#F97316]" /></div>
              <h2 className="text-xl font-bold text-foreground">Access</h2>
            </div>
            <p className="text-muted-foreground">
              Available at <code className="text-[#4d9fff] bg-[#4d9fff]/10 px-1.5 py-0.5 rounded text-sm">/admin/partners</code> in development mode. This page provides:
            </p>
            <ul className="space-y-2">
              {["Partner data table view", "JSON export and copy functionality", "Stub for future admin features"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-[#00d4aa] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/admin/partners"
              className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-full bg-[#F97316] text-white text-sm font-semibold hover:bg-[#F97316]/80 transition-colors">
              Open Admin Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </RevealSection>

        {/* Data Structure */}
        <RevealSection delay={80}>
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="icon-badge"><Code2 className="h-4 w-4 text-[#4d9fff]" /></div>
              <h2 className="text-xl font-bold text-foreground">Partner Data Structure</h2>
            </div>
            <div className="docs-prose">
              <pre><code>{`interface Partner {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  website: string;
  chains: string[];
  badge?: 'Verified Partner' | 'Sui Foundation Grantee' | 'Official Infra';
  featured: boolean;
  slotType: 'hero' | 'medium-rect' | 'leaderboard';
}`}</code></pre>
            </div>
          </div>
        </RevealSection>

        {/* Default partners + roadmap side by side */}
        <div className="grid sm:grid-cols-2 gap-6">
          <RevealSection delay={120}>
            <div className="glass-panel rounded-2xl p-6 space-y-4 h-full">
              <div className="flex items-center gap-3">
                <div className="icon-badge"><Database className="h-4 w-4 text-[#00d4aa]" /></div>
                <h2 className="text-lg font-bold text-foreground">Default Partners</h2>
              </div>
              <ul className="space-y-2">
                {defaultPartners.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] mt-2 flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </RevealSection>

          <RevealSection delay={160}>
            <div className="glass-panel rounded-2xl p-6 space-y-4 h-full">
              <div className="flex items-center gap-3">
                <div className="icon-badge"><Rocket className="h-4 w-4 text-[#F97316]" /></div>
                <h2 className="text-lg font-bold text-foreground">Roadmap</h2>
              </div>
              <ul className="space-y-2">
                {roadmap.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </RevealSection>
        </div>

        {/* JSON Import/Export */}
        <RevealSection delay={200}>
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">JSON Import / Export</h2>
            <p className="text-muted-foreground text-sm">
              Partners are currently stored in{" "}
              <code className="text-[#4d9fff] bg-[#4d9fff]/10 px-1.5 py-0.5 rounded text-xs">lib/partners-data.ts</code>. To update:
            </p>
            <ol className="space-y-2">
              {["Export JSON from admin panel", "Update the partners array in the source file", "Rebuild and deploy"].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2B7FFF]/15 text-[#4d9fff] text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="text-muted-foreground leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </RevealSection>

        <div className="pb-16">
          <Link href="/docs" className="inline-flex items-center gap-2 text-sm text-[#4d9fff] hover:text-[#00d4aa] transition-colors">
            <ArrowRight className="h-3 w-3 rotate-180" /> Back to Docs
          </Link>
        </div>
      </div>
    </main>
  )
}
