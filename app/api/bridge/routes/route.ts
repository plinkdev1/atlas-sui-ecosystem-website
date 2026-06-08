import { NextRequest, NextResponse } from "next/server"
import { getBridgeRoutes, findBestBridgeRoute, SUPPORTED_CHAINS, BRIDGE_TOKENS } from "@/lib/bridge-aggregator-utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sourceChain = searchParams.get("sourceChain")
    const destChain = searchParams.get("destChain")
    const token = searchParams.get("token")
    const amount = parseFloat(searchParams.get("amount") || "0")

    if (!sourceChain || !destChain || !token || amount <= 0) {
      return NextResponse.json({ error: "Missing required parameters: sourceChain, destChain, token, amount" }, { status: 400 })
    }

    const routes = await getBridgeRoutes(sourceChain, destChain, token, amount)
    const bestRoute = findBestBridgeRoute(routes)

    return NextResponse.json({
      routes,
      bestRoute,
      supportedChains: SUPPORTED_CHAINS,
      supportedTokens: BRIDGE_TOKENS,
      totalRoutes: routes.length,
    })
  } catch (error) {
    console.error("[v0] Bridge routes error:", error)
    return NextResponse.json({ error: "Failed to fetch bridge routes" }, { status: 500 })
  }
}
