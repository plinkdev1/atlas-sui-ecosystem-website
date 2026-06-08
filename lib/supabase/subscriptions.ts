import { createServerClient } from "@/lib/supabase/server"
import { SUBSCRIPTION_GRACE_PERIOD_DAYS } from "@/types/subscription"

export interface Subscription {
  id: string
  user_id: string
  tier: "free" | "pro" | "pro+"
  status: "active" | "expired" | "canceled" | "grace_period"
  expiry: string | null
  created_at: string
  updated_at: string
}

export interface SubscriptionHistoryEvent {
  id: string
  user_id: string
  event_type: "created" | "renewed" | "canceled" | "upgraded" | "downgraded"
  tier: "free" | "pro" | "pro+"
  previous_tier: "free" | "pro" | "pro+" | null
  duration_days: number | null
  timestamp: string
}

/**
 * Get user's current subscription from Supabase
 */
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("[v0] Error fetching subscription:", error)
      return null
    }

    return data || null
  } catch (error) {
    console.error("[v0] Exception fetching subscription:", error)
    return null
  }
}

/**
 * Create or update subscription (admin/server action)
 */
export async function updateSubscription(
  userId: string,
  tier: "free" | "pro" | "pro+",
  expiryDays: number = 30,
): Promise<Subscription | null> {
  try {
    const supabase = await createServerClient()
    const expiry = new Date()
    expiry.setDate(expiry.getDate() + expiryDays)

    const { data, error } = await supabase
      .from("subscriptions")
      .upsert(
        {
          user_id: userId,
          tier,
          status: "active",
          expiry: expiry.toISOString(),
        },
        { onConflict: "user_id" },
      )
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating subscription:", error)
      return null
    }

    // Log the event
    await logSubscriptionEvent(userId, tier === "free" ? "canceled" : "renewed", tier, expiryDays)

    return data || null
  } catch (error) {
    console.error("[v0] Exception updating subscription:", error)
    return null
  }
}

/**
 * Cancel subscription (set to free tier)
 */
export async function cancelSubscription(userId: string): Promise<Subscription | null> {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("subscriptions")
      .update({
        tier: "free",
        status: "canceled",
        expiry: null,
      })
      .eq("user_id", userId)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error canceling subscription:", error)
      return null
    }

    // Log the event
    await logSubscriptionEvent(userId, "canceled", "free", null)

    return data || null
  } catch (error) {
    console.error("[v0] Exception canceling subscription:", error)
    return null
  }
}

/**
 * Log subscription event to history table
 */
export async function logSubscriptionEvent(
  userId: string,
  eventType: "created" | "renewed" | "canceled" | "upgraded" | "downgraded",
  tier: "free" | "pro" | "pro+",
  durationDays: number | null = null,
): Promise<boolean> {
  try {
    const supabase = await createServerClient()

    // Get previous tier for upgrade/downgrade events
    let previousTier: "free" | "pro" | "pro+" | null = null
    if (eventType === "upgraded" || eventType === "downgraded") {
      const current = await getUserSubscription(userId)
      previousTier = current?.tier || null
    }

    const { error } = await supabase.from("subscription_history").insert({
      user_id: userId,
      event_type: eventType,
      tier,
      previous_tier: previousTier,
      duration_days: durationDays,
    })

    if (error) {
      console.error("[v0] Error logging subscription event:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Exception logging subscription event:", error)
    return false
  }
}

/**
 * Get subscription history for user
 */
export async function getUserSubscriptionHistory(userId: string): Promise<SubscriptionHistoryEvent[]> {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("subscription_history")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false })
      .limit(50)

    if (error) {
      console.error("[v0] Error fetching subscription history:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("[v0] Exception fetching subscription history:", error)
    return []
  }
}

/**
 * Check if subscription is truly expired (including grace period)
 */
export function isSubscriptionExpired(subscription: Subscription | null): boolean {
  if (!subscription || !subscription.expiry) return true
  const now = new Date()
  const expiry = new Date(subscription.expiry)

  // Add grace period to calculated expiry
  const graceExpiry = new Date(expiry)
  graceExpiry.setDate(graceExpiry.getDate() + SUBSCRIPTION_GRACE_PERIOD_DAYS)

  return graceExpiry < now
}

/**
 * Check if user is currently in grace period
 */
export function isInGracePeriod(subscription: Subscription | null): boolean {
  if (!subscription || !subscription.expiry) return false
  const now = new Date()
  const expiry = new Date(subscription.expiry)
  const graceExpiry = new Date(expiry)
  graceExpiry.setDate(graceExpiry.getDate() + SUBSCRIPTION_GRACE_PERIOD_DAYS)

  return now > expiry && now <= graceExpiry
}

/**
 * Get days remaining until expiry
 */
export function getDaysRemaining(subscription: Subscription | null): number {
  if (!subscription || !subscription.expiry) return 0
  const now = new Date()
  const expiry = new Date(subscription.expiry)
  const diffTime = expiry.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}
