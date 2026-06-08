"use client"

import { useEffect } from "react"
import { Sparkles, ArrowUpRight } from "lucide-react"

const APP_URL = "https://app.atlasprotocol.space/pro"

export default function ProUpgradeRedirect() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = APP_URL
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center section-gradient-blue relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
      <div className="relative z-10 text-center space-y-8 max-w-md px-4">
        <div className="flex justify-center">
          <div className="icon-badge" style={{ width: "4rem", height: "4rem", borderRadius: "1rem" }}>
            <Sparkles className="w-6 h-6 text-[#2B7FFF]" />
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Redirecting</p>
          <h1 className="heading-hero">Upgrade to Atlas Pro</h1>
          <p className="text-subtitle">Pro subscriptions are managed at app.atlasprotocol.space</p>
        </div>
        <a
          href={APP_URL}
          className="button-primary-modern inline-flex items-center gap-2 justify-center"
        >
          Go to Pro Upgrade
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </main>
  )
}
