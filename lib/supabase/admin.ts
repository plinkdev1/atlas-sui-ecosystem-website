import { createClient } from "@supabase/supabase-js"

const getSupabaseAdmin = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
        if (process.env.NODE_ENV === "production") {
            throw new Error("Supabase admin environment variables are missing in production!")
        }

        console.warn(
            "[v0] Supabase admin environment variables not configured. Returning mock client for build safety."
        )
        const mockChain: any = {
            select: () => mockChain,
            eq: () => mockChain,
            ilike: () => mockChain,
            order: () => mockChain,
            limit: () => mockChain,
            range: () => mockChain,
            single: async () => ({ data: null, error: null }),
            maybeSingle: async () => ({ data: null, error: null }),
            then: (onfulfilled: any) => Promise.resolve({ data: [], count: 0, error: null }).then(onfulfilled),
            insert: async () => ({ data: null, error: null }),
            upsert: () => mockChain,
            update: () => mockChain,
            delete: async () => ({ data: null, error: null }),
        }

        return {
            from: () => mockChain,
        } as any
    }

    return createClient(supabaseUrl, supabaseServiceKey)
}

export const supabaseAdmin = getSupabaseAdmin()
