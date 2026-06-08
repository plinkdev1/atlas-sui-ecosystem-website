"use client"

import { useState } from "react"
import { useProStatus } from "@/lib/pro-status-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { MobileNav } from "@/components/mobile-nav"
import { AirpointsDisplay } from "@/components/airpoints-display"
import { useAirpointsEarn } from "@/hooks/use-airpoints-earn"
import { Crown, Zap, Gift, CheckCircle2, AlertCircle } from "lucide-react"
import { formatDate } from "date-fns"
import { toast } from "react-toastify"
import { RevealSection } from "@/components/reveal-section"
import Link from "next/link"

const FEATURES = [
  { label: "Unlimited wallet cleanup & analysis", tiers: ["pro", "pro+"] },
  { label: "Advanced transaction analysis", tiers: ["pro", "pro+"] },
  { label: "Smart alerts & auto-rules", tiers: ["pro", "pro+"] },
  { label: "3x Airpoints multiplier", tiers: ["pro+"] },
  { label: "+10% staking APY boost", tiers: ["pro+"] },
]

export default function SubscriptionPage() {
  const { status, downgradeToFree, upgradeToPro } = useProStatus()
  const { earn, loading: earnLoading } = useAirpointsEarn()
  const router = useRouter()
  const [simulatingEarn, setSimulatingEarn] = useState(false)

  const daysRemaining =
    status.expiry && status.isPro
      ? Math.ceil((new Date(status.expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null

  const handleCancel = () => {
    if (!window.confirm("Are you sure you want to cancel your Pro subscription?")) return
    downgradeToFree()
    toast.success("Subscription cancelled. Back to Free tier.", { position: "bottom-right" })
    setTimeout(() => window.location.reload(), 500)
  }

  const handleSimulateEarn = async () => {
    if (!status.isPro) { toast.info("Upgrade to Pro to earn Airpoints", { position: "bottom-right" }); return }
    setSimulatingEarn(true)
    try {
      await earn({ amount: 25, type: "earn_cleanup", description: "Mock earning simulation" })
      toast.success("Simulated: +25 Airpoints!", { position: "bottom-right" })
    } catch { toast.error("Failed to simulate earning", { position: "bottom-right" }) }
    finally { setSimulatingEarn(false) }
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Hero */}
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-24 md:pt-32">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="relative z-10 space-y-5">
          <RevealSection>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Account</p>
            <h1 className="heading-hero">Subscription & Billing</h1>
            <p className="text-subtitle max-w-xl">Manage your Atlas Protocol Pro subscription, Airpoints, and billing details.</p>
          </RevealSection>
        </div>
      </section>

      <section className="section-default container-modern max-w-4xl space-y-8">
        <RevealSection delay={100}>
          {/* Status card */}
          <div className={`card-modern p-8 border-2 ${status.isPro ? "border-[#2B7FFF]/40" : "border-[rgba(43,127,255,0.15)]"}`}>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="icon-badge w-14 h-14">
                  {status.isPro
                    ? <Crown className="h-6 w-6 text-[#2B7FFF]" />
                    : <Zap className="h-6 w-6 text-[#2B7FFF]" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {status.isPro ? (status.tier === "pro+" ? "Pro+ Subscription" : "Pro Subscription") : "Free Tier"}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {status.isPro ? "Premium access unlocked" : "Upgrade to unlock advanced features"}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                status.isPro
                  ? "bg-[#2B7FFF]/15 text-[#4d9fff] border-[#2B7FFF]/30"
                  : "bg-muted text-muted-foreground border-border"
              }`}>
                {status.tier.charAt(0).toUpperCase() + status.tier.slice(1)}
              </span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-background/60 rounded-xl p-3 border border-[rgba(43,127,255,0.1)]">
                <p className="text-xs text-muted-foreground mb-1">Tier</p>
                <p className="font-semibold text-foreground text-sm">{status.tier === "pro+" ? "Pro+" : status.tier === "pro" ? "Pro" : "Free"}</p>
              </div>
              {status.isPro && status.expiry && (
                <>
                  <div className="bg-background/60 rounded-xl p-3 border border-[rgba(43,127,255,0.1)]">
                    <p className="text-xs text-muted-foreground mb-1">Active Until</p>
                    <p className="font-semibold text-foreground text-sm">{formatDate(new Date(status.expiry), "MMM d, yyyy")}</p>
                  </div>
                  <div className="bg-background/60 rounded-xl p-3 border border-[rgba(43,127,255,0.1)]">
                    <p className="text-xs text-muted-foreground mb-1">Days Left</p>
                    <p className="font-semibold text-foreground text-sm">{daysRemaining ?? "–"}</p>
                  </div>
                  <div className="bg-background/60 rounded-xl p-3 border border-[rgba(43,127,255,0.1)]">
                    <p className="text-xs text-muted-foreground mb-1">Pricing</p>
                    <p className="font-semibold text-foreground text-sm">${status.tier === "pro+" ? "30" : "10"}/mo</p>
                  </div>
                </>
              )}
              {!status.isPro && (
                <div className="bg-background/60 rounded-xl p-3 border border-[rgba(43,127,255,0.1)]">
                  <p className="text-xs text-muted-foreground mb-1">Next Tier</p>
                  <p className="font-semibold text-foreground text-sm">Pro ($10/mo)</p>
                </div>
              )}
            </div>

            {/* Expiry warning */}
            {status.isPro && daysRemaining !== null && daysRemaining <= 7 && (
              <div className="flex gap-3 p-4 bg-yellow-500/10 border border-yellow-500/25 rounded-xl mb-4">
                <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Expiring Soon</p>
                  <p className="text-sm text-muted-foreground">Your subscription expires in {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}.</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {!status.isPro ? (
                <Button onClick={() => router.push("/pro-upgrade")} className="button-primary-modern gap-2">
                  <Crown className="h-4 w-4" /> Upgrade to Pro
                </Button>
              ) : (
                <>
                  {status.tier === "pro" && (
                    <Button onClick={() => router.push("/pro-upgrade")} className="button-primary-modern gap-2">
                      <Crown className="h-4 w-4" /> Upgrade to Pro+
                    </Button>
                  )}
                  <Button onClick={handleCancel} variant="outline" className="bg-transparent border-red-500/25 text-red-500 hover:bg-red-500/10">
                    Cancel Subscription
                  </Button>
                </>
              )}
            </div>
          </div>
        </RevealSection>

        {/* Airpoints */}
        <RevealSection delay={150}>
          <AirpointsDisplay showHistory={true} showRedemption={true} />
        </RevealSection>

        {/* Feature comparison */}
        <RevealSection delay={200}>
          <div className="card-modern p-8 space-y-4">
            <h2 className="font-semibold text-foreground">Your Features</h2>
            <div className="space-y-2">
              {FEATURES.map((f) => {
                const active = status.isPro && f.tiers.includes(status.tier)
                return (
                  <div key={f.label} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                    active
                      ? "bg-[#2B7FFF]/08 border-[#2B7FFF]/20"
                      : "bg-background/40 border-[rgba(43,127,255,0.08)] opacity-50"
                  }`}>
                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${active ? "text-[#2B7FFF]" : "text-muted-foreground"}`} />
                    <span className="text-sm text-foreground">{f.label}</span>
                    {f.tiers.includes("pro+") && !f.tiers.includes("pro") && (
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[#00d4aa]/15 text-[#00d4aa] border border-[#00d4aa]/20">Pro+ only</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </RevealSection>

        {/* Dev simulation */}
        <RevealSection delay={250}>
          <div className="card-modern p-6 border-dashed border-yellow-500/40 space-y-4">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold text-foreground text-sm">Testing & Simulation</h3>
            </div>
            <Button onClick={handleSimulateEarn} disabled={!status.isPro || simulatingEarn || earnLoading} className="w-full button-primary-modern">
              {simulatingEarn || earnLoading ? "Earning..." : "Simulate Earn (+25 pts)"}
            </Button>
            <p className="text-xs text-muted-foreground">{!status.isPro ? "Upgrade to Pro to test earning" : "Simulates earning 25 Airpoints from a cleanup action"}</p>
            <div className="border-t border-[rgba(43,127,255,0.1)] pt-3 grid grid-cols-2 gap-2">
              <Button onClick={() => { downgradeToFree(); toast.info("Downgraded to Free", { position: "bottom-right" }) }} disabled={!status.isPro} size="sm" variant="outline" className="text-xs bg-transparent">Test Downgrade</Button>
              <Button onClick={async () => { await upgradeToPro("pro", 30); toast.success("Upgraded to Pro", { position: "bottom-right" }) }} size="sm" variant="outline" className="text-xs bg-transparent">Test Pro Activation</Button>
            </div>
          </div>
        </RevealSection>

        {/* Help */}
        <RevealSection delay={300}>
          <div className="card-modern p-6 space-y-2">
            <h3 className="font-semibold text-foreground text-sm">Need Help?</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-[#2B7FFF]">→</span>All subscriptions billed monthly in USD</li>
              <li className="flex gap-2"><span className="text-[#2B7FFF]">→</span>Cancel anytime — no hidden fees</li>
              <li className="flex gap-2"><span className="text-[#2B7FFF]">→</span>Airpoints reset at end of each billing cycle</li>
              <li className="flex gap-2"><span className="text-[#2B7FFF]">→</span>
                Contact <a href="mailto:support@atlasprotocol.space" className="text-[#2B7FFF] hover:text-[#00d4aa] transition-colors">support@atlasprotocol.space</a>
              </li>
            </ul>
          </div>
        </RevealSection>
      </section>

      <MobileNav />
    </div>
  )
}
