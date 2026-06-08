import { createServerClient_ } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createServerClient_()

    // Get provider listing
    const { data: listing, error: listingError } = await supabase
      .from("provider_listings")
      .select("*")
      .eq("id", id)
      .single()

    if (listingError || !listing) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 })
    }

    // Get provider usage stats
    const { data: usage, error: usageError } = await supabase
      .from("provider_usage")
      .select("uptime_percent, response_time_avg_ms")
      .eq("id", listing.provider_id)
      .order("period_date", { ascending: false })
      .limit(1)
      .single()

    // Get ratings
    const { data: ratings, error: ratingsError } = await supabase
      .from("asset_ratings")
      .select("rating")
      .eq("asset_address", listing.provider_id)

    if (listingError || listingError) throw listingError || usageError

    const avgUptime = usage?.uptime_percent || 99.9
    const avgResponseTime = usage?.response_time_avg_ms || 0
    const totalRatings = ratings?.length || 0
    const legitimacyScore =
      totalRatings > 0
        ? Math.round(((ratings?.filter((r) => r.rating === 1).length || 0) / totalRatings) * 100 * 10) / 10
        : 0

    return NextResponse.json({
      provider: listing,
      stats: {
        uptime: avgUptime,
        responseTime: avgResponseTime,
        totalRatings,
        legitimacyScore,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch provider details"
    console.error("[v0] Provider details error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
