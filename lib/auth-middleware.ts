import { type NextRequest, NextResponse } from "next/server"
import { extractTokenFromHeader, verifyJWT } from "./jwt-utils"

export interface AuthenticatedRequest extends NextRequest {
  userId?: string
  walletAddress?: string
  email?: string
  tier?: string
}

// Middleware to verify JWT and attach user info to request
export async function withAuth(request: NextRequest): Promise<{ valid: boolean; userId?: string; walletAddress?: string; tier?: string; error?: string }> {
  // Check for headers injected by proxy middleware first (performance)
  const proxyUserId = request.headers.get("x-user-id")
  const proxyTier = request.headers.get("x-subscription-tier") as string | undefined
  const proxyWallet = request.headers.get("x-wallet-address")

  if (proxyUserId) {
    return { valid: true, userId: proxyUserId, walletAddress: proxyWallet || undefined, tier: proxyTier || "free" }
  }

  const authHeader = request.headers.get("authorization")
  const token = extractTokenFromHeader(authHeader)

  if (!token) {
    return { valid: false, error: "Missing authorization token" }
  }

  const payload = verifyJWT(token) as any
  if (!payload) {
    return { valid: false, error: "Invalid or expired token" }
  }

  // Handle various potential fields for the unique user identifier
  const userId = payload.sub || payload.userId || payload.wallet_address || payload.walletAddress
  const walletAddress = payload.wallet_address || payload.walletAddress
  const tier = payload.subscription_tier || "free"

  return { valid: true, userId, walletAddress, tier }
}

// Helper to return 401 response
export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 })
}

// Helper to return 400 response
export function badRequest(message = "Bad request") {
  return NextResponse.json({ error: message }, { status: 400 })
}

// Helper to return 500 response
export function serverError(message = "Internal server error") {
  return NextResponse.json({ error: message }, { status: 500 })
}
