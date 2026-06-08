import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const searchParams = request.nextUrl.searchParams
    const walletAddress = searchParams.get("wallet")

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    // Get user's entitlements
    const { data: entitlements, error: entError } = await supabase
      .from("entitlements")
      .select("id, provider_id, tier_name, status, granted_at")
      .eq("user_id", walletAddress)
      .eq("status", "active")

    if (entError) {
      console.error("[v0] Error fetching entitlements:", entError)
      return NextResponse.json({ error: "Failed to fetch entitlements" }, { status: 500 })
    }

    // For each entitlement, get usage data
    const usagePromises = (entitlements || []).map(async (entitlement) => {
      const { data: usage, error: usageError } = await supabase
        .from("provider_usage")
        .select("*")
        .eq("entitlement_id", entitlement.id)
        .order("period_date", { ascending: false })
        .limit(30) // Last 30 days

      if (usageError) {
        console.error("[v0] Error fetching usage for entitlement:", entitlement.id, usageError)
        return null
      }

      return {
        entitlementId: entitlement.id,
        providerId: entitlement.provider_id,
        tierName: entitlement.tier_name,
        status: entitlement.status,
        grantedAt: entitlement.granted_at,
        usage: usage || [],
      }
    })

    const usageData = await Promise.all(usagePromises)
    const filteredUsage = usageData.filter((u) => u !== null)

    return NextResponse.json({ usage: filteredUsage })
  } catch (error) {
    console.error("[v0] Error in provider usage API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
