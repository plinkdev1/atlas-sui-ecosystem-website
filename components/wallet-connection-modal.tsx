"use client"

import { GlassCard } from "@/components/glass-card"
import { PasskeyAuth } from "@/components/passkey-auth"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletDiscoveryBanner } from "@/components/wallet-discovery-banner"
import { ZKLoginAuth } from "@/components/zklogin-auth"
import { useSupabaseUser } from "@/hooks/use-supabase-user"
import { useWalletAuth } from "@/hooks/use-wallet-auth"
import { getBrandLogo } from "@/lib/brand-logos-client"
import { useUnifiedWallet } from "@/lib/unified-wallet-context"
import { getWalletInitials } from "@/lib/wallet-logos"
import { useConnectWallet, useCurrentAccount, useWallets } from "@mysten/dapp-kit"
import { Check, Download, ExternalLink, Key, Loader2, QrCode, Shield } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

interface WalletOption {
  name: string
  icon?: string
  downloadUrl: string
  installed: boolean
}

const WALLET_DOWNLOAD_URLS: Record<string, string> = {
  "Slush Wallet": "https://chromewebstore.google.com/detail/slush-wallet/mjpjfabpclkffcbclbfdkngapcdmhfnc",
  Suiet: "https://suiet.app/",
  Nightly: "https://wallet.nightly.app/",
  "OKX Wallet": "https://www.okx.com/web3/wallet",
  Phantom: "https://phantom.app/download",
  Ethos: "https://www.ethoswallet.xyz/",
  Backpack: "https://backpack.app/",
  Martian: "https://www.martianwallet.com/",
  Surf: "https://www.surf.tech/",
  "Glass Wallet": "https://glass.xyz/",
  "OneKey Wallet": "https://onekey.so/",
  "TokenPocket Wallet": "https://www.tokenpocket.pro/",
}

