import { createServerClient_ } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient_()
    const body = await request.json()

    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: userRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", sessionData.session.user.id)
      .single()

    if (userRole?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { ads } = body

    if (!Array.isArray(ads)) {
      return NextResponse.json({ error: "ads array is required" }, { status: 400 })
    }

    interface AdPosition {
      id: string
      position: number
    }

    const updates: AdPosition[] = ads.map((ad: { id: string; position?: number }, index: number) => ({
      id: ad.id,
      position: index,
    }))

    for (const update of updates) {
      const { error } = await supabase
        .from("ads_slots")
        .update({ position: update.position, updated_at: new Date().toISOString() })
        .eq("id", update.id)

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to reorder ads"
    console.error("[v0] POST /api/ads/reorder error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
