import Link from "next/link"
import { RevealSection } from "@/components/reveal-section"

export default function InfraDiscoveryDocs() {
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
        <h1 className="heading-hero">Infra Discovery</h1>
        <p className="text-subtitle max-w-2xl">
          A searchable, filterable marketplace for blockchain infrastructure services including RPC providers,
          indexing services, and ecosystem tools.
        </p>
      </div>
      </RevealSection>

      <RevealSection delay={100}><div className="docs-prose space-y-2">
        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Overview</h2>
          <p>
            The Infra Discovery module provides a searchable, filterable marketplace for blockchain infrastructure
            services including RPC providers, indexing services, and ecosystem tools.
          </p>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Features</h2>
          <ul>
            <li><strong>RPC Services:</strong> Dedicated tab for RPC provider discovery</li>
            <li><strong>Indexing Services:</strong> Dedicated tab for blockchain indexers</li>
            <li><strong>Service Marketplace:</strong> Unified services tab with all providers</li>
            <li><strong>Detailed Metadata:</strong> Service information with JSON export</li>
            <li><strong>Validators:</strong> View active validators on Sui network</li>
            <li><strong>Pricing Tiers:</strong> Starter, Growth, Pro plans with SUI/USDC payment</li>
            <li><strong>Usage Tracking:</strong> Per-client quota dashboard and NGINX/Envoy configs</li>
            <li><strong>Admin Features:</strong> Verification badges and listing moderation</li>
          </ul>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Data Structure</h2>
          <pre>
            {`interface InfraService {
  id: string;
  name: string;
  provider: string;
  type: 'RPC' | 'Indexing' | 'Gateway';
  chains: string[];
  pricing: {
    tier: string;
    price: number;
    currency: string;
  }[];
  tags: string[];
  sla: string;
  acceptedTokens: string[];
  verified: boolean;
  website: string;
  documentation: string;
}`}
          </pre>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Tabs</h2>
          <ul>
            <li><strong>RPC:</strong> Filtered view of RPC providers</li>
            <li><strong>Indexing:</strong> Filtered view of indexing services</li>
            <li><strong>Validators:</strong> Sui network validators</li>
            <li><strong>Services:</strong> All services with full filters and search</li>
            <li><strong>Usage:</strong> Quota tracking and proxy configuration</li>
          </ul>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Onchain Payments</h2>
          <p>Each service tier includes a "Purchase" button. When connected to a Sui wallet:</p>
          <ul>
            <li>Payment modal shows transaction details</li>
            <li>User selects SUI or USDC token</li>
            <li>Mock transaction is prepared and confirmed</li>
            <li>Entitlement event is emitted (stub for future Move contracts)</li>
          </ul>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Admin Panel</h2>
          <p>Access the admin panel at <code>/admin/partners</code> in development mode:</p>
          <ul>
            <li>View and edit service listings</li>
            <li>Export service data as JSON</li>
            <li>Toggle verification status</li>
            <li>Manage partner information</li>
          </ul>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Sui-Only Scope</h2>
          <p>Purchase functionality and advanced features are only available on Sui networks.</p>
        </section>
      </div></RevealSection>
    </div>
  )
}
