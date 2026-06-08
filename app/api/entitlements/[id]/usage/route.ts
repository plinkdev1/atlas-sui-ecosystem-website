import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { withAuth, unauthorized, badRequest, serverError } from "@/lib/auth-middleware"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await withAuth(request)
    if (!auth.valid || !auth.userId) {
      return unauthorized()
    }

    const { id } = await params

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

    // Verify user owns this entitlement
    const { data: entitlement, error: entitlementError } = await supabase
      .from("entitlements")
      .select("*")
      .eq("id", id)
      .eq("user_id", auth.userId)
      .single()

    if (entitlementError || !entitlement) {
      return badRequest("Entitlement not found or access denied")
    }

    // Fetch usage stats
    const { data: usage, error: usageError } = await supabase
      .from("provider_usage")
      .select("*")
      .eq("entitlement_id", id)
      .order("period_date", { ascending: false })
      .limit(30)

    if (usageError) {
      console.error("[v0] Error fetching usage:", usageError)
      return serverError()
    }

    // Calculate aggregated stats
    const totalRequests = usage.reduce((sum, u) => sum + (u.requests_count || 0), 0)
    const totalBandwidth = usage.reduce((sum, u) => sum + (u.bandwidth_gb || 0), 0)
    const avgUptime =
      usage.length > 0 ? usage.reduce((sum, u) => sum + (u.uptime_percent || 100), 0) / usage.length : 100

    return NextResponse.json(
      {
        entitlementId: id,
        requests: totalRequests,
        bandwidth: totalBandwidth,
        uptime: avgUptime,
        period: "all_time",
        usage: usage,
        entitlementStatus: entitlement.status,
        expiresAt: entitlement.expires_at,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error in usage API:", error)
    return serverError()
  }
}
