"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, Wallet, FileText, Package, TrendingUp, Copy, ExternalLink, Clock } from "lucide-react"
import Link from "next/link"

type SearchResult = {
  type: "wallet" | "transaction" | "block" | "object"
  data: any
}

export function FullExplorerContent() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [activeTab, setActiveTab] = useState("search")
  const [recentBlocks, setRecentBlocks] = useState<any[]>([])
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/explorer/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (data.error) {
        toast({
          title: "Not Found",
          description: "No results found for your query",
          variant: "destructive",
        })
        return
      }

      setSearchResult(data)

      // Award Airpoints for explorer search (3 points)
      try {
        const walletAddress = data.data?.sender || data.data?.address
        if (walletAddress) {
          await fetch("/api/airpoints", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "add",
              walletAddress,
              amount: 3,
              type: "earn_directory",
              description: `Explored ${data.type}: ${searchQuery.slice(0, 12)}...`,
            }),
          })
        }
      } catch (airpointsError) {
        console.error("[v0] Error awarding Airpoints:", airpointsError)
      }

      toast({
        title: "Found",
        description: `Found ${data.type}: ${searchQuery.slice(0, 10)}... +3 Airpoints!`,
      })
    } catch (error) {
      console.error("[v0] Search error:", error)
      toast({
        title: "Search Error",
        description: "Failed to search blockchain data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadRecentBlocks = async () => {
    try {
      const response = await fetch("/api/explorer/blocks?limit=10")
      const data = await response.json()
      setRecentBlocks(data.blocks || [])
    } catch (error) {
      console.error("[v0] Error loading recent blocks:", error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Blockchain Explorer
          </CardTitle>
          <CardDescription>
            Search for wallets, transactions, blocks, or objects on Sui blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter address, transaction hash, or block number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Search Results */}
          {searchResult && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline">{searchResult.type}</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(searchResult.data))}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <pre className="text-xs overflow-auto max-h-96">
                {JSON.stringify(searchResult.data, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Explorer Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="blocks">Recent Blocks</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="validators">Validators</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Wallet className="h-6 w-6" />
                <span>View Wallet</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>View Transaction</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Package className="h-6 w-6" />
                <span>View Object</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <TrendingUp className="h-6 w-6" />
                <span>Network Stats</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Blocks</CardTitle>
              <CardDescription>Latest checkpoints on Sui blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={loadRecentBlocks} className="mb-4">
                Load Recent Blocks
              </Button>
              <div className="space-y-2">
                {recentBlocks.map((block, index) => (
                  <div key={index} className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                      <div className="font-mono text-sm">Block #{block.sequenceNumber || index}</div>
                      <div className="text-xs text-muted-foreground">
                        {block.timestampMs ? new Date(parseInt(block.timestampMs)).toLocaleString() : "N/A"}
                      </div>
                    </div>
                    <Badge variant="secondary">{block.transactions?.length || 0} txs</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest transactions on the network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Transaction feed coming soon. Use search to look up specific transactions.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validators" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Validator Set</CardTitle>
              <CardDescription>Active validators on Sui network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Link href="/hub" className="text-primary hover:underline">
                  View validators in Stake Hub →
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
