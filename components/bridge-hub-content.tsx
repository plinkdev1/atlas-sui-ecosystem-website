"use client"

import { useState, useEffect, useCallback } from "react"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowRightLeft, Shield, Clock, Zap, ArrowDown, Loader2, ExternalLink, Info } from "lucide-react"
import { ProCtaWrapper } from "@/components/pro-cta-wrapper"

interface BridgeRoute {
  id: string
  provider: string
  providerName: string
  sourceChain: string
  destChain: string
  token: string
  estimatedTime: string
  estimatedTimeMinutes: number
  fee: number
  feeToken: string
  feeUsd: number
  outputAmount: number
  securityScore: number
}

const CHAINS = [
  { id: "sui", name: "Sui" },
  { id: "ethereum", name: "Ethereum" },
  { id: "arbitrum", name: "Arbitrum" },
  { id: "optimism", name: "Optimism" },
  { id: "polygon", name: "Polygon" },
  { id: "bsc", name: "BNB Chain" },
  { id: "avalanche", name: "Avalanche" },
  { id: "base", name: "Base" },
  { id: "solana", name: "Solana" },
  { id: "aptos", name: "Aptos" },
]

const TOKENS = [
  { symbol: "SUI", name: "Sui" },
  { symbol: "USDC", name: "USD Coin" },
  { symbol: "USDT", name: "Tether" },
  { symbol: "WETH", name: "Wrapped ETH" },
  { symbol: "WBTC", name: "Wrapped BTC" },
]

