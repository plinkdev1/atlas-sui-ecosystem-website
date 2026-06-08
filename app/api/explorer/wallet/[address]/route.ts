import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getSuiClient } from "@/lib/sui-client"

export async function GET(request: Request, { params }: { params: { address: string } }) {
  try {
    const address = params.address

    if (!address || !address.startsWith("0x")) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 })
    }

    const supabase = await createServerClient()
    const client = getSuiClient() as any

    // Check cache
    const cacheKey = `wallet:${address}`
    const { data: cached } = await supabase
      .from("explorer_cache")
      .select("data")
      .eq("cache_key", cacheKey)
      .single()

    if (cached) {
      return NextResponse.json({ ...cached.data, cached: true })
    }

    // Fetch wallet data
    const [balance, objects, txBlocks] = await Promise.all([
      client.getBalance({ owner: address }),
      client.getOwnedObjects({
        owner: address,
        options: {
          showType: true,
          showContent: true,
          showDisplay: true,
        },
      }),
      client.queryTransactionBlocks({
        filter: { FromAddress: address },
        limit: 20,
        options: {
          showEffects: true,
          showInput: true,
        },
      }),
    ])

    const walletData = {
      address,
      balance: balance.totalBalance,
      coinType: balance.coinType,
      objects: objects.data,
      transactions: txBlocks.data,
      hasNextPage: txBlocks.hasNextPage,
    }

    // Cache for 5 minutes
    await supabase.from("explorer_cache").upsert({
      cache_key: cacheKey,
      data: walletData,
    })

    return NextResponse.json(walletData)
  } catch (error) {
    console.error("[v0] Wallet fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch wallet data" }, { status: 500 })
  }
}
