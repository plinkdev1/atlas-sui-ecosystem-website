import { createServerClient_ } from "@/lib/supabase/server"
import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Verify provider ownership
    const { data: provider, error: providerError } = await supabase
      .from("providers")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (providerError || !provider) {
      return NextResponse.json({ error: "Provider not found or unauthorized" }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`provider-logos/${id}/${file.name}`, file, {
      access: "public",
    })

    // Update provider listing with logo URL
    const { data: listing, error: updateError } = await supabase
      .from("provider_listings")
      .update({ logo_url: blob.url })
      .eq("provider_id", id)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json({ logoUrl: blob.url, listing })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to upload logo"
    console.error("[v0] Logo upload error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