export function BridgeHubContent() {
  const account = useCurrentAccount()
  const address = account?.address ?? null
  const { toast } = useToast()
  const [sourceChain, setSourceChain] = useState("sui")
  const [destChain, setDestChain] = useState("ethereum")
  const [token, setToken] = useState("USDC")
  const [amount, setAmount] = useState("")
  const [routes, setRoutes] = useState<BridgeRoute[]>([])
  const [bestRoute, setBestRoute] = useState<BridgeRoute | null>(null)
  const [loading, setLoading] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [bridgeHistory, setBridgeHistory] = useState<any[]>([])

  const fetchRoutes = useCallback(async () => {
    const numAmount = parseFloat(amount)
    if (!numAmount || numAmount <= 0 || sourceChain === destChain) return

    setLoading(true)
    try {
      const params = new URLSearchParams({ sourceChain, destChain, token, amount })
      const response = await fetch(`/api/bridge/routes?${params}`)
      if (!response.ok) throw new Error("Failed to fetch routes")
      const data = await response.json()
      setRoutes(data.routes || [])
      setBestRoute(data.bestRoute || null)
      if (data.bestRoute) setSelectedRoute(data.bestRoute.id)
    } catch (error) {
      console.error("[v0] Route fetch error:", error)
      toast({ title: "Error", description: "Failed to fetch bridge routes", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [amount, sourceChain, destChain, token, toast])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (parseFloat(amount) > 0 && sourceChain !== destChain) fetchRoutes()
    }, 800)
    return () => clearTimeout(timer)
  }, [amount, sourceChain, destChain, token, fetchRoutes])

  const handleSwapChains = () => {
    setSourceChain(destChain)
    setDestChain(sourceChain)
    setRoutes([])
    setBestRoute(null)
  }

  const handleExecuteBridge = async () => {
    const route = routes.find((r) => r.id === selectedRoute)
    if (!route) return

    if (!address) {
      toast({ title: "Wallet Required", description: "Connect your wallet to bridge tokens", variant: "destructive" })
      return
    }

    setExecuting(true)
    try {
      const response = await fetch("/api/bridge/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          routeId: route.id,
          provider: route.provider,
          sourceChain: route.sourceChain,
          destChain: route.destChain,
          token: route.token,
          amount: parseFloat(amount),
          walletAddress: address,
          fee: route.fee,
        }),
      })

      if (!response.ok) throw new Error("Bridge execution failed")
      const data = await response.json()

      toast({ title: "Bridge Initiated", description: data.message || "Transaction submitted. +15 Airpoints!" })
      setRoutes([])
      setBestRoute(null)
      setAmount("")
    } catch (error) {
      console.error("[v0] Bridge error:", error)
      toast({ title: "Bridge Failed", description: "Failed to initiate bridge. Please try again.", variant: "destructive" })
    } finally {
      setExecuting(false)
    }
  }

  const getSecurityColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bridge Hub</h1>
        <p className="text-muted-foreground">Bridge tokens across chains with the best routes and lowest fees</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bridge Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border/50 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-primary" />
                Cross-Chain Bridge
              </CardTitle>
              <CardDescription>Select chains, token, and amount to find the best bridge route</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Source Chain */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">From Chain</label>
                <Select value={sourceChain} onValueChange={setSourceChain}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CHAINS.map((c) => (
                      <SelectItem key={c.id} value={c.id} disabled={c.id === destChain}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button variant="outline" size="icon" onClick={handleSwapChains} className="rounded-full">
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>

              {/* Dest Chain */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">To Chain</label>
                <Select value={destChain} onValueChange={setDestChain}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CHAINS.map((c) => (
                      <SelectItem key={c.id} value={c.id} disabled={c.id === sourceChain}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Token + Amount */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Token</label>
                  <Select value={token} onValueChange={setToken}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TOKENS.map((t) => (
                        <SelectItem key={t.symbol} value={t.symbol}>{t.symbol}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Amount</label>
                  <Input type="number" placeholder="0.0" value={amount} onChange={(e) => setAmount(e.target.value)} min="0" step="0.01" />
                </div>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-4 gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Finding best routes...
                </div>
              )}
            </CardContent>
          </Card>

          {/* Routes */}
          {routes.length > 0 && (
            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Available Routes ({routes.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {routes.map((route) => (
                  <div
                    key={route.id}
                    onClick={() => setSelectedRoute(route.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedRoute === route.id
                        ? "border-primary bg-primary/5"
                        : "border-border/50 hover:border-border"
                    } ${bestRoute?.id === route.id ? "ring-1 ring-primary/50" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{route.providerName}</span>
                            {bestRoute?.id === route.id && (
                              <Badge variant="default" className="text-xs">Best</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{route.estimatedTime}</span>
                            <span className="flex items-center gap-1"><Zap className="h-3 w-3" />Fee: {route.fee.toFixed(4)} {route.feeToken}</span>
                            <span className={`flex items-center gap-1 ${getSecurityColor(route.securityScore)}`}>
                              <Shield className="h-3 w-3" />{route.securityScore}/100
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{route.outputAmount.toFixed(4)}</div>
                        <div className="text-xs text-muted-foreground">{route.token}</div>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  onClick={handleExecuteBridge}
                  disabled={!selectedRoute || executing || !address}
                  className="w-full mt-4"
                  size="lg"
                >
                  {executing ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" />Initiating Bridge...</>
                  ) : !address ? (
                    "Connect Wallet to Bridge"
                  ) : (
                    <><ArrowRightLeft className="h-4 w-4 mr-2" />Bridge {amount} {token}</>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="border-border/50 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Info className="h-4 w-4" />Bridge Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Supported Chains</span>
                <span className="font-medium">{CHAINS.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bridge Providers</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Supported Tokens</span>
                <span className="font-medium">{TOKENS.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Airpoints per Bridge</span>
                <span className="font-medium text-primary">+15 pts</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Shield className="h-4 w-4" />Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Routes are ranked by output amount, security score, and speed.</p>
              <p>Sui Native Bridge is the most secure option for Sui-Ethereum transfers but is slower.</p>
              <p>Wormhole and Squid provide faster cross-chain routes with strong security.</p>
            </CardContent>
          </Card>

          <ProCtaWrapper title="Advanced Bridge Analytics" />
        </div>
      </div>
    </div>
  )
}
