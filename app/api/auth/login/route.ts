import { createServerClient_ } from "@/lib/supabase/server"
import { signJWT } from "@/lib/jwt-utils"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress } = body

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    const supabase = await createServerClient_()

    // Get wallet user
    const { data: walletUser, error: walletError } = await supabase
      .from("wallet_users")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single()

    if (walletError || !walletUser) {
      return NextResponse.json({ error: "Wallet not found. Please register first." }, { status: 404 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single()

    // Update last connected
    await supabase
      .from("wallet_users")
      .update({ last_connected_at: new Date().toISOString() })
      .eq("wallet_address", walletAddress)

    // Generate JWT token
    const token = signJWT({
      userId: walletUser.id,
      walletAddress,
      email: walletUser.metadata?.email || null,
      tier: profile?.tier || "free",
    })

    return NextResponse.json({
      success: true,
      userId: walletUser.id,
      token,
      walletAddress,
      tier: profile?.tier || "free",
      email: walletUser.metadata?.email || null,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed"
    console.error("[v0] Auth login error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
