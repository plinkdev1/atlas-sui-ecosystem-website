// Client-side wrapper for logo.dev API
// Calls server route instead of exposing API key directly

export const BRAND_DOMAINS: Record<string, string> = {
  "Mysten Labs": "mystenlabs.com",
  Imperator: "imperator.co",
  Staketab: "staketab.com",
  InfStones: "infstones.com",
  "MIDL.dev": "midl.dev",
  Allnodes: "allnodes.com",
  ContributionDAO: "contributiondao.com",
  Cosmostation: "cosmostation.io",
  "Aftermath Finance": "aftermath.finance",
  "Studio Mirai": "studiomirai.io",
  RockX: "rockx.com",
  Blockberry: "blockberry.one",
  BlockVision: "blockvision.org",
  Shinami: "shinami.com",
  Chainbase: "chainbase.com",
  Sentio: "sentio.xyz",
  "Indexer.xyz": "indexer.xyz",
  ZettaBlock: "zettablock.com",
  "Mysten Labs Indexer": "mystenlabs.com",
  QuickNode: "quicknode.com",
  Dwellir: "dwellir.com",
  Chainstack: "chainstack.com",
  Ankr: "ankr.com",
  GetBlock: "getblock.io",
  OnFinality: "onfinality.io",
  AllThatNode: "allthatnode.com",
  NOWNodes: "nownodes.io",
  PublicNode: "publicnode.com",
  "Triton One": "triton.one",
  "RPC Fast": "rpcfast.com",
  RedSwitches: "redswitches.com",
  "Blast API": "blastapi.io",
  BlockPI: "blockpi.io",
  SuiVision: "suivision.xyz",
  Suiscan: "suiscan.xyz",
  "OKX Wallet": "okx.com",
  "Nightly Wallet": "nightly.app",
  Suiet: "suiet.app",
  Ethos: "ethoswallet.xyz",
  Phantom: "phantom.app",
  "Aptos Labs": "aptoslabs.com",
  Walrus: "walrus.ai",
  LayerZero: "layerzero.network",
  Wormhole: "wormhole.com",
  Moonstake: "moonstake.io",
  "StakeWith.us": "stakewith.us",
  Infura: "infura.io",
  Alchemy: "alchemy.com",
  "Pokt Network": "pokt.network",
}

export const BRAND_LOGO_DIRECT: Record<string, string> = {
  // Real partner logos in /images (lowercase normalized keys)
  "mysten labs": "/images/mysten-labs.png",
  "mysten labs public": "/images/mysten-labs.png",
  "mysten labs indexer": "/images/mysten-labs.png",
  "mysten labs validator": "/images/mysten-labs.png",
  blockvision: "/images/blockvision.png",
  "block vision": "/images/blockvision.png",
  cetus: "/images/cetus.png",
  ethos: "/images/ethos.png",
  "ethos wallet": "/images/ethos.png",
  phantom: "/images/phantom.png",
  okx: "/images/okx.png",
  "okx wallet": "/images/okx.png",
  backpack: "/images/backpack.png",
  slush: "/images/slush.png",
  allthatnode: "/images/all-that-node.png",
  "all that node": "/images/all-that-node.png",
  "all-that-node": "/images/all-that-node.png",
}

export const BRAND_LOGO_FALLBACKS: Record<string, string[]> = {
  // Real partner logos in /images with fallbacks (lowercase normalized keys)
  "mysten labs": ["/images/mysten-labs.png", "https://mystenlabs.com/logo.png"],
  "mysten labs public": ["/images/mysten-labs.png", "https://mystenlabs.com/logo.png"],
  "mysten labs indexer": ["/images/mysten-labs.png", "https://mystenlabs.com/logo.png"],
  "mysten labs validator": ["/images/mysten-labs.png", "https://mystenlabs.com/logo.png"],
  blockvision: ["/images/blockvision.png", "https://blockvision.org/logo.png"],
  "block vision": ["/images/blockvision.png", "https://blockvision.org/logo.png"],
  cetus: ["/images/cetus.png", "https://cetus.finance/logo.png"],
  ethos: ["/images/ethos.png", "https://ethoswallet.xyz/logo.png"],
  "ethos wallet": ["/images/ethos.png", "https://ethoswallet.xyz/logo.png"],
  phantom: ["/images/phantom.png", "https://phantom.app/logo.png"],
  okx: ["/images/okx.png", "https://www.okx.com/logo.png"],
  "okx wallet": ["/images/okx.png", "https://www.okx.com/logo.png"],
  backpack: ["/images/backpack.png", "https://backpack.app/logo.png"],
  slush: ["/images/slush.png", "https://slush.app/logo.png"],
  allthatnode: ["/images/all-that-node.png", "https://www.allthatnode.com/logo.png"],
  "all that node": ["/images/all-that-node.png", "https://www.allthatnode.com/logo.png"],
  "all-that-node": ["/images/all-that-node.png", "https://www.allthatnode.com/logo.png"],
}

export function getBrandLogo(name: string, size = 128): string {
  const normalizedName = name.toLowerCase().trim()

  if (BRAND_LOGO_DIRECT[normalizedName]) {
    return BRAND_LOGO_DIRECT[normalizedName]
  }

  const domain = BRAND_DOMAINS[name]
  if (!domain) return ""

  return `/api/logos?domain=${encodeURIComponent(domain)}&size=${size}`
}

export function getBrandLogoFallbacks(name: string): string[] {
  const normalizedName = name.toLowerCase().trim()

  if (BRAND_LOGO_FALLBACKS[normalizedName]) {
    return BRAND_LOGO_FALLBACKS[normalizedName]
  }

  return []
}

export function getMonogramFallback(name: string): string {
  const words = name.split(" ")
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}
