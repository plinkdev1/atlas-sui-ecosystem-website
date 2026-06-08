import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { routeId, provider, sourceChain, destChain, token, amount, walletAddress, fee } = await request.json()

    if (!routeId || !walletAddress || !sourceChain || !destChain) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Log bridge transaction
    const { data: bridgeLog, error: logError } = await supabase
      .from("bridge_logs")
      .insert({
        wallet_address: walletAddress,
        source_chain: sourceChain,
        dest_chain: destChain,
        token: token || "SUI",
        amount: amount || 0,
        provider: provider || "unknown",
        fee: fee || 0,
        status: "pending",
      })
      .select()
      .single()

    if (logError) {
      console.error("[v0] Bridge log error:", logError)
    }

    // Award 15 Airpoints for bridge
    try {
      await fetch(new URL("/api/airpoints", request.url).toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          walletAddress,
          amount: 15,
          type: "earn_directory",
          description: `Bridge ${amount} ${token} from ${sourceChain} to ${destChain} via ${provider}`,
        }),
      })
    } catch (airpointsError) {
      console.error("[v0] Airpoints error:", airpointsError)
    }

    return NextResponse.json({
      success: true,
      bridgeLogId: bridgeLog?.id,
      message: `Bridge initiated: ${amount} ${token} from ${sourceChain} to ${destChain} via ${provider}. +15 Airpoints!`,
      status: "pending",
      note: "Transaction requires wallet signature. Connect wallet and approve the transaction to complete the bridge.",
    })
  } catch (error) {
    console.error("[v0] Bridge execute error:", error)
    return NextResponse.json({ error: "Failed to execute bridge" }, { status: 500 })
  }
}
