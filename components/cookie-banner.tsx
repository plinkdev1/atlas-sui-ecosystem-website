"use client"

import { Button } from "@/components/ui/button"
import { getStableIdentifier, setPersistentCookie, STORAGE_KEYS } from "@/lib/consent-utils"
import { useWalletStore } from "@/lib/wallet-store"
import { X } from "lucide-react"
import { useEffect, useState } from "react"

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { currentAccount } = useWalletStore()

  useEffect(() => {
    // Fast-path: check localStorage and cookies first (instant)
    const checkConsent = () => {
      try {
        const localAccepted = localStorage.getItem(STORAGE_KEYS.COOKIE_ACCEPTED)
        const cookieAccepted = document.cookie.includes(`${STORAGE_KEYS.COOKIE_ACCEPTED}=true`)

        if (localAccepted === "true" || cookieAccepted) {
          setIsVisible(false)
          return
        }
      } catch {
        // Continue to DB check
      }

      // If no local flag, check DB for persistent consent
      checkConsentDB()
    }

    const checkConsentDB = async () => {
      try {
        const identifier = getStableIdentifier(currentAccount)
        const response = await fetch(`/api/cookies/check?id=${identifier}`)
        const data = await response.json()

        if (!data.hasValidConsent) {
          setIsVisible(true)
        } else {
          // Sync back to local storage if found in DB
          localStorage.setItem(STORAGE_KEYS.COOKIE_ACCEPTED, "true")
          setPersistentCookie(STORAGE_KEYS.COOKIE_ACCEPTED, "true")
        }
      } catch (error) {
        console.error("Error checking consent:", error)
        setIsVisible(true)
      }
    }

    checkConsent()
  }, [currentAccount])

  const handleAcceptAll = async () => {
    setIsLoading(true)
    try {
      const identifier = getStableIdentifier(currentAccount)

      // Save to DB
      await fetch("/api/cookies/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_identifier: identifier,
          analytics_accepted: true,
          marketing_accepted: true,
          essential_accepted: true,
        }),
      })

      // Save locally (storage + cookie)
      localStorage.setItem(STORAGE_KEYS.COOKIE_ACCEPTED, "true")
      setPersistentCookie(STORAGE_KEYS.COOKIE_ACCEPTED, "true")
      setIsVisible(false)
    } catch (error) {
      console.error("Error saving consent:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectOptional = async () => {
    setIsLoading(true)
    try {
      const identifier = getStableIdentifier(currentAccount)

      // Save to DB
      await fetch("/api/cookies/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_identifier: identifier,
          analytics_accepted: false,
          marketing_accepted: false,
          essential_accepted: true,
        }),
      })

      // Save locally
      localStorage.setItem(STORAGE_KEYS.COOKIE_ACCEPTED, "true")
      setPersistentCookie(STORAGE_KEYS.COOKIE_ACCEPTED, "true")
      setIsVisible(false)
    } catch (error) {
      console.error("Error saving consent:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:max-w-md md:right-auto md:bottom-6 md:left-6 glass-panel rounded-2xl border border-[rgba(43,127,255,0.15)] shadow-2xl backdrop-blur-xl" role="region" aria-label="Cookie preferences">
      <div className="px-5 py-5 md:py-6">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-sm text-foreground mb-1">Cookie & Privacy Settings</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We use essential cookies for functionality and optional cookies for analytics to improve your experience.
              Please review our{" "}
              <a href="/privacy-policy" className="underline hover:text-foreground">
                privacy policy
              </a>{" "}
              for details.
            </p>
          </div>
          <div className="flex gap-2 flex-col-reverse">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRejectOptional}
              disabled={isLoading}
              className="w-full md:w-auto whitespace-nowrap"
            >
              Reject Optional
            </Button>
            <Button size="sm" onClick={handleAcceptAll} disabled={isLoading} className="w-full md:w-auto whitespace-nowrap button-primary-modern">
              Accept All
            </Button>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close cookie banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
