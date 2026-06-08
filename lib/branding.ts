"use client"

export const ATLAS_BRANDING = {
  name: "Atlas Protocol",
  tagline: "Infra & Security Hub for blockchain",
  description: "The comprehensive Sui blockchain toolkit",
  logoPath: "/images/atlas-logo.png",
  faviconPath: "/favicon.ico",
  colors: {
    primary: "#c77dff",
    secondary: "#0a0a0f",
    accent: "#fbbf24",
  },
  urls: {
    home: "/",
    about: "/about",
    walletCleanup: "/wallet-cleanup",
    transactionExplainer: "/transaction-explainer",
    infraDiscovery: "/infra-discovery",
    docs: "/docs",
  },
}

export const getAtlasLogoUrl = () => ATLAS_BRANDING.logoPath
export const getAtlasFaviconUrl = () => ATLAS_BRANDING.faviconPath
