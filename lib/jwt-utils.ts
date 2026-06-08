import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production"
const JWT_EXPIRY = "24h"

export interface JWTPayload {
  userId: string
  walletAddress?: string
  wallet_address?: string
  sub?: string
  email?: string
  tier?: string
  iat?: number
  exp?: number
}

// Sign a JWT token
export function signJWT(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

// Verify and decode JWT token
export function verifyJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    console.error("[v0] JWT verification error:", error)
    return null
  }
}

// Extract JWT from Authorization header
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) {
    return null
  }

  if (authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }

  return authHeader
}
