import { createServerClient_ } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createServerClient_()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: provider, error } = await supabase
      .from("providers")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error) throw error
    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 })
    }

    return NextResponse.json(provider)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch provider"
    console.error("[v0] Provider GET error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, pricing, features, website, logo, category } = body

    const supabase = await createServerClient_()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: provider, error } = await supabase
      .from("providers")
      .update({
        name,
        description,
        pricing,
        features: features || [],
        website,
        logo,
        category,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) throw error
    if (!provider) {
      return NextResponse.json({ error: "Provider not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json(provider)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update provider"
    console.error("[v0] Provider PATCH error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createServerClient_()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase.from("providers").delete().eq("id", id).eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete provider"
    console.error("[v0] Provider DELETE error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
