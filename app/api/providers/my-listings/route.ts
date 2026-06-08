import { createServerClient_ } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient_()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get provider ID for this user from providers table
    const { data: provider, error: providerError } = await supabase
      .from("providers")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (providerError || !provider) {
      return NextResponse.json({ listings: [] })
    }

    // Get all listings for this provider
    const { data: listings, error } = await supabase
      .from("provider_listings")
      .select("*")
      .eq("provider_id", provider.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ listings: listings || [] })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch listings"
    console.error("[v0] My listings error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
