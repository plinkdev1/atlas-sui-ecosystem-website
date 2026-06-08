import { NextResponse } from "next/server"
import { fetchSuiValidators, cacheValidatorData } from "@/lib/sui-staking"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    // Check cache first
    const { data: cachedValidators, error: cacheError } = await supabase
      .from("validator_cache")
      .select("*")
      .gt("last_updated", new Date(Date.now() - 5 * 60 * 1000).toISOString())
      .order("apr_percentage", { ascending: false })

    if (cachedValidators && cachedValidators.length > 0) {
      return NextResponse.json({
        validators: cachedValidators,
        source: "cache",
      })
    }

    // Fetch fresh data from Sui
    const validators = await fetchSuiValidators()

    // Update cache
    for (const validator of validators) {
      try {
        await cacheValidatorData(validator.suiAddress)
      } catch (err) {
        console.error(`[v0] Error caching validator ${validator.suiAddress}:`, err)
      }
    }

    return NextResponse.json({
      validators: validators.sort((a, b) => b.aprPercentage - a.aprPercentage),
      source: "sui-network",
    })
  } catch (error) {
    console.error("[v0] Error fetching validators:", error)
    return NextResponse.json({ error: "Failed to fetch validators" }, { status: 500 })
  }
}
