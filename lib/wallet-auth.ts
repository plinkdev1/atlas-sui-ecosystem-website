import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabaseClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Generate a message for wallet to sign
export function generateMessageToSign(walletAddress: string, nonce: string): string {
  return `Sign this message to verify ownership of wallet ${walletAddress}\n\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}`
}

// Create or get wallet user record
export async function getOrCreateWalletUser(walletAddress: string) {
  const supabase = supabaseClient()

  try {
    // Try to get existing user
    const { data: existingUser, error: selectError } = await supabase
      .from("wallet_users")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single()

    if (existingUser) {
      // Update last_connected_at
      await supabase
        .from("wallet_users")
        .update({ last_connected_at: new Date().toISOString() })
        .eq("wallet_address", walletAddress)

      return existingUser
    }

    // Create new wallet user if not exists
    if (selectError?.code === "PGRST116") {
      const { data: newUser, error: insertError } = await supabase
        .from("wallet_users")
        .insert({
          wallet_address: walletAddress,
          metadata: { walletType: "sui" },
        })
        .select()
        .single()

      if (insertError) throw insertError
      return newUser
    }

    throw selectError
  } catch (error) {
    console.error("[v0] Error in getOrCreateWalletUser:", error)
    throw error
  }
}

// Create a session for wallet authentication
export async function createWalletSession(walletAddress: string) {
  const supabase = supabaseClient()
  const nonce = Math.random().toString(36).substring(2, 15)
  const messageToSign = generateMessageToSign(walletAddress, nonce)
  const sessionToken = generateSessionToken()

  try {
    const { data: session, error } = await supabase
      .from("wallet_sessions")
      .insert({
        wallet_address: walletAddress,
        session_token: sessionToken,
        message_to_sign: messageToSign,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return {
      sessionToken,
      messageToSign,
      walletAddress,
    }
  } catch (error) {
    console.error("[v0] Error creating wallet session:", error)
    throw error
  }
}

// Verify wallet signature and mark session as verified
export async function verifyWalletSignature(walletAddress: string, sessionToken: string, signature: string) {
  const supabase = supabaseClient()

  try {
    // Get the session
    const { data: session, error: sessionError } = await supabase
      .from("wallet_sessions")
      .select("*")
      .eq("session_token", sessionToken)
      .eq("wallet_address", walletAddress)
      .single()

    if (sessionError) throw new Error("Session not found")
    if (!session) throw new Error("Invalid session")

    // Check expiry
    if (new Date(session.expires_at) < new Date()) {
      throw new Error("Session expired")
    }

    // In production, verify the signature using @noble/curves or similar
    // For now, we just mark it as verified if signature is provided
    // TODO: Implement actual signature verification
    if (!signature) {
      throw new Error("Signature required")
    }

    // Mark session as verified
    const { data: verifiedSession, error: updateError } = await supabase
      .from("wallet_sessions")
      .update({
        signature,
        verified_at: new Date().toISOString(),
      })
      .eq("session_token", sessionToken)
      .select()
      .single()

    if (updateError) throw updateError

    return {
      verified: true,
      walletAddress,
      sessionToken,
      expiresAt: session.expires_at,
    }
  } catch (error) {
    console.error("[v0] Error verifying wallet signature:", error)
    throw error
  }
}

// Get active session for wallet
export async function getActiveWalletSession(walletAddress: string) {
  const supabase = supabaseClient()

  try {
    const { data: session, error } = await supabase
      .from("wallet_sessions")
      .select("*")
      .eq("wallet_address", walletAddress)
      .not("verified_at", "is", null)
      .gt("expires_at", new Date().toISOString())
      .order("verified_at", { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== "PGRST116") throw error

    return session || null
  } catch (error) {
    console.error("[v0] Error getting active session:", error)
    return null
  }
}

// Helper to generate session token
function generateSessionToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
