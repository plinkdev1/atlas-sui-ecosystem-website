import { NextResponse } from "next/server"
import { verifyRegistrationResponse } from "@simplewebauthn/server"
import { createServerClient } from "@/lib/supabase/server"
import { sign } from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const { credential } = await request.json()

    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: global.passkeyChallenge || "",
      expectedOrigin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      expectedRPID: process.env.NEXT_PUBLIC_RP_ID || "localhost",
    })

    if (!verification.verified) {
      return NextResponse.json({ success: false, error: "Verification failed" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Create user profile with 'user' role
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        wallet_address: `passkey_${credential.id.slice(0, 16)}`,
        role: "user",
        auth_method: "passkey",
      })
      .select()
      .single()

    if (profileError) {
      console.error("[v0] Profile creation error:", profileError)
      return NextResponse.json({ success: false, error: "Profile creation failed" }, { status: 500 })
    }

    // Store passkey credential
    await supabase.from("passkey_credentials").insert({
      user_id: profile.id,
      credential_id: credential.id,
      public_key: verification.registrationInfo?.credentialPublicKey,
      counter: verification.registrationInfo?.counter || 0,
    })

    // Create JWT token
    const token = sign(
      { userId: profile.id, role: "user", authMethod: "passkey" },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    )

    return NextResponse.json({ success: true, token })
  } catch (error) {
    console.error("[v0] Passkey registration verification error:", error)
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 })
  }
}
