"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart3, Activity, AlertTriangle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { RevealSection } from "@/components/reveal-section"

interface WalletStats {
  connects: number
  disconnects: number
  signs: number
  executes: number
  errors: number
  lastActivity: number | null
}

interface AnalyticsEvent {
  id: string
  type: string
  wallet: string
  timestamp: number
  status: string
  [key: string]: unknown
}

interface AnalyticsData {
  totalEvents: number
  summaryByWallet: Record<string, WalletStats>
  recentEvents: AnalyticsEvent[]
}

const METRICS = ["connects", "disconnects", "signs", "executes", "errors"] as const

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<Array<{ name: string; connects: number; disconnects: number; signs: number; executes: number; errors: number }>>([])

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics/wallet")
        const data = (await res.json()) as AnalyticsData
        setAnalyticsData(data)
        setChartData(
          Object.entries(data.summaryByWallet || {}).map(([wallet, stats]) => ({
            name: wallet,
            connects: stats.connects,
            disconnects: stats.disconnects,
            signs: stats.signs,
            executes: stats.executes,
            errors: stats.errors,
          }))
        )
      } catch (error) {
        console.error("[v0] Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <main className="bg-background min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading analytics...</p>
      </main>
    )
  }

  return (
    <main className="bg-background min-h-screen">
      {/* Hero */}
      <section className="section-gradient-blue container-modern relative overflow-hidden py-8">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <RevealSection>
            <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Admin
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-badge">
                <BarChart3 className="h-5 w-5 text-[#2B7FFF]" />
              </div>
              <div>
                <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Admin</p>
                <h1 className="heading-hero !text-2xl md:!text-3xl">Analytics Dashboard</h1>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">Real-time wallet and transaction analytics (refreshes every 5s)</p>
          </RevealSection>
        </div>
      </section>

      <section className="section-default container-modern max-w-7xl space-y-8">
        {!analyticsData ? (
          <div className="card-modern p-8 text-center text-muted-foreground text-sm">No analytics data available yet.</div>
        ) : (
          <>
            <RevealSection delay={50}>
              {/* Metric cards */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div className="card-modern p-5 space-y-1 md:col-span-1">
                  <p className="text-2xl font-bold text-[#2B7FFF]">{analyticsData.totalEvents}</p>
                  <p className="text-xs text-muted-foreground">Total Events</p>
                </div>
                {METRICS.map((metric) => (
                  <div key={metric} className="card-modern p-5 space-y-1">
                    <p className={`text-2xl font-bold ${metric === "errors" ? "text-red-500" : "text-foreground"}`}>
                      {Object.values(analyticsData.summaryByWallet).reduce(
                        (sum: number, w: WalletStats) => sum + ((w[metric] as number) || 0),
                        0
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{metric}</p>
                  </div>
                ))}
              </div>
            </RevealSection>

            {/* Chart */}
            <RevealSection delay={100}>
              <div className="card-modern p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#2B7FFF]" />
                  <h2 className="font-semibold text-foreground">Wallet Activity Chart</h2>
                </div>
                <ChartContainer
                  config={{
                    connects: { label: "Connects", color: "#2B7FFF" },
                    signs: { label: "Signs", color: "#00d4aa" },
                    executes: { label: "Executes", color: "#7B61FF" },
                    errors: { label: "Errors", color: "#EF4444" },
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(43,127,255,0.1)" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
                      <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="connects" fill="var(--color-connects)" radius={[3,3,0,0]} />
                      <Bar dataKey="signs" fill="var(--color-signs)" radius={[3,3,0,0]} />
                      <Bar dataKey="executes" fill="var(--color-executes)" radius={[3,3,0,0]} />
                      <Bar dataKey="errors" fill="var(--color-errors)" radius={[3,3,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </RevealSection>

            {/* Wallet summary */}
            <RevealSection delay={150}>
              <div className="card-modern p-8 space-y-4">
                <h2 className="font-semibold text-foreground">Wallet Summary</h2>
                <div className="space-y-3">
                  {Object.entries(analyticsData.summaryByWallet).map(([wallet, stats]: [string, WalletStats]) => (
                    <div key={wallet} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-3 rounded-xl bg-background/60 border border-[rgba(43,127,255,0.1)]">
                      <div>
                        <p className="font-semibold text-foreground text-sm">{wallet}</p>
                        <p className="text-xs text-muted-foreground">Last active: {stats.lastActivity ? new Date(stats.lastActivity).toLocaleString() : "Never"}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-[#2B7FFF]/10 text-[#4d9fff] border border-[#2B7FFF]/20">{stats.connects} connects</span>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-[#2B7FFF]/10 text-[#4d9fff] border border-[#2B7FFF]/20">{stats.signs} signs</span>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-[#2B7FFF]/10 text-[#4d9fff] border border-[#2B7FFF]/20">{stats.executes} executes</span>
                        {stats.errors > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/15 text-red-400 border border-red-500/25 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />{stats.errors} errors
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>

            {/* Recent events */}
            <RevealSection delay={200}>
              <div className="card-modern p-8 space-y-4">
                <h2 className="font-semibold text-foreground">Recent Events</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {(analyticsData.recentEvents || []).reverse().slice(0, 20).map((event, index) => (
                    <div key={index} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-background/60 border border-[rgba(43,127,255,0.08)]">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-[#2B7FFF]/10 text-[#4d9fff] border border-[#2B7FFF]/20">{String(event.type)}</span>
                        <span className="text-sm text-foreground">{String(event.wallet)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>
          </>
        )}
      </section>
    </main>
  )
}
