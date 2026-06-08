"use client"

import { useState } from "react"
import { useSupabaseUser } from "@/hooks/use-supabase-user"
import { useProStatus } from "@/lib/pro-status-context"

interface EarnOptions {
  amount?: number
  type: "earn_subscription" | "earn_cleanup" | "earn_explainer" | "earn_directory" | "redeem_discount" | "redeem_feature" | "convert_token"
  description?: string
}

interface UseAirpointsEarnReturn {
  earn: (options: EarnOptions) => Promise<void>
  loading: boolean
  error: string | null
}

export function useAirpointsEarn(): UseAirpointsEarnReturn {
  const { user } = useSupabaseUser()
  const { status } = useProStatus()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Tier multipliers: Free=0x, Pro=1x, Pro+=3x
  const tierMultiplier = status.tier === "pro+" ? 3 : status.tier === "pro" ? 1 : 0

  const earn = async (options: EarnOptions) => {
    if (!user?.id) {
      setError("Not authenticated")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Calculate points based on tier multiplier
      const baseAmount = options.amount || 0
      const finalAmount = baseAmount * tierMultiplier

      const response = await fetch("/api/airpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "earn",
          userId: user.id,
          amount: finalAmount,
          type: options.type,
          description: options.description || "",
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to earn Airpoints")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      console.error("[v0] Airpoints earn error:", err)
    } finally {
      setLoading(false)
    }
  }

  return { earn, loading, error }
}
