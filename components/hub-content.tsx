"use client"

import { useState, useEffect } from "react"
import { useUnifiedWallet } from "@/lib/unified-wallet-context"
import { useSuiClient } from "@mysten/dapp-kit"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Flame, Cog as Cow, Heart, Search, ArrowLeft, TrendingUp, Send, Zap, Settings } from "lucide-react"
import { blockberryAPI } from "@/utils/api/blockberry-client"
import { WatchlistTab } from "./watchlist-tab"
import { SwapForm } from "./swap-form"
import { StakeForm } from "./stake-form"
import { ProSettings } from "./pro-settings"
import { WalletConnectionModal } from "@/components/wallet-connection-modal"

const TABS = [
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "swap", label: "Swap", icon: Flame },
  { id: "stake", label: "Stake", icon: Cow },
  { id: "watchlist", label: "Watchlist", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
]

interface Balance {
  coinType: string
  totalBalance: string
  symbol: string
  balance: string
}

interface Transaction {
  digest: string
  timestamp: string
  type: string
  amount?: string
  status: "success" | "failed"
}

interface NFT {
  id: string
  name: string
  collection: string
  image: string
}

export function HubContent() {
  const router = useRouter()
  const wallet = useUnifiedWallet()
  const suiClient = useSuiClient()
  const [activeTab, setActiveTab] = useState("wallet")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [balances, setBalances] = useState<Balance[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [nfts, setNfts] = useState<NFT[]>([])
  const [securityScore, setSecurityScore] = useState<number | null>(null)

  const isConnected = wallet.connected && !!wallet.address

  // Fetch wallet data on connection
  useEffect(() => {
    if (isConnected && wallet.address) {
      fetchWalletData()
    }
  }, [isConnected, wallet.address])

  const fetchWalletData = async () => {
    if (!wallet.address) return

    setIsLoading(true)
    try {
      const allBalances = await suiClient.getAllBalances({
        owner: wallet.address,
      })

      const formattedBalances: Balance[] = allBalances.map((balance) => {
        const coinType = balance.coinType
        const symbolMatch = coinType.match(/::([^:]+)$/)
        const symbol = symbolMatch ? symbolMatch[1].toUpperCase() : "???"

        return {
          coinType,
          totalBalance: balance.totalBalance,
          symbol,
          balance: (Number.parseInt(balance.totalBalance) / 1_000_000_000).toFixed(2),
        }
      })

      setBalances(formattedBalances)

      const ownedObjects = await suiClient.getOwnedObjects({
        owner: wallet.address,
        options: {
          showType: true,
          showContent: true,
          showDisplay: true,
        },
      })

      const nftList: NFT[] = ownedObjects.data
        .filter((obj) => {
          const display = obj.data?.display?.data
          return display && (display.image_url || display.thumbnail_url)
        })
        .map((obj) => ({
          id: obj.data?.objectId || "",
          name: obj.data?.display?.data?.name || "Unknown NFT",
          collection: obj.data?.display?.data?.creator || "Unknown Collection",
          image: obj.data?.display?.data?.image_url || obj.data?.display?.data?.thumbnail_url || "/placeholder.svg",
        }))

      setNfts(nftList)

      // Wallet security check is not available in Blockberry API
      // Setting default security score
      setSecurityScore(null)

      const txns = await suiClient.queryTransactionBlocks({
        filter: { FromAddress: wallet.address },
        options: {
          showEffects: true,
          showInput: true,
        },
        limit: 5,
      })

      const formattedTxns: Transaction[] = txns.data.map((tx) => ({
        digest: tx.digest,
        timestamp: tx.timestampMs ? new Date(Number(tx.timestampMs)).toLocaleTimeString() : "Unknown",
        type: tx.transaction?.data?.transaction?.kind || "Transaction",
        status: tx.effects?.status?.status === "success" ? "success" : "failed",
      }))

      setTransactions(formattedTxns)
    } catch (error) {
      console.error("[v0] Error fetching wallet data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "wallet":
        return (
          <div className="space-y-6">
            {/* Security Badge */}
            {securityScore !== null && (
              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-500" />
                      Security Score
                    </span>
                    <Badge className="bg-blue-500/20 text-blue-600 text-lg px-3 py-1">{securityScore}/100</Badge>
                  </CardTitle>
                </CardHeader>
              </Card>
            )}

            {/* Balances */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Balances
                </CardTitle>
                <CardDescription>Your token holdings</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-muted-foreground">Loading balances...</p>
                ) : balances.length > 0 ? (
                  <div className="space-y-3">
                    {balances.map((balance) => (
                      <div
                        key={balance.coinType}
                        className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border/50 hover:border-blue-500/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-foreground">{balance.symbol}</p>
                          <p className="text-sm text-muted-foreground font-mono truncate">{balance.coinType}</p>
                        </div>
                        <p className="text-lg font-bold text-blue-600">{balance.balance}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No tokens found</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-blue-500" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>Your last 5 transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-2">
                    {transactions.map((tx) => (
                      <div
                        key={tx.digest}
                        className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border/50 hover:border-blue-500/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-mono truncate text-muted-foreground">{tx.digest}</p>
                          <p className="text-xs text-muted-foreground">{tx.timestamp}</p>
                        </div>
                        <Badge
                          variant={tx.status === "success" ? "default" : "destructive"}
                          className="ml-2 flex-shrink-0"
                        >
                          {tx.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No transactions found</p>
                )}
              </CardContent>
            </Card>

            {/* NFTs */}
            <Card>
              <CardHeader>
                <CardTitle>NFTs ({nfts.length})</CardTitle>
                <CardDescription>Your NFT collection</CardDescription>
              </CardHeader>
              <CardContent>
                {nfts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {nfts.map((nft) => (
                      <div key={nft.id} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg border border-border/50 bg-secondary hover:border-blue-500/50 transition-all hover:shadow-lg">
                          <img
                            src={nft.image || "/placeholder.svg"}
                            alt={nft.name}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                            <div className="p-2 w-full">
                              <p className="text-xs text-white font-semibold truncate">{nft.name}</p>
                              <p className="text-xs text-white/70 truncate">{nft.collection}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No NFTs found</p>
                )}
              </CardContent>
            </Card>

            {/* Scan & Clean Button */}
            <Button
              onClick={() => router.push("/wallet-cleanup")}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 gap-2"
            >
              <Zap className="h-5 w-5" />
              Scan & Clean Wallet
            </Button>
          </div>
        )
      case "swap":
        return (
          <div className="space-y-6">
            <SwapForm />
          </div>
        )
      case "stake":
        return (
          <div className="space-y-6">
            <StakeForm />
          </div>
        )
      case "watchlist":
        return <WatchlistTab address={wallet.address} isConnected={isConnected} />
      case "settings":
        return <ProSettings />
      default:
        return null
    }
  }

  if (!isConnected) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Atlas Hub</h1>
            <p className="text-muted-foreground mb-8 text-lg">Connect wallet to unlock additional features</p>
            <Button onClick={() => setShowWalletModal(true)} variant="default" className="w-full">
              Connect Wallet
            </Button>
          </div>
        </div>
        <WalletConnectionModal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="w-full px-3 md:px-6 py-8 md:py-12 max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">My Hub</h1>
          <p className="text-muted-foreground">Manage your wallet, assets, and watchlist</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by Coin, Account, NFT, Package, Object, Transaction..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div>{renderTabContent()}</div>
      </main>
    </div>
  )
}
