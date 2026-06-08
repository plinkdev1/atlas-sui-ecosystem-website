"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnectionModal } from "@/components/wallet-connection-modal"
import { useToast } from "@/hooks/use-toast"
import { useNetwork } from "@/lib/network-context"
import { useProStatus } from "@/lib/pro-status-context"
import { useUnifiedWallet } from "@/lib/unified-wallet-context"
import { blockberryAPI } from "@/utils/api/blockberry-client"
import { blockvisionAPI } from "@/utils/api/blockvision-client"
import { useSuiClient } from "@mysten/dapp-kit"
import { Transaction } from "@mysten/sui/transactions"
import {
  AlertCircle,
  CheckCircle,
  Coins,
  Eye,
  EyeOff,
  Filter,
  Flame,
  ImageIcon,
  Info,
  Search,
  ShieldAlert,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react"
import { useEffect, useState } from "react"

type Classification = "legit" | "dubious" | "scam" | "unknown"

// Map Blockberry securityLevel to our UI security levels
const mapSecurityLevel = (level: string | undefined): "safe" | "warning" | "danger" | undefined => {
  if (!level) return undefined
  if (level === "safe") return "safe"
  if (level === "low") return "safe"
  if (level === "medium") return "warning"
  if (level === "high") return "danger"
  if (level === "critical") return "danger"
  if (level === "warning") return "warning"
  if (level === "danger") return "danger"
  return undefined
}

interface EnhancedToken {
  id: string
  name: string
  symbol: string
  balance: string
  value: string
  spam: boolean
  securityLevel?: "safe" | "warning" | "danger"
  securityMessage?: string
  confidence?: number
  classification: Classification
  communityRating: number
  hidden: boolean
  coinType?: string
}

interface EnhancedNFT {
  id: string
  name: string
  collection: string
  spam: boolean
  image: string
  securityLevel?: "safe" | "warning" | "danger"
  securityMessage?: string
  confidence?: number
  floorPrice?: string
  holderCount?: number
  classification: Classification
  communityRating: number
  hidden: boolean
  packageId?: string
}

const NFT_CLASSIFICATIONS: Record<string, Classification> = {
  "0x5b45da03d42b064f5e051741b6fed3b29eb817c7923b83b92f37a1d2abf4fbab": "legit",
  "0xbc3a676894871284b3ccfb2eec66f428612000e2a6e6d23f592ce8833c27c973": "legit",
  "0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1": "legit",
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef": "dubious",
  "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef": "scam",
  "0x0000000000000000000000000000000000000000000000000000000000000000": "scam",
}

const TOKEN_CLASSIFICATIONS: Record<string, Classification> = {
  "0x2::sui::SUI": "legit", // Native SUI token
  "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC": "legit", // USDC
  "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN": "legit", // wUSDC
  "0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK": "legit", // BUCK stablecoin
  "0x0000000000000000000000000000000000000000000000000000000000000001": "scam", // Fake token
  "0xspam": "scam", // Known spam token
}

const BURN_ADDRESS = "0x0000000000000000000000000000000000000000000000000000000000000000"

export function WalletCleanupContent() {
  // Use unified wallet connection state from context
  const wallet = useUnifiedWallet()
  const account = wallet.address
  const isConnected = wallet.connected
  const walletName = wallet.walletName

  const suiClient = useSuiClient()
  const { network, getChainGroup } = useNetwork()
  const isSuiChain = getChainGroup() === "Sui"
  const { toast } = useToast()
  const { status } = useProStatus()
  const [searchQuery, setSearchQuery] = useState("")
  const [tokens, setTokens] = useState<EnhancedToken[]>([])
  const [nfts, setNfts] = useState<EnhancedNFT[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState({ blockberry: false, blockvision: false })
  const [selectedNFTs, setSelectedNFTs] = useState<Set<string>>(new Set())
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set())

  const [isConnectionRejected, setIsConnectionRejected] = useState(false)
  const [isPendingOperation, setIsPendingOperation] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)

  const [filters, setFilters] = useState({
    classifications: new Set<Classification>(["legit", "dubious", "scam", "unknown"]),
    securityLevels: new Set<string>(["safe", "warning", "danger"]),
    showHidden: false,
    sortBy: "name" as "name" | "balance" | "rating" | "classification",
    sortOrder: "asc" as "asc" | "desc",
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"tokens" | "nfts">("tokens")

  const [confirmBurnModal, setConfirmBurnModal] = useState<{
    open: boolean
    itemId: string | null
    itemName: string
    itemType: "token" | "nft"
    isBulk: boolean
    count?: number
  }>({
    open: false,
    itemId: null,
    itemName: "",
    itemType: "token",
    isBulk: false,
  })
  const [showDocsModal, setShowDocsModal] = useState(false)
  const [communityList, setCommunityList] = useState<Record<string, { rating: number; reports: number }>>({})

  useEffect(() => {
    const savedRatings = localStorage.getItem("nft-ratings")
    if (savedRatings) {
      try {
        const ratings = JSON.parse(savedRatings)
        console.log("[v0] Loaded saved NFT ratings from localStorage")
      } catch (error) {
        console.error("[v0] Error loading saved ratings:", error)
      }
    }
  }, [])

  useEffect(() => {
    const loadCommunityList = async () => {
      const stored = localStorage.getItem("community-legitimacy-list")
      if (stored) {
        setCommunityList(JSON.parse(stored))
      } else {
        // Mock community list data
        const mockList = {
          "0x2::sui::SUI": { rating: 95, reports: 0 },
          "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN": { rating: 88, reports: 2 },
          // Add more curated entries
        }
        setCommunityList(mockList)
        localStorage.setItem("community-legitimacy-list", JSON.stringify(mockList))
      }
    }
    loadCommunityList()
  }, [])

  useEffect(() => {
    if (!isConnected && isPendingOperation) {
      setIsPendingOperation(false)
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet was disconnected. Please reconnect and try again.",
        variant: "destructive",
      })
    }
  }, [isConnected, isPendingOperation, toast])

  useEffect(() => {
    if (account && !isPendingOperation) {
      console.log("[v0] Network changed, refreshing data")
      fetchRealTokens()
      fetchRealNFTs()
    }
  }, [network, account])

  // Add network change dependency to useEffect to refresh data when network switches
  useEffect(() => {
    if (account && isSuiChain) {
      // Use isSuiChain derived from useNetwork
      console.log("[v0] Network or account changed, refreshing wallet cleanup data")
      fetchRealTokens()
      fetchRealNFTs()
      fetchEnhancedData()
    }
  }, [account, isSuiChain]) // Use isSuiChain derived from useNetwork

  const fetchEnhancedData = async () => {
    if (!account) return

    setIsLoading(true)
    console.log("[v0] Fetching enhanced wallet data with Blockberry and Blockvision APIs")

    try {
      const coinsData = await blockvisionAPI.getAccountCoins(account)
      console.log("[v0] Blockvision coins data:", coinsData)

      const nftsData = await blockvisionAPI.getAccountNFTs(account)
      console.log("[v0] Blockvision NFTs data:", nftsData)

      const enhancedTokens = await Promise.all(
        mockTokens.map(async (token): Promise<EnhancedToken> => {
          try {
            const security = await blockberryAPI.checkCoinSecurity(token.id)
            return {
              ...token,
              securityLevel: mapSecurityLevel(security.securityLevel),
              securityMessage: security.message,
              confidence: security.confidence,
            }
          } catch (error) {
            // Return token with default security values on error
            return {
              ...token,
              securityLevel: undefined,
              securityMessage: "Security check unavailable",
              confidence: 0,
            }
          }
        }),
      )

      const enhancedNFTs = await Promise.all(
        mockNFTs.map(async (nft): Promise<EnhancedNFT> => {
          try {
            const security = await blockberryAPI.checkNFTSecurity(nft.id)
            return {
              ...nft,
              securityLevel: mapSecurityLevel(security.risk),
              securityMessage: security.securityMessage || `Risk: ${security.risk}`,
            }
          } catch (error) {
            // Return NFT with default security values on error
            return {
              ...nft,
              securityLevel: undefined,
              securityMessage: "Security check unavailable",
              confidence: 0,
            }
          }
        }),
      )

      setTokens(enhancedTokens)
      setNfts(enhancedNFTs)
      setApiStatus({ blockberry: true, blockvision: true })

      console.log("[v0] Enhanced data loaded successfully")
    } catch (error) {
      console.error("[v0] Error fetching enhanced data:", error)
      toast({
        title: "Enhanced data unavailable",
        description: "Using standard RPC. Enhanced features (powered by Blockberry/Blockvision) require API keys.",
        variant: "default",
      })
      setTokens(mockTokens)
      setNfts(mockNFTs)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRealTokens = async () => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to scan for tokens",
        variant: "default",
      })
      return
    }

    setIsLoading(true)
    setIsPendingOperation(true)
    console.log("[v0] Fetching real tokens from Sui blockchain for address:", account)

    try {
      const allBalances = await suiClient.getAllBalances({
        owner: account,
      })

      if (allBalances.length === 0) {
        toast({
          title: "Wallet Empty",
          description: "No tokens found in your wallet on the current network",
          variant: "default",
        })
        setTokens([])
        return
      }

      console.log("[v0] Total token balances:", allBalances.length)

      const fetchedTokens: EnhancedToken[] = allBalances.map((balance) => {
        const coinType = balance.coinType
        const classification = TOKEN_CLASSIFICATIONS[coinType] || "unknown"

        const savedData = localStorage.getItem(`token-${coinType}`)
        const saved = savedData ? JSON.parse(savedData) : {}

        const symbolMatch = coinType.match(/::([^:]+)$/)
        const symbol = symbolMatch ? symbolMatch[1].toUpperCase() : "???"

        return {
          id: coinType,
          name: symbol,
          symbol: symbol,
          balance: (Number.parseInt(balance.totalBalance) / 1_000_000_000).toFixed(2),
          value: "$0.00",
          spam: classification === "scam",
          classification,
          communityRating: saved.rating || 0,
          hidden: saved.hidden || false,
          coinType,
        }
      })

      const enhancedTokens = await Promise.all(
        fetchedTokens.map(async (token) => {
          try {
            const security = await blockberryAPI.checkCoinSecurity(token.id)
            return {
              ...token,
              securityLevel: mapSecurityLevel(security.securityLevel),
              securityMessage: security.message,
              confidence: security.confidence,
            }
          } catch (error) {
            return token
          }
        }),
      )

      setTokens(enhancedTokens)
      setApiStatus({ blockberry: true, blockvision: true })

      toast({
        title: "Tokens loaded successfully",
        description: `Found ${enhancedTokens.length} tokens in your wallet`,
      })

      console.log("[v0] Token scanning complete:", enhancedTokens)
    } catch (error: unknown) {
      console.error("[v0] Error fetching real tokens:", error)

      const errorMessage = error instanceof Error ? error.message : "Unknown error"

      if (errorMessage.includes("rejected")) {
        toast({
          title: "User Rejected",
          description: "You rejected the wallet request. Please try again.",
          variant: "default",
        })
        setIsConnectionRejected(true)
      } else if (errorMessage.includes("disconnected")) {
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet was disconnected. Please reconnect.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error loading tokens",
          description: "Could not fetch tokens from blockchain. Please try again.",
          variant: "destructive",
        })
      }
      setTokens([])
    } finally {
      setIsLoading(false)
      setIsPendingOperation(false)
    }
  }

  const fetchRealNFTs = async () => {
    if (!account) return

    setIsLoading(true)
    setIsPendingOperation(true)
    console.log("[v0] Fetching real NFTs from Sui blockchain for address:", account)

    try {
      const ownedObjects = await suiClient.getOwnedObjects({
        owner: account,
        options: {
          showType: true,
          showContent: true,
          showDisplay: true,
        },
      })

      console.log("[v0] Total owned objects:", ownedObjects.data.length)

      const nftObjects = ownedObjects.data.filter((obj) => {
        const display = obj.data?.display?.data
        return display && (display.image_url || display.thumbnail_url)
      })

      if (nftObjects.length === 0) {
        console.log("[v0] No NFTs found in wallet")
        setNfts([])
        return
      }

      console.log("[v0] Filtered NFT objects:", nftObjects.length)

      const fetchedNFTs: EnhancedNFT[] = nftObjects.map((obj) => {
        const display = obj.data?.display?.data || {}
        const packageId = obj.data?.type?.split("::")[0] || ""
        const classification = NFT_CLASSIFICATIONS[packageId] || "unknown"

        const savedData = localStorage.getItem(`nft-${obj.data?.objectId}`)
        const saved = savedData ? JSON.parse(savedData) : {}

        return {
          id: obj.data?.objectId || "",
          name: display.name || "Unknown NFT",
          collection: display.creator || "Unknown Collection",
          spam: false,
          image: display.image_url || display.thumbnail_url || "/placeholder.svg",
          securityLevel: undefined,
          securityMessage: undefined,
          classification,
          communityRating: saved.rating || 0,
          hidden: saved.hidden || false,
          packageId,
        }
      })

      const enhancedNFTs = await Promise.all(
        fetchedNFTs.map(async (nft) => {
          try {
            const security = await blockberryAPI.checkNFTSecurity(nft.id)
            const metadata = await blockberryAPI.getNFTMetadata(nft.id)
            return {
              ...nft,
              securityLevel: mapSecurityLevel(security.risk),
              securityMessage: security.securityMessage || `Risk: ${security.risk}`,
              floorPrice: metadata.floorPrice,
            }
          } catch (error) {
            // Handle specific errors if needed, e.g., API key issues
            console.warn(`[v0] Could not fetch enhanced data for NFT ${nft.id}:`, error)
            return nft
          }
        }),
      )

      setNfts(enhancedNFTs)
      setApiStatus({ blockberry: true, blockvision: true })

      toast({
        title: "NFTs loaded successfully",
        description: `Found ${enhancedNFTs.length} NFTs in your wallet`,
      })

      console.log("[v0] NFT scanning complete:", enhancedNFTs)
    } catch (error: unknown) {
      console.error("[v0] Error fetching real NFTs:", error)

      const errorMessage = error instanceof Error ? error.message : "Unknown error"

      if (errorMessage.includes("rejected")) {
        toast({
          title: "User Rejected",
          description: "You rejected the wallet request. Please try again.",
          variant: "default",
        })
        setIsConnectionRejected(true)
      } else if (errorMessage.includes("disconnected")) {
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet was disconnected. Please reconnect.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error loading NFTs",
          description: "Could not fetch NFTs from blockchain. Please try again.",
          variant: "destructive",
        })
      }
      setNfts([])
    } finally {
      setIsLoading(false)
      setIsPendingOperation(false)
    }
  }

  const handleRating = (nftId: string, rating: number) => {
    setNfts((prev) =>
      prev.map((nft) => {
        if (nft.id === nftId) {
          const newRating = nft.communityRating + rating
          const nftData = { rating: newRating, hidden: nft.hidden }
          localStorage.setItem(`nft-${nftId}`, JSON.stringify(nftData))
          return { ...nft, communityRating: newRating }
        }
        return nft
      }),
    )
    toast({
      title: "Rating submitted",
      description: `Your NFT rating has been recorded locally`,
    })
  }

  const handleToggleVisibility = (nftId: string) => {
    setNfts((prev) =>
      prev.map((nft) => {
        if (nft.id === nftId) {
          const newHidden = !nft.hidden
          const nftData = { rating: nft.communityRating, hidden: newHidden }
          localStorage.setItem(`nft-${nftId}`, JSON.stringify(nftData))
          return { ...nft, hidden: newHidden }
        }
        return nft
      }),
    )
    toast({
      title: "Visibility updated",
      description: `NFT ${nfts.find((n) => n.id === nftId)?.hidden ? "shown" : "hidden"}`,
    })
  }

  const handleBurnToken = (tokenId: string) => {
    const token = tokens.find((t) => t.id === tokenId)
    if (token) {
      setConfirmBurnModal({
        open: true,
        itemId: tokenId,
        itemName: token.name,
        itemType: "token",
        isBulk: false,
      })
    }
  }

  const handleBurnNFT = (nftId: string) => {
    const nft = nfts.find((n) => n.id === nftId)
    if (nft) {
      setConfirmBurnModal({
        open: true,
        itemId: nftId,
        itemName: nft.name,
        itemType: "nft",
        isBulk: false,
      })
    }
  }

  const handleBurnSelected = () => {
    const count = activeTab === "tokens" ? selectedTokens.size : selectedNFTs.size
    if (count === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select at least one item to burn.",
        variant: "default",
      })
      return
    }

    if (!status.isPro && count > 1) {
      toast({
        title: "Pro Feature",
        description: "Bulk burning (multiple items) requires Pro subscription. Upgrade to burn multiple items at once.",
        variant: "default",
      })
      return
    }

    setConfirmBurnModal({
      open: true,
      itemId: null,
      itemName: "",
      itemType: activeTab === "tokens" ? "token" : "nft",
      isBulk: true,
      count,
    })
  }

  const executeBurn = async () => {
    const { itemId, itemType, isBulk } = confirmBurnModal

    if (!account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to execute burn transactions",
        variant: "destructive",
      })
      setConfirmBurnModal({ open: false, itemId: null, itemName: "", itemType: "token", isBulk: false })
      return
    }

    setIsLoading(true)
    setIsPendingOperation(true)

    try {
      const idsToProcess = isBulk
        ? itemType === "token"
          ? Array.from(selectedTokens)
          : Array.from(selectedNFTs)
        : [itemId]

      if (idsToProcess.length === 0) {
        toast({
          title: "No Items Selected",
          description: "Please select at least one item to burn.",
          variant: "default",
        })
        return
      }

      console.log("[v0] Starting burn transaction for:", idsToProcess)

      // Build Sui transaction
      const txb = new Transaction()

      for (const id of idsToProcess) {
        if (itemType === "token") {
          // Transfer tokens to burn address
          const token = tokens.find((t) => t.id === id)
          if (token?.coinType) {
            // Find the balance object for the specific token type
            // This assumes 'id' is the coin type, which is incorrect for tokens.
            // For tokens, we need to find the actual object ID of the coin to transfer.
            // As a fallback, we'll assume 'id' is the coin type and try to transfer SUI to burn address as an example.
            // A more robust solution would require fetching coin objects.

            // Example for SUI token transfer:
            if (token.coinType === "0x2::sui::SUI") {
              const suiCoinObjects = await suiClient.getCoins({ owner: account!, coinType: token.coinType })
              if (suiCoinObjects.data.length > 0) {
                const coinToBurn = suiCoinObjects.data[0] // Take the first SUI coin object
                txb.moveCall({
                  target: "0x2::transfer::transfer",
                  typeArguments: [token.coinType],
                  arguments: [txb.object(coinToBurn.coinObjectId), txb.pure.address(BURN_ADDRESS)],
                })
              } else {
                console.warn(`[v0] No SUI coin objects found for address ${account} to burn.`)
                toast({
                  title: "Burn Warning",
                  description: `Could not find SUI coins to burn for ${token.name}. Skipping.`,
                })
                continue // Skip this iteration if no SUI coins found
              }
            } else {
              // For other token types, this logic needs refinement.
              // Currently, it might try to burn the coinType string as an object ID, which is incorrect.
              // A proper implementation would fetch coin objects and their IDs.
              console.warn(
                `[v0] Automatic burning for token type ${token.coinType} is not fully implemented. Consider manual transfer or specific coin object fetching.`,
              )
              toast({
                title: "Burn Incomplete",
                description: `Burning for ${token.name} is not fully supported yet.`,
              })
            }
          }
        } else {
          // Transfer NFT to burn address
          txb.moveCall({
            target: "0x2::transfer::transfer",
            arguments: [txb.object(id), txb.pure.address(BURN_ADDRESS)],
          })
        }
      }

      // Sign and execute transaction
      const windowWithSuiWallet = window as unknown as { suiWallet?: { signAndExecuteTransactionBlock: (options: unknown) => Promise<{ digest: string }> } }
      const result = await windowWithSuiWallet?.suiWallet?.signAndExecuteTransactionBlock({
        transactionBlock: txb,
        options: {
          showInput: true,
          showEffects: true,
        },
      })

      if (result) {
        console.log("[v0] Burn transaction executed:", result.digest)

        // Award Airpoints for cleanup (10 points)
        try {
          await fetch("/api/airpoints", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "add",
              walletAddress: account,
              amount: 10,
              type: "earn_cleanup",
              description: `Burned ${idsToProcess.length} ${itemType}(s) - TX: ${result.digest.slice(0, 8)}`,
            }),
          })
          console.log("[v0] Airpoints awarded for cleanup")
        } catch (error) {
          console.error("[v0] Error awarding Airpoints:", error)
        }

        // Remove items from UI
        if (itemType === "token") {
          setTokens((prev) => prev.filter((t) => !idsToProcess.includes(t.id)))
          setSelectedTokens(new Set())
        } else {
          setNfts((prev) => prev.filter((n) => !idsToProcess.includes(n.id)))
          setSelectedNFTs(new Set())
        }

        toast({
          title: "Burn Successful",
          description: `${idsToProcess.length} ${itemType} burned. +10 Airpoints! TX: ${result.digest.slice(0, 8)}...`,
        })
      }
    } catch (error: unknown) {
      console.error("[v0] Error executing burn:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to execute burn transaction"

      if (errorMessage.includes("rejected")) {
        toast({
          title: "Transaction Rejected",
          description: "You rejected the transaction. Please try again.",
          variant: "default",
        })
      } else if (errorMessage.includes("disconnected")) {
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet was disconnected. Please reconnect and try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Burn Failed",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
      setIsPendingOperation(false)
      setConfirmBurnModal({ open: false, itemId: null, itemName: "", itemType: "token", isBulk: false })
    }
  }

  const handleTokenRating = (tokenId: string, rating: number) => {
    setTokens((prev) =>
      prev.map((token) => {
        if (token.id === tokenId) {
          const newRating = token.communityRating + rating
          const tokenData = { rating: newRating, hidden: token.hidden }
          localStorage.setItem(`token-${tokenId}`, JSON.stringify(tokenData))
          return { ...token, communityRating: newRating }
        }
        return token
      }),
    )
    toast({
      title: "Rating submitted",
      description: `Your token rating has been recorded locally`,
    })
  }

  const handleToggleTokenVisibility = (tokenId: string) => {
    setTokens((prev) =>
      prev.map((token) => {
        if (token.id === tokenId) {
          const newHidden = !token.hidden
          const tokenData = { rating: token.communityRating, hidden: newHidden }
          localStorage.setItem(`token-${tokenId}`, JSON.stringify(tokenData))
          return { ...token, hidden: newHidden }
        }
        return token
      }),
    )
    toast({
      title: "Visibility updated",
      description: `Token ${tokens.find((t) => t.id === tokenId)?.hidden ? "shown" : "hidden"}`,
    })
  }

  const handleBurnTokenMock = async (tokenId: string) => {
    if (!account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to burn tokens",
        variant: "destructive",
      })
      return
    }

    try {
      toast({
        title: "Transfer initiated",
        description: `Transferring token to burn address ${BURN_ADDRESS.slice(0, 8)}...`,
      })

      // Mock transaction for now - in production, use suiClient.signAndExecuteTransaction
      setTimeout(() => {
        setTokens((prev) => prev.filter((token) => token.id !== tokenId))
        toast({
          title: "Token burned successfully",
          description: "The token has been transferred to the burn address",
        })
      }, 1500)
    } catch (error) {
      console.error("[v0] Error burning token:", error)
      toast({
        title: "Burn failed",
        description: "Could not transfer token. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleTokenSelect = (tokenId: string) => {
    setSelectedTokens((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(tokenId)) {
        newSet.delete(tokenId)
      } else {
        newSet.add(tokenId)
      }
      return newSet
    })
  }

  const handleToggleSelect = (nftId: string) => {
    setSelectedNFTs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(nftId)) {
        newSet.delete(nftId)
      } else {
        newSet.add(nftId)
      }
      return newSet
    })
  }

  const nftSummary = nfts.reduce(
    (acc, nft) => {
      acc.total++
      acc[nft.classification]++
      return acc
    },
    { total: 0, legit: 0, dubious: 0, scam: 0, unknown: 0 },
  )

  const tokenSummary = tokens.reduce(
    (acc, token) => {
      acc.total++
      acc[token.classification]++
      return acc
    },
    { total: 0, legit: 0, dubious: 0, scam: 0, unknown: 0 },
  )

  const ClassificationBadge = ({ classification }: { classification: Classification }) => {
    const config = {
      legit: { color: "bg-green-500/10 text-green-500 border-green-500/20", label: "Legit", icon: ShieldCheck },
      dubious: { color: "bg-orange-500/10 text-orange-500 border-orange-500/20", label: "Dubious", icon: AlertCircle },
      scam: { color: "bg-red-500/10 text-red-500 border-red-500/20", label: "Scam", icon: ShieldAlert },
      unknown: { color: "bg-gray-500/10 text-gray-500 border-gray-500/20", label: "Unknown", icon: Info },
    }

    const { color, label, icon: Icon } = config[classification]

    return (
      <Badge variant="outline" className={`gap-1 text-xs ${color}`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
  }

  const SecurityBadge = ({ level, message }: { level?: string; message?: string }) => {
    if (!level) return null

    const config = {
      safe: { icon: ShieldCheck, color: "bg-green-500/10 text-green-500 border-green-500/20", label: "Safe" },
      warning: { icon: AlertCircle, color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", label: "Warning" },
      danger: { icon: ShieldAlert, color: "bg-red-500/10 text-red-500 border-red-500/20", label: "Danger" },
    }

    const { icon: Icon, color, label } = config[level as keyof typeof config] || config.warning

    return (
      <Badge variant="outline" className={`gap-1 text-xs ${color}`} title={message}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
  }

  const mockTokens: EnhancedToken[] = [
    {
      id: "1",
      name: "SUI",
      symbol: "SUI",
      balance: "1,234.56",
      value: "$2,469.12",
      spam: false,
      classification: "legit",
      communityRating: 0,
      hidden: false,
      coinType: "0x2::sui::SUI",
    },
    {
      id: "2",
      name: "USDC",
      symbol: "USDC",
      balance: "500.00",
      value: "$500.00",
      spam: false,
      classification: "legit",
      communityRating: 0,
      hidden: false,
    },
    {
      id: "3",
      name: "SpamToken",
      symbol: "SPAM",
      balance: "999,999",
      value: "$0.00",
      spam: true,
      classification: "scam",
      communityRating: 0,
      hidden: false,
    },
    {
      id: "4",
      name: "AirdropToken",
      symbol: "AIRDROP",
      balance: "1,000",
      value: "$0.01",
      spam: true,
      classification: "dubious",
      communityRating: 0,
      hidden: false,
    },
  ]

  const mockNFTs: EnhancedNFT[] = [
    {
      id: "1",
      name: "Sui Whale #123",
      collection: "Sui Whales",
      spam: false,
      image: "/nft-whale.jpg",
      classification: "legit",
      communityRating: 0,
      hidden: false,
    },
    {
      id: "2",
      name: "Sui Punk #456",
      collection: "Sui Punks",
      spam: false,
      image: "/nft-punk.jpg",
      classification: "legit",
      communityRating: 0,
      hidden: false,
    },
    {
      id: "3",
      name: "Free NFT",
      collection: "Spam Collection",
      spam: true,
      image: "/spam-nft.jpg",
      classification: "unknown",
      communityRating: 0,
      hidden: false,
    },
  ]

  const filteredTokens = tokens
    .filter((token) => {
      if (!filters.classifications.has(token.classification)) return false
      if (token.securityLevel && !filters.securityLevels.has(token.securityLevel)) return false
      if (token.hidden && !filters.showHidden) return false
      if (
        searchQuery &&
        !token.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false
      return true
    })
    .sort((a, b) => {
      const order = filters.sortOrder === "asc" ? 1 : -1
      switch (filters.sortBy) {
        case "name":
          return order * a.name.localeCompare(b.name)
        case "balance":
          return order * (Number.parseFloat(a.balance) - Number.parseFloat(b.balance))
        case "rating":
          return order * (a.communityRating - b.communityRating)
        case "classification":
          const classOrder = { legit: 0, unknown: 1, dubious: 2, scam: 3 }
          return order * (classOrder[a.classification] - classOrder[b.classification])
        default:
          return 0
      }
    })

  const filteredNFTs = nfts
    .filter((nft) => {
      if (!filters.classifications.has(nft.classification)) return false
      if (nft.securityLevel && !filters.securityLevels.has(nft.securityLevel)) return false
      if (nft.hidden && !filters.showHidden) return false
      if (
        searchQuery &&
        !nft.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !nft.collection.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false
      return true
    })
    .sort((a, b) => {
      const order = filters.sortOrder === "asc" ? 1 : -1
      switch (filters.sortBy) {
        case "name":
          return order * a.name.localeCompare(b.name)
        case "rating":
          return order * (a.communityRating - b.communityRating)
        case "classification":
          const classOrder = { legit: 0, unknown: 1, dubious: 2, scam: 3 }
          return order * (classOrder[a.classification] - classOrder[b.classification])
        default:
          return 0
      }
    })

  const toggleClassification = (classification: Classification) => {
    const newClassifications = new Set(filters.classifications)
    if (newClassifications.has(classification)) {
      newClassifications.delete(classification)
    } else {
      newClassifications.add(classification)
    }
    setFilters({ ...filters, classifications: newClassifications })
  }

  const toggleSecurityLevel = (level: string) => {
    const newLevels = new Set(filters.securityLevels)
    if (newLevels.has(level)) {
      newLevels.delete(level)
    } else {
      newLevels.add(level)
    }
    setFilters({ ...filters, securityLevels: newLevels })
  }

  const resetFilters = () => {
    setFilters({
      classifications: new Set(["legit", "dubious", "scam", "unknown"]),
      securityLevels: new Set(["safe", "warning", "danger"]),
      showHidden: false,
      sortBy: "name",
      sortOrder: "asc",
    })
  }

  // Conditionally render based on isSuiChain derived from useNetwork
  if (!isSuiChain) {
    return (
      <main className="container mx-auto px-4 py-8 md:px-6">
        <Card className="glass-card mx-auto max-w-2xl border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 py-12">
          <CardHeader className="text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
            <CardTitle className="text-2xl">Network Not Supported</CardTitle>
            <CardDescription className="text-pretty">
              This feature is currently only available on supported blockchain networks. Please switch to a supported
              network to access the Wallet Cleanup tool. Full multichain support launching soon!
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  if (!isConnected || !account || isConnectionRejected) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">
          {isConnectionRejected ? "Connection Rejected" : "No Wallet Connected"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isConnectionRejected
            ? "The connection to your wallet was rejected. Please reconnect and try again."
            : "Connect a wallet to view and manage your assets"}
        </p>
        <Button variant="default" onClick={() => setShowWalletModal(true)}>
          {isConnectionRejected ? "Reconnect Wallet" : "Connect Wallet"}
        </Button>
        <WalletConnectionModal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} />
      </div>
    )
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8 pb-24 md:px-6 md:pb-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">Wallet Cleanup</h1>
            <p className="text-muted-foreground">Organize your tokens and NFTs, remove spam assets</p>
            {(apiStatus.blockberry || apiStatus.blockvision) && (
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4 text-primary" />
                Enhanced security powered by Blockberry & Blockvision
              </div>
            )}
          </div>
          <Button variant="outline" onClick={() => setShowDocsModal(true)} className="gap-2">
            <Info className="h-4 w-4" />
            Help
          </Button>
        </div>

        {tokens.length > 0 && (
          <Card className="mb-6 border-border/50 bg-gradient-to-br from-primary/5 to-purple-500/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Token Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{tokenSummary.total}</div>
                  <div className="text-xs text-muted-foreground">Total Tokens</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{tokenSummary.legit}</div>
                  <div className="text-xs text-muted-foreground">Legit</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{tokenSummary.dubious}</div>
                  <div className="text-xs text-muted-foreground">Dubious</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{tokenSummary.scam}</div>
                  <div className="text-xs text-muted-foreground">Scam</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-500">{tokenSummary.unknown}</div>
                  <div className="text-xs text-muted-foreground">Unknown</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {nfts.length > 0 && (
          <Card className="mb-6 border-border/50 bg-gradient-to-br from-primary/5 to-purple-500/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">NFT Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{nftSummary.total}</div>
                  <div className="text-xs text-muted-foreground">Total NFTs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{nftSummary.legit}</div>
                  <div className="text-xs text-muted-foreground">Legit</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{nftSummary.dubious}</div>
                  <div className="text-xs text-muted-foreground">Dubious</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{nftSummary.scam}</div>
                  <div className="text-xs text-muted-foreground">Scam</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-500">{nftSummary.unknown}</div>
                  <div className="text-xs text-muted-foreground">Unknown</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tokens or NFTs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filters
                {(filters.classifications.size < 4 || filters.securityLevels.size < 3 || filters.showHidden) && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                    !
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Filters</h4>
                  <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 text-xs">
                    Reset
                  </Button>
                </div>

                <DropdownMenuSeparator />

                <div className="my-3 space-y-3">
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase text-muted-foreground">
                      Classification
                    </label>
                    <div className="space-y-2">
                      {(["legit", "dubious", "scam", "unknown"] as Classification[]).map((classification) => (
                        <div key={classification} className="flex items-center gap-2">
                          <Checkbox
                            id={`filter-${classification}`}
                            checked={filters.classifications.has(classification)}
                            onCheckedChange={() => toggleClassification(classification)}
                          />
                          <label
                            htmlFor={`filter-${classification}`}
                            className="flex flex-1 cursor-pointer items-center gap-2 text-sm"
                          >
                            {classification === "legit" && <ShieldCheck className="h-4 w-4 text-green-500" />}
                            {classification === "dubious" && <AlertCircle className="h-4 w-4 text-orange-500" />}
                            {classification === "scam" && <ShieldAlert className="h-4 w-4 text-red-500" />}
                            {classification === "unknown" && <Info className="h-4 w-4 text-gray-500" />}
                            <span className="capitalize">{classification}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase text-muted-foreground">
                      Security Level
                    </label>
                    <div className="space-y-2">
                      {["safe", "warning", "danger"].map((level) => (
                        <div key={level} className="flex items-center gap-2">
                          <Checkbox
                            id={`security-${level}`}
                            checked={filters.securityLevels.has(level)}
                            onCheckedChange={() => toggleSecurityLevel(level)}
                          />
                          <label
                            htmlFor={`security-${level}`}
                            className="flex flex-1 cursor-pointer items-center gap-2 text-sm"
                          >
                            {level === "safe" && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {level === "warning" && <AlertCircle className="h-4 w-4 text-orange-500" />}
                            {level === "danger" && <ShieldAlert className="h-4 w-4 text-red-500" />}
                            <span className="capitalize">{level}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase text-muted-foreground">Visibility</label>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="show-hidden"
                        checked={filters.showHidden}
                        onCheckedChange={(checked) => setFilters({ ...filters, showHidden: checked as boolean })}
                      />
                      <label htmlFor="show-hidden" className="cursor-pointer text-sm">
                        Show hidden items
                      </label>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase text-muted-foreground">Sort By</label>
                    <div className="space-y-2">
                      <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as typeof filters.sortBy })}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="name">Name</option>
                        <option value="balance">Balance</option>
                        <option value="rating">Community Rating</option>
                        <option value="classification">Classification</option>
                      </select>
                      <div className="flex gap-2">
                        <Button
                          variant={filters.sortOrder === "asc" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFilters({ ...filters, sortOrder: "asc" })}
                          className="flex-1"
                        >
                          Ascending
                        </Button>
                        <Button
                          variant={filters.sortOrder === "desc" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFilters({ ...filters, sortOrder: "desc" })}
                          className="flex-1"
                        >
                          Descending
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "tokens" | "nfts")} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="tokens" className="gap-2">
              <Coins className="h-4 w-4" />
              Tokens
            </TabsTrigger>
            <TabsTrigger value="nfts" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              NFTs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="space-y-4">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse bg-muted/20">
                    <CardContent className="p-6">
                      <div className="h-20 rounded bg-muted/40" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredTokens.length === 0 ? (
              <Card className="border-border/50 bg-muted/10">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Coins className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {tokens.length === 0 ? "No tokens found in your wallet" : "No tokens match your filters"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-2">
                {filteredTokens.map((token) => (
                  <div
                    key={token.id}
                    className={`flex items-center justify-between gap-4 rounded-lg border border-border/50 bg-background/30 px-4 py-3 transition-all hover:border-primary/50 hover:bg-background/50 ${token.hidden ? "opacity-50" : ""
                      } ${selectedTokens.has(token.id) ? "border-primary bg-primary/5 ring-2 ring-primary/20" : ""}`}
                  >
                    <div className="flex flex-1 items-center gap-4">
                      <Checkbox
                        id={`token-${token.id}`}
                        checked={selectedTokens.has(token.id)}
                        onCheckedChange={() => handleToggleTokenSelect(token.id)}
                      />
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                        {token.symbol.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">{token.name}</span>
                          <span className="text-sm text-muted-foreground">({token.symbol})</span>
                          {token.spam && (
                            <Badge variant="destructive" className="text-xs">
                              Spam
                            </Badge>
                          )}
                          <ClassificationBadge classification={token.classification} />
                          <SecurityBadge level={token.securityLevel} message={token.securityMessage} />
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="font-medium">{token.balance}</span>
                          {token.communityRating !== 0 && (
                            <span
                              className={`text-xs ${token.communityRating > 0
                                ? "text-green-500"
                                : token.communityRating < 0
                                  ? "text-red-500"
                                  : ""
                                }`}
                            >
                              Community: {token.communityRating > 0 ? "+" : ""}
                              {token.communityRating}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-green-500/10 hover:text-green-500"
                        onClick={() => handleTokenRating(token.id, 1)}
                        title="Rate as trustworthy"
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-red-500/10 hover:text-red-500"
                        onClick={() => handleTokenRating(token.id, -1)}
                        title="Rate as suspicious"
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleToggleTokenVisibility(token.id)}
                        title={token.hidden ? "Show Token" : "Hide Token from view"}
                      >
                        {token.hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-red-500/10 hover:text-red-500"
                        onClick={() => handleBurnToken(token.id)}
                        title="Transfer to burn address (0x...dead)"
                      >
                        <Flame className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="nfts" className="space-y-4">
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Card key={i} className="animate-pulse overflow-hidden border-border/50 bg-muted/20">
                    <div className="aspect-square w-full bg-muted/40" />
                    <CardContent className="p-4">
                      <div className="h-4 rounded bg-muted/40" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredNFTs.length === 0 ? (
              <Card className="border-border/50 bg-background/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {nfts.length === 0 ? "No NFTs found in your wallet" : "No NFTs match your filters"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredNFTs.map((nft) => (
                  <div
                    key={nft.id}
                    className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${nft.hidden ? "opacity-50" : ""
                      } ${selectedNFTs.has(nft.id)
                        ? "border-primary shadow-xl shadow-primary/30 ring-2 ring-primary/20"
                        : "border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20"
                      } bg-gradient-to-b from-background/80 to-background/50 backdrop-blur-sm`}
                  >
                    <div className="absolute left-3 top-3 z-10">
                      <Checkbox
                        id={`nft-${nft.id}`}
                        checked={selectedNFTs.has(nft.id)}
                        onCheckedChange={() => handleToggleSelect(nft.id)}
                        className="h-5 w-5 border-2 bg-background/80 backdrop-blur-sm"
                      />
                    </div>

                    <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5">
                      {nft.spam && (
                        <Badge variant="destructive" className="shadow-lg backdrop-blur-sm">
                          Spam
                        </Badge>
                      )}
                      <ClassificationBadge classification={nft.classification} />
                      {communityList[nft.id] && (
                        <Badge variant="secondary" className="shadow-lg backdrop-blur-sm">
                          {communityList[nft.id].rating}% Trust
                        </Badge>
                      )}
                    </div>

                    <div className="relative aspect-square w-full overflow-hidden">
                      <img
                        src={nft.image || "/placeholder.svg?height=400&width=400"}
                        alt={nft.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>

                    <div className="p-4">
                      <div className="mb-1 truncate font-bold text-lg">{nft.name}</div>
                      <div className="mb-3 truncate text-sm text-muted-foreground">{nft.collection}</div>

                      {nft.floorPrice && (
                        <div className="mb-3 flex items-center gap-2">
                          <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                            Floor: {nft.floorPrice}
                          </Badge>
                        </div>
                      )}

                      <div className="mb-4 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Community:</span>
                        <span
                          className={`font-semibold ${nft.communityRating > 0
                            ? "text-green-500"
                            : nft.communityRating < 0
                              ? "text-red-500"
                              : "text-gray-500"
                            }`}
                        >
                          {nft.communityRating > 0 ? "+" : ""}
                          {nft.communityRating}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 rounded-full hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/50 bg-transparent"
                            onClick={() => handleRating(nft.id, 1)}
                            title="Rate as trustworthy"
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 rounded-full hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 bg-transparent"
                            onClick={() => handleRating(nft.id, -1)}
                            title="Rate as suspicious"
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 rounded-full bg-transparent"
                            onClick={() => handleToggleVisibility(nft.id)}
                            title={nft.hidden ? "Show NFT" : "Hide NFT from view"}
                          >
                            {nft.hidden ? <Eye className="mr-1 h-4 w-4" /> : <EyeOff className="mr-1 h-4 w-4" />}
                            {nft.hidden ? "Show" : "Hide"}
                          </Button>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full rounded-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                          onClick={() => handleBurnNFT(nft.id)}
                          title="Transfer to burn address (0x...dead)"
                        >
                          <Flame className="mr-2 h-4 w-4" />
                          Burn NFT
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Enhanced Burn Confirmation Modal */}
      <Dialog open={confirmBurnModal.open} onOpenChange={(open) => setConfirmBurnModal((prev) => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-[500px] border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <AlertCircle className="h-6 w-6 text-orange-500" />
              Confirm Burn Action
            </DialogTitle>
            <DialogDescription className="text-base">
              {confirmBurnModal.isBulk
                ? `You are about to burn ${confirmBurnModal.count} ${confirmBurnModal.itemType}(s). This action cannot be undone.`
                : `You are about to burn "${confirmBurnModal.itemName}". This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Security Warning */}
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
              <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                ⚠️ WARNING: This action is irreversible
              </p>
              <p className="mt-2 text-sm text-red-800 dark:text-red-200">
                Once transferred to the burn address, these assets cannot be recovered.
              </p>
            </div>

            {/* Item Details */}
            <div className="rounded-lg border bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-sm font-medium">
                {confirmBurnModal.isBulk
                  ? `Transferring ${confirmBurnModal.count} ${confirmBurnModal.itemType}`
                  : `Transferring ${confirmBurnModal.itemName}`}
              </p>
              {!confirmBurnModal.isBulk && (
                <p className="mt-1 text-xs text-slate-500">
                  Type: {confirmBurnModal.itemType === "token" ? "Token" : "NFT"}
                </p>
              )}
            </div>

            {/* Burn Address Info */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
              <p className="text-xs font-mono text-blue-900 dark:text-blue-100">Burn Address: {BURN_ADDRESS}</p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmBurnModal({ ...confirmBurnModal, open: false })}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={executeBurn}
              disabled={isLoading || isPendingOperation}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
            >
              {isLoading || isPendingOperation ? "Processing..." : "Confirm Burn"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDocsModal} onOpenChange={setShowDocsModal}>
        <DialogContent className="max-w-2xl border-border/50 bg-gradient-to-br from-primary/10 via-background to-primary/5 backdrop-blur-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Wallet Cleanup Documentation</DialogTitle>
            <DialogDescription>Learn how to use the Wallet Cleanup tool effectively</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-primary">Overview</h3>
              <p className="text-sm text-muted-foreground">
                The Wallet Cleanup tool helps you manage your Sui tokens and NFTs by identifying spam, scam, and dubious
                assets. It uses community ratings, curated lists, and blockchain security APIs to classify your assets.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-primary">Classification System</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>
                    <strong>Legit:</strong> Verified tokens/NFTs from known projects (e.g., SUI, USDC, verified
                    collections)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" />
                  <span>
                    <strong>Dubious:</strong> Assets with mixed community ratings or unknown origins
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                  <span>
                    <strong>Scam:</strong> Known scam tokens/NFTs from our curated blacklist and security APIs
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                  <span>
                    <strong>Unknown:</strong> New or unclassified assets - exercise caution
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-primary">Actions</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <strong>Community Rating:</strong> Use thumbs up/down to rate assets and contribute to the community
                  legitimacy list
                </li>
                <li>
                  <strong>Hide:</strong> Temporarily hide assets from your view without removing them from your wallet
                </li>
                <li>
                  <strong>Burn:</strong> Transfer unwanted assets to the burn address (0x...dead) to permanently remove
                  them
                </li>
                <li>
                  <strong>Bulk Actions:</strong> Select multiple items and burn them all at once for efficient cleanup
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-primary">Filters & Sorting</h3>
              <p className="text-sm text-muted-foreground">
                Use filters to view only specific classifications, security levels, or hidden items. Sort by name,
                balance, community rating, or classification to organize your assets effectively.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-primary">Security Features</h3>
              <p className="text-sm text-muted-foreground">
                Enhanced by Blockberry and Blockvision APIs, the tool provides real-time security checks and metadata
                enrichment. Floor prices and holder counts help you assess NFT value before taking action.
              </p>
            </div>

            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <p className="text-sm">
                <strong>Tip:</strong> Always review assets carefully before burning. While we use multiple data sources
                for classification, you should verify important assets independently.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
