"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink, Globe, BarChart3 } from "lucide-react"
import { useNetwork } from "@/lib/network-context"
import { GlassCard } from "@/components/glass-card"

interface ExplorerOption {
  id: "suivision" | "suiscan"
  name: string
  description: string
  icon: typeof Globe
  getUrl: (network: string) => string
}

const EXPLORERS: ExplorerOption[] = [
  {
    id: "suivision",
    name: "SuiVision",
    description: "Advanced analytics, DeFi dashboard, NFT insights, and immersive data visualization",
    icon: BarChart3,
    getUrl: (network: string) => {
      const networkMap: Record<string, string> = {
        "sui:mainnet": "https://suivision.xyz/",
        "sui:testnet": "https://testnet.suivision.xyz/",
        "sui:devnet": "https://devnet.suivision.xyz/",
      }
      return networkMap[network] || "https://suivision.xyz/"
    },
  },
  {
    id: "suiscan",
    name: "Suiscan",
    description: "Feature-rich explorer with detailed transactions, tokens, NFTs, and analytics",
    icon: Globe,
    getUrl: (network: string) => {
      const networkMap: Record<string, string> = {
        "sui:mainnet": "https://suiscan.xyz/mainnet/home",
        "sui:testnet": "https://suiscan.xyz/testnet/home",
        "sui:devnet": "https://suiscan.xyz/devnet/home",
      }
      return networkMap[network] || "https://suiscan.xyz/mainnet/home"
    },
  },
]

interface ExplorerSelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExplorerSelectorDialog({ open, onOpenChange }: ExplorerSelectorDialogProps) {
  const { network } = useNetwork()
  const [preferredExplorer, setPreferredExplorer] = useState<string | null>(null)

  // Load preferred explorer from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("preferredSuiExplorer")
    if (saved) {
      setPreferredExplorer(saved)
    }
  }, [])

  const handleExplorerSelect = (explorer: ExplorerOption) => {
    // Save preference
    localStorage.setItem("preferredSuiExplorer", explorer.id)
    setPreferredExplorer(explorer.id)

    // Open URL in new tab
    const url = explorer.getUrl(network)
    window.open(url, "_blank")

    // Close dialog
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-border/50 bg-background backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose Your Preferred Sui Explorer</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select an explorer to view detailed blockchain data for the current network
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 md:grid-cols-2">
          {EXPLORERS.map((explorer) => {
            const Icon = explorer.icon
            const isPreferred = preferredExplorer === explorer.id

            return (
              <GlassCard key={explorer.id} variant="elevated">
                <button
                  onClick={() => handleExplorerSelect(explorer)}
                  className="group relative flex flex-col gap-4 w-full text-left transition-all"
                >
                  {isPreferred && (
                    <div className="absolute right-3 top-3 rounded-full bg-primary/20 px-2 py-1 text-xs font-medium text-primary">
                      Preferred
                    </div>
                  )}

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <Icon className="h-7 w-7" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{explorer.name}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{explorer.description}</p>
                  </div>

                  <Button
                    className="mt-auto w-full gap-2 bg-primary/10 hover:bg-primary/20"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleExplorerSelect(explorer)
                    }}
                  >
                    Open {explorer.name}
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </button>
              </GlassCard>
            )
          })}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
