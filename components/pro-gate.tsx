"use client"

import { type ReactNode } from "react"
import { useProStatus } from "@/lib/pro-status-context"
import { ProLock } from "@/components/pro-lock"
import { cn } from "@/lib/utils"

interface ProGateProps {
  children: ReactNode
  feature?: string
  fallback?: ReactNode
  blur?: boolean
  className?: string
}

/**
 * ProGate: Conditionally gate content based on Pro status
 * Shows lock overlay if not pro, otherwise shows content
 */
export function ProGate({
  children,
  feature = "This feature",
  fallback,
  blur = true,
  className,
}: ProGateProps) {
  const { status } = useProStatus()

  if (status.isPro) {
    return <>{children}</>
  }

  return (
    <div className={cn("relative", className)}>
      <div className={cn("transition-all", blur && "blur-sm opacity-50")}>
        {children}
      </div>
      {fallback ? (
        fallback
      ) : (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2 text-center">
            <ProLock size="lg" tooltip={`${feature} requires Pro`} />
            <p className="text-xs font-medium text-foreground/70">
              {feature} requires Pro
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

interface ProButtonProps {
  children: ReactNode
  className?: string
  onUpgradeClick?: () => void
}

/**
 * ProButton: Disabled button that triggers upgrade when clicked
 */
export function ProButton({ children, className, onUpgradeClick }: ProButtonProps) {
  const { status } = useProStatus()

  if (status.isPro) {
    return <>{children}</>
  }

  return (
    <div
      className={cn(
        "group relative inline-block",
        className,
      )}
      onClick={onUpgradeClick}
    >
      {children}
      <div
        className={cn(
          "absolute inset-0 rounded-md opacity-0 transition-opacity group-hover:opacity-100",
          "bg-black/10 dark:bg-white/10 flex items-center justify-center",
          "cursor-not-allowed",
        )}
      >
        <ProLock size="sm" />
      </div>
    </div>
  )
}

interface ProFeatureProps {
  children: ReactNode
  tier?: "pro" | "pro+"
  message?: string
  onUnlock?: () => void
}

/**
 * ProFeature: Wrapper for Pro-only features with upgrade prompt
 */
export function ProFeature({
  children,
  tier = "pro",
  message = "Unlock with Pro",
  onUnlock,
}: ProFeatureProps) {
  const { status } = useProStatus()

  if (status.isPro && (tier === "pro" || status.tier === "pro+")) {
    return <>{children}</>
  }

  return (
    <div
      className={cn(
        "relative rounded-lg border-2 border-dashed",
        "border-blue-300 dark:border-blue-500/40",
        "p-4 text-center",
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <ProLock size="lg" />
        <div>
          <p className="font-semibold text-foreground">{message}</p>
          <p className="text-sm text-foreground/70">
            {tier === "pro+" ? "Pro+ only" : "Pro feature"}
          </p>
        </div>
        <button
          onClick={onUnlock}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium",
            "bg-blue-500 text-white hover:bg-blue-600",
            "dark:bg-blue-600 dark:hover:bg-blue-700",
            "transition-colors",
          )}
        >
          Upgrade Now
        </button>
      </div>
    </div>
  )
}

/**
 * ProBanner: Sticky banner showing Pro status
 */
export function ProBanner() {
  const { status } = useProStatus()

  if (status.isPro) {
    const daysLeft = status.expiry
      ? Math.ceil((status.expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null

    return (
      <div
        className={cn(
          "py-2 px-4 text-center text-sm font-medium rounded-md",
          "bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-200",
        )}
      >
        ✨ {status.tier === "pro+" ? "Pro+ Active" : "Pro Active"}
        {daysLeft && daysLeft > 0 && ` • ${daysLeft} days left`}
      </div>
    )
  }

  return null
}
