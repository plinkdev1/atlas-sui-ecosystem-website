import { MobileNav } from "@/components/mobile-nav"
import { WalletCleanupContent } from "@/components/wallet-cleanup-content"
import { BackButton } from "@/components/back-button"
import { ProCtaWrapper } from "@/components/pro-cta-wrapper"

export default function WalletCleanupPage() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container max-w-7xl mx-auto px-4 pt-4 md:pt-6 space-y-6">
        <BackButton label="Back to Home" />
        <ProCtaWrapper
          title="Unlimited Wallet Cleanup"
          description="Pro users get unlimited wallet analysis, auto-rules, smart alerts, and 10%+ APY staking boosts."
          variant="minimal"
        />
      </div>
      <WalletCleanupContent />
      <MobileNav />
    </div>
  )
}
