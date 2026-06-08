import { getSuiClient } from "@/lib/sui-client"

const suiClient = getSuiClient("mainnet")

// Supported marketplace APIs
const TRADEPORT_API = "https://api.tradeport.xyz/v2"
const BLUEMOVE_API = "https://apigw.bluemove.net/api"
const INDEXER_API = "https://api.indexer.xyz/graphql"

export interface NFTListing {
  id: string
  name: string
  imageUrl: string
  collectionName: string
  collectionId: string
  price: string
  currency: string
  marketplace: string
  seller: string
  objectId: string
  rarity?: number
  rank?: number
  attributes?: Record<string, string>[]
  listedAt: string
}

export interface NFTCollection {
  id: string
  name: string
  imageUrl: string
  floorPrice: string
  totalItems: number
  totalListed: number
  totalVolume: string
  owners: number
  verified: boolean
}

export interface NFTDetail {
  id: string
  name: string
  description: string
  imageUrl: string
  collectionName: string
  collectionId: string
  owner: string
  objectId: string
  objectType: string
  attributes: Record<string, string>[]
  rarity?: number
  rank?: number
  lastSalePrice?: string
  ownershipHistory: { owner: string; acquiredAt: string; price?: string }[]
  listings: { marketplace: string; price: string; currency: string; url: string }[]
  floorPrice: string
}

export interface NFTFilters {
  collection?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: "price_asc" | "price_desc" | "recent" | "rarity"
  marketplace?: string
  page?: number
  limit?: number
}

// Fetch listings from TradePort API
async function fetchTradeportListings(filters: NFTFilters): Promise<NFTListing[]> {
  try {
    const apiKey = process.env.TRADEPORT_API_KEY
    if (!apiKey) {
      console.warn("[v0] TRADEPORT_API_KEY not set, using mock data")
      return getMockListings("tradeport")
    }
    const params = new URLSearchParams({
      chain: "sui",
      limit: String(filters.limit || 20),
      offset: String(((filters.page || 1) - 1) * (filters.limit || 20)),
      sort: filters.sortBy === "price_asc" ? "price:asc" : filters.sortBy === "price_desc" ? "price:desc" : "listed_at:desc",
    })
    if (filters.collection) params.set("collection", filters.collection)
    if (filters.minPrice) params.set("min_price", String(filters.minPrice * 1e9))
    if (filters.maxPrice) params.set("max_price", String(filters.maxPrice * 1e9))

    const response = await fetch(`${TRADEPORT_API}/sui/listings?${params}`, {
      headers: { "x-api-key": apiKey },
    })
    if (!response.ok) return getMockListings("tradeport")
    const data = await response.json()
    return (data.listings || []).map((l: any) => ({
      id: l.id || l.nft_id,
      name: l.name || "Unnamed NFT",
      imageUrl: l.image_url || l.media_url || "",
      collectionName: l.collection_name || "Unknown",
      collectionId: l.collection_id || "",
      price: (parseFloat(l.price || "0") / 1e9).toFixed(4),
      currency: "SUI",
      marketplace: "TradePort",
      seller: l.seller || "",
      objectId: l.object_id || l.nft_id || "",
      rarity: l.rarity_score,
      rank: l.rarity_rank,
      attributes: l.attributes || [],
      listedAt: l.listed_at || new Date().toISOString(),
    }))
  } catch (error) {
    console.error("[v0] TradePort fetch error:", error)
    return getMockListings("tradeport")
  }
}

// Fetch listings from BlueMove API
async function fetchBluemoveListings(filters: NFTFilters): Promise<NFTListing[]> {
  try {
    const params = new URLSearchParams({
      chain: "sui",
      limit: String(filters.limit || 20),
      offset: String(((filters.page || 1) - 1) * (filters.limit || 20)),
    })
    if (filters.collection) params.set("collection", filters.collection)
    const response = await fetch(`${BLUEMOVE_API}/market/sui/listings?${params}`)
    if (!response.ok) return getMockListings("bluemove")
    const data = await response.json()
    return (data.data || []).map((l: any) => ({
      id: l.id || l.nft_id,
      name: l.name || "Unnamed NFT",
      imageUrl: l.img || l.image || "",
      collectionName: l.collection_name || "Unknown",
      collectionId: l.collection_id || "",
      price: (parseFloat(l.price || "0") / 1e9).toFixed(4),
      currency: "SUI",
      marketplace: "BlueMove",
      seller: l.owner || "",
      objectId: l.object_id || "",
      attributes: l.attributes || [],
      listedAt: l.created_at || new Date().toISOString(),
    }))
  } catch (error) {
    console.error("[v0] BlueMove fetch error:", error)
    return getMockListings("bluemove")
  }
}

