"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2 } from "lucide-react"

declare global {
  interface Window {
    LemonSqueezy?: {
      Setup: (config: { eventHandler: (event: any) => void }) => void
      Url: {
        Open: (url: string) => void
      }
    }
  }
}

interface LemonSqueezyCheckoutProps {
  tier: "pro" | "pro+"
  email?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function LemonSqueezyCheckout({ tier, email, onSuccess, onError }: LemonSqueezyCheckoutProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasSDK, setHasSDK] = useState(false)
  const [useMockMode, setUseMockMode] = useState(false)
  const sdkLoaded = useRef(false)

  const storeId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID
  const variantIdPro = process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRO_VARIANT_ID
  const variantIdProPlus = process.env.NEXT_PUBLIC_LEMONSQUEEZY_PROPLUS_VARIANT_ID

  useEffect(() => {
    // Check if env vars are present
    if (!storeId || !variantIdPro || !variantIdProPlus) {
      console.warn("[v0] Lemon Squeezy env vars missing, using mock mode")
      setUseMockMode(true)
      setIsLoading(false)
      return
    }

    // Load Lemon Squeezy SDK
    if (!sdkLoaded.current) {
      const script = document.createElement("script")
      script.src = "https://app.lemonsqueezy.com/js/lemon.js"
      script.async = true
      script.onload = () => {
        if (window.LemonSqueezy) {
          window.LemonSqueezy.Setup({
            eventHandler: (event: any) => {
              console.log("[v0] Lemon Squeezy event:", event)
            },
          })
          setHasSDK(true)
        }
        setIsLoading(false)
      }
      script.onerror = () => {
        console.error("[v0] Failed to load Lemon Squeezy SDK")
        setUseMockMode(true)
        setIsLoading(false)
      }
      document.body.appendChild(script)
      sdkLoaded.current = true
    }
  }, [storeId, variantIdPro, variantIdProPlus])

  const handleCheckout = () => {
    if (useMockMode) {
      // Mock checkout flow
      console.log("[v0] Mock checkout for:", tier)
      onSuccess?.()
      return
    }

    if (!hasSDK || !storeId) {
      onError?.("Checkout service unavailable")
      return
    }

    const variantId = tier === "pro" ? variantIdPro : variantIdProPlus
    const checkoutUrl = `https://app.lemonsqueezy.com/checkout/buy/${storeId}/${variantId}?checkout[email]=${email || ""}&checkout[custom][user_id]=${email || "anonymous"}`

    if (window.LemonSqueezy?.Url?.Open) {
      window.LemonSqueezy.Url.Open(checkoutUrl)
    } else {
      window.open(checkoutUrl, "_blank")
    }
  }

  if (isLoading) {
    return (
      <Button disabled className="w-full">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading checkout...
      </Button>
    )
  }

  if (useMockMode) {
    return (
      <div className="space-y-3">
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-900 dark:text-amber-200">Test Mode</p>
            <p className="text-amber-800 dark:text-amber-300">Lemon Squeezy is not configured. Using mock checkout.</p>
          </div>
        </div>
        <Button
          onClick={handleCheckout}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-500 dark:to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white"
        >
          Complete Mock Checkout
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={handleCheckout}
      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-500 dark:to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-semibold"
    >
      Proceed to Checkout
    </Button>
  )
}
