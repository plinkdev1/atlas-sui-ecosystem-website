import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk, Outfit } from "next/font/google"

import { SuiProvider } from "@/lib/sui-provider"
import { NetworkProvider } from "@/lib/network-context"
import { ThemeProvider } from "@/lib/theme-provider"
import { PostHogProvider } from "@/lib/posthog-provider"
import { ProProvider } from "@/lib/pro-status-context"
import "./globals.css"
import { ClientLayout } from "./client-layout"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" })
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" })

export const metadata: Metadata = {
  title: "Atlas Protocol – Infra & Security Hub for Sui",
  description:
    "Atlas Protocol: The comprehensive Sui blockchain toolkit. Wallet Cleanup for secure asset management, Transaction Explainer for decoded transactions, and Infra Discovery for infrastructure services.",
  keywords: ["Sui", "blockchain", "dApp", "wallet", "transaction", "infrastructure", "RPC", "NFT", "token", "Atlas"],
  authors: [{ name: "Atlas Protocol" }],
  creator: "Atlas Protocol",
  publisher: "Atlas Protocol",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  category: "Technology",
  openGraph: {
    type: "website",
    url: "https://atlas-protocol.vercel.app",
    title: "Atlas Protocol - Sui dApp Tools",
    description:
      "Your comprehensive toolkit for blockchain infrastructure. Clean up wallets, decode transactions, and discover infrastructure services.",
    siteName: "Atlas Protocol",
    images: [
      {
        url: "https://atlas-protocol.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Atlas Protocol",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlas Protocol - Sui dApp Tools",
    description: "Wallet Cleanup, Transaction Explainer, and Infra Discovery for Sui blockchain.",
    images: ["https://atlas-protocol.vercel.app/og-image.png"],
    creator: "@AtlasProtocol",
  },
  alternates: {
    canonical: "https://atlas-protocol.vercel.app",
  },
  generator: "Next.js 16",
  applicationName: "Atlas Protocol",
  referrer: "strict-origin-when-cross-origin",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        url: "/favicon.ico",
        sizes: "32x32",
        type: "image/x-icon",
      },
    ],
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8faff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://atlas-protocol.vercel.app" />
        {/* DNS Prefetch for external APIs */}
        <link rel="dns-prefetch" href="https://api.blockberry.io" />
        <link rel="dns-prefetch" href="https://api.blockvision.io" />
        <link rel="dns-prefetch" href="https://fullnode.mainnet.sui.io" />
        {/* Initialize theme synchronously to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('atlas-theme') || 'dark'
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark')
                  document.documentElement.style.colorScheme = 'dark'
                } else {
                  document.documentElement.classList.remove('dark')
                  document.documentElement.style.colorScheme = 'light'
                }
              })()
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${outfit.variable} font-sans antialiased selection:bg-[#4d9fff] selection:text-white`}>
        {/* Clean background - no planetary rings */}
        <ProProvider>
          <NetworkProvider>
            <SuiProvider>
              <ThemeProvider>
                <PostHogProvider>
                  <ClientLayout>{children}</ClientLayout>
                </PostHogProvider>
              </ThemeProvider>
            </SuiProvider>
          </NetworkProvider>
        </ProProvider>
      </body>
    </html>
  )
}
