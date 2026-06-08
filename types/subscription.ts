/**
 * Authoritative subscription tiers and their properties
 */
export type ProTier = "free" | "pro" | "pro+"

export interface TierDefinition {
    name: string
    price: number
    priceId?: string // Stripe/LemonSqueezy variant ID
    requestsPerMonth?: number | "unlimited"
    features: string[]
}

export const SUBSCRIPTION_TIERS: Record<ProTier, TierDefinition> = {
    free: {
        name: "Free",
        price: 0,
        features: ["Basic Transaction Explainer", "Public Infrastructure Directory"],
    },
    pro: {
        name: "Pro",
        price: 9,
        requestsPerMonth: 1000,
        features: [
            "Advanced Transaction Explainer",
            "Auto-Rules",
            "Smart Alerts",
            "Priority API Access",
            "Unlimited Scans",
            "Custom Wallets",
        ],
    },
    "pro+": {
        name: "Pro+",
        price: 19,
        requestsPerMonth: "unlimited",
        features: [
            "Everything in Pro",
            "Max Staking Yield Rates",
            "3x Airpoints Multiplier",
            "Early Access to New Tools",
            "Dedicated Support",
        ],
    },
}

/**
 * Interface for the internal sync API between Website and App repos
 */
export interface UserStatusSyncResponse {
    exists: boolean
    userId?: string
    walletAddress?: string
    tier: ProTier
    isPro: boolean
    subscriptionStatus: "active" | "expired" | "canceled" | "none" | "grace_period"
    expiryDate?: string | null
    airpointsBalance: number
    airpointsTier: string
    updatedAt: string
}

/**
 * Grace period (in days) allowed after subscription expires before features are locked
 */
export const SUBSCRIPTION_GRACE_PERIOD_DAYS = 3
