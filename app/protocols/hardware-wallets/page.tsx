"use client"

import { ProtocolGrid, type Protocol } from "@/components/protocol-card"
import { Button } from "@/components/ui/button"
import { RevealSection } from "@/components/reveal-section"

const hardwareWallets: Protocol[] = [
  { name: "Ledger", description: "Industry-leading hardware wallet fully supporting Sui. Store SUI and Sui-based tokens in cold storage with the Ledger Nano S Plus and Ledger Nano X.", tags: ["Cold Storage", "Top Security"], url: "https://ledger.com" },
  { name: "Trezor", description: "Pioneer hardware wallet brand now supporting Sui via third-party firmware, offering secure offline key storage for SUI assets.", tags: ["Cold Storage", "Open Source"], url: "https://trezor.io" },
  { name: "Keystone", description: "Air-gapped hardware wallet with QR-code signing supporting Sui. 100% offline, camera-based transaction signing.", tags: ["Air-gapped", "QR Signing"], url: "https://keyst.one" },
  { name: "Suiball", description: "BTC-Fi wearable hardware wallet with biometric authentication and native Sui support, designed for DeFi users.", tags: ["Wearable", "Biometric"], url: "https://suiball.io" },
  { name: "OneKey", description: "Open-source hardware wallet with Sui support. Combines cold storage security with a simple mobile companion app.", tags: ["Open Source", "Sui Native"], url: "https://onekey.so" },
  { name: "Bitget Wallet (MPC)", description: "MPC-based keyless wallet solution providing hardware-equivalent security without a physical device for Sui assets.", tags: ["MPC Wallet", "Keyless"], url: "https://web3.bitget.com" },
  { name: "SafePal", description: "Self-custody hardware and software wallet ecosystem supporting Sui with the S1 hardware device and mobile app.", tags: ["Hardware + App", "Self-custody"], url: "https://safepal.com" },
  { name: "D'CENT", description: "Biometric hardware wallet with fingerprint authentication supporting Sui and SUI-based tokens.", tags: ["Biometric", "Fingerprint Auth"], url: "https://dcentwallet.com" },
]

export default function HardwareWalletsPage() {
  return (
    <main>
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-28 md:pt-36">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-6 text-center relative z-10">
          <RevealSection>
            <a href="/protocols" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Protocols</a>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Category</p>
            <h1 className="heading-hero">Hardware Wallets for Sui</h1>
            <p className="text-subtitle mx-auto max-w-2xl">Secure your SUI and Sui-based assets in cold storage. Hardware wallets provide the highest level of security for long-term holders.</p>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel text-sm">
              <span className="text-gradient font-bold text-xl">8+</span>
              <span className="text-muted-foreground">Hardware Wallet Solutions</span>
            </div>
          </RevealSection>
        </div>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={100}>
          <ProtocolGrid protocols={hardwareWallets} />
        </RevealSection>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={200}>
          <div className="card-modern-blue p-10 text-center space-y-4 rounded-3xl">
            <h2 className="heading-section">Security Best Practices</h2>
            <p className="text-subtitle">Always buy hardware wallets directly from manufacturers. Never buy second-hand or from unverified resellers.</p>
            <a href="/protocols/wallets"><Button className="button-primary-modern">View All Wallets</Button></a>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