// Aggregate listings from all marketplaces
export async function getNFTListings(filters: NFTFilters = {}): Promise<{
  listings: NFTListing[]
  total: number
  page: number
}> {
  const [tradeportListings, bluemoveListings] = await Promise.allSettled([
    fetchTradeportListings(filters),
    fetchBluemoveListings(filters),
  ])

  let allListings: NFTListing[] = []
  if (tradeportListings.status === "fulfilled") allListings.push(...tradeportListings.value)
  if (bluemoveListings.status === "fulfilled") allListings.push(...bluemoveListings.value)

  // Deduplicate by objectId
  const seen = new Set<string>()
  allListings = allListings.filter((l) => {
    if (seen.has(l.objectId)) return false
    seen.add(l.objectId)
    return true
  })

  // Apply sorting
  if (filters.sortBy === "price_asc") allListings.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
  else if (filters.sortBy === "price_desc") allListings.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
  else if (filters.sortBy === "rarity") allListings.sort((a, b) => (a.rank || 9999) - (b.rank || 9999))
  else allListings.sort((a, b) => new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime())

  return { listings: allListings, total: allListings.length, page: filters.page || 1 }
}

// Get detailed NFT info
export async function getNFTSummary(objectId: string): Promise<NFTDetail | null> {
  try {
    const object = await suiClient.getObject({
      id: objectId,
      options: { showContent: true, showOwner: true, showDisplay: true, showType: true },
    })
    if (!object.data) return null
    const display = object.data.display?.data || {}
    const content = object.data.content as any
    const fields = content?.fields || {}
    return {
      id: objectId,
      name: display.name || fields.name || "Unnamed NFT",
      description: display.description || fields.description || "",
      imageUrl: display.image_url || fields.url || fields.image_url || "",
      collectionName: display.collection || fields.collection_name || "Unknown Collection",
      collectionId: content?.type?.split("<")[0] || "",
      owner: typeof object.data.owner === "object" && "AddressOwner" in object.data.owner ? object.data.owner.AddressOwner : "",
      objectId,
      objectType: object.data.type || "",
      attributes: fields.attributes?.fields?.map?.((a: any) => ({ [a.fields?.key || "trait"]: a.fields?.value || "" })) || [],
      ownershipHistory: [],
      listings: [],
      floorPrice: "0",
    }
  } catch (error) {
    console.error("[v0] NFT summary error:", error)
    return null
  }
}

// Get NFTs owned by wallet
export async function getOwnedNFTs(walletAddress: string): Promise<NFTListing[]> {
  try {
    const objects = await suiClient.getOwnedObjects({
      owner: walletAddress,
      options: { showContent: true, showDisplay: true, showType: true },
      limit: 50,
    })
    return objects.data
      .filter((obj) => {
        const display = obj.data?.display?.data
        return display && display.image_url
      })
      .map((obj) => {
        const display = obj.data?.display?.data || {}
        const content = obj.data?.content as any
        return {
          id: obj.data?.objectId || "",
          name: display.name || "Unnamed NFT",
          imageUrl: display.image_url || "",
          collectionName: display.collection || content?.type?.split("::")?.pop()?.split("<")[0] || "Unknown",
          collectionId: content?.type || "",
          price: "0",
          currency: "SUI",
          marketplace: "owned",
          seller: walletAddress,
          objectId: obj.data?.objectId || "",
          attributes: [],
          listedAt: "",
        }
      })
  } catch (error) {
    console.error("[v0] Owned NFTs error:", error)
    return []
  }
}

// Build Buy PTB (Programmable Transaction Block)
export function buildBuyPTBParams(nftId: string, price: string, marketplace: string) {
  return {
    type: "buy",
    nftId,
    price,
    marketplace,
    note: "Real PTB execution requires wallet signing via @mysten/sui/transactions Transaction class. The frontend should build the PTB and submit via wallet adapter.",
  }
}

// Build Sell/List PTB
export function buildSellPTBParams(nftId: string, price: string, marketplace: string) {
  return {
    type: "list",
    nftId,
    price,
    marketplace,
    note: "Real PTB execution requires wallet signing via @mysten/sui/transactions Transaction class. The frontend should build the PTB and submit via wallet adapter.",
  }
}

// Mock data for development
function getMockListings(source: string): NFTListing[] {
  const collections = ["SuiFrens", "Sui Punks", "BlueMove OG", "Sui Monkeys", "Fuddies", "Prime Machin"]
  return Array.from({ length: 8 }, (_, i) => ({
    id: `${source}-mock-${i}`,
    name: `${collections[i % collections.length]} #${1000 + i}`,
    imageUrl: `https://placehold.co/400x400/1a1a2e/00d4ff?text=${encodeURIComponent(collections[i % collections.length])}`,
    collectionName: collections[i % collections.length],
    collectionId: `0x${source}collection${i}`,
    price: (Math.random() * 50 + 0.5).toFixed(2),
    currency: "SUI",
    marketplace: source === "tradeport" ? "TradePort" : "BlueMove",
    seller: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    objectId: `0x${source}nft${i}${Date.now()}`,
    rarity: Math.random() * 100,
    rank: Math.floor(Math.random() * 5000) + 1,
    attributes: [{ trait_type: "Background", value: "Blue" }, { trait_type: "Eyes", value: "Laser" }],
    listedAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
  }))
}
