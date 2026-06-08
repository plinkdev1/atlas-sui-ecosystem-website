import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { withAuth, unauthorized, serverError } from "@/lib/auth-middleware"

interface UsageLog {
  endpoint: string
  method: string
  response_time_ms?: number
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    // Verify key belongs to user and get quota info
    const { data: keyData, error: keyError } = await supabase
      .from("api_keys")
      .select("id, monthly_quota")
      .eq("id", id)
      .eq("user_id", auth.userId)
      .single()

    if (keyError || !keyData) {
      return unauthorized("This API key does not belong to you")
    }

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]

    const { data: quotaData, error: quotaError } = await supabase
      .from("quota_usage")
      .select("requests_used, requests_limit")
      .eq("api_key_id", id)
      .eq("month", monthStart)
      .single()

    if (quotaError && quotaError.code !== "PGRST116") {
      console.error("[v0] Error fetching quota:", quotaError)
      return serverError("Failed to fetch quota")
    }

    // Get usage logs for the month (without aggregation - will process in JS)
    const { data: endpointData, error: endpointError } = await supabase
      .from("usage_logs")
      .select("endpoint, method, response_time_ms")
      .eq("api_key_id", id)
      .gte("created_at", `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`)
      .lt("created_at", `${now.getFullYear()}-${String(now.getMonth() + 2).padStart(2, "0")}-01`)

    if (endpointError && endpointError.code !== "PGRST116") {
      console.warn("[v0] Error fetching endpoint usage:", endpointError)
    }

    // Process aggregation in JavaScript
    const endpointMap = new Map<string, { count: number; totalTime: number }>()
    
    if (endpointData && Array.isArray(endpointData)) {
      endpointData.forEach((log: UsageLog) => {
        const key = `${log.method} ${log.endpoint}`
        const existing = endpointMap.get(key) || { count: 0, totalTime: 0 }
        endpointMap.set(key, {
          count: existing.count + 1,
          totalTime: existing.totalTime + (log.response_time_ms || 0),
        })
      })
    }

    // Convert to sorted array
    const endpointStats = Array.from(endpointMap.entries())
      .map(([name, data]) => ({
        name,
        requests: data.count,
        avgResponseTime: Math.round(data.totalTime / data.count),
      }))
      .sort((a, b) => b.requests - a.requests)

    const used = quotaData?.requests_used || 0
    const limit = quotaData?.requests_limit || keyData.monthly_quota
    const remaining = Math.max(0, limit - used)

    return NextResponse.json({
      used,
      limit,
      remaining,
      percentUsed: Math.round((used / limit) * 100),
      resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
      endpoints: endpointStats,
    })
  } catch (error) {
    console.error("[v0] Error in key usage:", error)
    return serverError()
  }
}
