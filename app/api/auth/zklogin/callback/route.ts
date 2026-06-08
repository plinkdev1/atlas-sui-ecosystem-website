import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { sign } from "jsonwebtoken"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state") // This is our nonce

    if (!code || !state) {
      return NextResponse.redirect(new URL("/auth?error=missing_params", request.url))
    }

    // Exchange code for tokens (simplified - in production, use proper OAuth flow)
    // For now, create ephemeral wallet session
    
    const supabase = await createServerClient()

    // Create user profile with 'user' role
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        wallet_address: `zklogin_${state.slice(0, 16)}`, // Temporary identifier
        role: "user",
        auth_method: "zklogin",
      })
      .select()
      .single()

    if (profileError) {
      console.error("[v0] Profile creation error:", profileError)
      return NextResponse.redirect(new URL("/auth?error=profile_creation", request.url))
    }

    // Store ZKLogin session
    await supabase.from("zklogin_sessions").insert({
      user_id: profile.id,
      nonce: state,
      provider: "google",
      jwt_token: code,
    })

    // Create JWT token
    const token = sign(
      { userId: profile.id, role: "user", authMethod: "zklogin" },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    )

    // Redirect to home with token
    const response = NextResponse.redirect(new URL("/?zklogin=success", request.url))
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("[v0] ZKLogin callback error:", error)
    return NextResponse.redirect(new URL("/auth?error=zklogin_failed", request.url))
  }
}
