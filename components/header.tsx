"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"
import { useTheme } from "@/lib/theme-provider"
import { ChevronDown, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { memo, useState } from "react"

function HeaderComponent() {
  const router = useRouter()
  const { theme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [protocolsDropdown, setProtocolsDropdown] = useState(false)
  const [toolsDropdown, setToolsDropdown] = useState(false)

  const toolsMenu = [
    { label: "Wallet Cleanup", href: "/tools/wallet-cleanup" },
    { label: "Transaction Explainer", href: "/tools/transaction-explainer" },
    { label: "Swap Aggregator", href: "/tools/swap" },
    { label: "Bridge Hub", href: "/tools/bridge" },
    { label: "Stake Hub", href: "/tools/stake" },
    { label: "Oracle Feeds", href: "/tools/oracle-feeds" },
  ]

  const protocolsMenu = [
    { label: "All Protocols", href: "/protocols" },
    { label: "DEX", href: "/protocols/dex" },
    { label: "Wallets", href: "/protocols/wallets" },
    { label: "Bridges", href: "/protocols/bridges" },
    { label: "Perps", href: "/protocols/perps" },
    { label: "Lending", href: "/protocols/lending" },
    { label: "Oracles", href: "/protocols/oracles" },
    { label: "BTC Primitives", href: "/protocols/btc-primitives" },
    { label: "NFT", href: "/protocols/nft" },
    { label: "Gaming", href: "/protocols/gaming" },
    { label: "SocialFi", href: "/protocols/socialfi" },
    { label: "DePIN", href: "/protocols/depin" },
    { label: "AI Agents", href: "/protocols/ai-agents" },
    { label: "Liquid Staking", href: "/protocols/liquid-staking" },
    { label: "RWA", href: "/protocols/rwa" },
    { label: "Identity", href: "/protocols/identity" },
    { label: "Launchpads", href: "/protocols/launchpads" },
    { label: "Storage", href: "/protocols/storage" },
    { label: "Hardware Wallets", href: "/protocols/hardware-wallets" },
    { label: "Prediction Markets", href: "/protocols/prediction-markets" },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 pt-safe">
        {/* Glassmorphic background — matches design reference nav */}
        <div className="absolute inset-0 backdrop-blur-md" style={{
          background: theme === 'dark' ? 'rgba(8,13,20,0.7)' : 'rgba(248,250,255,0.9)',
          borderBottom: theme === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(43,127,255,0.1)',
        }} />

        <div className="relative max-w-full px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          {/* Desktop Nav with Mega-Menus */}
          <div className="hidden md:flex items-center gap-0">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="hover:text-primary">
              Home
            </Button>

            {/* Tools Dropdown */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 hover:text-primary flex items-center"
              >
                Tools
                <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform" />
              </Button>
              <div className="absolute left-0 mt-0 w-52 rounded-xl glass-panel py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200" style={{ transform: 'none' }}>
                {toolsMenu.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-[#4d9fff]/10 hover:text-[#4d9fff] transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Protocols Dropdown */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 hover:text-primary flex items-center"
              >
                Protocols
                <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform" />
              </Button>
              <div className="absolute left-0 mt-0 w-56 rounded-xl glass-panel py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 max-h-[28rem] overflow-y-auto" style={{ transform: 'none' }}>
                {protocolsMenu.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-[#4d9fff]/10 hover:text-[#4d9fff] transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={() => router.push("/infra-discovery")} className="hover:text-primary">
              Infra Directory
            </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push("/partners")} className="hover:text-primary">
              Partners
            </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push("/docs")} className="hover:text-primary">
              Docs
            </Button>
          </div>

          {/* Right Side - Theme + Open App + Mobile Menu */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Menu */}
            <UserMenu />

            {/* Open App CTA Button - Premium gradient */}
            <a
              href="https://app.atlasprotocol.space"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block"
            >
              <button className="btn-brand-gradient text-sm">
                Open App
                <span>→</span>
              </button>
            </a>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 dark:border-white/5 bg-background/90 backdrop-blur">
            <div className="px-4 py-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  router.push("/")
                  setMobileMenuOpen(false)
                }}
              >
                Home
              </Button>

              {/* Mobile Tools Section */}
              <div>
                <button
                  onClick={() => setToolsDropdown(!toolsDropdown)}
                  className="w-full text-left px-2 py-2 text-sm font-semibold hover:text-primary flex items-center justify-between"
                >
                  Tools
                  <ChevronDown className={`h-4 w-4 transition-transform ${toolsDropdown ? "rotate-180" : ""}`} />
                </button>
                {toolsDropdown && (
                  <div className="pl-4 space-y-1 border-l border-primary/20">
                    {toolsMenu.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => {
                          router.push(item.href)
                          setMobileMenuOpen(false)
                        }}
                        className="w-full text-left px-2 py-2 text-xs hover:text-primary transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Protocols Section */}
              <div>
                <button
                  onClick={() => setProtocolsDropdown(!protocolsDropdown)}
                  className="w-full text-left px-2 py-2 text-sm font-semibold hover:text-primary flex items-center justify-between"
                >
                  Protocols
                  <ChevronDown className={`h-4 w-4 transition-transform ${protocolsDropdown ? "rotate-180" : ""}`} />
                </button>
                {protocolsDropdown && (
                  <div className="pl-4 space-y-1 border-l border-primary/20 max-h-48 overflow-y-auto">
                    {protocolsMenu.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => {
                          router.push(item.href)
                          setMobileMenuOpen(false)
                        }}
                        className="w-full text-left px-2 py-2 text-xs hover:text-primary transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  router.push("/infra-discovery")
                  setMobileMenuOpen(false)
                }}
              >
                Infra Directory
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  router.push("/partners")
                  setMobileMenuOpen(false)
                }}
              >
                Partners
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  router.push("/docs")
                  setMobileMenuOpen(false)
                }}
              >
                Docs
              </Button>

              <div className="border-t border-white/10 dark:border-white/5 my-2 pt-2">
                <a
                  href="https://app.atlasprotocol.space"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <button className="btn-brand-gradient w-full justify-center text-sm" onClick={() => setMobileMenuOpen(false)}>
                    Open App →
                  </button>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}

export const Header = memo(HeaderComponent)
