import { getUserAirpointsBalance } from "@/lib/supabase/airpoints"
import { createServerClient } from "@/lib/supabase/server"
import { getUserSubscription, isInGracePeriod, isSubscriptionExpired } from "@/lib/supabase/subscriptions"
import { UserStatusSyncResponse } from "@/types/subscription"
import { NextRequest, NextResponse } from "next/server"

/**
 * Internal API for the Atlas App (Product) to sync user status from the Website.
 * Authenticated via SHARED_INTERNAL_SECRET header or fallback env.
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("wallet")
    const secret = request.headers.get("x-atlas-internal-secret")

    // Simple secret-based authentication for internal communication
    const internalSecret = process.env.INTERNAL_SYNC_SECRET || process.env.JWT_SECRET || "atlas_shared_sync_dev"
    if (!secret || secret !== internalSecret) {
        return NextResponse.json({ error: "Unauthorized internal access" }, { status: 401 })
    }

    if (!walletAddress) {
        return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    try {
        const supabase = await createServerClient()

        // 1. Find user by wallet address
        const { data: walletUser, error: userError } = await supabase
            .from("wallet_users")
            .select("id, wallet_address")
            .eq("wallet_address", walletAddress)
            .single()

        if (userError || !walletUser) {
            const response: UserStatusSyncResponse = {
                exists: false,
                tier: "free",
                isPro: false,
                subscriptionStatus: "none",
                airpointsBalance: 0,
                airpointsTier: "free",
                updatedAt: new Date().toISOString(),
            }
            return NextResponse.json(response)
        }

        // 2. Get subscription and perform state check
        const subscription = await getUserSubscription(walletUser.id)

        let subStatus: UserStatusSyncResponse["subscriptionStatus"] = "none"
        let isPro = false

        if (subscription) {
            const expired = isSubscriptionExpired(subscription)
            const grace = isInGracePeriod(subscription)

            if (subscription.status === "active" && !expired) {
                subStatus = "active"
                isPro = true
            } else if (grace) {
                subStatus = "grace_period"
                isPro = true // Features still active during grace period
            } else if (expired) {
                subStatus = "expired"
                isPro = false
            } else if (subscription.status === "canceled") {
                subStatus = "canceled"
                isPro = false
            }
        }

        // 3. Get airpoints
        const airpoints = await getUserAirpointsBalance(walletUser.id)

        const response: UserStatusSyncResponse = {
            exists: true,
            userId: walletUser.id,
            walletAddress: walletUser.wallet_address,
            tier: subscription?.tier || "free",
            isPro,
            subscriptionStatus: subStatus,
            expiryDate: subscription?.expiry,
            airpointsBalance: airpoints?.balance || 0,
            airpointsTier: airpoints?.tier || "free",
            updatedAt: new Date().toISOString(),
        }

        return NextResponse.json(response)
    } catch (error) {
        console.error("[Internal Sync] Error fetching user status:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
