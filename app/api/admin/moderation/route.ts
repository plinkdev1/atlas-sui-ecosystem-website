import { supabaseAdmin } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"


export async function GET() {
  try {
    const [
      { data: pendingListings },
      { data: moderationLogs },
      { data: pendingInquiries },
    ] = await Promise.all([
      supabaseAdmin.from("provider_listings").select("*").eq("status", "pending").order("created_at", { ascending: false }).limit(20),
      supabaseAdmin.from("moderation_logs").select("*").order("created_at", { ascending: false }).limit(50),
      supabaseAdmin.from("partnership_inquiries").select("*").eq("status", "pending").order("created_at", { ascending: false }).limit(20),
    ])

    return NextResponse.json({
      pendingListings: pendingListings || [],
      moderationLogs: moderationLogs || [],
      pendingInquiries: pendingInquiries || [],
    })
  } catch (error) {
    console.error("[v0] Admin moderation error:", error)
    return NextResponse.json({ error: "Failed to fetch moderation data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { action, targetId, targetType, reason, adminId } = await request.json()

    if (targetType === "listing") {
      const status = action === "approve" ? "approved" : "rejected"
      const updateData: Record<string, unknown> = { status }
      if (status === "approved") updateData.verified_at = new Date().toISOString()
      if (status === "rejected") {
        updateData.rejected_at = new Date().toISOString()
        updateData.rejection_reason = reason || "Does not meet listing criteria"
      }
      await supabaseAdmin.from("provider_listings").update(updateData).eq("id", targetId)
    }

    if (targetType === "inquiry") {
      const status = action === "approve" ? "approved" : "rejected"
      await supabaseAdmin.from("partnership_inquiries").update({ status }).eq("id", targetId)
    }

    // Log moderation action
    await supabaseAdmin.from("moderation_logs").insert({
      admin_id: adminId,
      listing_id: targetType === "listing" ? targetId : null,
      action: `${action}_${targetType}`,
      reason: reason || `${action} by admin`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Moderation action error:", error)
    return NextResponse.json({ error: "Failed to perform moderation action" }, { status: 500 })
  }
}
