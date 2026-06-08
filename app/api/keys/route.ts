import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { withAuth, unauthorized, serverError } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.valid || !auth.userId) {
      return unauthorized()
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch (e) {
            console.error("[v0] Cookie error:", e)
          }
        },
      },
    })

    const { data, error, count } = await supabase
      .from("api_keys")
      .select("id, name, is_active, rate_limit, monthly_quota, created_at, last_used_at, expires_at", {
        count: "exact",
      })
      .eq("user_id", auth.userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("[v0] Error fetching API keys:", error)
      return serverError("Failed to fetch API keys")
    }

    return NextResponse.json({
      keys: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        hasMore: offset + limit < (count || 0),
      },
    })
  } catch (error) {
    console.error("[v0] Error in keys list:", error)
    return serverError()
  }
}
