import { createServerClient_ } from "@/lib/supabase/server"
import { Provider } from "@/types/database"

export async function getProvidersByUserId(userId: string): Promise<Provider[]> {
    const supabase = await createServerClient_()
    const { data, error } = await supabase
        .from("providers")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })

    if (error) throw error
    return data || []
}

export async function createProvider(userId: string, providerData: Partial<Provider>): Promise<Provider> {
    const supabase = await createServerClient_()
    const { data, error } = await supabase
        .from("providers")
        .insert({
            ...providerData,
            user_id: userId,
            status: "pending"
        })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function getProviderById(id: string): Promise<Provider | null> {
    const supabase = await createServerClient_()
    const { data, error } = await supabase
        .from("providers")
        .select("*")
        .eq("id", id)
        .single()

    if (error) return null
    return data
}
