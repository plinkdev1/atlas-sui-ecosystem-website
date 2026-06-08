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
    const apiKeyId = searchParams.get("api_key_id")
    const period = searchParams.get("period") || "7d"

    if (!apiKeyId) {
      return NextResponse.json({ error: "api_key_id required" }, { status: 400 })
    }

    // Calculate date range
    const now = new Date()
    let daysBack = 7
    if (period === "30d") daysBack = 30
    if (period === "90d") daysBack = 90

    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)

    // Fetch usage logs grouped by endpoint
    const { data: logs, error: logsError } = await supabase
      .from("usage_logs")
      .select("endpoint, response_time_ms, status_code")
      .eq("api_key_id", apiKeyId)
      .gte("created_at", startDate.toISOString())

    if (logsError) {
      console.error("[v0] Error fetching endpoint logs:", logsError)
      return serverError("Failed to fetch endpoint analytics")
    }

    // Group by endpoint
    const endpointStats: Record<
      string,
      { requests: number; avgTime: number; errors: number; methods: Record<string, number> }
    > = {}

    logs?.forEach((log) => {
      const endpoint = log.endpoint || "unknown"
      if (!endpointStats[endpoint]) {
        endpointStats[endpoint] = { requests: 0, avgTime: 0, errors: 0, methods: {} }
      }
      endpointStats[endpoint].requests++
      endpointStats[endpoint].avgTime += log.response_time_ms
      if (log.status_code >= 400) {
        endpointStats[endpoint].errors++
      }
    })

    // Calculate averages and format
    const endpoints = Object.entries(endpointStats)
      .map(([endpoint, stats]) => ({
        endpoint,
        requests: stats.requests,
        avgResponseTime: Math.round(stats.avgTime / stats.requests),
        errorCount: stats.errors,
        errorRate: ((stats.errors / stats.requests) * 100).toFixed(2),
      }))
      .sort((a, b) => b.requests - a.requests)

    return NextResponse.json({
      endpoints,
      totalEndpoints: endpoints.length,
      totalRequests: endpoints.reduce((sum, e) => sum + e.requests, 0),
      period,
    })
  } catch (error) {
    console.error("[v0] Error in by-endpoint API:", error)
    return serverError()
  }
}
