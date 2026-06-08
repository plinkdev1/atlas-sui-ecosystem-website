import { z } from "zod"

export const UserProfileSchema = z.object({
    full_name: z.string().optional(),
    avatar_url: z.string().url().optional().or(z.literal("")),
    theme: z.enum(["light", "dark"]).optional(),
    network: z.enum(["mainnet", "testnet", "devnet"]).optional(),
    preferredExplorer: z.string().optional(),
    analyticsOptOut: z.boolean().optional(),
    walletName: z.string().optional(),
})

export const ProviderSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(10).max(1000),
    category: z.string(),
    website: z.string().url().optional().or(z.literal("")),
    logo: z.string().url().optional().or(z.literal("")),
    pricing: z.any().optional(),
    features: z.array(z.string()).optional(),
})

export const CookieConsentSchema = z.object({
    user_identifier: z.string(),
    analytics_accepted: z.boolean(),
    marketing_accepted: z.boolean(),
    essential_accepted: z.boolean(),
})

export const RiskDisclaimerSchema = z.object({
    identifier: z.string(),
    accepted: z.boolean(),
})

export const AuthWalletSchema = z.object({
    action: z.enum(["create_session", "verify_signature"]),
    walletAddress: z.string().optional(),
    sessionToken: z.string().optional(),
    signature: z.string().optional(),
    message: z.string().optional(),
})

export const BlockberryRequestSchema = z.object({
    type: z.enum(["nft-security", "coin-security", "tx-security", "nft-metadata", "coin-metadata"]),
    address: z.string().min(1),
    network: z.enum(["mainnet", "testnet"]).default("mainnet"),
})

export const BlockvisionRequestSchema = z.object({
    type: z.enum(["account-nfts", "account-coins", "collection-details", "transaction-details", "coin-market"]),
    address: z.string().min(1),
    network: z.enum(["mainnet", "testnet"]).default("mainnet"),
    limit: z.number().int().min(1).max(100).default(20),
})
