"use client"

import type React from "react"
import { createContext, useCallback, useEffect, useState } from "react"
import { initCetusSDK, type CetusClmmSDK } from "@cetusprotocol/cetus-sui-clmm-sdk"
import { useCurrentAccount } from "@mysten/dapp-kit"

interface CetusContextType {
  cetusSDK: CetusClmmSDK | null
  isLoading: boolean
  error: Error | null
}

export const CetusContext = createContext<CetusContextType>({
  cetusSDK: null,
  isLoading: false,
  error: null,
})

export function CetusProvider({ children }: { children: React.ReactNode }) {
  const account = useCurrentAccount()
  const [cetusSDK, setCetusSDK] = useState<CetusClmmSDK | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const initializeCetus = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const network = process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet"
      const rpcUrl = process.env.SUI_TESTNET_RPC || "https://fullnode.testnet.sui.io:443"

      console.log("[v0] Initializing Cetus SDK with network:", network)

      // Map devnet to testnet since Cetus SDK only supports testnet/mainnet
      const cetusNetwork: "testnet" | "mainnet" = network === "devnet" ? "testnet" : (network as "testnet" | "mainnet")

      const sdk = initCetusSDK({
        network: cetusNetwork,
        fullNodeUrl: rpcUrl,
      })

      setCetusSDK(sdk)
      console.log("[v0] Cetus SDK initialized successfully")
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to initialize Cetus SDK")
      console.error("[v0] Cetus SDK initialization error:", error)
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    initializeCetus()
  }, [initializeCetus])

  useEffect(() => {
    if (account && cetusSDK) {
      console.log("[v0] Cetus context ready with account:", account.address)
    }
  }, [account, cetusSDK])

  return <CetusContext.Provider value={{ cetusSDK, isLoading, error }}>{children}</CetusContext.Provider>
}
