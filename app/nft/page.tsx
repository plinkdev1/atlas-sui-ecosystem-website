"use client"

import { useEffect } from "react"
import { ArrowUpRight } from "lucide-react"

export default function NFTRedirect() {
  useEffect(() => {
    window.location.href = "https://app.atlasprotocol.space"
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center section-gradient-blue relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
      <div className="relative z-10 text-center space-y-8 max-w-md px-4">
        <div className="flex justify-center">
          <div className="icon-badge" style={{ width: "4rem", height: "4rem", borderRadius: "1rem" }}>
            <ArrowUpRight className="w-6 h-6 text-[#2B7FFF]" />
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Redirecting</p>
          <h1 className="heading-hero">Taking You to Atlas App</h1>
          <p className="text-subtitle">This feature has moved to app.atlasprotocol.space</p>
        </div>
        <a
          href="https://app.atlasprotocol.space"
          className="button-primary-modern inline-flex items-center gap-2 justify-center"
        >
          Go to App
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </main>
  )
}
