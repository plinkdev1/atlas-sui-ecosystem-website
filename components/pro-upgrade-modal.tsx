"use client"

import React from "react"

import { GlassCard } from "@/components/glass-card"
import { LemonSqueezyCheckout } from "@/components/lemon-squeezy-checkout"
import { ProTag } from "@/components/pro-lock"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useProStatus } from "@/lib/pro-status-context"
import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"
import { useState } from "react"

interface ProModalProps {
  trigger?: React.ReactNode
}

const FEATURES: Record<string, { free: boolean; pro: boolean; proPlus: boolean }> = {
  "Transaction Explainer": { free: true, pro: true, proPlus: true },
  "Auto-Rules": { free: false, pro: true, proPlus: true },
  "Smart Alerts": { free: false, pro: true, proPlus: true },
  "Unlimited API Calls": { free: false, pro: true, proPlus: true },
  "Special Staking Rates": { free: false, pro: false, proPlus: true },
  "Airpoints Earning": { free: false, pro: false, proPlus: true },
  "Advanced Scans": { free: false, pro: true, proPlus: true },
  "Custom Wallets": { free: false, pro: true, proPlus: true },
}

function FeatureRow({ name, free, pro, proPlus }: { name: string; free: boolean; pro: boolean; proPlus: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/30 py-3 last:border-0">
      <span className="text-sm">{name}</span>
      <div className="flex gap-4">
        <div className="w-12 flex justify-center">
          {free ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <X className="w-4 h-4 text-muted-foreground/30" />
          )}
        </div>
        <div className="w-12 flex justify-center">
          {pro ? (
            <Check className="w-4 h-4 text-blue-500" />
          ) : (
            <X className="w-4 h-4 text-muted-foreground/30" />
          )}
        </div>
        <div className="w-12 flex justify-center">
          {proPlus ? (
            <Check className="w-4 h-4 text-blue-500" />
          ) : (
            <X className="w-4 h-4 text-muted-foreground/30" />
          )}
        </div>
      </div>
    </div>
  )
}

function PricingCard({
  tier,
  price,
  description,
  highlighted,
  isActive,
  onUpgrade,
}: {
  tier: "free" | "pro" | "pro+"
  price: string
  description: string
  highlighted?: boolean
  isActive?: boolean
  onUpgrade: () => void
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-6 text-center transition-all",
        highlighted
          ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-500/10 ring-2 ring-blue-500/20 dark:ring-blue-500/20"
          : "border-border",
      )}
    >
      <div className="mb-4">
        {tier !== "free" && <ProTag tier={tier as "pro" | "pro+"} />}
      </div>
      <h3 className="text-xl font-bold mb-2">{tier === "pro+" ? "Pro+" : "Pro"}</h3>
      <p className="text-3xl font-bold mb-1">{price}</p>
      <p className="text-sm text-foreground/70 mb-6">{description}</p>
      {tier === "free" ? (
        <Button
          onClick={onUpgrade}
          disabled={isActive}
          variant="outline"
          className="w-full"
        >
          {isActive ? "Active" : "Switch to Free"}
        </Button>
      ) : (
        <LemonSqueezyCheckout
          tier={tier as "pro" | "pro+"}
          onSuccess={onUpgrade}
          onError={(err) => console.error("Checkout error:", err)}
        />
      )}
    </div>
  )
}

export function ProUpgradeModal({ trigger }: ProModalProps) {
  const { status, upgradeToPro, downgradeToFree } = useProStatus()
  const [open, setOpen] = useState(false)

  const handleUpgradePro = () => {
    upgradeToPro("pro", 30)
    setOpen(false)
  }

  const handleUpgradeProPlus = () => {
    upgradeToPro("pro+", 30)
    setOpen(false)
  }

  const handleDowngrade = () => {
    downgradeToFree()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            {status.isPro ? "Manage Pro" : "Upgrade to Pro"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <GlassCard>
          <DialogHeader>
            <DialogTitle>Atlas Protocol Pro</DialogTitle>
            <DialogDescription>
              {status.isPro
                ? `You're currently on ${status.tier}`
                : "Unlock advanced features and unlimited access"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8">
            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PricingCard
                tier="free"
                price="Free"
                description="Forever free"
                isActive={!status.isPro}
                onUpgrade={handleDowngrade}
              />
              <PricingCard
                tier="pro"
                price="$9/mo"
                description="Most popular"
                highlighted={status.tier === "pro"}
                isActive={status.tier === "pro"}
                onUpgrade={handleUpgradePro}
              />
              <PricingCard
                tier="pro+"
                price="$19/mo"
                description="All the power"
                highlighted={status.tier === "pro+"}
                isActive={status.tier === "pro+"}
                onUpgrade={handleUpgradeProPlus}
              />
            </div>

            {/* Features Comparison */}
            <div>
              <h3 className="font-semibold mb-4">Features Included</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="bg-muted/50 p-4 flex items-center justify-between border-b border-border">
                  <span className="font-medium text-sm">Feature</span>
                  <div className="flex gap-4">
                    <div className="w-12 text-center text-xs font-medium">Free</div>
                    <div className="w-12 text-center text-xs font-medium">Pro</div>
                    <div className="w-12 text-center text-xs font-medium">Pro+</div>
                  </div>
                </div>
                <div className="p-4 space-y-0">
                  {Object.entries(FEATURES).map(([name, access]) => (
                    <FeatureRow key={name} name={name} {...access} />
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            {status.isPro && (
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  ✨ Thank you for being a Pro member! Enjoy unlimited access to all features.
                </p>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </GlassCard>
      </DialogContent>
    </Dialog>
  )
}
