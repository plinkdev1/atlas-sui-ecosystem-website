import { supabaseAdmin } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")

    if (!providerId) {
      return NextResponse.json({ error: "providerId required" }, { status: 400 })
    }

    // Fetch usage metrics from provider_usage
    const { data: usageData } = await supabaseAdmin
      .from("provider_usage")
      .select("*")
      .eq("entitlement_id", providerId)
      .order("period_date", { ascending: false })
      .limit(30)

    // Fetch revenue records
    const { data: revenueData } = await supabaseAdmin
      .from("revenue_records")
      .select("*")
      .order("period_month", { ascending: false })
      .limit(12)

    // Fetch provider listings
    const { data: listings } = await supabaseAdmin
      .from("provider_listings")
      .select("*")
      .eq("provider_id", providerId)

    const totalRequests = usageData?.reduce((sum, u) => sum + (u.requests_count || 0), 0) || 0
    const avgResponseTime = usageData?.length
      ? Math.round(usageData.reduce((sum, u) => sum + (u.response_time_avg_ms || 0), 0) / usageData.length)
      : 0
    const avgUptime = usageData?.length
      ? (usageData.reduce((sum, u) => sum + Number(u.uptime_percent || 0), 0) / usageData.length).toFixed(2)
      : "99.99"
    const totalRevenue = revenueData?.reduce((sum, r) => sum + Number(r.revenue_share_provider || 0), 0) || 0

    return NextResponse.json({
      analytics: {
        totalRequests,
        avgResponseTime,
        avgUptime,
        totalRevenue,
        usageHistory: usageData || [],
        revenueHistory: revenueData || [],
        listings: listings || [],
      },
    })
  } catch (error) {
    console.error("[v0] Provider analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
