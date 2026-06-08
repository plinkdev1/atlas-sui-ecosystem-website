import { NextResponse } from "next/server"
import { randomBytes } from "crypto"

export async function POST(request: Request) {
  try {
    const { provider } = await request.json()

    // Generate random nonce for ZKLogin
    const nonce = randomBytes(32).toString("base64url")

    // OAuth URLs for different providers
    const oauthUrls: Record<string, string> = {
      google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/api/auth/zklogin/callback&response_type=code&scope=openid email profile&state=${nonce}`,
      facebook: `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/api/auth/zklogin/callback&state=${nonce}`,
      twitch: `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/api/auth/zklogin/callback&response_type=code&scope=openid&state=${nonce}`,
    }

    const authUrl = oauthUrls[provider]

    if (!authUrl) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 })
    }

    return NextResponse.json({ authUrl, nonce })
  } catch (error) {
    console.error("[v0] ZKLogin initiate error:", error)
    return NextResponse.json({ error: "Failed to initiate ZKLogin" }, { status: 500 })
  }
}
