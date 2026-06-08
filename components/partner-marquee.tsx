"use client"

import { useState } from "react"

const PARTNERS = [
  { name: "Mysten Labs", url: "https://mystenlabs.com" },
  { name: "Sui Foundation", url: "https://sui.io" },
  { name: "Cetus", url: "https://cetus.zone" },
  { name: "NAVI Protocol", url: "https://navi.ag" },
  { name: "Suilend", url: "https://suilend.fi" },
  { name: "Pyth Network", url: "https://pyth.network" },
  { name: "Wormhole", url: "https://wormhole.com" },
  { name: "BlueMove", url: "https://bluemove.net" },
  { name: "Aftermath Finance", url: "https://aftermath.finance" },
  { name: "DeepBook", url: "https://deepbook.tech" },
  { name: "Scallop", url: "https://scallop.io" },
  { name: "Turbos Finance", url: "https://turbos.finance" },
]

const GRAD_COLORS = [
  ["#00d4aa", "#1a6b5a"],
  ["#4d9fff", "#1a3b8c"],
  ["#0ea5e9", "#0369a1"],
  ["#10b981", "#065f46"],
  ["#8b5cf6", "#3b1a7a"],
]

function PartnerLogo({ name, url }: { name: string; url: string }) {
  const domain = (() => {
    try { return new URL(url).hostname.replace("www.", "") } catch { return "" }
  })()
  const clearbitUrl = domain ? `https://logo.clearbit.com/${domain}` : null
  const [failed, setFailed] = useState(false)
  const [from, to] = GRAD_COLORS[name.charCodeAt(0) % GRAD_COLORS.length]

  if (failed || !clearbitUrl) {
    return (
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        {name[0]}
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={clearbitUrl}
      alt={`${name} logo`}
      className="w-8 h-8 rounded-lg object-contain bg-white/5 shrink-0"
      onError={() => setFailed(true)}
    />
  )
}

function MarqueeItem({ name, url }: { name: string; url: string }) {
  return (
    <div className="flex items-center gap-3 px-6 py-2 opacity-60 hover:opacity-100 transition-opacity duration-300 shrink-0">
      <PartnerLogo name={name} url={url} />
      <span className="text-sm font-semibold text-foreground whitespace-nowrap">{name}</span>
    </div>
  )
}

export function PartnerMarquee() {
  // Duplicate items for seamless loop
  const items = [...PARTNERS, ...PARTNERS]

  return (
    <section className="py-12 container-modern overflow-hidden">
      <p className="text-xs tracking-widest uppercase text-muted-foreground mb-8 text-center">
        Building on Sui Ecosystem
      </p>

      {/* Fade masks on edges */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{
          background: 'linear-gradient(to right, var(--background), transparent)'
        }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{
          background: 'linear-gradient(to left, var(--background), transparent)'
        }} />

        {/* Marquee track */}
        <div className="flex marquee" style={{ width: 'max-content' }}>
          {items.map((p, i) => (
            <MarqueeItem key={`${p.name}-${i}`} name={p.name} url={p.url} />
          ))}
        </div>
      </div>
    </section>
  )
}
