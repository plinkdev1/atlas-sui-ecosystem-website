import type { Metadata } from "next"
import { BridgeHubContent } from "@/components/bridge-hub-content"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { BackButton } from "@/components/back-button"

export const metadata: Metadata = {
  title: "Bridge Hub | Atlas Protocol",
  description: "Bridge tokens across chains with the best routes and lowest fees. Compare Wormhole, Squid, and Sui Native Bridge.",
}

export default function BridgeHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-7xl mx-auto px-4 pt-4">
        <BackButton />
      </div>
      <BridgeHubContent />
      <Footer />
      <MobileNav />
    </div>
  )
}
