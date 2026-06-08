import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { BackButton } from "@/components/back-button"
import { OracleFeedContent } from "@/components/oracle-feed-content"

export const metadata: Metadata = {
  title: "Oracle Price Feeds | Atlas Protocol",
  description:
    "Real-time Pyth Network oracle price feeds for Sui ecosystem tokens with price alerts and notifications.",
}

export default function OracleFeedsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-4">
        <div className="container mx-auto px-4 mb-4">
          <BackButton />
        </div>
        <OracleFeedContent />
      </main>
      <Footer />
      <MobileNav />
    </>
  )
}
