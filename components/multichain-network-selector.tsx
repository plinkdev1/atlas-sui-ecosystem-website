"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Plus, Check, ChevronDown, Network } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUnifiedWallet } from "@/lib/unified-wallet-context"

type NetworkChain = "sui" | "aptos" | "evm"
type NetworkEnv = "mainnet" | "testnet" | "devnet"

const DEFAULT_NETWORKS: Record<NetworkChain, Record<NetworkEnv, string>> = {
  sui: {
    mainnet: "https://fullnode.mainnet.sui.io:443",
    testnet: "https://fullnode.testnet.sui.io:443",
    devnet: "https://fullnode.devnet.sui.io:443",
  },
  aptos: {
    mainnet: "https://fullnode.mainnet.aptoslabs.com/v1",
    testnet: "https://fullnode.testnet.aptoslabs.com/v1",
    devnet: "https://fullnode.devnet.aptoslabs.com/v1",
  },
  evm: {
    mainnet: "https://eth.llamarpc.com",
    testnet: "https://ethereum-sepolia-rpc.publicnode.com",
    devnet: "https://ethereum-sepolia-rpc.publicnode.com",
  },
}

export function MultichainNetworkSelector() {
  const [open, setOpen] = useState(false)
  const wallet = useUnifiedWallet()
  const [customRpcUrl, setCustomRpcUrl] = useState("")
  const [customNetworkName, setCustomNetworkName] = useState("")
  const { toast } = useToast()

  const getCurrentNetworkLabel = () => {
    const network = wallet.network || "sui:mainnet"
    if (network.includes("sui")) return "Sui"
    if (network.includes("aptos")) return "Aptos"
    if (network.includes("eth") || network.includes("evm")) return "EVM"
    return "Mainnet"
  }

  const handleNetworkChange = (chain: NetworkChain, env: NetworkEnv) => {
    wallet.setNetwork(`${chain}:${env}` as any)
    toast({ title: "Network switched", description: `Switched to ${chain.toUpperCase()} ${env}` })
    setOpen(false)
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 hidden sm:flex text-xs">
          <Globe className="h-4 w-4" />
          {getCurrentNetworkLabel()}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Multichain Network Selection
          </DialogTitle>
          <DialogDescription>Choose your blockchain network or add a custom RPC endpoint</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="preset" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preset">Preset Networks</TabsTrigger>
            <TabsTrigger value="custom">Custom RPC</TabsTrigger>
          </TabsList>

          <TabsContent value="preset" className="space-y-6 mt-6">
            {/* Sui Networks */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Network className="h-4 w-4" />
                Sui Network
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {(["mainnet", "testnet", "devnet"] as NetworkEnv[]).map((env) => (
                  <Button
                    key={`sui-${env}`}
                    variant={wallet.network === `sui:${env}` ? "default" : "outline"}
                    onClick={() => handleNetworkChange("sui", env)}
                    className="justify-start"
                  >
                    {wallet.network === `sui:${env}` && <Check className="mr-2 h-4 w-4" />}
                    {env.charAt(0).toUpperCase() + env.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Aptos Networks */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-muted-foreground">
                <Network className="h-4 w-4" />
                Aptos Network <span className="text-xs">(Coming Soon)</span>
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {(["mainnet", "testnet"] as NetworkEnv[]).map((env) => (
                  <Button
                    key={`aptos-${env}`}
                    variant="outline"
                    disabled
                    className="justify-start opacity-50"
                  >
                    {env.charAt(0).toUpperCase() + env.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* EVM Networks */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-muted-foreground">
                <Network className="h-4 w-4" />
                EVM Networks <span className="text-xs">(Coming Soon)</span>
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {(["mainnet", "testnet"] as NetworkEnv[]).map((env) => (
                  <Button
                    key={`evm-${env}`}
                    variant="outline"
                    disabled
                    className="justify-start opacity-50"
                  >
                    {env === "mainnet" ? "Ethereum" : "Sepolia"}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rpc-url">RPC URL</Label>
                <Input
                  id="rpc-url"
                  placeholder="https://your-rpc-endpoint.com"
                  value={customRpcUrl}
                  onChange={(e) => setCustomRpcUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="network-name">Network Name</Label>
                <Input
                  id="network-name"
                  placeholder="My Custom Network"
                  value={customNetworkName}
                  onChange={(e) => setCustomNetworkName(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  if (isValidUrl(customRpcUrl)) {
                    toast({ title: "Custom RPC added", description: `Added ${customNetworkName || "custom network"}` })
                    setCustomRpcUrl("")
                    setCustomNetworkName("")
                    setOpen(false)
                  } else {
                    toast({
                      title: "Invalid URL",
                      description: "Please enter a valid RPC URL",
                      variant: "destructive",
                    })
                  }
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Custom RPC
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
