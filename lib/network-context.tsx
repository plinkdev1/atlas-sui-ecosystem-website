"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type SuiNetwork = "sui:mainnet" | "sui:testnet" | "sui:devnet"
export type AptosNetwork = "aptos:mainnet" | "aptos:testnet"
export type EvmNetwork = "ethereum:mainnet" | "ethereum:sepolia" | "base:mainnet"
export type MinaNetwork = "mina:mainnet" | "mina:berkeley"
export type IotaNetwork = "iota:mainnet" | "iota:shimmer-testnet"
export type MonadNetwork = "monad:mainnet" | "monad:testnet"
export type ChainId = SuiNetwork | AptosNetwork | EvmNetwork | MinaNetwork | IotaNetwork | MonadNetwork

interface NetworkContextType {
  network: ChainId
  setNetwork: (network: ChainId) => void
  getChainGroup: () => "Sui" | "Aptos" | "Ethereum" | "Mina" | "IOTA" | "Monad"
  getShortNetwork: () => string // Returns "mainnet", "testnet", "devnet", etc.
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined)

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [network, setNetworkState] = useState<ChainId>("sui:mainnet")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("atlas-network") as ChainId | null
    if (saved && isValidChain(saved)) {
      setNetworkState(saved)
    }
    setMounted(true)
  }, [])

  const setNetwork = (newNetwork: ChainId) => {
    setNetworkState(newNetwork)
    localStorage.setItem("atlas-network", newNetwork)
  }

  const getChainGroup = (): "Sui" | "Aptos" | "Ethereum" | "Mina" | "IOTA" | "Monad" => {
    if (network.startsWith("sui:")) return "Sui"
    if (network.startsWith("aptos:")) return "Aptos"
    if (network.startsWith("ethereum:") || network.startsWith("base:")) return "Ethereum"
    if (network.startsWith("mina:")) return "Mina"
    if (network.startsWith("iota:")) return "IOTA"
    if (network.startsWith("monad:")) return "Monad"
    return "Sui"
  }

  const getShortNetwork = (): string => {
    const parts = network.split(":")
    return parts[1] || "mainnet"
  }

  if (!mounted) {
    return (
      <NetworkContext.Provider value={{ network: "sui:mainnet", setNetwork, getChainGroup, getShortNetwork }}>
        {children}
      </NetworkContext.Provider>
    )
  }

  return (
    <NetworkContext.Provider value={{ network, setNetwork, getChainGroup, getShortNetwork }}>
      {children}
    </NetworkContext.Provider>
  )
}

export function useNetwork() {
  const context = useContext(NetworkContext)
  if (!context) {
    throw new Error("useNetwork must be used within NetworkProvider")
  }
  return context
}

function isValidChain(value: string): value is ChainId {
  const validChains: ChainId[] = [
    "sui:mainnet",
    "sui:testnet",
    "sui:devnet",
    "aptos:mainnet",
    "aptos:testnet",
    "ethereum:mainnet",
    "ethereum:sepolia",
    "base:mainnet",
    "mina:mainnet",
    "mina:berkeley",
    "iota:mainnet",
    "iota:shimmer-testnet",
    "monad:mainnet",
    "monad:testnet",
  ]
  return validChains.includes(value as ChainId)
}
