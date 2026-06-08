import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { withAuth, unauthorized, badRequest, serverError } from "@/lib/auth-middleware"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const auth = await withAuth(request)
    if (!auth.valid || !auth.userId) {
      return unauthorized()
    }

    const { rateLimit, monthlyQuota } = await request.json()

    if (rateLimit && (rateLimit < 1 || rateLimit > 10000)) {
      return badRequest("Rate limit must be between 1 and 10000")
    }

    if (monthlyQuota && (monthlyQuota < 1000 || monthlyQuota > 1000000000)) {
      return badRequest("Monthly quota must be between 1000 and 1 billion")
    }

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

    // Verify key belongs to user
    const { data: keyData, error: keyError } = await supabase
      .from("api_keys")
      .select("id")
      .eq("id", id)
      .eq("user_id", auth.userId)
      .single()

    if (keyError || !keyData) {
      return unauthorized("This API key does not belong to you")
    }

    const updateData: Record<string, number> = {}
    if (rateLimit) updateData.rate_limit = rateLimit
    if (monthlyQuota) updateData.monthly_quota = monthlyQuota

    const { data, error } = await supabase
      .from("api_keys")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", auth.userId)
      .select("id, name, rate_limit, monthly_quota, is_active")

    if (error) {
      console.error("[v0] Error updating API key:", error)
      return serverError("Failed to update API key")
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("[v0] Error in key update:", error)
    return serverError()
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const auth = await withAuth(request)
    if (!auth.valid || !auth.userId) {
      return unauthorized()
    }

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

    const { error } = await supabase
      .from("api_keys")
      .update({ is_active: false })
      .eq("id", id)
      .eq("user_id", auth.userId)

    if (error) {
      console.error("[v0] Error deleting API key:", error)
      return serverError("Failed to revoke API key")
    }

    return NextResponse.json({ revoked: true })
  } catch (error) {
    console.error("[v0] Error in key deletion:", error)
    return serverError()
  }
}
