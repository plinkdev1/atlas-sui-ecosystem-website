"use client"

import { useRouter } from "next/navigation"
import { useMemo } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, Zap, FileSearch, Network, Trash2, Search, Coins, ArrowRightLeft, GitBranch, Image, Radio } from "lucide-react"

export function ToolsMenu() {
  const router = useRouter()

  const tools = useMemo(
    () => [
      {
        label: "Blockchain Explorer",
        description: "Search wallets, txs & blocks",
        icon: Search,
        href: "/explorer",
      },
      {
        label: "Stake Hub",
        description: "Validator dashboard & staking",
        icon: Coins,
        href: "/stake-hub",
      },
      {
        label: "Swap Aggregator",
        description: "Best swap routes across DEXes",
        icon: ArrowRightLeft,
        href: "/swap-aggregator",
      },
      {
        label: "Bridge Hub",
        description: "Cross-chain bridge aggregator",
        icon: GitBranch,
        href: "/bridge-hub",
      },
      {
        label: "NFT Marketplace",
        description: "Buy & sell NFTs across Sui",
        icon: Image,
        href: "/nft",
      },
      {
        label: "Oracle Feeds",
        description: "Live Pyth prices & alerts",
        icon: Radio,
        href: "/oracle-feeds",
      },
      {
        label: "Wallet Cleanup",
        description: "Remove scams and spam",
        icon: Trash2,
        href: "/wallet-cleanup",
      },
      {
        label: "Transaction Explainer",
        description: "Analyze & understand txs",
        icon: FileSearch,
        href: "/transaction-explainer",
      },
      {
        label: "Infra Discovery",
        description: "Explore providers",
        icon: Network,
        href: "/infra-discovery",
      },
    ],
    [],
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-primary">
          <Zap className="h-4 w-4" />
          <span className="text-sm">Tools</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-64">
        <DropdownMenuLabel className="text-xs uppercase font-bold px-2 py-1.5">Available Tools</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <DropdownMenuItem
              key={tool.href}
              onClick={() => router.push(tool.href)}
              className="cursor-pointer gap-3 py-2.5 px-3"
            >
              <Icon className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">{tool.label}</span>
                <span className="text-xs text-muted-foreground">{tool.description}</span>
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
