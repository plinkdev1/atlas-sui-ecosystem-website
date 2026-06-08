"use client"

import { Button } from "@/components/ui/button"
import { Mail, MessageCircle } from "lucide-react"
import { RevealSection } from "@/components/reveal-section"

export default function ContactPage() {
  return (
    <main className="bg-background">
      <section className="section-gradient-blue container-modern relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-8 text-center relative z-10">
          <RevealSection>
          <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Support</p>
          <h1 className="heading-hero">Get in Touch</h1>
          <p className="text-subtitle mx-auto max-w-2xl">
            Have questions, partnership inquiries, or feedback? We'd love to hear from you.
          </p>
          </RevealSection>
        </div>
      </section>

      <section className="section-default container-modern">
        <RevealSection delay={100}>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="heading-section mb-4">Contact Information</h2>
              <div className="space-y-6">
                <div className="feature-card">
                  <div className="icon-badge">
                    <Mail className="h-5 w-5 text-[#2B7FFF]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Email</p>
                    <p className="text-muted-foreground text-sm">team@atlasprotocol.space</p>
                  </div>
                </div>

                <div className="feature-card">
                  <div className="icon-badge">
                    <MessageCircle className="h-5 w-5 text-[#2B7FFF]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Discord</p>
                    <p className="text-muted-foreground text-sm mb-2">Join our community server</p>
                    <a href="https://discord.gg/sui" className="text-[#2B7FFF] text-sm font-semibold hover:text-[#00d4aa] transition-colors">
                      Discord Community →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="heading-subsection mb-4">Response Time</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• General inquiries: 24 hours</li>
                <li>• Partnership requests: 48 hours</li>
                <li>• Support issues: 4 hours (business hours)</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="heading-section">Send us a Message</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-xl bg-background/60 border border-[rgba(43,127,255,0.2)] text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#2B7FFF] transition-colors"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 rounded-xl bg-background/60 border border-[rgba(43,127,255,0.2)] text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#2B7FFF] transition-colors"
              />
              <select className="w-full px-4 py-3 rounded-xl bg-background/60 border border-[rgba(43,127,255,0.2)] text-foreground focus:outline-none focus:border-[#2B7FFF] transition-colors">
                <option>Select Inquiry Type</option>
                <option>General Question</option>
                <option>Partnership</option>
                <option>Provider Listing</option>
                <option>Bug Report</option>
                <option>Feature Request</option>
              </select>
              <textarea
                placeholder="Your Message"
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-background/60 border border-[rgba(43,127,255,0.2)] text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#2B7FFF] transition-colors"
              />
              <Button className="w-full button-primary-modern">
                Send Message →
              </Button>
            </form>
          </div>
        </div>
        </RevealSection>
      </section>

      <section className="section-default container-modern">
        <RevealSection delay={200}>
        <div className="card-modern-blue p-12 text-center space-y-6 rounded-3xl">
          <h2 className="heading-section">Join the Community</h2>
          <p className="text-subtitle">Connect with builders, developers, and users in Sui ecosystem</p>
          <a href="https://discord.gg/sui">
            <Button className="button-primary-modern">
              Join Discord →
            </Button>
          </a>
        </div>
        </RevealSection>
      </section>
    </main>
  )
}
