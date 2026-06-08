// Client-side wrapper for Blockvision API
// Calls server routes instead of external API directly

export interface NFTData {
  objectId: string
  name: string
  description?: string
  imageUrl?: string
  collection?: {
    name: string
    floorPrice?: number
  }
  attributes?: Array<{ trait_type: string; value: string }>
  holderCount?: number
  lastSalePrice?: number
}

export interface CoinBalance {
  coinType: string
  symbol: string
  balance: string
  decimals: number
  usdValue?: number
  priceChange24h?: number
}

export interface CollectionData {
  collectionId: string
  name: string
  description?: string
  floorPrice?: number
  totalVolume?: number
  holderCount: number
  itemCount: number
  verified: boolean
}

export interface TransactionData {
  digest: string
  sender: string
  timestamp: number
  status: string
  gasUsed: string
  effects: Array<{
    type: string
    description: string
  }>
  events?: Array<{
    type: string
    data: any
  }>
}

export interface CoinMarketData {
  coinType: string
  price: number
  priceChange24h: number
  volume24h: number
  marketCap: number
  holders: number
}

export interface ActivityData {
  type: string
  timestamp: number
  txHash: string
  description: string
}

export async function getAccountNFTs(accountAddress: string, network = "mainnet"): Promise<NFTData[]> {
  try {
    const response = await fetch("/api/blockvision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "account-nfts", address: accountAddress, network }),
    })

    if (!response.ok) throw new Error("Failed to fetch account NFTs")
    const data = await response.json()
    return data.nfts || []
  } catch (error) {
    console.error("[v0] Blockvision account NFTs error:", error)
    return []
  }
}

export async function getAccountCoins(accountAddress: string, network = "mainnet"): Promise<CoinBalance[]> {
  try {
    const response = await fetch("/api/blockvision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "account-coins", address: accountAddress, network }),
    })

    if (!response.ok) throw new Error("Failed to fetch account coins")
    const data = await response.json()
    return data.coins || []
  } catch (error) {
    console.error("[v0] Blockvision account coins error:", error)
    return []
  }
}

export async function getCollectionDetails(collectionId: string, network = "mainnet"): Promise<CollectionData | null> {
  try {
    const response = await fetch("/api/blockvision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "collection-details", address: collectionId, network }),
    })

    if (!response.ok) throw new Error("Failed to fetch collection details")
    return await response.json()
  } catch (error) {
    console.error("[v0] Blockvision collection details error:", error)
    return null
  }
}

export async function getTransactionDetails(txHash: string, network = "mainnet"): Promise<TransactionData | null> {
  try {
    const response = await fetch("/api/blockvision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "transaction-details", address: txHash, network }),
    })

    if (!response.ok) throw new Error("Failed to fetch transaction details")
    return await response.json()
  } catch (error) {
    console.error("[v0] Blockvision transaction details error:", error)
    return null
  }
}

export async function getCoinMarketData(coinType: string, network = "mainnet"): Promise<CoinMarketData | null> {
  try {
    const response = await fetch("/api/blockvision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "coin-market", address: coinType, network }),
    })

    if (!response.ok) throw new Error("Failed to fetch coin market data")
    return await response.json()
  } catch (error) {
    console.error("[v0] Blockvision coin market data error:", error)
    return null
  }
}

export const blockvisionAPI = {
  getAccountNFTs,
  getAccountCoins,
  getCollectionDetails,
  getTransactionDetails,
  getCoinMarketData,
}
