"use client"

import { ClipboardCheck, CheckSquare, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { RevealSection } from "@/components/reveal-section"

const testCases = [
  {
    title: "User: Search & Filter Providers",
    color: "#4d9fff",
    steps: [
      "Navigate to /docs/infra-discovery",
      'Click "Services" tab → view 50+ providers with logos',
      'Search "Shinami" → confirm filtered results',
      'Filter by "RPC" type → verify ~17 RPC providers show',
      'Filter by pricing "Free" → confirm correct providers',
      'Click "Export Registry" → download JSON with all providers',
      "Verify JSON contains: rpc[], indexing[], gateways[], validators[]",
    ],
    expected: [
      "Search returns accurate results instantly",
      "Filters work in combination (multi-select)",
      "JSON export includes all 50+ providers with metadata",
      "Provider cards show logos, names, tags, pricing",
    ],
  },
  {
    title: "Provider: Create/Edit Listing",
    color: "#00d4aa",
    steps: [
      "Connect wallet (Phantom, Suiet, or OKX)",
      "Navigate to /provider-dashboard",
      'Click "Add Service" → fill form (name, type, pricing, features)',
      'Set pricing: "Freemium" → click "Save Service"',
      "Confirm Supabase entry created",
      'Edit saved service → change pricing to "Paid"',
      "Verify changes persist after page refresh",
      "Delete service → confirm removal from list",
    ],
    expected: [
      "Form validation prevents empty fields",
      "Service saved to Supabase immediately",
      "Edits persist across sessions",
      "Features array correctly parsed/stored",
      "Delete removes service from both UI and database",
    ],
  },
  {
    title: "Admin: Approve/Reject Listings",
    color: "#F97316",
    steps: [
      "Navigate to /admin (admin-only access)",
      'View "Pending Listings" section',
      'Click "Approve" on a provider → set "verified: true"',
      "Verify badge appears on provider card in main discovery",
      'Click "Reject" on another provider → confirm removal',
      "Refresh page → verify admin changes persist",
      "Log out → re-login as non-admin → confirm read-only view",
    ],
    expected: [
      "Admin dashboard loads only for authorized users",
      "Approve action updates Supabase verified column",
      "Verified badge immediately appears on provider",
      "Reject removes listing from user view",
      "Non-admins cannot access /admin page",
    ],
  },
  {
    title: "Payments: Purchase Tier & Entitlement",
    color: "#4d9fff",
    steps: [
      "Connect wallet to /docs/infra-discovery",
      'Click "Purchase" on a tier (e.g., Shinami Growth tier)',
      'Payment modal shows: price, token, provider name',
      'Select payment token: "SUI" or "USDC"',
      "Verify balance check (insufficient balance handling)",
      'Click "Confirm Payment" → mock transaction executes',
      "Confirm entitlement event logged (check /api/entitlements)",
    ],
    expected: [
      "Payment modal shows correct pricing in SUI/USDC",
      "Insufficient balance warning appears if needed",
      "Transaction executes without errors",
      "Entitlement event logged to database",
      "User can view purchased tier in profile",
    ],
  },
  {
    title: "Dark/Light Mode Compatibility",
    color: "#00d4aa",
    steps: [
      "Open /docs/infra-discovery in light mode",
      "Verify provider cards readable (contrast, text color)",
      "Check badges, tags, pricing displays correctly",
      "Switch to dark mode (header toggle)",
      "Verify all elements remain readable and styled",
      "Check logo images render correctly on both modes",
      "Verify modals (detail, payment) work in both modes",
    ],
    expected: [
      "Text contrast meets WCAG AA standards in both modes",
      "Provider logos visible with appropriate backgrounds",
      "All interactive elements properly styled",
      "Modals layer correctly on dark/light backgrounds",
    ],
  },
  {
    title: "Mobile Responsiveness",
    color: "#00d4aa",
    steps: [
      "Open on mobile (iPhone/Android)",
      "Verify layout switches to mobile grid (1-2 columns)",
      "Test search bar responsiveness on mobile",
      "Tap filters → verify dropdown/modal works",
      "Click provider card → detail modal opens properly",
      "Test payment modal on mobile (input fields accessible)",
      "Test all tabs (RPC, Indexing, Services, Validators, Usage)",
    ],
    expected: [
      "Layout reflows smoothly to mobile dimensions",
      "Touch targets 48px+ for buttons",
      "Search/filter remain functional",
      "Modals don't overflow screen",
    ],
  },
]

const edgeCases = [
  "Disconnect wallet mid-payment → verify error toast",
  "Network switch while viewing provider details → refresh data",
  "Export with 0 providers → confirm empty/error handling",
  "Admin reject listing → confirm user cannot access",
  "Duplicate provider creation attempt → prevent duplicates",
]

const recommendations = [
  "Add real Blockberry API integration for security scoring",
  "Implement live provider status/uptime monitoring",
  "Add provider ratings/review system",
  "Create notification system for tier usage limits",
  "Add analytics dashboard for provider performance",
]

export default function InfraDiscoveryAudit() {
  return (
    <main>
      <section className="relative pt-16 pb-12">
        <div className="max-w-4xl space-y-4">
          <RevealSection>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Audit</p>
            <h1 className="text-4xl md:text-5xl font-bold font-[var(--font-display)]">
              Infra Discovery <span className="text-gradient">Audit Guide</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Comprehensive testing procedures for the Infra Discovery module — user flows, provider management, admin controls, and payment functionality.
            </p>
          </RevealSection>
        </div>
      </section>

      <div className="max-w-4xl space-y-6">
        {/* Scope */}
        <RevealSection>
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="icon-badge"><ClipboardCheck className="h-4 w-4 text-[#00d4aa]" /></div>
              <h2 className="text-xl font-bold text-foreground">Audit Scope</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                "50+ infrastructure providers (RPC, Indexing, Gateway)",
                "User search/filter/export functionality",
                "Provider dashboard (create/edit/delete listings)",
                "Admin moderation (approve/reject/verify)",
                "Payment tiers and entitlements",
                "Dark/Light mode compatibility",
                "Mobile responsiveness",
                "Data persistence (Supabase)",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckSquare className="h-3.5 w-3.5 text-[#00d4aa]/60 mt-0.5 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* Test cases */}
        {testCases.map((tc, i) => (
          <RevealSection key={tc.title} delay={i * 50}>
            <div className="glass-panel rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg text-sm font-bold flex items-center justify-center flex-shrink-0"
                  style={{ background: `${tc.color}20`, color: tc.color }}>
                  {i + 1}
                </span>
                <h3 className="font-bold text-foreground">{tc.title}</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Steps</p>
                  <ol className="space-y-1.5">
                    {tc.steps.map((step, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="flex-shrink-0 w-4 text-xs font-mono" style={{ color: tc.color }}>{j + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Expected</p>
                  <ul className="space-y-1.5">
                    {tc.expected.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: tc.color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </RevealSection>
        ))}

        {/* Edge cases + known issues */}
        <div className="grid sm:grid-cols-2 gap-6">
          <RevealSection delay={300}>
            <div className="glass-panel rounded-2xl p-6 space-y-3 h-full">
              <div className="flex items-center gap-3">
                <div className="icon-badge"><AlertTriangle className="h-4 w-4 text-yellow-400" /></div>
                <h2 className="text-lg font-bold text-foreground">Edge Cases</h2>
              </div>
              <ul className="space-y-2">
                {edgeCases.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </RevealSection>

          <RevealSection delay={340}>
            <div className="glass-panel rounded-2xl p-6 space-y-4 h-full">
              <h2 className="text-lg font-bold text-foreground">Known Status</h2>
              <div className="space-y-3">
                <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/8 p-3">
                  <p className="text-sm font-semibold text-yellow-400">Web3Modal MIME Error</p>
                  <p className="text-xs text-muted-foreground mt-1">Non-blocking. Does not affect functionality.</p>
                </div>
                <div className="rounded-xl border border-[#00d4aa]/30 bg-[#00d4aa]/8 p-3">
                  <p className="text-sm font-semibold text-[#00d4aa]">All Major Features Working</p>
                  <p className="text-xs text-muted-foreground mt-1">Provider discovery, payment tiers, admin moderation, and data persistence operational.</p>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>

        {/* Recommendations */}
        <RevealSection delay={380}>
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Recommendations</h2>
            <ul className="space-y-2">
              {recommendations.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ArrowRight className="h-3.5 w-3.5 text-[#4d9fff] mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
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
