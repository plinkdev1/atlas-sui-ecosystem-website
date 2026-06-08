"use client"

import { useCallback } from "react"
import { useWalletStore } from "@/lib/wallet-store"
import { useNetwork } from "@/lib/network-context"
import { trackAnalyticsEvent, hashWalletAddress, isAnalyticsEnabled } from "@/lib/wallet-analytics"

export function useAnalytics() {
  const { currentAccount, walletName } = useWalletStore()
  const { network } = useNetwork()

  const trackEvent = useCallback(
    (eventName: string, properties?: Record<string, any>) => {
      if (!isAnalyticsEnabled()) return

      try {
        // Send to custom API for wallet-specific analytics
        if (properties?.eventType) {
          trackAnalyticsEvent({
            eventType: properties.eventType,
            walletName: walletName || "unknown",
            walletAddressHash: currentAccount ? hashWalletAddress(currentAccount) : "unknown",
            network: network || "mainnet",
            timestamp: Date.now(),
            metadata: properties,
          })
        }
      } catch (error) {
        console.warn("[v0] Analytics event failed:", error)
      }
    },
    [currentAccount, walletName, network],
  )

  const trackPageView = useCallback(
    (pageName: string) => {
      trackEvent("page_view", { page: pageName })
    },
    [trackEvent],
  )

  const trackWalletConnect = useCallback(
    (wallet: string, success: boolean) => {
      trackEvent("wallet_connected", {
        eventType: "connect",
        wallet,
        success,
      })
    },
    [trackEvent],
  )

  const trackWalletDisconnect = useCallback(() => {
    trackEvent("wallet_disconnected", {
      eventType: "disconnect",
    })
  }, [trackEvent])

  const trackSignTransaction = useCallback(
    (transactionType?: string) => {
      trackEvent("transaction_signed", {
        eventType: "sign",
        transactionType,
      })
    },
    [trackEvent],
  )

  const trackNetworkSwitch = useCallback(
    (fromNetwork: string, toNetwork: string) => {
      trackEvent("network_switched", {
        from: fromNetwork,
        to: toNetwork,
      })
    },
    [trackEvent],
  )

  const trackError = useCallback(
    (errorCode: string, errorMessage?: string) => {
      trackEvent("error_occurred", {
        eventType: "error",
        errorCode,
        errorMessage: errorMessage?.substring(0, 100),
      })
    },
    [trackEvent],
  )

  return {
    trackEvent,
    trackPageView,
    trackWalletConnect,
    trackWalletDisconnect,
    trackSignTransaction,
    trackNetworkSwitch,
    trackError,
  }
}
