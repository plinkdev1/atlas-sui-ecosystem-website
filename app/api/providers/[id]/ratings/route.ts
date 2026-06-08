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

    // Get asset ratings for this provider
    const { data: ratings, error: ratingsError } = await supabase
      .from("asset_ratings")
      .select("*")
      .eq("asset_address", listing.provider_id)
      .order("created_at", { ascending: false })

    if (ratingsError) throw ratingsError

    // Calculate stats
    const totalRatings = ratings?.length || 0
    const legit = ratings?.filter((r) => r.rating === 1).length || 0
    const scam = ratings?.filter((r) => r.rating === -1).length || 0
    const legitimacyScore = totalRatings > 0 ? (legit / totalRatings) * 100 : 0

    return NextResponse.json({
      provider: listing,
      ratings: ratings || [],
      stats: {
        totalRatings,
        legit,
        scam,
        legitimacyScore: Math.round(legitimacyScore * 10) / 10,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch ratings"
    console.error("[v0] Provider ratings error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createServerClient_()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { rating, comment, asset_address } = body

    if (!asset_address || ![1, -1].includes(rating)) {
      return NextResponse.json({ error: "Invalid rating data" }, { status: 400 })
    }

    // Get user's wallet address
    const { data: profile } = await supabase.from("user_profiles").select("wallet_address").eq("id", user.id).single()

    if (!profile?.wallet_address) {
      return NextResponse.json({ error: "User wallet not found" }, { status: 400 })
    }

    // Submit rating
    const { data: newRating, error } = await supabase
      .from("asset_ratings")
      .upsert(
        {
          asset_address,
          user_wallet: profile.wallet_address,
          rating,
          comment,
        },
        {
          onConflict: "asset_address,user_wallet",
        },
      )
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(newRating, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit rating"
    console.error("[v0] Rating submission error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
