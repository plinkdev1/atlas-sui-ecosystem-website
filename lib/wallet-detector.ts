"use client"

// Type definitions for wallet window injections
interface WalletProvider {
  connect?: () => Promise<{ accounts: Array<{ address: string }> }>
  disconnect?: () => Promise<void>
  getAccounts?: () => Promise<string[]>
}

interface WindowWithWallets extends Window {
  slush?: WalletProvider
  suiet?: WalletProvider
  nightly?: WalletProvider
  okxwallet?: WalletProvider
  phantom?: { sui?: WalletProvider }
  ethos?: WalletProvider
}

export interface DetectedWallet {
  name: string
  inject: () => any
}

const WALLET_DETECTION_CONFIG = [
  {
    name: "Slush",  // Must match provider name exactly
    check: () => {
      if (typeof window !== "undefined") {
        const w = window as WindowWithWallets
        if (w.slush) {
          return w.slush
        }
      }
      return null
    },
  },
  {
    name: "Suiet",
    check: () => {
      // Suiet injects as window.suiet
      if (typeof window !== "undefined") {
        const w = window as WindowWithWallets
        if (w.suiet) {
          return w.suiet
        }
      }
      return null
    },
  },
  {
    name: "Nightly",
    check: () => {
      if (typeof window !== "undefined") {
        const w = window as WindowWithWallets
        if (w.nightly) {
          return w.nightly
        }
      }
      return null
    },
  },
  {
    name: "OKX Wallet",
    check: () => {
      if (typeof window !== "undefined") {
        const w = window as WindowWithWallets
        if (w.okxwallet) {
          return w.okxwallet
        }
      }
      return null
    },
  },
  {
    name: "Phantom",
    check: () => {
      if (typeof window !== "undefined") {
        const w = window as WindowWithWallets
        if (w.phantom?.sui) {
          return w.phantom.sui
        }
      }
      return null
    },
  },
  {
    name: "Ethos",
    check: () => {
      if (typeof window !== "undefined") {
        const w = window as WindowWithWallets
        if (w.ethos) {
          return w.ethos
        }
      }
      return null
    },
  },
]

export async function detectInstalledWallets(): Promise<string[]> {
  if (typeof window === "undefined") return []

  const installed: string[] = []

  await new Promise((resolve) => setTimeout(resolve, 300))

  for (const config of WALLET_DETECTION_CONFIG) {
    try {
      const wallet = config.check()
      if (wallet) {
        console.log("[v0] Found wallet:", config.name)
        installed.push(config.name)
      } else {
        console.log("[v0] Wallet NOT found:", config.name, "- checking window properties...")
        if (config.name === "Slush Wallet") {
          const w = window as WindowWithWallets
          console.log("[v0] window.slush exists?", typeof w.slush !== "undefined")
        }
        if (config.name === "Suiet") {
          const w = window as WindowWithWallets
          console.log("[v0] window.suiet exists?", typeof w.suiet !== "undefined")
        }
      }
    } catch (err) {
      console.log("[v0] Detection error for", config.name, ":", err)
    }
  }

  console.log("[v0] Final detected wallets:", installed)
  return installed
}

export async function attemptWalletConnection(walletName: string): Promise<WalletProvider> {
  if (typeof window === "undefined") {
    throw new Error("Not running in browser")
  }

  const config = WALLET_DETECTION_CONFIG.find((c) => c.name === walletName)
  if (!config) {
    throw new Error(`Unknown wallet: ${walletName}`)
  }

  const wallet = config.check() as WalletProvider | null
  if (!wallet) {
    throw new Error(`${walletName} not found. Please install the extension.`)
  }

  // Attempt connection
  if (wallet.connect && typeof wallet.connect === "function") {
    console.log("[v0] Calling connect on:", walletName)
    await wallet.connect()
  }

  // Return wallet provider (connection already established if available)
  console.log("[v0] Wallet provider ready:", walletName)
  return wallet
}
