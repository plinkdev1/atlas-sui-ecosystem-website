import { unauthorized, withAuth } from "@/lib/auth-middleware"
import { createProvider, getProvidersByUserId } from "@/lib/db/providers"
import { ProviderSchema } from "@/lib/validations"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request)
    if (!authResult.valid) {
      return unauthorized(authResult.error)
    }

    const providers = await getProvidersByUserId(authResult.userId!)

    return NextResponse.json(providers || [])
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch providers"
    console.error("[v0] Providers GET error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await withAuth(request)
    if (!authResult.valid) {
      return unauthorized(authResult.error)
    }

    const body = await request.json()

    // Validate with Zod
    const validation = ProviderSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data", details: validation.error.format() }, { status: 400 })
    }

    const provider = await createProvider(authResult.userId!, validation.data)

    return NextResponse.json(provider, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create provider"
    console.error("[v0] Providers POST error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
