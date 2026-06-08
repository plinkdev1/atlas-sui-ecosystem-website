import { NextResponse } from "next/server"
import { getUserDelegations } from "@/lib/sui-staking"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("wallet")

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Get user delegations from database
    const { data: userDelegations, error } = await supabase
      .from("user_delegations")
      .select("*")
      .eq("wallet_address", walletAddress)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to fetch delegations" }, { status: 500 })
    }

    // Calculate total staked
    const totalStaked = userDelegations.reduce((sum, d) => sum + parseFloat(d.amount || "0"), 0)

    // Award Airpoints for checking delegations (2 points)
    try {
      await fetch("/api/airpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          walletAddress,
          amount: 2,
          type: "earn_directory",
          description: `Checked staking delegations`,
        }),
      })
    } catch (airpointsError) {
      console.error("[v0] Error awarding Airpoints:", airpointsError)
    }

    return NextResponse.json({
      delegations: userDelegations,
      totalStaked: (totalStaked / 1e9).toFixed(2),
      delegationCount: userDelegations.length,
    })
  } catch (error) {
    console.error("[v0] Error fetching user delegations:", error)
    return NextResponse.json({ error: "Failed to fetch delegations" }, { status: 500 })
  }
}
