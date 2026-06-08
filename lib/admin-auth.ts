// Optional: Wallet whitelist for extra security (comma-separated wallet addresses)
export const AUTHORIZED_ADMIN_WALLETS = (process.env.AUTHORIZED_ADMIN_WALLETS || "").split(",").filter(Boolean) || []

export const isDevMode = () => {
  return process.env.NODE_ENV === "development"
}

// Server-side only validation via API - credentials are NOT exposed to client
export const validateAdminCredentialsViaAPI = async (username: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.success === true
    }
    return false
  } catch (error) {
    console.error("[v0] Admin validation error:", error)
    return false
  }
}

export const isWalletAuthorized = (walletAddress: string): boolean => {
  if (AUTHORIZED_ADMIN_WALLETS.length === 0) return true // No whitelist = all authenticated admins allowed
  return AUTHORIZED_ADMIN_WALLETS.includes(walletAddress.toLowerCase())
}

export const getAdminAuthFromStorage = () => {
  if (typeof window === "undefined") return false
  return localStorage.getItem("admin-authenticated") === "true"
}

export const setAdminAuthToStorage = (isAuthenticated: boolean) => {
  if (typeof window === "undefined") return
  if (isAuthenticated) {
    localStorage.setItem("admin-authenticated", "true")
  } else {
    localStorage.removeItem("admin-authenticated")
  }
}
