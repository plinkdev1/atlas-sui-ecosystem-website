"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Fingerprint, UserPlus } from "lucide-react"
import { startRegistration, startAuthentication } from "@simplewebauthn/browser"

export function PasskeyAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<"login" | "register">("login")

  const handlePasskeyRegister = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Get registration options from server
      const optionsResponse = await fetch("/api/auth/passkey/register/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: `user_${Date.now()}` }),
      })

      const options = await optionsResponse.json()

      // Start WebAuthn registration
      const credential = await startRegistration(options)

      // Verify registration with server
      const verifyResponse = await fetch("/api/auth/passkey/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      })

      const { success, token } = await verifyResponse.json()

      if (success && token) {
        // Store token and redirect
        localStorage.setItem("auth_token", token)
        window.location.href = "/"
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasskeyLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Get authentication options from server
      const optionsResponse = await fetch("/api/auth/passkey/login/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const options = await optionsResponse.json()

      // Start WebAuthn authentication
      const credential = await startAuthentication(options)

      // Verify authentication with server
      const verifyResponse = await fetch("/api/auth/passkey/login/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      })

      const { success, token } = await verifyResponse.json()

      if (success && token) {
        // Store token and redirect
        localStorage.setItem("auth_token", token)
        window.location.href = "/"
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button
          variant={mode === "login" ? "default" : "outline"}
          onClick={() => setMode("login")}
          className="flex-1"
        >
          Sign In
        </Button>
        <Button
          variant={mode === "register" ? "default" : "outline"}
          onClick={() => setMode("register")}
          className="flex-1"
        >
          Register
        </Button>
      </div>

      {mode === "register" ? (
        <Button onClick={handlePasskeyRegister} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Register with Passkey
            </>
          )}
        </Button>
      ) : (
        <Button onClick={handlePasskeyLogin} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Authenticating...
            </>
          ) : (
            <>
              <Fingerprint className="mr-2 h-4 w-4" />
              Sign In with Passkey
            </>
          )}
        </Button>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <p className="text-xs text-muted-foreground">
        Use biometrics (Face ID, Touch ID, Windows Hello) or device PIN to sign in securely.
      </p>
    </div>
  )
}
