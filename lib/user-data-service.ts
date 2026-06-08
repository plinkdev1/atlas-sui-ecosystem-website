"use client"

import { createClient } from "@/lib/supabase/client"

export async function linkWalletToUser(walletAddress: string, walletName: string) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("No user authenticated")

  const { error } = await supabase.from("user_profiles").upsert({
    id: user.id,
    wallet_address: walletAddress,
    wallet_name: walletName,
    updated_at: new Date().toISOString(),
  })

  if (error) throw error
}

export async function saveUserPreference(
  dataType: string,
  assetId: string | null,
  assetType: string | null,
  value: unknown,
) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase.from("user_data").upsert({
    user_id: user.id,
    data_type: dataType,
    asset_id: assetId,
    asset_type: assetType,
    value,
    updated_at: new Date().toISOString(),
  })

  if (error) console.error("Error saving preference:", error)
}

export async function getUserPreferences(dataType: string) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase.from("user_data").select("*").eq("user_id", user.id).eq("data_type", dataType)

  if (error) console.error("Error fetching preferences:", error)
  return data || []
}

export async function getUserProfile() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

  if (error && error.code !== "PGRST116") console.error("Error fetching profile:", error)
  return data || null
}

export async function migrateLocalStorageToSupabase() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  try {
    // Migrate hidden items if they exist in localStorage
    const hiddenItems = localStorage.getItem("atlas-hidden-items")
    if (hiddenItems) {
      try {
        const items = JSON.parse(hiddenItems)
        for (const item of items) {
          await saveUserPreference("hidden_items", item.id, item.type, { hidden: true })
        }
        localStorage.removeItem("atlas-hidden-items")
      } catch (e) {
        console.error("Failed to migrate hidden items:", e)
      }
    }

    // Migrate votes if they exist
    const votes = localStorage.getItem("atlas-votes")
    if (votes) {
      try {
        const voteData = JSON.parse(votes)
        for (const [key, value] of Object.entries(voteData)) {
          await saveUserPreference("votes", key, null, value)
        }
        localStorage.removeItem("atlas-votes")
      } catch (e) {
        console.error("Failed to migrate votes:", e)
      }
    }

    console.log("[v0] Successfully migrated localStorage to Supabase")
  } catch (error) {
    console.error("[v0] Error migrating data:", error)
  }
}

export async function shouldUsePersistentStorage(): Promise<boolean> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return !!user
}
