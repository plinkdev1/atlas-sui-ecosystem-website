"use client"

import { Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface WalletDiscoveryBannerProps {
  onClose?: () => void
}

export function WalletDiscoveryBanner({ onClose }: WalletDiscoveryBannerProps) {
  const handleDownload = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <Card className="border-border/40 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Wallet Detected</h3>
            <p className="text-sm text-muted-foreground">
              Install a Sui wallet to start using Atlas Protocol. We recommend Slush or Suiet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={() =>
                handleDownload("https://chromewebstore.google.com/detail/slush-wallet/mjpjfabpclkffcbclbfdkngapcdmhfnc")
              }
              className="w-full h-auto py-3 flex items-center justify-between bg-primary hover:bg-primary/90"
            >
              <div className="text-left flex-1">
                <div className="font-semibold">Slush Wallet</div>
                <div className="text-xs opacity-90">Recommended for Sui</div>
              </div>
              <Download className="h-4 w-4" />
            </Button>

            <Button
              onClick={() => handleDownload("https://suiet.app/")}
              className="w-full h-auto py-3 flex items-center justify-between bg-blue-600 hover:bg-blue-700"
            >
              <div className="text-left flex-1">
                <div className="font-semibold">Suiet</div>
                <div className="text-xs opacity-90">Popular Sui wallet</div>
              </div>
              <Download className="h-4 w-4" />
            </Button>
          </div>

          <a
            href="https://suiet.app/download"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center justify-center gap-1 pt-2"
          >
            View all supported wallets <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
