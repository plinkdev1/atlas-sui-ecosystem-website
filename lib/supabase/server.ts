import { createServerClient as createSupabaseClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export const createServerClient = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn(
      "[v0] Supabase server environment variables not configured. Returning mock client for build safety."
    )
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: { message: "Supabase not configured" } }),
            maybeSingle: async () => ({ data: null, error: null }),
          }),
          maybeSingle: async () => ({ data: null, error: null }),
          order: () => ({
            limit: () => ({
              maybeSingle: async () => ({ data: null, error: null }),
            }),
          }),
        }),
        insert: async () => ({ data: null, error: { message: "Supabase not configured" } }),
        upsert: () => ({
          select: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        }),
        update: async () => ({ data: null, error: { message: "Supabase not configured" } }),
        delete: async () => ({ data: null, error: { message: "Supabase not configured" } }),
      }),
    } as any
  }

  const cookieStore = await cookies()

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  })
}

// Alias for backward compatibility with existing API routes
export const createServerClient_ = createServerClient
