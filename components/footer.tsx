"use client"

import { useState } from "react"
import { AdCarousel } from "@/components/ad-carousel"
import { AdManagementModal } from "@/components/ad-management-modal"
import { INITIAL_ADS } from "@/lib/ads-data"
import type { FooterAd } from "@/lib/ads-data"

export function Footer() {
  const [ads, setAds] = useState<FooterAd[]>(INITIAL_ADS)
  const [showAdModal, setShowAdModal] = useState(false)

  return (
    <footer className="mt-20 footer-modern relative overflow-hidden">
      {/* Mesh dot overlay */}
      <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none z-0" aria-hidden="true" />
      
      {/* Ad Carousel Section */}
      <div className="container mx-auto px-4 py-8 md:py-10 relative z-10">
        <div 
          className="glass-panel p-6 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(77,159,255,0.15)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Featured Partners</h3>
            <button
              onClick={() => setShowAdModal(true)}
              className="text-xs text-[#4d9fff] hover:text-[#00d4aa] transition-colors font-medium"
            >
              Manage Ads
            </button>
          </div>
          <AdCarousel ads={ads} />
        </div>
      </div>

      {/* Gradient Divider */}
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="h-px" style={{background: 'linear-gradient(90deg, transparent, rgba(77,159,255,0.3), rgba(0,212,170,0.3), transparent)'}} />
      </div>

      {/* Footer Content */}
      <div className="container mx-auto px-4 py-10 md:py-14 relative z-10">
        <div className="grid gap-8 md:grid-cols-5">
          <div>
            <h4 className="mb-4 font-bold text-foreground text-lg">
              <span className="text-gradient">Atlas Protocol</span>
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Infrastructure & Security Hub for Sui blockchain. Complete interaction with everything Sui.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Tools</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/tools/wallet-cleanup" className="text-muted-foreground hover:text-foreground transition-colors">
                  Wallet Cleanup
                </a>
              </li>
              <li>
                <a
                  href="/tools/transaction-explainer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Transaction Explainer
                </a>
              </li>
              <li>
                <a href="/tools/swap" className="text-muted-foreground hover:text-foreground transition-colors">
                  Swap Aggregator
                </a>
              </li>
              <li>
                <a href="/tools/bridge" className="text-muted-foreground hover:text-foreground transition-colors">
                  Bridge Hub
                </a>
              </li>
              <li>
                <a href="/tools/stake" className="text-muted-foreground hover:text-foreground transition-colors">
                  Stake Hub
                </a>
              </li>
              <li>
                <a href="/tools/oracle-feeds" className="text-muted-foreground hover:text-foreground transition-colors">
                  Oracle Feeds
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Protocols</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/protocols/dex" className="text-muted-foreground hover:text-foreground transition-colors">DEXes</a></li>
              <li><a href="/protocols/wallets" className="text-muted-foreground hover:text-foreground transition-colors">Wallets</a></li>
              <li><a href="/protocols/lending" className="text-muted-foreground hover:text-foreground transition-colors">Lending</a></li>
              <li><a href="/protocols/liquid-staking" className="text-muted-foreground hover:text-foreground transition-colors">Liquid Staking</a></li>
              <li><a href="/protocols/bridges" className="text-muted-foreground hover:text-foreground transition-colors">Bridges</a></li>
              <li><a href="/protocols/perps" className="text-muted-foreground hover:text-foreground transition-colors">Perps</a></li>
              <li><a href="/protocols/nft" className="text-muted-foreground hover:text-foreground transition-colors">NFTs</a></li>
              <li><a href="/protocols/gaming" className="text-muted-foreground hover:text-foreground transition-colors">Gaming</a></li>
              <li><a href="/protocols/socialfi" className="text-muted-foreground hover:text-foreground transition-colors">SocialFi</a></li>
              <li><a href="/protocols/depin" className="text-muted-foreground hover:text-foreground transition-colors">DePIN</a></li>
              <li><a href="/protocols/ai-agents" className="text-muted-foreground hover:text-foreground transition-colors">AI Agents</a></li>
              <li><a href="/protocols/rwa" className="text-muted-foreground hover:text-foreground transition-colors">RWA</a></li>
              <li><a href="/protocols/identity" className="text-muted-foreground hover:text-foreground transition-colors">Identity</a></li>
              <li><a href="/protocols/oracles" className="text-muted-foreground hover:text-foreground transition-colors">Oracles</a></li>
              <li><a href="/protocols/btc-primitives" className="text-muted-foreground hover:text-foreground transition-colors">BTC Primitives</a></li>
              <li><a href="/protocols/launchpads" className="text-muted-foreground hover:text-foreground transition-colors">Launchpads</a></li>
              <li><a href="/protocols/storage" className="text-muted-foreground hover:text-foreground transition-colors">Storage</a></li>
              <li><a href="/protocols/hardware-wallets" className="text-muted-foreground hover:text-foreground transition-colors">Hardware Wallets</a></li>
              <li><a href="/protocols/prediction-markets" className="text-muted-foreground hover:text-foreground transition-colors">Prediction Markets</a></li>
              <li><a href="/protocols" className="text-primary hover:text-primary/80 font-medium transition-colors">View All →</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/infra-discovery" className="text-muted-foreground hover:text-foreground transition-colors">
                  Infra Directory
                </a>
              </li>
              <li>
                <a href="/provider-dashboard" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Provider Dashboard →
                </a>
              </li>
              <li>
                <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="/partners" className="text-muted-foreground hover:text-foreground transition-colors">
                  Partners
                </a>
              </li>
              <li>
                <a href="/rfp-deliverables" className="text-muted-foreground hover:text-foreground transition-colors">
                  RFP Deliverables
                </a>
              </li>
              <li>
                <a href="/settings" className="text-muted-foreground hover:text-foreground transition-colors">
                  Settings
                </a>
              </li>
              <li>
                <a href="/subscription" className="text-muted-foreground hover:text-foreground transition-colors">
                  Subscription
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/sui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/SuiNetwork"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-8 text-center text-sm text-muted-foreground">
          <div className="h-px mb-8 mx-auto max-w-lg" style={{background: 'linear-gradient(90deg, transparent, rgba(77,159,255,0.2), transparent)'}} />
          <p>&copy; {new Date().getFullYear()} Atlas Protocol. All rights reserved.</p>
        </div>
      </div>

      {/* Ad Management Modal */}
      <AdManagementModal open={showAdModal} onOpenChange={setShowAdModal} />
    </footer>
  )
}
