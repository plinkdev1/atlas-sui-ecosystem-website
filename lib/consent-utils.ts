/**
 * Centralized utility for managing user consent and persistent identifiers
 */

export const STORAGE_KEYS = {
    ANON_ID: "atlas_anon_id",
    COOKIE_ACCEPTED: "atlas_cookie_accepted",
    DISCLAIMER_ACCEPTED: "atlas_disclaimer_accepted",
}

/**
 * Gets a stable identifier for the user.
 * Prioritizes wallet address (if provided), then calls localStorage, then falls back to a session ID.
 */
export const getStableIdentifier = (walletAddress?: string | null) => {
    if (walletAddress) return walletAddress

    if (typeof window === "undefined") return "server-session"

    try {
        let anonId = localStorage.getItem(STORAGE_KEYS.ANON_ID)
        if (!anonId) {
            anonId = crypto.randomUUID?.() || `anon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            localStorage.setItem(STORAGE_KEYS.ANON_ID, anonId)
        }
        return anonId
    } catch {
        return "fallback-id"
    }
}

/**
 * Sets a persistent cookie for long-term consent tracking
 */
export const setPersistentCookie = (name: string, value: string, days = 365) => {
    if (typeof document === "undefined") return

    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    const expires = "; expires=" + date.toUTCString()
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax"
}
