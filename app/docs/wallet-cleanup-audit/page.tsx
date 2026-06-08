import { ClipboardCheck, CheckSquare, ArrowRight } from "lucide-react"
import Link from "next/link"
import { RevealSection } from "@/components/reveal-section"

const testSections = [
  {
    title: "Multi-Wallet Connection",
    items: [
      "Suiet — Connection Status / Data Load",
      "OKX Wallet — Connection Status / Data Load",
      "Phantom — Connection Status / Data Load",
    ],
  },
  {
    title: "Real NFT/Object Fetching (Testnet)",
    items: [
      "Verify wallet contains real objects on Testnet",
      'Check console logs for: "[v0] Total owned objects: X"',
      "Confirm NFT display with images loads correctly",
      "Verify metadata (name, creator, floor price) displays",
      "Test pagination if > 10 objects present",
    ],
  },
  {
    title: "Blockberry Live API Classification",
    items: [
      'Known legitimate NFT shows "safe" badge',
      'Known scam NFT shows "danger" badge with warning',
      "Security level displays (safe/warning/danger)",
      'Confidence score visible (e.g., "95% confidence")',
      "API errors display gracefully with fallback data",
    ],
  },
  {
    title: "Bulk Hide/Burn Operations",
    items: [
      "Select multiple tokens/NFTs via checkbox",
      '"Bulk Hide Selected" button appears and is enabled',
      "Click bulk hide → items disappear from list",
      "localStorage correctly persists hidden state",
      "Burn modal appears with correct item count",
      "Confirm burn → toast notification shows",
    ],
  },
  {
    title: "Community Voting Persistence",
    items: [
      "Connected user (Supabase auth active)",
      "Rate an NFT — click thumbs up or down",
      'Toast shows "Rating submitted" locally',
      "Refresh page → rating persists",
      "Check localStorage: nft-[id] key contains rating and hidden state",
    ],
  },
  {
    title: "Dark/Light Mode Compatibility",
    items: [
      "Toggle theme in header",
      "All text remains readable (contrast ≥ 4.5:1)",
      "NFT images display correctly in both modes",
      "Security badges (safe/danger/warning) visible in both modes",
      "Modals and dropdowns styled correctly",
    ],
  },
  {
    title: "Mobile Responsiveness",
    items: [
      "Test on iPhone 12/14 (375px width)",
      "Test on iPad (768px width)",
      "Test on Android device (360px width)",
      "NFT cards stack vertically on mobile",
      "Buttons are touch-friendly (min 44px height)",
      "Filters and sort dropdown work on mobile",
    ],
  },
  {
    title: "Error Handling & Edge Cases",
    items: [
      "Wallet disconnects mid-load → graceful error, retry button",
      "Blockberry API timeout → fallback to local classifications",
      'Empty wallet (no objects) → "No assets found" message',
      "Network switch mid-fetch → data refreshes automatically",
      "RPC rate limit → queue requests, show loading state",
    ],
  },
  {
    title: "Filtering & Sorting",
    items: [
      "Filter by classification (legit/dubious/scam)",
      "Filter by security level (safe/warning/danger)",
      'Toggle "Show Hidden" to reveal hidden items',
      "Sort by name (A-Z)",
      "Sort by balance (high to low)",
      "Search query filters results in real-time",
    ],
  },
]

const consoleLogs = `[v0] Network or account changed, refreshing wallet cleanup data
[v0] Fetching real tokens from Sui blockchain for address: 0x...
[v0] Total token balances: X
[v0] Token scanning complete: [...]
[v0] Fetching real NFTs from Sui blockchain for address: 0x...
[v0] Total owned objects: X
[v0] Filtered NFT objects: Y
[v0] NFT scanning complete: [...]`

const resultsTemplate = `WALLET CLEANUP AUDIT RESULTS
============================
Date: ________________
Tester: ________________
Network: Sui Testnet
Browser: ________________

MULTI-WALLET CONNECTION:
- Suiet:   [ ] Pass [ ] Fail  Notes: _______________
- OKX:     [ ] Pass [ ] Fail  Notes: _______________
- Phantom: [ ] Pass [ ] Fail  Notes: _______________

REAL DATA FETCHING:
- NFT Count: X
- Token Count: Y
- Blockberry API: [ ] Pass [ ] Fail
- Blockvision API: [ ] Pass [ ] Fail

OPERATIONS:
- Hide NFT:         [ ] Pass [ ] Fail
- Burn Token:       [ ] Pass [ ] Fail
- Bulk Operations:  [ ] Pass [ ] Fail

OVERALL: [ ] PASS [ ] FAIL
Issues Found: _________________________`

export default function WalletCleanupAudit() {
  return (
    <main>
      <section className="relative pt-16 pb-12">
        <div className="max-w-4xl space-y-4">
          <RevealSection>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Audit</p>
            <h1 className="text-4xl md:text-5xl font-bold font-[var(--font-display)]">
              Wallet Cleanup <span className="text-gradient">Audit Guide</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Comprehensive testing procedures for the Wallet Cleanup module across real-world scenarios, multiple wallets, and edge cases.
            </p>
          </RevealSection>
        </div>
      </section>

      <div className="max-w-4xl space-y-6">
        {/* Test env */}
        <RevealSection>
          <div className="glass-panel rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="icon-badge"><ClipboardCheck className="h-4 w-4 text-[#00d4aa]" /></div>
              <h2 className="text-xl font-bold text-foreground">Test Environment</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                ["Network", "Sui Testnet"],
                ["Wallets", "Suiet, OKX Wallet, Phantom"],
                ["APIs", "Blockberry (live), Blockvision (live)"],
                ["Theme", "Dark mode and Light mode"],
                ["Device", "Desktop and Mobile (responsive)"],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-2 text-sm">
                  <span className="text-muted-foreground w-20 flex-shrink-0">{label}:</span>
                  <span className="text-foreground font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* Test cases */}
        {testSections.map((section, i) => (
          <RevealSection key={section.title} delay={i * 40}>
            <div className="glass-panel rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#2B7FFF]/15 text-[#4d9fff] text-sm font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <h3 className="font-bold text-foreground">{section.title}</h3>
              </div>
              <ul className="space-y-1.5 pl-10">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckSquare className="h-3.5 w-3.5 text-[#00d4aa]/60 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </RevealSection>
        ))}

        {/* Console logs */}
        <RevealSection delay={360}>
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Console Logging Verification</h2>
            <p className="text-sm text-muted-foreground">Open DevTools → Console and verify these log patterns:</p>
            <div className="docs-prose">
              <pre><code>{consoleLogs}</code></pre>
            </div>
          </div>
        </RevealSection>

        {/* Results template */}
        <RevealSection delay={400}>
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Test Results Template</h2>
            <div className="docs-prose">
              <pre><code>{resultsTemplate}</code></pre>
            </div>
          </div>
        </RevealSection>

        {/* Debugging tips */}
        <RevealSection delay={440}>
          <div className="glass-panel rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-bold text-foreground">Debugging Tips</h2>
            <div className="docs-prose">
              <ul>
                <li>Open DevTools (F12) → Console tab to see all <code>[v0]</code> logs</li>
                <li>Check Network tab to verify API calls are made</li>
                <li>Inspect localStorage: DevTools → Application → Storage → localStorage</li>
                <li>Use React DevTools to inspect component state</li>
                <li>Check Sui Explorer (testnet.suiscan.xyz) for transaction status</li>
              </ul>
            </div>
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
