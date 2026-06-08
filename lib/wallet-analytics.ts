"use client"

export interface WalletAnalyticsEvent {
  eventType: "connect" | "disconnect" | "sign" | "execute" | "error"
  walletName: string
  walletAddressHash: string // Anonymized hash of wallet address
  network: string
  timestamp: number
  metadata?: Record<string, any>
}

const ANALYTICS_STORAGE_KEY = "atlas-wallet-analytics-opt-out"
const ANALYTICS_EVENTS_KEY = "atlas-wallet-analytics-events"

export function isAnalyticsEnabled(): boolean {
  if (typeof window === "undefined") return false
  const optOut = localStorage.getItem(ANALYTICS_STORAGE_KEY)
  return optOut !== "true"
}

export function setAnalyticsOptOut(optOut: boolean): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, optOut ? "true" : "false")
  }
}

// Hash wallet address for anonymization
export function hashWalletAddress(address: string): string {
  let hash = 0
  for (let i = 0; i < address.length; i++) {
    const char = address.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).substring(0, 8)
}

export function trackAnalyticsEvent(event: WalletAnalyticsEvent): void {
  if (!isAnalyticsEnabled()) return

  try {
    console.log("[v0] Analytics event tracked:", event.eventType, event.walletName)

    if (typeof window !== "undefined") {
      const events = JSON.parse(localStorage.getItem(ANALYTICS_EVENTS_KEY) || "[]")
      events.push(event)

      // Keep last 100 events
      if (events.length > 100) {
        events.shift()
      }

      localStorage.setItem(ANALYTICS_EVENTS_KEY, JSON.stringify(events))

      // Send to analytics API
      sendAnalyticsEvent(event)
    }
  } catch (error) {
    console.warn("[v0] Analytics tracking error:", error)
  }
}

async function sendAnalyticsEvent(event: WalletAnalyticsEvent): Promise<void> {
  try {
    await fetch("/api/analytics/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    })
  } catch (error) {
    console.warn("[v0] Failed to send analytics event:", error)
  }
}

export function getStoredAnalyticsEvents(): WalletAnalyticsEvent[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(ANALYTICS_EVENTS_KEY) || "[]")
  } catch {
    return []
  }
}

export function clearAnalyticsEvents(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ANALYTICS_EVENTS_KEY)
  }
}
