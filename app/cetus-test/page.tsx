"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

declare global {
  interface Window {
    CetusSwap?: {
      init: (config: {
        containerId: string
        displayMode: "Integrated" | "Modal" | "Widget"
        independentWallet?: boolean
        themeType?: "Dark" | "Light"
        theme?: Record<string, string>
      }) => void
    }
  }
}

export default function CetusTestPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load Cetus Terminal styles
    const styleLink = document.createElement("link")
    styleLink.rel = "stylesheet"
    styleLink.href = "https://archive.cetus.zone/assets/terminal/style.css"
    document.head.appendChild(styleLink)

    // Load Cetus Terminal script
    const script = document.createElement("script")
    script.src = "https://archive.cetus.zone/assets/terminal/main.js"
    script.async = true
    script.onload = () => {
      console.log("[v0] Cetus Terminal script loaded")
      // Initialize Cetus Terminal
      if (window.CetusSwap) {
        try {
          window.CetusSwap.init({
            containerId: "cetus-terminal-container",
            displayMode: "Integrated",
            independentWallet: true,
            themeType: "Dark",
          })
          console.log("[v0] Cetus Terminal initialized successfully")
          setIsLoaded(true)
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : "Unknown error"
          console.error("[v0] Cetus Terminal init error:", err)
          setError(`Initialization failed: ${errorMsg}`)
        }
      } else {
        console.error("[v0] CetusSwap not found on window")
        setError("CetusSwap library not available")
      }
    }
    script.onerror = () => {
      console.error("[v0] Failed to load Cetus Terminal script")
      setError("Failed to load Cetus Terminal script")
    }
    document.body.appendChild(script)

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      if (styleLink.parentNode) {
        styleLink.parentNode.removeChild(styleLink)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/hub">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Hub
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Cetus Terminal Test</h1>
            <p className="mt-2 text-muted-foreground">Testing Cetus Terminal integration in Integrated display mode</p>
          </div>

          {error && (
            <Card className="border-destructive bg-destructive/10">
              <CardHeader>
                <CardTitle className="text-destructive">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Cetus Terminal Embedded</CardTitle>
              <CardDescription>
                {isLoaded
                  ? "Terminal loaded successfully - You can interact with it below"
                  : "Loading Cetus Terminal..."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                id="cetus-terminal-container"
                className="rounded-lg border border-border bg-card p-4"
                style={{ minHeight: "500px" }}
              />
              {!isLoaded && !error && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                    <p className="text-sm text-muted-foreground">Initializing Cetus Terminal...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-base">Test Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Script loaded:</span>
                <span className={isLoaded ? "text-green-500 font-semibold" : "text-yellow-500"}>
                  {isLoaded ? "✓ Yes" : "Loading..."}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Display mode:</span>
                <span>Integrated</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Independent wallet:</span>
                <span>Enabled</span>
              </div>
              {error && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="text-destructive font-semibold">Error</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
