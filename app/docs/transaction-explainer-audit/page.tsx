import { ClipboardCheck, CheckSquare, ArrowRight } from "lucide-react"
import Link from "next/link"
import { RevealSection } from "@/components/reveal-section"

const testSections = [
  {
    title: "Real Testnet Transaction Digest Fetching",
    items: [
      "Obtain real Testnet transaction digest from explorer (suiscan.xyz or suivision.xyz)",
      "Paste full explorer URL → verify URL parsing works correctly",
      "Paste transaction digest (hex format) → verify parsing",
      "Paste transaction digest (base64 format) → verify parsing",
      'Check console logs for: "[v0] Transaction fetched successfully"',
      "Verify transaction status displays (success/failed)",
      "Confirm timestamp and block number display",
    ],
  },
  {
    title: "Transaction Data Parsing & Summary Generation",
    items: [
      "Transfer detection: Verify correct sender/recipient addresses parse",
      "Balance changes: Confirm amount in SUI displays with correct decimals",
      "Object changes: Verify count of created/modified/deleted objects",
      "Events emitted: Confirm event count displays correctly",
      "Gas fees: Verify gas cost calculation and display (SUI units)",
      "Summary lists all transaction actions in plain English",
    ],
  },
  {
    title: "Transfer Flow Visualization with Arrows",
    items: [
      'Find transaction with balance changes (transfer)',
      '"Transfer Flow" section appears',
      'Sender address displays (truncated with "...")',
      'Arrow icon renders between sender and recipient',
      "Recipient address displays",
      "Transfer amount appears in center",
      "Test on mobile → arrow should wrap/stack correctly",
    ],
  },
  {
    title: "Blockberry Live Security Flags",
    items: [
      "Transaction with known suspicious contract → security warning toast appears",
      'Blockberry API returns "danger" → warning displayed prominently',
      'Check console for: "[v0] Security check: danger"',
      "API timeout or error → gracefully handled, continue showing transaction",
      "Normal transaction → no security warning (only info)",
    ],
  },
  {
    title: '"Explain Another" Button Functionality',
    items: [
      'After viewing transaction, "Explain Another" button visible',
      "Click button → input field clears",
      "Previous transaction data removed from display",
      "Focus returns to input field (UX verification)",
      "Raw JSON toggle resets to hidden",
      "Error messages clear",
    ],
  },
  {
    title: "Input Format Validation",
    items: [
      "Hex format digest: 0x followed by 64 hex characters",
      "Base64 format digest: 43-44 alphanumeric characters",
      "URL format: https://suiscan.xyz/testnet/tx/[digest]",
      "URL format: https://suivision.xyz/testnet/tx/[digest]",
      'Invalid input → toast error: "Invalid Input"',
      "Empty input → toast error when searching",
    ],
  },
  {
    title: "Error Handling & Edge Cases",
    items: [
      "Non-existent digest → error message displays with helpful text",
      "Wallet disconnects mid-fetch → graceful error handling",
      "RPC timeout → error message with retry option",
      "Malformed URL input → helpful error message",
      "Network switch mid-fetch → automatically uses correct RPC",
    ],
  },
  {
    title: "Mobile Responsiveness",
    items: [
      "Test on iPhone 12/14 (375px width)",
      "Test on iPad (768px width)",
      "Input field spans full width on mobile",
      "Search button accessible and touch-friendly (≥44px)",
      "Summary cards stack vertically",
      "Transfer flow wraps/stacks on small screens",
    ],
  },
  {
    title: "Performance Testing",
    items: [
      "Fetch time for transaction with 10+ balance changes: <2s",
      "Fetch time for transaction with 50+ events: <3s",
      "JSON rendering <500ms",
      'Check browser console for "[v0] Transaction fetch time: Xms"',
      "No memory leaks on page refresh multiple times",
    ],
  },
]

const consoleLogs = `[v0] Transaction digest validated: [digest]
[v0] Fetching transaction via SuiClient...
[v0] Transaction fetched successfully
[v0] Generated X summary items
[v0] Security check: [status]
[v0] Error fetching transaction: [message]`

const resultsTemplate = `Test Date: ___________
Tester: ___________
Network: Sui Testnet
Overall Status: [ ] PASS [ ] FAIL

Summary:
- Real transaction fetching:    [ ] PASS [ ] FAIL
- Data parsing & summaries:     [ ] PASS [ ] FAIL
- Transfer flow visualization:  [ ] PASS [ ] FAIL
- Blockberry security checks:   [ ] PASS [ ] FAIL
- Explain Another button:       [ ] PASS [ ] FAIL
- Error handling:               [ ] PASS [ ] FAIL
- Dark/Light mode:              [ ] PASS [ ] FAIL
- Mobile responsiveness:        [ ] PASS [ ] FAIL
- Performance:                  [ ] PASS [ ] FAIL

Issues Found:
1. ___________
2. ___________
3. ___________`

export default function TransactionExplainerAudit() {
  return (
    <main>
      <section className="relative pt-16 pb-12">
        <div className="max-w-4xl space-y-4">
          <RevealSection>
            <p className="text-sm font-medium tracking-widest uppercase text-[#4d9fff]">Audit</p>
            <h1 className="text-4xl md:text-5xl font-bold font-[var(--font-display)]">
              Transaction Explainer <span className="text-gradient">Audit Guide</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Comprehensive testing procedures for the Transaction Explainer module — real-world analysis, security detection, and UI/UX verification.
            </p>
          </RevealSection>
        </div>
      </section>

      <div className="max-w-4xl space-y-6">
        {/* Test environment */}
        <RevealSection>
          <div className="glass-panel rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="icon-badge"><ClipboardCheck className="h-4 w-4 text-[#4d9fff]" /></div>
              <h2 className="text-xl font-bold text-foreground">Test Environment</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                ["Network", "Sui Testnet"],
                ["Wallets", "Suiet, OKX Wallet, Phantom"],
                ["APIs", "Blockberry (live), SuiClient RPC"],
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
                    <CheckSquare className="h-3.5 w-3.5 text-[#4d9fff]/60 mt-0.5 flex-shrink-0" />
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
            <p className="text-sm text-muted-foreground">Open browser DevTools (F12) and check for these debug messages:</p>
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

        {/* Known issues */}
        <RevealSection delay={440}>
          <div className="glass-panel rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-bold text-foreground">Known Issues & Workarounds</h2>
            <div className="docs-prose">
              <ul>
                <li>Web3Modal MIME type error (non-blocking) — does not affect functionality</li>
                <li>If Blockberry API is unavailable, transaction still displays with local analysis</li>
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
