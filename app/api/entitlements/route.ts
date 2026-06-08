import { badRequest, serverError, unauthorized, withAuth } from "@/lib/auth-middleware"
import { verifySuiTransaction } from "@/lib/sui-verify"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

const TREASURY_ADDRESS = process.env.PAYMENT_TREASURY || process.env.NEXT_PUBLIC_PAYMENT_TREASURY || "0x98f654b0fa6302497675bf646399a9b70868a2bf61320098f654b0fa63024976"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      },
    )

    const { user_id, provider_id, tier, transaction_digest, amount } = await request.json()

    if (!user_id || !provider_id || !tier || !transaction_digest) {
      return badRequest("Missing required fields")
    }

    // 1. Verify Sui transaction on-chain (CRITICAL SECURITY STEP)
    console.log("[v0] Verifying Sui transaction:", transaction_digest)
    const verification = await verifySuiTransaction(transaction_digest, TREASURY_ADDRESS, amount)

    if (!verification.success) {
      console.error("[v0] Sui transaction verification failed:", verification.error)
      return badRequest(`Transaction verification failed: ${verification.error}`)
    }

    // Double check sender address matches user address (optional but recommended)
    if (verification.sender && user_id.toLowerCase() !== verification.sender.toLowerCase()) {
      console.warn("[v0] Transaction sender address does not match user wallet:", verification.sender, user_id)
      // More strict mode: return unauthorized if addresses don't match
    }

    // 2. Insert into Supabase
    const { data, error } = await supabase
      .from("entitlements")
      .insert({
        user_id,
        provider_id,
        tier,
        transaction_digest,
      })
      .select()

    if (error) {
      console.error("[v0] Supabase error storing entitlement:", error)
      return serverError(error.message)
    }

    console.log("[v0] Entitlement stored successfully:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error in entitlements API:", error)
    return serverError()
  }
}

export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "active"
    const providerId = searchParams.get("provider_id")

    let query = supabase
      .from("entitlements")
      .select(
        `
        *,
        provider_listings:provider_id(id, name, logo_url, category)
      `,
      )
      .eq("user_id", auth.userId)

    if (status !== "all") {
      query = query.eq("status", status)
    }

    if (providerId) {
      query = query.eq("provider_id", providerId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase error fetching entitlements:", error)
      return serverError(error.message)
    }

    // Separate active and expired entitlements
    const now = new Date()
    const active = data.filter((e) => e.status === "active" && new Date(e.expires_at) > now)
    const expired = data.filter((e) => e.status !== "active" || (e.expires_at && new Date(e.expires_at) <= now))

    return NextResponse.json(
      {
        entitlements: data,
        active,
        expired,
        total: data.length,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error in entitlements API:", error)
    return serverError()
  }
}
