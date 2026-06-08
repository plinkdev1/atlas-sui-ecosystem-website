"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useRpcStore } from "@/lib/rpc-store"
import { AlertCircle, CheckCircle2, Loader2, Server, ArrowLeft, Info } from "lucide-react"
import Link from "next/link"
import { RevealSection } from "@/components/reveal-section"

export default function RPCSettingsPage() {
  const { customRpc, isUsingCustomRpc, setCustomRpc, setIsUsingCustomRpc, testRpcConnectivity } = useRpcStore()
  const { toast } = useToast()
  const [rpcUrl, setRpcUrl] = useState(customRpc || "")
  const [testing, setTesting] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const validateRpcUrl = (url: string): boolean => {
    try {
      new URL(url)
      return url.startsWith("http://") || url.startsWith("https://")
    } catch {
      return false
    }
  }

  const handleTestRpc = async () => {
    if (!validateRpcUrl(rpcUrl)) {
      toast({ title: "Invalid RPC URL", description: "Please enter a valid HTTP(S) URL", variant: "destructive" })
      return
    }
    setTesting(true)
    try {
      const isConnected = await testRpcConnectivity(rpcUrl)
      if (isConnected) {
        toast({ title: "Connection Successful", description: "Custom RPC endpoint is responding" })
        setIsValid(true)
      } else {
        toast({ title: "Connection Failed", description: "Unable to connect to the RPC endpoint", variant: "destructive" })
        setIsValid(false)
      }
    } catch {
      toast({ title: "Test Failed", description: "Error testing RPC connectivity", variant: "destructive" })
      setIsValid(false)
    } finally {
      setTesting(false)
    }
  }

  const handleSave = () => {
    if (!validateRpcUrl(rpcUrl)) {
      toast({ title: "Invalid RPC URL", description: "Please enter a valid HTTP(S) URL", variant: "destructive" })
      return
    }
    setCustomRpc(rpcUrl)
    setIsUsingCustomRpc(true)
    toast({ title: "RPC Saved", description: "Custom RPC endpoint is now active" })
  }

  const handleReset = () => {
    setCustomRpc(null)
    setIsUsingCustomRpc(false)
    setRpcUrl("")
    setIsValid(false)
    toast({ title: "RPC Reset", description: "Using default Sui RPC endpoints" })
  }

  if (!mounted) {
    return (
      <main className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </main>
    )
  }

  return (
    <main className="bg-background min-h-screen">
      {/* Hero */}
      <section className="section-gradient-blue container-modern relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <RevealSection>
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Settings
            </Link>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Advanced</p>
            <h1 className="heading-hero">RPC Configuration</h1>
            <p className="text-subtitle max-w-xl">
              Override the default Sui RPC endpoint with your own full node or private provider.
            </p>
          </RevealSection>
        </div>
      </section>

      <section className="section-default container-modern max-w-2xl">
        <RevealSection delay={100}>
          <div className="space-y-6">
            {/* Status badge */}
            {isUsingCustomRpc && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#00d4aa]/10 border border-[#00d4aa]/25 text-sm text-[#00d4aa]">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                Custom RPC is currently active: <span className="font-mono text-xs ml-1 truncate">{customRpc}</span>
              </div>
            )}

            {/* Config card */}
            <div className="card-modern p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="icon-badge">
                  <Server className="h-5 w-5 text-[#2B7FFF]" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Custom RPC Endpoint</h2>
                  <p className="text-sm text-muted-foreground">Override the default Sui mainnet RPC</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">RPC URL</label>
                <Input
                  type="url"
                  placeholder="https://fullnode.mainnet.sui.io"
                  value={rpcUrl}
                  onChange={(e) => { setRpcUrl(e.target.value); setIsValid(false) }}
                  className="bg-background/60 border-[rgba(43,127,255,0.2)] focus:border-[#2B7FFF]"
                />
                <p className="text-xs text-muted-foreground">
                  Must be a valid HTTPS URL pointing to a Sui RPC full node.
                </p>
              </div>

              {/* Test status */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleTestRpc}
                  disabled={testing || !rpcUrl}
                  variant="outline"
                  className="bg-transparent border-[rgba(43,127,255,0.25)] hover:border-[#2B7FFF]"
                >
                  {testing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  {testing ? "Testing..." : "Test Connection"}
                </Button>
                {isValid && (
                  <span className="flex items-center gap-1.5 text-sm text-[#00d4aa]">
                    <CheckCircle2 className="h-4 w-4" /> Connected
                  </span>
                )}
                {rpcUrl && !isValid && !testing && (
                  <span className="flex items-center gap-1.5 text-sm text-yellow-500">
                    <AlertCircle className="h-4 w-4" /> Not tested
                  </span>
                )}
              </div>

              <div className="pt-2 border-t border-[rgba(43,127,255,0.1)] space-y-3">
                <Button onClick={handleSave} disabled={!isValid} className="w-full button-primary-modern">
                  Save Custom RPC
                </Button>
                {isUsingCustomRpc && (
                  <Button onClick={handleReset} variant="outline" className="w-full bg-transparent border-[rgba(43,127,255,0.25)]">
                    Reset to Default RPC
                  </Button>
                )}
              </div>
            </div>

            {/* Info card */}
            <div className="card-modern p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#2B7FFF]">
                <Info className="h-4 w-4" />
                <span className="font-semibold text-sm">About RPC Endpoints</span>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><span className="text-[#2B7FFF]">→</span>An RPC endpoint connects Atlas to the Sui blockchain</li>
                <li className="flex gap-2"><span className="text-[#2B7FFF]">→</span>Custom RPC is useful for private nodes or dedicated providers</li>
                <li className="flex gap-2"><span className="text-[#2B7FFF]">→</span>Default endpoints are provided by the official Sui Foundation</li>
                <li className="flex gap-2"><span className="text-[#2B7FFF]">→</span>Configuration is stored locally — other devices use defaults</li>
              </ul>
            </div>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
