import { BlockberryRequestSchema } from "@/lib/validations"
import { type NextRequest, NextResponse } from "next/server"

const BLOCKBERRY_BASE_URL = "https://api.blockberry.one/sui/v1"
const API_KEY = process.env.BLOCKBERRY_API_KEY

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // 1. Validate input with Zod
    const validation = BlockberryRequestSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        error: "Invalid request data",
        details: validation.error.format()
      }, { status: 400 })
    }

    const { type, address, network } = validation.data

    // 2. Auth Check (Server-side API Key)
    if (!API_KEY) {
      console.error("[Blockberry] API key missing")
      return NextResponse.json({ error: "Upstream API configuration missing" }, { status: 501 })
    }

    let endpoint = ""
    switch (type) {
      case "nft-security":
        endpoint = `${BLOCKBERRY_BASE_URL}/${network}/nft/${address}/security`
        break
      case "coin-security":
        endpoint = `${BLOCKBERRY_BASE_URL}/${network}/coin/${encodeURIComponent(address)}/security`
        break
      case "tx-security":
        endpoint = `${BLOCKBERRY_BASE_URL}/${network}/transaction/${address}/security`
        break
      case "nft-metadata":
        endpoint = `${BLOCKBERRY_BASE_URL}/${network}/nft/${address}/metadata`
        break
      case "coin-metadata":
        endpoint = `${BLOCKBERRY_BASE_URL}/${network}/coin/${encodeURIComponent(address)}/metadata`
        break
    }

    // 3. Real External Fetch
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("[Blockberry] API request failed:", response.status, errorData)
      return NextResponse.json({
        error: `Blockberry API error: ${response.status}`,
        upstreamError: errorData
      }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error"
    console.error("[Blockberry] Internal Error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
