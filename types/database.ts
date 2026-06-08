/**
 * DATABASE ENTITIES - Single Source of Truth
 * Every field here corresponds exactly to a column in Supabase.
 */

export type UserRole = "user" | "provider" | "admin" | "banned"

export interface UserProfile {
    id: string
    wallet_address: string
    role: UserRole
    is_admin: boolean
    is_pro: boolean
    auth_method?: string
    network?: string
    full_name?: string
    avatar_url?: string
    theme?: string
    preferred_explorer?: string
    analytics_opt_out?: boolean
    wallet_name?: string
    created_at: string
    updated_at: string
}

export interface WalletUser {
    id: string
    wallet_address: string
    last_connected_at: string
    created_at: string
}

export interface WalletSession {
    id: string
    wallet_address: string
    session_token: string
    message_to_sign: string
    verified_at?: string
    expires_at: string
    created_at: string
}

export interface Subscription {
    id: string
    user_id: string
    tier: "free" | "pro" | "pro+"
    status: "active" | "canceled" | "expired" | "none"
    expiry: string | null
    created_at: string
    updated_at: string
}

export interface SubscriptionHistory {
    id: string
    user_id: string
    event_type: "created" | "renewed" | "canceled" | "expired" | "upgraded" | "downgraded"
    tier: string
    timestamp: string
}

export interface AirpointsBalance {
    id: string
    user_id: string
    wallet_address: string
    balance: number
    tier: "free" | "pro" | "pro+"
    last_earned: string | null
    last_updated: string
}

export interface AirpointsHistory {
    id: string
    user_id: string
    wallet_address: string
    amount: number
    type: string
    description: string | null
    timestamp: string
}

export interface Provider {
    id: string
    user_id: string
    name: string
    description: string
    category: string
    website?: string
    logo?: string
    pricing: any // Record<string, any>
    features: string[]
    status: "pending" | "approved" | "rejected"
    created_at: string
    updated_at: string
}

export interface ProviderListing {
    id: string
    provider_id: string
    name: string
    tagline: string
    category: string
    status: "pending" | "approved"
    created_at: string
    updated_at: string
}

export interface CookieConsent {
    id: string
    user_identifier: string
    analytics_accepted: boolean
    marketing_accepted: boolean
    essential_accepted: boolean
    updated_at: string
    created_at: string
}

export interface RiskDisclaimer {
    id: string
    user_identifier: string
    accepted: boolean
    created_at: string
}

export interface AdvertisingPartner {
    id: string
    name: string
    logo_url: string
    website_url: string
    is_active: boolean
    sort_order: number
    created_at: string
}

export interface AdSlot {
    id: string
    name: string
    description: string
    partner_id: string
    is_active: boolean
    created_at: string
}

export interface ProviderUsage {
    id: string
    entitlement_id: string
    requests_count: number
    response_time_avg_ms: number
    uptime_percent: number
    period_date: string
}

export interface RevenueRecord {
    id: string
    provider_id: string
    revenue_share_provider: number
    period_month: string
    created_at: string
}
