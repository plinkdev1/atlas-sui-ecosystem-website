import { createServerClient } from "@/lib/supabase/server"
import { Subscription, SubscriptionHistory } from "@/types/database"

/**
 * Get user's current subscription
 */
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
    const supabase = await createServerClient()
    const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .single()

    if (error && error.code !== "PGRST116") {
        console.error("[db/subscriptions] Error fetching subscription:", error)
        return null
    }
    return data || null
}

/**
 * Update user subscription
 */
export async function updateSubscription(
    userId: string,
    tier: Subscription["tier"],
    expiryDays: number = 30
): Promise<Subscription | null> {
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
            { onConflict: "user_id" }
        )
        .select()
        .single()

    if (error) {
        console.error("[db/subscriptions] Error updating subscription:", error)
        return null
    }

    // Log to history
    await logSubscriptionEvent(userId, "renewed", tier)

    return data
}

/**
 * Log subscription event
 */
export async function logSubscriptionEvent(
    userId: string,
    eventType: SubscriptionHistory["event_type"],
    tier: string
) {
    const supabase = await createServerClient()
    await supabase.from("subscription_history").insert({
        user_id: userId,
        event_type: eventType,
        tier,
        timestamp: new Date().toISOString()
    })
}
