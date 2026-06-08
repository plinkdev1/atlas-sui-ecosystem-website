import { createServerClient_ } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { AUTHORIZED_ADMIN_WALLETS } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress } = body

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    if (AUTHORIZED_ADMIN_WALLETS.length > 0) {
      const isAuthorized = AUTHORIZED_ADMIN_WALLETS.includes(walletAddress.toLowerCase())
      if (!isAuthorized) {
        return NextResponse.json({ isAdmin: false }, { status: 200 })
      }
    }

    // Check if user has admin flag in Supabase
    const supabase = await createServerClient_()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ isAdmin: false }, { status: 200 })
    }

    const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("user_id", user.id).single()

    return NextResponse.json({ isAdmin: profile?.is_admin || false }, { status: 200 })
  } catch (error: unknown) {
    console.error("[v0] Admin verify error:", error)
    return NextResponse.json({ isAdmin: false }, { status: 200 })
  }
}
