"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WalletStore {
  currentAccount: string | null
  walletName: string | null
  isConnected: boolean
  authToken: string | null
  isAuthenticated: boolean
  role: string | null
  isAdmin: boolean
  analyticsOptOut: boolean
  setCurrentAccount: (account: string | null) => void
  setWalletName: (name: string | null) => void
  setIsConnected: (connected: boolean) => void
  setAuthToken: (token: string | null) => void
  setIsAuthenticated: (authenticated: boolean) => void
  setRole: (role: string | null) => void
  setIsAdmin: (isAdmin: boolean) => void
  setAnalyticsOptOut: (optOut: boolean) => void
  disconnect: () => void
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      currentAccount: null,
      walletName: null,
      isConnected: false,
      authToken: null,
      isAuthenticated: false,
      role: null,
      isAdmin: false,
      analyticsOptOut: false,
      setCurrentAccount: (account: string | null) => set({ currentAccount: account }),
      setWalletName: (name: string | null) => set({ walletName: name }),
      setIsConnected: (connected: boolean) => set({ isConnected: connected }),
      setAuthToken: (token: string | null) => set({ authToken: token }),
      setIsAuthenticated: (authenticated: boolean) => set({ isAuthenticated: authenticated }),
      setRole: (role: string | null) => set({ role }),
      setIsAdmin: (isAdmin: boolean) => set({ isAdmin }),
      setAnalyticsOptOut: (optOut: boolean) => set({ analyticsOptOut: optOut }),
      disconnect: () =>
        set({
          currentAccount: null,
          walletName: null,
          isConnected: false,
          authToken: null,
          isAuthenticated: false,
          role: null,
          isAdmin: false,
          analyticsOptOut: false,
        }),
    }),
    {
      name: "atlas-wallet-storage",
    },
  ),
)
