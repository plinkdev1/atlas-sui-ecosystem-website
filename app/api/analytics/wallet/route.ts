import { type NextRequest, NextResponse } from "next/server"

interface AnalyticsEvent {
  eventType: string
  walletName: string
  timestamp: number
  [key: string]: unknown
}

// Store analytics events (in production, save to database)
const analyticsEvents: AnalyticsEvent[] = []

export async function POST(request: NextRequest) {
  try {
    const event = await request.json()

    // Validate event
    if (!event.eventType || !event.walletName) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 })
    }

    // Store event
    analyticsEvents.push({
      ...event,
      receivedAt: new Date().toISOString(),
    })

    // Keep last 10000 events in memory
    if (analyticsEvents.length > 10000) {
      analyticsEvents.shift()
    }

    console.log("[v0] Analytics event received:", event.eventType, event.walletName)

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("[v0] Analytics error:", error)
    return NextResponse.json({ error: "Failed to process event" }, { status: 500 })
  }
}

// Get analytics summary (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const summaryByWallet = analyticsEvents.reduce(
      (acc, event: AnalyticsEvent) => {
        if (!acc[event.walletName]) {
          acc[event.walletName] = {
            connects: 0,
            disconnects: 0,
            signs: 0,
            executes: 0,
            errors: 0,
            lastActivity: null,
          }
        }

        const walletStats = acc[event.walletName]
        if (walletStats) {
          const eventKey = `${event.eventType}s` as keyof typeof walletStats
          if (eventKey in walletStats && typeof walletStats[eventKey] === "number") {
            walletStats[eventKey]++
          }
          walletStats.lastActivity = event.timestamp as number
        }

        return acc
      },
      {} as Record<
        string,
        {
          connects: number
          disconnects: number
          signs: number
          executes: number
          errors: number
          lastActivity: number | null
        }
      >,
    )

    return NextResponse.json({
      totalEvents: analyticsEvents.length,
      summaryByWallet,
      recentEvents: analyticsEvents.slice(-20),
    })
  } catch (error: unknown) {
    console.error("[v0] Failed to get analytics:", error)
    return NextResponse.json({ error: "Failed to get analytics" }, { status: 500 })
  }
}