export function WalletConnectionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const wallet = useUnifiedWallet()
  const { user: supabaseUser } = useSupabaseUser()

  // CORRECT dapp-kit API:
  // useWallets() returns the array directly
  // useConnectWallet() returns { mutate: connect }
  const registeredWallets = useWallets()
  const { mutate: connectWallet, isPending: isConnecting } = useConnectWallet()
  const currentAccount = useCurrentAccount()

  const { login, isAuthenticating, isAuthenticated } = useWalletAuth()
  const [walletOptions, setWalletOptions] = useState<WalletOption[]>([])
  const [connectingName, setConnectingName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  // WalletConnect/Reown removed - single wallet system via @mysten/dapp-kit

  // Close modal when wallet connects
  useEffect(() => {
    if (currentAccount?.address && isOpen) {
      toast.success("Wallet connected successfully")
      onClose()
    }
  }, [currentAccount?.address])

  // Build wallet options from dapp-kit registered wallets
  useEffect(() => {
    if (!isOpen) return

    const buildWalletOptions = () => {
      const dappKitWallets = registeredWallets || []

      const options: WalletOption[] = dappKitWallets.map((w) => ({
        name: w.name,
        icon: getBrandLogo(w.name) || w.icon,
        downloadUrl: WALLET_DOWNLOAD_URLS[w.name] || "#",
        installed: true, // dapp-kit only returns registered/available wallets
      }))

      setWalletOptions(options)
      setLoading(false)
    }

    // Small delay for wallet extensions to register with dapp-kit
    const timer = setTimeout(buildWalletOptions, 200)
    return () => clearTimeout(timer)
  }, [registeredWallets, isOpen])

  const handleWalletConnect = (walletName: string) => {
    setConnectingName(walletName)
    setError(null)

    // Find the wallet object in the dapp-kit registered wallets array
    const targetWallet = registeredWallets.find((w) => w.name === walletName)
    if (!targetWallet) {
      setError(`${walletName} is not available. Please make sure the extension is installed and refresh.`)
      setConnectingName(null)
      return
    }

    connectWallet(
      { wallet: targetWallet },
      {
        onSuccess: () => {
          setConnectingName(null)
          // Trigger the signing flow automatically after connection
          login()
        },
        onError: (err) => {
          const msg = err instanceof Error ? err.message : "Connection failed"
          setError(msg)
          toast.error(msg)
          setConnectingName(null)
        },
      },
    )
  }

  const handleDownloadWallet = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleImageError = (walletName: string) => {
    setImageErrors((prev) => ({ ...prev, [walletName]: true }))
  }

  // WalletConnect handler removed - using direct dapp-kit connections only

  const installedWallets = walletOptions.filter((w) => w.installed)

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <GlassCard>
            <DialogHeader className="pb-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <DialogTitle>Connect to Atlas</DialogTitle>
                  <DialogDescription>Choose your preferred authentication method</DialogDescription>
                </div>
                <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                  {wallet.shortNetwork || "Mainnet"}
                </div>
              </div>
            </DialogHeader>

            <Tabs defaultValue="wallet" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
                <TabsTrigger value="zklogin">
                  <Shield className="h-3 w-3 mr-1" />
                  ZKLogin
                </TabsTrigger>
                <TabsTrigger value="passkey">
                  <Key className="h-3 w-3 mr-1" />
                  Passkey
                </TabsTrigger>
              </TabsList>

              <TabsContent value="wallet" className="space-y-4">
                <div className="space-y-4 mb-4">
                  <Button
                    disabled
                    className="w-full bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    WalletConnect (Coming Soon)
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or connect installed wallet</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {error && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  {loading ? (
                    <div className="text-center py-8 space-y-4">
                      <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
                      <p className="text-foreground font-medium">Detecting wallets...</p>
                    </div>
                  ) : installedWallets.length > 0 ? (
                    <div>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Available Wallets ({installedWallets.length})
                      </h3>
                      <div className="space-y-2">
                        {installedWallets.map((w) => (
                          <button
                            key={w.name}
                            onClick={() => handleWalletConnect(w.name)}
                            disabled={connectingName === w.name || isConnecting}
                            className="w-full flex items-center gap-3 p-4 bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/50 rounded-xl transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {w.icon && !imageErrors[w.name] ? (
                              <img
                                src={w.icon}
                                alt={`${w.name} icon`}
                                className="w-12 h-12 rounded-lg object-contain"
                                onError={() => handleImageError(w.name)}
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-foreground font-bold text-sm">
                                {getWalletInitials(w.name)}
                              </div>
                            )}
                            <div className="text-left flex-1">
                              <p className="text-foreground font-semibold group-hover:text-primary transition-colors">
                                {w.name}
                              </p>
                              <p className="text-muted-foreground text-xs">Click to connect</p>
                            </div>
                            {connectingName === w.name ? (
                              <Loader2 className="h-5 w-5 text-primary animate-spin" />
                            ) : (
                              <Check className="h-5 w-5 text-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-4">
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-2">
                        <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">No installed wallets detected</p>
                        <p className="text-xs text-yellow-600/80 dark:text-yellow-400/80 mt-1">
                          Install a Sui wallet extension, or use WalletConnect above for 100+ wallet options.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {Object.entries(WALLET_DOWNLOAD_URLS)
                          .slice(0, 6)
                          .map(([name, url]) => (
                            <Button
                              key={name}
                              onClick={() => handleDownloadWallet(url)}
                              variant="outline"
                              size="sm"
                              className="text-xs h-auto py-2"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              {name}
                            </Button>
                          ))}
                      </div>
                      <a
                        href="https://suiet.app/download"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center justify-center gap-1"
                      >
                        View all wallets <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  {walletOptions.length === 0 && !loading && <WalletDiscoveryBanner onClose={onClose} />}
                </div>
              </TabsContent>

              <TabsContent value="zklogin">
                <ZKLoginAuth />
              </TabsContent>

              <TabsContent value="passkey">
                <PasskeyAuth />
              </TabsContent>
            </Tabs>
          </GlassCard>
        </DialogContent>
      </Dialog>

      {/* WalletConnect/Reown modal removed - single wallet system */}
    </>
  )
}
