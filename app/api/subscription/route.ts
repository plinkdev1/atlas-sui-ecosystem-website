import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getUserSubscription, updateSubscription, cancelSubscription, getUserSubscriptionHistory } from "@/lib/supabase/subscriptions"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get subscription
    const subscription = await getUserSubscription(user.id)

    // If no subscription exists, create a free one
    if (!subscription) {
      const { data } = await supabase
        .from("subscriptions")
        .insert({
          user_id: user.id,
          tier: "free",
          status: "active",
          expiry: null,
        })
        .select()
        .single()

      return NextResponse.json({ subscription: data })
    }

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error("[v0] GET /api/subscription error:", error)
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { action, tier, expiryDays } = await request.json()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (action === "upgrade") {
      const subscription = await updateSubscription(user.id, tier || "pro", expiryDays || 30)
      return NextResponse.json({ subscription })
    }

    if (action === "cancel") {
      const subscription = await cancelSubscription(user.id)
      return NextResponse.json({ subscription })
    }

    if (action === "history") {
      const history = await getUserSubscriptionHistory(user.id)
      return NextResponse.json({ history })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] POST /api/subscription error:", error)
    return NextResponse.json({ error: "Failed to process subscription" }, { status: 500 })
  }
}
