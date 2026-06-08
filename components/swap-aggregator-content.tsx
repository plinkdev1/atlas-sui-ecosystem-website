"use client"

import { useState } from "react"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRightLeft, Zap, TrendingUp, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { ProCtaWrapper } from "@/components/pro-cta-wrapper"

export function SwapAggregatorContent() {
  const account = useCurrentAccount()
  const address = account?.address ?? null
  const [fromToken, setFromToken] = useState("SUI")
  const [toToken, setToToken] = useState("USDC")
  const [fromAmount, setFromAmount] = useState("")
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleGetQuotes = async () => {
    if (!fromAmount) {
      toast({ title: "Error", description: "Enter an amount", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/swap/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromToken,
          toToken,
          amount: fromAmount,
          walletAddress: address,
        }),
      })

      if (!response.ok) throw new Error("Failed to get quotes")

      const data = await response.json()
      setQuotes(data.quotes || [])

      if (data.quotes?.length === 0) {
        toast({ title: "No quotes found", description: "Try different token pair" })
      } else {
        toast({ title: "Quotes fetched", description: `Found ${data.quotes.length} routes` })
      }
    } catch (error) {
      console.error("[v0] Error getting quotes:", error)
      toast({
        title: "Error fetching quotes",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSwap = async (quoteIndex: number) => {
    if (!address) {
      toast({ title: "Wallet not connected", description: "Please connect wallet first" })
      return
    }

    try {
      const response = await fetch("/api/swap/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote: quotes[quoteIndex],
          walletAddress: address,
        }),
      })

      if (!response.ok) throw new Error("Swap failed")

      const data = await response.json()
      toast({
        title: "Swap executed",
        description: `Transaction: ${data.digest?.slice(0, 10)}... +10 Airpoints!`,
      })
    } catch (error) {
      console.error("[v0] Error executing swap:", error)
      toast({
        title: "Swap failed",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ArrowRightLeft className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Swap Aggregator</h1>
          </div>
          <p className="text-muted-foreground">Find the best swap routes across Sui DEXes</p>
        </div>

        <Tabs defaultValue="swap" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="swap">Swap</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
          </TabsList>

          <TabsContent value="swap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Token Exchange</CardTitle>
                <CardDescription>Get quotes from multiple DEXes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* From Token */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">From</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter token symbol (e.g., SUI)"
                      value={fromToken}
                      onChange={(e) => setFromToken(e.target.value.toUpperCase())}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    step="0.01"
                  />
                </div>

                {/* To Token */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">To</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter token symbol (e.g., USDC)"
                      value={toToken}
                      onChange={(e) => setToToken(e.target.value.toUpperCase())}
                      className="flex-1"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleGetQuotes}
                  disabled={loading || !fromAmount}
                  size="lg"
                  className="w-full"
                >
                  {loading ? "Loading quotes..." : "Get Best Quotes"}
                </Button>
              </CardContent>
            </Card>

            {/* Quotes */}
            {quotes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Routes</CardTitle>
                  <CardDescription>{quotes.length} routes found</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quotes.map((quote, idx) => (
                    <div key={idx} className="p-4 border rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{quote.dex || "DEX"}</p>
                          <p className="text-sm text-muted-foreground">
                            {quote.outputAmount || "0.00"} {toToken}
                          </p>
                        </div>
                        <div className="text-right">
                          {quote.priceImpact && (
                            <p className="text-sm text-amber-600">
                              Impact: {(quote.priceImpact * 100).toFixed(2)}%
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleSwap(idx)}
                        disabled={!address}
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        {address ? "Swap Now" : "Connect Wallet"}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="routes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground">
                      1
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Enter Swap Details</h4>
                    <p className="text-sm text-muted-foreground">
                      Specify tokens and amount to swap
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground">
                      2
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Get Aggregated Quotes</h4>
                    <p className="text-sm text-muted-foreground">
                      We query multiple DEXes for best rates
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground">
                      3
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Execute Best Route</h4>
                    <p className="text-sm text-muted-foreground">
                      Sign and execute the most profitable swap
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <ProCtaWrapper
              title="Advanced Analytics"
              description="Get detailed price impact analysis and route optimization"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
