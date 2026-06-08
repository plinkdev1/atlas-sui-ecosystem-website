"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import type { FooterAd } from "@/lib/ads-data"

interface AdCarouselProps {
  ads?: FooterAd[]
}

export function AdCarousel({ ads: initialAds }: AdCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [ads, setAds] = useState<FooterAd[]>(initialAds || [])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch("/api/ads")
        if (res.ok) {
          const data = await res.json()
          setAds(
            data.ads.map((ad: FooterAd) => ({
              id: ad.id,
              title: ad.title,
              tagline: ad.tagline,
              imageUrl: ad.imageUrl,
              linkUrl: ad.linkUrl,
              ctaText: ad.ctaText,
              active: ad.active,
              createdAt: new Date(ad.createdAt),
            }))
          )
        }
      } catch (error) {
        console.error("[v0] Failed to fetch ads:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAds()
    const refresh = setInterval(fetchAds, 30000)
    return () => clearInterval(refresh)
  }, [])

  useEffect(() => {
    if (!isAutoPlay || ads.length === 0) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlay, ads.length])

  const goToPrevious = () => { setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length); setIsAutoPlay(false) }
  const goToNext = () => { setCurrentIndex((prev) => (prev + 1) % ads.length); setIsAutoPlay(false) }
  const goToSlide = (i: number) => { setCurrentIndex(i); setIsAutoPlay(false) }

  if (isLoading || !ads.length) return null

  const ad = ads[currentIndex]
  if (!ad) return null

  return (
    <div className="relative w-full">
      {/* Card */}
      <div className="relative overflow-hidden rounded-2xl border border-[rgba(43,127,255,0.2)] bg-background/60 backdrop-blur-sm shadow-lg group">
        {/* Background image with overlay */}
        {ad.imageUrl && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-700"
              style={{ backgroundImage: `url(${ad.imageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40" />
          </>
        )}
        {!ad.imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] to-[#0d1e36]" />
        )}

        {/* Content */}
        <div className="relative z-10 flex items-center justify-between px-6 md:px-10 py-6 gap-6">
          {/* Sponsor tag */}
          <div className="absolute top-3 right-4">
            <span className="text-[10px] font-medium text-white/50 uppercase tracking-widest">Sponsored</span>
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="text-base md:text-lg font-bold text-white text-balance">{ad.title}</h3>
            <p className="text-sm text-white/70">{ad.tagline}</p>
          </div>

          <a
            href={ad.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2B7FFF] hover:bg-[#1a6eee] text-white text-sm font-semibold transition-colors shadow-md"
          >
            {ad.ctaText}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Prev/Next arrows */}
        {ads.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              aria-label="Previous ad"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>
            <button
              onClick={goToNext}
              aria-label="Next ad"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Dot indicators */}
      {ads.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to ad ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-6 bg-[#2B7FFF]"
                  : "w-1.5 bg-muted hover:bg-[#2B7FFF]/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
