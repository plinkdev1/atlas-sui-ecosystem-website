"use client"

import { useWalletStore } from "@/lib/wallet-store"
import { useCurrentAccount, useSignPersonalMessage } from "@mysten/dapp-kit"
import { useCallback, useState } from "react"
import { toast } from "react-toastify"

export function useWalletAuth() {
    const currentAccount = useCurrentAccount()
    const { mutateAsync: signPersonalMessage } = useSignPersonalMessage()
    const [isAuthenticating, setIsAuthenticating] = useState(false)

    const setIsAuthenticated = useWalletStore((s) => s.setIsAuthenticated)
    const setAuthToken = useWalletStore((s) => s.setAuthToken)
    const setRole = useWalletStore((s) => s.setRole)
    const setIsAdmin = useWalletStore((s) => s.setIsAdmin)
    const isAuthenticated = useWalletStore((s) => s.isAuthenticated)
    const disconnectStore = useWalletStore((s) => s.disconnect)

    const parseJwt = (token: string) => {
        try {
            return JSON.parse(atob(token.split(".")[1]))
        } catch (e) {
            return null
        }
    }

    const login = useCallback(async () => {
        if (!currentAccount) return

        try {
            setIsAuthenticating(true)

            // 1. Create a session on the server
            const sessionRes = await fetch("/api/auth/wallet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "create_session",
                    walletAddress: currentAccount.address,
                }),
            })

            const sessionData = await sessionRes.json()
            if (!sessionRes.ok) throw new Error(sessionData.error || "Failed to create session")

            const { sessionToken, messageToSign } = sessionData

            // 2. Sign the message
            const signResult = await signPersonalMessage({
                message: new TextEncoder().encode(messageToSign),
            })

            // 3. Verify signature on the server
            const verifyRes = await fetch("/api/auth/wallet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "verify_signature",
                    walletAddress: currentAccount.address,
                    signature: signResult.signature,
                    sessionToken,
                    signedMessage: messageToSign,
                }),
            })

            const verifyData = await verifyRes.json()
            if (!verifyRes.ok) throw new Error(verifyData.error || "Verification failed")

            // 4. Update store
            setAuthToken(verifyData.authToken)
            setIsAuthenticated(true)

            const payload = parseJwt(verifyData.authToken)
            if (payload) {
                setRole(payload.role || "user")
                setIsAdmin(payload.is_admin || false)
            }

            toast.success("Successfully authenticated")
        } catch (err: any) {
            console.error("[Auth Hook] Login error:", err)
            toast.error(err.message || "Authentication failed")
        } finally {
            setIsAuthenticating(false)
        }
    }, [currentAccount, signPersonalMessage, setAuthToken, setIsAuthenticated, setRole, setIsAdmin])

    const logout = useCallback(async () => {
        try {
            await fetch("/api/auth/signout", { method: "POST" })
            disconnectStore()
            toast.info("Signed out")
        } catch (err) {
            console.error("[Auth Hook] Logout error:", err)
        }
    }, [disconnectStore])

    const checkSession = useCallback(async () => {
        if (!currentAccount) return

        try {
            const res = await fetch("/api/auth/wallet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "check_session",
                    walletAddress: currentAccount.address,
                }),
            })

            const data = await res.json()
            if (data.hasActiveSession) {
                setAuthToken(data.authToken)
                setIsAuthenticated(true)
                const payload = parseJwt(data.authToken)
                if (payload) {
                    setRole(payload.role || "user")
                    setIsAdmin(payload.is_admin || false)
                }
            } else {
                setIsAuthenticated(false)
                setRole(null)
                setIsAdmin(false)
            }
        } catch (err) {
            console.error("[Auth Hook] Check session error:", err)
        }
    }, [currentAccount, setAuthToken, setIsAuthenticated, setRole, setIsAdmin])

    return {
        login,
        logout,
        isAuthenticating,
        isAuthenticated,
        checkSession,
    }
}
