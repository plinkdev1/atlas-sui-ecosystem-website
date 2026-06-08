"use client"

import { useState } from "react"

interface ProtoLogoProps {
  name: string
  primaryUrl?: string
  domain?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ProtoLogo({ name, primaryUrl, domain, size = "md", className = "" }: ProtoLogoProps) {
  const sizeMap = { sm: 24, md: 36, lg: 48 }
  const sz = sizeMap[size]

  // Build fallback chain: primary -> cryptologos -> logo.dev -> Clearbit -> CoinGecko -> letter-avatar
  const sources: string[] = []

  // 1. Primary URL (if provided and not generic sui.jpg)
  if (primaryUrl && !primaryUrl.includes("sui.jpg") && !primaryUrl.includes("sui-ocean")) {
    sources.push(primaryUrl)
  }

  // 2. Cryptologos SVG (reliable for major tokens/chains)
  const normalized = name.toLowerCase().replace(/\s+/g, "-")
  sources.push(`https://cryptologos.cc/logos/${normalized}-logo.svg`)

  // 3. logo.dev (automatic company logo)
  if (domain) {
    sources.push(`https://logo.dev/${domain}`)
  }

  // 4. Clearbit (company logos)
  if (domain) {
    sources.push(`https://logo.clearbit.com/${domain}`)
  }

  // 5. CoinGecko API (if it looks like a token)
  const coinGeckoId = name.toLowerCase().replace(/\s+/g, "-")
  sources.push(`https://assets.coingecko.com/coins/images/1/small/bitcoin.png`) // fallback placeholder

  // State to track which URL succeeded
  const [idx, setIdx] = useState(0)
  const [failed, setFailed] = useState(false)

  // Gradient colors for letter avatar
  const gradients = [
    ["#00d4aa", "#1a6b5a"],
    ["#4d9fff", "#1a3b8c"],
    ["#F97316", "#7c3300"],
    ["#8b5cf6", "#3b1a7a"],
    ["#0ea5e9", "#0369a1"],
  ]
  const [from, to] = gradients[name.charCodeAt(0) % gradients.length]

  // If all sources failed, render gradient letter avatar
  if (failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-full font-bold text-white ${className}`}
        style={{
          width: sz,
          height: sz,
          background: `linear-gradient(135deg, ${from}, ${to})`,
          fontSize: sz * 0.4,
        }}
      >
        {name[0].toUpperCase()}
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sources[idx]}
      alt={`${name} logo`}
      width={sz}
      height={sz}
      className={`rounded-full object-contain ${className}`}
      style={{ width: sz, height: sz }}
      onError={() => {
        if (idx + 1 < sources.length) {
          setIdx(idx + 1)
        } else {
          setFailed(true)
        }
      }}
    />
  )
}
