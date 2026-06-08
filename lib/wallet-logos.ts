export const WALLET_LOGOS = {
  slush: "/images/slush.png",
  suiet: "", // Fallback to logo.dev
  nightly: "", // Fallback to logo.dev
  "okx wallet": "/images/okx.png",
  okx: "/images/okx.png",
  cetus: "/images/cetus.png",
  ethos: "/images/ethos.png",
  phantom: "/images/phantom.png",
  backpack: "/images/backpack.png",
  martian: "/logos/martian.svg",
  "martian sui wallet": "/logos/martian.svg",
  "surf wallet": "/logos/surf.svg",
  surf: "/logos/surf.svg",
  glasswallet: "/logos/glasswallet.svg",
  "glass wallet": "/logos/glasswallet.svg",
  "onekey wallet": "/logos/onekey.svg",
  onekey: "/logos/onekey.svg",
  "tokenpocket wallet": "/logos/tockenpocket.svg",
  tokenpocket: "/logos/tockenpocket.svg",
}

export function getWalletLogo(walletName: string): string {
  const normalized = walletName.toLowerCase().trim()
  return WALLET_LOGOS[normalized as keyof typeof WALLET_LOGOS] || ""
}

export function getWalletInitials(walletName: string): string {
  return walletName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}
