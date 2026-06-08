import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { withAuth, unauthorized, badRequest, serverError } from "@/lib/auth-middleware"
import { generateAPIKey, hashAPIKey } from "@/lib/api-key-utils"

export async function POST(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.valid || !auth.userId) {
      return unauthorized()
    }

    const { name, rateLimit = 100, monthlyQuota = 1000000 } = await request.json()

    if (!name || name.trim().length === 0) {
      return badRequest("API key name is required")
    }

    if (rateLimit < 1 || monthlyQuota < 1) {
      return badRequest("Rate limit and monthly quota must be positive numbers")
    }

    // Generate new API key
    const plainKey = generateAPIKey()
    const keyHash = await hashAPIKey(plainKey)

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

    // Calculate expiry (1 year from now)
    const expiresAt = new Date()
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)

    const { data, error } = await supabase
      .from("api_keys")
      .insert({
        user_id: auth.userId,
        name: name.trim(),
        key_hash: keyHash,
        rate_limit: rateLimit,
        monthly_quota: monthlyQuota,
        is_active: true,
        expires_at: expiresAt.toISOString(),
      })
      .select("id, name, created_at")

    if (error) {
      console.error("[v0] Error creating API key:", error)
      return serverError("Failed to create API key")
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("[v0] API key created but no data returned")
      return serverError("API key created but failed to retrieve details")
    }

    console.log("[v0] API key created successfully")

    // Type-safe access: TypeScript knows data is non-empty array here
    const keyData = data[0]!
    return NextResponse.json(
      {
        keyId: keyData.id,
        secretKey: plainKey,
        name: keyData.name,
        createdAt: keyData.created_at,
        expiresAt: expiresAt.toISOString(),
        message: "Save this key somewhere safe. You won't be able to see it again.",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Error in key generation:", error)
    return serverError()
  }
}
