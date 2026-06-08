import { createServerClient_ } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { rating, message, email } = body

    // Validation
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const supabase = await createServerClient_()

    // Get user if authenticated, otherwise anonymous feedback
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Insert feedback into database
    const { error } = await supabase.from("feedback").insert({
      rating,
      message: message.trim(),
      email: email && typeof email === "string" ? email.trim() : null,
      user_id: user?.id || null,
      created_at: new Date().toISOString(),
    })

    if (error) throw error

    return NextResponse.json({ success: true, message: "Feedback submitted successfully" })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit feedback"
    console.error("[v0] Feedback POST error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
