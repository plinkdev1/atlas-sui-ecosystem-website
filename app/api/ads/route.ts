import { createServerClient_ } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[v0] Supabase environment variables not configured")
      return NextResponse.json({ ads: [] })
    }

    const supabase = await createServerClient_()
    const adminOnly = request.nextUrl.searchParams.get("all") === "true"

    let query = supabase.from("ads_slots").select("*")

    if (!adminOnly) {
      query = query.eq("active", true)
    }

    const { data, error } = await query.order("position", { ascending: true })

    if (error) throw error

    return NextResponse.json({ ads: data || [] })
  } catch (error) {
    console.error("[v0] GET /api/ads error:", error)
    // Return empty ads list instead of error to prevent page crashes
    return NextResponse.json({ ads: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

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

    const { title, tagline, image_url, link_url, cta_text, active, position } = body

    if (!title || !image_url) {
      return NextResponse.json({ error: "Title and image_url are required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("ads_slots")
      .insert([
        {
          title,
          tagline: tagline || "",
          image_url,
          link_url: link_url || "",
          cta_text: cta_text || "Learn More",
          active: active !== false,
          position: position || 0,
          created_by: sessionData.session.user.id,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] POST /api/ads error:", error)
    return NextResponse.json({ error: "Failed to create ad" }, { status: 500 })
  }
}
