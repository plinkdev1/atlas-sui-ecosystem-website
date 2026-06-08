"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface RPCStore {
  customRpc: string | null
  isUsingCustomRpc: boolean
  setCustomRpc: (url: string | null) => void
  setIsUsingCustomRpc: (using: boolean) => void
  getRpcUrl: (network: "mainnet" | "testnet" | "devnet") => string
  testRpcConnectivity: (url: string) => Promise<boolean>
}

export const useRpcStore = create<RPCStore>()(
  persist(
    (set, get) => ({
      customRpc: null,
      isUsingCustomRpc: false,
      setCustomRpc: (url: string | null) => set({ customRpc: url }),
      setIsUsingCustomRpc: (using: boolean) => set({ isUsingCustomRpc: using }),
      getRpcUrl: (network: "mainnet" | "testnet" | "devnet") => {
        const state = get()
        if (state.isUsingCustomRpc && state.customRpc) {
          return state.customRpc
        }
        const defaults = {
          mainnet: "https://fullnode.mainnet.sui.io",
          testnet: "https://fullnode.testnet.sui.io",
          devnet: "https://fullnode.devnet.sui.io",
        }
        return defaults[network]
      },
      testRpcConnectivity: async (url: string) => {
        try {
          const response = await fetch(`${url}/rpc`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              method: "rpc_discover",
              params: [],
              id: 1,
            }),
          })
          return response.ok
        } catch {
          return false
        }
      },
    }),
    {
      name: "atlas-rpc-storage",
    },
  ),
)
