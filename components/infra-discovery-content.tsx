"use client"

import React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProStatus } from "@/lib/pro-status-context"
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Cpu,
  CreditCard,
  Download,
  ExternalLink,
  Lock,
  Plus,
  Radio,
  Search,
  Server,
  Shield,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react"
import { useEffect, useState } from "react"
// CHANGE: Replaced useChainStore import with useNetwork
import { BrandLogo } from "@/components/brand-logo"
import { ExplorerSelectorDialog } from "@/components/explorer-selector-dialog"
import { useToast } from "@/hooks/use-toast"
import { useNetwork } from "@/lib/network-context"
import { useWalletStore } from "@/lib/wallet-store"
// CHANGE: Updated import to use client wrapper instead of old brand-logos.ts that exposes API key
import { getBrandLogo } from "@/lib/brand-logos-client"

interface PricingTier {
  name: string
  price: number
  token: string
  requests?: number
}

interface InfraService {
  id: string
  name: string
  provider: string
  type: "RPC" | "Indexing" | "Node" | "Gateway" | "Analytics"
  pricing: "Free" | "Freemium" | "Paid"
  tags: string[]
  sla?: string
  acceptedTokens: string[]
  verified?: boolean
  url?: string
  contact?: string
  pricingTiers?: PricingTier[]
}

interface ClientQuota {
  clientId: string
  clientName: string
  plan: "Free" | "Pro" | "Enterprise"
  requestsUsed: number
  requestsLimit: number
  usagePercent: number
  lastReset: string
  nextReset: string
  services: string[]
  status: "active" | "warning" | "limited"
}

// Define the structure for a validator
interface Validator {
  id: string
  name: string
  address: string
  commission: string
  uptime: string
  staked: string
  apy?: string
  votingPower?: string
  status: "active" | "inactive" | "jailing"
  verified: boolean
  tags: string[]
  description: string
  website?: string
}

// Define the structure for an indexing provider
interface IndexingProvider {
  id: string
  name: string
  provider: string
  type: "Indexing"
  pricing: "Free" | "Freemium" | "Paid"
  verified: boolean
  tags: string[]
  description: string
  website: string
  features: string[]
  sla: string
  acceptedTokens: string[]
  documentation?: string
  explorer?: string
}

// Define the structure for an RPC provider
interface RPCProvider {
  id: string
  name: string
  provider: string
  type: "RPC"
  pricing: "Free" | "Freemium" | "Paid"
  verified: boolean
  tags: string[]
  description: string
  website: string
  features: string[]
  sla: string
  acceptedTokens: string[]
  documentation?: string
}

// Define the structure for a gateway provider
interface GatewayProvider {
  id: string
  name: string
  provider: string
  type: "Gateway"
  pricing: "Free" | "Freemium" | "Paid"
  verified: boolean
  tags: string[]
  description: string
  website: string
  features: string[]
  sla: string
  acceptedTokens: string[]
  documentation?: string
}

