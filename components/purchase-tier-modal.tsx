"use client"

import { GlassCard } from "@/components/glass-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { buildPaymentTransactionBlock, formatPaymentAmount } from "@/lib/payment-transaction"
import { useUnifiedWallet } from "@/lib/unified-wallet-context"
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit"
import { AlertCircle, CheckCircle2, CreditCard, Loader2 } from "lucide-react"
import { useState } from "react"

interface PricingTier {
  name: string
  price: number
  token: string
  requests?: number
}

interface PurchaseTierModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  providerId: string
  providerName: string
  tiers: PricingTier[]
}

export function PurchaseTierModal({ open, onOpenChange, providerId, providerName, tiers }: PurchaseTierModalProps) {
  const wallet = useUnifiedWallet()
  const currentAddress = wallet.address
  const { toast } = useToast()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [gasEstimate, setGasEstimate] = useState<string | null>(null)

  const handleTierSelect = async (tier: PricingTier) => {
    setSelectedTier(tier)
    // Gas estimation would happen here in production
    console.log("[v0] Selected tier:", tier)
  }

  const handlePurchase = async () => {
    if (!selectedTier || !currentAddress) {
      toast({
        title: "Error",
        description: "Please select a tier and connect your wallet",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("[v0] Initiating payment for tier:", selectedTier.name)

      const treasuryAddress = await fetch("/api/payment/treasury")
        .then((res) => res.json())
        .then((data) => data.treasury)
        .catch(() => currentAddress)
      const amountInMist = String(Math.floor(selectedTier.price * 1e9))

      const txb = await buildPaymentTransactionBlock({
        treasuryAddress,
        providerId,
        tierName: selectedTier.name,
        amount: amountInMist,
        token: (selectedTier.token as "SUI" | "USDC") || "SUI",
      })

      // Execute transaction
      await new Promise((resolve) => {
        signAndExecute(
          { transaction: txb },
          {
            onSuccess: async (result) => {
              console.log("[v0] Payment successful:", result.digest)

              // Store entitlement in database
              try {
                await fetch("/api/entitlements", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user_id: currentAddress,
                    provider_id: providerId,
                    tier: selectedTier.name,
                    transaction_digest: result.digest,
                  }),
                })
              } catch (err) {
                console.warn("[v0] Could not store entitlement:", err)
              }

              toast({
                title: "Payment Successful",
                description: `You now have access to ${selectedTier.name} tier`,
              })

              onOpenChange(false)
              setSelectedTier(null)
              resolve(undefined)
            },
            onError: (error) => {
              console.error("[v0] Payment failed:", error)
              toast({
                title: "Payment Failed",
                description: error.message || "Failed to process payment",
                variant: "destructive",
              })
              resolve(undefined)
            },
          },
        )
      })
    } catch (error) {
      console.error("[v0] Error during payment:", error)
      toast({
        title: "Error",
        description: "An error occurred during payment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <GlassCard>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Purchase {providerName} Tier
            </DialogTitle>
            <DialogDescription>Select a tier to unlock advanced features and support</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={`cursor-pointer transition-all ${selectedTier?.name === tier.name ? "border-primary bg-primary/5" : "hover:border-primary/50"
                  }`}
                onClick={() => handleTierSelect(tier)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{tier.name}</CardTitle>
                      <CardDescription>{tier.requests ? `${tier.requests} requests/month` : "Unlimited"}</CardDescription>
                    </div>
                    <Badge className="text-lg">
                      {formatPaymentAmount(tier.price, tier.token)} {tier.token}
                    </Badge>
                  </div>
                </CardHeader>
                {selectedTier?.name === tier.name && (
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                      Selected
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {gasEstimate && (
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                Est. gas fee: {gasEstimate} SUI
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handlePurchase} disabled={!selectedTier || isLoading} className="gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Processing..." : "Purchase Tier"}
            </Button>
          </DialogFooter>
        </GlassCard>
      </DialogContent>
    </Dialog>
  )
}
