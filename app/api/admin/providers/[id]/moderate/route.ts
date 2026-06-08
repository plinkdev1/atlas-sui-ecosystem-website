import { createServerClient_ } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, featured, moderation_notes } = body

    const supabase = await createServerClient_()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (profileError || !profile?.is_admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Update provider with moderation data
    const { data: provider, error } = await supabase
      .from("providers")
      .update({
        status: status || undefined,
        featured: featured !== undefined ? featured : undefined,
        moderation_notes: moderation_notes || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 })
    }

    return NextResponse.json(provider)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to moderate provider"
    console.error("[v0] Provider moderation error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
