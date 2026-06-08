"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface WalletStats {
  connects: number
  disconnects: number
  signs: number
  executes: number
  errors: number
  lastActivity: number | null
}

interface AnalyticsEvent {
  eventType: string
  walletName: string
  timestamp: number
  [key: string]: unknown
}

interface AnalyticsData {
  totalEvents: number
  summaryByWallet: Record<string, WalletStats>
  recentEvents: AnalyticsEvent[]
}

export default function WalletAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics/wallet")
        const data: AnalyticsData = await response.json()
        setAnalyticsData(data)
      } catch (error) {
        console.error("[v0] Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="p-4">Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Wallet Analytics Dashboard</h1>
        <p className="text-muted-foreground">Real-time wallet usage insights</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Summary</CardTitle>
          <CardDescription>Total events tracked: {analyticsData?.totalEvents || 0}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {["connects", "disconnects", "signs", "executes", "errors"].map((metric) => (
              <div key={metric} className="p-4 bg-background rounded-lg border">
                <div className="text-sm text-muted-foreground capitalize">{metric}</div>
                <div className="text-2xl font-bold">
                  {Object.values(analyticsData?.summaryByWallet || {}).reduce(
                    (sum: number, wallet: WalletStats) => sum + (wallet[metric as keyof WalletStats] as number || 0),
                    0,
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wallet Usage Summary</CardTitle>
          <CardDescription>Activity by wallet type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(analyticsData?.summaryByWallet || {}).map(([wallet, stats]: [string, WalletStats]) => (
              <div key={wallet} className="p-3 bg-background rounded-lg border flex justify-between items-center">
                <div>
                  <div className="font-semibold">{wallet}</div>
                  <div className="text-xs text-muted-foreground">
                    {stats.lastActivity ? new Date(stats.lastActivity).toLocaleString() : "No activity"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">{stats.connects} connects</Badge>
                  <Badge variant="secondary">{stats.signs} signs</Badge>
                  <Badge variant="secondary">{stats.executes} executes</Badge>
                  {stats.errors > 0 && <Badge variant="destructive">{stats.errors} errors</Badge>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
          <CardDescription>Latest tracked events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(analyticsData?.recentEvents || []).reverse().map((event: AnalyticsEvent, index: number) => (
              <div key={index} className="text-sm p-2 bg-background rounded border flex justify-between">
                <div>
                  <Badge className="mr-2">{event.eventType}</Badge>
                  <span>{event.walletName}</span>
                </div>
                <div className="text-muted-foreground">{new Date(event.timestamp).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
