import { type NextRequest, NextResponse } from "next/server"

const LOGO_API_KEY = process.env.LOGO_DEV_API_KEY // Now server-side only, no NEXT_PUBLIC_

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const domain = searchParams.get("domain")
    const size = searchParams.get("size") || "128"

    if (!domain) {
      return NextResponse.json({ error: "Domain parameter is required" }, { status: 400 })
    }

    if (!LOGO_API_KEY) {
      return NextResponse.json({ error: "Logo API key not configured" }, { status: 500 })
    }

    // Construct logo.dev URL with server-side API key
    const logoUrl = `https://img.logo.dev/${domain}?token=${LOGO_API_KEY}&size=${size}&format=png&theme=dark&fallback=monogram`

    // Fetch the logo from logo.dev
    const response = await fetch(logoUrl)

    if (!response.ok) {
      throw new Error("Logo fetch failed")
    }

    // Return the image directly
    const buffer = await response.arrayBuffer()
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Logo fetch failed"
    console.error("[v0] Logo API error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
