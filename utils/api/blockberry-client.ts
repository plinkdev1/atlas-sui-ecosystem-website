// Client-side wrapper for Blockberry API
// Calls server routes instead of external API directly

export interface SecurityCheck {
  address: string
  isScam: boolean
  risk: "safe" | "low" | "medium" | "high" | "critical"
  securityMessage?: string
  confidence: number
  flags: string[]
}

export interface NFTMetadata {
  name: string
  description?: string
  image?: string
  attributes?: Array<{ trait_type: string; value: string }>
  collection?: {
    name: string
    creator: string
    verified: boolean
  }
  floorPrice?: string
}

export interface CoinMetadata {
  symbol: string
  name: string
  decimals: number
  totalSupply?: string
  description?: string
  iconUrl?: string
}

export async function checkNFTSecurity(nftAddress: string, network = "mainnet"): Promise<SecurityCheck> {
  try {
    const response = await fetch("/api/blockberry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "nft-security", address: nftAddress, network }),
    })

    if (!response.ok) throw new Error("Security check failed")
    return await response.json()
  } catch (error) {
    console.error("[v0] NFT security check error:", error)
    return {
      address: nftAddress,
      isScam: false,
      risk: "safe",
      confidence: 0,
      flags: [],
    }
  }
}

export async function checkCoinSecurity(
  coinType: string,
  network = "mainnet",
): Promise<{ securityLevel: string; message: string; confidence: number }> {
  try {
    const response = await fetch("/api/blockberry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "coin-security", address: coinType, network }),
    })

    if (!response.ok) throw new Error("Security check failed")
    const data = await response.json()

    return {
      securityLevel: data.risk === "safe" ? "safe" : data.risk === "critical" ? "danger" : "warning",
      message: data.securityMessage || `Risk level: ${data.risk}`,
      confidence: data.confidence,
    }
  } catch (error) {
    console.error("[v0] Coin security check error:", error)
    return {
      securityLevel: "safe",
      message: "Could not verify security",
      confidence: 0,
    }
  }
}

export async function checkTransactionSecurity(
  txHash: string,
  network = "mainnet",
): Promise<{ securityLevel?: string; message?: string }> {
  try {
    const response = await fetch("/api/blockberry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "tx-security", address: txHash, network }),
    })

    if (!response.ok) throw new Error("Security check failed")
    const data = await response.json()

    return {
      securityLevel: data.risk === "safe" ? "safe" : data.risk === "critical" ? "danger" : "warning",
      message: data.securityMessage || `Risk level: ${data.risk}`,
    }
  } catch (error) {
    console.error("[v0] Transaction security check error:", error)
    return {}
  }
}

export async function getNFTMetadata(nftAddress: string, network = "mainnet"): Promise<NFTMetadata | null> {
  try {
    const response = await fetch("/api/blockberry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "nft-metadata", address: nftAddress, network }),
    })

    if (!response.ok) throw new Error("Metadata fetch failed")
    return await response.json()
  } catch (error) {
    console.error("[v0] NFT metadata error:", error)
    return null
  }
}

export async function getCoinMetadata(coinType: string, network = "mainnet"): Promise<CoinMetadata | null> {
  try {
    const response = await fetch("/api/blockberry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "coin-metadata", address: coinType, network }),
    })

    if (!response.ok) throw new Error("Coin metadata fetch failed")
    return await response.json()
  } catch (error) {
    console.error("[v0] Coin metadata error:", error)
    return null
  }
}

export const blockberryAPI = {
  checkNFTSecurity,
  checkCoinSecurity,
  checkTransactionSecurity,
  getNFTMetadata,
  getCoinMetadata,
}
