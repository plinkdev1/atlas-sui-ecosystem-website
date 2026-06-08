"use client"

import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Clock, TrendingUp, Wifi, DollarSign, Server } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface ProviderAnalyticsProps {
  providerId: string
}

export function ProviderAnalytics({ providerId }: ProviderAnalyticsProps) {
  const { data, isLoading } = useSWR(
    providerId ? `/api/providers/analytics?providerId=${providerId}` : null,
    fetcher,
    { refreshInterval: 60000 }
  )

  const analytics = data?.analytics

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-border/40 bg-card/80">
            <CardContent className="pt-6"><div className="h-8 bg-muted animate-pulse rounded" /></CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!analytics) {
    return (
      <Card className="border-border/40 bg-card/80">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">No analytics data available yet. Analytics populate as your services receive usage.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(analytics.totalRequests || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All-time API calls</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgResponseTime || 0}ms</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgUptime}%</div>
            <p className="text-xs text-muted-foreground">Average availability</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Share</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(analytics.totalRevenue || 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Your share</p>
          </CardContent>
        </Card>
      </div>

      {/* Listings */}
      {analytics.listings?.length > 0 && (
        <Card className="border-border/40 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Server className="h-4 w-4" /> Your Listings</CardTitle>
            <CardDescription>Service listings and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.listings.map((listing: { id: string; name: string; status: string; category: string; featured: boolean }) => (
                <div key={listing.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
                  <div>
                    <p className="font-medium">{listing.name}</p>
                    <p className="text-xs text-muted-foreground">{listing.category || "General"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {listing.featured && <Badge variant="default">Featured</Badge>}
                    <Badge variant={listing.status === "approved" ? "default" : listing.status === "pending" ? "secondary" : "destructive"}>
                      {listing.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage History */}
      {analytics.usageHistory?.length > 0 && (
        <Card className="border-border/40 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Usage History</CardTitle>
            <CardDescription>Recent daily usage metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left py-2 text-muted-foreground font-medium">Date</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Requests</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Avg Response</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Uptime</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Errors</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.usageHistory.slice(0, 10).map((u: { id: string; period_date: string; requests_count: number; response_time_avg_ms: number; uptime_percent: number; error_rate_percent: number }) => (
                    <tr key={u.id} className="border-b border-border/20">
                      <td className="py-2">{u.period_date}</td>
                      <td className="py-2 text-right">{(u.requests_count || 0).toLocaleString()}</td>
                      <td className="py-2 text-right">{u.response_time_avg_ms || 0}ms</td>
                      <td className="py-2 text-right">{u.uptime_percent || 0}%</td>
                      <td className="py-2 text-right">{u.error_rate_percent || 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
