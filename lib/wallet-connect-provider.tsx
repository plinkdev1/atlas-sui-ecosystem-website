"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"

// WalletConnect integration component
// Will be initialized with projectId from env variable
export function WalletConnectProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // WalletConnect/Reown integration temporarily disabled
  // @web3modal/sui package is not available on npm registry
  useEffect(() => {
    if (!mounted) return

    const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

    if (!projectId) {
      console.warn(
        "[v0] NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID not set. WalletConnect QR support disabled.",
      )
      return
    }

    // WalletConnect initialization disabled - package not available
    console.log("[v0] WalletConnect projectId configured but @web3modal/sui package unavailable")
  }, [mounted])

  return <>{children}</>
}
