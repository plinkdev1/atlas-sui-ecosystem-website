"use client"

import { useNetwork } from "@/lib/network-context"
import { useWalletStore } from "@/lib/wallet-store"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useState } from "react"

type FullNetwork = "sui:mainnet" | "sui:testnet" | "sui:devnet"
type ShortNetwork = "mainnet" | "testnet" | "devnet"

const NETWORK_CONFIG: Record<ShortNetwork, { label: string; color: string }> = {
  mainnet: { label: "Sui Mainnet", color: "bg-green-500" },
  testnet: { label: "Sui Testnet", color: "bg-yellow-500" },
  devnet: { label: "Sui Devnet", color: "bg-blue-500" },
}

const NETWORK_MAP: Record<ShortNetwork, FullNetwork> = {
  mainnet: "sui:mainnet",
  testnet: "sui:testnet",
  devnet: "sui:devnet",
}

export function NetworkSwitcher() {
  const { network, setNetwork, getShortNetwork } = useNetwork()
  const { isConnected } = useWalletStore()
  const { toast } = useToast()
  const [isSwitching, setIsSwitching] = useState(false)

  const shortNetwork = getShortNetwork() as ShortNetwork
  const config = NETWORK_CONFIG[shortNetwork]

  const handleNetworkSwitch = async (newShortNetwork: ShortNetwork) => {
    const newNetwork = NETWORK_MAP[newShortNetwork]

    if (newNetwork === network) return

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet before switching networks",
        variant: "default",
      })
      return
    }

    setIsSwitching(true)
    try {
      console.log("[v0] Attempting network switch from", network, "to", newNetwork)
      setNetwork(newNetwork)

      toast({
        title: "Network switched",
        description: `Switched to Sui ${newShortNetwork.charAt(0).toUpperCase() + newShortNetwork.slice(1)}`,
      })
    } catch (error) {
      console.error("[v0] Network switch failed:", error)
      toast({
        title: "Switch Failed",
        description: "Please change the network in your wallet manually",
        variant: "destructive",
      })
    } finally {
      setIsSwitching(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent" disabled={isSwitching}>
          <div className={`h-2 w-2 rounded-full ${config.color}`} />
          <span className="text-xs font-medium">{config.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        <DropdownMenuLabel className="text-xs uppercase font-bold">Sui Network</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.entries(NETWORK_CONFIG) as Array<[ShortNetwork, (typeof NETWORK_CONFIG)["mainnet"]]>).map(
          ([net, cfg]) => (
            <DropdownMenuItem
              key={net}
              onClick={() => handleNetworkSwitch(net)}
              className="cursor-pointer"
              disabled={isSwitching}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${cfg.color}`} />
                  <span className="text-sm">{cfg.label}</span>
                </div>
                {shortNetwork === net && <Check className="h-4 w-4 text-primary" />}
              </div>
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
