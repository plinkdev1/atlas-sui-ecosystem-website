import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin, forbiddenResponse } from "@/lib/admin-check"

interface RevenueRecord {
  amount_usd?: number
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

    const [usersResult, providersResult, transactionsResult, revenueResult] = await Promise.all([
      supabase.from("user_profiles").select("id", { count: "exact" }),
      supabase.from("provider_listings").select("id", { count: "exact" }).eq("status", "approved"),
      supabase.from("transactions").select("id", { count: "exact" }).eq("status", "success"),
      supabase.from("revenue_records").select("amount_usd").eq("status", "recorded"),
    ])

    const totalRevenue = (revenueResult.data || []).reduce((sum: number, record: RevenueRecord) => sum + (record.amount_usd || 0), 0)

    return NextResponse.json({
      users: {
        total: usersResult.count || 0,
      },
      providers: {
        total: providersResult.count || 0,
      },
      transactions: {
        total: transactionsResult.count || 0,
      },
      revenue: {
        total: Number.parseFloat(totalRevenue.toFixed(2)),
        currency: "USD",
      },
    })
  } catch (error: unknown) {
    console.error("[v0] Admin analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
