"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Eye, Link2, Newspaper, Users, BarChart3, Megaphone, Check } from "lucide-react"
import { RevealSection } from "@/components/reveal-section"
import { SponsoredCarousel } from "@/components/sponsored-carousel"

const tiers = [
  {
    name: "Community Listed",
    price: "Free",
    description: "Get discovered by the Sui community",
    benefits: ["Public listing", "Basic profile", "Directory access", "Community support"],
    cta: "Get Listed",
    href: "/contact",
    highlight: false,
  },
  {
    name: "Verified Partner",
    price: "$99/mo",
    description: "Stand out with verification and extra reach",
    benefits: ["Verified badge", "Featured placement", "API priority access", "Newsletter inclusion", "Social mentions"],
    cta: "Become Verified",
    href: "/contact",
    highlight: true,
  },
  {
    name: "Premium Featured",
    price: "Custom",
    description: "Enterprise-grade partnership with full support",
    benefits: ["Top directory placement", "Custom integration", "Enterprise support", "Dedicated PM", "Co-marketing campaigns"],
    cta: "Contact Us",
    href: "/contact",
    highlight: false,
  },
]

const benefits = [
  { icon: Eye, title: "Ecosystem Visibility", desc: "Reach thousands of Sui users discovering infrastructure daily." },
  { icon: Link2, title: "API Integration", desc: "Easy programmatic access to our directory and tool suite." },
  { icon: Newspaper, title: "Marketing Support", desc: "Featured in our newsletter, social channels, and community." },
  { icon: Users, title: "Community Access", desc: "Direct access to our community Discord and partner events." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Track listing views, clicks, and engagement in real time." },
  { icon: Megaphone, title: "Co-Marketing", desc: "Premium partners get dedicated co-marketing campaigns." },
]

export default function PartnersPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 mesh-bg pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(43,127,255,0.18) 0%, transparent 60%)",
          }}
        />
        <div className="container-modern relative z-10">
          <RevealSection className="text-center space-y-6 max-w-3xl mx-auto">
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Partnerships</p>
            <h1 className="heading-hero">
              Become an{" "}
              <span className="text-gradient">Atlas Partner</span>
            </h1>
            <p className="text-subtitle mx-auto max-w-2xl">
              Grow your reach, access our community, and become part of the Sui ecosystem hub trusted by thousands of
              builders and users.
            </p>
            <a href="/contact">
              <Button className="btn-brand-gradient mt-2">
                Apply Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </RevealSection>
        </div>
      </section>

      {/* Partner Spotlight Carousel */}
      <section className="section-default container-modern">
        <RevealSection className="space-y-4">
          <div className="text-center space-y-1">
            <p className="text-xs font-medium tracking-widest uppercase text-[#00d4aa]">Sponsored · Partner Spotlight</p>
          </div>
          <SponsoredCarousel />
        </RevealSection>
      </section>

      {/* Pricing Tiers */}
      <section className="section-default container-modern">
        <RevealSection className="space-y-10">
          <div className="text-center space-y-3">
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Pricing</p>
            <h2 className="heading-section">Partnership Tiers</h2>
            <p className="text-subtitle">Choose the tier that fits your goals</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {tiers.map((tier, idx) => (
              <RevealSection key={tier.name} delay={idx * 80}>
                <div
                  className={
                    tier.highlight
                      ? "relative card-modern p-8 space-y-6 ring-2 ring-[#2B7FFF] shadow-[0_0_40px_rgba(43,127,255,0.2)]"
                      : "card-modern p-8 space-y-6"
                  }
                >
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#2B7FFF] text-white">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="space-y-1">
                    <h3 className="heading-subsection">{tier.name}</h3>
                    <p className="text-2xl font-bold text-foreground font-[var(--font-display)]">{tier.price}</p>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-[#00d4aa] flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <a href={tier.href}>
                    <Button
                      className={
                        tier.highlight ? "w-full btn-brand-gradient" : "w-full button-secondary-modern"
                      }
                    >
                      {tier.cta}
                    </Button>
                  </a>
                </div>
              </RevealSection>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* Benefits */}
      <section className="section-default container-modern">
        <RevealSection className="space-y-10">
          <div className="text-center space-y-3">
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Value</p>
            <h2 className="heading-section">What Partners Get</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map(({ icon: Icon, title, desc }, idx) => (
              <RevealSection key={title} delay={idx * 60}>
                <div className="feature-card h-full">
                  <div className="icon-badge flex-shrink-0">
                    <Icon className="h-5 w-5 text-[#2B7FFF]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* CTA */}
      <section className="section-orange-cta py-24">
        <div className="container-modern relative z-10">
          <RevealSection className="text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="heading-section" style={{ color: "white" }}>
              Ready to Partner?
            </h2>
            <p className="text-subtitle" style={{ color: "rgba(255,255,255,0.8)" }}>
              Submit your partnership inquiry and our team will respond within 48 hours.
            </p>
            <a href="/contact">
              <Button className="btn-brand-gradient mt-2">
                Start Partnership <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </RevealSection>
        </div>
      </section>
    </main>
  )
}
