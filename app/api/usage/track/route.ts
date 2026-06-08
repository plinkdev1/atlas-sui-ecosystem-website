import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { badRequest, serverError } from "@/lib/auth-middleware"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch (e) {
            console.error("[v0] Cookie error:", e)
          }
        },
      },
    })

    const {
      apiKeyHash,
      endpoint,
      statusCode,
      responseTime,
      requestSizeBytes = 0,
      responseSizeBytes = 0,
    } = await request.json()

    if (!apiKeyHash || !endpoint || statusCode === undefined || !responseTime) {
      return badRequest("Missing required fields: apiKeyHash, endpoint, statusCode, responseTime")
    }

    // Get API key ID from hash
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from("api_keys")
      .select("id, user_id, monthly_quota")
      .eq("key_hash", apiKeyHash)
      .single()

    if (apiKeyError || !apiKeyData) {
      console.error("[v0] Invalid API key:", apiKeyError)
      return badRequest("Invalid API key")
    }

    // Log usage
    const { error: logError } = await supabase.from("usage_logs").insert({
      api_key_id: apiKeyData.id,
      endpoint,
      method: "GET", // Can be enhanced to accept method in request
      status_code: statusCode,
      response_time_ms: responseTime,
      request_size_bytes: requestSizeBytes,
      response_size_bytes: responseSizeBytes,
      ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
      user_agent: request.headers.get("user-agent"),
    })

    if (logError) {
      console.error("[v0] Error logging usage:", logError)
      return serverError("Failed to log usage")
    }

    // Update quota usage for current month
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const { data: quotaData, error: quotaError } = await supabase
      .from("quota_usage")
      .select("id, requests_used")
      .eq("api_key_id", apiKeyData.id)
      .eq("month", monthStart.toISOString().split("T")[0])
      .single()

    if (quotaError && quotaError.code !== "PGRST116") {
      console.error("[v0] Error fetching quota:", quotaError)
      return serverError("Failed to update quota")
    }

    if (quotaData) {
      // Update existing quota
      const newRequestCount = quotaData.requests_used + 1
      const { error: updateError } = await supabase
        .from("quota_usage")
        .update({
          requests_used: newRequestCount,
          status:
            newRequestCount >= apiKeyData.monthly_quota
              ? "limited"
              : newRequestCount >= apiKeyData.monthly_quota * 0.9
                ? "warning"
                : "active",
        })
        .eq("id", quotaData.id)

      if (updateError) {
        console.error("[v0] Error updating quota:", updateError)
      }
    } else {
      // Create new quota record
      const { error: insertError } = await supabase.from("quota_usage").insert({
        api_key_id: apiKeyData.id,
        month: monthStart.toISOString().split("T")[0],
        requests_used: 1,
        requests_limit: apiKeyData.monthly_quota,
        status: "active",
      })

      if (insertError) {
        console.error("[v0] Error creating quota record:", insertError)
      }
    }

    const remainingQuota = Math.max(0, apiKeyData.monthly_quota - (quotaData?.requests_used || 0))

    return NextResponse.json({
      remainingQuota,
      resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error in usage tracking:", error)
    return serverError()
  }
}
