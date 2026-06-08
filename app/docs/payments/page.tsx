import { CreditCard, Code2, BookOpen, CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { RevealSection } from "@/components/reveal-section"

export default function PaymentsDocumentation() {
  return (
    <main>
      {/* Hero */}
      <section className="relative pt-16 pb-12">
        <div className="max-w-4xl space-y-4">
          <RevealSection>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Payments</p>
            <h1 className="text-4xl md:text-5xl font-bold font-[var(--font-display)]">
              Onchain <span className="text-gradient">Payments Guide</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Integrate tier-based payments for infrastructure providers using SUI tokens and Supabase-backed entitlements.
            </p>
          </RevealSection>
        </div>
      </section>

      <div className="max-w-4xl space-y-10">
        {/* Flow overview */}
        <RevealSection>
          <div className="glass-panel rounded-2xl p-6 space-y-5">
            <h2 className="text-xl font-bold text-foreground">How It Works</h2>
            <p className="text-muted-foreground leading-relaxed">
              Atlas Protocol enables infrastructure providers to accept direct onchain payments for service tiers.
              Users purchase tier access using SUI tokens, with entitlements tracked on-chain and in the database.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { step: "1", title: "Select Tier", desc: "User chooses a pricing tier from provider cards" },
                { step: "2", title: "Sign Transaction", desc: "Wallet signs SUI transfer to treasury address" },
                { step: "3", title: "Store Entitlement", desc: "Entitlement recorded in Supabase with tx digest" },
              ].map((item) => (
                <div key={item.step} className="feature-card flex-col !items-start">
                  <div className="icon-badge mb-3">
                    <span className="text-sm font-bold text-[#4d9fff]">{item.step}</span>
                  </div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* Configuration */}
        <RevealSection delay={80}>
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Environment Variables</h2>
            <div className="space-y-3">
              {[
                { key: "NEXT_PUBLIC_PAYMENT_TREASURY", desc: "Sui address where payments are collected" },
                { key: "NEXT_PUBLIC_SUPABASE_URL", desc: "Supabase project URL for storing entitlements" },
                { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", desc: "Supabase anonymous key for client-side access" },
              ].map((env) => (
                <div key={env.key} className="docs-prose">
                  <div className="rounded-xl border border-border/50 p-4 bg-muted/10">
                    <code>{env.key}</code>
                    <p className="mt-1 !mb-0">{env.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* API Endpoints */}
        <RevealSection delay={120}>
          <div className="glass-panel rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="icon-badge"><Code2 className="h-4 w-4 text-[#4d9fff]" /></div>
              <h2 className="text-xl font-bold text-foreground">API Endpoints</h2>
            </div>

            <div className="space-y-6 docs-prose">
              <div>
                <h3>POST /api/entitlements</h3>
                <p>Store a new entitlement after successful payment.</p>
                <pre><code>{JSON.stringify({ user_id: "0x1234...", provider_id: "shinami-rpc", tier: "professional", transaction_digest: "0xabcd..." }, null, 2)}</code></pre>
              </div>
              <div>
                <h3>GET /api/entitlements</h3>
                <p>Retrieve user entitlements: <code>?user_id=0x1234...&provider_id=shinami-rpc</code></p>
                <pre><code>{JSON.stringify([{ id: "uuid", user_id: "0x1234...", provider_id: "shinami-rpc", tier: "professional", transaction_digest: "0xabcd...", purchased_at: "2026-01-12T12:00:00Z", expires_at: "2027-01-12T12:00:00Z", status: "active" }], null, 2)}</code></pre>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* DB Schema */}
        <RevealSection delay={160}>
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Database Schema</h2>
            <p className="text-muted-foreground text-sm">Migration: <code className="text-[#4d9fff] bg-[#4d9fff]/10 px-1.5 py-0.5 rounded text-xs">scripts/006_create_entitlements_table.sql</code></p>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                "id — UUID (primary key)",
                "user_id — TEXT (wallet address)",
                "provider_id — TEXT (provider identifier)",
                "tier — TEXT (tier name)",
                "transaction_digest — TEXT (payment tx hash)",
                "purchased_at — TIMESTAMP",
                "expires_at — TIMESTAMP (1 year)",
                "status — TEXT (active/expired/revoked)",
              ].map((field) => (
                <div key={field} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-[#00d4aa] mt-0.5 flex-shrink-0" />
                  <code className="text-foreground/80">{field}</code>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* Integration example */}
        <RevealSection delay={200}>
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="icon-badge"><BookOpen className="h-4 w-4 text-[#00d4aa]" /></div>
              <h2 className="text-xl font-bold text-foreground">Integration Flow</h2>
            </div>
            <ol className="space-y-2">
              {[
                "PurchaseTierModal opens showing available tiers",
                "User selects tier and clicks Purchase",
                "PTB is built with SUI transfer to treasury",
                "User signs transaction in connected wallet",
                "Transaction is executed and digest returned",
                "Entitlement is stored via POST /api/entitlements",
                "User receives confirmation toast with tier name",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2B7FFF]/15 text-[#4d9fff] text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="text-muted-foreground leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </RevealSection>

        {/* Testing */}
        <RevealSection delay={240}>
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Testing on Testnet</h2>
            <ol className="space-y-2">
              {[
                "Fund a wallet with Testnet SUI from faucet.testnet.sui.io",
                "Switch network to Testnet in the app",
                "Deploy payment Move contract to Testnet",
                "Set NEXT_PUBLIC_PAYMENT_TREASURY to contract address",
                'Click "Purchase Tier" on any provider card',
                "Complete payment flow and verify transaction on explorer",
                "Check Supabase table to confirm entitlement was stored",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00d4aa]/15 text-[#00d4aa] text-xs font-bold flex items-center justify-center">{i + 1}</span>
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
