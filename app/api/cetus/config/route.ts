import { type NextRequest, NextResponse } from "next/server"

// Cetus SDK configuration for different networks
const CETUS_CONFIG = {
  testnet: {
    package_id: "0x95b8d278b876cae22206131fb9b868e0e6f8e6a7a76e3dc6e32357aa2ebc1935",
    publish_at_tx: "0x47b224762dc9b922dcd6b11216ffd27ff72288bf4ac3b966fb10d628fbc28b88",
    coin_list_id: "0x8cbc11d9e3ec08f7weac4bae3fe5957023fae36bc38ddbd547a38cf498cc5faa3",
    launchpad_id: "0x1098fac992eab771642e9268e54fb13830c3460eea77b9f549210c96ea9b248c",
    clmm_data: {
      pools_id: "0xcf994611fd4c48e277ce3ffd4d4364c914af2c3cbb05f7bf6ff3433bcf69f91a",
    },
  },
  mainnet: {
    package_id: "0x95b8d278b876cae22206131fb9b868e0e6f8e6a7a76e3dc6e32357aa2ebc1935",
    publish_at_tx: "0x47b224762dc9b922dcd6b11216ffd27ff72288bf4ac3b966fb10d628fbc28b88",
    coin_list_id: "0x8cbc11d9e3ec08f7weac4bae3fe5957023fae36bc38ddbd547a38cf498cc5faa3",
    launchpad_id: "0x1098fac992eab771642e9268e54fb13830c3460eea77b9f549210c96ea9b248c",
    clmm_data: {
      pools_id: "0xcf994611fd4c48e277ce3ffd4d4364c914af2c3cbb05f7bf6ff3433bcf69f91a",
    },
  },
}

export async function GET(request: NextRequest) {
  try {
    const network = (process.env.NEXT_PUBLIC_SUI_NETWORK as "testnet" | "mainnet") || "testnet"
    const rpcUrl = process.env.SUI_TESTNET_RPC || `https://fullnode.${network}.sui.io:443`

    console.log("[v0] Cetus config endpoint - network:", network)

    const config = {
      network,
      rpcUrl,
      config: CETUS_CONFIG[network],
      cetusPartnerId: process.env.CETUS_PARTNER_ID || null,
    }

    return NextResponse.json(config)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch Cetus config"
    console.error("[v0] Cetus config error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
