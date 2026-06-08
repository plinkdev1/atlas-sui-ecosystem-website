import { createServerClient_ } from "@/lib/supabase/server"
import { AdSlot, AdvertisingPartner } from "@/types/database"

export async function getActiveAdvertisingPartners(): Promise<AdvertisingPartner[]> {
    const supabase = await createServerClient_()
    const { data, error } = await supabase
        .from("advertising_partners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })

    if (error) throw error
    return data || []
}

export async function getFeaturedAds(): Promise<(AdSlot & { partner: AdvertisingPartner })[]> {
    const supabase = await createServerClient_()
    const { data, error } = await supabase
        .from("ads_slots")
        .select("*, partner:advertising_partners(*)")
        .eq("is_active", true)

    if (error) throw error
    return data || []
}
