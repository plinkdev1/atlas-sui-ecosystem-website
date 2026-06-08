// Returns up-to-date cryptocurrency wallet logos refreshed daily

export function getReownWalletLogo(walletId: string): string {
  const id = walletId.toLowerCase()

  // Format: https://logo.dev/[wallet-name]
  // Falls back to local assets for native Sui wallets

  const localLogos: Record<string, string> = {
    // Native Sui wallets use local assets
    slush: "/images/slush.png",
    suiet: "", // Use logo.dev fallback
    phantom: "/images/phantom.png",
    martian: "/logos/martian.svg",
    nightly: "", // Use logo.dev fallback
    okx: "/images/okx.png",
    glasswallet: "/logos/glasswallet.svg",
    onekey: "/logos/onekey.svg",
    surf: "/logos/surf.svg",
    tokenpocket: "/logos/tockenpocket.svg",
    ethos: "/images/ethos.png",
    cetus: "/images/cetus.png",
    backpack: "/images/backpack.png",
  }

  // Check if wallet has local logo (native Sui wallets)
  if (localLogos[id]) {
    return localLogos[id]
  }

  // logo.dev is the leading CDN for cryptocurrency logos with daily updates
  return `https://logo.dev/${id}?format=png`
}

/**
 * Get fallback logo sources for retry logic
 * Returns array of fallback sources if primary fails
 */
export function getReownWalletLogoFallbacks(walletId: string): string[] {
  const id = walletId.toLowerCase()
  const primary = getReownWalletLogo(id)

  // 1. Primary: logo.dev or local
  // 2. Fallback: Generic monogram avatar
  // 3. Fallback: Placeholder

  return [
    primary,
    `https://logo.dev/${id}?format=svg`, // Try SVG format if PNG fails
    `https://logo.dev/${id}?size=lg`, // Try larger size
  ].filter(Boolean)
}
