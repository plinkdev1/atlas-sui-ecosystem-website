"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useProStatus } from "@/lib/pro-status-context"
import { useUnifiedWallet } from "@/lib/unified-wallet-context"
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit"
import { Loader2, TrendingUp, Zap } from "lucide-react"
import { useEffect, useState } from "react"

interface PoolData {
  poolId: string
  name: string
  apr: number
  tvl: string
  fee: number
  tokenA: string
  tokenB: string
}

export function StakeForm() {
  const wallet = useUnifiedWallet()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()
  const { toast } = useToast()
  const { status } = useProStatus()
  const [pools, setPools] = useState<PoolData[]>([])
  const [selectedPool, setSelectedPool] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [quoting, setQuoting] = useState(true)

  // Fetch pools and APRs
  useEffect(() => {
    const fetchPools = async () => {
      try {
        setQuoting(true)
        const response = await fetch("/api/cetus/pool-aprs", {
          method: "GET",
        })

        if (!response.ok) throw new Error("Failed to fetch pools")
        const data = await response.json()
        setPools(data.pools || [])
        console.log("[v0] Pools loaded:", data.pools)
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to load pool data"
        console.error("[v0] Pool fetch error:", error)
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        })
      } finally {
        setQuoting(false)
      }
    }

    fetchPools()
  }, [toast])

  const handleStake = async () => {
    if (!selectedPool || !amount || !wallet.connected) {
      toast({
        title: "Error",
        description: "Please select a pool and enter an amount",
        variant: "destructive",
      })
      return
    }

    const amountNum = Number(amount)
    if (amountNum <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Stake amount must be greater than 0",
        variant: "destructive",
      })
      return
    }

    // Check balance
    if (amountNum > 1000) {
      // Mock balance check, replace with real balance fetch
      toast({
        title: "Insufficient Balance",
        description: `You have insufficient SUI balance to stake ${amount} SUI`,
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      // Get stake transaction
      const response = await fetch("/api/cetus/stake-execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: wallet.address,
          poolId: selectedPool,
          amount,
        }),
      })

      if (!response.ok) throw new Error("Failed to prepare stake transaction")
      const { txBlock } = await response.json()

      // Sign and execute
      let txDigest = ""
      await new Promise<void>((resolve, reject) => {
        signAndExecute(
          { transaction: txBlock },
          {
            onSuccess: (result) => {
              txDigest = result.digest
              resolve()
            },
            onError: (err) => reject(err),
          }
        )
      })

      toast({
        title: "Success!",
        description: `Staked successfully. Digest: ${txDigest}`,
      })

      console.log("[v0] Stake executed:", txDigest)
      setAmount("")
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Transaction failed. Please try again."
      console.error("[v0] Stake error:", error)
      toast({
        title: "Stake Failed",
        description: message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Pools List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Available Pools</h3>
        {quoting ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-muted-foreground">Loading pools...</span>
          </div>
        ) : pools.length > 0 ? (
          <div className="grid gap-3">
            {pools.map((pool) => (
              <Card
                key={pool.poolId}
                className={`cursor-pointer transition-colors ${selectedPool === pool.poolId ? "border-blue-500 bg-blue-500/5" : "hover:border-blue-500/50"
                  }`}
                onClick={() => setSelectedPool(pool.poolId)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{pool.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {pool.tokenA} / {pool.tokenB} • Fee: {pool.fee}%
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 mb-2">
                        <Badge className="bg-green-600 hover:bg-green-700">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {status.isPro ? (pool.apr + 0.75).toFixed(2) : pool.apr.toFixed(2)}% APR
                        </Badge>
                        {status.isPro && (
                          <Badge className="bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white">
                            <Zap className="h-3 w-3 mr-1" />
                            Pro +0.75%
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">TVL: {pool.tvl}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground py-8 text-center">No pools available</p>
        )}
      </div>

      {/* Stake Amount Input */}
      {selectedPool && (
        <Card>
          <CardHeader>
            <CardTitle>Stake Amount</CardTitle>
            <CardDescription>Enter the amount of SUI to stake</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
            />
            <Button
              onClick={handleStake}
              disabled={loading || !amount}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              size="lg"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {loading ? "Processing..." : "Stake Now"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Atlas earns referral fees through Cetus partnerships — no cost to you
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
