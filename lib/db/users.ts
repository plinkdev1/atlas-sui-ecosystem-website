import { createServerClient_ } from "@/lib/supabase/server"
import { UserProfile } from "@/types/database"

/**
 * Find or create a user profile by wallet address
 */
export async function getOrCreateProfile(walletAddress: string): Promise<UserProfile | null> {
    const supabase = await createServerClient_()

    // 1. Get Wallet User
    let { data: walletUser } = await supabase
        .from("wallet_users")
        .select("*")
        .eq("wallet_address", walletAddress)
        .single()

    if (!walletUser) {
        const { data: newUser, error } = await supabase
            .from("wallet_users")
            .insert({ wallet_address: walletAddress })
            .select()
            .single()

        if (error) return null
        walletUser = newUser
    }

    // 2. Get Profile
    const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("wallet_address", walletAddress)
        .single()

    if (profileError || !profile) {
        const { data: newProfile } = await supabase
            .from("user_profiles")
            .insert({
                wallet_address: walletAddress,
                role: "user",
                is_admin: false,
                is_pro: false
            })
            .select()
            .single()

        return newProfile
    }

    return profile
}

/**
 * Get profile by ID (UUID) or Wallet Address
 */
export async function getProfileByIdentifier(identifier: string): Promise<UserProfile | null> {
    const supabase = await createServerClient_()

    const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .or(`id.eq.${identifier},wallet_address.eq.${identifier}`)
        .single()

    if (error) return null
    return data
}

/**
 * Update user profile
 */
export async function updateProfile(identifier: string, updates: Partial<UserProfile>) {
    const supabase = await createServerClient_()

    const { data, error } = await supabase
        .from("user_profiles")
        .update(updates)
        .or(`id.eq.${identifier},wallet_address.eq.${identifier}`)
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Get profile by Wallet Address
 */
export async function getProfileByWallet(walletAddress: string): Promise<UserProfile | null> {
    const supabase = await createServerClient_()
    const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("wallet_address", walletAddress)
        .single()

    if (error) return null
    return data
}
