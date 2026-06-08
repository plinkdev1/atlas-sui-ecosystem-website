import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { assetIds } = await request.json()

    if (!assetIds || assetIds.length === 0) {
      return NextResponse.json({ prices: {} })
    }

    // Fetch prices from CoinGecko API
    const ids = assetIds.slice(0, 250).join(",") // CoinGecko has a limit
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`,
    )

    if (!response.ok) {
      return NextResponse.json({ prices: {} })
    }

    const data = await response.json()

    // Transform data to match our format
    interface PriceData {
      usd: number
      usd_24h_change: number
    }

    const prices: Record<string, { price: number; change24h: number }> = {}
    Object.entries(data as Record<string, PriceData>).forEach(([id, priceData]) => {
      prices[id] = {
        price: priceData.usd,
        change24h: priceData.usd_24h_change,
      }
    })

    return NextResponse.json({ prices })
  } catch (error) {
    console.error("[v0] Prices API error:", error)
    return NextResponse.json({ prices: {} })
  }
}
