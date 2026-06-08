"use client"

import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { useCurrentAccount, useWallets, useConnectWallet } from "@mysten/dapp-kit"
import { useState } from "react"
import { WalletConnectionModal } from "@/components/wallet-connection-modal"

interface WalletConnectButtonProps {
  onConnect?: () => void
  className?: string
}

export function WalletConnectButton({ onConnect, className }: WalletConnectButtonProps) {
  const currentAccount = useCurrentAccount()
  const wallets = useWallets()
  const { mutate: connectWallet } = useConnectWallet()
  const [showModal, setShowModal] = useState(false)

  const handleConnect = () => {
    if (currentAccount) {
      onConnect?.()
      return
    }

    // If only one wallet is installed, connect directly
    if (wallets.length === 1) {
      connectWallet(
        { wallet: wallets[0] },
        {
          onSuccess: () => onConnect?.(),
        },
      )
      return
    }

    // Otherwise show the modal
    setShowModal(true)
  }

  return (
    <>
      <Button onClick={handleConnect} variant="default" className={`w-full gap-2 ${className}`}>
        <Wallet className="w-4 h-4" />
        {currentAccount ? `Connected: ${currentAccount.address.slice(0, 8)}...` : "Connect Wallet"}
      </Button>
      <WalletConnectionModal isOpen={showModal} onClose={() => { setShowModal(false); onConnect?.() }} />
    </>
  )
}
