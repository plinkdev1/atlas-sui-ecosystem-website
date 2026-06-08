"use client"

import type React from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { FeedbackButton } from "@/components/feedback-button"
import { CookieBanner } from "@/components/cookie-banner"
import { RiskDisclaimerModal } from "@/components/risk-disclaimer-modal"
import { SkipToMain } from "@/components/skip-to-main"
import { useEffect, useRef } from "react"
import { useSupabaseUser } from "@/hooks/use-supabase-user"
import { useProStatus } from "@/lib/pro-status-context"

export function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useSupabaseUser()
  const { status } = useProStatus()
  const monthlyCheckRef = useRef<string | null>(null)

  // Trigger monthly earning check on login - only once per user per month
  useEffect(() => {
    const checkMonthlyEarning = async () => {
      if (!user?.id) return

      // Check if we've already run this check for this user this month
      const today = new Date()
      const monthKey = `${user.id}-${today.getFullYear()}-${today.getMonth()}`

      // If we've already checked this month, skip
      if (monthlyCheckRef.current === monthKey) {
        return
      }

      try {
        const response = await fetch("/api/airpoints", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "creditMonthly",
            userId: user.id,
            tier: status.tier || "free",
          }),
        })

        if (!response.ok) {
          console.error("[v0] Failed to credit monthly airpoints")
          return
        }

        const data = await response.json()
        if (data.credited) {
          console.log(`[v0] Monthly Airpoints credited: +${data.amount} pts`)
          // Mark that we've checked this month
          monthlyCheckRef.current = monthKey
        }
      } catch (error) {
        console.error("[v0] Monthly earning check error:", error)
      }
    }

    checkMonthlyEarning()
  }, [user?.id])

  return (
    <>
      <SkipToMain />
      <Header />
      <main id="main-content" className="pt-16 pb-20 md:pb-0">{children}</main>
      <Footer />
      <FeedbackButton />
      <RiskDisclaimerModal />
      <CookieBanner />
    </>
  )
}

export default ClientLayout
