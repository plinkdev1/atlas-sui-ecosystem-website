import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      },
    )

    // Check admin status
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("id", user.id).single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { partners } = await request.json()

    // Update all partners with new positions
    for (const partner of partners) {
      await supabase
        .from("advertising_partners")
        .update({ slot_position: partner.slot_position, updated_at: new Date().toISOString() })
        .eq("id", partner.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error reordering advertising partners:", error)
    return NextResponse.json({ error: "Failed to reorder partners" }, { status: 500 })
  }
}
