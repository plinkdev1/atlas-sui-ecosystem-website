"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { createContext, useContext, type ReactNode } from "react"

export type SuiNetwork = "sui:mainnet" | "sui:testnet" | "sui:devnet"
export type AptosNetwork = "aptos:mainnet" | "aptos:testnet"
export type EvmNetwork = "ethereum:mainnet" | "ethereum:sepolia" | "base:mainnet"
export type MinaNetwork = "mina:mainnet" | "mina:berkeley"
export type IotaNetwork = "iota:mainnet" | "iota:shimmer-testnet"
export type MonadNetwork = "monad:mainnet" | "monad:testnet"
export type ChainId = SuiNetwork | AptosNetwork | EvmNetwork | MinaNetwork | IotaNetwork | MonadNetwork

export interface ChainConfig {
  id: ChainId
  name: string
  group: "Sui" | "Aptos" | "Ethereum" | "Mina" | "IOTA" | "Monad"
  isSupported: boolean
  color: string
  icon?: string
}

export const CHAIN_CONFIGS: Record<ChainId, ChainConfig> = {
  // Sui Networks (Fully Supported)
  "sui:mainnet": {
    id: "sui:mainnet",
    name: "Sui Mainnet",
    group: "Sui",
    isSupported: true,
    color: "bg-green-500",
  },
  "sui:testnet": {
    id: "sui:testnet",
    name: "Sui Testnet",
    group: "Sui",
    isSupported: true,
    color: "bg-yellow-500",
  },
  "sui:devnet": {
    id: "sui:devnet",
    name: "Sui Devnet",
    group: "Sui",
    isSupported: true,
    color: "bg-blue-500",
  },
  // Aptos Networks (Coming Soon)
  "aptos:mainnet": {
    id: "aptos:mainnet",
    name: "Aptos Mainnet",
    group: "Aptos",
    isSupported: false,
    color: "bg-gray-500",
  },
  "aptos:testnet": {
    id: "aptos:testnet",
    name: "Aptos Testnet",
    group: "Aptos",
    isSupported: false,
    color: "bg-gray-500",
  },
  // Ethereum Networks (Coming Soon)
  "ethereum:mainnet": {
    id: "ethereum:mainnet",
    name: "Ethereum Mainnet",
    group: "Ethereum",
    isSupported: false,
    color: "bg-gray-500",
  },
  "ethereum:sepolia": {
    id: "ethereum:sepolia",
    name: "Ethereum Sepolia",
    group: "Ethereum",
    isSupported: false,
    color: "bg-gray-500",
  },
  "base:mainnet": {
    id: "base:mainnet",
    name: "Base Mainnet",
    group: "Ethereum",
    isSupported: false,
    color: "bg-gray-500",
  },
  // Mina Protocol networks
  "mina:mainnet": {
    id: "mina:mainnet",
    name: "Mina Mainnet",
    group: "Mina",
    isSupported: false,
    color: "bg-gray-500",
  },
  "mina:berkeley": {
    id: "mina:berkeley",
    name: "Mina Berkeley Testnet",
    group: "Mina",
    isSupported: false,
    color: "bg-gray-500",
  },
  // IOTA networks
  "iota:mainnet": {
    id: "iota:mainnet",
    name: "IOTA Mainnet",
    group: "IOTA",
    isSupported: false,
    color: "bg-gray-500",
  },
  "iota:shimmer-testnet": {
    id: "iota:shimmer-testnet",
    name: "IOTA Shimmer Testnet",
    group: "IOTA",
    isSupported: false,
    color: "bg-gray-500",
  },
  // Monad networks
  "monad:mainnet": {
    id: "monad:mainnet",
    name: "Monad Mainnet",
    group: "Monad",
    isSupported: false,
    color: "bg-gray-500",
  },
  "monad:testnet": {
    id: "monad:testnet",
    name: "Monad Testnet",
    group: "Monad",
    isSupported: false,
    color: "bg-gray-500",
  },
}

interface ChainStore {
  selectedChain: ChainId
  setChain: (chain: ChainId) => void
  setSelectedChain: (chain: ChainId) => void
  isChainSupported: () => boolean
  getCurrentConfig: () => ChainConfig
  isSupported: boolean
}

export const useChainStore = create<ChainStore>()(
  persist(
    (set, get) => ({
      selectedChain: "sui:testnet",
      setChain: (chain: ChainId) => set({ selectedChain: chain }),
      setSelectedChain: (chain: ChainId) => set({ selectedChain: chain }),
      isChainSupported: () => CHAIN_CONFIGS[get().selectedChain].isSupported,
      getCurrentConfig: () => CHAIN_CONFIGS[get().selectedChain],
      get isSupported() {
        return CHAIN_CONFIGS[get().selectedChain].isSupported
      },
    }),
    {
      name: "atlas-chain-storage",
    },
  ),
)

const ChainContext = createContext<ChainStore | null>(null)

export function ChainProvider({ children }: { children: ReactNode }) {
  return <ChainContext.Provider value={useChainStore()}>{children}</ChainContext.Provider>
}

export function useChain() {
  return useContext(ChainContext)
}
