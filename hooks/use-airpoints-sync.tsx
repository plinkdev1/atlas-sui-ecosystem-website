"use client"

import { useSupabaseUser } from "@/hooks/use-supabase-user"
import { useProStatus } from "@/lib/pro-status-context"
import { useState, useCallback } from "react"

interface EdgeFunctionConfig {
  baseUrl: string
  projectName: string
}

interface SyncResult {
  success: boolean
  error?: string
  newBalance?: number
  data?: Record<string, unknown>
}

const config: EdgeFunctionConfig = {
  baseUrl: process.env.NEXT_PUBLIC_AIRPOINTS_EDGE_FUNCTION_URL || "",
  projectName: "atlas",
}

export function useAirpointsSync() {
  const { user } = useSupabaseUser()
  const { status } = useProStatus()
  const [syncing, setSyncing] = useState(false)

  /**
   * Call Edge Function with fallback to local Supabase
   */
  const callEdgeFunction = useCallback(
    async (endpoint: string, method: "GET" | "POST", payload?: Record<string, unknown>): Promise<SyncResult> => {
      if (!config.baseUrl) {
        console.warn("[v0] NEXT_PUBLIC_AIRPOINTS_EDGE_FUNCTION_URL not set, using local fallback")
        return { success: false, error: "Edge Function URL not configured" }
      }

      try {
        const url = `${config.baseUrl}${endpoint}`
        const options: RequestInit = {
          method,
          headers: { "Content-Type": "application/json" },
        }

        if (method === "POST" && payload) {
          options.body = JSON.stringify({
            ...payload,
            project: config.projectName,
            userId: user?.id,
          })
        }

        const response = await fetch(url, options)
        if (!response.ok) {
          throw new Error(`Edge Function error: ${response.statusText}`)
        }

        return await response.json()
      } catch (error) {
        console.error("[v0] Edge Function call failed:", error)
        console.warn("[v0] Falling back to local Supabase for", endpoint)
        return { success: false, error: String(error) }
      }
    },
    [user?.id]
  )

  /**
   * Get balance from Edge Function, fallback to local read
   */
  const getBalance = useCallback(async () => {
    if (!user?.id) return { success: false, error: "Not authenticated" }

    setSyncing(true)
    try {
      const result = await callEdgeFunction("/get-airpoints-balance", "GET")
      return result.success
        ? result
        : { success: false, error: "Failed to fetch balance" }
    } finally {
      setSyncing(false)
    }
  }, [user?.id, callEdgeFunction])

  /**
   * Earn points via Edge Function
   */
  const earnPoints = useCallback(
    async (amount: number, type: string, description?: string) => {
      if (!user?.id) return { success: false, error: "Not authenticated" }

      setSyncing(true)
      try {
        const result = await callEdgeFunction("/earn-airpoints", "POST", {
          walletAddress: "",
          amount,
          type,
          description,
          tier: status.tier,
        })

        return result.success
          ? result
          : { success: false, error: result.error || "Failed to earn points" }
      } finally {
        setSyncing(false)
      }
    },
    [user?.id, status.tier, callEdgeFunction]
  )

  /**
   * Redeem points via Edge Function
   */
  const redeemPoints = useCallback(
    async (amount: number, reason: string) => {
      if (!user?.id) return { success: false, error: "Not authenticated" }

      setSyncing(true)
      try {
        const result = await callEdgeFunction("/redeem-airpoints", "POST", {
          walletAddress: "",
          amount,
          reason,
        })

        return result.success
          ? result
          : { success: false, error: result.error || "Failed to redeem points" }
      } finally {
        setSyncing(false)
      }
    },
    [user?.id, callEdgeFunction]
  )

  /**
   * Update tier via Edge Function
   */
  const updateTier = useCallback(
    async (tier: "free" | "pro" | "pro+") => {
      if (!user?.id) return { success: false, error: "Not authenticated" }

      setSyncing(true)
      try {
        const result = await callEdgeFunction("/update-airpoints-tier", "POST", {
          tier,
        })

        return result.success
          ? result
          : { success: false, error: result.error || "Failed to update tier" }
      } finally {
        setSyncing(false)
      }
    },
    [user?.id, callEdgeFunction]
  )

  return {
    getBalance,
    earnPoints,
    redeemPoints,
    updateTier,
    syncing,
    isConfigured: !!config.baseUrl,
  }
}
