import { NextResponse } from "next/server"
import { getSwapQuotes, findBestRoute } from "@/lib/swap-aggregator-utils"
import { createServerClient } from "@/lib/supabase/server"
import { getSuiClient } from "@/lib/sui-utils"

export async function POST(request: Request) {
  try {
    const { tokenIn, tokenOut, amount } = await request.json()

    if (!tokenIn || !tokenOut || !amount) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const client = getSuiClient() as any
    const quotes = await getSwapQuotes(client, tokenIn, tokenOut, amount)

    if (quotes.length === 0) {
      return NextResponse.json({ error: "No quotes available" }, { status: 404 })
    }

    const bestRoute = findBestRoute(quotes)

    return NextResponse.json({
      quotes,
      bestRoute,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("[v0] Error getting swap quotes:", error)
    return NextResponse.json(
      { error: "Failed to get swap quotes" },
      { status: 500 },
    )
  }
}
