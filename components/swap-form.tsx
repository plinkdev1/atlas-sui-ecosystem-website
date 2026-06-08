"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useUnifiedWallet } from "@/lib/unified-wallet-context"
import { useSuiClient } from "@mysten/dapp-kit"
import { ArrowDownUp } from "lucide-react"
import { useState } from "react"

interface SwapQuote {
  outputAmount: string
  priceImpact: string
  minimumReceived: string
  fee: string
}

const DEFAULT_TOKENS = [
  { symbol: "SUI", type: "0x2::sui::SUI" },
  { symbol: "USDC", type: "0x5d4b302506645c37ff133b98c4b50864d9d0560f" },
  { symbol: "USDT", type: "0xc060006111016b8a020ad5b33834984a437aaa7d" },
  { symbol: "ETH", type: "0xaf8cd5edc19c4512f4259f0bee101a40d41eb59f" },
]

export function SwapForm() {
  const wallet = useUnifiedWallet()
  const suiClient = useSuiClient()
  const { toast } = useToast()

  const [fromToken, setFromToken] = useState(DEFAULT_TOKENS[0])
  const [toToken, setToToken] = useState(DEFAULT_TOKENS[1])
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [slippage, setSlippage] = useState("1")
  const [isLoading, setIsLoading] = useState(false)
  const [quote, setQuote] = useState<SwapQuote | null>(null)
  const [useCetusTerminal, setUseCetusTerminal] = useState(false)
  const [balance, setBalance] = useState<string>("0")

  const handleSwapTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount("")
    setToAmount("")
    setQuote(null)
  }

  const fetchBalance = async () => {
    if (!wallet.address) return
    try {
      const allBalances = await suiClient.getAllBalances({
        owner: wallet.address,
      })
      const fromBalance = allBalances.find((b) => b.coinType === fromToken.type)
      setBalance(fromBalance ? (Number(fromBalance.totalBalance) / 1_000_000_000).toFixed(2) : "0")
    } catch (error) {
      console.error("[v0] Balance fetch error:", error)
    }
  }

  const fetchQuote = async () => {
    if (!fromAmount || !wallet.address) {
      toast({
        title: "Missing Information",
        description: "Please enter an amount to swap",
        variant: "destructive",
      })
      return
    }

    const amountNum = Number(fromAmount)
    const balanceNum = Number(balance)
    if (amountNum > balanceNum) {
      toast({
        title: "Insufficient Balance",
        description: `You have ${balance} ${fromToken.symbol} but trying to swap ${fromAmount}`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/cetus/swap-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coinTypeA: fromToken.type,
          coinTypeB: toToken.type,
          amount: (Number(fromAmount) * 1_000_000_000).toString(),
          byAmountIn: true,
          slippage: Number(slippage),
        }),
      })

      if (!response.ok) throw new Error("Failed to fetch quote")

      const quoteData = await response.json()
      setQuote(quoteData)
      setToAmount((Number(quoteData.outputAmount) / 1_000_000_000).toFixed(6))

      console.log("[v0] Swap quote received:", quoteData)
    } catch (error) {
      console.error("[v0] Quote fetch error:", error)
      toast({
        title: "Quote Failed",
        description: "Could not fetch swap quote. Try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwap = async () => {
    if (!wallet.address || !quote) {
      toast({
        title: "Missing Information",
        description: "Please fetch a quote first",
        variant: "destructive",
      })
      return
    }

    const priceImpactNum = Number.parseFloat(quote.priceImpact)
    if (priceImpactNum > Number(slippage)) {
      toast({
        title: "Slippage Exceeded",
        description: `Price impact (${quote.priceImpact}) exceeds your tolerance (${slippage}%)`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/cetus/swap-execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: wallet.address,
          coinTypeA: fromToken.type,
          coinTypeB: toToken.type,
          amount: (Number(fromAmount) * 1_000_000_000).toString(),
          slippage: Number(slippage),
        }),
      })

      if (!response.ok) throw new Error("Swap execution failed")

      const result = await response.json()

      toast({
        title: "Swap Successful!",
        description: `Swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`,
      })

      setFromAmount("")
      setToAmount("")
      setQuote(null)

      console.log("[v0] Swap executed:", result)
    } catch (error) {
      console.error("[v0] Swap error:", error)
      toast({
        title: "Swap Failed",
        description: "Transaction failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (useCetusTerminal) {
    return (
      <Card className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cetus Terminal</CardTitle>
              <CardDescription>Professional swap interface powered by Cetus</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setUseCetusTerminal(false)} className="text-xs">
              Use Simple Form
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div id="cetus-terminal-container" className="min-h-96 rounded-lg border border-border bg-secondary/50" />
          <p className="text-xs text-muted-foreground mt-4">
            Cetus Terminal provides multi-hop routing, advanced analytics, and real-time liquidity pool data.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Swap Tokens</CardTitle>
            <CardDescription>Exchange your assets instantly with best rates</CardDescription>
          </div>
          <Button variant="outline" onClick={() => setUseCetusTerminal(true)} size="sm" className="text-xs">
            Use Cetus Terminal
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* From Token */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">From</label>
          <div className="space-y-2">
            <select
              value={fromToken.type}
              onChange={(e) => {
                setFromToken(DEFAULT_TOKENS.find((t) => t.type === e.target.value) || fromToken)
                fetchBalance()
              }}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
            >
              {DEFAULT_TOKENS.map((token) => (
                <option key={token.type} value={token.type}>
                  {token.symbol}
                </option>
              ))}
            </select>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">Balance: {balance}</span>
            </div>
            <Input
              type="number"
              placeholder="0.00"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="text-lg font-semibold"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwapTokens}
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white h-10 w-10"
          >
            <ArrowDownUp className="h-5 w-5" />
          </Button>
        </div>

        {/* To Token */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">To</label>
          <div className="space-y-2">
            <select
              value={toToken.type}
              onChange={(e) => setToToken(DEFAULT_TOKENS.find((t) => t.type === e.target.value) || toToken)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
            >
              {DEFAULT_TOKENS.map((token) => (
                <option key={token.type} value={token.type}>
                  {token.symbol}
                </option>
              ))}
            </select>
            <Input type="number" placeholder="0.00" value={toAmount} disabled className="text-lg font-semibold" />
          </div>
        </div>

        {/* Slippage */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Slippage Tolerance (%)</label>
          <Input
            type="number"
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
            min="0.1"
            max="50"
            step="0.1"
            className="text-sm"
          />
        </div>

        {/* Quote Info */}
        {quote && (
          <div className="space-y-2 p-3 bg-secondary rounded-lg border border-border/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price Impact</span>
              <span className="font-medium text-foreground">{quote.priceImpact}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Minimum Received</span>
              <span className="font-medium text-foreground">
                {(Number(quote.minimumReceived) / 1_000_000_000).toFixed(6)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fee</span>
              <span className="font-medium text-foreground">{(Number(quote.fee) / 1_000_000_000).toFixed(6)}</span>
            </div>
          </div>
        )}

        {/* Commission Note */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">💡 Atlas earns referral fee — no cost to you</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={fetchQuote}
            disabled={isLoading || !fromAmount}
            variant="outline"
            className="flex-1 bg-transparent"
          >
            Get Quote
          </Button>
          <Button
            onClick={handleSwap}
            disabled={isLoading || !quote}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            {isLoading ? "Processing..." : "Swap"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
