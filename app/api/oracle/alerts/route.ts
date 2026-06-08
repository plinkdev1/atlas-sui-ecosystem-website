import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { fetchPythPrices, checkAlerts } from "@/lib/oracle-feed-utils"
import type { PriceAlert } from "@/lib/oracle-feed-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("wallet")
    if (!walletAddress) return NextResponse.json({ error: "wallet required" }, { status: 400 })

    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from("oracle_alerts")
      .select("*")
      .eq("wallet_address", walletAddress)
      .order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json({ alerts: data || [] })
  } catch (error) {
    console.error("[v0] Oracle alerts GET error:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { walletAddress, assetSymbol, direction, thresholdPrice } = body

    if (!walletAddress || !assetSymbol || !direction || !thresholdPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from("oracle_alerts")
      .insert({
        wallet_address: walletAddress,
        asset_symbol: assetSymbol.toUpperCase(),
        direction,
        threshold_price: thresholdPrice,
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error

    // Award 2 Airpoints for creating alert
    try {
      await fetch(new URL("/api/airpoints", request.url).toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          walletAddress,
          amount: 2,
          type: "earn_directory",
          description: `Created price alert: ${assetSymbol} ${direction} $${thresholdPrice}`,
        }),
      })
    } catch (e) {
      console.error("[v0] Airpoints award error:", e)
    }

    return NextResponse.json({ alert: data, airpoints: 2 })
  } catch (error) {
    console.error("[v0] Oracle alerts POST error:", error)
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const alertId = searchParams.get("id")
    const walletAddress = searchParams.get("wallet")
    if (!alertId || !walletAddress) return NextResponse.json({ error: "id and wallet required" }, { status: 400 })

    const supabase = await createServerClient()
    const { error } = await supabase
      .from("oracle_alerts")
      .delete()
      .eq("id", alertId)
      .eq("wallet_address", walletAddress)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Oracle alerts DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete alert" }, { status: 500 })
  }
}
