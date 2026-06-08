"use client"

import React from "react"

import Link from "next/link"
import { useProStatus } from "@/lib/pro-status-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Lock, Zap, Crown } from "lucide-react"

interface ProFeatureGateProps {
  feature: string
  tier?: "pro" | "pro+"
  children: React.ReactNode
  locked?: boolean
}

export function ProFeatureGate({ feature, tier = "pro", children, locked = false }: ProFeatureGateProps) {
  const { status } = useProStatus()

  const isUnlocked =
    !locked && (status.isPro && (tier === "pro" ? status.tier !== "free" : status.tier === "pro+"))

  if (isUnlocked) {
    return <>{children}</>
  }

  if (locked) {
    return (
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">{feature} is a Pro Feature</h3>
            <p className="text-sm text-blue-800 dark:text-blue-300">Upgrade to {tier === "pro+" ? "Pro+" : "Pro"} to unlock advanced capabilities</p>
          </div>
          <Link href="/pro-upgrade" className="flex-shrink-0">
            <Button className="bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white gap-2 whitespace-nowrap">
              <Crown className="w-4 h-4" />
              Upgrade Now
            </Button>
          </Link>
        </div>
      </Card>
    )
  }

  return <>{children}</>
}

interface ProLockIconProps {
  tier?: "pro" | "pro+"
  className?: string
}

export function ProLockIcon({ tier = "pro", className = "w-4 h-4" }: ProLockIconProps) {
  const { status } = useProStatus()
  const isLocked = status.isPro === false || (tier === "pro+" && status.tier !== "pro+")

  if (!isLocked) return null

  return <Lock className={`${className} text-blue-600 dark:text-blue-400 inline-block ml-1`} />
}

export function ProBoost({ feature, boost }: { feature: string; boost: string }) {
  const { status } = useProStatus()

  if (!status.isPro) return null

  return (
    <span className="inline-block ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
      <Zap className="w-3 h-3 inline mr-1" />
      {boost}
    </span>
  )
}
