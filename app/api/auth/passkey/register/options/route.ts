import { NextResponse } from "next/server"
import { generateRegistrationOptions } from "@simplewebauthn/server"

export async function POST(request: Request) {
  try {
    const { username } = await request.json()

    const options = await generateRegistrationOptions({
      rpName: "Atlas Protocol",
      rpID: process.env.NEXT_PUBLIC_RP_ID || "localhost",
      userID: username,
      userName: username,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
        authenticatorAttachment: "platform",
      },
    })

    // Store challenge in session for verification
    // In production, use Redis or session storage
    global.passkeyChallenge = options.challenge

    return NextResponse.json(options)
  } catch (error) {
    console.error("[v0] Passkey registration options error:", error)
    return NextResponse.json({ error: "Failed to generate options" }, { status: 500 })
  }
}
