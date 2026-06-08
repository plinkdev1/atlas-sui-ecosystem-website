"use client"

import { useWalletAuth } from "@/hooks/use-wallet-auth"
import { useNetwork, type ChainId } from "@/lib/network-context"
import { useWalletStore } from "@/lib/wallet-store"
import { useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit"
import { createContext, useCallback, useContext, useEffect, type ReactNode } from "react"

export interface DetectedWallet {
  name: string
  label?: string
  icon?: string
  installed: boolean
}

interface UnifiedWalletContextType {
  address: string | null
  connected: boolean
  walletName: string | null
  detectedWallets: DetectedWallet[]
  configuredWallets: DetectedWallet[]
  authToken: string | null
  isAuthenticated: boolean
  network: ChainId
  setNetwork: (network: ChainId) => void
  chainGroup: "Sui" | "Aptos" | "Ethereum" | "Mina" | "IOTA" | "Monad"
  shortNetwork: string
  analyticsOptOut: boolean
  setAnalyticsOptOut: (optOut: boolean) => void
  disconnect: () => void
  select: (walletName: string) => Promise<void>
  checkSession: () => Promise<void>
  login: () => Promise<void>
  isAuthenticating: boolean
}

const UnifiedWalletContext = createContext<UnifiedWalletContextType | undefined>(undefined)

export function useUnifiedWallet() {
  const context = useContext(UnifiedWalletContext)
  if (!context) {
    throw new Error("useUnifiedWallet must be used within UnifiedWalletProvider")
  }
  return context
}

export function UnifiedWalletProvider({ children }: { children: ReactNode }) {
  const network = useNetwork()
  const currentAccount = useCurrentAccount()
  const { mutate: dappKitDisconnect } = useDisconnectWallet()

  // Read individual values from zustand store (stable selectors, no new object each render)
  const storeAddress = useWalletStore((s) => s.currentAccount)
  const storeWalletName = useWalletStore((s) => s.walletName)
  const storeIsConnected = useWalletStore((s) => s.isConnected)
  const storeAuthToken = useWalletStore((s) => s.authToken)
  const storeIsAuthenticated = useWalletStore((s) => s.isAuthenticated)
  const storeAnalyticsOptOut = useWalletStore((s) => s.analyticsOptOut)
  const setCurrentAccount = useWalletStore((s) => s.setCurrentAccount)
  const setWalletName = useWalletStore((s) => s.setWalletName)
  const setAnalyticsOptOut = useWalletStore((s) => s.setAnalyticsOptOut)
  const storeDisconnect = useWalletStore((s) => s.disconnect)

  const { login, logout: authLogout, isAuthenticating, checkSession } = useWalletAuth()

  // Sync dapp-kit account to zustand store
  useEffect(() => {
    if (currentAccount?.address) {
      setCurrentAccount(currentAccount.address)
      setWalletName((currentAccount as any).label || (currentAccount as any).walletName || "Connected Wallet")
      // Check if we have a valid session for this wallet
      checkSession()
    } else if (!currentAccount) {
      setCurrentAccount(null)
      setWalletName(null)
    }
  }, [currentAccount?.address])

  const disconnect = useCallback(() => {
    dappKitDisconnect()
    authLogout()
  }, [dappKitDisconnect, authLogout])

  const select = useCallback(async (walletName: string) => {
    setWalletName(walletName)
  }, [setWalletName])

  // Derive values from dapp-kit state first, fallback to store
  const address = currentAccount?.address || storeAddress || null
  const connected = !!currentAccount || storeIsConnected
  const walletName = (currentAccount as any)?.label || (currentAccount as any)?.walletName || storeWalletName

  const value: UnifiedWalletContextType = {
    address,
    connected,
    walletName,
    detectedWallets: [],
    configuredWallets: [],
    authToken: storeAuthToken,
    isAuthenticated: storeIsAuthenticated,
    network: network.network,
    setNetwork: network.setNetwork,
    chainGroup: network.getChainGroup(),
    shortNetwork: network.getShortNetwork(),
    analyticsOptOut: storeAnalyticsOptOut,
    setAnalyticsOptOut,
    disconnect,
    select,
    checkSession,
    login,
    isAuthenticating,
  }

  return <UnifiedWalletContext.Provider value={value}>{children}</UnifiedWalletContext.Provider>
}
