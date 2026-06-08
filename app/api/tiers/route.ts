import { NextResponse } from "next/server"

// Pricing tier definitions
const PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for getting started",
    price: 99,
    currency: "USD",
    monthlyRequests: 1000000,
    features: ["1M requests/month", "Basic support", "Single provider"],
    tier: "free",
  },
  {
    id: "growth",
    name: "Growth",
    description: "For growing applications",
    price: 299,
    currency: "USD",
    monthlyRequests: 5000000,
    features: ["5M requests/month", "Email support", "Up to 10 providers", "Usage analytics"],
    tier: "freemium",
  },
  {
    id: "pro",
    name: "Pro",
    description: "For professional use",
    price: 799,
    currency: "USD",
    monthlyRequests: 10000000,
    features: ["10M requests/month", "Priority support", "Unlimited providers", "Advanced analytics", "Custom SLAs"],
    tier: "premium",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Custom solutions for enterprises",
    price: 0, // Custom pricing
    currency: "USD",
    monthlyRequests: 0, // Unlimited
    features: ["Unlimited requests", "24/7 dedicated support", "Custom integrations", "SLA guarantee"],
    tier: "custom",
  },
]

export async function GET() {
  try {
    return NextResponse.json(
      {
        tiers: PRICING_TIERS,
        currency: "USD",
        billingPeriod: "monthly",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error fetching tiers:", error)
    return NextResponse.json({ error: "Failed to fetch pricing tiers" }, { status: 500 })
  }
}
