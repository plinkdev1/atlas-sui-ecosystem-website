import { NextResponse } from "next/server"
import { generateAuthenticationOptions } from "@simplewebauthn/server"

export async function POST() {
  try {
    const options = await generateAuthenticationOptions({
      rpID: process.env.NEXT_PUBLIC_RP_ID || "localhost",
      userVerification: "preferred",
    })

    // Store challenge for verification
    global.passkeyAuthChallenge = options.challenge

    return NextResponse.json(options)
  } catch (error) {
    console.error("[v0] Passkey login options error:", error)
    return NextResponse.json({ error: "Failed to generate options" }, { status: 500 })
  }
}
