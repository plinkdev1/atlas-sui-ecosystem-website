import { NextRequest, NextResponse } from "next/server"
import { buildBuyPTBParams, buildSellPTBParams } from "@/lib/nft-aggregator-utils"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, nftId, price, marketplace, walletAddress } = body

    if (!action || !nftId || !walletAddress) {
      return NextResponse.json({ error: "Missing required fields: action, nftId, walletAddress" }, { status: 400 })
    }

    let ptbParams
    if (action === "buy") {
      ptbParams = buildBuyPTBParams(nftId, price, marketplace || "TradePort")
    } else if (action === "sell" || action === "list") {
      if (!price) return NextResponse.json({ error: "Price required for sell/list" }, { status: 400 })
      ptbParams = buildSellPTBParams(nftId, price, marketplace || "TradePort")
    } else {
      return NextResponse.json({ error: "Invalid action. Use: buy, sell, list" }, { status: 400 })
    }

    // Log trade to database
    try {
      const supabase = await createServerClient()
      await supabase.from("nft_trade_logs").insert({
        wallet_address: walletAddress,
        action,
        nft_object_id: nftId,
        collection_name: body.collectionName || "Unknown",
        price_sui: price || "0",
        marketplace_source: marketplace || "TradePort",
        status: "pending",
      })
    } catch (dbError) {
      console.error("[v0] NFT trade log error:", dbError)
    }

    // Award Airpoints (15 pts per trade)
    try {
      await fetch(new URL("/api/airpoints", request.url).toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          walletAddress,
          amount: 15,
          type: "earn_directory",
          description: `NFT ${action}: ${nftId.slice(0, 12)}...`,
        }),
      })
    } catch (airpointsError) {
      console.error("[v0] Airpoints error:", airpointsError)
    }

    return NextResponse.json({
      success: true,
      ptbParams,
      airpointsAwarded: 15,
      message: `NFT ${action} prepared. Sign the transaction in your wallet to complete.`,
    })
  } catch (error) {
    console.error("[v0] NFT trade error:", error)
    return NextResponse.json({ error: "Failed to process NFT trade" }, { status: 500 })
  }
}
