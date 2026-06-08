import { createServerClient_ } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient_()

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured") === "true"
    const verified = searchParams.get("verified") === "true"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const offset = (page - 1) * limit

    // Build query
    let query = supabase.from("provider_listings").select("*", { count: "exact" }).eq("status", "approved")

    if (category) {
      query = query.eq("category", category)
    }

    if (featured) {
      query = query.eq("featured", true)
    }

    if (verified) {
      query = query.not("verified_at", "is", null)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Add pagination
    const {
      data: providers,
      error,
      count,
    } = await query
      .order("featured", { ascending: false })
      .order("verified_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    const total = count || 0
    const hasMore = offset + limit < total

    return NextResponse.json({
      providers: providers || [],
      total,
      page,
      limit,
      hasMore,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to search providers"
    console.error("[v0] Provider search error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
