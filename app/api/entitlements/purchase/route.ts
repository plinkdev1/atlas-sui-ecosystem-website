import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { withAuth, unauthorized, badRequest, serverError } from "@/lib/auth-middleware"

export async function POST(request: NextRequest) {
  try {
    const auth = await withAuth(request)
    if (!auth.valid || !auth.userId) {
      return unauthorized()
    }

    const { providerId, tier, coinType } = await request.json()

    // Validate required fields
    if (!providerId || !tier || !coinType) {
      return badRequest("Missing required fields: providerId, tier, coinType")
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

    // Fetch provider details to get pricing
    const { data: provider, error: providerError } = await supabase
      .from("provider_listings")
      .select("*")
      .eq("id", providerId)
      .single()

    if (providerError || !provider) {
      return badRequest("Provider not found")
    }

    // Create entitlement record with pending status
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 1) // 1 month expiry

    const { data: entitlement, error: insertError } = await supabase
      .from("entitlements")
      .insert({
        user_id: auth.userId,
        provider_id: providerId,
        tier,
        coin_type: coinType,
        status: "pending",
        expires_at: expiresAt.toISOString(),
        payment_method: "onchain",
      })
      .select()
      .single()

    if (insertError || !entitlement) {
      console.error("[v0] Error creating entitlement:", insertError)
      return serverError("Failed to create entitlement")
    }

    // In production, this would trigger a blockchain transaction
    // For now, return transaction payload that frontend will sign
    return NextResponse.json(
      {
        entitlementId: entitlement.id,
        status: "pending",
        transactionPayload: {
          to: process.env.PAYMENT_TREASURY || "0x0000",
          amount: "1000000000", // 1 SUI (in MIST)
          coinType: coinType,
          description: `Purchase ${tier} tier for ${provider.name}`,
        },
        expiresAt: entitlement.expires_at,
        message: "Sign transaction to complete purchase",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error in purchase API:", error)
    return serverError()
  }
}
