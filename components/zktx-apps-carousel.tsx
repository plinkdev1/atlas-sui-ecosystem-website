"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ZktxApp {
  id: string
  name: string
  description: string
  image: string
  url: string
}

const ZKTX_APPS: ZktxApp[] = [
  {
    id: "ptb-builder",
    name: "PTB Builder",
    description: "Connect your wallet to build or view PTBs",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PTB%20Builder-lY0Uzwf85kOOPS3QEhrTd3KMbZmTAE.png",
    url: "https://ptb.wal.app/",
  },
  {
    id: "notary",
    name: "Notary",
    description: "Your trusted source of truth for deployment verification",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Notary-3WbmjBCj6fEaFMy8Hdi545Gl9HEyoO.png",
    url: "https://notary.wal.app/",
  },
  {
    id: "playmove",
    name: "PlayMove",
    description: "A playground for Move - build and deploy to Sui in seconds",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PlayMove-MA0h5KDY6dMlaRAQWOJsdV36YJPcs6.png",
    url: "https://playmove.wal.app/",
  },
  {
    id: "sui-extension",
    name: "Sui VS Extension",
    description: "Visual Studio extension for Sui smart contract development",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sui%20VS%20Extension-EnuvOWRgBBoykl5EYOFkP63dBvLRnk.png",
    url: "https://marketplace.visualstudio.com/items?itemName=zktxio.sui-extension",
  },
  {
    id: "zktx-docs",
    name: "zktx Docs",
    description: "Move to OpenID Crypto - Comprehensive documentation and guides",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zktx%20io%20docs-dnMrdlNcw1p9eUz9RWS8cg6pIPhkDs.png",
    url: "https://docs.zktx.io/",
  },
]

export function ZktxAppsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    if (!isAutoplay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ZKTX_APPS.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoplay])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + ZKTX_APPS.length) % ZKTX_APPS.length)
    setIsAutoplay(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ZKTX_APPS.length)
    setIsAutoplay(false)
  }

  const currentApp = ZKTX_APPS[currentIndex]

  return (
    <div className="w-full bg-gradient-to-b from-blue-500/10 to-blue-500/5 rounded-lg p-6 border border-blue-500/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Featured Apps</h3>
        <p className="text-xs text-muted-foreground">
          {currentIndex + 1} of {ZKTX_APPS.length}
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative bg-background rounded-lg overflow-hidden border border-blue-500/20 mb-4">
        {/* App Image */}
        <div className="relative h-48 bg-gradient-to-br from-blue-950 to-blue-900">
          <img
            src={currentApp.image}
            alt={currentApp.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
          aria-label="Previous app"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
          aria-label="Next app"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* App Details */}
      <div className="space-y-3">
        <div>
          <h4 className="text-base font-semibold text-foreground">{currentApp.name}</h4>
          <p className="text-sm text-muted-foreground">{currentApp.description}</p>
        </div>

        {/* CTA Button */}
        <a
          href={currentApp.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
        >
          Explore
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Footer Attribution */}
      <div className="mt-4 pt-4 border-t border-blue-500/20">
        <p className="text-xs text-muted-foreground text-center">
          Built by{" "}
          <a
            href="https://linktr.ee/zktx_io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-400 font-medium"
          >
            zktx_io
          </a>
          . Check{" "}
          <a
            href="https://linktr.ee/zktx_io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-400 font-medium"
          >
            linktree
          </a>
        </p>
      </div>

      {/* Dot Indicators */}
      <div className="flex gap-2 justify-center mt-4">
        {ZKTX_APPS.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index)
              setIsAutoplay(false)
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-blue-500 w-6" : "bg-blue-500/40 hover:bg-blue-500/60"
            }`}
            aria-label={`Go to app ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
