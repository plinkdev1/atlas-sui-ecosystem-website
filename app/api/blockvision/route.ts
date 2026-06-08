import { BlockvisionRequestSchema } from "@/lib/validations"
import { type NextRequest, NextResponse } from "next/server"

const BLOCKVISION_BASE_URL = "https://api.blockvision.org/v2/sui"
const API_KEY = process.env.BLOCKVISION_API_KEY

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // 1. Zod Validation
    const validation = BlockvisionRequestSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        error: "Invalid request data",
        details: validation.error.format()
      }, { status: 400 })
    }

    const { type, address, network, limit } = validation.data

    // 2. Auth Check
    if (!API_KEY) {
      console.error("[Blockvision] API key missing")
      return NextResponse.json({ error: "Upstream API configuration missing" }, { status: 501 })
    }

    let endpoint = ""
    switch (type) {
      case "account-nfts":
        endpoint = `${BLOCKVISION_BASE_URL}/${network}/account/${address}/nfts?limit=${limit}`
        break
      case "account-coins":
        endpoint = `${BLOCKVISION_BASE_URL}/${network}/account/${address}/coins?limit=${limit}`
        break
      case "collection-details":
        endpoint = `${BLOCKVISION_BASE_URL}/${network}/collection/${address}`
        break
      case "transaction-details":
        endpoint = `${BLOCKVISION_BASE_URL}/${network}/transaction/${address}`
        break
      case "coin-market":
        endpoint = `${BLOCKVISION_BASE_URL}/${network}/coin/${encodeURIComponent(address)}/market`
        break
    }

    // 3. Real External Fetch
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("[Blockvision] API request failed:", response.status, errorData)
      return NextResponse.json({
        error: `Blockvision API error: ${response.status}`,
        upstreamError: errorData
      }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error"
    console.error("[Blockvision] Internal Error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
