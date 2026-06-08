import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { withAuth, unauthorized, badRequest, serverError } from "@/lib/auth-middleware"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await withAuth(request)
    if (!auth.valid || !auth.userId) {
      return unauthorized()
    }

    const { id } = await params

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

    // Verify user owns this entitlement
    const { data: entitlement, error: entitlementError } = await supabase
      .from("entitlements")
      .select("*")
      .eq("id", id)
      .eq("user_id", auth.userId)
      .single()

    if (entitlementError || !entitlement) {
      return badRequest("Entitlement not found or access denied")
    }

    if (entitlement.status === "cancelled") {
      return badRequest("Entitlement is already cancelled")
    }

    // Calculate refund (pro-rata based on remaining days)
    const expiresAt = new Date(entitlement.expires_at)
    const now = new Date()
    const totalDays = Math.max(
      1,
      (new Date(entitlement.purchased_at).getTime() - expiresAt.getTime()) / (1000 * 60 * 60 * 24),
    )
    const remainingDays = Math.max(0, (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    const refundAmount = entitlement.amount_paid ? (entitlement.amount_paid * remainingDays) / totalDays : 0

    // Update entitlement status
    const { error: updateError } = await supabase
      .from("entitlements")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (updateError) {
      console.error("[v0] Error cancelling entitlement:", updateError)
      return serverError()
    }

    return NextResponse.json(
      {
        entitlementId: id,
        status: "cancelled",
        refundAmount: refundAmount,
        refundCurrency: entitlement.coin_type || "SUI",
        message: "Entitlement cancelled successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error in cancel API:", error)
    return serverError()
  }
}
