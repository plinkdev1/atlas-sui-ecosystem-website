"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { RevealSection } from "@/components/reveal-section"

export default function AboutPage() {
  return (
    <main className="bg-background">
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-24 md:pt-32">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-8 text-center relative z-10">
          <RevealSection>
          <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Our Story</p>
          <h1 className="heading-hero">About Atlas Protocol</h1>
          <p className="text-subtitle mx-auto max-w-2xl">
            The definitive knowledge, discovery, and entry portal for the Sui ecosystem
          </p>
          </RevealSection>
        </div>
      </section>

      <section className="section-default container-modern">
        <RevealSection delay={100}>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="heading-section">Our Mission</h2>
            <p className="text-body">
              Atlas Protocol makes the Sui ecosystem discoverable and accessible. We aggregate protocols, infrastructure providers, and tools into a single hub, reducing friction for users and developers.
            </p>
            <p className="text-body">
              We believe great infrastructure enables great applications. Our goal: eliminate information fragmentation and enable seamless interaction with everything Sui.
            </p>
          </div>
          <div className="card-modern p-8 space-y-4">
            <h3 className="font-semibold text-foreground">Why We Built This</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="text-[#2B7FFF]">→</span>
                <span>Sui has 100+ protocols but no central discovery hub</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#2B7FFF]">→</span>
                <span>Users waste hours finding, comparing, and evaluating services</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#2B7FFF]">→</span>
                <span>Infrastructure providers lack visibility</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#2B7FFF]">→</span>
                <span>Developers need curated, verified information</span>
              </li>
            </ul>
          </div>
        </div>
        </RevealSection>
      </section>

      <section className="section-default container-modern">
        <RevealSection delay={150}>
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="heading-section">Our Values</h2>
            <p className="text-subtitle">Principles guiding every decision</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Open",
                desc: "We believe in transparent, permissionless participation. The Sui ecosystem belongs to everyone.",
              },
              {
                title: "Curated",
                desc: "We verify providers and vet protocols. Quality over quantity. Your safety matters.",
              },
              {
                title: "Community-Driven",
                desc: "Sui is built by its community. We listen, adapt, and grow together.",
              },
            ].map((value) => (
              <div key={value.title} className="card-modern p-6 space-y-4">
                <h3 className="font-semibold text-foreground">{value.title}</h3>
                <p className="text-sm text-body">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
        </RevealSection>
      </section>

      <section className="section-default container-modern">
        <RevealSection delay={200}>
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="heading-section">Vision</h2>
            <p className="text-subtitle mx-auto max-w-2xl">
              Atlas Protocol is the first step towards a unified, discoverable crypto ecosystem
            </p>
          </div>

          <div className="card-modern-blue p-12 space-y-6">
            <p className="text-body">
              We're starting with Sui. Over time, Atlas expands to support all major ecosystems. Imagine: one place to discover, understand, and interact with the entire crypto infrastructure. That's the vision.
            </p>
            <p className="text-body">
              We're building the layer that sits above all others — the entry point, the knowledge base, the trusted directory.
            </p>
          </div>
        </div>
        </RevealSection>
      </section>

      <section className="section-default container-modern">
        <RevealSection delay={250}>
        <div className="card-modern-blue p-12 text-center space-y-6 rounded-3xl">
          <h2 className="heading-section">Join Us</h2>
          <p className="text-subtitle">Help build the infrastructure hub for Sui</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://discord.gg/sui">
              <Button className="button-primary-modern">
                Join Community →
              </Button>
            </a>
            <a href="/contact">
              <Button className="button-secondary-modern">
                Get in Touch
              </Button>
            </a>
          </div>
        </div>
        </RevealSection>
      </section>
    </main>
  )
}

