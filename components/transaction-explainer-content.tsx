"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useNetwork } from "@/lib/network-context"
import { blockberryAPI } from "@/utils/api/blockberry-client"
import { useSuiClient } from "@mysten/dapp-kit"
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Copy,
  FileSearch,
  Info,
  Search,
  Sparkles,
  XCircle,
  Zap,
} from "lucide-react"
import { useState } from "react"

interface BalanceChange {
  amount?: string | number
  coinType?: string
  owner?: { AddressOwner?: string } | { ObjectOwner?: string } | { Shared?: { initial_shared_version: number; mutable: boolean } } | unknown
}

interface ObjectChange {
  type: string
  objectId?: string
  version?: string
  digest?: string
}

interface GasUsed {
  computationCost?: string
  storageCost?: string
  storageRebate?: string
}

interface TransactionEffects {
  gasUsed?: GasUsed
}

interface TransactionData {
  balanceChanges?: BalanceChange[] | null
  objectChanges?: ObjectChange[] | null
  events?: unknown[] | null
  effects?: TransactionEffects
  transaction?: any
  status?: {
    status?: string
  }
  timestampMs?: string | number
  digest?: string
  aiExplanation?: string
}

export function TransactionExplainerContent() {
  const { network, getChainGroup } = useNetwork()
  const { toast } = useToast()
  const suiClient = useSuiClient()
  const [txHash, setTxHash] = useState("")
  const [isSearched, setIsSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [txData, setTxData] = useState<TransactionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showRawJson, setShowRawJson] = useState(false)

  const isSupported = getChainGroup() === "Sui"

  const extractDigest = (input: string): string | null => {
    const trimmed = input.trim()

    // Check if it's a URL and extract digest
    if (trimmed.includes("suiscan.xyz") || trimmed.includes("suivision.xyz")) {
      const match = trimmed.match(/\/tx\/([a-zA-Z0-9=+/]+)/)
      return match ? match[1] : null
    }

    // Sui digests can be:
    // 1. Hex format: 0x followed by 64 hex characters (32 bytes)
    // 2. Base64 format: 43-44 characters (alphanumeric, +, /, =)

    // Check for hex format first
    if (trimmed.match(/^0x[a-fA-F0-9]{64}$/i)) {
      return trimmed
    }

    // Check for Base64 format (Sui standard digest format)
    // Base64 digests are typically 43-44 characters
    if (trimmed.match(/^[A-Za-z0-9+/]{43,44}={0,2}$/)) {
      return trimmed
    }

    // Also accept Base64 without padding
    if (trimmed.match(/^[A-Za-z0-9_-]{43,44}$/)) {
      return trimmed
    }

    return null
  }

  const handleSearch = async () => {
    const digest = extractDigest(txHash)

    if (!digest) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid transaction hash or explorer URL",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setIsSearched(true)
    setError(null)

    try {
      // Fetch transaction with all detailed information
      const transaction = await suiClient.getTransactionBlock({
        digest,
        options: {
          showInput: true,
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
          showBalanceChanges: true,
        },
      })

      setTxData(transaction)

      // Award Airpoints for exploring transaction (5 points)
      try {
        const walletAddress = transaction.transaction?.data?.sender
        if (walletAddress) {
          await fetch("/api/airpoints", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "add",
              walletAddress,
              amount: 5,
              type: "earn_explainer",
              description: `Explored transaction ${digest.slice(0, 8)}...`,
            }),
          })
          console.log("[v0] Airpoints awarded for transaction exploration")
        }
      } catch (error) {
        console.error("[v0] Error awarding Airpoints:", error)
      }

      // Check for security risks with Blockberry if available
      try {
        const security = await blockberryAPI.checkTransactionSecurity(digest)
        if (security?.securityLevel === "danger") {
          toast({
            title: "Security Warning",
            description: security.message || "This transaction involves suspicious addresses or contracts",
            variant: "destructive",
          })
        }
      } catch (err) {
        // Security check unavailable, continue with normal flow
      }

      toast({
        title: "Transaction Found",
        description: "Transaction details loaded successfully. +5 Airpoints!",
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch transaction. Please check the digest and try again."
      setError(message)
      toast({
        title: "Transaction Not Found",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateSummary = (tx: TransactionData): string[] => {
    const summaries: string[] = []

    // Check for transfers
    if (tx.balanceChanges && tx.balanceChanges.length > 0) {
      const transfers = tx.balanceChanges.filter((change: BalanceChange) => change.amount)
      for (const transfer of transfers) {
        const amount = Math.abs(Number(transfer.amount) / 1e9).toFixed(2)
        const coin = transfer.coinType?.split("::").pop() || "Token"
        // Extract address from owner object - handle different owner types
        let address = "unknown"
        if (transfer.owner && typeof transfer.owner === "object") {
          const ownerObj = transfer.owner as Record<string, string>
          address = (ownerObj.AddressOwner || ownerObj.ObjectOwner || "unknown").slice(0, 10) + "..."
        }
        const action = Number(transfer.amount) < 0 ? "sent" : "received"
        summaries.push(`${action.charAt(0).toUpperCase() + action.slice(1)} ${amount} ${coin} to/from ${address}`)
      }
    }

    // Check for object changes
    if (tx.objectChanges && tx.objectChanges.length > 0) {
      const created = tx.objectChanges.filter((c: ObjectChange) => c.type === "Created").length
      const modified = tx.objectChanges.filter((c: ObjectChange) => c.type === "Mutated").length
      const deleted = tx.objectChanges.filter((c: ObjectChange) => c.type === "Deleted").length

      if (created > 0) summaries.push(`Created ${created} new object${created > 1 ? "s" : ""}`)
      if (modified > 0) summaries.push(`Modified ${modified} object${modified > 1 ? "s" : ""}`)
      if (deleted > 0) summaries.push(`Deleted ${deleted} object${deleted > 1 ? "s" : ""}`)
    }

    // Check for events
    if (tx.events && tx.events.length > 0) {
      summaries.push(`Emitted ${tx.events.length} event${tx.events.length > 1 ? "s" : ""}`)
    }

    // Gas information
    if (tx.effects?.gasUsed) {
      const totalGas = (Number(tx.effects.gasUsed.computationCost) + Number(tx.effects.gasUsed.storageCost)) / 1e9
      summaries.push(`Paid ${totalGas.toFixed(6)} SUI in gas fees`)
    }

    return summaries.length > 0 ? summaries : ["Transaction completed"]
  }

  const getTransferFlow = (tx: TransactionData): { from: string; to: string; amount: string } | null => {
    if (tx.transaction?.data?.transaction?.kind === "ProgrammableTransaction" && tx.balanceChanges) {
      const outflow = tx.balanceChanges.find((c: BalanceChange) => Number(c.amount) < 0)
      const inflow = tx.balanceChanges.find((c: BalanceChange) => Number(c.amount) > 0)

      if (outflow && inflow) {
        const amount = (Math.abs(Number(outflow.amount)) / 1e9).toFixed(2)
        // Extract addresses from owner objects with proper type casting
        const outflowOwner = outflow.owner as Record<string, string> | undefined
        const inflowOwner = inflow.owner as Record<string, string> | undefined
        const fromAddress = (outflowOwner?.AddressOwner || outflowOwner?.ObjectOwner || "Contract").slice(0, 8) + "..."
        const toAddress = (inflowOwner?.AddressOwner || inflowOwner?.ObjectOwner || "Contract").slice(0, 8) + "..."

        return {
          from: fromAddress,
          to: toAddress,
          amount: `${amount} SUI`,
        }
      }
    }
    return null
  }

  const handleExplainAnother = () => {
    setTxHash("")
    setTxData(null)
    setError(null)
    setIsSearched(false)
    setShowRawJson(false)
  }

  // Mock transaction data
  const mockTransaction = {
    hash: "0xA1B2C3D4E5F6789012345678901234567890123456789012345678901234567890",
    status: "success",
    timestamp: "2 minutes ago",
    type: "Token Transfer",
    from: "0x1234...5678",
    to: "0x9876...4321",
    amount: "100 SUI",
    fee: "0.001 SUI",
    effects: [
      { type: "Transfer", description: "Transferred 100 SUI tokens", status: "success" },
      { type: "Event", description: "TransferEvent emitted", status: "success" },
      { type: "Gas", description: "Paid 0.001 SUI in gas fees", status: "success" },
    ],
  }

  if (!isSupported) {
    return (
      <main className="container mx-auto px-4 py-8 md:px-6">
        <Card className="glass-card mx-auto max-w-2xl border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 py-12">
          <CardHeader className="text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
            <CardTitle className="text-2xl">Network Not Supported</CardTitle>
            <CardDescription className="text-pretty">
              This feature is currently only available on supported blockchain networks. Please switch to a supported
              network to analyze transactions. Full multichain support launching soon!
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8 pb-24 md:px-6 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">Transaction Explainer</h1>
        <p className="text-muted-foreground">Decode and understand transactions with detailed insights</p>
      </div>

      {/* Search Section */}
      <Card className="glass-card mb-8 border-border/50 bg-gradient-to-br from-primary/5 to-primary/0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Search Transaction
          </CardTitle>
          <CardDescription>
            Enter a transaction digest or paste an explorer link to get detailed analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Enter transaction digest or explorer URL..."
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="gap-2 font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <FileSearch className="h-4 w-4" />
              {isLoading ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4 text-primary flex-shrink-0" />
            <span>Paste a transaction hash or full explorer URL to analyze</span>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {isSearched ? (
        <div className="space-y-6">
          {error && (
            <Card className="border-red-500/20 bg-red-500/5 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                  <div className="flex-1">
                    <CardTitle className="text-red-500">Transaction Not Found</CardTitle>
                    <CardDescription className="mt-2">{error}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}

          {txData && !error && (
            <>
              {/* Summary Card */}
              <Card className="glass-card border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <FileSearch className="h-5 w-5 text-primary" />
                      <CardTitle>Transaction Summary</CardTitle>
                    </div>
                    <Badge
                      className={`gap-1 ${txData.status?.status === "success"
                          ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                          : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                        }`}
                    >
                      {txData.status?.status === "success" ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          Success
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          Failed
                        </>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {generateSummary(txData).map((summary, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30 hover:bg-muted/30 transition-colors"
                      >
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-foreground leading-relaxed">{summary}</p>
                      </div>
                    ))}
                  </div>

                  {getTransferFlow(txData) && (
                    <div className="mt-6 pt-6 border-t border-border/30">
                      <div className="text-sm font-semibold mb-4 flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-primary" />
                        Transfer Flow
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3 md:gap-4">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="px-3 py-2 bg-blue-500/10 text-blue-600 rounded-lg font-mono text-xs truncate border border-blue-200/30">
                              {getTransferFlow(txData)?.from}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <ArrowRight className="h-5 w-5 text-primary animate-pulse" />
                          </div>
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="px-3 py-2 bg-green-500/10 text-green-600 rounded-lg font-mono text-xs truncate border border-green-200/30">
                              {getTransferFlow(txData)?.to}
                            </div>
                          </div>
                        </div>
                        <div className="text-center mt-2 text-sm font-bold text-primary bg-primary/5 p-3 rounded-lg border border-primary/20">
                          {getTransferFlow(txData)?.amount}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Gas Fees Highlighted Card */}
              {txData.effects?.gasUsed && (
                <Card className="glass-card border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      <CardTitle>Gas Fees</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Computation</div>
                        <div className="text-2xl font-bold text-yellow-600">
                          {(Number(txData.effects.gasUsed.computationCost) / 1e9).toFixed(6)} SUI
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Storage</div>
                        <div className="text-2xl font-bold text-yellow-600">
                          {(Number(txData.effects.gasUsed.storageCost) / 1e9).toFixed(6)} SUI
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Rebate</div>
                        <div className="text-2xl font-bold text-green-600">
                          -{(Number(txData.effects.gasUsed.storageRebate) / 1e9).toFixed(6)} SUI
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Transaction Details Card */}
              <Card className="glass-card border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <CardTitle>Transaction Details</CardTitle>
                      <CardDescription className="mt-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {txData.timestampMs ? new Date(Number(txData.timestampMs)).toLocaleString() : "N/A"}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={async () => {
                          try {
                            toast({ title: "Analyzing...", description: "Getting AI explanation" })
                            const response = await fetch("/api/ai/explain", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                transactionDigest: txData.digest,
                                transactionData: txData,
                                walletAddress: txData.transaction?.data?.sender,
                              }),
                            })

                            if (!response.ok) throw new Error("Failed to get AI explanation")

                            const data = await response.json()

                            toast({
                              title: "AI Analysis Complete",
                              description: "Check the explanation below +5 Airpoints!",
                            })

                            setTxData({
                              ...txData,
                              aiExplanation: data.explanation,
                            } as TransactionData)
                          } catch (error) {
                            console.error("[v0] Error getting AI explanation:", error)
                            toast({
                              title: "AI Explanation Unavailable",
                              description: "Please set OPENAI_API_KEY environment variable",
                              variant: "destructive",
                            })
                          }
                        }}
                        className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Sparkles className="h-4 w-4" />
                        AI Explain
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowRawJson(!showRawJson)}
                        className="gap-2"
                      >
                        {showRawJson ? "Hide" : "Show"} JSON
                      </Button>
                      <Button onClick={handleExplainAnother} variant="outline" size="sm">
                        Explain Another
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Digest Copy */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Transaction Digest</div>
                    <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 hover:bg-muted/70 transition-colors">
                      <code className="flex-1 truncate text-xs text-muted-foreground font-mono">{txData.digest}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                        onClick={() => {
                          navigator.clipboard.writeText(txData.digest)
                          toast({ title: "Copied", description: "Digest copied to clipboard" })
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {showRawJson && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Raw Transaction Data (JSON)</div>
                      <div className="rounded-lg bg-muted/30 p-4 max-h-96 overflow-auto border border-border/30">
                        <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap break-words">
                          {JSON.stringify(txData, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Events Section */}
              {txData.events && txData.events.length > 0 && (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Events <Badge variant="secondary">{txData.events.length}</Badge>
                    </CardTitle>
                    <CardDescription>Blockchain events emitted during this transaction</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                    {txData.events.map((event: { type: string; parsedJson?: Record<string, unknown> }, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 rounded-lg border border-border/50 bg-background/50 p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="font-semibold text-sm break-words">{event.type}</div>
                          <div className="text-xs text-muted-foreground font-mono break-all">
                            {JSON.stringify(event.parsedJson || {}, null, 2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Object Changes Section */}
              {txData.objectChanges && txData.objectChanges.length > 0 && (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Object Changes <Badge variant="secondary">{txData.objectChanges.length}</Badge>
                    </CardTitle>
                    <CardDescription>Objects created, modified, or deleted</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                    {txData.objectChanges.slice(0, 5).map((change: { type: string; objectId?: string; version?: string; digest?: string }, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 rounded-lg border border-border/50 bg-background/50 p-4 transition-colors hover:bg-muted/50"
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0 ${change.type === "Created"
                              ? "bg-green-500/10"
                              : change.type === "Deleted"
                                ? "bg-red-500/10"
                                : "bg-blue-500/10"
                            }`}
                        >
                          {change.type === "Created" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          {change.type === "Deleted" && <XCircle className="h-4 w-4 text-red-500" />}
                          {change.type === "Mutated" && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
                        </div>
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="font-semibold text-sm">{change.type}</div>
                          {change.objectId && (
                            <div className="text-xs text-muted-foreground font-mono break-all">{change.objectId}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Explain Another Transaction Button */}
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={handleExplainAnother}
                  className="gap-2 px-8 py-6 rounded-full text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all"
                >
                  Explain Another Transaction
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </>
          )}

          {isLoading && (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="py-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                  <p className="text-sm text-muted-foreground">Analyzing transaction...</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card className="glass-card border-border/30 bg-card/30 backdrop-blur-sm">
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <FileSearch className="h-12 w-12 text-muted-foreground/50" />
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Start Analyzing</h2>
                <p className="text-sm text-muted-foreground">Enter a transaction digest above to get started</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
