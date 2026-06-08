import { createServerClient } from "@/lib/supabase/server"
import { AirpointsBalance } from "@/types/database"

/**
 * Get user Airpoints balance
 */
export async function getAirpointsBalance(userId: string): Promise<AirpointsBalance | null> {
    const supabase = await createServerClient()
    const { data, error } = await supabase
        .from("airpoints_balance")
        .select("*")
        .eq("user_id", userId)
        .single()

    if (error && error.code !== "PGRST116") return null
    return data || null
}

/**
 * Add points to balance
 */
export async function addAirpoints(
    userId: string,
    walletAddress: string,
    amount: number,
    type: string,
    description?: string
) {
    const supabase = await createServerClient()

    // 1. Get current
    const { data: current } = await supabase
        .from("airpoints_balance")
        .select("balance")
        .eq("user_id", userId)
        .single()

    const newBalance = (current?.balance || 0) + amount

    // 2. Update
    const { error: updateError } = await supabase
        .from("airpoints_balance")
        .update({
            balance: newBalance,
            last_earned: new Date().toISOString()
        })
        .eq("user_id", userId)

    if (updateError) throw updateError

    // 3. History
    await supabase.from("airpoints_history").insert({
        user_id: userId,
        wallet_address: walletAddress,
        amount,
        type,
        description,
        timestamp: new Date().toISOString()
    })

    return { success: true, newBalance }
}
