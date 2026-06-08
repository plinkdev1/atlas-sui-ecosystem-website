"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, KeyRound } from "lucide-react"

export function ZKLoginAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleZKLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Initialize OAuth flow (Google, Facebook, Twitch)
      const response = await fetch("/api/auth/zklogin/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "google" }),
      })

      const { authUrl, nonce } = await response.json()

      // Store nonce for verification
      sessionStorage.setItem("zklogin_nonce", nonce)

      // Redirect to OAuth provider
      window.location.href = authUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : "ZKLogin failed")
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleZKLogin}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <KeyRound className="mr-2 h-4 w-4" />
            ZKLogin with Google
          </>
        )}
      </Button>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <p className="text-xs text-muted-foreground">
        ZKLogin creates a temporary Sui wallet using your Google account. No extensions needed.
      </p>
    </div>
  )
}
