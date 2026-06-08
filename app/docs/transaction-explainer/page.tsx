import Link from "next/link"
import { RevealSection } from "@/components/reveal-section"

export default function TransactionExplainerDocs() {
  return (
    <div className="space-y-10 pb-16">
      {/* Back */}
      <Link
        href="/docs"
        className="inline-flex items-center gap-1.5 text-sm text-[#4d9fff] hover:text-[#00d4aa] transition-colors"
      >
        ← Back to Docs
      </Link>

      {/* Header */}
      <RevealSection>
      <div className="space-y-3">
        <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Module Docs</p>
        <h1 className="heading-hero">Transaction Explainer</h1>
        <p className="text-subtitle max-w-2xl">
          Human-readable summaries of Sui transactions — paste any transaction digest or explorer link to
          understand what happened instantly.
        </p>
      </div>
      </RevealSection>

      <RevealSection delay={100}><div className="docs-prose space-y-2">
        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Overview</h2>
          <p>
            The Transaction Explainer module provides human-readable summaries of Sui transactions. Paste any
            transaction digest or explorer link to instantly understand what happened.
          </p>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Features</h2>
          <ul>
            <li><strong>Multi-format Input:</strong> Accepts hex digests and full Suiscan explorer URLs</li>
            <li><strong>Human-Readable Summaries:</strong> Plain English explanation of transaction actions</li>
            <li><strong>Visual Flow:</strong> Sender → recipient transfer visualisation</li>
            <li><strong>Detailed Breakdown:</strong> Gas fees, events, object changes, balance changes</li>
            <li><strong>Raw JSON Toggle:</strong> Advanced mode for developers</li>
            <li><strong>Error Handling:</strong> Graceful messages for invalid or missing transactions</li>
          </ul>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Data Sources</h2>
          <ul>
            <li><strong>Sui RPC:</strong> suiClient.getTransactionBlock() with full options</li>
            <li><strong>Options Used:</strong> showEffects, showInput, showEvents, showObjectChanges, showBalanceChanges</li>
          </ul>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Input Formats</h2>
          <ul>
            <li>
              <strong>Transaction Digest (Base64):</strong>{" "}
              <code>5JGH7XT23NoS5XWmsxS71LU7GgFCek5cTNN2KutAkeHQ</code>
            </li>
            <li>
              <strong>Transaction Digest (Hex):</strong> <code>0x1234567890abcdef...</code>
            </li>
            <li>
              <strong>Explorer Link:</strong>{" "}
              <code>https://suiscan.xyz/mainnet/tx/5JGH7XT23NoS...</code>
            </li>
          </ul>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Technical Implementation</h2>
          <pre>
            {`// Fetching transaction details
const fetchTransactionBlock = async (digest: string) => {
  const tx = await suiClient.getTransactionBlock({
    digest,
    options: {
      showEffects: true,
      showInput: true,
      showEvents: true,
      showObjectChanges: true,
      showBalanceChanges: true,
    },
  });
  return tx;
};`}
          </pre>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Summary Parsing</h2>
          <ul>
            <li>Transfer detection and amounts</li>
            <li>Move call extraction and labelling</li>
            <li>Object creation/modification tracking</li>
            <li>Gas fee calculation in SUI</li>
            <li>Event parsing and categorisation</li>
          </ul>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Sui-Only Scope</h2>
          <p>Exclusively available on Sui networks. Shows a fallback message on non-Sui chains.</p>
        </section>
      </div></RevealSection>
    </div>
  )
}
