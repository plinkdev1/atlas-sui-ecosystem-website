import { type NextRequest, NextResponse } from "next/server"
import { Transaction } from "@mysten/sui/transactions"

interface StakeRequest {
  walletAddress: string
  poolId: string
  amount: string
}

export async function POST(request: NextRequest) {
  try {
    const body: StakeRequest = await request.json()
    const { walletAddress, poolId, amount } = body

    if (!walletAddress || !poolId || !amount) {
      return NextResponse.json({ error: "walletAddress, poolId, and amount are required" }, { status: 400 })
    }

    console.log("[v0] Stake request:", { walletAddress, poolId, amount })

    // NOTE: In production, this would build a real PTB with Cetus SDK:
    // const cetusClient = await initCetusSDK({ network: 'testnet' })
    // const txBlock = await cetusClient.createAddLiquidityTransactionPayload({
    //   pool: poolId,
    //   amount: amount,
    //   account: walletAddress,
    //   partnerFeePercent: 0.01, // 1% referral to Atlas
    // })

    // For now, return a mock PTB structure
    const txBlock = new Transaction()
    // Use the correct @mysten/sui Transaction API
    txBlock.moveCall({
      target: "0x1::sui::transfer::public_transfer",
      arguments: [],
      typeArguments: [],
    })

    console.log("[v0] Stake transaction prepared for pool:", poolId)
    return NextResponse.json(
      {
        txBlock: txBlock.serialize(),
        poolId,
        amount,
        partnerFeeNote: "Atlas earns referral commission through Cetus partnership — no cost to you",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to prepare stake transaction"
    console.error("[v0] Stake execution error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
