"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { QrCode, Search } from "lucide-react"
import { toast } from "react-toastify"
import { getReownWalletLogo, getReownWalletLogoFallbacks } from "@/lib/reown-wallet-logos"
import { GlassCard } from "@/components/glass-card"

// Curated list of popular wallets with Sui support info
const REOWN_WALLETS = [
  // Native Sui wallets (with logos)
  { id: "slush", name: "Slush", logo: "/logos/wallet-slush.png", suiSupport: true, category: "Native Sui" },
  { id: "suiet", name: "Suiet", logo: "/logos/wallet-suiet.png", suiSupport: true, category: "Native Sui" },
  {
    id: "martian",
    name: "Martian Sui Wallet",
    logo: "/logos/wallet-martian.png",
    suiSupport: true,
    category: "Native Sui",
  },
  { id: "nightly", name: "Nightly", logo: "/logos/wallet-nightly.png", suiSupport: true, category: "Native Sui" },
  { id: "phantom", name: "Phantom", logo: "/logos/wallet-phantom.png", suiSupport: true, category: "Native Sui" },
  { id: "okx", name: "OKX Wallet", logo: "/logos/wallet-okx.png", suiSupport: true, category: "Native Sui" },
  {
    id: "tokenpocket",
    name: "TokenPocket",
    logo: "/logos/wallet-tockenpocket.png",
    suiSupport: true,
    category: "Native Sui",
  },
  {
    id: "glasswallet",
    name: "GlassWallet",
    logo: "/logos/wallet-glasswallet.png",
    suiSupport: true,
    category: "Native Sui",
  },
  { id: "onekey", name: "OneKey Wallet", logo: "/logos/wallet-onekey.png", suiSupport: true, category: "Native Sui" },
  {
    id: "surfwallet",
    name: "Surf Wallet",
    logo: "/logos/wallet-surfwallet.png",
    suiSupport: true,
    category: "Native Sui",
  },

  // Multi-chain wallets with Sui support
  {
    id: "metamask",
    name: "MetaMask",
    logo: undefined, // Removed Clearbit URL, use getReownWalletLogo
    suiSupport: false,
    category: "Multi-chain EVM",
  },
  {
    id: "trust",
    name: "Trust Wallet",
    logo: undefined, // Removed Clearbit URL, use getReownWalletLogo
    suiSupport: true,
    category: "Multi-chain",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    logo: undefined, // Removed Clearbit URL
    suiSupport: false,
    category: "Multi-chain EVM",
  },
  {
    id: "rainbow",
    name: "Rainbow Wallet",
    logo: undefined, // Removed Clearbit URL
    suiSupport: false,
    category: "Multi-chain EVM",
  },
  {
    id: "ledger",
    name: "Ledger Live",
    logo: undefined, // Removed Clearbit URL
    suiSupport: true,
    category: "Hardware",
  },
  {
    id: "keystone",
    name: "Keystone",
    logo: undefined, // Removed Clearbit URL
    suiSupport: true,
    category: "Hardware",
  },
  {
    id: "argent",
    name: "Argent",
    logo: undefined, // Removed Clearbit URL
    suiSupport: false,
    category: "Smart Wallet",
  },
  {
    id: "safe",
    name: "Safe",
    logo: undefined, // Removed Clearbit URL
    suiSupport: false,
    category: "Smart Wallet",
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    logo: undefined, // Removed Clearbit URL
    suiSupport: true,
    category: "Bridge",
  },
  {
    id: "blocto",
    name: "Blocto",
    logo: undefined, // Removed Clearbit URL
    suiSupport: true,
    category: "Multi-chain",
  },
  {
    id: "bitkeep",
    name: "BitKeep",
    logo: undefined, // Removed Clearbit URL
    suiSupport: true,
    category: "Multi-chain",
  },
  {
    id: "mathwallet",
    name: "Math Wallet",
    logo: undefined, // Removed Clearbit URL
    suiSupport: true,
    category: "Multi-chain",
  },
  {
    id: "tokenonk",
    name: "Toki",
    logo: undefined, // Removed Clearbit URL
    suiSupport: true,
    category: "Multi-chain",
  },
  {
    id: "hyperpay",
    name: "HyperPay",
    logo: undefined, // Removed Clearbit URL
    suiSupport: true,
    category: "Multi-chain",
  },
  {
    id: "nabox",
    name: "Nabox",
    logo: undefined, // Removed Clearbit URL
    suiSupport: false,
    category: "Multi-chain",
  },
  {
    id: "xdefi",
    name: "XDEFI Wallet",
    logo: undefined, // Removed Clearbit URL
    suiSupport: true,
    category: "Multi-chain",
  },
  {
    id: "imtoken",
    name: "imToken",
    logo: undefined, // Removed Clearbit URL
    suiSupport: true,
    category: "Multi-chain",
  },
  {
    id: "dapper",
    name: "Dapper",
    logo: undefined, // Removed Clearbit URL
    suiSupport: false,
    category: "NFT Wallet",
  },
  {
    id: "uniswap",
    name: "Uniswap Wallet",
    logo: undefined, // Removed Clearbit URL
    suiSupport: false,
    category: "DEX Wallet",
  },
  {
    id: "zerion",
    name: "Zerion",
    logo: undefined, // Removed Clearbit URL
    suiSupport: false,
    category: "Portfolio",
  },
  {
    id: "zapper",
    name: "Zapper",
    logo: undefined, // Removed Clearbit URL
    suiSupport: false,
    category: "Portfolio",
  },
  { id: "exodus", name: "Exodus", logo: undefined, suiSupport: false, category: "Desktop" }, // Removed URL
  {
    id: "atomic",
    name: "Atomic Wallet",
    logo: undefined, // Removed Clearbit URL
    suiSupport: false,
    category: "Desktop",
  },
  {
    id: "trezor",
    name: "Trezor Suite",
    logo: undefined, // Removed Clearbit URL
    suiSupport: false,
    category: "Hardware",
  },
  {
    id: "lattice",
    name: "Lattice1",
    logo: undefined, // Removed Clearbit URL
    suiSupport: false,
    category: "Hardware",
  },
  {
    id: "helium",
    name: "Helium Wallet",
    logo: undefined, // Removed Clearbit URL
    suiSupport: false,
    category: "Mobile",
  },
  {
    id: "anchor",
    name: "Anchor Wallet",
    logo: undefined, // Removed Clearbit URL
    suiSupport: false,
    category: "Protocol",
  },
]

