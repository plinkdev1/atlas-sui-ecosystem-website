import { createServerClient_ } from "@/lib/supabase/server"
import { signJWT } from "@/lib/jwt-utils"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress, email } = body

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    const supabase = await createServerClient_()

    // Check if wallet already exists
    const { data: existingWallet } = await supabase
      .from("wallet_users")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single()

    if (existingWallet) {
      return NextResponse.json({ error: "Wallet already registered" }, { status: 409 })
    }

    // Create wallet user
    const { data: walletUser, error: walletError } = await supabase
      .from("wallet_users")
      .insert({
        wallet_address: walletAddress,
        metadata: { registered_at: new Date().toISOString(), email },
      })
      .select()
      .single()

    if (walletError) throw walletError

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        wallet_address: walletAddress,
        theme: "light",
        network: "testnet",
      })
      .select()
      .single()

    if (profileError) throw profileError

    // Generate JWT token
    const token = signJWT({
      userId: walletUser.id,
      walletAddress,
      email: email || null,
      tier: "free",
    })

    return NextResponse.json(
      {
        success: true,
        userId: walletUser.id,
        token,
        walletAddress,
        tier: "free",
        createdAt: walletUser.created_at,
      },
      { status: 201 },
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Registration failed"
    console.error("[v0] Auth register error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
