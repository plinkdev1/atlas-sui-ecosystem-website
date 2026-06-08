import crypto from "crypto"
import bcrypt from "bcryptjs"

const API_KEY_PREFIX = "atlas_"
const SALT_ROUNDS = 10

// Generate a new secure API key
export function generateAPIKey(): string {
  const randomBytes = crypto.randomBytes(24).toString("hex")
  return `${API_KEY_PREFIX}${randomBytes}`
}

// Hash API key for storage (using bcrypt)
export async function hashAPIKey(apiKey: string): Promise<string> {
  return bcrypt.hash(apiKey, SALT_ROUNDS)
}

// Verify API key against hash
export async function verifyAPIKey(apiKey: string, hash: string): Promise<boolean> {
  return bcrypt.compare(apiKey, hash)
}

// Extract key ID from full API key (for logging)
export function extractKeyId(apiKey: string): string {
  return apiKey.substring(0, 20) // First 20 chars for safe logging
}
