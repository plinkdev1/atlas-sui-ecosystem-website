import { withAuth, unauthorized } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const authResult = await withAuth(request)
    if (!authResult.valid) {
      return unauthorized(authResult.error)
    }

    // In practice, you might want to:
    // 1. Invalidate the token in a blacklist/cache
    // 2. Update user session status in database
    // 3. Clear client-side storage

    // For now, return success - client will remove token from storage
    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Logout failed"
    console.error("[v0] Logout error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
