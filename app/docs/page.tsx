"use client"

import { ArrowRight, BookOpen, Wrench, Code, Users, Globe, Shield } from "lucide-react"
import { RevealSection } from "@/components/reveal-section"

export default function DocsPage() {
  const sections = [
    {
      title: "Getting Started",
      icon: BookOpen,
      color: "#00d4aa",
      items: [
        { name: "What is Atlas Protocol?", href: "/docs/architecture" },
        { name: "Blockchain Resources", href: "/docs/blockchains" },
        { name: "Sui Basics", href: "https://docs.sui.io" },
      ],
    },
    {
      title: "Using Atlas Tools",
      icon: Wrench,
      color: "#4d9fff",
      items: [
        { name: "Wallet Cleanup", href: "/tools/wallet-cleanup" },
        { name: "Transaction Explainer", href: "/tools/transaction-explainer" },
        { name: "Swap Aggregator", href: "/tools/swap" },
        { name: "Bridge Hub", href: "/tools/bridge" },
        { name: "Stake Hub", href: "/tools/stake" },
        { name: "Oracle Feeds", href: "/tools/oracle-feeds" },
      ],
    },
    {
      title: "Infrastructure",
      icon: Globe,
      color: "#00d4aa",
      items: [
        { name: "Infra Discovery Guide", href: "/docs/infra-discovery" },
        { name: "Provider Directory", href: "/infra-discovery" },
        { name: "API Access", href: "/docs/infra-discovery" },
      ],
    },
    {
      title: "API Reference",
      icon: Code,
      color: "#4d9fff",
      items: [
        { name: "REST API", href: "/docs/architecture" },
        { name: "Transaction Explainer API", href: "/docs/transaction-explainer" },
        { name: "Rate Limiting", href: "/docs/architecture" },
      ],
    },
    {
      title: "For Providers",
      icon: Shield,
      color: "#F97316",
      items: [
        { name: "List Your Project", href: "/infra-discovery" },
        { name: "Tier Benefits", href: "/partners" },
        { name: "Partner Dashboard", href: "/admin/partners" },
      ],
    },
    {
      title: "Community",
      icon: Users,
      color: "#00d4aa",
      items: [
        { name: "Discord", href: "https://discord.gg/sui" },
        { name: "FAQ", href: "/contact" },
        { name: "Support", href: "/contact" },
      ],
    },
  ]

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-modern text-center space-y-6">
          <RevealSection>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa] mb-4">Documentation</p>
            <h1 className="text-4xl md:text-6xl font-bold font-[var(--font-display)]">
              {'Atlas '}
              <span className="text-gradient">Documentation</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4 leading-relaxed">
              Learn how to use Atlas Protocol, integrate with our API, and get the most out of the Sui ecosystem.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* Doc Sections Grid */}
      <section className="section-default container-modern">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, i) => {
            const Icon = section.icon
            return (
              <RevealSection key={section.title} delay={i * 80} className="glass-panel p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="h-6 w-6 icon-glow" style={{ color: section.color }} />
                  <h3 className="font-semibold text-foreground text-lg">{section.title}</h3>
                </div>
                <ul className="space-y-2.5">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm text-muted-foreground hover:text-[#4d9fff] transition-colors flex items-center gap-1.5 group"
                      >
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: section.color }} />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </RevealSection>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 relative overflow-hidden" style={{
        background: 'linear-gradient(180deg, rgba(249,115,22,0.85) 0%, rgba(60,25,0,0.9) 60%, #080d14 100%)'
      }}>
        <div className="container-modern text-center space-y-6 relative z-10">
          <RevealSection>
            <h2 className="text-3xl font-bold text-white font-[var(--font-display)]">{"Can't Find What You Need?"}</h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto mt-4">Reach out to our support team</p>
            <div className="mt-8">
              <a href="/contact">
                <button className="bg-white text-[#080d14] font-bold rounded-full px-8 py-3 hover:bg-white/90 transition-all hover:-translate-y-1 shadow-lg">
                  Contact Support <ArrowRight className="h-4 w-4 inline ml-1" />
                </button>
              </a>
            </div>
          </RevealSection>
        </div>
      </section>
    </main>
  )
}
