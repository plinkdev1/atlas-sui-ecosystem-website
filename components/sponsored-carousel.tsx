'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SponsoredPartner {
  id: string
  name: string
  tagline: string
  logo_url: string
  website: string
  chains?: string[]
}

export function SponsoredCarousel() {
  const [partners, setPartners] = useState<SponsoredPartner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/advertising/partners')
      const data = await res.json()
      setPartners(data)
    } catch (error) {
      console.error('Failed to fetch sponsored partners:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (partners.length === 0) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % partners.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [partners.length])

  if (loading) {
    return <div className="h-64 bg-background/50 rounded-2xl animate-pulse" />
  }

  if (partners.length === 0) {
    return null
  }

  const partner = partners[currentIndex]

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + partners.length) % partners.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % partners.length)
  }

  return (
    <div className="w-full space-y-6">
      {/* Main Carousel */}
      <div className="relative">
        <div className="card-modern-blue rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 min-h-[200px]">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src={partner.logo_url}
              alt={partner.name}
              className="w-20 h-20 rounded-2xl object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-3 text-center md:text-left">
            <h3 className="heading-section !text-xl">{partner.name}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{partner.tagline}</p>
            {partner.chains && partner.chains.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {partner.chains.map((chain) => (
                  <span
                    key={chain}
                    className="px-2 py-0.5 rounded-full glass-panel text-xs text-muted-foreground"
                  >
                    {chain}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* CTA Button */}
          <a
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            className="button-primary-modern flex-shrink-0 inline-block"
          >
            Visit Partner
          </a>
        </div>

        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 md:-translate-x-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Previous partner"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 md:translate-x-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Next partner"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dot Indicators */}
      {partners.length > 1 && (
        <div className="flex justify-center gap-2">
          {partners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-[#2B7FFF]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to partner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
