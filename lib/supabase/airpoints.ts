"use server"

import { createServerClient } from "@/lib/supabase/server"

export interface AirpointsBalance {
  id: string
  user_id: string
  wallet_address: string
  balance: number
  tier: "free" | "pro" | "pro+"
  last_earned: string | null
  last_updated: string
}

export interface AirpointsHistoryEvent {
  id: string
  user_id: string
  wallet_address: string
  amount: number
  type:
    | "earn_subscription"
    | "earn_cleanup"
    | "earn_explainer"
    | "earn_directory"
    | "redeem_discount"
    | "redeem_feature"
    | "convert_token"
  description: string | null
  timestamp: string
}

/**
 * Get user's Airpoints balance
 */
export async function getUserAirpointsBalance(userId: string): Promise<AirpointsBalance | null> {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("airpoints_balance")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("[v0] Error fetching airpoints balance:", error)
      return null
    }

    return data || null
  } catch (error) {
    console.error("[v0] Exception fetching airpoints balance:", error)
    return null
  }
}

/**
 * Get Airpoints by wallet address
 */
export async function getAirpointsByWallet(walletAddress: string): Promise<AirpointsBalance | null> {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("airpoints_balance")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("[v0] Error fetching airpoints by wallet:", error)
      return null
    }

    return data || null
  } catch (error) {
    console.error("[v0] Exception fetching airpoints by wallet:", error)
    return null
  }
}

/**
 * Initialize Airpoints balance for new user
 */
export async function initializeAirpointsBalance(
  userId: string,
  walletAddress: string,
  tier: "free" | "pro" | "pro+" = "free"
): Promise<AirpointsBalance | null> {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("airpoints_balance")
      .insert({
        user_id: userId,
        wallet_address: walletAddress,
        balance: 0,
        tier,
        last_earned: null,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error initializing airpoints balance:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("[v0] Exception initializing airpoints balance:", error)
    return null
  }
}

/**
 * Add Airpoints to user's balance and log transaction
 */
export async function addAirpoints(
  userId: string,
  walletAddress: string,
  amount: number,
  type: AirpointsHistoryEvent["type"],
  description?: string
): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  try {
    const supabase = await createServerClient()

    // Get current balance
    const { data: balance, error: balanceError } = await supabase
      .from("airpoints_balance")
      .select("balance")
      .eq("user_id", userId)
      .single()

    if (balanceError && balanceError.code !== "PGRST116") {
      return { success: false, error: "Failed to fetch current balance" }
    }

    const currentBalance = balance?.balance || 0
    const newBalance = currentBalance + amount

    // Update balance
    const { error: updateError } = await supabase
      .from("airpoints_balance")
      .update({
        balance: newBalance,
        last_earned: new Date().toISOString(),
      })
      .eq("user_id", userId)

    if (updateError) {
      return { success: false, error: "Failed to update balance" }
    }

    // Log to history
    await supabase.from("airpoints_history").insert({
      user_id: userId,
      wallet_address: walletAddress,
      amount,
      type,
      description,
    })

    return { success: true, newBalance }
  } catch (error) {
    console.error("[v0] Exception adding airpoints:", error)
    return { success: false, error: "Exception occurred while adding airpoints" }
  }
}

/**
 * Redeem Airpoints and log transaction
 */
export async function redeemAirpoints(
  userId: string,
  walletAddress: string,
  amount: number,
  type: "redeem_discount" | "redeem_feature",
  description?: string
): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  try {
    const supabase = await createServerClient()

    // Get current balance
    const { data: balance, error: balanceError } = await supabase
      .from("airpoints_balance")
      .select("balance")
      .eq("user_id", userId)
      .single()

    if (balanceError) {
      return { success: false, error: "Failed to fetch current balance" }
    }

    const currentBalance = balance?.balance || 0

    // Check if sufficient balance
    if (currentBalance < amount) {
      return { success: false, error: "Insufficient Airpoints balance" }
    }

    const newBalance = currentBalance - amount

    // Update balance
    const { error: updateError } = await supabase
      .from("airpoints_balance")
      .update({ balance: newBalance })
      .eq("user_id", userId)

    if (updateError) {
      return { success: false, error: "Failed to redeem airpoints" }
    }

    // Log to history (with negative amount)
    await supabase.from("airpoints_history").insert({
      user_id: userId,
      wallet_address: walletAddress,
      amount: -amount,
      type,
      description,
    })

    return { success: true, newBalance }
  } catch (error) {
    console.error("[v0] Exception redeeming airpoints:", error)
    return { success: false, error: "Exception occurred while redeeming airpoints" }
  }
}

