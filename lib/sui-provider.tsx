"use client"

import type React from "react"
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { useRpcStore } from "@/lib/rpc-store"
import { UnifiedWalletProvider } from "@/lib/unified-wallet-context"

const FULLNODE_URLS = {
  mainnet: "https://fullnode.mainnet.sui.io:443",
  testnet: "https://fullnode.testnet.sui.io:443",
  devnet: "https://fullnode.devnet.sui.io:443",
}

function SuiClientWrapper({ children }: { children: React.ReactNode }) {
  return <UnifiedWalletProvider>{children}</UnifiedWalletProvider>
}

export function SuiProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const { getRpcUrl } = useRpcStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  const networks = {
    mainnet: { url: getRpcUrl("mainnet") || FULLNODE_URLS.mainnet },
    testnet: { url: getRpcUrl("testnet") || FULLNODE_URLS.testnet },
    devnet: { url: getRpcUrl("devnet") || FULLNODE_URLS.devnet },
  } as const

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks as any} defaultNetwork="mainnet">
        <WalletProvider autoConnect>
          <SuiClientWrapper>{children}</SuiClientWrapper>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  )
}
