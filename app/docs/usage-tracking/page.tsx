import Link from "next/link"
import { RevealSection } from "@/components/reveal-section"

export default function UsageTrackingDocs() {
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
        <h1 className="heading-hero">Usage Tracking</h1>
        <p className="text-subtitle max-w-2xl">
          Real-time monitoring of API consumption per client — quota usage with visual indicators, proxy
          compatibility notes, and operational guidance.
        </p>
      </div>
      </RevealSection>

      <RevealSection delay={100}><div className="docs-prose space-y-2">
        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Overview</h2>
          <p>
            The Usage Tracking module provides real-time monitoring of API consumption per client. It displays quota
            usage with visual indicators, proxy compatibility notes, and operational guidance.
          </p>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Features</h2>
          <ul>
            <li><strong>Per-Client Quotas:</strong> Track API requests for each connected client</li>
            <li><strong>Visual Progress Bars:</strong> Colour-coded by usage level (green, yellow, red)</li>
            <li><strong>Plan Information:</strong> Display associated service plan and limits</li>
            <li><strong>Proxy Configuration:</strong> NGINX and Envoy setup examples</li>
            <li><strong>Reset Schedules:</strong> Show quota reset times</li>
            <li><strong>Realistic Dashboard:</strong> Professional interface for ops teams</li>
          </ul>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Client Data Structure</h2>
          <pre>
            {`interface ClientQuota {
  clientId: string;
  clientName: string;
  plan: 'Starter' | 'Growth' | 'Pro';
  apiKey: string;
  requestsUsed: number;
  requestsLimit: number;
  percentageUsed: number;
  status: 'Active' | 'Warning' | 'Exceeded';
  lastReset: string;
  nextReset: string;
  services: string[];
}`}
          </pre>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">NGINX Configuration Example</h2>
          <pre>
            {`# Rate limiting by API key
limit_req_zone $http_x_api_key zone=api_limit:10m rate=100r/s;

server {
    listen 8080;
    
    location /api/ {
        limit_req zone=api_limit burst=200 nodelay;
        proxy_pass http://backend;
    }
}`}
          </pre>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Envoy Configuration Example</h2>
          <pre>
            {`rate_limits:
  - name: api-quota
    domains: ["*"]
    match_headers:
      - name: x-api-key
        exact_match: "client-key"
    rate_limit_actions:
      - type: GENERIC_KEY
        generic_key:
          descriptor_key: "api_key"
    rate_limit_service: "rate-limiter"`}
          </pre>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Status Indicators</h2>
          <ul>
            <li><strong>Green (0–70%):</strong> Healthy usage, plenty of quota remaining</li>
            <li><strong>Yellow (71–90%):</strong> Warning state, approaching limit</li>
            <li><strong>Red (91–100%):</strong> Critical, nearly at quota</li>
            <li><strong>Red (100%+):</strong> Exceeded quota, requests being throttled</li>
          </ul>
        </section>

        <section className="card-modern p-6 space-y-3">
          <h2 className="m-0 border-0 pt-0">Sui-Only Scope</h2>
          <p>
            Usage tracking features are exclusively available on Sui networks. Other chains display a "Full
            functionality on Sui" fallback message.
          </p>
        </section>
      </div></RevealSection>
    </div>
  )
}
