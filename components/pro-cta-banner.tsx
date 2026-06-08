"use client"

import { useProStatus } from "@/lib/pro-status-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Crown, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ProCTABannerProps {
  title?: string
  description?: string
  variant?: "minimal" | "full" | "inline"
  dismissible?: boolean
}

export function ProCTABanner({
  title = "Ready for more?",
  description = "Upgrade to Pro to unlock unlimited features, auto-rules, smart alerts, and earn 3x Airpoints.",
  variant = "full",
  dismissible = true,
}: ProCTABannerProps) {
  const { status } = useProStatus()
  const [dismissed, setDismissed] = useState(false)

  // Don't show if already Pro
  if (status.isPro || dismissed) {
    return null
  }

  if (variant === "minimal") {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Crown className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <span className="text-sm font-medium text-blue-900 dark:text-blue-200">{title}</span>
        </div>
        <Link href="/pro-upgrade">
          <Button size="sm" className="bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white">
            Upgrade
          </Button>
        </Link>
        {dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    )
  }

  if (variant === "inline") {
    return (
      <Link href="/pro-upgrade" className="inline-block">
        <Button
          size="sm"
          className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-500 dark:to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white gap-2"
        >
          <Crown className="w-4 h-4" />
          Upgrade to Pro
        </Button>
      </Link>
    )
  }

  // Full variant (default)
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-500 dark:to-blue-600 rounded-lg p-6 sm:p-8 text-white relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-6 h-6" />
              <h3 className="text-xl sm:text-2xl font-bold">{title}</h3>
            </div>
            <p className="text-sm sm:text-base text-blue-100 dark:text-blue-100 max-w-md">
              {description}
            </p>
          </div>
          {dismissible && (
            <button
              onClick={() => setDismissed(true)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/pro-upgrade" className="flex-1">
            <Button className="w-full bg-white text-blue-600 dark:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-50">
              Upgrade Now
            </Button>
          </Link>
          <Button variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Simple CTA banner for use in feature gates
 */
export function ProFeatureUpsell({
  title = "Unlock with Pro",
  description = "Upgrade to Pro to access this feature",
}: {
  title?: string
  description?: string
}) {
  const { status } = useProStatus()

  if (status.isPro) return null

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <Crown className="w-8 h-8 text-blue-500 dark:text-blue-500 mb-3" />
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">{description}</p>
      <Link href="/pro-upgrade">
        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-500 dark:to-blue-600 text-white">
          Upgrade to Pro
        </Button>
      </Link>
    </div>
  )
}
