import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier } = body

    if (!identifier) {
      return NextResponse.json({ success: false, error: "Missing identifier" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const { error } = await supabase.from("risk_disclaimers").upsert(
      {
        user_identifier: identifier,
        accepted: true,
        created_at: new Date().toISOString(),
      },
      {
        onConflict: "user_identifier",
      },
    )

    if (error) {
      console.error("Error saving disclaimer acceptance:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Disclaimer accept error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
