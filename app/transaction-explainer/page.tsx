import { MobileNav } from "@/components/mobile-nav"
import { TransactionExplainerContent } from "@/components/transaction-explainer-content"
import { BackButton } from "@/components/back-button"
import { ProCtaWrapper } from "@/components/pro-cta-wrapper"

export default function TransactionExplainerPage() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container max-w-7xl mx-auto px-4 pt-4 md:pt-6 space-y-6">
        <BackButton label="Back to Home" />
        <ProCtaWrapper
          title="Advanced Transaction Analysis with Pro"
          description="Get unlimited API calls, custom rules, and smart alerts. Earn 3x Airpoints multiplier on Pro+."
          variant="minimal"
        />
      </div>
      <TransactionExplainerContent />
      <MobileNav />
    </div>
  )
}
