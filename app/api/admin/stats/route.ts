import { supabaseAdmin } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"


export async function GET() {
  try {
    const [
      { count: totalUsers },
      { count: adminUsers },
      { count: partnerUsers },
      { count: totalProviders },
      { count: pendingProviders },
      { count: totalEntitlements },
      { count: totalFeedback },
      { count: totalBridgeLogs },
      { count: totalNftTrades },
      { count: totalInquiries },
    ] = await Promise.all([
      supabaseAdmin.from("user_profiles").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("user_profiles").select("*", { count: "exact", head: true }).eq("role", "admin"),
      supabaseAdmin.from("user_profiles").select("*", { count: "exact", head: true }).eq("role", "partner"),
      supabaseAdmin.from("providers").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("provider_listings").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabaseAdmin.from("entitlements").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabaseAdmin.from("feedback").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("bridge_logs").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("nft_trade_logs").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("partnership_inquiries").select("*", { count: "exact", head: true }).eq("status", "pending"),
    ])

    // Recent activity
    const { data: recentUsers } = await supabaseAdmin
      .from("user_profiles")
      .select("id, wallet_address, role, created_at")
      .order("created_at", { ascending: false })
      .limit(10)

    const { data: recentFeedback } = await supabaseAdmin
      .from("feedback")
      .select("id, rating, message, created_at")
      .order("created_at", { ascending: false })
      .limit(5)

    // Revenue totals
    const { data: revenueData } = await supabaseAdmin
      .from("revenue_records")
      .select("amount_usd, amount_sui")

    const totalRevenueUsd = revenueData?.reduce((sum, r) => sum + Number(r.amount_usd || 0), 0) || 0
    const totalRevenueSui = revenueData?.reduce((sum, r) => sum + Number(r.amount_sui || 0), 0) || 0

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        adminUsers: adminUsers || 0,
        partnerUsers: partnerUsers || 0,
        totalProviders: totalProviders || 0,
        pendingProviders: pendingProviders || 0,
        totalEntitlements: totalEntitlements || 0,
        totalFeedback: totalFeedback || 0,
        totalBridgeLogs: totalBridgeLogs || 0,
        totalNftTrades: totalNftTrades || 0,
        pendingInquiries: totalInquiries || 0,
        totalRevenueUsd,
        totalRevenueSui,
      },
      recentUsers: recentUsers || [],
      recentFeedback: recentFeedback || [],
    })
  } catch (error) {
    console.error("[v0] Admin stats error:", error)
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 })
  }
}
