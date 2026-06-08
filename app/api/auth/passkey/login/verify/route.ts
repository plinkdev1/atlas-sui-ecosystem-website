import { NextResponse } from "next/server"
import { verifyAuthenticationResponse } from "@simplewebauthn/server"
import { createServerClient } from "@/lib/supabase/server"
import { sign } from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const { credential } = await request.json()

    const supabase = await createServerClient()

    // Find passkey credential
    const { data: passkeyData, error: passkeyError } = await supabase
      .from("passkey_credentials")
      .select("*, user_profiles(*)")
      .eq("credential_id", credential.id)
      .single()

    if (passkeyError || !passkeyData) {
      return NextResponse.json({ success: false, error: "Credential not found" }, { status: 404 })
    }

    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge: global.passkeyAuthChallenge || "",
      expectedOrigin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      expectedRPID: process.env.NEXT_PUBLIC_RP_ID || "localhost",
      authenticator: {
        credentialID: passkeyData.credential_id,
        credentialPublicKey: passkeyData.public_key,
        counter: passkeyData.counter,
      },
    })

    if (!verification.verified) {
      return NextResponse.json({ success: false, error: "Verification failed" }, { status: 400 })
    }

    // Update counter
    await supabase
      .from("passkey_credentials")
      .update({ counter: verification.authenticationInfo.newCounter })
      .eq("credential_id", credential.id)

    // Create JWT token
    const token = sign(
      { userId: passkeyData.user_id, role: passkeyData.user_profiles.role, authMethod: "passkey" },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    )

    return NextResponse.json({ success: true, token })
  } catch (error) {
    console.error("[v0] Passkey login verification error:", error)
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 })
  }
}
