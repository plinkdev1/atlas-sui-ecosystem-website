"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Mail, Loader2, Wallet } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { ZKLoginAuth } from "@/components/zklogin-auth"
import { PasskeyAuth } from "@/components/passkey-auth"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) throw error
      setSubmitted(true)
      toast({ title: "Check your email", description: "A magic link has been sent to sign in securely" })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign in",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen section-gradient-blue flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
      <div className="container mx-auto px-4 py-4 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa] mb-2">Welcome</p>
            <h1 className="heading-section">Sign in to Atlas</h1>
            <p className="text-subtitle mt-2">Sign in to access your account</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-[rgba(43,127,255,0.15)]">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground">Choose Authentication Method</h2>
              <p className="text-sm text-muted-foreground">Sign in using your preferred method</p>
            </div>

            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6 bg-background/40 border border-[rgba(43,127,255,0.1)]">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="zklogin">ZKLogin</TabsTrigger>
                <TabsTrigger value="passkey">Passkey</TabsTrigger>
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                {submitted ? (
                  <div className="text-center space-y-4 py-8">
                    <Mail className="h-12 w-12 text-primary mx-auto" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Check your email</h3>
                      <p className="text-sm text-muted-foreground">
                        We sent a magic link to <strong>{email}</strong>
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">Click the link to sign in. Expires in 24 hours.</p>
                    <Button variant="outline" onClick={() => setSubmitted(false)} className="w-full bg-transparent">
                      Try another email
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        className="bg-background/50 border-border/40"
                        required
                      />
                    </div>
                    <Button type="submit" disabled={loading || !email} className="w-full button-primary-modern">
                      {loading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending link...</>
                      ) : (
                        <><Mail className="mr-2 h-4 w-4" />Send Magic Link</>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border/40">
                      We'll link your wallet to this account after you sign in
                    </p>
                  </form>
                )}
              </TabsContent>

              <TabsContent value="zklogin">
                <ZKLoginAuth />
              </TabsContent>

              <TabsContent value="passkey">
                <PasskeyAuth />
              </TabsContent>

              <TabsContent value="wallet">
                <div className="space-y-4">
                  <Button
                    onClick={() => (window.location.href = "/")}
                    className="w-full button-primary-modern"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Connect your Sui wallet (Sui Wallet, Ethos, OKX, etc.) from the homepage.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-[rgba(43,127,255,0.15)]">
            <p className="font-medium text-foreground text-sm mb-2">Why authenticate?</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>✓ Sync your preferences across devices</li>
              <li>✓ Link your wallet securely</li>
              <li>✓ Persist hidden items and votes</li>
              <li>✓ Backup your data</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
