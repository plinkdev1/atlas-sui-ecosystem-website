import { unauthorized, withAuth } from "@/lib/auth-middleware"
import { getProfileByIdentifier, updateProfile } from "@/lib/db/users"
import { createServerClient_ } from "@/lib/supabase/server"
import { UserProfileSchema } from "@/lib/validations"
import { type NextRequest, NextResponse } from "next/server"

// GET user profile details
export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request)
    if (!authResult.valid) {
      return unauthorized(authResult.error)
    }

    const profile = await getProfileByIdentifier(authResult.userId!)

    if (!profile) {
      console.error("[Profile API] Profile not found for identifier:", authResult.userId)
      return unauthorized("User not found")
    }

    const supabase = await createServerClient_()

    // Get API keys count (keeping this direct for now as it's specific to this view)
    const { data: apiKeys } = await supabase
      .from("api_keys")
      .select("id")
      .eq("user_id", authResult.userId)

    // Get entitlements
    const { data: entitlements } = await supabase
      .from("entitlements")
      .select("*")
      .eq("user_id", profile.wallet_address)
      .eq("status", "active")

    return NextResponse.json({
      id: profile.id,
      walletAddress: profile.wallet_address,
      isAdmin: profile.is_admin || false,
      theme: profile.theme || "light",
      network: profile.network || "testnet",
      preferredExplorer: profile.preferred_explorer,
      analyticsOptOut: profile.analytics_opt_out || false,
      walletName: profile.wallet_name,
      apiKeysCount: apiKeys?.length || 0,
      activeEntitlements: entitlements?.length || 0,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get profile"
    console.error("[v0] Get profile error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// PUT update profile details
export async function PUT(request: NextRequest) {
  try {
    const authResult = await withAuth(request)
    if (!authResult.valid) {
      return unauthorized(authResult.error)
    }

    const body = await request.json()

    // Validate with Zod
    const validation = UserProfileSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data", details: validation.error.format() }, { status: 400 })
    }

    const { theme, network, preferredExplorer, analyticsOptOut, walletName } = validation.data

    const updatedProfile = await updateProfile(authResult.userId!, {
      theme,
      network,
      preferred_explorer: preferredExplorer,
      analytics_opt_out: analyticsOptOut,
      wallet_name: walletName,
      updated_at: new Date().toISOString(),
    })

    if (!updatedProfile) {
      return unauthorized("User not found or profile could not be updated")
    }

    return NextResponse.json({
      success: true,
      theme: updatedProfile.theme,
      network: updatedProfile.network,
      preferredExplorer: updatedProfile.preferred_explorer,
      analyticsOptOut: updatedProfile.analytics_opt_out,
      walletName: updatedProfile.wallet_name,
      updatedAt: updatedProfile.updated_at,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update profile"
    console.error("[v0] Update profile error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
