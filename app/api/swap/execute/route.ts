import { NextResponse } from "next/server"
import { buildSwapPTB, BestRoute } from "@/lib/swap-aggregator-utils"
import { createServerClient } from "@/lib/supabase/server"
import { getSuiClient } from "@/lib/sui-utils"

export async function POST(request: Request) {
  try {
    const { route, senderAddress, walletAddress } = await request.json()

    if (!route || !senderAddress) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const client = getSuiClient() as any

    // Build PTB for best route
    const txDigest = await buildSwapPTB(client, route as BestRoute, senderAddress)

    // Award Airpoints for swap (10 points)
    try {
      const supabase = await createServerClient()
      await fetch("/api/airpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          walletAddress: senderAddress,
          amount: 10,
          type: "earn_swap",
          description: `Swapped ${route.quote.inputAmount} via ${route.selectedDex}`,
        }),
      })
    } catch (airpointsError) {
      console.error("[v0] Error awarding Airpoints:", airpointsError)
    }

    return NextResponse.json({
      success: true,
      txDigest,
      route,
      airpointsAwarded: 10,
    })
  } catch (error) {
    console.error("[v0] Error executing swap:", error)
    return NextResponse.json(
      { error: "Failed to execute swap" },
      { status: 500 },
    )
  }
}
