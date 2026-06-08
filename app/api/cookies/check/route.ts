import { createServerClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const identifier = searchParams.get("id")

    // Check for fast-path cookie first
    const cookieConsent = request.cookies.get("atlas_cookie_accepted")?.value
    if (cookieConsent === "true") {
      return NextResponse.json({ hasValidConsent: true, source: "cookie" })
    }

    if (!identifier) {
      return NextResponse.json({ hasValidConsent: false })
    }

    const supabase = await createServerClient()

    // Check if user has consented in the last 20 days
    const twentyDaysAgo = new Date()
    twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20)

    const { data, error } = await supabase
      .from("cookie_consents")
      .select("id, created_at")
      .eq("user_identifier", identifier)
      .gte("created_at", twentyDaysAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(1)

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned, which is expected if no consent
      console.error("Error checking cookie consent:", error)
    }

    return NextResponse.json({
      hasValidConsent: data && data.length > 0,
    })
  } catch (error) {
    console.error("Cookie check error:", error)
    return NextResponse.json({ hasValidConsent: false })
  }
}
