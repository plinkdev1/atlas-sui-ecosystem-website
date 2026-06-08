import { addAirpoints, AirpointsHistoryEvent } from "./supabase/airpoints"

const EDGE_FUNCTION_URL = process.env.NEXT_PUBLIC_AIRPOINTS_EDGE_FUNCTION_URL
const SYNC_SECRET = process.env.AIRPOINTS_SYNC_SECRET

/**
 * Rates limits (in memory for now, simple implementation)
 */
const rateLimits = new Map<string, number>()
const LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour

/**
 * Core engine for awarding Airpoints.
 * Handles local DB persistence and external "Master Sync" to airpoints.space.
 */
export async function creditAirpoints(
    userId: string,
    walletAddress: string,
    amount: number,
    type: AirpointsHistoryEvent["type"],
    description: string
) {
    // 1. Basic Rate Limiting check
    const rateKey = `${userId}:${type}`
    const lastCall = rateLimits.get(rateKey) || 0
    const now = Date.now()

    // Example: Allow directory listings once per hour, AI explanations multiple times
    if (type === "earn_directory" && now - lastCall < LIMIT_WINDOW_MS) {
        console.warn(`[Airpoints Engine] Rate limit hit for ${userId} action ${type}`)
        return { success: false, error: "Rate limit exceeded for this action" }
    }

    // 2. Local Database Write (Source of Truth for Website)
    const localResult = await addAirpoints(userId, walletAddress, amount, type, description)

    if (!localResult.success) {
        return localResult
    }

    // Update rate limit timestamp
    rateLimits.set(rateKey, now)

    // 3. Master Sync (Edge Function)
    // This syncs the points to the external airpoints.space ecosystem
    if (EDGE_FUNCTION_URL) {
        try {
            // Fire and forget, or handle errors silently to not block the user
            fetch(`${EDGE_FUNCTION_URL}/sync-earn`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${SYNC_SECRET}`
                },
                body: JSON.stringify({
                    userId,
                    walletAddress,
                    amount,
                    type,
                    description,
                    source: "atlas-website"
                })
            }).catch(err => console.error("[Airpoints Engine] Sync failed:", err))
        } catch (e) {
            console.error("[Airpoints Engine] Sync exception:", e)
        }
    } else {
        console.log("[Airpoints Engine] Master Sync skipped (URL not configured)")
    }

    return localResult
}
