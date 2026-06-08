import { type NextRequest, NextResponse } from "next/server"

interface PoolData {
  poolId: string
  name: string
  apr: number
  tvl: string
  fee: number
  tokenA: string
  tokenB: string
}

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Fetching Cetus pool APRs...")

    // NOTE: In production, this would use real Cetus SDK:
    // const cetusClient = await initCetusSDK({ network: 'testnet' })
    // const pools = await cetusClient.getPools()
    // const aprs = pools.map(pool => ({
    //   poolId: pool.id,
    //   apr: pool.apr,
    //   tvl: pool.tvl,
    //   ...
    // }))

    // For now, return realistic mock data with various APRs
    const mockPools: PoolData[] = [
      {
        poolId: "0x1",
        name: "SUI/USDC",
        apr: 12.5,
        tvl: "$2.5M",
        fee: 0.3,
        tokenA: "SUI",
        tokenB: "USDC",
      },
      {
        poolId: "0x2",
        name: "SUI/USDT",
        apr: 9.8,
        tvl: "$1.8M",
        fee: 0.3,
        tokenA: "SUI",
        tokenB: "USDT",
      },
      {
        poolId: "0x3",
        name: "USDC/USDT",
        apr: 3.2,
        tvl: "$5.2M",
        fee: 0.1,
        tokenA: "USDC",
        tokenB: "USDT",
      },
      {
        poolId: "0x4",
        name: "SUI/ETH",
        apr: 15.3,
        tvl: "$1.2M",
        fee: 0.5,
        tokenA: "SUI",
        tokenB: "ETH",
      },
    ]

    console.log("[v0] Returning mock pools:", mockPools)
    return NextResponse.json({ pools: mockPools, timestamp: new Date().toISOString() })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch pool APRs"
    console.error("[v0] Pool APR fetch error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
