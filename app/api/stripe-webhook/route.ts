import { addAirpoints, getOrCreateBalance, updateAirpointsTier } from "@/lib/supabase/airpoints"
import { createServerClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover" as any, // Cast to any to avoid future type mismatches if version changes
})

export async function POST(req: NextRequest) {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")

    let event: Stripe.Event

    try {
        if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
            // In development without webhook secret, skip verification if needed
            // But for safety, we assume it's there
            return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 })
        }
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err: any) {
        console.error(`[Stripe Webhook] Error verifying signature: ${err.message}`)
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Custom data logic (Stripe sessions usually store user_id in metadata)
    const session = event.data.object as any
    const userId = session.metadata?.user_id
    const customerEmail = session.customer_details?.email || session.email

    if (!userId) {
        console.warn("[Stripe Webhook] No user_id found in metadata for event:", event.type)
        // We might still want to proceed if we can find by email
    }

    try {
        switch (event.type) {
            case "checkout.session.completed":
            case "invoice.paid":
                const subscriptionId = session.subscription as string
                const subscription = await stripe.subscriptions.retrieve(subscriptionId)
                const priceId = subscription.items.data[0].price.id

                // Map Price ID to Tier
                let tier: "free" | "pro" | "pro+" = "free"
                if (priceId === process.env.STRIPE_PRO_PLUS_PRICE_ID) tier = "pro+"
                else if (priceId === process.env.STRIPE_PRO_PRICE_ID) tier = "pro"

                if (userId) {
                    const expiry = new Date()
                    expiry.setDate(expiry.getDate() + 30)

                    await supabase.from("subscriptions").upsert({
                        user_id: userId,
                        tier,
                        status: "active",
                        expiry: expiry.toISOString(),
                    }, { onConflict: "user_id" })

                    // Sync Airpoints
                    await getOrCreateBalance(userId)
                    await updateAirpointsTier(userId, tier)

                    if (event.type === "checkout.session.completed") {
                        const initialPoints = tier === "pro+" ? 300 : tier === "pro" ? 100 : 0
                        if (initialPoints > 0) {
                            await addAirpoints(userId, "", initialPoints, "earn_subscription", `Initial ${tier.toUpperCase()} bonus points from Stripe`)
                        }
                    }

                    await supabase.from("subscription_history").insert({
                        user_id: userId,
                        event_type: event.type === "checkout.session.completed" ? "created" : "renewed",
                        tier,
                        timestamp: new Date().toISOString(),
                    })
                }
                break;

            case "customer.subscription.deleted":
            case "customer.subscription.updated":
                if (event.type === "customer.subscription.deleted" || (session.status === "canceled" || session.status === "unpaid")) {
                    if (userId) {
                        await supabase.from("subscriptions")
                            .update({ tier: "free", status: "canceled" })
                            .eq("user_id", userId)

                        await updateAirpointsTier(userId, "free")

                        await supabase.from("subscription_history").insert({
                            user_id: userId,
                            event_type: "canceled",
                            tier: "free",
                            timestamp: new Date().toISOString(),
                        })
                    }
                }
                break;
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error("[Stripe Webhook] Processing error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