export function InfraDiscoveryContent() {
  // CHANGE: Replaced useChainStore with useNetwork
  const { network, getChainGroup } = useNetwork()
  const isSuiChain = getChainGroup() === "Sui"
  const { status } = useProStatus()

  const { currentAccount } = useWalletStore()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPricing, setSelectedPricing] = useState<string | null>(null)
  const [isProviderLoggedIn, setIsProviderLoggedIn] = useState(false)
  const [showAddServiceModal, setShowAddServiceModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedService, setSelectedService] = useState<InfraService | null>(null)
  const [showJSONView, setShowJSONView] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [services, setServices] = useState<InfraService[]>([])
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null)
  const [selectedPaymentToken, setSelectedPaymentToken] = useState("SUI")
  const [formData, setFormData] = useState({
    name: "",
    provider: "",
    type: "RPC" as const,
    pricing: "Freemium" as const,
    tags: "",
    sla: "",
    acceptedTokens: "",
    url: "",
    contact: "",
  })

  type FormDataType = typeof formData
  type ServiceType = FormDataType["type"]
  type PricingType = FormDataType["pricing"]

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, type: e.target.value as ServiceType })
  }

  const handlePricingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, pricing: e.target.value as PricingType })
  }
  const [clientQuotas, setClientQuotas] = useState<ClientQuota[]>([])
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(null)
  const [selectedIndexing, setSelectedIndexing] = useState<IndexingProvider | null>(null)
  const [selectedRPC, setSelectedRPC] = useState<RPCProvider | null>(null)

  // Real data from Supabase
  const [realProviders, setRealProviders] = useState<any[]>([])
  const [isLoadingProviders, setIsLoadingProviders] = useState(true)
  const [providerUsage, setProviderUsage] = useState<any[]>([])

  // Fetch real providers from API
  useEffect(() => {
    fetchProviders()
  }, [selectedCategory, selectedPricing, searchQuery])

  // Fetch usage data when wallet connected
  useEffect(() => {
    if (currentAccount) {
      fetchUsageData()
    }
  }, [currentAccount])

  const fetchProviders = async () => {
    try {
      setIsLoadingProviders(true)
      const params = new URLSearchParams()
      if (selectedCategory) params.append("category", selectedCategory)
      if (selectedPricing) params.append("pricing", selectedPricing)
      if (searchQuery) params.append("search", searchQuery)

      const response = await fetch(`/api/providers/listings?${params}`)
      const data = await response.json()

      if (data.providers) {
        setRealProviders(data.providers)
      }
    } catch (error) {
      console.error("[v0] Error fetching providers:", error)
      toast({
        title: "Error loading providers",
        description: "Failed to fetch provider listings",
        variant: "destructive",
      })
    } finally {
      setIsLoadingProviders(false)
    }
  }

  const fetchUsageData = async () => {
    if (!currentAccount) return

    try {
      const response = await fetch(`/api/providers/usage?wallet=${currentAccount}`)
      const data = await response.json()

      if (data.usage) {
        setProviderUsage(data.usage)
      }
    } catch (error) {
      console.error("[v0] Error fetching usage data:", error)
    }
  }

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedVerified, setSelectedVerified] = useState<boolean | null>(null)

  const handleExportRegistry = async () => {
    const fullRegistry = {
      exportDate: new Date().toISOString(),
      totalProviders: realProviders.length,
      providers: realProviders,
      usage: providerUsage,
      customServices: services,
    }

    const jsonString = JSON.stringify(fullRegistry, null, 2)
    const dataUri = `data:text/json;charset=utf-8,${encodeURIComponent(jsonString)}`

    const link = document.createElement("a")
    link.href = dataUri
    link.download = "atlas-services-registry.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Award Airpoints for export (5 points)
    if (currentAccount) {
      try {
        await fetch("/api/airpoints", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "add",
            walletAddress: currentAccount,
            amount: 5,
            type: "earn_export",
            description: `Exported ${realProviders.length} providers registry`,
          }),
        })
        console.log("[v0] Airpoints awarded for export")
      } catch (error) {
        console.error("[v0] Error awarding Airpoints:", error)
      }
    }

    toast({
      title: "Registry Exported",
      description: `Downloaded registry with ${fullRegistry.totalProviders} providers. +5 Airpoints!`,
    })
  }

  const mockRPCProviders: RPCProvider[] = [
    {
      id: "shinami",
      name: "Shinami",
      provider: "Shinami",
      type: "RPC",
      pricing: "Freemium",
      verified: true,
      tags: ["gRPC Ready", "High Performance", "Gas Station", "Production Ready"],
      description: "Leading Node Service - enterprise-grade JSON-RPC/gRPC, Gas Station integration, free + paid tiers",
      website: "https://shinami.io",
      features: ["gRPC Support", "Gas Station", "Low Latency", "99.9% Uptime"],
      sla: "99.9%",
      acceptedTokens: ["SUI"],
      documentation: "https://docs.shinami.io",
    },
    {
      id: "quicknode",
      name: "QuickNode",
      provider: "QuickNode Inc.",
      type: "RPC",
      pricing: "Freemium",
      verified: true,
      tags: ["gRPC Ready", "High Performance", "Multi-Region", "Recommended"],
      description: "High-performance RPC with gRPC support, multi-region, add-ons like streams",
      website: "https://quicknode.com",
      features: ["gRPC Support", "Multi-Region", "Streams", "99.99% Uptime"],
      sla: "99.99%",
      acceptedTokens: ["SUI", "USDC"],
      documentation: "https://docs.quicknode.com",
    },
    {
      id: "dwellir",
      name: "Dwellir",
      provider: "Dwellir",
      type: "RPC",
      pricing: "Paid",
      verified: true,
      tags: ["gRPC Ready", "Enterprise Grade", "Transparent Pricing", "High Uptime"],
      description: "Enterprise infrastructure, full gRPC, transparent pricing, high uptime SLA",
      website: "https://dwellir.com",
      features: ["Full gRPC", "Enterprise Grade", "Transparent Pricing", "99.95% Uptime"],
      sla: "99.95%",
      acceptedTokens: ["SUI"],
      documentation: "https://docs.dwellir.com",
    },
    {
      id: "chainstack",
      name: "Chainstack",
      provider: "Chainstack",
      type: "RPC",
      pricing: "Freemium",
      verified: true,
      tags: ["Global", "Elastic Nodes", "Archive Data", "Fast Sync"],
      description: "Global elastic/dedicated nodes, fast sync, archive data support",
      website: "https://chainstack.com",
      features: ["Elastic Nodes", "Archive Data", "Fast Sync", "Global Coverage"],
      sla: "99.9%",
      acceptedTokens: ["SUI", "USDC"],
      documentation: "https://docs.chainstack.com",
    },
    {
      id: "ankr",
      name: "Ankr",
      provider: "Ankr",
      type: "RPC",
      pricing: "Freemium",
      verified: true,
      tags: ["All-in-One", "Premium RPC", "Public Endpoints"],
      description: "All-in-one Web3 hub with public + premium RPC endpoints",
      website: "https://ankr.com",
      features: ["Public RPC", "Premium Nodes", "Analytics", "Developer Tools"],
      sla: "99.8%",
      acceptedTokens: ["SUI"],
      documentation: "https://docs.ankr.com",
    },
    {
      id: "getblock",
      name: "GetBlock",
      provider: "GetBlock",
      type: "RPC",
      pricing: "Freemium",
      verified: true,
      tags: ["Dedicated Nodes", "Unlimited Requests", "Easy Access"],
      description: "Dedicated/shared nodes, unlimited requests on paid plans",
      website: "https://getblock.io",
      features: ["Dedicated Nodes", "Unlimited Requests", "Shared Nodes", "Easy Setup"],
      sla: "99.7%",
      acceptedTokens: ["SUI"],
      documentation: "https://docs.getblock.io",
    },
    {
      id: "blockvision",
      name: "BlockVision",
      provider: "BlockVision",
      type: "RPC",
      pricing: "Freemium",
      verified: true,
      tags: ["Public/Private", "Enterprise RPC", "Free Endpoints"],
      description: "Public/private/enterprise RPC, free public endpoints available",
      website: "https://blockvision.org",
      features: ["Public RPC", "Private Nodes", "Enterprise Grade", "99.85% Uptime"],
      sla: "99.85%",
      acceptedTokens: ["SUI"],
      documentation: "https://docs.blockvision.org",
    },
    {
      id: "onfinality",
      name: "OnFinality",
      provider: "OnFinality",
      type: "RPC",
      pricing: "Freemium",
      verified: true,
      tags: ["Elastic API", "99.99% Uptime", "Full Archive", "Production Ready"],
      description: "Elastic API with 99.99% uptime, full archive data, production-grade",
      website: "https://onfinality.io",
      features: ["Elastic API", "Full Archive", "99.99% SLA", "Monitoring Tools"],
      sla: "99.99%",
      acceptedTokens: ["SUI"],
      documentation: "https://docs.onfinality.io",
    },
    {
      id: "allthatnode",
      name: "All That Node",
      provider: "All That Node",
      type: "RPC",
      pricing: "Freemium",
      verified: true,
      tags: ["Multi-Chain", "Easy Access", "Reliable"],
      description: "Multi-chain support including Sui with easy-to-use APIs",
      website: "https://www.allthatnode.com",
      features: ["Multi-Chain", "Simple APIs", "Good Uptime", "Developer Friendly"],
      sla: "99.6%",
      acceptedTokens: ["SUI"],
      documentation: "https://docs.allthatnode.com",
    },
    {
      id: "rockx",
      name: "RockX",
      provider: "RockX",
      type: "RPC",
      pricing: "Freemium",
      verified: true,
      tags: ["Global Operator", "Staking", "Professional"],
      description: "Global node operator with staking services and reliable RPC",
      website: "https://www.rockx.com",
      features: ["Global Nodes", "Staking Services", "RPC Access", "Professional SLA"],
      sla: "99.8%",
      acceptedTokens: ["SUI"],
      documentation: "https://docs.rockx.com",
    },
    {
      id: "nownodes",
      name: "NOWNodes",
      provider: "NOWNodes",
      type: "RPC",
      pricing: "Free",
      verified: true,
      tags: ["Free", "Easy Access", "Community"],
      description: "Easy access to full nodes with free tier for everyone",
      website: "https://nownodes.io",
      features: ["Free Access", "Full Nodes", "Simple Setup", "Community Supported"],
      sla: "Best Effort",
      acceptedTokens: ["SUI"],
      documentation: "https://docs.nownodes.io",
    },
    {
      id: "publicnode",
      name: "PublicNode",
      provider: "PublicNode",
      type: "RPC",
      pricing: "Free",
      verified: true,
      tags: ["Free", "Community Powered", "Decentralized"],
      description: "Free community-powered endpoints for everyone",
      website: "https://publicnode.com",
      features: ["Free Access", "Community Nodes", "Decentralized", "Open Source"],
      sla: "Best Effort",
      acceptedTokens: ["SUI"],
      documentation: "https://docs.publicnode.com",
    },
    {
      id: "triton",
      name: "Triton One",
      provider: "Triton One",
      type: "RPC",
      pricing: "Paid",
      verified: true,
      tags: ["High Performance", "Premium", "Low Latency"],
      description: "High-performance RPC with low latency and premium support",
      website: "https://tritonone.com",
      features: ["Low Latency", "Premium Support", "High Performance", "Dedicated"],
      sla: "99.99%",
      acceptedTokens: ["SUI"],
      documentation: "https://docs.tritonone.com",
    },
    {
      id: "rpcfast",
      name: "RPC Fast",
      provider: "RPC Fast",
      type: "RPC",
      pricing: "Paid",
      verified: true,
      tags: ["Premium", "Dedicated Clusters", "Low Latency"],
      description: "Premium dedicated clusters with ultra-low latency",
      website: "https://rpcfast.com",
      features: ["Dedicated Clusters", "Ultra Low Latency", "Premium SLA", "24/7 Support"],
      sla: "99.99%",
      acceptedTokens: ["SUI", "USDC"],
      documentation: "https://docs.rpcfast.com",
    },
    {
      id: "redswitches",
      name: "RedSwitches",
      provider: "RedSwitches",
      type: "RPC",
      pricing: "Paid",
      verified: true,
      tags: ["Bare-Metal", "Dedicated", "Enterprise"],
      description: "Bare-metal dedicated Sui nodes for enterprise customers",
      website: "https://www.redswitches.com",
      features: ["Bare-Metal", "Dedicated", "Enterprise Grade", "Full Control"],
      sla: "99.99%",
      acceptedTokens: ["SUI"],
      documentation: "https://docs.redswitches.com",
    },
    {
      id: "mystenlabs-public",
      name: "Mysten Labs Public",
      provider: "Mysten Labs",
      type: "RPC",
      pricing: "Free",
      verified: true,
      tags: ["Official", "Free", "Community"],
      description: "Official Mysten Labs public RPC endpoints for everyone",
      website: "https://mystenlabs.com",
      features: ["Official", "Free Access", "Reliable", "Community Supported"],
      sla: "99.9%",
      acceptedTokens: ["SUI"],
      documentation: "https://docs.mystenlabs.com",
    },
  ]

  const mockGatewayProviders: GatewayProvider[] = [
    {
      id: "shinami-gateway",
      name: "Shinami",
      provider: "Shinami",
      type: "Gateway",
      pricing: "Freemium",
      verified: true,
      tags: ["Full Node Service", "Gas Station", "Wallet Services", "Recommended"],
      description: "Full node service + Gas Station + Wallet Services; invisible wallets, sponsored transactions",
      website: "https://shinami.io",
      features: ["Invisible Wallets", "Sponsored Transactions", "Gas Station", "Full Node Access"],
      sla: "99.9%",
      acceptedTokens: ["SUI"],
      documentation: "https://docs.shinami.io",
    },
    {
      id: "blastapi",
      name: "Blast API",
      provider: "Bware Labs",
      type: "Gateway",
      pricing: "Freemium",
      verified: true,
      tags: ["High-Throughput", "APAC", "Public Gateway"],
      description: "Public Sui gateway with high-throughput capabilities and APAC optimization",
      website: "https://blastapi.io",
      features: ["High Throughput", "APAC Optimized", "Public Gateway", "Streams"],
      sla: "99.8%",
      acceptedTokens: ["SUI"],
      documentation: "https://docs.blastapi.io",
    },
    {
      id: "blockpi",
      name: "BlockPI",
      provider: "BlockPI",
      type: "Gateway",
      pricing: "Freemium",
      verified: true,
      tags: ["APAC Focused", "High Performance", "Enterprise"],
      description: "APAC-focused high-performance RPC gateway with enterprise features",
      website: "https://blockpi.io",
      features: ["APAC Coverage", "High Performance", "Enterprise Support", "Advanced Analytics"],
      sla: "99.9%",
      acceptedTokens: ["SUI"],
      documentation: "https://docs.blockpi.io",
    },
    {
      id: "infstones-gateway",
      name: "InfStones",
      provider: "InfStones",
      type: "Gateway",
      pricing: "Paid",
      verified: true,
      tags: ["Institutional", "Node Management", "Enterprise Grade"],
      description: "Institutional node management and gateway services for enterprises",
      website: "https://infstones.com",
      features: ["Node Management", "Enterprise Grade", "24/7 Support", "Custom Setup"],
      sla: "99.95%",
      acceptedTokens: ["SUI", "USDC"],
      documentation: "https://docs.infstones.com",
    },
    {
      id: "infura",
      name: "Infura",
      provider: "Consensys",
      type: "Gateway",
      pricing: "Paid",
      verified: true,
      tags: ["Enterprise", "Professional", "Production Ready"],
      description: "Enterprise-grade gateway infrastructure with professional support",
      website: "https://infura.io",
      features: ["Enterprise SLA", "Professional Support", "Advanced Monitoring", "Custom Setup"],
      sla: "99.99%",
      acceptedTokens: ["SUI", "USDC"],
      documentation: "https://docs.infura.io",
    },
    {
      id: "alchemy",
      name: "Alchemy",
      provider: "Alchemy",
      type: "Gateway",
      pricing: "Paid",
      verified: true,
      tags: ["Developer Tools", "Enhanced APIs", "Premium"],
      description: "Developer-focused gateway with enhanced APIs and tools",
      website: "https://alchemy.com",
      features: ["Enhanced APIs", "Developer Tools", "Advanced Monitoring", "Webhooks"],
      sla: "99.9%",
      acceptedTokens: ["SUI", "USDC"],
      documentation: "https://docs.alchemy.com",
    },
    {
      id: "pokt-gateway",
      name: "Pokt Network",
      provider: "Pokt Network",
      type: "Gateway",
      pricing: "Freemium",
      verified: true,
      tags: ["Decentralized", "Community", "Fair Pricing"],
      description: "Decentralized gateway powered by community nodes with fair pricing",
      website: "https://pokt.network",
      features: ["Decentralized", "Community Nodes", "Fair Pricing", "Open Source"],
      sla: "99.5%",
      acceptedTokens: ["SUI"],
      documentation: "https://docs.pokt.network",
    },
  ]

  const mockValidators: Validator[] = [
    {
      id: "mysten-1",
      name: "Mysten Labs",
      address: "0x8d97b2504e2c9d61eee80307f25c0e4748f59d5e",
      commission: "2%",
      uptime: "99.9%",
      staked: "1,200M SUI",
      apy: "1.9%",
      votingPower: "12.5%",
      status: "active",
      verified: true,
      tags: ["Official", "High Stake", "Top Validator"],
      description: "Mysten Labs official validator node",
      website: "https://mystenlabs.com",
    },
    {
      id: "imperator",
      name: "Imperator",
      address: "0xc10d6d1a1b1a2c5d1e2f3a4b5c6d7e8f9a0b1c2d",
      commission: "2.5%",
      uptime: "99.8%",
      staked: "850M SUI",
      apy: "1.85%",
      votingPower: "8.8%",
      status: "active",
      verified: true,
      tags: ["Independent", "High Performance", "Community Favorite"],
      description: "Top independent Sui validator with strong performance",
      website: "https://imperator.co",
    },
    {
      id: "staketab",
      name: "Staketab",
      address: "0xd20e1d3b2c3a4d5e6f7a8b9c0d1e2f3a4d5e6f7a8b9c0d1e2f3a4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
      commission: "2.2%",
      uptime: "99.7%",
      staked: "720M SUI",
      apy: "1.88%",
      votingPower: "7.5%",
      status: "active",
      verified: true,
      tags: ["Community Favorite", "Reliable", "Trusted"],
      description: "Reliable community-favorite validator with consistent performance",
      website: "https://staketab.com",
    },
    {
      id: "infstones",
      name: "InfStones",
      address: "0xe3a2f5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8",
      commission: "2%",
      uptime: "99.9%",
      staked: "680M SUI",
      apy: "1.9%",
      votingPower: "7.0%",
      status: "active",
      verified: true,
      tags: ["Institutional", "High Grade", "Enterprise"],
      description: "Institutional-grade infrastructure provider",
      website: "https://infstones.com",
    },
    {
      id: "midl-dev",
      name: "MIDL.dev",
      address: "0xf4a3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5",
      commission: "2.1%",
      uptime: "99.85%",
      staked: "590M SUI",
      apy: "1.87%",
      votingPower: "6.1%",
      status: "active",
      verified: true,
      tags: ["Security Focused", "Professional", "Verified"],
      description: "Security-focused validator with professional infrastructure",
      website: "https://midl.dev",
    },
    {
      id: "allnodes",
      name: "Allnodes",
      address: "0x6e5f4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e",
      commission: "2.3%",
      uptime: "99.6%",
      staked: "540M SUI",
      apy: "1.83%",
      votingPower: "5.6%",
      status: "active",
      verified: true,
      tags: ["Easy Staking", "User Friendly", "Multi-Chain"],
      description: "Easy-to-use staking platform for all validators",
      website: "https://allnodes.com",
    },
    {
      id: "contributionDAO",
      name: "ContributionDAO",
      address: "0x7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e",
      commission: "1.8%",
      uptime: "99.5%",
      staked: "480M SUI",
      apy: "1.92%",
      votingPower: "5.0%",
      status: "active",
      verified: true,
      tags: ["Community Driven", "Lower Commission", "DAO"],
      description: "Community-driven validator with lower commission rates",
      website: "https://contribution-dao.org",
    },
    {
      id: "cosmostation",
      name: "Cosmostation",
      address: "0x8e7d6e5f4a3b2c1d0c9b8a7f6e5d4c3b2a1f0e9d",
      commission: "2.4%",
      uptime: "99.7%",
      staked: "450M SUI",
      apy: "1.82%",
      votingPower: "4.7%",
      status: "active",
      verified: true,
      tags: ["Multi-Chain", "Professional", "Wallet Integration"],
      description: "Multi-chain validator with professional wallet integration",
      website: "https://cosmostation.io",
    },
    {
      id: "blockvision",
      name: "BlockVision",
      address: "0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e",
      commission: "2.2%",
      uptime: "99.8%",
      staked: "420M SUI",
      apy: "1.88%",
      votingPower: "4.3%",
      status: "active",
      verified: true,
      tags: ["Indexing Integration", "Explorer", "Verified"],
      description: "Validator with integrated indexing and explorer services",
      website: "https://blockvision.org",
    },
    {
      id: "aftermath",
      name: "Aftermath Finance",
      address: "0xa0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1",
      commission: "2.5%",
      uptime: "99.6%",
      staked: "380M SUI",
      apy: "1.85%",
      votingPower: "3.9%",
      status: "active",
      verified: true,
      tags: ["DeFi Aligned", "Liquid Staking", "Protocol"],
      description: "DeFi-aligned validator with liquid staking protocol",
      website: "https://aftermath.finance",
    },
    {
      id: "studio-mirai",
      name: "Studio Mirai",
      address: "0xb1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2",
      commission: "2.0%",
      uptime: "99.4%",
      staked: "350M SUI",
      apy: "1.9%",
      votingPower: "3.6%",
      status: "active",
      verified: true,
      tags: ["Community", "Emerging", "Growth"],
      description: "Community validator focused on ecosystem growth",
      website: "https://studiomirai.com",
    },
    {
      id: "shinami",
      name: "Shinami",
      address: "0xc2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3",
      commission: "2.1%",
      uptime: "99.75%",
      staked: "320M SUI",
      apy: "1.88%",
      votingPower: "3.3%",
      status: "active",
      verified: true,
      tags: ["RPC Provider", "High Performance", "Node Services"],
      description: "High-performance validator with RPC and node services",
      website: "https://shinami.io",
    },
    {
      id: "moonstake",
      name: "Moonstake",
      address: "0xd3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4",
      commission: "2.3%",
      uptime: "99.5%",
      staked: "280M SUI",
      apy: "1.84%",
      votingPower: "2.9%",
      status: "active",
      verified: true,
      tags: ["Mobile Staking", "User Friendly", "Platform"],
      description: "Mobile-first staking platform validator",
      website: "https://moonstake.io",
    },
    {
      id: "stakewith-us",
      name: "StakeWith.us",
      address: "0xe4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5",
      commission: "2.2%",
      uptime: "99.6%",
      staked: "250M SUI",
      apy: "1.87%",
      votingPower: "2.6%",
      status: "active",
      verified: true,
      tags: ["Professional", "Support", "Team"],
      description: "Professional validator with dedicated support team",
      website: "https://stakewith.us",
    },
  ]

  const mockIndexingProviders: IndexingProvider[] = [
    {
      id: "blockberry",
      name: "Blockberry",
      provider: "Blockberry",
      type: "Indexing",
      pricing: "Freemium",
      verified: true,
      tags: ["Verified", "NFT Indexing", "Security API", "Metadata"],
      description: "Powers Suiscan - comprehensive metadata API, security analysis, NFT/coin indexing",
      website: "https://blockberry.one",
      features: ["NFT Metadata", "Security Scans", "Coin Data", "Historical Analysis"],
      sla: "99.9%",
      acceptedTokens: ["SUI", "USDC"],
      documentation: "https://docs.blockberry.one",
      explorer: "https://suiscan.xyz",
    },
    {
      id: "blockvision",
      name: "BlockVision",
      provider: "BlockVision",
      type: "Indexing",
      pricing: "Freemium",
      verified: true,
      tags: ["Verified", "RPC+Indexing", "Explorer", "DeFi"],
      description: "Powers SuiVision - NFT, coin, holders, DeFi positions, account activity indexing",
      website: "https://blockvision.org",
      features: ["NFT Indexing", "DeFi Positions", "Holder Analysis", "Activity Tracking"],
      sla: "99.85%",
      acceptedTokens: ["SUI", "USDC"],
      documentation: "https://docs.blockvision.org",
      explorer: "https://suivision.xyz",
    },
    {
      id: "shinami",
      name: "Shinami",
      provider: "Shinami",
      type: "Indexing",
      pricing: "Freemium",
      verified: true,
      tags: ["High Performance", "Node Services", "Gas Station"],
      description: "High-performance indexing, node services, and Gas Station for sponsored transactions",
      website: "https://shinami.io",
      features: ["Real-Time Indexing", "Transaction History", "Gas Station", "Custom Queries"],
      sla: "99.9%",
      acceptedTokens: ["SUI"],
      documentation: "https://docs.shinami.io",
    },
    {
      id: "chainbase",
      name: "Chainbase",
      provider: "Chainbase",
      type: "Indexing",
      pricing: "Freemium",
      verified: true,
      tags: ["All-in-One", "Multi-Chain", "Web3 Infrastructure"],
      description: "All-in-one Web3 data infrastructure with on-chain indexing and analytics",
      website: "https://chainbase.com",
      features: ["Universal Indexing", "Multi-Chain Data", "Analytics", "Custom Dashboards"],
      sla: "99.5%",
      acceptedTokens: ["SUI", "USDC"],
      documentation: "https://docs.chainbase.com",
    },
    {
      id: "sentio",
      name: "Sentio",
      provider: "Sentio",
      type: "Indexing",
      pricing: "Freemium",
      verified: true,
      tags: ["Custom Indexing", "Analytics", "Processors"],
      description: "Custom indexing processors and real-time analytics for blockchain data",
      website: "https://sentio.xyz",
      features: ["Custom Processors", "Real-Time Analytics", "Event Tracking", "Data Export"],
      sla: "99.7%",
      acceptedTokens: ["SUI"],
      documentation: "https://docs.sentio.xyz",
    },
    {
      id: "indexer-xyz",
      name: "Indexer.xyz",
      provider: "Indexer.xyz",
      type: "Indexing",
      pricing: "Free",
      verified: true,
      tags: ["NFT Focused", "Open Source", "Developer Friendly"],
      description: "NFT-focused indexing toolkit with open-source developer tools",
      website: "https://indexer.xyz",
      features: ["NFT Indexing", "Collection Analytics", "Rarity Tools", "API Access"],
      sla: "Best Effort",
      acceptedTokens: ["SUI"],
      documentation: "https://docs.indexer.xyz",
    },
    {
      id: "zettablock",
      name: "ZettaBlock",
      provider: "ZettaBlock",
      type: "Indexing",
      pricing: "Freemium",
      verified: true,
      tags: ["GraphQL", "Custom APIs", "SQL"],
      description: "Custom GraphQL/REST APIs from SQL for flexible data querying",
      website: "https://zettablock.com",
      features: ["GraphQL API", "Custom SQL", "Real-Time Updates", "Data Export"],
      sla: "99.6%",
      acceptedTokens: ["SUI", "USDC"],
      documentation: "https://docs.zettablock.com",
    },
    {
      id: "mysten-labs-indexer",
      name: "Mysten Labs Indexer",
      provider: "Mysten Labs",
      type: "Indexing",
      pricing: "Free",
      verified: true,
      tags: ["Official", "GraphQL Beta", "General Purpose"],
      description: "Official Mysten Labs GraphQL indexer for general-purpose blockchain data",
      website: "https://mystenlabs.com",
      features: ["GraphQL API", "Transaction History", "Object State", "Event Indexing"],
      sla: "99.9%",
      acceptedTokens: ["SUI"],
      documentation: "https://docs.mystenlabs.com/indexer",
    },
  ]

  useEffect(() => {
    const stored = localStorage.getItem("infraServices")
    if (stored) {
      setServices(JSON.parse(stored))
    } else {
      const defaultServices: InfraService[] = [
        {
          id: "1",
          name: "QuickNode",
          provider: "QuickNode Inc.",
          type: "RPC",
          pricing: "Freemium",
          tags: ["Fast", "Reliable"],
          sla: "99.9%",
          acceptedTokens: ["SUI", "USDC"],
          verified: true,
          url: "https://quicknode.com",
          contact: "support@quicknode.com",
          pricingTiers: [
            { name: "Starter", price: 0, token: "SUI", requests: 10000 },
            { name: "Growth", price: 100, token: "SUI", requests: 100000 },
            { name: "Pro", price: 500, token: "SUI", requests: 1000000 },
          ],
        },
        {
          id: "2",
          name: "Moralis",
          provider: "Moralis",
          type: "Indexing",
          pricing: "Paid",
          tags: ["Comprehensive", "Web3"],
          sla: "99.95%",
          acceptedTokens: ["SUI", "USDC", "USDT"],
          verified: true,
          url: "https://moralis.io",
          contact: "support@moralis.io",
          pricingTiers: [
            { name: "Essential", price: 50, token: "SUI" },
            { name: "Business", price: 200, token: "SUI" },
          ],
        },
        {
          id: "3",
          name: "Mainnet RPC",
          provider: "Sui Foundation",
          type: "RPC",
          pricing: "Free",
          tags: ["Official", "Community"],
          sla: "Best Effort",
          acceptedTokens: ["SUI"],
          verified: true,
          url: "https://sui-mainnet.nuls.network",
          pricingTiers: [{ name: "Free Tier", price: 0, token: "SUI" }],
        },
        {
          id: "4",
          name: "Sui Foundation RPC",
          provider: "Sui Foundation",
          type: "RPC",
          pricing: "Free",
          tags: ["Official", "Verified"],
          sla: "99.9%",
          acceptedTokens: ["SUI"],
          verified: true,
          url: "https://fullnode.mainnet.sui.io",
        },
        {
          id: "5",
          name: "Ankr Indexing",
          provider: "Ankr",
          type: "Indexing",
          pricing: "Freemium",
          tags: ["Analytics", "Verified"],
          sla: "99.5%",
          acceptedTokens: ["SUI"],
          verified: true,
          url: "https://ankr.com/sui",
        },
        {
          id: "6",
          name: "The Graph Sui Subgraph",
          provider: "The Graph",
          type: "Indexing",
          pricing: "Free",
          tags: ["Query", "Decentralized"],
          acceptedTokens: ["SUI"],
          verified: true,
          url: "https://thegraph.com",
        },
        {
          id: "7",
          name: "Infura Sui Gateway",
          provider: "Infura",
          type: "Gateway",
          pricing: "Paid",
          tags: ["Enterprise", "Reliable"],
          sla: "99.99%",
          acceptedTokens: ["SUI", "USDC"],
          url: "https://infura.io",
        },
        {
          id: "8",
          name: "Blast API RPC",
          provider: "Blast",
          type: "RPC",
          pricing: "Freemium",
          tags: ["High Performance", "Global"],
          sla: "99.6%",
          acceptedTokens: ["SUI"],
          url: "https://blastapi.io",
        },
        {
          id: "9",
          name: "Alchemy Sui Gateway",
          provider: "Alchemy",
          type: "Gateway",
          pricing: "Paid",
          tags: ["Developer Tools", "Enhanced APIs"],
          sla: "99.9%",
          acceptedTokens: ["SUI", "USDC"],
          url: "https://alchemy.com",
        },
        {
          id: "10",
          name: "Pokt Network RPC",
          provider: "Pokt",
          type: "RPC",
          pricing: "Freemium",
          tags: ["Decentralized", "Community"],
          acceptedTokens: ["SUI"],
          url: "https://pokt.network",
        },
      ]
      setServices(defaultServices)
      localStorage.setItem("infraServices", JSON.stringify(defaultServices))
    }

    const mockQuotas: ClientQuota[] = [
      {
        clientId: "client-001",
        clientName: "My App (Connected)",
        plan: "Pro",
        requestsUsed: 7500,
        requestsLimit: 10000,
        usagePercent: 75,
        lastReset: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        nextReset: new Date(Date.now() + 23 * 60 * 60 * 1000).toLocaleDateString(),
        services: ["QuickNode RPC", "Suiscan Indexing"],
        status: "active",
      },
      {
        clientId: "client-002",
        clientName: "Web3 Dashboard",
        plan: "Enterprise",
        requestsUsed: 45000,
        requestsLimit: 100000,
        usagePercent: 45,
        lastReset: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        nextReset: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        services: ["Infura RPC", "Covalent Analytics", "Suiscan Indexing"],
        status: "active",
      },
      {
        clientId: "client-003",
        clientName: "Monitor Bot",
        plan: "Free",
        requestsUsed: 950,
        requestsLimit: 1000,
        usagePercent: 95,
        lastReset: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        nextReset: new Date(Date.now() + 1 * 60 * 60 * 1000).toLocaleDateString(),
        services: ["Public RPC"],
        status: "warning",
      },
    ]
    setClientQuotas(mockQuotas)
  }, [])

  const handleAddService = () => {
    const newService: InfraService = {
      id: Date.now().toString(),
      name: formData.name,
      provider: formData.provider,
      type: formData.type,
      pricing: formData.pricing,
      tags: formData.tags.split(",").map((t) => t.trim()),
      sla: formData.sla || undefined,
      acceptedTokens: formData.acceptedTokens.split(",").map((t) => t.trim()),
      url: formData.url || undefined,
      contact: formData.contact || undefined,
      pricingTiers: [], // add pricing tiers to new services
    }
    const updatedServices = [...services, newService]
    setServices(updatedServices)
    localStorage.setItem("infraServices", JSON.stringify(updatedServices))
    setFormData({
      name: "",
      provider: "",
      type: "RPC",
      pricing: "Freemium",
      tags: "",
      sla: "",
      acceptedTokens: "",
      url: "",
      contact: "",
    })
    setShowAddServiceModal(false)
  }

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = !selectedCategory || service.type === selectedCategory
    const matchesPricing = !selectedPricing || service.pricing === selectedPricing
    return matchesSearch && matchesCategory && matchesPricing
  })

  const handleExportJSON = (service: InfraService | Validator | IndexingProvider | RPCProvider | GatewayProvider) => {
    const jsonString = JSON.stringify(service, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${service.name.replace(/\s+/g, "-")}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleToggleVerified = (serviceId: string) => {
    const updatedServices = services.map((s) => (s.id === serviceId ? { ...s, verified: !s.verified } : s))
    setServices(updatedServices)
    localStorage.setItem("infraServices", JSON.stringify(updatedServices))
  }

  const handlePurchase = async (service: InfraService, tier: PricingTier) => {
    if (!isSuiChain) {
      toast({
        title: "Sui Only",
        description: "Payments are available on Sui networks only",
        variant: "destructive",
      })
      return
    }

    if (!currentAccount) {
      toast({
        title: "Wallet Required",
        description: "Please connect your Sui wallet to purchase services",
      })
      return
    }

    setSelectedService(service)
    setSelectedTier(tier)
    setShowPaymentModal(true)
  }

  const handleConfirmPayment = () => {
    if (!selectedService || !selectedTier) return

    // Simulate transaction preparation
    const mockTransaction = {
      timestamp: new Date().toISOString(),
      service: selectedService.name,
      tier: selectedTier.name,
      amount: selectedTier.price,
      token: selectedPaymentToken,
      recipient: "0x" + "sui_foundation".padStart(64, "0"),
      sender: currentAccount,
    }

    console.log("[v0] Mock transaction prepared:", mockTransaction)

    // Emit mock entitlement event
    const entitlementEvent = {
      type: "EntitlementGranted",
      service: selectedService.id,
      serviceType: selectedService.type,
      tier: selectedTier.name,
      duration: "30 days",
      tokens: selectedPaymentToken,
      timestamp: new Date().toISOString(),
      account: currentAccount,
    }

    console.log("[v0] Entitlement event emitted:", entitlementEvent)

    toast({
      title: "Payment Confirmed",
      description: `Purchased ${selectedTier.name} tier for ${selectedService.name}. Entitlement granted for 30 days.`,
    })

    setShowPaymentModal(false)
    setSelectedService(null)
    setSelectedTier(null)
  }

  if (!isSuiChain) {
    return (
      <main className="container mx-auto px-4 py-8 md:px-6">
        <Card className="glass-card mx-auto max-w-2xl border-yellow-500/20 bg-yellow-500/5 py-12">
          <CardHeader className="text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
            <CardTitle>Full Functionality on Sui</CardTitle>
            <CardDescription>Switch to a Sui network to access the Infrastructure Discovery Portal</CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  const totalValidators = mockValidators.length
  const totalStaked = mockValidators.reduce((sum, v) => {
    const amountMatch = v.staked.match(/([\d,.]+)\s*M/)
    const amount = amountMatch ? Number.parseFloat(amountMatch[1].replace(/,/g, "")) : 0
    return sum + amount
  }, 0)
  const totalValidatorsStaked = totalValidators

  // Combined filtering logic for RPC, Gateway, and Indexing providers
  const filterProviders = <T extends { name: string; provider: string; tags: string[]; pricing: string }>(
    providers: T[],
    query: string,
    pricing: string | null,
  ): T[] => {
    return providers.filter((provider) => {
      const matchesSearch =
        provider.name.toLowerCase().includes(query.toLowerCase()) ||
        provider.provider.toLowerCase().includes(query.toLowerCase()) ||
        provider.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
      const matchesPricing = !pricing || provider.pricing === pricing
      return matchesSearch && matchesPricing
    })
  }

  const filteredRPCProviders = filterProviders(mockRPCProviders, searchQuery, selectedPricing)
  const filteredGatewayProviders = filterProviders(mockGatewayProviders, searchQuery, selectedPricing)
  const filteredIndexingProviders = mockIndexingProviders.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesPricing = !selectedPricing || provider.pricing === selectedPricing
    return matchesSearch && matchesPricing
  })

  const allServices = [
    ...mockValidators.map((v) => ({
      ...v,
      category: "Validator" as const,
      type: "Validator", // Add type for consistency
      pricing: "N/A" as const,
      verified: v.verified,
      website: v.website || "https://sui.io",
      features: [`${v.apy}% APY`, `${v.commission}% Commission`, `${v.votingPower}% Voting Power`],
      description: v.description || "A leading validator on the Sui network.",
    })),
    ...mockIndexingProviders.map((p) => ({
      ...p,
      category: "Indexing" as const,
      website: p.website,
      description: p.description || "Provides high-performance indexing services.",
    })),
    ...mockRPCProviders.map((p) => ({
      ...p,
      category: "RPC Node" as const,
      website: p.website,
      description: p.description || "Offers reliable RPC access to the Sui network.",
    })),
    ...mockGatewayProviders.map((p) => ({
      ...p,
      category: "Gateway" as const,
      website: p.website,
      description: p.description || "Advanced gateway infrastructure for Sui.",
    })),
  ]

  const filteredAllServices = allServices.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = !selectedCategory || provider.category === selectedCategory
    const matchesPricing = !selectedPricing || provider.pricing === selectedPricing
    const matchesVerified = selectedVerified === null || provider.verified === selectedVerified
    const matchesFeatures =
      selectedFeatures.length === 0 ||
      selectedFeatures.some(
        (f) =>
          provider.tags?.some((tag) => tag.toLowerCase().includes(f.toLowerCase())) ||
          provider.features?.some((feat) => feat.toLowerCase().includes(f.toLowerCase())),
      )

    return matchesSearch && matchesCategory && matchesPricing && matchesVerified && matchesFeatures
  })

  const topPicks = allServices
    .filter((p) => ["Dwellir", "Imperator", "Blockberry", "Chainstack", "Staketab", "InfStones"].includes(p.name))
    .slice(0, 6)

  return (
    <main className="container mx-auto px-4 py-8 md:px-6">
      <Tabs defaultValue="all-services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 md:w-auto">
          <TabsTrigger value="all-services" className="gap-1">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">All Services</span>
          </TabsTrigger>
          <TabsTrigger value="rpc" className="gap-1">
            <Radio className="h-4 w-4" />
            <span className="hidden sm:inline">RPC Nodes</span>
          </TabsTrigger>
          <TabsTrigger value="gateways" className="gap-1">
            <Cpu className="h-4 w-4" />
            <span className="hidden sm:inline">Gateways</span>
          </TabsTrigger>
          <TabsTrigger value="indexing" className="gap-1">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Indexing</span>
          </TabsTrigger>
          <TabsTrigger value="validators" className="gap-1">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Validators</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-1">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">Services</span>
          </TabsTrigger>
          <TabsTrigger value="usage" className="gap-1">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Usage</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-services" className="space-y-6">
          {/* Hero Header */}
          <Card className="glass-card border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">Discover 50+ Trusted Sui Infrastructure Services</CardTitle>
              <CardDescription className="text-base">
                A curated, all-in-one directory of validators, indexers, RPC nodes, and gateway providers powering the
                Sui ecosystem
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Advanced Search & Filters */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Search & Filter</CardTitle>
              <Button onClick={handleExportRegistry} variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export Registry</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select
                    value={selectedCategory || ""}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">All Categories</option>
                    <option value="Validator">Validator</option>
                    <option value="RPC Node">RPC Node</option>
                    <option value="Indexing">Indexing</option>
                    <option value="Gateway">Gateway</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Pricing</label>
                  <select
                    value={selectedPricing || ""}
                    onChange={(e) => setSelectedPricing(e.target.value || null)}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">All Pricing</option>
                    <option value="Free">Free</option>
                    <option value="Freemium">Freemium</option>
                    <option value="Paid">Paid</option>
                    <option value="N/A">N/A</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Verified</label>
                  <select
                    value={selectedVerified === null ? "" : selectedVerified ? "yes" : "no"}
                    onChange={(e) => {
                      if (e.target.value === "") setSelectedVerified(null)
                      else setSelectedVerified(e.target.value === "yes")
                    }}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">All Providers</option>
                    <option value="yes">Verified Only</option>
                    <option value="no">Unverified</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Features</label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const options = ["gRPC", "High Performance", "Archive Data", "99.9%+ Uptime"]
                      const currentSelection = selectedFeatures[0] || options[0]
                      const currentIndex = options.indexOf(currentSelection)
                      const nextIndex = (currentIndex + 1) % options.length
                      setSelectedFeatures(options[nextIndex] ? [options[nextIndex]] : [])
                    }}
                    className="w-full text-xs"
                  >
                    {selectedFeatures.length > 0 ? `${selectedFeatures[0]}...` : "Filter Features"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Picks Section */}
          {topPicks.length > 0 && (
            <Card className="glass-card border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Top Picks & Recommended
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                  {topPicks.map((provider) => (
                    <Card
                      key={provider.id}
                      className="glass-card hover:shadow-lg transition-all cursor-pointer group border-primary/20"
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                                  {provider.category}
                                </Badge>
                                {provider.verified && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                              </div>
                              <h3 className="font-semibold mt-2 group-hover:text-primary transition-colors">
                                {provider.name}
                              </h3>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {provider.description || "Premium infrastructure provider"}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => window.open(provider.website, "_blank")}
                          >
                            Visit Website
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Services Grid */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  All Services ({filteredAllServices.length})
                </div>
                <Button variant="outline" onClick={handleExportRegistry} className="gap-1 bg-transparent">
                  <Download className="h-4 w-4" />
                  Export Registry
                </Button>
              </CardTitle>
              <CardDescription>Browse all validators, indexers, RPC nodes, and gateways</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {filteredAllServices.length === 0 ? (
                  <Card className="py-8 text-center col-span-full">
                    <AlertCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No services match your filters</p>
                  </Card>
                ) : (
                  filteredAllServices.map((provider, index) => (
                    <Card
                      key={`${provider.category}-${provider.id}-${index}`}
                      className="glass-card hover:shadow-lg transition-all cursor-pointer group border-border/50"
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <BrandLogo name={provider.name} logoUrl={getBrandLogo(provider.name)} size="md" />
                            <div className="flex-1">
                              {/* Category Badge */}
                              <div className="flex items-start justify-between mb-2">
                                <Badge className="text-xs bg-primary/20 text-primary">{provider.category}</Badge>
                                {provider.verified && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                              </div>

                              {/* Name & Provider */}
                              <div>
                                <h3 className="font-semibold group-hover:text-primary transition-colors">
                                  {provider.name}
                                </h3>
                                {("provider" in provider) && (
                                  <p className="text-xs text-muted-foreground">by {provider.provider}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {provider.description || "Infrastructure provider"}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {provider.tags?.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* Key Features */}
                          {provider.features && provider.features.length > 0 && (
                            <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                              {provider.features.slice(0, 2).map((feature) => (
                                <div key={feature} className="bg-muted/30 rounded px-2 py-1">
                                  {feature}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Pricing Badge */}
                          {provider.pricing && provider.pricing !== "N/A" && (
                            <Badge
                              className={`text-xs w-full justify-center ${provider.pricing === "Free"
                                  ? "bg-green-500/10 text-green-500"
                                  : provider.pricing === "Freemium"
                                    ? "bg-blue-500/10 text-blue-500"
                                    : "bg-orange-500/10 text-orange-500"
                                }`}
                            >
                              {provider.pricing}
                            </Badge>
                          )}

                          {/* CTA Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => window.open(provider.website, "_blank")}
                          >
                            Learn More
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Partnership CTA */}
          <Card className="glass-card border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Become a Featured Partner</h3>
                  <p className="text-sm text-muted-foreground">Connect your infrastructure service to Atlas Protocol</p>
                </div>
                <Button onClick={() => window.open("mailto:partners@atlas.sui", "_blank")}>
                  Get in Touch
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab - Marketplace (Default) */}
        <TabsContent value="services" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Infra Services Marketplace
                  </CardTitle>
                  <CardDescription>Browse and purchase access to infrastructure services</CardDescription>
                </div>
                {isProviderLoggedIn && (
                  <Button
                    onClick={() => setShowAddServiceModal(true)}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add Service
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Provider Login */}
              <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                <Button
                  size="sm"
                  variant={isProviderLoggedIn ? "default" : "outline"}
                  onClick={() => setIsProviderLoggedIn(!isProviderLoggedIn)}
                  className="gap-2"
                >
                  <Lock className="h-4 w-4" />
                  {isProviderLoggedIn ? "Provider (Logged In)" : "Provider Login"}
                </Button>
              </div>

              {/* Search and Filters */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search services, providers, tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Category:</label>
                    <div className="flex gap-2 mt-1">
                      <Button
                        size="sm"
                        variant={!selectedCategory ? "default" : "outline"}
                        onClick={() => setSelectedCategory(null)}
                      >
                        All
                      </Button>
                      {["RPC", "Indexing", "Node", "Gateway"].map((cat) => (
                        <Button
                          key={cat}
                          size="sm"
                          variant={selectedCategory === cat ? "default" : "outline"}
                          onClick={() => setSelectedCategory(cat)}
                        >
                          {cat}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Pricing:</label>
                    <div className="flex gap-2 mt-1">
                      <Button
                        size="sm"
                        variant={!selectedPricing ? "default" : "outline"}
                        onClick={() => setSelectedPricing(null)}
                      >
                        All
                      </Button>
                      {["Free", "Freemium", "Paid"].map((price) => (
                        <Button
                          key={price}
                          size="sm"
                          variant={selectedPricing === price ? "default" : "outline"}
                          onClick={() => setSelectedPricing(price)}
                        >
                          {price}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Services Grid */}
              <div className="grid gap-3 pt-4">
                {filteredServices.length === 0 ? (
                  <Card className="py-8 text-center">
                    <AlertCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No services found matching your filters</p>
                  </Card>
                ) : (
                  filteredServices.map((service) => (
                    <Card key={service.id} className="glass-card hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  {service.verified && <CheckCircle2 className="mt-1 h-4 w-4 text-green-500" />}
                                  <h3 className="font-semibold">{service.name}</h3>
                                </div>
                              </div>
                              <div>
                                {service.pricing === "Paid" && (
                                  <span className="px-2 py-0.5 rounded-full bg-[#2B7FFF]/20 text-[#2B7FFF] text-xs font-medium">Premium</span>
                                )}
                                {service.pricing === "Freemium" && (
                                  <span className="px-2 py-0.5 rounded-full bg-[#00d4aa]/20 text-[#00d4aa] text-xs font-medium">Verified</span>
                                )}
                                {service.pricing === "Free" && (
                                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-muted-foreground text-xs font-medium">Explorer</span>
                                )}
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Badge variant="secondary">{service.type}</Badge>
                              <Badge
                                className={`text-xs ${service.pricing === "Free"
                                    ? "bg-green-500/10 text-green-500"
                                    : service.pricing === "Freemium"
                                      ? "bg-blue-500/10 text-blue-500"
                                      : "bg-orange-500/10 text-orange-500"
                                  }`}
                              >
                                {service.pricing}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">by {service.provider}</p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {service.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            {service.sla && (
                              <div>
                                {service.pricing !== "Free" ? (
                                  <div className="relative mt-2">
                                    <div className="blur-sm pointer-events-none">
                                      <p className="text-xs text-muted-foreground">SLA: {service.sla}</p>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="glass-panel rounded-xl p-4 text-center">
                                        <p className="text-xs text-muted-foreground">Upgrade to access</p>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="mt-1 text-xs text-muted-foreground">SLA: {service.sla}</p>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 md:w-48">
                            {service.pricingTiers && service.pricingTiers.length > 0 && (
                              <div>
                                {service.pricing !== "Free" ? (
                                  <div className="relative">
                                    <div className="blur-sm pointer-events-none space-y-2">
                                      {service.pricingTiers.map((tier, idx) => (
                                        <div key={idx} className="rounded border border-blue-500/20 bg-blue-500/5 p-2">
                                          <p className="text-sm font-medium">{tier.name}</p>
                                          <p className="text-xs text-muted-foreground">
                                            {tier.price === 0 ? "Free" : `${tier.price} ${tier.token}`}
                                          </p>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="mt-1 w-full gap-1 text-xs bg-transparent"
                                            onClick={() => handlePurchase(service, tier)}
                                            disabled={!currentAccount}
                                          >
                                            <CreditCard className="h-3 w-3" />
                                            {tier.price === 0 ? "Get Started" : "Purchase"}
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="glass-panel rounded-xl p-4 text-center">
                                        <p className="text-xs text-muted-foreground">Upgrade to access</p>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {service.pricingTiers.map((tier, idx) => (
                                      <div key={idx} className="rounded border border-blue-500/20 bg-blue-500/5 p-2">
                                        <p className="text-sm font-medium">{tier.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {tier.price === 0 ? "Free" : `${tier.price} ${tier.token}`}
                                        </p>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="mt-1 w-full gap-1 text-xs bg-transparent"
                                          onClick={() => handlePurchase(service, tier)}
                                          disabled={!currentAccount}
                                        >
                                          <CreditCard className="h-3 w-3" />
                                          {tier.price === 0 ? "Get Started" : "Purchase"}
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedService(service)
                              setShowDetailModal(true)
                            }}
                          >
                            Details
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleExportJSON(service)} className="gap-1">
                            <Download className="h-3 w-3" />
                          </Button>
                          {isProviderLoggedIn && (
                            <Button size="sm" variant="ghost" onClick={() => handleToggleVerified(service.id)}>
                              {service.verified ? "Unverify" : "Verify"}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Validators Tab */}
        <TabsContent value="validators" className="space-y-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Active Validators
                </div>
                <Badge variant="outline" className="text-xs font-normal">
                  {totalValidatorsStaked} Active • {totalStaked}M+ SUI Staked
                </Badge>
              </CardTitle>
              <CardDescription>Discover and stake with trusted Sui validators - verified by community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filter */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search validators by name..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Filter by Status:</label>
                  <div className="flex gap-2 mt-1">
                    <Button size="sm" variant="default">
                      All Active
                    </Button>
                    <Button size="sm" variant="outline">
                      Top 5
                    </Button>
                    <Button size="sm" variant="outline">
                      Low Commission
                    </Button>
                  </div>
                </div>
              </div>

              {/* Validators Grid */}
              <div className="space-y-3 pt-2">
                {mockValidators.map((validator) => (
                  <div
                    key={`validators-${validator.id}`}
                    onClick={() => setSelectedValidator(validator)}
                    className="group cursor-pointer rounded-lg border border-border/50 bg-background/50 p-4 transition-all hover:border-primary/50 hover:bg-muted/50 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <BrandLogo name={validator.name} logoUrl={getBrandLogo(validator.name)} size="md" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold group-hover:text-primary transition-colors">
                                {validator.name}
                              </h3>
                              {validator.verified && (
                                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <code className="text-xs text-muted-foreground">{validator.address}</code>
                            <div className="mt-2 flex flex-wrap gap-4 text-sm">
                              <span className="text-muted-foreground">
                                Commission: <span className="font-medium text-foreground">{validator.commission}</span>
                              </span>
                              <span className="text-muted-foreground">
                                APY: <span className="font-medium text-foreground text-green-500">{validator.apy}</span>
                              </span>
                              <span className="text-muted-foreground">
                                Uptime: <span className="font-medium text-foreground">{validator.uptime}</span>
                              </span>
                              <span className="text-muted-foreground">
                                Voting Power:{" "}
                                <span className="font-medium text-foreground">{validator.votingPower}</span>
                              </span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {validator.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">{validator.staked}</div>
                          <div className="text-xs text-muted-foreground">Total Staked</div>
                        </div>
                        <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700">
                          Stake Now
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RPC Tab */}
        <TabsContent value="rpc" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5" />
                RPC Nodes & Providers
              </CardTitle>
              <CardDescription>
                Top 20+ Sui RPC & Node Providers – Powering dApps with low-latency access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search and Filters */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search RPC providers..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Filter by Features:</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      gRPC Ready
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      High Performance
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      Archive Data
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      99.9%+ Uptime
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Pricing:</label>
                  <div className="flex gap-2 mt-1">
                    <Button size="sm" variant="default">
                      All
                    </Button>
                    <Button size="sm" variant="outline">
                      Free
                    </Button>
                    <Button size="sm" variant="outline">
                      Freemium
                    </Button>
                    <Button size="sm" variant="outline">
                      Paid
                    </Button>
                  </div>
                </div>
              </div>

              {/* RPC Providers Grid */}
              <div className="grid gap-3 pt-4 md:grid-cols-2">
                {filteredRPCProviders.map((provider) => (
                  <Card
                    key={`rpc-${provider.id}`}
                    onClick={() => setSelectedRPC(provider)}
                    className="glass-card hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <BrandLogo name={provider.name} logoUrl={getBrandLogo(provider.name)} size="md" />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  {provider.verified && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                                    {provider.name}
                                  </h3>
                                </div>
                                <p className="text-xs text-muted-foreground">by {provider.provider}</p>
                              </div>
                              <Badge
                                className={`text-xs whitespace-nowrap ${provider.pricing === "Free"
                                    ? "bg-green-500/10 text-green-500"
                                    : provider.pricing === "Freemium"
                                      ? "bg-blue-500/10 text-blue-500"
                                      : "bg-orange-500/10 text-orange-500"
                                  }`}
                              >
                                {provider.pricing}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground">{provider.description}</p>

                        <div className="flex flex-wrap gap-1">
                          {provider.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => window.open(provider.website, "_blank")}
                          >
                            Visit Website
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </div>

                        <div className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1 text-center">
                          SLA: {provider.sla}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gateways & Node Services Tab */}
        <TabsContent value="gateways" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Gateways & Node Services
              </CardTitle>
              <CardDescription>Advanced gateway infrastructure and managed node services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search gateway providers..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Gateways Grid */}
              <div className="grid gap-3 pt-4 md:grid-cols-2">
                {mockGatewayProviders.map((provider) => (
                  <Card key={`gateways-${provider.id}`} className="glass-card hover:shadow-lg transition-all cursor-pointer group">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <BrandLogo name={provider.name} logoUrl={getBrandLogo(provider.name)} size="md" />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  {provider.verified && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                                    {provider.name}
                                  </h3>
                                </div>
                                <p className="text-xs text-muted-foreground">by {provider.provider}</p>
                              </div>
                              <Badge
                                className={`text-xs whitespace-nowrap ${provider.pricing === "Free"
                                    ? "bg-green-500/10 text-green-500"
                                    : provider.pricing === "Freemium"
                                      ? "bg-blue-500/10 text-blue-500"
                                      : "bg-orange-500/10 text-orange-500"
                                  }`}
                              >
                                {provider.pricing}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground">{provider.description}</p>

                        <div className="flex flex-wrap gap-1">
                          {provider.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => window.open(provider.website, "_blank")}
                          >
                            Visit Website
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </div>

                        <div className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1 text-center">
                          SLA: {provider.sla}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Indexing Tab */}
        <TabsContent value="indexing" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Indexing Services
              </CardTitle>
              <CardDescription>Production-grade indexing and data services for Sui blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search and Filters */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search indexing providers..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Pricing:</label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      size="sm"
                      variant={!selectedPricing ? "default" : "outline"}
                      onClick={() => setSelectedPricing(null)}
                    >
                      All
                    </Button>
                    {["Free", "Freemium", "Paid"].map((price) => (
                      <Button
                        key={price}
                        size="sm"
                        variant={selectedPricing === price ? "default" : "outline"}
                        onClick={() => setSelectedPricing(price)}
                      >
                        {price}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Indexing Providers Grid */}
              <div className="grid gap-3 pt-4 md:grid-cols-2">
                {filteredIndexingProviders.map((provider) => (
                  <Card
                    key={`indexing-${provider.id}`}
                    onClick={() => setSelectedIndexing(provider)}
                    className="glass-card hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <BrandLogo name={provider.name} logoUrl={getBrandLogo(provider.name)} size="md" />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  {provider.verified && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                                    {provider.name}
                                  </h3>
                                </div>
                                <p className="text-xs text-muted-foreground">by {provider.provider}</p>
                              </div>
                              <Badge
                                className={`text-xs ${provider.pricing === "Free"
                                    ? "bg-green-500/10 text-green-500"
                                    : provider.pricing === "Freemium"
                                      ? "bg-blue-500/10 text-blue-500"
                                      : "bg-orange-500/10 text-orange-500"
                                  }`}
                              >
                                {provider.pricing}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground">{provider.description}</p>

                        <div className="flex flex-wrap gap-1">
                          {provider.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                          {provider.features.slice(0, 2).map((feature) => (
                            <div key={feature} className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1">
                              {feature}
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(provider.website, "_blank")
                            }}
                          >
                            Visit
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                          {provider.documentation && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(provider.documentation, "_blank")
                              }}
                            >
                              Docs
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab - Existing content (for provider dashboard) */}
        <TabsContent value="services" className="space-y-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Infrastructure Services</CardTitle>
                <CardDescription>Explore and manage Sui infrastructure providers</CardDescription>
              </div>
              <div className="flex gap-2">
                {!isProviderLoggedIn ? (
                  <Button size="sm" variant="outline" onClick={() => setIsProviderLoggedIn(true)} className="gap-2">
                    <Lock className="h-4 w-4" />
                    Provider Login
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      onClick={() => setShowAddServiceModal(true)}
                      className="gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add Service
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsProviderLoggedIn(false)}>
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <div>
                  <label className="text-sm font-medium">Category:</label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      size="sm"
                      variant={!selectedCategory ? "default" : "outline"}
                      onClick={() => setSelectedCategory(null)}
                    >
                      All
                    </Button>
                    {["RPC", "Indexing", "Node", "Gateway", "Analytics"].map((cat) => (
                      <Button
                        key={cat}
                        size="sm"
                        variant={selectedCategory === cat ? "default" : "outline"}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Pricing:</label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      size="sm"
                      variant={!selectedPricing ? "default" : "outline"}
                      onClick={() => setSelectedPricing(null)}
                    >
                      All
                    </Button>
                    {["Free", "Freemium", "Paid"].map((price) => (
                      <Button
                        key={price}
                        size="sm"
                        variant={selectedPricing === price ? "default" : "outline"}
                        onClick={() => setSelectedPricing(price)}
                      >
                        {price}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Services Grid */}
              <div className="grid gap-3 pt-4">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="group rounded-lg border border-border/50 bg-background/50 p-4 transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{service.name}</h3>
                          {service.verified && (
                            <Badge className="gap-1 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                              <CheckCircle2 className="h-3 w-3" />
                              Verified
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {service.type}
                          </Badge>
                          <Badge
                            className={`text-xs ${service.pricing === "Free"
                                ? "bg-green-500/10 text-green-500"
                                : service.pricing === "Freemium"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : "bg-orange-500/10 text-orange-500"
                              }`}
                          >
                            {service.pricing}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">by {service.provider}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {service.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        {service.sla && <p className="mt-1 text-xs text-muted-foreground">SLA: {service.sla}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedService(service)
                            setShowDetailModal(true)
                          }}
                        >
                          Details
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleExportJSON(service)} className="gap-1">
                          <Download className="h-3 w-3" />
                        </Button>
                        {isProviderLoggedIn && (
                          <Button size="sm" variant="ghost" onClick={() => handleToggleVerified(service.id)}>
                            {service.verified ? "Unverify" : "Verify"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Service Modal */}
        <Dialog open={showAddServiceModal} onOpenChange={setShowAddServiceModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Infrastructure Service</DialogTitle>
              <DialogDescription>Submit a new infrastructure service listing</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Service Name</label>
                  <Input
                    placeholder="e.g., My RPC Provider"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Provider</label>
                  <Input
                    placeholder="e.g., Company Name"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <select
                    className="w-full rounded border bg-background p-2"
                    value={formData.type}
                    onChange={handleTypeChange}
                  >
                    <option>RPC</option>
                    <option>Indexing</option>
                    <option>Node</option>
                    <option>Gateway</option>
                    <option>Analytics</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Pricing</label>
                  <select
                    className="w-full rounded border bg-background p-2"
                    value={formData.pricing}
                    onChange={handlePricingChange}
                  >
                    <option>Free</option>
                    <option>Freemium</option>
                    <option>Paid</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input
                  placeholder="e.g., Fast, Reliable, Verified"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">SLA (optional)</label>
                <Input
                  placeholder="e.g., 99.9%"
                  value={formData.sla}
                  onChange={(e) => setFormData({ ...formData, sla: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Accepted Tokens (comma-separated)</label>
                <Input
                  placeholder="e.g., SUI, USDC, USDT"
                  value={formData.acceptedTokens}
                  onChange={(e) => setFormData({ ...formData, acceptedTokens: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">URL (optional)</label>
                <Input
                  placeholder="https://..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Contact (optional)</label>
                <Input
                  placeholder="contact@example.com"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddService} className="bg-blue-600 hover:bg-blue-700">
                  Add Service
                </Button>
                <Button variant="outline" onClick={() => setShowAddServiceModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Detail Modal with JSON View */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedService?.name || selectedValidator?.name || selectedIndexing?.name}</DialogTitle>
              <DialogDescription>
                {selectedService
                  ? "Service Details"
                  : selectedValidator
                    ? "Validator Details"
                    : selectedIndexing
                      ? "Indexing Provider Details"
                      : ""}
              </DialogDescription>
            </DialogHeader>
            {selectedService && !showJSONView && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Provider</label>
                  <p className="text-foreground">{selectedService.provider}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Badge>{selectedService.type}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Pricing</label>
                  <Badge>{selectedService.pricing}</Badge>
                </div>
                {selectedService.sla && (
                  <div>
                    <label className="text-sm font-medium">SLA</label>
                    <p className="text-foreground">{selectedService.sla}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedService.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Accepted Tokens</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedService.acceptedTokens.map((token) => (
                      <Badge key={token} variant="secondary">
                        {token}
                      </Badge>
                    ))}
                  </div>
                </div>
                {selectedService.url && (
                  <div>
                    <label className="text-sm font-medium">URL</label>
                    <a
                      href={selectedService.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {selectedService.url}
                    </a>
                  </div>
                )}
                {selectedService.contact && (
                  <div>
                    <label className="text-sm font-medium">Contact</label>
                    <p className="text-foreground">{selectedService.contact}</p>
                  </div>
                )}
                {selectedService.pricingTiers && selectedService.pricingTiers.length > 0 && (
                  <div>
                    <label className="text-sm font-medium">Pricing Tiers</label>
                    <div className="space-y-2">
                      {selectedService.pricingTiers.map((tier, idx) => (
                        <div key={idx} className="rounded border border-blue-500/20 bg-blue-500/5 p-2">
                          <p className="text-sm font-medium">{tier.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {tier.price === 0 ? "Free" : `${tier.price} ${tier.token}`}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-1 w-full gap-1 text-xs bg-transparent"
                            onClick={() => handlePurchase(selectedService, tier)}
                            disabled={!currentAccount}
                          >
                            <CreditCard className="h-3 w-3" />
                            {tier.price === 0 ? "Get Started" : "Purchase"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Validator Details */}
            {selectedValidator && !showJSONView && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <p className="text-foreground font-mono text-xs">{selectedValidator.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Commission</label>
                  <p className="text-foreground">{selectedValidator.commission}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">APY</label>
                  <p className="text-foreground text-green-500">{selectedValidator.apy}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Voting Power</label>
                  <p className="text-foreground">{selectedValidator.votingPower}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Uptime</label>
                  <p className="text-foreground">{selectedValidator.uptime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Staked</label>
                  <p className="text-foreground">{selectedValidator.staked}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedValidator.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                {selectedValidator.description && (
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <p className="text-foreground">{selectedValidator.description}</p>
                  </div>
                )}
                {selectedValidator.website && (
                  <div>
                    <label className="text-sm font-medium">Website</label>
                    <a
                      href={selectedValidator.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {selectedValidator.website}
                    </a>
                  </div>
                )}
              </div>
            )}
            {/* Indexing Provider Details */}
            {selectedIndexing && !showJSONView && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Provider</label>
                  <p className="text-foreground">{selectedIndexing.provider}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Pricing</label>
                  <Badge>{selectedIndexing.pricing}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">SLA</label>
                  <p className="text-foreground">{selectedIndexing.sla}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedIndexing.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Features</label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedIndexing.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Accepted Tokens</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedIndexing.acceptedTokens.map((token) => (
                      <Badge key={token} variant="secondary">
                        {token}
                      </Badge>
                    ))}
                  </div>
                </div>
                {selectedIndexing.website && (
                  <div>
                    <label className="text-sm font-medium">Website</label>
                    <a
                      href={selectedIndexing.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {selectedIndexing.website}
                    </a>
                  </div>
                )}
                {selectedIndexing.documentation && (
                  <div>
                    <label className="text-sm font-medium">Documentation</label>
                    <a
                      href={selectedIndexing.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {selectedIndexing.documentation}
                    </a>
                  </div>
                )}
                {selectedIndexing.explorer && (
                  <div>
                    <label className="text-sm font-medium">Explorer</label>
                    <a
                      href={selectedIndexing.explorer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {selectedIndexing.explorer}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* JSON View Toggle Button */}
            <div className="flex items-center gap-2 pt-4">
              <Button size="sm" variant={!showJSONView ? "default" : "outline"} onClick={() => setShowJSONView(false)}>
                Details
              </Button>
              <Button size="sm" variant={showJSONView ? "default" : "outline"} onClick={() => setShowJSONView(true)}>
                JSON
              </Button>
            </div>

            {/* JSON View for Service, Validator or Indexing Provider */}
            {showJSONView && (selectedService || selectedValidator || selectedIndexing) && (
              <pre className="max-h-96 overflow-auto rounded bg-muted p-3 text-xs">
                {JSON.stringify(selectedService || selectedValidator || selectedIndexing, null, 2)}
              </pre>
            )}

            {/* Export Button */}
            {(selectedService || selectedValidator || selectedIndexing) && (
              <Button
                onClick={() => handleExportJSON(selectedService || selectedValidator || selectedIndexing!)}
                className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <Download className="h-4 w-4" />
                Export as JSON
              </Button>
            )}
          </DialogContent>
        </Dialog>

        {/* Payment Modal */}
        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Purchase Service Tier
              </DialogTitle>
              <DialogDescription>
                {selectedService?.name} - {selectedTier?.name}
              </DialogDescription>
            </DialogHeader>

            {selectedService && selectedTier && currentAccount && (
              <div className="space-y-4">
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Service:</span>
                    <span className="font-semibold">{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tier:</span>
                    <span className="font-semibold">{selectedTier.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Amount:</span>
                    <span className="font-semibold text-lg">
                      {selectedTier.price === 0 ? "Free" : `${selectedTier.price} ${selectedPaymentToken}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Duration:</span>
                    <span className="font-semibold">30 days</span>
                  </div>
                </div>

                {selectedTier.price > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payment Token:</label>
                    <div className="flex gap-2">
                      {selectedService.acceptedTokens.map((token) => (
                        <Button
                          key={token}
                          size="sm"
                          variant={selectedPaymentToken === token ? "default" : "outline"}
                          onClick={() => setSelectedPaymentToken(token)}
                          className="gap-1"
                        >
                          <Wallet className="h-3 w-3" />
                          {token}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3 text-sm">
                  <p className="text-muted-foreground">
                    From:{" "}
                    <span className="font-mono text-xs">
                      {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
                    </span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleConfirmPayment} className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Confirm & Pay
                  </Button>
                  <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <ExplorerSelectorDialog
          open={showDetailModal && !selectedService && !selectedValidator && !selectedIndexing}
          onOpenChange={setShowDetailModal}
        />

        <TabsContent value="usage" className="space-y-4">
          {!isSuiChain ? (
            <Card className="glass-card border-amber-500/20 bg-amber-500/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-900">Full functionality on Sui</h3>
                    <p className="text-sm text-amber-800 mt-1">
                      Usage tracking and quota management is available exclusively on Sui networks. Switch to Sui to
                      access this feature.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Usage & Quota Dashboard
                  </CardTitle>
                  <CardDescription>
                    Track your API request usage across all connected services. Usage enforcement powered by NGINX/Envoy
                    sidecars.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Infrastructure Note */}
              <Card className="glass-card border-blue-500/20 bg-blue-500/5">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-blue-900 flex items-center gap-2">
                      <Cpu className="h-4 w-4" />
                      Sidecar/Proxy Compatibility
                    </p>
                    <p className="text-sm text-blue-800">
                      Rate limiting and quota enforcement via{" "}
                      <span className="font-mono bg-blue-500/10 px-2 py-1 rounded">NGINX</span> or{" "}
                      <span className="font-mono bg-blue-500/10 px-2 py-1 rounded">Envoy</span> sidecars. Each client
                      receives a unique API key for quota tracking.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Client Quotas Grid */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Your Connected Clients
                </h3>

                {clientQuotas.length === 0 ? (
                  <Card className="glass-card">
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      No connected clients. Add an API key to your application to start tracking usage.
                    </CardContent>
                  </Card>
                ) : (
                  clientQuotas.map((quota) => (
                    <Card key={quota.clientId} className="glass-card">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {/* Client Header */}
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{quota.clientName}</h4>
                              <p className="text-xs text-muted-foreground font-mono mt-1">{quota.clientId}</p>
                            </div>
                            <Badge
                              variant={
                                quota.status === "active"
                                  ? "default"
                                  : quota.status === "warning"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {quota.status === "active" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                              {quota.status === "warning" && <AlertCircle className="h-3 w-3 mr-1" />}
                              {quota.status.charAt(0).toUpperCase() + quota.status.slice(1)}
                            </Badge>
                          </div>

                          {/* Plan and Usage */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Plan</p>
                              <p className="font-medium">{quota.plan}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Usage</p>
                              <p className="font-medium text-right">{quota.usagePercent}%</p>
                            </div>
                          </div>

                          {/* Usage Bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Requests</span>
                              <span className="font-mono">
                                {quota.requestsUsed.toLocaleString()} / {quota.requestsLimit.toLocaleString()}
                              </span>
                            </div>
                            <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${quota.usagePercent >= 90
                                    ? "bg-red-500"
                                    : quota.usagePercent >= 75
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                  }`}
                                style={{ width: `${Math.min(quota.usagePercent, 100)}%` }}
                              />
                            </div>
                          </div>

                          {/* Services and Reset Info */}
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <p className="text-muted-foreground mb-1">Services</p>
                              <div className="flex flex-wrap gap-1">
                                {quota.services.map((svc) => (
                                  <Badge key={svc} variant="outline" className="text-xs">
                                    {svc}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-muted-foreground mb-1">Reset</p>
                              <div className="space-y-1">
                                <p>Last: {quota.lastReset}</p>
                                <p className="font-medium text-green-600 dark:text-green-400">
                                  Next: {quota.nextReset}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 pt-2 border-t">
                            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                              View Logs
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                              Manage Quota
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Proxy Configuration Note */}
              <Card className="glass-card border-blue-500/20 bg-blue-500/5">
                <CardHeader>
                  <CardTitle className="text-base">Proxy Configuration Example</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Deploy with NGINX or Envoy to enforce these quotas on incoming requests:
                  </p>
                  <div className="bg-[#0a0f1e] rounded p-3 text-xs font-mono text-foreground overflow-x-auto">
                    <pre>{`limit_req_zone $api_key zone=api_limit:10m rate=100r/s;
limit_req zone=api_limit burst=200 nodelay;

# Rate limit by client API key
if ($http_x_api_key) {
  set $api_key $http_x_api_key;
}`}</pre>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </main>
  )
}
