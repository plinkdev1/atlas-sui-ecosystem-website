import { createServerClient_ } from "@/lib/supabase/server"
import { withAuth, unauthorized } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"

// GET current authenticated user
export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request)
    if (!authResult.valid) {
      return unauthorized(authResult.error)
    }

    const supabase = await createServerClient_()

    // Get wallet user by ID (from token)
    const { data: walletUser, error } = await supabase
      .from("wallet_users")
      .select("*")
      .eq("id", authResult.userId)
      .single()

    if (error || !walletUser) {
      return unauthorized("User not found")
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("wallet_address", walletUser.wallet_address)
      .single()

    return NextResponse.json({
      id: walletUser.id,
      walletAddress: walletUser.wallet_address,
      email: walletUser.metadata?.email,
      tier: profile?.tier || "free",
      theme: profile?.theme || "light",
      network: profile?.network || "testnet",
      createdAt: walletUser.created_at,
      lastConnectedAt: walletUser.last_connected_at,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get user"
    console.error("[v0] Get user error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// PUT update user profile
export async function PUT(request: NextRequest) {
  try {
    const authResult = await withAuth(request)
    if (!authResult.valid) {
      return unauthorized(authResult.error)
    }

    const body = await request.json()
    const { email, theme, network, preferredExplorer } = body

    const supabase = await createServerClient_()

    // Get wallet user
    const { data: walletUser, error: walletError } = await supabase
      .from("wallet_users")
      .select("*")
      .eq("id", authResult.userId)
      .single()

    if (walletError || !walletUser) {
      return unauthorized("User not found")
    }

    // Update metadata if email provided
    if (email) {
      await supabase
        .from("wallet_users")
        .update({
          metadata: { ...walletUser.metadata, email },
        })
        .eq("id", authResult.userId)
    }

    // Update profile settings
    const { data: updatedProfile, error: updateError } = await supabase
      .from("user_profiles")
      .update({
        theme: theme || undefined,
        network: network || undefined,
        preferred_explorer: preferredExplorer || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("wallet_address", walletUser.wallet_address)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      walletAddress: walletUser.wallet_address,
      email: email || walletUser.metadata?.email,
      theme: updatedProfile.theme,
      network: updatedProfile.network,
      preferredExplorer: updatedProfile.preferred_explorer,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update user"
    console.error("[v0] Update user error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
