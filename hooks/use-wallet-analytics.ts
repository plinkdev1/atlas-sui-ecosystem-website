"use client"

import { useCallback } from "react"
import { useWalletStore } from "@/lib/wallet-store"
import { useNetwork } from "@/lib/network-context"
import { trackAnalyticsEvent, hashWalletAddress } from "@/lib/wallet-analytics"

export function useWalletAnalytics() {
  const { currentAccount, walletName } = useWalletStore()
  const { network } = useNetwork()

  const trackConnect = useCallback(
    (wallet: string) => {
      trackAnalyticsEvent({
        eventType: "connect",
        walletName: wallet,
        walletAddressHash: currentAccount ? hashWalletAddress(currentAccount) : "unknown",
        network: network || "mainnet",
        timestamp: Date.now(),
        metadata: {
          source: "wallet_modal",
        },
      })
    },
    [currentAccount, network],
  )

  const trackDisconnect = useCallback(() => {
    if (walletName && currentAccount) {
      trackAnalyticsEvent({
        eventType: "disconnect",
        walletName,
        walletAddressHash: hashWalletAddress(currentAccount),
        network: network || "mainnet",
        timestamp: Date.now(),
      })
    }
  }, [walletName, currentAccount, network])

  const trackSign = useCallback(
    (wallet: string) => {
      if (currentAccount) {
        trackAnalyticsEvent({
          eventType: "sign",
          walletName: wallet,
          walletAddressHash: hashWalletAddress(currentAccount),
          network: network || "mainnet",
          timestamp: Date.now(),
          metadata: {
            action: "sign_transaction",
          },
        })
      }
    },
    [currentAccount, network],
  )

  const trackExecute = useCallback(
    (wallet: string, transactionHash?: string) => {
      if (currentAccount) {
        trackAnalyticsEvent({
          eventType: "execute",
          walletName: wallet,
          walletAddressHash: hashWalletAddress(currentAccount),
          network: network || "mainnet",
          timestamp: Date.now(),
          metadata: {
            action: "execute_transaction",
            transactionHash: transactionHash ? hashWalletAddress(transactionHash) : undefined,
          },
        })
      }
    },
    [currentAccount, network],
  )

  const trackError = useCallback(
    (wallet: string, errorCode: string, errorMessage?: string) => {
      if (currentAccount) {
        trackAnalyticsEvent({
          eventType: "error",
          walletName: wallet,
          walletAddressHash: hashWalletAddress(currentAccount),
          network: network || "mainnet",
          timestamp: Date.now(),
          metadata: {
            errorCode,
            errorMessage: errorMessage?.substring(0, 100), // Truncate for privacy
          },
        })
      }
    },
    [currentAccount, network],
  )

  return {
    trackConnect,
    trackDisconnect,
    trackSign,
    trackExecute,
    trackError,
  }
}
