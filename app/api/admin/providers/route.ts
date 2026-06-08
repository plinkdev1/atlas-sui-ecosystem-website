import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin, forbiddenResponse } from "@/lib/admin-check"

interface ProviderListing {
  id: string
  status: "pending" | "approved" | "rejected"
  [key: string]: unknown
}

export async function GET(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request)
    if (!adminCheck.isAdmin) {
      return forbiddenResponse()
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "all"

    let query = supabase
      .from("provider_listings")
      .select(`
        *,
        providers:provider_id(id, name, user_id)
      `)
      .order("created_at", { ascending: false })

    if (status !== "all") {
      query = query.eq("status", status)
    }

    const { data: providers, error: providersError } = await query

    if (providersError) {
      console.error("[v0] Error fetching providers:", providersError)
      return NextResponse.json({ error: providersError.message }, { status: 500 })
    }

    const pending = providers?.filter((p: ProviderListing) => p.status === "pending").length || 0
    const approved = providers?.filter((p: ProviderListing) => p.status === "approved").length || 0
    const rejected = providers?.filter((p: ProviderListing) => p.status === "rejected").length || 0

    return NextResponse.json({
      providers,
      counts: { pending, approved, rejected },
    })
  } catch (error) {
    console.error("[v0] Admin providers GET error:", error)
    return NextResponse.json({ error: "Failed to fetch providers" }, { status: 500 })
  }
}
