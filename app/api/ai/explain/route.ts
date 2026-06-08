import { explainTransaction } from "@/lib/ai-explain-utils"
import { creditAirpoints } from "@/lib/airpoints-engine"
import { unauthorized, withAuth } from "@/lib/auth-middleware"
import { getSuiClient } from "@/lib/sui-utils"
import { getUserSubscription } from "@/lib/supabase/subscriptions"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const authResult = await withAuth(request as any)
    if (!authResult.valid) {
      return unauthorized(authResult.error)
    }

    const { digest } = await request.json()

    if (!digest) {
      return NextResponse.json({ error: "Transaction digest required" }, { status: 400 })
    }

    // Check Pro status for "Rich" explanation
    const subscription = await getUserSubscription(authResult.userId!)
    const isPro = subscription?.tier === "pro" || subscription?.tier === "pro+"

    const client = getSuiClient() as any
    const explanation = await explainTransaction(digest, client, isPro)

    // Award Airpoints for explanation (5 points) via centralized engine
    try {
      await creditAirpoints(
        authResult.userId!,
        authResult.walletAddress!,
        5,
        "earn_explainer",
        `Got AI explanation for ${digest.slice(0, 8)}...`
      )
    } catch (error) {
      console.error("[v0] Error awarding Airpoints:", error)
    }

    return NextResponse.json({
      explanation,
      isPro,
      airpointsAwarded: 5,
    })
  } catch (error) {
    console.error("[v0] Error explaining transaction:", error)
    return NextResponse.json(
      { error: "Failed to explain transaction" },
      { status: 500 },
    )
  }
}
