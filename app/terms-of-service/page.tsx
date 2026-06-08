import type { Metadata } from "next"
import Link from "next/link"
import { RevealSection } from "@/components/reveal-section"

export const metadata: Metadata = {
  title: "Terms of Service - Atlas Protocol",
  description: "Atlas Protocol Terms of Service and legal agreements",
}

export default function TermsOfService() {
  return (
    <main className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="section-gradient-blue relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="container-modern relative z-10 py-12 md:py-16">
          <RevealSection>
            <div className="space-y-4">
              <Link
                href="/docs"
                className="inline-flex items-center gap-1.5 text-sm text-[#4d9fff] hover:text-[#00d4aa] transition-colors"
              >
                ← Back to Docs
              </Link>
              <h1 className="heading-hero">Terms of Service</h1>
              <p className="text-sm text-muted-foreground">Last updated: January 2026</p>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Content */}
      <div className="container-modern max-w-3xl py-12 md:py-16">
        <RevealSection delay={100}>
          <div className="docs-prose space-y-8">
            <section>
              <h2>1. Agreement & Acceptance</h2>
              <p>
                By accessing and using Atlas Protocol (the "Service"), you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2>2. Service Description</h2>
              <p>
                Atlas Protocol provides a comprehensive toolkit for blockchain infrastructure management on Sui and Move
                ecosystems. Our services include:
              </p>
              <ul>
                <li>
                  <strong>Wallet Cleanup:</strong> Analyze and clean up wallet holdings with scam detection
                </li>
                <li>
                  <strong>Transaction Explainer:</strong> Understand blockchain transactions with security analysis
                </li>
                <li>
                  <strong>Infra Discovery:</strong> Discover and purchase access to 50+ blockchain infrastructure
                  providers
                </li>
                <li>
                  <strong>Payment Processing:</strong> On-chain payment system for tier purchases
                </li>
              </ul>
              <div className="card-modern-blue p-4 mt-4 border-l-4 border-[#FFB60B]">
                <p className="font-semibold text-[#FFB60B]">BETA DISCLAIMER</p>
                <p>
                  Atlas Protocol is currently in beta. Features may change, be discontinued, or contain bugs. Use at your own risk.
                </p>
              </div>
            </section>

            <section>
              <h2>3. User Responsibilities</h2>
              <p>You acknowledge and agree that:</p>
              <ul>
                <li>You are responsible for all activities conducted through your wallet and account</li>
                <li>You perform your own due diligence on all blockchain transactions and assets</li>
                <li>You understand the risks of cryptocurrency, including total loss of funds</li>
                <li>Atlas Protocol does NOT provide financial advice or investment recommendations</li>
                <li>You will not hold Atlas Protocol liable for any trading or investment losses</li>
              </ul>
            </section>

            <section>
              <h2>4. Disclaimers & Limitations</h2>
              <p>
                <strong>NO WARRANTIES:</strong> Atlas Protocol is provided "AS IS" without warranties of any kind, express
                or implied. We make no warranty that the service will be uninterrupted, timely, secure, or error-free.
              </p>
              <p className="mt-4">
                <strong>LIABILITY CAP:</strong> To the fullest extent permitted by law, Atlas Protocol and Treezure Labs
                shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including
                lost profits, loss of data, or business interruption.
              </p>
            </section>

            <section>
              <h2>5. Non-Custody</h2>
              <p>
                Atlas Protocol is a non-custodial platform. We do NOT hold, control, or have access to your private keys,
                cryptocurrency, or assets. All transactions are conducted directly on the blockchain with your explicit
                authorization.
              </p>
            </section>

            <section>
              <h2>6. Prohibited Use</h2>
              <p>You agree NOT to use Atlas Protocol for:</p>
              <ul>
                <li>Any illegal activities or violations of applicable laws</li>
                <li>Money laundering, terrorist financing, or sanctions evasion</li>
                <li>Fraudulent schemes or pump-and-dump activities</li>
                <li>Accessing or attempting to hack the platform</li>
              </ul>
            </section>

            <section>
              <h2>7. Intellectual Property</h2>
              <p>
                All content, features, and functionality of Atlas Protocol, including but not limited to text, graphics,
                logos, and code, are the exclusive property of Treezure Labs and are protected by copyright and other
                intellectual property laws. You may not reproduce, modify, or distribute any content without explicit
                written permission.
              </p>
            </section>

            <section>
              <h2>8. Termination</h2>
              <p>
                Atlas Protocol reserves the right to suspend or terminate your access to the Service at any time, with or
                without notice, for violation of these terms or for any other reason deemed necessary to protect the
                integrity of the platform.
              </p>
            </section>

            <section>
              <h2>9. Changes to Terms</h2>
              <p>
                Atlas Protocol may update these terms at any time. Continued use of the Service constitutes acceptance of
                any changes. We will notify users of significant changes via email or platform notification.
              </p>
            </section>

            <section>
              <h2>10. Contact</h2>
              <p>
                For questions about these terms, please contact us at{" "}
                <a href="mailto:contact@atlasprotocol.com">contact@atlasprotocol.com</a>
              </p>
            </section>
          </div>
        </RevealSection>
      </div>
    </main>
  )
}
