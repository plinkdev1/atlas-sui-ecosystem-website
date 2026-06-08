import { BackButton } from "@/components/back-button"
import { StakeHubContent } from "@/components/stake-hub-content"
import { MobileNav } from "@/components/mobile-nav"
import { ProCtaWrapper } from "@/components/pro-cta-wrapper"

export const metadata = {
  title: "Stake Hub - Sui Validator Dashboard | Atlas Protocol",
  description:
    "Explore Sui validators, delegate tokens, and optimize your staking rewards.",
}

export default function StakeHubPage() {
  return (
    <div className="bg-background pb-20 md:pb-0">
      <div className="container max-w-7xl mx-auto px-4 pt-4 md:pt-6 space-y-6">
        <BackButton label="Back to Home" />
        <ProCtaWrapper
          title="Advanced Staking Analytics with Pro"
          description="Get real-time validator performance metrics, historical APR data, and advanced reward tracking."
          variant="minimal"
        />
      </div>
      <StakeHubContent />
      <MobileNav />
    </div>
  )
}
