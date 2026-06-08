"use client"

import { ProtocolGrid, type Protocol } from "@/components/protocol-card"
import { Button } from "@/components/ui/button"
import { RevealSection } from "@/components/reveal-section"

const btcProtocols: Protocol[] = [
  { name: "Suiball", description: "BTC-Fi wearable hardware wallet with native Sui integration, biometrics, and cold storage for BTC and Sui assets.", tags: ["Hardware Wallet", "BTC-Fi"], url: "https://suiball.io" },
  { name: "wBTC on Sui (Portal)", description: "Wrapped Bitcoin bridged to Sui via Portal/Wormhole. Fully collateralized, audited, and composable with Sui DeFi.", tags: ["Wrapped BTC", "Portal Bridge"], url: "https://portalbridge.com" },
  { name: "xBTC (OKX)", description: "OKX-wrapped Bitcoin on Sui enabling BTC holders to participate in Sui DeFi with familiar custody.", tags: ["Wrapped BTC", "OKX"], url: "https://www.okx.com/web3" },
  { name: "pSTAKE Finance", description: "BTC liquid staking protocol enabling BTC holders to earn yield while keeping liquidity through pSTAKE LSTs.", tags: ["Liquid Staking", "BTC Yield"], url: "https://pstake.finance" },
  { name: "Lorenzo Protocol", description: "Bitcoin liquid restaking protocol enabling BTC staking across multiple protocols including Sui DeFi.", tags: ["BTC Restaking", "Liquid"], url: "https://lorenzo-protocol.xyz" },
  { name: "SatLayer", description: "Bitcoin restaking protocol enabling BTC to secure Proof-of-Stake networks and earn additional yield.", tags: ["BTC Restaking", "PoS Security"], url: "https://satlayer.xyz" },
  { name: "Native Protocol", description: "Decentralized BTC bridge and yield protocol bringing native Bitcoin to Sui without wrapping overhead.", tags: ["Native BTC", "Bridge"], url: "https://native.org" },
  { name: "Nexio", description: "Move-based L2 for Bitcoin enabling smart contract functionality and DeFi on top of BTC via Sui's Move VM.", tags: ["Bitcoin L2", "Move VM"], url: "https://nexio.io" },
  { name: "Creek Finance", description: "Tokenized gold-backed stablecoins and BTC primitives for real-world asset DeFi integration on Sui.", tags: ["Tokenized Gold", "RWA"], url: "https://creek.finance" },
  { name: "Aftermath afBTC", description: "Aftermath Finance's wrapped BTC derivative enabling BTC liquidity in Sui DeFi pools with yield.", tags: ["BTC LP", "Yield"], logo: "https://assets.coingecko.com/coins/images/33046/small/aftermath.png", url: "https://aftermath.finance" },
]

export default function BTCPrimitivesPage() {
  return (
    <main>
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-28 md:pt-36">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-6 text-center relative z-10">
          <RevealSection>
            <a href="/protocols" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Protocols</a>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Category</p>
            <h1 className="heading-hero">Bitcoin Primitives on Sui</h1>
            <p className="text-subtitle mx-auto max-w-2xl">Wrapped BTC, liquid staking, restaking, and BTC-Fi protocols bringing Bitcoin to the Sui DeFi ecosystem.</p>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel text-sm">
              <span className="text-gradient font-bold text-xl">10+</span>
              <span className="text-muted-foreground">BTC Protocols Listed</span>
            </div>
          </RevealSection>
        </div>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={100}>
          <ProtocolGrid protocols={btcProtocols} />
        </RevealSection>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={200}>
          <div className="card-modern-blue p-10 text-center space-y-4 rounded-3xl">
            <h2 className="heading-section">Building BTC on Sui?</h2>
            <p className="text-subtitle">Submit your BTC protocol to be listed in the Atlas directory.</p>
            <a href="mailto:hello@atlasprotocol.space"><Button className="button-primary-modern">Submit Protocol</Button></a>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
