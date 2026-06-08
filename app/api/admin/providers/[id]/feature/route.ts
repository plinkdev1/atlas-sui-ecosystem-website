import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin, forbiddenResponse } from "@/lib/admin-check"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const adminCheck = await verifyAdmin(request)
    if (!adminCheck.isAdmin) {
      return forbiddenResponse()
    }

    const { featured } = await request.json()

    if (typeof featured !== "boolean") {
      return NextResponse.json({ error: "Featured must be a boolean" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

    const { data: updated, error: updateError } = await supabase
      .from("provider_listings")
      .update({
        featured,
      })
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      console.error("[v0] Error updating featured status:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Log the moderation action (fire and forget - don't block on this)
    void supabase.from("moderation_logs").insert({
      admin_id: adminCheck.userId,
      listing_id: id,
      action: featured ? "feature" : "unfeature",
      created_at: new Date().toISOString(),
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[v0] Admin feature error:", error)
    return NextResponse.json({ error: "Failed to update featured status" }, { status: 500 })
  }
}
