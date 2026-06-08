import { NextRequest, NextResponse } from "next/server"
import { getNFTSummary } from "@/lib/nft-aggregator-utils"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: "NFT ID is required" }, { status: 400 })
    }

    const nftDetail = await getNFTSummary(id)
    if (!nftDetail) {
      return NextResponse.json({ error: "NFT not found" }, { status: 404 })
    }

    return NextResponse.json({ nft: nftDetail })
  } catch (error) {
    console.error("[v0] NFT detail error:", error)
    return NextResponse.json({ error: "Failed to fetch NFT details" }, { status: 500 })
  }
}
