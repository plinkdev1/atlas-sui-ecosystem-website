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

    const { data: watchlist, error } = await supabase
      .from("user_data")
      .select("*")
      .eq("user_id", user.id)
      .eq("data_type", "watchlist")

    if (error) throw error

    return NextResponse.json(watchlist || [])
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch watchlist"
    console.error("[v0] Watchlist GET error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { asset_id, asset_type, name, symbol } = body

    if (!asset_id || !asset_type) {
      return NextResponse.json({ error: "asset_id and asset_type are required" }, { status: 400 })
    }

    const supabase = await createServerClient_()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: item, error } = await supabase
      .from("user_data")
      .insert({
        user_id: user.id,
        data_type: "watchlist",
        asset_id,
        asset_type,
        value: { asset_id, asset_type, name, symbol },
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(item, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to add to watchlist"
    console.error("[v0] Watchlist POST error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assetId = searchParams.get("asset_id")

    if (!assetId) {
      return NextResponse.json({ error: "asset_id is required" }, { status: 400 })
    }

    const supabase = await createServerClient_()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase
      .from("user_data")
      .delete()
      .eq("user_id", user.id)
      .eq("asset_id", assetId)
      .eq("data_type", "watchlist")

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to remove from watchlist"
    console.error("[v0] Watchlist DELETE error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