/**
 * Update user tier and sync with balance
 */
export async function updateAirpointsTier(
  userId: string,
  tier: "free" | "pro" | "pro+"
): Promise<boolean> {
  try {
    const supabase = await createServerClient()

    const { error } = await supabase
      .from("airpoints_balance")
      .update({ tier })
      .eq("user_id", userId)

    if (error) {
      console.error("[v0] Error updating airpoints tier:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Exception updating airpoints tier:", error)
    return false
  }
}

/**
 * Get user's Airpoints history
 */
export async function getAirpointsHistory(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<AirpointsHistoryEvent[]> {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("airpoints_history")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("[v0] Error fetching airpoints history:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("[v0] Exception fetching airpoints history:", error)
    return []
  }
}

/**
 * Get total Airpoints earned by type
 */
export async function getAirpointsEarnedByType(
  userId: string,
  type: AirpointsHistoryEvent["type"]
): Promise<number> {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("airpoints_history")
      .select("amount")
      .eq("user_id", userId)
      .eq("type", type)
      .filter("amount", "gt", 0)

    if (error) {
      console.error("[v0] Error fetching airpoints earned by type:", error)
      return 0
    }

    return (data || []).reduce((sum, row) => sum + row.amount, 0)
  } catch (error) {
    console.error("[v0] Exception fetching airpoints earned by type:", error)
    return 0
  }
}

/**
 * Check and credit monthly Airpoints based on tier
 * If last_earned was >30 days ago, credit based on tier:
 * - Free: 0 pts
 * - Pro: 100 pts
 * - Pro+: 300 pts
 */
export async function getOrCreateBalance(
  userId: string,
  walletAddress: string = "",
  tier: "free" | "pro" | "pro+" = "free"
): Promise<AirpointsBalance | null> {
  try {
    // Try to get existing balance
    const existingBalance = await getUserAirpointsBalance(userId)
    if (existingBalance) {
      return existingBalance
    }

    // If doesn't exist, initialize it
    const newBalance = await initializeAirpointsBalance(userId, walletAddress || "", tier)
    return newBalance
  } catch (error) {
    console.error("[v0] Exception in getOrCreateBalance:", error)
    return null
  }
}

/**
 * Check and credit monthly Airpoints based on tier
 * If last_earned was >30 days ago, credit based on tier:
 * - Free: 0 pts
 * - Pro: 100 pts
 * - Pro+: 300 pts
 */
export async function creditMonthlyAirpoints(
  userId: string,
  tier: "free" | "pro" | "pro+"
): Promise<{ success: boolean; credited: boolean; amount?: number; error?: string }> {
  try {
    const supabase = await createServerClient()

    // Get current balance and last_earned
    const { data: balance, error: balanceError } = await supabase
      .from("airpoints_balance")
      .select("balance, last_earned, wallet_address")
      .eq("user_id", userId)
      .single()

    if (balanceError && balanceError.code !== "PGRST116") {
      return { success: false, credited: false, error: "Failed to fetch balance" }
    }

    const lastEarned = balance?.last_earned ? new Date(balance.last_earned) : null
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Check if eligible for monthly credit
    if (lastEarned && lastEarned > thirtyDaysAgo) {
      return { success: true, credited: false, error: "Already earned this month" }
    }

    // Determine earning amount based on tier
    const monthlyAmount = tier === "pro+" ? 300 : tier === "pro" ? 100 : 0

    // If free tier, don't credit
    if (monthlyAmount === 0) {
      return { success: true, credited: false }
    }

    // Add to balance
    const currentBalance = balance?.balance || 0
    const newBalance = currentBalance + monthlyAmount
    const walletAddress = balance?.wallet_address || ""

    const { error: updateError } = await supabase
      .from("airpoints_balance")
      .update({
        balance: newBalance,
        last_earned: now.toISOString(),
      })
      .eq("user_id", userId)

    if (updateError) {
      return { success: false, credited: false, error: "Failed to update balance" }
    }

    // Log to history
    await supabase.from("airpoints_history").insert({
      user_id: userId,
      wallet_address: walletAddress,
      amount: monthlyAmount,
      type: "earn_subscription",
      description: `Monthly ${tier.toUpperCase()} subscription bonus`,
    })

    return { success: true, credited: true, amount: monthlyAmount }
  } catch (error) {
    console.error("[v0] Exception crediting monthly airpoints:", error)
    return { success: false, credited: false, error: "Exception occurred" }
  }
}
