import { createServerClient_ } from "../supabase/server"

/**
 * SEED DATA (Development Only)
 * run with: npx ts-node --project tsconfig.json lib/db/seed.ts
 * or similar depending on environment.
 */

async function seed() {
    console.log("🌱 Starting database seed...")
    const supabase = await createServerClient_()

    // 1. Seed Advertising Partners
    const ads = [
        { name: "Sui Foundation", website_url: "https://sui.io", logo_url: "https://sui.io/favicon.ico", is_active: true, sort_order: 1 },
        { name: "Mysten Labs", website_url: "https://mystenlabs.com", logo_url: "https://mystenlabs.com/favicon.ico", is_active: true, sort_order: 2 },
        { name: "Cetus Protocol", website_url: "https://cetus.zone", logo_url: "https://cetus.zone/favicon.ico", is_active: true, sort_order: 3 },
    ]

    const { error: adError } = await supabase.from("advertising_partners").upsert(ads, { onConflict: "name" })
    if (adError) console.error("Error seeding ads:", adError)
    else console.log("✅ Seeded advertising_partners")

    // 2. Seed Ad Slots
    const { data: partners } = await supabase.from("advertising_partners").select("id")
    if (partners && partners.length > 0) {
        const slots = partners.map((p, i) => ({
            name: `Featured Partner ${i + 1}`,
            description: "Static footer slot for featured ecosystem partners",
            partner_id: p.id,
            is_active: true
        }))

        const { error: slotError } = await supabase.from("ads_slots").upsert(slots, { onConflict: "name" })
        if (slotError) console.error("Error seeding slots:", slotError)
        else console.log("✅ Seeded ads_slots")
    }

    // 3. Seed some dummy Providers
    const { data: adminUser } = await supabase.from("user_profiles").select("id").eq("role", "admin").limit(1).single()

    if (adminUser) {
        const providers = [
            {
                user_id: adminUser.id,
                name: "Blockberry",
                description: "Leading Sui analytics and API provider",
                category: "Analytics",
                status: "approved",
                features: ["Rest API", "Webhook events", "Price history"]
            },
            {
                user_id: adminUser.id,
                name: "BlockVision",
                description: "Cloud indexing and RPC services for Sui",
                category: "Infrastructure",
                status: "approved",
                features: ["High availability RPC", "NFT Indexing", "Portfolio API"]
            }
        ]

        const { error: providerError } = await supabase.from("providers").upsert(providers, { onConflict: "name" })
        if (providerError) console.error("Error seeding providers:", providerError)
        else console.log("✅ Seeded providers")
    }

    console.log("🌿 Seed complete!")
}

// In Next.js environment we don't usually run this directly via ts-node easily
// so we export it so it can be called from an admin API if needed
export default seed
