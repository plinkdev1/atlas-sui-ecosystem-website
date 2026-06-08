"use client"

import { ArrowRight, Mail } from "lucide-react"
import { useNetwork } from "@/lib/network-context"
import { PARTNERS, getFeaturedPartners } from "@/lib/partners-data"
import { BrandLogo } from "@/components/brand-logo"
import { getBrandLogo } from "@/lib/brand-logos-client"
import { PremiumAdLeaderboard } from "./premium-ad-leaderboard"

export function EcosystemPartnersSection() {
  const { network, getChainGroup } = useNetwork()
  const isSuiChain = getChainGroup() === "Sui"
  const isChainSupported = true

  const displayPartners = isSuiChain ? PARTNERS : getFeaturedPartners()

  return (
    <section className="py-16 md:py-20">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">Ecosystem Partners</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Trusted projects powering and supporting the multichain future
        </p>
      </div>

      <div className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border border-primary/30 backdrop-blur-sm p-8 md:p-12 hover:border-primary/50 transition-all dark:from-primary/30 dark:via-primary/20 dark:to-primary/10">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-sm text-primary dark:bg-primary/40 dark:border-primary/50 dark:text-primary-foreground">
              Featured Partner
            </div>
            <h3 className="mb-3 text-2xl font-bold text-foreground">Blockberry</h3>
            <p className="mb-4 text-muted-foreground">
              The backbone of blockchain data infrastructure. Blockberry powers Suiscan and provides industry-leading
              indexing, analytics, and real-time data access for Sui and multiple blockchains.
            </p>
            <button
              onClick={() => window.open("https://blockberry.one", "_blank")}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium transition-all hover:shadow-lg"
            >
              Visit Blockberry
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-center">
            <BrandLogo name="Blockberry" logoUrl={getBrandLogo("Blockberry")} size="lg" />
          </div>
        </div>
      </div>

      <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayPartners.map((partner) => (
          <div
            key={partner.id}
            onClick={() => window.open(partner.website, "_blank")}
            className="group relative overflow-hidden rounded-xl bg-card border border-primary/20 backdrop-blur-sm p-6 hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/20 dark:bg-gradient-to-br dark:from-gray-900/60 dark:to-gray-800/40 dark:border-primary/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/5 transition-all dark:from-primary/0 dark:to-primary/0 dark:group-hover:from-primary/10 dark:group-hover:to-primary/10"></div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-4">
                <BrandLogo name={partner.name} logoUrl={getBrandLogo(partner.name)} size="lg" />
              </div>

              <h3 className="font-bold text-foreground mb-1">{partner.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-grow">{partner.tagline}</p>

              {partner.badge && (
                <div className="mb-4 inline-block px-2 py-1 rounded text-xs font-medium bg-primary/20 text-primary dark:bg-primary/40 dark:text-primary-foreground border border-primary/30">
                  {partner.badge}
                </div>
              )}

              <button className="w-full py-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary dark:bg-primary/40 dark:hover:bg-primary/50 dark:text-primary-foreground font-medium transition-all text-sm border border-primary/30 hover:border-primary/50 flex items-center justify-center gap-2">
                Learn More
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}

        <div className="group relative overflow-hidden rounded-xl bg-card border border-dashed border-border backdrop-blur-sm p-6 hover:border-primary/50 transition-all flex flex-col items-center justify-center min-h-64 dark:bg-gradient-to-br dark:from-gray-900/60 dark:to-gray-800/40">
          <div className="relative z-10 text-center">
            <div className="mb-4 text-4xl">🤝</div>
            <h3 className="font-bold text-foreground mb-2">Become a Partner</h3>
            <p className="text-sm text-muted-foreground mb-4">Join leading infrastructure projects in our ecosystem.</p>
            <button
              onClick={() => window.open("mailto:partners@atlasprotocol.io", "_blank")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium transition-all text-sm border border-border hover:border-primary/50"
            >
              <Mail className="h-3 w-3" />
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {!isSuiChain && (
        <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-4 text-center dark:bg-yellow-900/20 dark:border-yellow-700/40">
          <p className="text-sm text-yellow-600 dark:text-yellow-300">
            Full ecosystem integration available on Sui networks. Switch to Sui for complete partner access.
          </p>
        </div>
      )}

      {isChainSupported && <PremiumAdLeaderboard />}
    </section>
  )
}
