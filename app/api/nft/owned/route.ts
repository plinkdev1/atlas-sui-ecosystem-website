import { NextRequest, NextResponse } from "next/server"
import { getOwnedNFTs } from "@/lib/nft-aggregator-utils"

export async function GET(request: NextRequest) {
  try {
    const wallet = request.nextUrl.searchParams.get("wallet")
    if (!wallet) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    const nfts = await getOwnedNFTs(wallet)
    return NextResponse.json({ nfts, total: nfts.length })
  } catch (error) {
    console.error("[v0] Owned NFTs error:", error)
    return NextResponse.json({ error: "Failed to fetch owned NFTs" }, { status: 500 })
  }
}
