"use client"

import { useState, useEffect, useCallback } from "react"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Image as ImageIcon, Search, ShoppingCart, Tag, Loader2, ExternalLink, Grid3X3, LayoutGrid } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface NFTListing {
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

export function NFTMarketplaceContent() {
  const account = useCurrentAccount()
  const currentAccount = account?.address ?? null
  const [listings, setListings] = useState<NFTListing[]>([])
  const [ownedNFTs, setOwnedNFTs] = useState<NFTListing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingOwned, setIsLoadingOwned] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [selectedNFT, setSelectedNFT] = useState<NFTListing | null>(null)
  const [sellPrice, setSellPrice] = useState("")
  const [isTrading, setIsTrading] = useState(false)

  const fetchListings = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({ sortBy, limit: "24" })
      if (searchQuery) params.set("collection", searchQuery)
      if (minPrice) params.set("minPrice", minPrice)
      if (maxPrice) params.set("maxPrice", maxPrice)

      const response = await fetch(`/api/nft/listings?${params}`)
      const data = await response.json()
      if (data.listings) setListings(data.listings)
    } catch (error) {
      console.error("Error fetching NFT listings:", error)
      toast({ title: "Error", description: "Failed to load NFT listings", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }, [sortBy, searchQuery, minPrice, maxPrice])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  useEffect(() => {
    if (currentAccount) fetchOwnedNFTs()
  }, [currentAccount])

  const fetchOwnedNFTs = async () => {
    if (!currentAccount) return
    try {
      setIsLoadingOwned(true)
      const response = await fetch(`/api/nft/owned?wallet=${currentAccount}`)
      const data = await response.json()
      if (data.nfts) setOwnedNFTs(data.nfts)
    } catch (error) {
      console.error("Error fetching owned NFTs:", error)
    } finally {
      setIsLoadingOwned(false)
    }
  }

  const handleBuy = async (nft: NFTListing) => {
    if (!currentAccount) {
      toast({ title: "Connect Wallet", description: "Please connect your wallet to buy NFTs", variant: "destructive" })
      return
    }
    try {
      setIsTrading(true)
      const response = await fetch("/api/nft/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "buy",
          nftId: nft.objectId,
          price: nft.price,
          marketplace: nft.marketplace,
          walletAddress: currentAccount,
          collectionName: nft.collectionName,
        }),
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Purchase Prepared", description: `Sign the transaction in your wallet. +${data.airpointsAwarded} Airpoints!` })
      } else {
        toast({ title: "Error", description: data.error || "Failed to prepare purchase", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to process purchase", variant: "destructive" })
    } finally {
      setIsTrading(false)
    }
  }

  const handleList = async (nft: NFTListing) => {
    if (!sellPrice || parseFloat(sellPrice) <= 0) {
      toast({ title: "Error", description: "Please enter a valid price", variant: "destructive" })
      return
    }
    try {
      setIsTrading(true)
      const response = await fetch("/api/nft/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "list",
          nftId: nft.objectId,
          price: sellPrice,
          marketplace: "TradePort",
          walletAddress: currentAccount,
          collectionName: nft.collectionName,
        }),
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Listing Prepared", description: `Sign the transaction to list. +${data.airpointsAwarded} Airpoints!` })
        setSellPrice("")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to list NFT", variant: "destructive" })
    } finally {
      setIsTrading(false)
    }
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">NFT Marketplace</h1>
        <p className="text-muted-foreground">Browse, buy, and sell NFTs across Sui marketplaces</p>
      </div>

      <Tabs defaultValue="explore" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="explore">Explore</TabsTrigger>
          <TabsTrigger value="my-nfts">My NFTs</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="explore" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input placeholder="Min Price" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-32" />
            <Input placeholder="Max Price" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-32" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Listed</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="rarity">Rarity</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchListings} variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>

          {/* NFT Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : listings.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No NFTs found matching your criteria</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {listings.map((nft) => (
                <Card key={nft.id} className="overflow-hidden group cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                  <div className="aspect-square relative bg-muted">
                    <img
                      src={nft.imageUrl}
                      alt={nft.name}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/400x400/1a1a2e/00d4ff?text=${encodeURIComponent(nft.name.slice(0, 10))}` }}
                    />
                    <Badge className="absolute top-2 right-2 text-xs" variant="secondary">{nft.marketplace}</Badge>
                    {nft.rank && <Badge className="absolute top-2 left-2 text-xs bg-yellow-500/80">#{nft.rank}</Badge>}
                  </div>
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-sm truncate">{nft.name}</CardTitle>
                    <CardDescription className="text-xs truncate">{nft.collectionName}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold">{nft.price} <span className="text-xs text-muted-foreground">SUI</span></p>
                      </div>
                      <Button size="sm" onClick={() => handleBuy(nft)} disabled={isTrading} className="gap-1">
                        <ShoppingCart className="h-3 w-3" />
                        Buy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-nfts" className="space-y-6">
          {!currentAccount ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">Connect your wallet to view your NFTs</p>
              </CardContent>
            </Card>
          ) : isLoadingOwned ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : ownedNFTs.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No NFTs found in your wallet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {ownedNFTs.map((nft) => (
                <Card key={nft.id} className="overflow-hidden">
                  <div className="aspect-square relative bg-muted">
                    <img
                      src={nft.imageUrl}
                      alt={nft.name}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/400x400/1a1a2e/00d4ff?text=${encodeURIComponent(nft.name.slice(0, 10))}` }}
                    />
                    <Badge className="absolute top-2 right-2 text-xs" variant="outline">Owned</Badge>
                  </div>
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-sm truncate">{nft.name}</CardTitle>
                    <CardDescription className="text-xs truncate">{nft.collectionName}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 space-y-2">
                    <div className="flex gap-2">
                      <Input type="number" placeholder="Price in SUI" value={selectedNFT?.id === nft.id ? sellPrice : ""} onChange={(e) => { setSelectedNFT(nft); setSellPrice(e.target.value) }} className="text-xs h-8" />
                      <Button size="sm" variant="outline" onClick={() => { setSelectedNFT(nft); handleList(nft) }} disabled={isTrading} className="gap-1 h-8">
                        <Tag className="h-3 w-3" />
                        List
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent NFT transactions and marketplace activity</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground py-8">
              <Grid3X3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Transaction activity will appear here after trades are executed</p>
              <p className="text-xs mt-2">Earn 15 Airpoints per NFT trade</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
