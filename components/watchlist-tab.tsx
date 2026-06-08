"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Plus, Trash2, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSupabaseUser } from "@/hooks/use-supabase-user"
import { createClient } from "@/lib/supabase/client"

interface WatchlistItem {
  id: string
  asset_id: string
  asset_type: string
  name: string
  symbol: string
  price?: number
  change24h?: number
  image?: string
}

export function WatchlistTab({ address, isConnected }: { address?: string; isConnected: boolean }) {
  const router = useRouter()
  const { user } = useSupabaseUser()
  const supabase = createClient()
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [newAsset, setNewAsset] = useState("")

  useEffect(() => {
    if (user?.id) {
      fetchWatchlist()
    }
  }, [user?.id])

  const fetchWatchlist = async () => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("user_watchlist")
        .select("*")
        .eq("user_id", user.id)
        .order("added_at", { ascending: false })

      if (error) throw error

      const items: WatchlistItem[] = (data || []).map((item) => ({
        id: item.id,
        asset_id: item.asset_id,
        asset_type: item.asset_type,
        name: item.asset_id.toUpperCase(),
        symbol: item.asset_id.toUpperCase(),
      }))

      // Fetch prices for all items
      if (items.length > 0) {
        const prices = await fetchPricesFromAPI(items.map((item) => item.asset_id))
        const itemsWithPrices = items.map((item) => ({
          ...item,
          ...prices[item.asset_id],
        }))
        setWatchlist(itemsWithPrices)
      } else {
        setWatchlist([])
      }
    } catch (error) {
      console.error("[v0] Error fetching watchlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPricesFromAPI = async (assetIds: string[]) => {
    try {
      const response = await fetch("/api/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetIds }),
      })
      const data = await response.json()
      return data.prices || {}
    } catch (error) {
      console.error("[v0] Error fetching prices:", error)
      return {}
    }
  }

  const addToWatchlist = async () => {
    if (!user?.id || !newAsset) return

    try {
      const { error } = await supabase.from("user_watchlist").insert({
        user_id: user.id,
        asset_id: newAsset.toLowerCase(),
        asset_type: "token",
      })

      if (error) throw error

      setNewAsset("")
      await fetchWatchlist()
    } catch (error) {
      console.error("[v0] Error adding to watchlist:", error)
    }
  }

  const removeFromWatchlist = async (assetId: string) => {
    if (!user?.id) return

    try {
      const { error } = await supabase
        .from("user_watchlist")
        .delete()
        .eq("user_id", user.id)
        .eq("asset_id", assetId)

      if (error) throw error

      await fetchWatchlist()
    } catch (error) {
      console.error("[v0] Error removing from watchlist:", error)
    }
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Connect wallet to access your watchlist</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-blue-500" />
            Add Asset to Watchlist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter token or NFT name..."
              value={newAsset}
              onChange={(e) => setNewAsset(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addToWatchlist()}
              className="h-10"
            />
            <Button onClick={addToWatchlist} className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-blue-500" />
            Your Watchlist ({watchlist.length})
          </CardTitle>
          <CardDescription>Track your favorite coins and NFTs</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading watchlist...</p>
          ) : watchlist.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-3 font-medium text-muted-foreground">Asset</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Price</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">24h Change</th>
                    <th className="text-center p-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {watchlist.map((item) => (
                    <tr key={item.asset_id} className="hover:bg-secondary/50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {item.image && (
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.symbol}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <div>
                            <p className="font-medium text-foreground">{item.symbol}</p>
                            <p className="text-xs text-muted-foreground">{item.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-right font-medium text-blue-600">${item.price?.toFixed(2) || "N/A"}</td>
                      <td className="p-3 text-right">
                        <Badge
                          variant={item.change24h && item.change24h >= 0 ? "default" : "destructive"}
                          className="bg-opacity-20"
                        >
                          {item.change24h?.toFixed(2) || "N/A"}%
                        </Badge>
                      </td>
                      <td className="p-3 text-center flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push("/transaction-explainer")}
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromWatchlist(item.asset_id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No items in watchlist yet. Add one to get started!</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
