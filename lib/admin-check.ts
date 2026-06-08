import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

// Verify user is admin
export async function verifyAdmin(request: NextRequest) {
  try {
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

    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return { isAdmin: false, userId: null, error: "Missing authorization" }
    }

    const token = authHeader.substring(7)
    const { data: userData } = await supabase.auth.getUser(token)

    if (!userData.user) {
      return { isAdmin: false, userId: null, error: "Invalid token" }
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("is_admin")
      .eq("id", userData.user.id)
      .single()

    if (!profile?.is_admin) {
      return { isAdmin: false, userId: userData.user.id, error: "Admin access required" }
    }

    return { isAdmin: true, userId: userData.user.id }
  } catch (error) {
    console.error("[v0] Admin verification error:", error)
    return { isAdmin: false, userId: null, error: "Verification failed" }
  }
}

export function forbiddenResponse(message = "Admin access required") {
  return NextResponse.json({ error: message }, { status: 403 })
}
