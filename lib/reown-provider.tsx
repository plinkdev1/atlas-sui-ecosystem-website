"use client"

import type React from "react"
import { useEffect, useState } from "react"

// Reown AppKit provider - lazy loaded to avoid MIME type issues
export function ReownProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Initialize Reown AppKit dynamically if projectId is available
    const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
    if (!projectId) {
      console.log("[v0] Reown AppKit: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID not configured")
      setIsReady(true)
      return
    }

    // Reown AppKit setup will be handled in the modal component
    setIsReady(true)
  }, [])

  if (!isReady) return null

  return <>{children}</>
}