interface ReownWalletModalProps {
  isOpen: boolean
  onClose: () => void
  onWalletSelect: (walletId: string) => void
}

interface ReownWallet {
  id: string
  name: string
  logo?: string
  suiSupport: boolean
  category: string
}

export function ReownWalletModal({ isOpen, onClose, onWalletSelect }: ReownWalletModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredWallets, setFilteredWallets] = useState(REOWN_WALLETS)
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [showQRPrompt, setShowQRPrompt] = useState(false)
  const [imageErrors, setImageErrors] = useState<Record<string, number>>({}) // Track retry count per wallet
  const [logoSources, setLogoSources] = useState<Record<string, string>>({}) // Track current logo source per wallet

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim()
    const filtered = query
      ? REOWN_WALLETS.filter(
          (w) =>
            w.name.toLowerCase().includes(query) ||
            w.category.toLowerCase().includes(query) ||
            (w.suiSupport && query.includes("sui")),
        )
      : REOWN_WALLETS

    setFilteredWallets(filtered)
  }, [searchQuery])

  const handleImageError = (walletId: string) => {
    setImageErrors((prev) => {
      const currentRetries = prev[walletId] || 0
      const fallbacks = getReownWalletLogoFallbacks(walletId)

      // If we have more fallbacks to try, use next one
      if (currentRetries + 1 < fallbacks.length) {
        setLogoSources((prevSources) => ({
          ...prevSources,
          [walletId]: fallbacks[currentRetries + 1],
        }))
      }

      return { ...prev, [walletId]: currentRetries + 1 }
    })
  }

  const getWalletInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleWalletSelect = (walletId: string) => {
    const wallet = REOWN_WALLETS.find((w) => w.id === walletId)

    if (wallet && !wallet.suiSupport) {
      toast.warning(`${wallet.name} does not support Sui. Please select a Sui-enabled wallet.`, {
        position: "top-right",
        autoClose: 4000,
      })
      return
    }

    setSelectedWallet(walletId)

    // For mobile, show QR prompt
    if (/mobile|android|iphone/i.test(navigator.userAgent)) {
      setShowQRPrompt(true)
    } else {
      // Desktop - proceed with connection
      onWalletSelect(walletId)
      onClose()
    }
  }

  const handleQRConnect = () => {
    if (selectedWallet) {
      onWalletSelect(selectedWallet)
      setShowQRPrompt(false)
      onClose()
    }
  }

  const categories = [
    "Native Sui",
    "Multi-chain",
    "Hardware",
    "Smart Wallet",
    "Bridge",
    "Desktop",
    "Mobile",
    "Portfolio",
    "NFT Wallet",
    "DEX Wallet",
    "Protocol",
  ]

  const getWalletLogo = (wallet: ReownWallet): string | undefined => {
    const officialLogo = getReownWalletLogo(wallet.id)
    if (officialLogo) {
      return logoSources[wallet.id] || officialLogo
    }

    // Fall back to wallet's provided logo
    return wallet.logo
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <GlassCard>
          <DialogHeader>
          <DialogTitle className="text-2xl">Browse 100+ Wallets</DialogTitle>
          <DialogDescription>
            Select a wallet to connect to Atlas Protocol. Wallets with ✓ Sui support are recommended.
          </DialogDescription>
        </DialogHeader>

        {!showQRPrompt ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or category (e.g., 'Phantom', 'Sui', 'Hardware')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-4">
              {categories.map((category) => {
                const categoryWallets = filteredWallets.filter((w) => w.category === category)
                if (categoryWallets.length === 0) return null

                return (
                  <div key={category} className="mb-6">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 sticky top-0 bg-background py-1">
                      {category}
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {categoryWallets.map((wallet) => {
                        const logoUrl = getWalletLogo(wallet) // Use new logo resolution
                        const hasError = imageErrors[wallet.id] !== undefined

                        return (
                          <button
                            key={wallet.id}
                            onClick={() => handleWalletSelect(wallet.id)}
                            disabled={wallet.suiSupport === false && searchQuery.includes("sui")}
                            className="flex flex-col items-center justify-center p-3 rounded-lg border border-border hover:bg-accent hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                            title={`${wallet.name}${wallet.suiSupport ? " (Sui enabled)" : " (Sui not supported)"}`}
                          >
                            {logoUrl && !hasError ? (
                              <img
                                key={`${wallet.id}-${logoSources[wallet.id] || "primary"}`} // Force re-render on source change
                                src={logoUrl || "/placeholder.svg"}
                                alt={wallet.name}
                                className="w-10 h-10 rounded-lg object-contain mb-2"
                                onError={() => handleImageError(wallet.id)}
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-foreground font-bold text-xs mb-2">
                                {getWalletInitials(wallet.name)}
                              </div>
                            )}
                            <p className="text-xs font-medium text-center line-clamp-2 group-hover:text-primary transition-colors">
                              {wallet.name}
                            </p>
                            {wallet.suiSupport && (
                              <span className="text-xs mt-1 px-1.5 py-0.5 bg-green-500/20 text-green-600 dark:text-green-400 rounded">
                                ✓ Sui
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {filteredWallets.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="font-medium mb-1">No wallets found</p>
                  <p className="text-sm">Try adjusting your search filters</p>
                </div>
              )}
            </div>

            <div className="border-t pt-3 mt-3 text-xs text-muted-foreground">
              💡 <strong>Tip:</strong> Wallets marked with ✓ Sui support Sui natively. Others may require WalletConnect
              bridge.
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-8 text-center">
            <QrCode className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <p className="font-medium mb-1">Scan with your mobile wallet</p>
              <p className="text-sm text-muted-foreground">
                Use {REOWN_WALLETS.find((w) => w.id === selectedWallet)?.name || "your wallet"} to scan the QR code
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setShowQRPrompt(false)}>
                Back
              </Button>
              <Button onClick={handleQRConnect}>Continue</Button>
            </div>
            </div>
          )}
        </GlassCard>
      </DialogContent>
    </Dialog>
  )
}
