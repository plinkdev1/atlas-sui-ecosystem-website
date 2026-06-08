"use client"

import { ProtocolGrid, type Protocol } from "@/components/protocol-card"
import { Button } from "@/components/ui/button"
import { RevealSection } from "@/components/reveal-section"

const liquidStaking: Protocol[] = [
  { name: "Haedal Protocol", description: "Leading liquid staking protocol on Sui. Stake SUI and receive haSUI — earn staking rewards while keeping liquidity across DeFi.", tags: ["Liquid Staking", "haSUI"], logo: "https://assets.coingecko.com/coins/images/39752/small/haedal.jpg", url: "https://haedal.xyz" },
  { name: "Volo Liquid Staking", description: "Permissionless liquid staking on Sui with voSUI tokens. Fully decentralized validator selection and on-chain governance.", tags: ["Liquid Staking", "voSUI"], url: "https://volosuif.xyz" },
  { name: "Aftermath aSUI", description: "Aftermath Finance's native liquid staking with aSUI. Stake SUI to earn validator rewards and use aSUI across DeFi.", tags: ["Liquid Staking", "aSUI"], logo: "https://assets.coingecko.com/coins/images/33046/small/aftermath.png", url: "https://aftermath.finance/staking" },
  { name: "NAVI eSUI", description: "NAVI Protocol's restaking product where SUI earns staking rewards on top of NAVI lending yield simultaneously.", tags: ["Restaking", "eSUI"], logo: "https://assets.coingecko.com/coins/images/33895/small/navi.png", url: "https://naviprotocol.io/staking" },
  { name: "Scallop sSUI", description: "Scallop's liquid staked SUI (sSUI) earning compounded staking yield while serving as collateral on money markets.", tags: ["Liquid Staking", "sSUI"], logo: "https://assets.coingecko.com/coins/images/33361/small/scallop.png", url: "https://scallop.io/staking" },
  { name: "Suilend sprSUI", description: "Suilend's Spring liquid staking primitive with automated validator optimisation and maximum yield routing.", tags: ["Liquid Staking", "sprSUI"], logo: "https://assets.coingecko.com/coins/images/36103/small/suilend.jpg", url: "https://suilend.fi/spring" },
  { name: "Mole Finance", description: "Auto-compounding yield optimizer and liquid staking aggregator on Sui for maximizing SUI staking APY.", tags: ["Auto-compound", "Optimizer"], url: "https://mole.fi" },
  { name: "AlphaFi Staking", description: "AlphaFi's automated liquid staking strategies compound staking yields daily across multiple Sui LST protocols.", tags: ["Automated", "LST Strategy"], logo: "https://assets.coingecko.com/coins/images/39536/small/alphafi.jpg", url: "https://alphafi.xyz" },
  { name: "Turbos Finance LST", description: "Turbos-integrated liquid staking pools pairing LSTs with deep AMM liquidity for optimal LP yields on Sui.", tags: ["LST + AMM", "LP Pools"], url: "https://turbos.finance/staking" },
  { name: "KriyaDEX Staking", description: "KriyaDEX liquid staking vaults enabling SUI stakers to earn trading fees on top of validator staking rewards.", tags: ["Staking Vaults", "Trading Fees"], url: "https://kriya.finance/staking" },
  { name: "Mysten Labs Native Staking", description: "Official Sui validator staking by Mysten Labs. Stake SUI directly to any validator with 1 SUI minimum.", tags: ["Official", "Validator Staking"], url: "https://suiexplorer.com/validators" },
  { name: "StakeStone", description: "Omni-chain liquid staking protocol bridging Sui LSTs to other chains, enabling cross-chain staking yield.", tags: ["Omni-chain", "Cross-chain LST"], url: "https://stakestone.io" },
]

export default function LiquidStakingPage() {
  return (
    <main>
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-28 md:pt-36">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-6 text-center relative z-10">
          <RevealSection>
            <a href="/protocols" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Protocols</a>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Category</p>
            <h1 className="heading-hero">Liquid Staking on Sui</h1>
            <p className="text-subtitle mx-auto max-w-2xl">Stake SUI and receive liquid staking tokens (LSTs) to keep earning DeFi yield while your SUI earns validator rewards.</p>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel text-sm">
              <span className="text-gradient font-bold text-xl">12+</span>
              <span className="text-muted-foreground">Liquid Staking Protocols</span>
            </div>
          </RevealSection>
        </div>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={100}>
          <ProtocolGrid protocols={liquidStaking} />
        </RevealSection>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={200}>
          <div className="card-modern-blue p-10 text-center space-y-4 rounded-3xl">
            <h2 className="heading-section">Compare Staking APYs</h2>
            <p className="text-subtitle">Use the Atlas Yield Hub to compare real-time staking rates across all LST providers.</p>
            <a href="/tools"><Button className="button-primary-modern">Open Yield Hub</Button></a>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
