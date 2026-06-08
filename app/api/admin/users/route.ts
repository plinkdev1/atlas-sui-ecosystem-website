import { supabaseAdmin } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    let query = supabaseAdmin
      .from("user_profiles")
      .select("id, wallet_address, role, is_admin, auth_method, network, created_at, updated_at", { count: "exact" })

    if (role && role !== "all") query = query.eq("role", role)
    if (search) query = query.ilike("wallet_address", `%${search}%`)

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({ users: data || [], total: count || 0, page, limit })
  } catch (error) {
    console.error("[v0] Admin users error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId, role, action } = await request.json()

    if (action === "ban") {
      const { error } = await supabaseAdmin.from("user_profiles").update({ role: "banned" }).eq("id", userId)
      if (error) throw error
      return NextResponse.json({ success: true, message: "User banned" })
    }

    if (action === "change_role" && role) {
      const isAdmin = role === "admin"
      const { error } = await supabaseAdmin.from("user_profiles").update({ role, is_admin: isAdmin }).eq("id", userId)
      if (error) throw error
      return NextResponse.json({ success: true, message: `Role changed to ${role}` })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Admin user update error:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
