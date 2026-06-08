"use client"

import type React from "react"

// Vercel Analytics + custom wallet analytics API handle all tracking needs

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
