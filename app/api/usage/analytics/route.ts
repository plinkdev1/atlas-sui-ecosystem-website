import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { withAuth, unauthorized, serverError } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.valid || !auth.userId) {
      return unauthorized()
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch (e) {
            console.error("[v0] Cookie error:", e)
          }
        },
      },
    })

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "7d"
    const apiKeyId = searchParams.get("api_key_id")

    if (!apiKeyId) {
      return NextResponse.json({ error: "api_key_id required" }, { status: 400 })
    }

    // Calculate date range
    const now = new Date()
    let daysBack = 7
    if (period === "30d") daysBack = 30
    if (period === "90d") daysBack = 90

    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)

    // Fetch usage logs for period
    const { data: logs, error: logsError } = await supabase
      .from("usage_logs")
      .select("created_at, response_time_ms, status_code")
      .eq("api_key_id", apiKeyId)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true })

    if (logsError) {
      console.error("[v0] Error fetching usage logs:", logsError)
      return serverError("Failed to fetch analytics")
    }

    // Group by day
    const dailyData: Record<string, { count: number; avgTime: number; errors: number }> = {}

    logs?.forEach((log) => {
      const date = new Date(log.created_at).toISOString().split("T")[0]
      if (!date) return // Guard: ensure date string exists
      
      if (!dailyData[date]) {
        dailyData[date] = { count: 0, avgTime: 0, errors: 0 }
      }
      dailyData[date]!.count++
      dailyData[date]!.avgTime += log.response_time_ms
      if (log.status_code >= 400) {
        dailyData[date]!.errors++
      }
    })

    // Calculate averages
    Object.keys(dailyData).forEach((date) => {
      dailyData[date]!.avgTime = Math.round(dailyData[date]!.avgTime / dailyData[date]!.count)
    })

    // Calculate aggregate stats
    const totalRequests = logs?.length || 0
    const avgResponseTime =
      logs && logs.length > 0 ? Math.round(logs.reduce((sum, log) => sum + log.response_time_ms, 0) / logs.length) : 0
    const errorCount = logs?.filter((log) => log.status_code >= 400).length || 0
    const peakTime = Math.max(...(logs?.map((log) => log.response_time_ms) || [0]))

    return NextResponse.json({
      daily: Object.entries(dailyData).map(([date, data]) => ({
        date,
        requests: data.count,
        avgResponseTime: data.avgTime,
        errors: data.errors,
      })),
      stats: {
        totalRequests,
        avgResponseTime,
        peakResponseTime: peakTime,
        errorRate: totalRequests > 0 ? ((errorCount / totalRequests) * 100).toFixed(2) : "0",
        errorCount,
        period,
        daysBack,
      },
    })
  } catch (error) {
    console.error("[v0] Error in analytics API:", error)
    return serverError()
  }
}
