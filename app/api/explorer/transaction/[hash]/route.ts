import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getSuiClient } from "@/lib/sui-client"

export async function GET(request: Request, { params }: { params: { hash: string } }) {
  try {
    const hash = params.hash

    if (!hash) {
      return NextResponse.json({ error: "Transaction hash required" }, { status: 400 })
    }

    const supabase = await createServerClient()
    const client = getSuiClient() as any

    // Check cache
    const cacheKey = `tx:${hash}`
    const { data: cached } = await supabase
      .from("explorer_cache")
      .select("data")
      .eq("cache_key", cacheKey)
      .single()

    if (cached) {
      return NextResponse.json({ ...cached.data, cached: true })
    }

    // Fetch transaction details
    const tx = await client.getTransactionBlock({
      digest: hash,
      options: {
        showEffects: true,
        showInput: true,
        showEvents: true,
        showObjectChanges: true,
        showBalanceChanges: true,
      },
    })

    // Cache for 5 minutes
    await supabase.from("explorer_cache").upsert({
      cache_key: cacheKey,
      data: tx,
    })

    return NextResponse.json(tx)
  } catch (error) {
    console.error("[v0] Transaction fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch transaction" }, { status: 500 })
  }
}
