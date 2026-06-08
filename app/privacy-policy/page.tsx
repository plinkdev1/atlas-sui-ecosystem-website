import type { Metadata } from "next"
import Link from "next/link"
import { RevealSection } from "@/components/reveal-section"

export const metadata: Metadata = {
  title: "Privacy Policy - Atlas Protocol",
  description: "Atlas Protocol privacy policy and data handling practices",
}

export default function PrivacyPolicy() {
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
              <h1 className="heading-hero">Privacy Policy</h1>
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
              <h2>1. Introduction</h2>
              <p>
                Atlas Protocol ("we," "us," "our," or "Company") is committed to protecting your privacy and ensuring you
                have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose,
                and otherwise process personal information in connection with our website and services.
              </p>
              <p>
                <strong>Important:</strong> Atlas Protocol does not custody, hold, or have access to your cryptocurrency
                assets or private keys. We are a non-custodial platform that helps you manage and understand your
                blockchain activities.
              </p>
            </section>

            <section>
              <h2>2. Data Collection</h2>
              <h3>What Information We Collect</h3>

              <div className="space-y-4">
                <div>
                  <h4>Wallet Information</h4>
                  <p>
                    When you connect your wallet, we collect your public wallet address. This information is used to
                    identify your account and provide personalized services. Your wallet address is pseudonymous and does
                    not personally identify you without additional information.
                  </p>
                </div>

                <div>
                  <h4>Usage Analytics</h4>
                  <p>
                    We use PostHog for analytics to understand how users interact with our platform. This includes page
                    views, feature usage, and performance metrics. You can opt-out of analytics at any time through your
                    privacy settings or by rejecting optional cookies.
                  </p>
                </div>

                <div>
                  <h4>Consent History</h4>
                  <p>
                    We store your cookie and consent preferences in Supabase to respect your choices. This information is
                    used solely to ensure we honor your privacy preferences across visits.
                  </p>
                </div>

                <div>
                  <h4>Transaction Data</h4>
                  <p>
                    When using our services (Wallet Cleanup, Transaction Explainer, Infra Discovery), we process
                    transaction information from the blockchain. This data is stored temporarily to provide the requested
                    service and is not shared without your explicit consent.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2>3. How We Use Your Data</h2>
              <ul>
                <li>Provide and improve our services (Wallet Cleanup, Transaction Explainer, Infra Discovery)</li>
                <li>Understand user behavior and platform usage patterns</li>
                <li>Maintain and enhance platform security</li>
                <li>Process payments and manage entitlements</li>
                <li>Communicate with you about service updates</li>
              </ul>
            </section>

            <section>
              <h2>4. Data Sharing</h2>
              <p>We do not sell or rent your personal information. We only share data:</p>
              <ul>
                <li>With service providers who assist us (e.g., PostHog for analytics, Supabase for data storage)</li>
                <li>When required by law or legal process</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2>5. Cookies & Tracking</h2>
              <h3>Types of Cookies We Use</h3>

              <div className="space-y-4">
                <div>
                  <h4>Essential Cookies</h4>
                  <p>
                    Required for basic platform functionality (authentication, session management). These cannot be
                    disabled.
                  </p>
                </div>

                <div>
                  <h4>Analytics Cookies</h4>
                  <p>
                    Help us understand how users use our platform. Managed through PostHog. You can opt-out at any time.
                  </p>
                </div>

                <div>
                  <h4>Marketing Cookies</h4>
                  <p>Used for marketing purposes. Entirely optional and can be rejected.</p>
                </div>
              </div>

              <p className="mt-6">
                You can manage your cookie preferences through the banner that appears on your first visit and reappears
                every 20 days.
              </p>
            </section>

            <section>
              <h2>6. Security</h2>
              <p>We implement industry-standard security measures including:</p>
              <ul>
                <li>Data encryption in transit (TLS/SSL) and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Row-Level Security (RLS) policies in our database</li>
                <li>No storage of private keys or sensitive wallet information</li>
              </ul>
            </section>

            <section>
              <h2>7. Your Rights (GDPR & Privacy Laws)</h2>
              <p>Depending on your jurisdiction, you have the right to:</p>
              <ul>
                <li>
                  <strong>Access:</strong> Request a copy of your personal data
                </li>
                <li>
                  <strong>Delete:</strong> Request deletion of your data (right to be forgotten)
                </li>
                <li>
                  <strong>Rectify:</strong> Correct inaccurate information
                </li>
                <li>
                  <strong>Opt-out:</strong> Decline marketing communications and analytics
                </li>
              </ul>
              <p>
                To exercise these rights, <a href="/contact/partnership">contact us</a>
              </p>
            </section>

            <section>
              <h2>8. Data Retention</h2>
              <p>
                We retain personal data only as long as necessary to provide our services or comply with legal
                obligations. Consent records expire after 20 days and require renewal. Transaction and usage data is
                retained for 90 days for analytics purposes and then anonymized.
              </p>
            </section>

            <section>
              <h2>9. International Data Transfers</h2>
              <p>
                Your information may be transferred to, stored in, and processed in countries other than your country of
                residence, including countries outside the European Economic Area. These countries may not have the same
                level of data protection as your home country. By using Atlas Protocol, you consent to such transfers.
              </p>
            </section>

            <section>
              <h2>10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of significant changes by posting
                the updated policy on our website with a new "Last Updated" date. Your continued use of Atlas Protocol
                following such notification constitutes your acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section>
              <h2>11. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our data practices, please contact us through our{" "}
                <a href="/contact/partnership">contact form</a>.
              </p>
            </section>
          </div>
        </RevealSection>
      </div>
    </main>
  )
}
