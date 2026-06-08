"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProStatus } from "@/hooks/use-pro-status"
import { useToast } from "@/hooks/use-toast"
import { PYTH_PRICE_FEED_IDS } from "@/lib/oracle-feed-utils"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { ArrowDown, ArrowUp, Bell, BellOff, Clock, RefreshCw, Shield, TrendingDown, TrendingUp } from "lucide-react"
import { useState } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface PriceFeed {
  symbol: string
  name: string
  price: number
  confidence: number
  publishTime: number
  change24h: number | null
  emaPrice: number
}

interface PriceAlert {
  id: string
  asset_symbol: string
  direction: "above" | "below"
  threshold_price: number
  is_active: boolean
  triggered_at: string | null
  created_at: string
}

export function OracleFeedContent() {
  const account = useCurrentAccount()
  const address = account?.address ?? null
  const { status } = useProStatus()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("prices")
  const [alertSymbol, setAlertSymbol] = useState("SUI")
  const [alertDirection, setAlertDirection] = useState<"above" | "below">("above")
  const [alertThreshold, setAlertThreshold] = useState("")

  const { data: priceData, mutate: mutatePrices, isLoading: pricesLoading } = useSWR(
    "/api/oracle/prices",
    fetcher,
    { refreshInterval: 15000 }
  )

  const { data: alertsData, mutate: mutateAlerts } = useSWR(
    address ? `/api/oracle/alerts?wallet=${address}` : null,
    fetcher,
    { refreshInterval: 30000 }
  )

  const prices: PriceFeed[] = priceData?.prices || []
  const alerts: PriceAlert[] = alertsData?.alerts || []

  const handleCreateAlert = async () => {
    if (!address) { toast({ title: "Connect wallet first", variant: "destructive" }); return }
    if (!alertThreshold || isNaN(Number(alertThreshold))) { toast({ title: "Enter a valid price", variant: "destructive" }); return }

    try {
      const res = await fetch("/api/oracle/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          assetSymbol: alertSymbol,
          direction: alertDirection,
          thresholdPrice: Number(alertThreshold),
        }),
      })
      if (!res.ok) throw new Error("Failed to create alert")
      toast({ title: "Alert created", description: `${alertSymbol} ${alertDirection} $${alertThreshold} +2 Airpoints` })
      setAlertThreshold("")
      mutateAlerts()
    } catch (error) {
      toast({ title: "Failed to create alert", variant: "destructive" })
    }
  }

  const handleDeleteAlert = async (alertId: string) => {
    if (!address) return
    try {
      await fetch(`/api/oracle/alerts?id=${alertId}&wallet=${address}`, { method: "DELETE" })
      toast({ title: "Alert removed" })
      mutateAlerts()
    } catch {
      toast({ title: "Failed to remove alert", variant: "destructive" })
    }
  }

  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    if (price >= 1) return `$${price.toFixed(4)}`
    return `$${price.toFixed(6)}`
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Oracle Price Feeds</h1>
          <p className="text-muted-foreground mt-1">Real-time prices powered by Pyth Network on Sui</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => mutatePrices()} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${pricesLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="prices" className="gap-2"><TrendingUp className="h-4 w-4" />Live Prices</TabsTrigger>
          <TabsTrigger value="alerts" className="gap-2"><Bell className="h-4 w-4" />Price Alerts</TabsTrigger>
        </TabsList>

        {/* Live Prices Tab */}
        <TabsContent value="prices">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pricesLoading && prices.length === 0
              ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2"><div className="h-5 bg-muted rounded w-24" /><div className="h-3 bg-muted rounded w-16 mt-1" /></CardHeader>
                  <CardContent><div className="h-8 bg-muted rounded w-32" /></CardContent>
                </Card>
              ))
              : prices.map((feed) => (
                <Card key={feed.symbol} className="hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{feed.symbol}</CardTitle>
                      {feed.change24h !== null && (
                        <Badge variant={feed.change24h >= 0 ? "default" : "destructive"} className="gap-1">
                          {feed.change24h >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          {Math.abs(feed.change24h).toFixed(2)}%
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{feed.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{formatPrice(feed.price)}</div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Conf: {formatPrice(feed.confidence)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {feed.publishTime ? new Date(feed.publishTime * 1000).toLocaleTimeString() : "N/A"}
                      </span>
                    </div>
                    {feed.emaPrice > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        EMA: {formatPrice(feed.emaPrice)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Data Source Info */}
          <Card className="mt-6 bg-muted/30 border-dashed">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>Prices sourced from <strong>Pyth Network</strong> Hermes API with on-chain verification on Sui. Auto-refreshes every 15 seconds.</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Price Alerts Tab */}
        <TabsContent value="alerts">
          {!address ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-muted-foreground">Connect your wallet to create and manage price alerts.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Create Alert Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Create Price Alert</CardTitle>
                  <CardDescription>Get notified when an asset reaches your target price. Earn 2 Airpoints per alert.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select value={alertSymbol} onValueChange={setAlertSymbol}>
                      <SelectTrigger className="w-full sm:w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.keys(PYTH_PRICE_FEED_IDS).map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={alertDirection} onValueChange={(v) => setAlertDirection(v as "above" | "below")}>
                      <SelectTrigger className="w-full sm:w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="above">Goes Above</SelectItem>
                        <SelectItem value="below">Goes Below</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Target price (USD)"
                      type="number"
                      step="any"
                      value={alertThreshold}
                      onChange={(e) => setAlertThreshold(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleCreateAlert} className="gap-2">
                      <Bell className="h-4 w-4" />
                      Create Alert
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Active Alerts List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Alerts ({alerts.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {alerts.length === 0 ? (
                    <p className="text-muted-foreground text-center py-6">No price alerts yet. Create one above.</p>
                  ) : (
                    <div className="space-y-3">
                      {alerts.map((alert) => {
                        const currentPrice = prices.find((p) => p.symbol === alert.asset_symbol)?.price
                        return (
                          <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                            <div className="flex items-center gap-3">
                              {alert.direction === "above" ? (
                                <TrendingUp className="h-5 w-5 text-green-500" />
                              ) : (
                                <TrendingDown className="h-5 w-5 text-red-500" />
                              )}
                              <div>
                                <div className="font-medium">
                                  {alert.asset_symbol} {alert.direction} {formatPrice(alert.threshold_price)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Current: {currentPrice ? formatPrice(currentPrice) : "Loading..."}
                                  {alert.triggered_at && (
                                    <Badge variant="outline" className="ml-2">Triggered</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteAlert(alert.id)}>
                              <BellOff className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pro CTA */}
              {!status.isPro && (
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Upgrade to Pro</h3>
                        <p className="text-sm text-muted-foreground">Get unlimited alerts, SMS notifications, and webhook integrations.</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => window.location.href = "/subscription"}>
                        Upgrade
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
