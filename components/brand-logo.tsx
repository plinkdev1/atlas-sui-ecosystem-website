"use client"

import { useState } from "react"
import { getMonogramFallback, getBrandLogoFallbacks } from "@/lib/brand-logos-client"

interface BrandLogoProps {
  name: string
  logoUrl: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
}

export function BrandLogo({ name, logoUrl, size = "md", className = "" }: BrandLogoProps) {
  const [hasError, setHasError] = useState(false)
  const [fallbackIndex, setFallbackIndex] = useState(0)
  const sizeClass = sizeMap[size]
  const monogram = getMonogramFallback(name)
  const fallbacks = getBrandLogoFallbacks(name)

  const handleError = () => {
    if (fallbacks.length > fallbackIndex) {
      setFallbackIndex(fallbackIndex + 1)
    } else {
      setHasError(true)
    }
  }

  let currentUrl: string | undefined = logoUrl
  if (fallbackIndex > 0 && fallbacks.length > 0) {
    currentUrl = fallbacks[Math.min(fallbackIndex - 1, fallbacks.length - 1)] || logoUrl
  }

  if (!logoUrl && fallbacks.length > 0) {
    currentUrl = fallbacks[0] || "/placeholder.svg"
  }

  if (hasError) {
    return (
      <div
        className={`${sizeClass} ${className} flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 text-xs font-bold text-primary dark:from-primary/25 dark:to-primary/15`}
        title={name}
      >
        {monogram}
      </div>
    )
  }

  return (
    <div
      className={`${sizeClass} ${className} flex items-center justify-center rounded-lg bg-muted/40 border border-border/50 overflow-hidden`}
      title={name}
    >
      <img
        src={currentUrl || "/placeholder.svg"}
        alt={`${name} logo`}
        className="w-full h-full object-contain"
        onError={handleError}
        loading="lazy"
        crossOrigin="anonymous"
      />
    </div>
  )
}
