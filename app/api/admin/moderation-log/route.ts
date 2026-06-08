import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin, forbiddenResponse } from "@/lib/admin-check"

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
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const {
      data: logs,
      error: logsError,
      count,
    } = await supabase
      .from("moderation_logs")
      .select(
        `
        *,
        admin:admin_id(id, wallet_address),
        provider_listings:listing_id(id, name)
      `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (logsError) {
      console.error("[v0] Error fetching moderation logs:", logsError)
      return NextResponse.json({ error: logsError.message }, { status: 500 })
    }

    return NextResponse.json({
      logs,
      total: count || 0,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error("[v0] Moderation log GET error:", error)
    return NextResponse.json({ error: "Failed to fetch moderation logs" }, { status: 500 })
  }
}
