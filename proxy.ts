import { jwtVerify } from "jose"
import { type NextRequest, NextResponse } from "next/server"

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET || "fallback_secret_for_build_only"
const secret = new TextEncoder().encode(JWT_SECRET)

// Combine routes from both old files
const protectedApiPaths = ["/api/wallet/cleanup", "/api/transactions", "/api/infra/ratings"]
const publicApiRoutes = ["/api/auth/wallet", "/api/auth/signout", "/api/cookies", "/api/disclaimers"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. API Route Protection (from middleware.ts and old proxy.ts)
  if (pathname.startsWith("/api")) {
    const isPublicApi = publicApiRoutes.some(route => pathname.startsWith(route))

    // Match either protected paths from proxy.ts OR admin paths from middleware.ts
    const needsAuth = !isPublicApi && (
      protectedApiPaths.some(p => pathname.startsWith(p)) ||
      pathname.startsWith("/api/admin")
    )

    if (needsAuth) {
      const authHeader = request.headers.get("authorization")
      const sessionCookie = request.cookies.get("atlas_session")?.value
      const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : sessionCookie

      if (!token) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }

      try {
        // Verify JWT using jose (Edge compatible)
        const { payload: decoded } = await jwtVerify(token, secret) as any

        // Protect Admin API
        if (pathname.startsWith("/api/admin") && !decoded.is_admin) {
          return NextResponse.json({ error: "Forbidden: Admin access only" }, { status: 403 })
        }

        // Inject user info into headers for downstream use
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set("x-user-id", decoded.sub || (decoded.wallet_address as string))
        requestHeaders.set("x-wallet-address", decoded.wallet_address as string)
        requestHeaders.set("x-user-role", (decoded.role as string) || "user")
        requestHeaders.set("x-subscription-tier", (decoded.subscription_tier as string) || "free")

        return NextResponse.next({
          request: { headers: requestHeaders },
        })
      } catch (error) {
        console.error("[Proxy] JWT Verification Failed:", error)
        return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
      }
    }
  }

  // 2. Frontend Role-based redirection (from middleware.ts)
  const sessionCookie = request.cookies.get("atlas_session")?.value
  if (sessionCookie) {
    try {
      const { payload: decoded } = await jwtVerify(sessionCookie, secret) as any

      if (pathname.startsWith("/admin") && !decoded.is_admin) {
        return NextResponse.redirect(new URL("/", request.url))
      }

      if (pathname.startsWith("/provider-dashboard") && decoded.role !== "provider" && !decoded.is_admin) {
        return NextResponse.redirect(new URL("/partners", request.url))
      }
    } catch (e) {
      // Token invalid - clear it if it's a frontend route
      const response = NextResponse.next()
      response.cookies.delete("atlas_session")
      return response
    }
  } else {
    // Unauthenticated access to protected frontend routes
    const protectedFrontendPaths = ["/dashboard", "/admin", "/provider-dashboard"]
    if (protectedFrontendPaths.some(p => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  // Broad matcher to cover both frontend and API routes
  matcher: ["/((?!_next|public|favicon).*)"],
}
