export interface Partner {
  id: string
  name: string
  tagline: string
  logo: string
  website: string
  badge?: "Verified Partner" | "Sui Foundation Grantee" | "Official Infra"
  chains: ("Sui" | "Aptos" | "Ethereum" | "Mina" | "IOTA" | "Monad")[]
  featured?: boolean
  adType: "leaderboard" | "rectangle" | "hero"
}

export const PARTNERS: Partner[] = [
  {
    id: "blockberry",
    name: "Blockberry",
    tagline: "Leading Blockchain Indexing & Analytics",
    logo: "https://blockberry.one/logo.png",
    website: "https://blockberry.one",
    badge: "Verified Partner",
    chains: ["Sui", "Aptos"],
    featured: true,
    adType: "rectangle",
  },
  {
    id: "blockvision",
    name: "Blockvision",
    tagline: "Real-Time Blockchain Data Infrastructure",
    logo: "/images/blockvision.png",
    website: "https://blockvision.org",
    badge: "Official Infra",
    chains: ["Sui"],
    featured: true,
    adType: "rectangle",
  },
  {
    id: "shinami",
    name: "Shinami",
    tagline: "Enterprise-Grade RPC & Node Services",
    logo: "https://shinami.io/logo.png",
    website: "https://shinami.io",
    badge: "Verified Partner",
    chains: ["Sui"],
    featured: true,
    adType: "rectangle",
  },
  {
    id: "quicknode",
    name: "QuickNode",
    tagline: "Fast & Reliable Blockchain Infrastructure",
    logo: "https://quicknode.com/logo.png",
    website: "https://quicknode.com",
    badge: "Verified Partner",
    chains: ["Sui", "Ethereum", "Aptos"],
    featured: true,
    adType: "rectangle",
  },
  {
    id: "mysten-labs",
    name: "Mysten Labs",
    tagline: "Creators of Sui & Consensus Technology",
    logo: "/images/mysten-labs.png",
    website: "https://mystenlabs.com",
    badge: "Official Infra",
    chains: ["Sui"],
    featured: true,
    adType: "rectangle",
  },
  {
    id: "cetus",
    name: "Cetus",
    tagline: "Next-Gen DEX & Liquidity Protocol",
    logo: "/images/cetus.png",
    website: "https://cetus.finance",
    chains: ["Sui"],
    featured: true,
    adType: "rectangle",
  },
  {
    id: "okx-wallet",
    name: "OKX Wallet",
    tagline: "Multi-Chain Web3 Wallet & DEX",
    logo: "/images/okx.png",
    website: "https://www.okx.com/web3",
    chains: ["Sui", "Aptos", "Ethereum", "Mina"],
    featured: true,
    adType: "rectangle",
  },
  {
    id: "nightly-wallet",
    name: "Nightly Wallet",
    tagline: "Secure Multi-Chain Wallet",
    logo: "https://nightly.app/logo.png",
    website: "https://nightly.app",
    chains: ["Sui", "Aptos", "Ethereum"],
    featured: true,
    adType: "rectangle",
  },
  {
    id: "suiet",
    name: "Suiet",
    tagline: "Native Sui Wallet & DApp Browser",
    logo: "https://suiet.app/logo.png",
    website: "https://suiet.app",
    badge: "Verified Partner",
    chains: ["Sui"],
    featured: true,
    adType: "rectangle",
  },
  {
    id: "aptos-labs",
    name: "Aptos Labs",
    tagline: "Layer 1 Blockchain for Real-World Use",
    logo: "https://aptoslabs.com/logo.png",
    website: "https://aptoslabs.com",
    chains: ["Aptos"],
    featured: false,
    adType: "rectangle",
  },
  {
    id: "ethos-wallet",
    name: "Ethos Wallet",
    tagline: "Simple & Secure Web3 Experience",
    logo: "/images/ethos.png",
    website: "https://ethoswallet.xyz",
    chains: ["Sui"],
    featured: true,
    adType: "rectangle",
  },
  {
    id: "phantom",
    name: "Phantom",
    tagline: "Leading Multi-Chain Web3 Wallet",
    logo: "https://phantom.app/logo.png",
    website: "https://phantom.app",
    chains: ["Sui", "Ethereum", "Aptos", "Mina"],
    featured: true,
    adType: "rectangle",
  },
]

export type ChainName = "Sui" | "Ethereum" | "Aptos" | "Mina" | "IOTA" | "Monad"

export const getPartnersByChain = (chain: string) => {
  const chainName = chain as ChainName
  return PARTNERS.filter((p) => p.chains.includes(chainName))
}

export const getFeaturedPartners = () => {
  return PARTNERS.filter((p) => p.featured)
}
