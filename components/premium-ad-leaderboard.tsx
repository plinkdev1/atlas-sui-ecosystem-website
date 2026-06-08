"use client"

import { Mail, Zap, Crown } from "lucide-react"
import { ZktxAppsCarousel } from "./zktx-apps-carousel"

export function PremiumAdLeaderboard() {
  return (
    <div className="mt-12 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/25 via-primary/15 to-accent/10 border border-primary/30 backdrop-blur-md p-8 md:p-10 hover:border-primary/50 transition-all dark:from-primary/20 dark:via-primary/10 dark:to-accent/5 dark:border-primary/25 dark:hover:border-primary/40 dark:shadow-lg dark:shadow-primary/10">
      <div className="relative">
        {/* Background gradient accent for dark mode */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 dark:from-primary/0 dark:via-primary/10 dark:to-accent/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>

        <div className="relative z-10">
          {/* zktx Apps Carousel Section - NOW AT TOP */}
          <div className="mb-12 pb-12 border-b border-primary/20 dark:border-primary/30">
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-foreground dark:text-foreground mb-2">Featured Projects</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Explore innovative apps built on Sui</p>
            </div>
            <ZktxAppsCarousel />
          </div>

          {/* Premium Ad Slot Section - MOVED BELOW CAROUSEL */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left content section */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 dark:bg-primary/30 dark:border-primary/40">
                <Zap className="h-3 w-3 text-primary" />
                <span className="text-xs font-semibold text-primary dark:text-primary-foreground uppercase tracking-wide">
                  Premium Ad Slot
                </span>
              </div>

              <h3 className="mb-3 text-2xl md:text-3xl font-bold text-foreground dark:text-foreground">
                Promote Your Project
              </h3>

              <p className="mb-6 text-muted-foreground dark:text-muted-foreground max-w-md text-sm md:text-base">
                Reach thousands of blockchain infrastructure professionals and builders. Premium placement available for
                ecosystem partners and sponsors.
              </p>

              <button
                onClick={() => window.open("mailto:partners@atlasprotocol.io", "_blank")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground dark:text-primary-foreground font-semibold transition-all hover:shadow-lg dark:hover:shadow-primary/20 text-sm md:text-base"
              >
                <Mail className="h-4 w-4" />
                Reserve Your Slot
              </button>
            </div>

            {/* Right side visual accent */}
            <div className="hidden md:flex items-center justify-center w-48 h-40">
              <div className="relative w-40 h-40">
                {/* Glowing orb background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-2xl dark:from-primary/40 dark:to-accent/20"></div>

                {/* Premium badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Crown className="w-12 h-12 text-primary dark:text-accent mb-2 mx-auto" />
                    <div className="text-xs font-bold text-primary dark:text-accent">PREMIUM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Responsive info grid */}
          <div className="mt-8 pt-8 border-t border-primary/20 dark:border-primary/30 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold text-primary dark:text-accent">10K+</div>
              <div className="text-xs text-muted-foreground dark:text-muted-foreground">Monthly Visitors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary dark:text-accent">50+</div>
              <div className="text-xs text-muted-foreground dark:text-muted-foreground">Partner Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary dark:text-accent">24/7</div>
              <div className="text-xs text-muted-foreground dark:text-muted-foreground">Display Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary dark:text-accent">∞</div>
              <div className="text-xs text-muted-foreground dark:text-muted-foreground">Brand Exposure</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
