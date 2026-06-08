import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export type UserRole = "user" | "admin" | "partner"

export interface AuthUser {
  id: string
  email?: string
  wallet_address?: string
  role: UserRole
  auth_method: "email" | "wallet" | "zklogin" | "passkey"
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) return null

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    const { payload } = await jwtVerify(token, secret)

    return payload as unknown as AuthUser
  } catch {
    return null
  }
}

export async function requireAuth(requiredRole?: UserRole): Promise<AuthUser> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized: Please sign in")
  }

  if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
    throw new Error(`Forbidden: ${requiredRole} role required`)
  }

  return user
}

export async function requireAdmin(): Promise<AuthUser> {
  return requireAuth("admin")
}

export async function requirePartner(): Promise<AuthUser> {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error("Unauthorized: Please sign in")
  }

  if (user.role !== "admin" && user.role !== "partner") {
    throw new Error("Forbidden: Partner or admin role required")
  }

  return user
}

export async function getUserRole(userId: string): Promise<UserRole> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data, error } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", userId)
    .single()

  if (error || !data) {
    return "user" // Default role
  }

  return data.role as UserRole
}

export async function updateUserRole(userId: string, role: UserRole): Promise<void> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { error } = await supabase.from("user_profiles").update({ role }).eq("id", userId)

  if (error) {
    throw new Error(`Failed to update user role: ${error.message}`)
  }
}
