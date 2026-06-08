"use client"

import { ProtocolGrid, type Protocol } from "@/components/protocol-card"
import { Button } from "@/components/ui/button"
import { RevealSection } from "@/components/reveal-section"

const lendingProtocols: Protocol[] = [
  { name: "Suilend", description: "The leading lending protocol on Sui. Deposit assets, borrow against collateral, and earn yield on supplied assets.", tags: ["Lending", "Top TVL"], logo: "https://assets.coingecko.com/coins/images/36103/small/suilend.jpg", url: "https://suilend.fi" },
  { name: "NAVI Protocol", description: "Native one-stop liquidity protocol on Sui. Largest TVL lending market with flash loans, isolated pools, and eSUI staking.", tags: ["Lending", "Flash Loans"], logo: "https://assets.coingecko.com/coins/images/33895/small/navi.png", url: "https://naviprotocol.io" },
  { name: "Scallop", description: "Next-generation money market on Sui with capital-efficient isolated markets, composable yield, and sSUI staking.", tags: ["Money Market", "Isolated Pools"], logo: "https://assets.coingecko.com/coins/images/33361/small/scallop.png", url: "https://scallop.io" },
  { name: "AlphaFi", description: "Automated DeFi optimizer on Sui maximizing yields across lending protocols and liquidity pools with one-click strategies.", tags: ["Yield Optimizer", "Auto-compound"], logo: "https://assets.coingecko.com/coins/images/39536/small/alphafi.jpg", url: "https://alphafi.xyz" },
  { name: "Bucket Protocol", description: "Decentralized CDP stablecoin protocol on Sui. Borrow BUCK stablecoin against SUI, BTC, and ETH collateral.", tags: ["CDP", "Stablecoin"], logo: "https://assets.coingecko.com/coins/images/31609/small/bucket.jpg", url: "https://bucketprotocol.io" },
  { name: "Aries Markets", description: "Leveraged yield and trading platform on Sui combining lending with margin trading and yield strategies.", tags: ["Leveraged Yield", "Margin"], url: "https://ariesmarkets.xyz" },
  { name: "Abel Finance", description: "Decentralized lending and borrowing protocol on Sui with algorithmic interest rates and community governance.", tags: ["Algorithmic Rates", "Governance"], url: "https://abel.finance" },
  { name: "OmniBTC Lend", description: "Cross-chain lending protocol connecting Sui liquidity to multi-chain borrowing and yield aggregation.", tags: ["Cross-chain", "Lend+Borrow"], url: "https://omnibtc.finance" },
  { name: "Keepsake Lending", description: "NFT-backed lending protocol on Sui allowing holders to borrow SUI against blue-chip NFT collections.", tags: ["NFT Lending", "Collateral"], url: "https://keepsake.gg" },
  { name: "Nexio Lend", description: "Bitcoin-native lending protocol on Sui enabling BTC holders to borrow against their BTC without wrapping.", tags: ["BTC Lending", "Bitcoin L2"], url: "https://nexio.io" },
  { name: "Haedal Stake", description: "Haedal liquid staking with integrated lending for haSUI — earn staking yield while using as collateral.", tags: ["Liquid Staking", "Collateral"], logo: "https://assets.coingecko.com/coins/images/39752/small/haedal.jpg", url: "https://haedal.xyz" },
]

export default function LendingPage() {
  return (
    <main>
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-28 md:pt-36">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-6 text-center relative z-10">
          <RevealSection>
          <a href="/protocols" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Protocols</a>
          <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Category</p>
          <h1 className="heading-hero">Lending & Borrowing on Sui</h1>
          <p className="text-subtitle mx-auto max-w-2xl">Supply assets to earn yield or borrow against collateral. Explore Sui's money markets, CDPs, and yield optimizers.</p>
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel text-sm">
            <span className="text-gradient font-bold text-xl">11+</span>
            <span className="text-muted-foreground">Lending Protocols Listed</span>
          </div>
          </RevealSection>
        </div>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={100}>
          <ProtocolGrid protocols={lendingProtocols} />
        </RevealSection>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={200}>
          <div className="card-modern-blue p-10 text-center space-y-4 rounded-3xl">
            <h2 className="heading-section">Maximize Your Yield</h2>
            <p className="text-subtitle">Use the Atlas DeFi Hub to view positions across all lending protocols in one dashboard.</p>
            <a href="/tools"><Button className="button-primary-modern">Open DeFi Hub</Button></a>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
