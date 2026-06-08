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

    if (!apiKeyId) {
      return NextResponse.json({ error: "api_key_id required" }, { status: 400 })
    }

    // Get current month quota
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const { data: quotaData, error: quotaError } = await supabase
      .from("quota_usage")
      .select("*")
      .eq("api_key_id", apiKeyId)
      .eq("month", monthStart.toISOString().split("T")[0])
      .single()

    if (quotaError && quotaError.code !== "PGRST116") {
      console.error("[v0] Error fetching quota:", quotaError)
      return serverError("Failed to fetch quota")
    }

    const quotaStatus = quotaData || {
      requests_used: 0,
      requests_limit: 1000000,
      status: "active",
    }

    return NextResponse.json({
      used: quotaStatus.requests_used,
      limit: quotaStatus.requests_limit,
      remaining: Math.max(0, quotaStatus.requests_limit - quotaStatus.requests_used),
      resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
      percentageUsed: ((quotaStatus.requests_used / quotaStatus.requests_limit) * 100).toFixed(2),
      status: quotaStatus.status,
      daysRemaining: Math.ceil((monthEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    })
  } catch (error) {
    console.error("[v0] Error in quota API:", error)
    return serverError()
  }
}
