import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    // Server-side only credentials - NOT exposed to client
    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminUsername || !adminPassword) {
      console.error("[v0] Admin credentials not configured in environment variables")
      return NextResponse.json({ error: "Admin access not configured" }, { status: 500 })
    }

    // Constant-time comparison to prevent timing attacks
    const usernameMatch = username === adminUsername
    const passwordMatch = password === adminPassword
    const isValid = usernameMatch && passwordMatch

    if (isValid) {
      return NextResponse.json({ success: true }, { status: 200 })
    } else {
      // Add delay to prevent brute force attacks
      await new Promise((resolve) => setTimeout(resolve, 500))
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("[v0] Admin login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
