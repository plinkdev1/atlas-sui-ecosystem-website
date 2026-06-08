import { NextRequest, NextResponse } from "next/server"
import { getNFTListings } from "@/lib/nft-aggregator-utils"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filters = {
      collection: searchParams.get("collection") || undefined,
      minPrice: searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined,
      maxPrice: searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined,
      sortBy: (searchParams.get("sortBy") as any) || "recent",
      marketplace: searchParams.get("marketplace") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "20"),
    }

    const result = await getNFTListings(filters)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] NFT listings error:", error)
    return NextResponse.json({ error: "Failed to fetch NFT listings" }, { status: 500 })
  }
}
