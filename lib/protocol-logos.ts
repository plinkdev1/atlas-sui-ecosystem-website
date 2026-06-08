// Centralized logo URL map.
// Strategy (per entry, tried in order by LogoImage component):
//   1. Provided URL here (CoinGecko for listed tokens, GitHub raw for open-source)
//   2. Clearbit (logo.clearbit.com/<domain>) — derived from the protocol's url field
//   3. Letter-avatar fallback — generated in-component, never shows broken image

export const PROTOCOL_LOGOS: Record<string, string> = {
  // ===== INFRASTRUCTURE PROVIDERS =====
  shinami: "https://logo.clearbit.com/shinami.io",
  quicknode: "https://logo.clearbit.com/quicknode.com",
  ankr: "https://logo.clearbit.com/ankr.com",
  figment: "https://logo.clearbit.com/figment.io",
  getblock: "https://logo.clearbit.com/getblock.io",
  blockberry: "https://logo.clearbit.com/blockberry.io",
  blockvision: "https://logo.clearbit.com/blockvision.io",

  // ===== BLOCKCHAINS — CoinGecko (well-known, stable IDs) =====
  sui: "https://cryptologos.cc/logos/sui-sui-logo.svg",
  ethereum: "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
  bitcoin: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg",
  aptos: "https://cryptologos.cc/logos/aptos-apt-logo.svg",
  solana: "https://cryptologos.cc/logos/solana-sol-logo.svg",
  polygon: "https://cryptologos.cc/logos/polygon-matic-logo.svg",
  arbitrum: "https://cryptologos.cc/logos/arbitrum-arb-logo.svg",
  optimism: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.svg",
  base: "https://logo.clearbit.com/base.org",
  cosmos: "https://cryptologos.cc/logos/cosmos-atom-logo.svg",
  ton: "https://cryptologos.cc/logos/toncoin-ton-logo.svg",
  avalanche: "https://cryptologos.cc/logos/avalanche-avax-logo.svg",
  bnb: "https://cryptologos.cc/logos/bnb-bnb-logo.svg",

  // ===== SUI DEX =====
  cetus: "https://assets.coingecko.com/coins/images/30395/small/logo.png",
  deepbook: "https://assets.coingecko.com/coins/images/39651/small/deepbook.jpg",
  turbos: "https://assets.coingecko.com/coins/images/30271/small/turbos.png",
  "turbos finance": "https://assets.coingecko.com/coins/images/30271/small/turbos.png",
  turbosfinance: "https://assets.coingecko.com/coins/images/30271/small/turbos.png",
  aftermath: "https://assets.coingecko.com/coins/images/33046/small/aftermath.png",
  "aftermath finance": "https://assets.coingecko.com/coins/images/33046/small/aftermath.png",
  aftermathfinance: "https://assets.coingecko.com/coins/images/33046/small/aftermath.png",
  flowx: "https://logo.clearbit.com/flowx.finance",
  kriya: "https://logo.clearbit.com/kriya.finance",
  bluemove: "https://logo.clearbit.com/bluemove.net",
  suiswap: "https://logo.clearbit.com/suiswap.app",
  "7k": "https://logo.clearbit.com/7k.ag",

  // ===== SUI PERPS =====
  bluefin: "https://assets.coingecko.com/coins/images/30982/small/bluefin.png",
  typus: "https://logo.clearbit.com/typus.finance",

  // ===== SUI LENDING / YIELD =====
  navi: "https://assets.coingecko.com/coins/images/37129/small/navi.png",
  scallop: "https://assets.coingecko.com/coins/images/33361/small/scallop.png",
  suilend: "https://logo.clearbit.com/suilend.fi",
  bucket: "https://logo.clearbit.com/bucketprotocol.io",
  alphafi: "https://logo.clearbit.com/alphafi.xyz",

  // ===== SUI LIQUID STAKING =====
  haedal: "https://logo.clearbit.com/haedal.xyz",
  volo: "https://logo.clearbit.com/volosui.com",
  spring: "https://logo.clearbit.com/springsui.com",
  lido: "https://assets.coingecko.com/coins/images/13323/small/lido_logo_white.png",

  // ===== SUI WALLETS =====
  slush: "https://logo.clearbit.com/slush.app",
  suiet: "https://raw.githubusercontent.com/suiet/suiet/main/packages/chrome/public/icon128.png",
  nightly: "https://logo.clearbit.com/nightly.app",
  "nightly wallet": "https://logo.clearbit.com/nightly.app",
  nightlywallet: "https://logo.clearbit.com/nightly.app",
  martian: "https://logo.clearbit.com/martianwallet.xyz",
  ethos: "https://logo.clearbit.com/ethoswallet.xyz",
  "ethos wallet": "https://logo.clearbit.com/ethoswallet.xyz",
  ethoswallet: "https://logo.clearbit.com/ethoswallet.xyz",
  okx: "https://assets.coingecko.com/coins/images/18627/small/okb.png",
  "okx wallet": "https://assets.coingecko.com/coins/images/18627/small/okb.png",
  okxwallet: "https://assets.coingecko.com/coins/images/18627/small/okb.png",
  phantom: "https://logo.clearbit.com/phantom.app",
  coinbase: "https://logo.clearbit.com/coinbase.com",
  trustwallet: "https://assets.coingecko.com/coins/images/4595/small/trust_wallet.jpg",
  surf: "https://logo.clearbit.com/surf.tech",
  onekey: "https://logo.clearbit.com/onekey.so",
  bybit: "https://logo.clearbit.com/bybit.com",

  // ===== BRIDGES =====
  wormhole: "https://assets.coingecko.com/coins/images/30323/small/wormhole.jpg",
  axelar: "https://assets.coingecko.com/coins/images/27277/small/V-65_xQ1_400x400.jpeg",
  layerzero: "https://assets.coingecko.com/coins/images/28677/small/ZRO_Token.png",
  celer: "https://assets.coingecko.com/coins/images/13397/small/celer_logo.png",
  meson: "https://logo.clearbit.com/meson.fi",
  allbridge: "https://logo.clearbit.com/allbridge.io",

  // ===== ORACLES =====
  pyth: "https://assets.coingecko.com/coins/images/31924/small/pyth.png",
  switchboard: "https://logo.clearbit.com/switchboard.xyz",
  supra: "https://logo.clearbit.com/supraoracles.com",
  stork: "https://logo.clearbit.com/stork.network",

  // ===== NFT MARKETPLACES =====
  hyperspace: "https://logo.clearbit.com/hyperspace.xyz",
  tradeport: "https://logo.clearbit.com/tradeport.xyz",
  clutchy: "https://logo.clearbit.com/clutchy.io",
  keepsake: "https://logo.clearbit.com/keepsake.gg",

  // ===== GAMING =====
  panzerdogs: "https://logo.clearbit.com/panzerdogs.io",
  aresrpg: "https://logo.clearbit.com/aresrpg.world",
  suiplay: "https://logo.clearbit.com/sui.io",

  // ===== SOCIALFI =====
  releap: "https://logo.clearbit.com/releap.io",
  fantv: "https://logo.clearbit.com/fan.tv",

  // ===== AI =====
  bittensor: "https://assets.coingecko.com/coins/images/28452/small/ARUsPeNQ_400x400.jpeg",
  atoma: "https://logo.clearbit.com/atoma.network",

  // ===== RWA =====
  ondo: "https://assets.coingecko.com/coins/images/26580/small/ONDO.png",
  maplefinance: "https://logo.clearbit.com/maple.finance",

  // ===== IDENTITY =====
  suins: "https://logo.clearbit.com/suins.io",

  // ===== STORAGE =====
  walrus: "https://logo.clearbit.com/walrus.xyz",
  tusky: "https://logo.clearbit.com/tusky.io",

  // ===== INFRASTRUCTURE / RPC =====
  shinami2: "https://logo.clearbit.com/shinami.com",
  blockvision2: "https://logo.clearbit.com/blockvision.org",
  ankr2: "https://assets.coingecko.com/coins/images/4324/small/U85xTl2.png",
  quicknode2: "https://logo.clearbit.com/quicknode.com",
  figment2: "https://logo.clearbit.com/figment.io",
  triton: "https://logo.clearbit.com/triton.one",
  alchemy: "https://logo.clearbit.com/alchemy.com",
  mysten: "https://logo.clearbit.com/mystenlabs.com",
  getblock2: "https://logo.clearbit.com/getblock.io",

  // ===== PREDICTION MARKETS =====
  doubleup: "https://logo.clearbit.com/doubleup.fun",

  // ===== HARDWARE WALLETS =====
  ledger: "https://logo.clearbit.com/ledger.com",
  keystone: "https://logo.clearbit.com/keyst.one",
  suiball: "https://logo.clearbit.com/sui.io",
  trezor: "https://logo.clearbit.com/trezor.io",

  // ===== LAUNCHPADS =====
  suipad: "https://logo.clearbit.com/suipad.xyz",
  seapad: "https://logo.clearbit.com/seapad.io",
  movex: "https://logo.clearbit.com/movex.exchange",

  // ===== DEPIN =====
  chirp: "https://logo.clearbit.com/chirp.network",
  hotspot: "https://logo.clearbit.com/helium.com",

  // ===== DEFI GENERAL =====
  aave: "https://assets.coingecko.com/coins/images/12645/small/AAVE.png",
  uniswap: "https://assets.coingecko.com/coins/images/12504/small/uni.jpg",
  staked: "https://logo.clearbit.com/staked.us",
  haedal2: "https://logo.clearbit.com/haedal.xyz",
  defilllama: "https://logo.clearbit.com/defillama.com",
  suiscan: "https://logo.clearbit.com/suiscan.xyz",
  suivision: "https://logo.clearbit.com/suivision.xyz",
}

/**
 * Returns the best logo URL for a protocol key.
 * The LogoImage component will still try Clearbit as a secondary fallback
 * and then a letter-avatar as final fallback.
 */
export function getProtocolLogo(key: string | undefined): string | undefined {
  if (!key) return undefined

  const normalized = key.toLowerCase().replace(/\s+/g, '').replace(/-/g, '')

  // Try exact normalized match first
  if (PROTOCOL_LOGOS[normalized]) return PROTOCOL_LOGOS[normalized]

  // Try first word only (handles "OKX Wallet" → "okx")
  const firstWord = key.toLowerCase().split(' ')[0]
  return PROTOCOL_LOGOS[firstWord] || undefined
}
