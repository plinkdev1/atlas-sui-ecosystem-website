/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Keep existing errors from blocking builds, but strict in CI/CD
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "static.okx.com",
      },
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
      },
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
      },
      {
        protocol: "https",
        hostname: "img.logo.dev",
      },
      {
        protocol: "https",
        hostname: "cryptologos.cc",
      },
      {
        protocol: "https",
        hostname: "s2.coinmarketcap.com",
      },
      {
        protocol: "https",
        hostname: "cdn.brandfetch.io",
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // Old interactive dApp pages redirected to new marketing pages
      { source: "/hub", destination: "/", permanent: true },
      { source: "/swap", destination: "/tools/swap", permanent: true },
      { source: "/bridge", destination: "/tools/bridge", permanent: true },
      { source: "/stake-hub", destination: "/tools/stake", permanent: true },
      { source: "/nft", destination: "/tools", permanent: true },
      { source: "/oracle-feeds", destination: "/tools/oracle-feeds", permanent: true },
      { source: "/explorer", destination: "/tools/transaction-explainer", permanent: true },
      { source: "/wallet-cleanup", destination: "/tools/wallet-cleanup", permanent: true },
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    }
  },
  experimental: {
    optimizePackageImports: ["@mysten/dapp-kit", "lucide-react"],
  },
}

export default nextConfig
