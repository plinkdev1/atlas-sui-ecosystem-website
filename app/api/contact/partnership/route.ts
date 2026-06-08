import { type NextRequest, NextResponse } from "next/server"
import { createServerClient_ } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { name, email, company, contactType, message, phone } = body

    if (!name || !email || !company || !contactType || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const supabase = await createServerClient_()

    const { data, error } = await supabase
      .from("partnership_inquiries")
      .insert([
        {
          name,
          email,
          company,
          phone: phone || null,
          inquiry_type: contactType,
          message,
          status: "pending",
        },
      ])
      .select()

    if (error) {
      console.error("[v0] Supabase Insert Error:", error)
      return NextResponse.json({ error: "Failed to save inquiry" }, { status: 500 })
    }

    console.log("[v0] Partnership Inquiry Saved:", {
      id: data?.[0]?.id,
      name,
      email,
      company,
      contactType,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        success: true,
        message: "Partnership inquiry received successfully",
        inquiryId: data?.[0]?.id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Partnership Contact Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
