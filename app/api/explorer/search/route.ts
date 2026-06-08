import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getSuiClient } from "@/lib/sui-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ error: "Query parameter required" }, { status: 400 })
    }

    const supabase = await createServerClient()
    const client = getSuiClient() as any

    // Check cache first
    const cacheKey = `search:${query}`
    const { data: cached } = await supabase
      .from("explorer_cache")
      .select("data")
      .eq("cache_key", cacheKey)
      .single()

    if (cached) {
      return NextResponse.json({ ...cached.data, cached: true })
    }

    let result: any = { type: "unknown", data: null }

    // Try as transaction hash
    if (query.length === 44 || query.length === 64) {
      try {
        const tx = await client.getTransactionBlock({
          digest: query,
          options: { showEffects: true, showInput: true },
        })
        result = { type: "transaction", data: tx }
      } catch (err) {
        console.log("[v0] Not a transaction hash")
      }
    }

    // Try as address (wallet or object)
    if (result.type === "unknown" && query.startsWith("0x")) {
      try {
        const balance = await client.getBalance({ owner: query })
        const objects = await client.getOwnedObjects({ owner: query, limit: 5 })
        result = { type: "address", data: { balance, objects } }
      } catch (err) {
        console.log("[v0] Not a valid address")
      }
    }

    // Try as block/checkpoint number
    if (result.type === "unknown" && /^\d+$/.test(query)) {
      try {
        const checkpoint = await client.getCheckpoint({ id: query })
        result = { type: "block", data: checkpoint }
      } catch (err) {
        console.log("[v0] Not a valid checkpoint")
      }
    }

    // Cache the result for 5 minutes
    if (result.type !== "unknown") {
      await supabase.from("explorer_cache").upsert({
        cache_key: cacheKey,
        data: result,
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Explorer search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
