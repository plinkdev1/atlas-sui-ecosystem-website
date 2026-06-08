import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getSuiClient } from "@/lib/sui-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "20")
    const cursor = searchParams.get("cursor")

    const supabase = await createServerClient()
    const client = getSuiClient() as any

    // Check cache
    const cacheKey = `blocks:${limit}:${cursor || "latest"}`
    const { data: cached } = await supabase
      .from("explorer_cache")
      .select("data")
      .eq("cache_key", cacheKey)
      .single()

    if (cached) {
      return NextResponse.json({ ...cached.data, cached: true })
    }

    // Get latest checkpoint first
    const latestCheckpoint = await client.getLatestCheckpointSequenceNumber()

    // Fetch recent checkpoints
    const checkpoints = []
    const startSeq = cursor ? parseInt(cursor) : parseInt(latestCheckpoint)

    for (let i = 0; i < Math.min(limit, 20); i++) {
      const seq = startSeq - i
      if (seq < 0) break

      try {
        const checkpoint = await client.getCheckpoint({ id: seq.toString() })
        checkpoints.push(checkpoint)
      } catch (err) {
        console.log(`[v0] Failed to fetch checkpoint ${seq}`)
        break
      }
    }

    const blocksData = {
      blocks: checkpoints,
      latestCheckpoint,
      hasMore: checkpoints.length === limit,
      nextCursor: checkpoints.length > 0 ? (startSeq - checkpoints.length).toString() : null,
    }

    // Cache for 30 seconds (blocks change frequently)
    await supabase.from("explorer_cache").upsert({
      cache_key: cacheKey,
      data: blocksData,
    })

    return NextResponse.json(blocksData)
  } catch (error) {
    console.error("[v0] Blocks fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch blocks" }, { status: 500 })
  }
}
