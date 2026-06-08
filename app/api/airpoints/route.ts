import { creditAirpoints } from "@/lib/airpoints-engine"
import {
  creditMonthlyAirpoints,
  getAirpointsHistory,
  getUserAirpointsBalance,
  redeemAirpoints,
  updateAirpointsTier,
} from "@/lib/supabase/airpoints"
import { createServerClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * Airpoints API Route - Local Fallback
 *
 * Architecture:
 * - Primary: Edge Functions in master Supabase (via useAirpointsSync hook)
 * - Fallback: Local Supabase direct calls (this route)
 * - Reads: Always from local Supabase for fast access
 * - Writes: Attempted via Edge Function first, falls back to local
 *
 * This route maintains backward compatibility and serves as fallback
 * when NEXT_PUBLIC_AIRPOINTS_EDGE_FUNCTION_URL is not configured.
 */

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get("action")

    // Get balance
    if (action === "balance") {
      const balance = await getUserAirpointsBalance(user.id)
      return NextResponse.json({ balance })
    }

    // Get history
    if (action === "history") {
      const limit = parseInt(searchParams.get("limit") || "50")
      const offset = parseInt(searchParams.get("offset") || "0")
      const history = await getAirpointsHistory(user.id, limit, offset)
      return NextResponse.json({ history })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Airpoints API GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, walletAddress, amount, type, description } = body

    // Add airpoints (admin/server action)
    if (action === "add") {
      if (!walletAddress || !amount || !type) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
      }

      const result = await creditAirpoints(user.id, walletAddress, amount, type, description)
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }
      return NextResponse.json({ success: true, newBalance: result.newBalance })
    }

    // Redeem airpoints
    if (action === "redeem") {
      if (!walletAddress || !amount || !type) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
      }

      const validRedeemTypes = ["redeem_discount", "redeem_feature"]
      if (!validRedeemTypes.includes(type)) {
        return NextResponse.json({ error: "Invalid redeem type" }, { status: 400 })
      }

      const result = await redeemAirpoints(user.id, walletAddress, amount, type, description)
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }
      return NextResponse.json({ success: true, newBalance: result.newBalance })
    }

    // Update tier
    if (action === "update-tier") {
      if (!type || !["free", "pro", "pro+"].includes(type)) {
        return NextResponse.json({ error: "Invalid tier" }, { status: 400 })
      }

      const success = await updateAirpointsTier(user.id, type)
      if (!success) {
        return NextResponse.json({ error: "Failed to update tier" }, { status: 400 })
      }
      return NextResponse.json({ success: true })
    }

    // Credit monthly airpoints
    if (action === "creditMonthly") {
      const { tier } = body
      if (!tier || !["free", "pro", "pro+"].includes(tier)) {
        return NextResponse.json({ error: "Invalid tier" }, { status: 400 })
      }

      const result = await creditMonthlyAirpoints(user.id, tier)
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }
      return NextResponse.json({ success: true, credited: result.credited, amount: result.amount })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Airpoints API POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
