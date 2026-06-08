import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const verified = searchParams.get("verified")

  try {
    const supabase = await createServerClient()

    let query = supabase
      .from("provider_listings")
      .select(`
        *,
        providers:provider_id (
          id,
          name,
          email,
          role
        )
      `)
      .in("status", ["approved", "featured"])
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    if (verified === "true") {
      query = query.not("verified_at", "is", null)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching listings:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const providers = data?.map((listing) => ({
      id: listing.id,
      name: listing.name,
      provider: listing.providers?.name || "Unknown",
      type: listing.category,
      pricing: listing.pricing_tier,
      verified: !!listing.verified_at,
      tags: Array.isArray(listing.features) ? listing.features : [],
      description: listing.description || "",
      website: listing.website_url || "",
      logo: listing.logo_url || "",
      sla: "99.9% uptime",
      acceptedTokens: ["SUI", "USDC"],
      pricingTiers: [],
      featured: listing.featured || false,
    })) || []

    return NextResponse.json({ providers }, { status: 200 })
  } catch (error) {
    console.error("[v0] Server error:", error)
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}
