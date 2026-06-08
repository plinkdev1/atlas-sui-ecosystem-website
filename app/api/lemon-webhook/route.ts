import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { createServerClient } from "@/lib/supabase/server"
import { getOrCreateBalance, updateAirpointsTier, addAirpoints } from "@/lib/supabase/airpoints"

interface LemonEvent {
  data: {
    type: string
    attributes: {
      status?: string
      customer_email?: string
      product_name?: string
      variant_name?: string
      pause_at?: string
      resume_at?: string
      ends_at?: string
      renews_at?: string
      created_at?: string
    }
    relationships?: {
      customer?: {
        data: {
          id: string
        }
      }
    }
  }
  meta?: {
    custom_data?: {
      user_id?: string
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("X-Signature") || req.headers.get("x-signature")
    const body = await req.text()

    // Verify webhook signature if secret is configured
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
    if (webhookSecret && signature) {
      const hash = crypto.createHmac("sha256", webhookSecret).update(body).digest("hex")
      if (hash !== signature) {
        console.error("[v0] Invalid Lemon Squeezy webhook signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    const event: LemonEvent = JSON.parse(body)
    const eventType = event.data?.type
    const attributes = event.data?.attributes
    const customData = event.meta?.custom_data

    console.log("[v0] Lemon Squeezy webhook:", eventType, attributes?.customer_email)

    // Only process subscription events
    if (!eventType?.includes("subscription")) {
      return NextResponse.json({ success: true })
    }

    const supabase = await createServerClient()
    const email = attributes?.customer_email
    const customUserId = (customData?.user_id as string | undefined) || null

    if (!email && !customUserId) {
      console.warn("[v0] Webhook missing user identification")
      return NextResponse.json({ success: true })
    }

    // Determine tier from variant name or product name
    let tier: "free" | "pro" | "pro+" = "free"
    const productName = attributes?.variant_name || attributes?.product_name || ""
    if (productName.toLowerCase().includes("pro+") || productName.toLowerCase().includes("pro plus")) {
      tier = "pro+"
    } else if (productName.toLowerCase().includes("pro")) {
      tier = "pro"
    }

    // Get user ID from email
    let userId: string | null = customUserId || null

    if (!userId && email) {
      try {
        const { data: listResponse, error: userError } = await supabase.auth.admin.listUsers()
        
        // Type guard: ensure listResponse has the expected structure
        if (listResponse && Array.isArray(listResponse.users)) {
          const user = listResponse.users.find((u: { email?: string }) => u.email === email)
          if (user) {
            userId = user.id
          }
        }
      } catch (error) {
        console.warn("[v0] Error listing users:", error)
      }
    }

    if (!userId) {
      console.warn("[v0] Could not find user for email:", email)
      return NextResponse.json({ success: true })
    }

    // Handle different event types
    if (eventType === "order:created" || eventType === "subscription:created" || eventType === "subscription:updated") {
      // Subscription is active
      const status = attributes?.status || "active"

      if (status === "active" || status === "on_trial") {
        const expiry = new Date()
        expiry.setDate(expiry.getDate() + 30) // 30 days from now

        // Upsert subscription
        const { error } = await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            tier,
            status: "active",
            expiry: expiry.toISOString(),
          },
          { onConflict: "user_id" }
        )

        if (error) {
          console.error("[v0] Error updating subscription:", error)
          return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
        }

        // Sync Airpoints: Update tier and credit initial points
        try {
          // Ensure Airpoints balance exists
          await getOrCreateBalance(userId)

          // Update tier in Airpoints
          await updateAirpointsTier(userId, tier)

          // Credit initial points if new subscription
          if (eventType === "subscription:created" || eventType === "order:created") {
            const initialPoints = tier === "pro+" ? 300 : tier === "pro" ? 100 : 0
            if (initialPoints > 0) {
              await addAirpoints(userId, "", initialPoints, "earn_subscription", `Initial ${tier.toUpperCase()} bonus points from Lemon Squeezy`)
            }
          }

          console.log(`[v0] Airpoints synced for subscription: tier=${tier}`)
        } catch (airpointsError) {
          console.error("[v0] Exception syncing Airpoints:", airpointsError)
          // Don't block subscription on Airpoints sync error
        }

        // Log history
        await supabase.from("subscription_history").insert({
          user_id: userId,
          event_type: eventType === "subscription:created" ? "created" : "renewed",
          tier,
          timestamp: new Date().toISOString(),
        })

        console.log(`[v0] Subscription updated for user ${userId}:`, tier, "active")
      }
    } else if (eventType === "subscription:cancelled" || eventType === "subscription:paused") {
      // Subscription is canceled or paused
      const { error } = await supabase
        .from("subscriptions")
        .update({ tier: "free", status: "canceled" })
        .eq("user_id", userId)

      if (error) {
        console.error("[v0] Error canceling subscription:", error)
        return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 })
      }

      // Sync Airpoints: Update tier to free (keeps existing balance)
      try {
        await updateAirpointsTier(userId, "free")
        console.log("[v0] Airpoints synced to free tier on subscription cancellation")
      } catch (airpointsError) {
        console.error("[v0] Exception syncing Airpoints on cancellation:", airpointsError)
        // Don't block cancellation on Airpoints sync error
      }

      // Log history
      await supabase.from("subscription_history").insert({
        user_id: userId,
        event_type: "canceled",
        tier: "free",
        timestamp: new Date().toISOString(),
      })

      console.log(`[v0] Subscription canceled for user ${userId}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
