import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const treasuryAddress = process.env.PAYMENT_TREASURY || process.env.NEXT_PUBLIC_PAYMENT_TREASURY

    if (!treasuryAddress) {
      return NextResponse.json({ error: "Treasury address not configured" }, { status: 500 })
    }

    return NextResponse.json({ treasury: treasuryAddress }, { status: 200 })
  } catch (error: unknown) {
    console.error("[v0] Treasury endpoint error:", error)
    return NextResponse.json({ error: "Failed to fetch treasury address" }, { status: 500 })
  }
}
