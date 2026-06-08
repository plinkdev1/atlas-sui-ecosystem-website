import { Mail, ArrowLeft, Zap, Code2, Megaphone, Building2 } from "lucide-react"
import Link from "next/link"
import { RevealSection } from "@/components/reveal-section"
import { PartnershipContactForm } from "@/components/partnership-contact-form"

export const metadata = {
  title: "Partnership Inquiry - Atlas Protocol",
  description: "Connect with Atlas Protocol for partnerships, integrations, and collaboration opportunities.",
}

const partnerTypes = [
  {
    icon: Zap,
    title: "Strategic Partnerships",
    desc: "Ecosystem integrations and long-term alliances",
  },
  {
    icon: Code2,
    title: "Developer Integration",
    desc: "API access and technical integration support",
  },
  {
    icon: Megaphone,
    title: "Brand Collaboration",
    desc: "Marketing and co-branded partnership opportunities",
  },
  {
    icon: Building2,
    title: "Provider Registration",
    desc: "List your infrastructure service on Atlas",
  },
]

export default function PartnershipContactPage() {
  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="section-gradient-blue container-modern relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <RevealSection>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Collaborate</p>
            <h1 className="heading-hero">Partner with Atlas Protocol</h1>
            <p className="text-subtitle mx-auto max-w-2xl">
              We're always looking for strategic partnerships, integrations, and collaboration opportunities.
              Let's build the future of Sui infrastructure together.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* Content */}
      <section className="section-default container-modern">
        <RevealSection delay={100}>
          <div className="grid gap-12 md:grid-cols-2">
            {/* Left column — info */}
            <div className="space-y-10">
              <div>
                <h2 className="heading-section mb-4">Get in Touch</h2>
                <p className="text-body mb-6">
                  Fill out the form and our team will reach out to discuss your partnership or collaboration ideas.
                </p>

                <div className="feature-card">
                  <div className="icon-badge">
                    <Mail className="h-5 w-5 text-[#2B7FFF]" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Email</p>
                    <a
                      href="mailto:partnerships@atlasprotocol.space"
                      className="text-[#2B7FFF] text-sm hover:text-[#00d4aa] transition-colors"
                    >
                      partnerships@atlasprotocol.space
                    </a>
                  </div>
                </div>
              </div>

              {/* Partner types */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Partnership Types</h3>
                {partnerTypes.map((pt) => (
                  <div key={pt.title} className="feature-card">
                    <div className="icon-badge">
                      <pt.icon className="h-4 w-4 text-[#2B7FFF]" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{pt.title}</p>
                      <p className="text-muted-foreground text-xs">{pt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — form */}
            <div className="card-modern p-8">
              <PartnershipContactForm />
            </div>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
