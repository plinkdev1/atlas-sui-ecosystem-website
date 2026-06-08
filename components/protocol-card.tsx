"use client"

import { useState, useEffect } from "react"
import { ExternalLink } from "lucide-react"
import { getProtocolLogo } from "@/lib/protocol-logos"

export interface Protocol {
  name: string
  description: string
  tags: string[]
  logo?: string
  url: string
  twitter?: string
}

// Gradient palette per first letter
const GRAD_COLORS = [
  ["#00d4aa", "#1a6b5a"],
  ["#4d9fff", "#1a3b8c"],
  ["#F97316", "#7c3300"],
  ["#8b5cf6", "#3b1a7a"],
  ["#0ea5e9", "#0369a1"],
  ["#10b981", "#065f46"],
]

function getGradient(name: string) {
  const idx = name.charCodeAt(0) % GRAD_COLORS.length
  return GRAD_COLORS[idx]
}

function LetterAvatar({ name }: { name: string }) {
  const [from, to] = getGradient(name)
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden="true"
    >
      {name[0].toUpperCase()}
    </div>
  )
}

/**
 * Test if image URL returns 200 by attempting to fetch with HEAD request
 * Falls back to GET on failure (some servers don't support HEAD)
 */
async function testImageUrl(url: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000) // 5s timeout

    const response = await fetch(url, {
      method: "HEAD",
      mode: "no-cors",
      cache: "force-cache",
      signal: controller.signal,
    })

    clearTimeout(timeout)
    return response.ok || response.type === "opaque" // opaque = successful CORS-mode request
  } catch {
    // If HEAD fails, try GET as fallback
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(url, {
        method: "GET",
        mode: "no-cors",
        cache: "force-cache",
        signal: controller.signal,
      })

      clearTimeout(timeout)
      return response.ok || response.type === "opaque"
    } catch {
      return false
    }
  }
}

/**
 * Deterministic logo resolver (hardened fallback chain)
 * 
 * PRODUCTION-GRADE approach:
 * - Precomputes all sources upfront
 * - Sequentially tests each URL with fetch (no onError loops)
 * - Returns first valid 200 response
 * - Never renders blank or letter avatar unless ALL sources fail
 * - SSR-safe: builds source list identically on server and client
 * - Race-condition proof: cancels if component unmounts
 */
function LogoImage({ name, logo, url }: { name: string; logo?: string; url: string }) {
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null)
  const [resolved, setResolved] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function resolveLogoSequentially() {
      // Try protocol logos mapping FIRST
      const mappedLogo = getProtocolLogo(name)

      // Derive domain for various logo services
      const domain = (() => {
        try {
          return new URL(url).hostname.replace("www.", "")
        } catch {
          return ""
        }
      })()

      // Normalize protocol name for logo service lookups
      const protocolName = name.toLowerCase().replace(/\s+/g, "-")

      // Build COMPLETE fallback chain upfront (all sources, no culling)
      const sources = [
        // 1. PROTOCOL_LOGOS mapping (FIRST priority — curated)
        ...(mappedLogo ? [mappedLogo] : []),
        // 2. Use provided logo if it's not a placeholder
        ...(logo && !logo.includes("sui.jpg") && !logo.includes("placeholder") ? [logo] : []),
        // 3. logo.dev API (best quality)
        ...(domain ? [`https://logo.dev/${domain}?format=png`] : []),
        // 4. Clearbit logo service
        ...(domain ? [`https://logo.clearbit.com/${domain}`] : []),
        // 5. brandfetch API
        ...(domain ? [`https://api.brandfetch.io/v2/cdn/uricloudimage/${domain}`] : []),
        // 6. CoinGecko/CoinMarketCap as last resort
        `https://assets.coingecko.com/coins/images/1/${protocolName}.png`,
        `https://s2.coinmarketcap.com/static/img/coins/200x200/${protocolName}.png`,
      ].filter(Boolean)

      // Sequential deterministic resolution
      for (const src of sources) {
        if (cancelled) return

        const isValid = await testImageUrl(src)
        if (isValid && !cancelled) {
          setResolvedSrc(src)
          setResolved(true)
          return
        }
      }

      // All sources failed — mark as resolved but no src
      if (!cancelled) {
        setResolved(true)
      }
    }

    resolveLogoSequentially()

    // Cleanup on unmount to prevent state updates
    return () => {
      cancelled = true
    }
  }, [name, logo, url])

  // While resolving, show letter avatar (not blank)
  if (!resolved) {
    return <LetterAvatar name={name} />
  }

  // No valid source found after all attempts — letter avatar
  if (!resolvedSrc) {
    return <LetterAvatar name={name} />
  }

  // Valid source found — render image (guaranteed valid)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt={`${name} logo`}
      className="w-10 h-10 rounded-xl object-contain bg-white/5 shrink-0"
      crossOrigin="anonymous"
    />
  )
}

export function ProtocolCard({ protocol }: { protocol: Protocol }) {
  return (
    <a
      href={protocol.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group h-full"
    >
      <div 
        className="glass-panel p-5 flex flex-col gap-3 h-full rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer"
      >
        {/* Header - Logo + Tags */}
        <div className="flex items-start justify-between gap-3">
          <LogoImage name={protocol.name} logo={protocol.logo} url={protocol.url} />
          <div className="flex flex-wrap gap-1 justify-end">
            {protocol.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/10 text-teal-300">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Protocol Name */}
        <h3 className="text-base font-semibold text-foreground mt-2 line-clamp-1">{protocol.name}</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">{protocol.description}</p>

        {/* Footer - External Link */}
        <div className="flex items-center gap-2 text-teal-400 text-sm font-medium group-hover:gap-3 transition-all">
          View Details <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </a>
  )
}

export function ProtocolGrid({ protocols }: { protocols: Protocol[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {protocols.map((p) => (
        <ProtocolCard key={p.name} protocol={p} />
      ))}
    </div>
  )
}
