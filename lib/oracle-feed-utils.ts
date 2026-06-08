import { getSuiClient } from "@/lib/sui-client";

// Pyth Network price feed IDs for Sui ecosystem tokens
export const PYTH_PRICE_FEED_IDS: Record<string, { id: string; name: string; symbol: string; decimals: number }> = {
  SUI: { id: "0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744", name: "Sui", symbol: "SUI", decimals: 9 },
  BTC: { id: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", name: "Bitcoin", symbol: "BTC", decimals: 8 },
  ETH: { id: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", name: "Ethereum", symbol: "ETH", decimals: 18 },
  SOL: { id: "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d", name: "Solana", symbol: "SOL", decimals: 9 },
  USDC: { id: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a", name: "USD Coin", symbol: "USDC", decimals: 6 },
  USDT: { id: "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b", name: "Tether", symbol: "USDT", decimals: 6 },
}

export const PYTH_HERMES_URL = "https://hermes.pyth.network"

export interface PriceFeed {
  symbol: string
  name: string
  price: number
  confidence: number
  publishTime: number
  change24h: number | null
  emaPrice: number
}

export interface PriceAlert {
  id: string
  wallet_address: string
  asset_symbol: string
  direction: "above" | "below"
  threshold_price: number
  is_active: boolean
  triggered_at: string | null
  created_at: string
}

// Fetch latest prices from Pyth Hermes API
export async function fetchPythPrices(symbols?: string[]): Promise<PriceFeed[]> {
  const feedIds = symbols
    ? symbols.filter((s) => PYTH_PRICE_FEED_IDS[s]).map((s) => PYTH_PRICE_FEED_IDS[s])
    : Object.values(PYTH_PRICE_FEED_IDS)

  const ids = feedIds.map((f) => f.id)
  const params = new URLSearchParams()
  ids.forEach((id) => params.append("ids[]", id))

  try {
    const response = await fetch(`${PYTH_HERMES_URL}/v2/updates/price/latest?${params.toString()}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 10 },
    })

    if (!response.ok) {
      console.warn("[v0] Pyth API returned non-OK status:", response.status)
      return getFallbackPrices(feedIds.map((f) => f.symbol))
    }

    const data = await response.json()
    const parsed = data.parsed || []

    return feedIds.map((feed, i) => {
      const priceData = parsed[i]
      if (!priceData) {
        return { symbol: feed.symbol, name: feed.name, price: 0, confidence: 0, publishTime: 0, change24h: null, emaPrice: 0 }
      }
      const priceObj = priceData.price
      const emaObj = priceData.ema_price
      const expo = Math.pow(10, priceObj.expo)
      const price = Number(priceObj.price) * expo
      const confidence = Number(priceObj.conf) * expo
      const emaPrice = Number(emaObj.price) * Math.pow(10, emaObj.expo)

      return {
        symbol: feed.symbol,
        name: feed.name,
        price,
        confidence,
        publishTime: priceData.price.publish_time,
        change24h: emaPrice > 0 ? ((price - emaPrice) / emaPrice) * 100 : null,
        emaPrice,
      }
    })
  } catch (error) {
    console.error("[v0] Error fetching Pyth prices:", error)
    return getFallbackPrices(feedIds.map((f) => f.symbol))
  }
}

// Fallback mock prices when API is unavailable
function getFallbackPrices(symbols: string[]): PriceFeed[] {
  const fallback: Record<string, { price: number; name: string }> = {
    SUI: { price: 1.82, name: "Sui" },
    BTC: { price: 97450, name: "Bitcoin" },
    ETH: { price: 2715, name: "Ethereum" },
    SOL: { price: 178.5, name: "Solana" },
    USDC: { price: 1.0, name: "USD Coin" },
    USDT: { price: 1.0, name: "Tether" },
  }
  return symbols.map((s) => ({
    symbol: s,
    name: fallback[s]?.name || s,
    price: fallback[s]?.price || 0,
    confidence: 0,
    publishTime: Date.now() / 1000,
    change24h: null,
    emaPrice: fallback[s]?.price || 0,
  }))
}

// Check alerts against current prices
export async function checkAlerts(alerts: PriceAlert[], prices: PriceFeed[]): Promise<PriceAlert[]> {
  const triggered: PriceAlert[] = []
  const priceMap = new Map(prices.map((p) => [p.symbol, p.price]))

  for (const alert of alerts) {
    if (!alert.is_active) continue
    const currentPrice = priceMap.get(alert.asset_symbol)
    if (!currentPrice) continue

    if (alert.direction === "above" && currentPrice >= alert.threshold_price) {
      triggered.push(alert)
    } else if (alert.direction === "below" && currentPrice <= alert.threshold_price) {
      triggered.push(alert)
    }
  }
  return triggered
}

// Fetch on-chain Pyth price from Sui (for verification)
export async function fetchOnChainPythPrice(feedId: string): Promise<number | null> {
  try {
    const client = getSuiClient("mainnet")
    const PYTH_STATE_ID = "0x1f9310238ee9298fb72c93c76c5dc3c048e0acc4e4d1e0ce05ea84dab4a8e735"
    const result = await client.getObject({ id: PYTH_STATE_ID, options: { showContent: true } })
    if (!result.data?.content) return null
    return null // On-chain verification requires Move call - placeholder for production
  } catch {
    return null
  }
}
