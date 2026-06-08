import { NextResponse } from "next/server"
import { fetchPythPrices } from "@/lib/oracle-feed-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbolsParam = searchParams.get("symbols")
    const symbols = symbolsParam ? symbolsParam.split(",").map((s) => s.trim().toUpperCase()) : undefined

    const prices = await fetchPythPrices(symbols)

    return NextResponse.json({ prices, timestamp: Date.now() })
  } catch (error) {
    console.error("[v0] Oracle prices error:", error)
    return NextResponse.json({ error: "Failed to fetch oracle prices" }, { status: 500 })
  }
}
