"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { getOrCreateBalance, updateAirpointsTier, addAirpoints } from "@/lib/supabase/airpoints"

export type ProTier = "free" | "pro" | "pro+"

export interface ProStatus {
  isPro: boolean
  tier: ProTier
  expiry: Date | null
}

interface ProContextType {
  status: ProStatus
  upgradeToPro: (tier?: ProTier, expiryDays?: number) => Promise<void>
  downgradeToFree: () => Promise<void>
  isLoading: boolean
}

export const ProContext = createContext<ProContextType | undefined>(undefined)

const DEFAULT_STATUS: ProStatus = {
  isPro: false,
  tier: "free",
  expiry: null,
}

const STORAGE_KEY = "proStatus"

export function ProProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ProStatus>(DEFAULT_STATUS)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  // Get current user
  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user || null)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Load subscription status on mount and when user changes
  useEffect(() => {
    const loadProStatus = async () => {
      setIsLoading(true)

      // If user is authenticated, fetch from Supabase
      if (user?.id) {
        try {
          const supabase = createClient()
          const { data, error } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .single()

          if (error && error.code !== "PGRST116") {
            console.error("[v0] Error fetching subscription:", error)
          }

          if (data) {
            // Check if subscription is expired
            const expireDate = new Date(data.expiry)
            const now = new Date()

            if (data.status === "active" && expireDate > now) {
              setStatus({
                isPro: true,
                tier: data.tier,
                expiry: expireDate,
              })
              // Sync to localStorage as backup
              localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                  isPro: true,
                  tier: data.tier,
                  expiry: expireDate.toISOString(),
                })
              )
            } else {
              // Subscription expired or inactive
              setStatus(DEFAULT_STATUS)
              localStorage.removeItem(STORAGE_KEY)
            }
          } else {
            // No subscription record, try localStorage fallback
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
              const parsed = JSON.parse(stored)
              const expireDate = new Date(parsed.expiry)
              const now = new Date()
              if (expireDate > now) {
                setStatus(parsed)
              } else {
                setStatus(DEFAULT_STATUS)
                localStorage.removeItem(STORAGE_KEY)
              }
            } else {
              setStatus(DEFAULT_STATUS)
            }
          }
        } catch (error) {
          console.error("[v0] Exception loading Pro status:", error)
          // Fallback to localStorage
          const stored = localStorage.getItem(STORAGE_KEY)
          if (stored) {
            const parsed = JSON.parse(stored)
            const expireDate = new Date(parsed.expiry)
            const now = new Date()
            if (expireDate > now) {
              setStatus(parsed)
            } else {
              setStatus(DEFAULT_STATUS)
              localStorage.removeItem(STORAGE_KEY)
            }
          }
        }
      } else {
        // Non-authenticated user: use localStorage fallback
        try {
          const stored = localStorage.getItem(STORAGE_KEY)
          if (stored) {
            const parsed = JSON.parse(stored)
            const expireDate = new Date(parsed.expiry)
            const now = new Date()
            if (expireDate > now) {
              setStatus(parsed)
            } else {
              setStatus(DEFAULT_STATUS)
              localStorage.removeItem(STORAGE_KEY)
            }
          }
        } catch (error) {
          console.error("[v0] Failed to load Pro status from localStorage:", error)
        }
      }

      setIsLoading(false)
    }

    loadProStatus()
  }, [user?.id])

  const upgradeToPro = useCallback(
    async (tier: ProTier = "pro", expiryDays: number = 30) => {
      const expiry = new Date()
      expiry.setDate(expiry.getDate() + expiryDays)

      const newStatus: ProStatus = {
        isPro: true,
        tier,
        expiry,
      }

      // If authenticated, save to Supabase and sync Airpoints
      if (user?.id) {
        try {
          const supabase = createClient()
          const { error } = await supabase.from("subscriptions").upsert(
            {
              user_id: user.id,
              tier,
              status: "active",
              expiry: expiry.toISOString(),
            },
            { onConflict: "user_id" }
          )

          if (error) {
            console.error("[v0] Error upgrading subscription:", error)
          }

          // Sync Airpoints: Update tier and credit initial points
          try {
            // Ensure Airpoints balance exists
            await getOrCreateBalance(user.id)

            // Update tier in Airpoints
            await updateAirpointsTier(user.id, tier)

            // Credit initial points based on tier
            const initialPoints = tier === "pro+" ? 300 : tier === "pro" ? 100 : 0
            if (initialPoints > 0) {
              await addAirpoints(user.id, "", initialPoints, "earn_subscription", `Initial ${tier.toUpperCase()} bonus points`)
            }

            console.log(`[v0] Airpoints synced: tier=${tier}, credited=${initialPoints} pts`)
          } catch (airpointsError) {
            console.error("[v0] Exception syncing Airpoints:", airpointsError)
            // Don't block subscription on Airpoints sync error
          }
        } catch (error) {
          console.error("[v0] Exception upgrading subscription:", error)
        }
      }

      // Always update local state and localStorage
      setStatus(newStatus)
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isPro: true,
          tier,
          expiry: expiry.toISOString(),
        })
      )
    },
    [user?.id]
  )

  const downgradeToFree = useCallback(async () => {
    // If authenticated, update Supabase and sync Airpoints
    if (user?.id) {
      try {
        const supabase = createClient()
        const { error } = await supabase
          .from("subscriptions")
          .update({ tier: "free", status: "canceled" })
          .eq("user_id", user.id)

        if (error) {
          console.error("[v0] Error downgrading subscription:", error)
        }

        // Sync Airpoints: Update tier to free (keeps existing balance)
        try {
          await updateAirpointsTier(user.id, "free")
          console.log("[v0] Airpoints synced to free tier")
        } catch (airpointsError) {
          console.error("[v0] Exception syncing Airpoints on downgrade:", airpointsError)
          // Don't block downgrade on Airpoints sync error
        }
      } catch (error) {
        console.error("[v0] Exception downgrading subscription:", error)
      }
    }

    // Update local state and localStorage
    setStatus(DEFAULT_STATUS)
    localStorage.removeItem(STORAGE_KEY)
  }, [user?.id])

  return (
    <ProContext.Provider value={{ status, upgradeToPro, downgradeToFree, isLoading }}>
      {children}
    </ProContext.Provider>
  )
}

export function useProStatus() {
  const context = useContext(ProContext)
  if (!context) {
    throw new Error("useProStatus must be used within ProProvider")
  }
  return context
}
