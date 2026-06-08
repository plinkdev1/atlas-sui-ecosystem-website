"use client"

import { ProtocolGrid, type Protocol } from "@/components/protocol-card"
import { Button } from "@/components/ui/button"
import { RevealSection } from "@/components/reveal-section"

const wallets: Protocol[] = [
  {
    name: "Slush",
    description: "Official Mysten Labs wallet with zkLogin social sign-in, passkeys, and seamless Sui dApp integration.",
    tags: ["zkLogin", "Passkeys"],
    logo: "https://assets.coingecko.com/coins/images/30315/small/sui.jpg",
    url: "https://slush.app",
  },
  {
    name: "Suiet",
    description: "Feature-rich Sui wallet with browser extension, mobile app, and hardware wallet support via Ledger.",
    tags: ["Browser", "Mobile"],
    logo: "https://raw.githubusercontent.com/suiet/suiet/main/packages/chrome/public/icon128.png",
    url: "https://suiet.app",
  },
  {
    name: "OKX Wallet",
    description: "Multi-chain Web3 wallet from OKX with built-in DEX, NFT marketplace, and DeFi discovery.",
    tags: ["Multi-chain", "DEX"],
    url: "https://www.okx.com/web3",
  },
  {
    name: "Nightly",
    description: "Multichain crypto wallet with passkey support, built-in swaps, and deep Sui ecosystem integration.",
    tags: ["Passkeys", "Multi-chain"],
    url: "https://nightly.app",
  },
  {
    name: "Phantom",
    description: "Popular non-custodial wallet with Sui, Solana, Ethereum, and Bitcoin support in one place.",
    tags: ["Multi-chain", "Mobile"],
    url: "https://phantom.app",
  },
  {
    name: "Martian",
    description: "Web3 gaming-focused wallet for Sui and Aptos with API integrations for developers.",
    tags: ["Gaming", "Sui + Aptos"],
    url: "https://martianwallet.xyz",
  },
  {
    name: "Ethos Wallet",
    description: "Non-custodial Sui wallet designed for everyday users with in-app dApp browser and gasless transactions.",
    tags: ["dApp Browser", "Sui Native"],
    url: "https://ethoswallet.xyz",
  },
  {
    name: "Surf Wallet",
    description: "Next-generation Sui wallet with social features, a built-in explorer, and NFT management.",
    tags: ["Social", "Explorer"],
    url: "https://surf.tech",
  },
  {
    name: "OneKey",
    description: "100% open-source multi-chain crypto wallet supporting hardware and software modes.",
    tags: ["Open Source", "Hardware"],
    url: "https://onekey.so",
  },
  {
    name: "WELLDONE Wallet",
    description: "Integrated non-custodial wallet for managing assets across any network including Sui.",
    tags: ["Multi-chain", "Developer"],
    url: "https://welldonestudio.io/wallet",
  },
  {
    name: "Easy Wallet",
    description: "Social wallet with user-curated profiles and social discovery features for the Sui ecosystem.",
    tags: ["Social", "Profiles"],
    url: "https://easywallet.sui",
  },
  {
    name: "Maven",
    description: "First multi-signature non-custodial digital asset management solution on Sui by MSafe team.",
    tags: ["Multisig", "Treasury"],
    url: "https://sui.msafe.app",
  },
  {
    name: "ComingChat",
    description: "Social portal wallet on Sui combining ChatGPT, social messaging, and DeFi in one app.",
    tags: ["Social", "DeFi"],
    url: "https://coming.chat",
  },
  {
    name: "Trust Wallet",
    description: "Self-custody wallet supporting 10M+ assets across 100+ blockchains including Sui.",
    tags: ["Multi-chain", "Mobile"],
    url: "https://trustwallet.com",
  },
  {
    name: "MATH Wallet",
    description: "Multi-chain crypto wallet supporting Sui with built-in DApp store and staking.",
    tags: ["Multi-chain", "DApp Store"],
    url: "https://mathwallet.org",
  },
  {
    name: "Crossmint",
    description: "Developer platform with APIs for wallets, payments, and NFT tokenization on Sui.",
    tags: ["Developer API", "NFT"],
    url: "https://crossmint.com",
  },
  {
    name: "FoxWallet",
    description: "Multi-chain decentralized self-custody wallet with Sui support and DeFi integration.",
    tags: ["Self-custody", "Multi-chain"],
    url: "https://foxwallet.com",
  },
  {
    name: "Desig",
    description: "Universal multisig solution for DAOs, co-founders, and treasuries with MPC-TSS and ZK security.",
    tags: ["Multisig", "DAO"],
    url: "https://desig.io",
  },
  {
    name: "Coin98 (Ninety Eight)",
    description: "Non-custodial crypto wallet service and suite of DeFi products with Sui support.",
    tags: ["DeFi Suite", "Multi-chain"],
    url: "https://coin98.com",
  },
  {
    name: "Keystone",
    description: "100% air-gapped QR code hardware wallet compatible with all top Sui software wallets.",
    tags: ["Hardware", "Air-gapped"],
    url: "https://keyst.one",
  },
]

export default function WalletsPage() {
  return (
    <main>
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-28 md:pt-36">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-6 text-center relative z-10">
          <RevealSection>
          <a href="/protocols" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Protocols
          </a>
          <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Category</p>
          <h1 className="heading-hero">Wallets on Sui</h1>
          <p className="text-subtitle mx-auto max-w-2xl">
            20+ self-custody wallets built for the Sui ecosystem — from social sign-in to hardware-grade security.
          </p>
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel text-sm">
            <span className="text-gradient font-bold text-xl">20+</span>
            <span className="text-muted-foreground">Wallets Listed</span>
          </div>
          </RevealSection>
        </div>
      </section>

      <section className="section-default container-modern">
        <RevealSection delay={100}>
          <ProtocolGrid protocols={wallets} />
        </RevealSection>
      </section>

      <section className="section-default container-modern">
        <RevealSection delay={200}>
          <div className="card-modern-blue p-10 text-center space-y-4 rounded-3xl">
            <h2 className="heading-section">Missing a wallet?</h2>
            <p className="text-subtitle">Submit your project to be listed in the Atlas directory.</p>
            <a href="mailto:hello@atlasprotocol.space">
              <Button className="button-primary-modern">Submit Protocol</Button>
            </a>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
