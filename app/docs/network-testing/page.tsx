"use client"

import { CheckCircle2, XCircle, AlertCircle, Zap, Network, ArrowRight } from "lucide-react"
import Link from "next/link"
import { RevealSection } from "@/components/reveal-section"

const testResults = [
  { network: "Sui Testnet", module: "Wallet Connection", status: "pass", message: "Connected successfully with Phantom wallet" },
  { network: "Sui Testnet", module: "Wallet Cleanup", status: "pass", message: "Owned objects fetched (23 tokens, 5 NFTs)" },
  { network: "Sui Testnet", module: "Transaction Explainer", status: "pass", message: "Transaction digest resolved and parsed" },
  { network: "Sui Testnet", module: "Infra Discovery", status: "pass", message: "Provider list loaded from RPC" },
  { network: "Sui Mainnet", module: "Wallet Connection", status: "pass", message: "Connected successfully" },
  { network: "Sui Devnet", module: "Wallet Connection", status: "warning", message: "Faucet requires pre-funded account" },
]

const networks = [
  { name: "Sui Mainnet", rpc: "https://fullnode.mainnet.sui.io", note: "Production transactions (CAUTION)" },
  { name: "Sui Testnet", rpc: "https://fullnode.testnet.sui.io", note: "Safe testing with real-like data" },
  { name: "Sui Devnet", rpc: "https://fullnode.devnet.sui.io", note: "Development and rapid iteration" },
]

const procedures = [
  {
    title: "Wallet Connection Test",
    steps: [
      'Open header network selector dropdown',
      'Select "Sui Testnet" → Wait for RPC URL to update',
      'Click "Connect Wallet" button',
      'Approve connection in wallet extension',
      'Verify wallet address displays in header',
      'Repeat for Mainnet and Devnet',
    ],
  },
  {
    title: "Wallet Cleanup Module Test",
    steps: [
      'Navigate to /wallet-cleanup',
      'Wait for owned objects to load (tokens, NFTs)',
      'Verify Blockberry/Blockvision security data loads',
      'Switch network in header → Verify data refreshes',
      'Test filters and search functionality',
    ],
  },
  {
    title: "Transaction Explainer Test",
    steps: [
      'Navigate to /transaction-explainer',
      'Paste a valid transaction digest or explorer URL',
      'Click search → Verify transaction details load',
      'Switch network → Try fetching a transaction from different network',
      'Test invalid digest handling (should show error toast)',
    ],
  },
  {
    title: "Network Switch Mid-Session Test",
    steps: [
      'Stay on /wallet-cleanup with Testnet connected',
      'Switch to Mainnet in header dropdown',
      'Verify data refreshes automatically',
      'Check for any errors in console',
      'Switch to Devnet and repeat',
    ],
  },
  {
    title: "Error Handling Test",
    steps: [
      'Disconnect wallet → Verify connection prompt shows',
      'Try accessing /wallet-cleanup without connecting',
      'Try invalid transaction digest → Verify error message',
      'Switch to unsupported network → Verify graceful error',
      'Test network with no balance → Verify graceful fallback',
    ],
  },
]

function StatusIcon({ status }: { status: string }) {
  if (status === "pass") return <CheckCircle2 className="h-4 w-4 text-[#00d4aa]" />
  if (status === "fail") return <XCircle className="h-4 w-4 text-red-400" />
  return <AlertCircle className="h-4 w-4 text-yellow-400" />
}

export default function NetworkTestingDoc() {
  return (
    <main>
      <section className="relative pt-16 pb-12">
        <div className="max-w-4xl space-y-4">
          <RevealSection>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Testing</p>
            <h1 className="text-4xl md:text-5xl font-bold font-[var(--font-display)]">
              Multi-Network <span className="text-gradient">Testing Guide</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Comprehensive testing procedures for Sui Mainnet, Testnet, and Devnet across all Atlas Protocol modules.
            </p>
          </RevealSection>
        </div>
      </section>

      <div className="max-w-4xl space-y-10">
        {/* Overview */}
        <RevealSection>
          <div className="glass-panel rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="icon-badge"><Zap className="h-4 w-4 text-[#4d9fff]" /></div>
              <h2 className="text-xl font-bold text-foreground">Testing Overview</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {networks.map((n) => (
                <span key={n.name} className="px-3 py-1 rounded-full text-xs font-medium border border-[#2B7FFF]/30 text-[#4d9fff] bg-[#2B7FFF]/10">{n.name}</span>
              ))}
            </div>
            <div className="docs-prose">
              <ul>
                <li>Wallet connection and switching between networks</li>
                <li>RPC data fetching (balance, objects, transactions)</li>
                <li>Module-specific operations (cleanup, explain, discovery)</li>
                <li>Network switch mid-session with data refresh</li>
                <li>Error handling and edge cases</li>
              </ul>
            </div>
          </div>
        </RevealSection>

        {/* Procedures */}
        <div className="space-y-4">
          {procedures.map((proc, i) => (
            <RevealSection key={proc.title} delay={i * 60}>
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#2B7FFF]/15 text-[#4d9fff] text-sm font-bold flex items-center justify-center">{i + 1}</span>
                  <h3 className="font-bold text-foreground">{proc.title}</h3>
                </div>
                <ul className="space-y-2">
                  {proc.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-[#00d4aa] mt-0.5 flex-shrink-0" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealSection>
          ))}
        </div>

        {/* Results */}
        <RevealSection delay={300}>
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Test Results Summary</h2>
            <p className="text-xs text-muted-foreground">Last execution: {new Date().toLocaleString()}</p>
            <div className="space-y-2">
              {testResults.map((result, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-border/50 bg-muted/10">
                  <StatusIcon status={result.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-foreground">{result.network}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{result.module}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{result.message}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                    result.status === "pass" ? "bg-[#00d4aa]/15 text-[#00d4aa]" :
                    result.status === "fail" ? "bg-red-500/15 text-red-400" :
                    "bg-yellow-500/15 text-yellow-400"
                  }`}>{result.status}</span>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* Network config */}
        <RevealSection delay={360}>
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="icon-badge"><Network className="h-4 w-4 text-[#00d4aa]" /></div>
              <h2 className="text-xl font-bold text-foreground">Network Configuration</h2>
            </div>
            <div className="space-y-4">
              {networks.map((n) => (
                <div key={n.name} className="border border-border/40 rounded-xl p-4 space-y-1">
                  <p className="font-semibold text-foreground">{n.name}</p>
                  <p className="text-xs font-mono text-[#4d9fff]">{n.rpc}</p>
                  <p className="text-xs text-muted-foreground">{n.note}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* Tips */}
        <RevealSection delay={400}>
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Tips & Best Practices</h2>
            <div className="docs-prose">
              <ul>
                <li>Always test on Testnet first before trying Mainnet</li>
                <li>Check browser console (F12) for debug logs prefixed with <code>[v0]</code></li>
                <li>Keep wallet extension open during testing for smooth switching</li>
                <li>Use Testnet or Devnet faucets to fund test wallets</li>
                <li>Clear browser cache if network data seems stale</li>
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
