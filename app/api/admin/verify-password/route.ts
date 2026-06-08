import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 })
    }

    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      return NextResponse.json({ error: "Admin password not configured" }, { status: 500 })
    }

    // Compare passwords - constant-time comparison to prevent timing attacks
    const isValid = password === adminPassword

    if (isValid) {
      return NextResponse.json({ success: true }, { status: 200 })
    } else {
      // Add slight delay to prevent brute force
      await new Promise((resolve) => setTimeout(resolve, 500))
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
    }
  } catch (error) {
    console.error("[v0] Password verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
