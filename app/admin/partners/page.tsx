"use client"

import { RevealSection } from "@/components/reveal-section"
import { getAdminAuthFromStorage, isDevMode, setAdminAuthToStorage, validateAdminCredentialsViaAPI } from "@/lib/admin-auth"
import { PARTNERS } from "@/lib/partners-data"
import { ArrowLeft, ChevronDown, Copy, Lock, LogOut, Plus, Shield, Trash2, Users } from "lucide-react"
import Link from "next/link"
import type React from "react"
import { useEffect, useState } from "react"

export default function PartnersAdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [setupRequired, setSetupRequired] = useState(false)
  const [localPartners, setLocalPartners] = useState(PARTNERS)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  useEffect(() => {
    if (isDevMode()) { setIsAdmin(true); return }
    const auth = getAdminAuthFromStorage()
    setIsAdmin(auth)
    if (!auth) setShowLoginForm(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setSetupRequired(false)
    setIsLoggingIn(true)
    try {
      const valid = await validateAdminCredentialsViaAPI(username, password)
      if (valid) {
        setAdminAuthToStorage(true)
        setIsAdmin(true)
        setShowLoginForm(false)
        setUsername(""); setPassword("")
      } else {
        setLoginError("Invalid credentials. Please try again.")
      }
    } catch (error: any) {
      if (error.message?.includes("Admin password not configured")) {
        setSetupRequired(true)
      } else {
        setLoginError("Login failed. Please try again.")
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = () => {
    setAdminAuthToStorage(false)
    setIsAdmin(false)
    setShowLoginForm(true)
    setUsername(""); setPassword("")
  }

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(localPartners, null, 2))
    alert("Partners JSON copied to clipboard!")
  }

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(localPartners, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "partners-data.json"; a.click()
  }

  // Setup required (password not configured)
  if (setupRequired) {
    return (
      <main className="bg-background min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="card-modern p-10 w-full max-w-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="icon-badge">
                <Lock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">Setup Required</h1>
                <p className="text-xs text-muted-foreground">Admin access not configured</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">The admin password has not been configured. To enable admin access, set the environment variable in your Vercel project:</p>

              <div className="bg-black/60 rounded-xl p-4 border border-[rgba(43,127,255,0.1)]">
                <code className="text-xs text-[#00d4aa] font-mono break-all">ADMIN_PASSWORD=your-secure-password</code>
              </div>

              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Go to your Vercel project settings</li>
                <li>Navigate to Environment Variables</li>
                <li>Add <code className="text-xs bg-background/60 px-2 py-1 rounded text-[#2B7FFF]">ADMIN_PASSWORD</code></li>
                <li>Deploy your changes</li>
                <li>Refresh this page</li>
              </ol>

              <button
                onClick={() => { setSetupRequired(false); setShowLoginForm(true) }}
                className="w-full px-4 py-3 rounded-xl bg-[#2B7FFF]/10 border border-[#2B7FFF]/25 text-[#2B7FFF] text-sm hover:bg-[#2B7FFF]/20 transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Login gate
  if (!isAdmin || showLoginForm) {
    return (
      <main className="bg-background min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl p-8 max-w-md mx-auto space-y-6 w-full">
            <div className="flex items-center gap-3">
              <div className="icon-badge">
                <Shield className="h-5 w-5 text-[#2B7FFF]" />
              </div>
              <div>
                <h1 className="heading-section !text-xl">Admin Access</h1>
                <p className="text-xs text-muted-foreground">Partners management</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {["username", "password"].map((field) => (
                <div key={field} className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground capitalize">{field}</label>
                  <input
                    type={field === "password" ? "password" : "text"}
                    value={field === "username" ? username : password}
                    onChange={(e) => field === "username" ? setUsername(e.target.value) : setPassword(e.target.value)}
                    placeholder={`Enter ${field}`}
                    className="w-full bg-white/5 border-[rgba(43,127,255,0.2)] rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/30 border transition-colors text-sm"
                  />
                </div>
              ))}

              {loginError && (
                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">{loginError}</div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="button-primary-modern w-full"
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="px-4 py-3 rounded-xl bg-[#2B7FFF]/08 border border-[#2B7FFF]/20 text-xs text-muted-foreground">
              Default: admin / admin123 — in dev mode, no login required
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-background min-h-screen">
      {/* Hero */}
      <section className="section-gradient-blue container-modern relative overflow-hidden py-8">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <RevealSection>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-badge">
                <Users className="h-5 w-5 text-[#2B7FFF]" />
              </div>
              <div>
                <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Admin</p>
                <h1 className="heading-hero !text-2xl md:!text-3xl">Partners Admin</h1>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">Manage ecosystem partners and advertising placements</p>
          </RevealSection>
          <button
            onClick={handleLogout}
            className="shrink-0 mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </section>

      <section className="section-default container-modern max-w-7xl space-y-8">
        <RevealSection delay={80}>
          {/* Quick actions */}
          <div className="flex gap-3 flex-wrap">
            <button onClick={handleCopyJSON} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2B7FFF]/10 border border-[#2B7FFF]/25 text-[#4d9fff] text-sm hover:bg-[#2B7FFF]/20 transition-colors">
              <Copy className="h-4 w-4" /> Copy JSON
            </button>
            <button onClick={handleExportJSON} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00d4aa]/10 border border-[#00d4aa]/25 text-[#00d4aa] text-sm hover:bg-[#00d4aa]/20 transition-colors">
              <ChevronDown className="h-4 w-4" /> Export JSON
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background/60 border border-[rgba(43,127,255,0.2)] text-foreground text-sm hover:border-[#2B7FFF] transition-colors">
              <Plus className="h-4 w-4" /> Add Partner
            </button>
          </div>
        </RevealSection>

        {/* JSON preview */}
        <RevealSection delay={120}>
          <div className="card-modern p-6 space-y-3">
            <h2 className="font-semibold text-foreground">Partners Data (Read-Only Preview)</h2>
            <div className="bg-black/60 rounded-xl p-4 overflow-x-auto max-h-64 overflow-y-auto border border-[rgba(43,127,255,0.1)]">
              <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap break-words">
                {JSON.stringify(localPartners, null, 2)}
              </pre>
            </div>
          </div>
        </RevealSection>

        {/* Partners table */}
        <RevealSection delay={160}>
          <div className="card-modern overflow-hidden">
            <div className="px-6 py-4 border-b border-[rgba(43,127,255,0.1)]">
              <h2 className="font-semibold text-foreground">Partners Table ({localPartners.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-background/40 border-b border-[rgba(43,127,255,0.08)]">
                    {["Partner", "Website", "Chains", "Badge", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#4d9fff] uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {localPartners.map((partner) => (
                    <tr key={partner.id} className="border-b border-[rgba(43,127,255,0.06)] hover:bg-[rgba(43,127,255,0.04)] transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground text-sm">{partner.name}</div>
                        <div className="text-xs text-muted-foreground">{partner.tagline}</div>
                      </td>
                      <td className="px-4 py-3">
                        <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-[#2B7FFF] hover:text-[#00d4aa] text-xs transition-colors">
                          {partner.website.replace("https://", "")}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {partner.chains.map((chain) => (
                            <span key={chain} className="px-2 py-0.5 rounded-full text-xs bg-[#2B7FFF]/10 text-[#4d9fff] border border-[#2B7FFF]/20">{chain}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {partner.badge && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/25">{partner.badge}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-red-400 hover:text-red-300 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </RevealSection>

        {/* Notes */}
        <RevealSection delay={200}>
          <div className="card-modern p-6 space-y-2">
            <h3 className="font-semibold text-foreground text-sm">Admin Notes</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-[#00d4aa]">→</span>Authentication required in production; dev mode auto-authenticates</li>
              <li className="flex gap-2"><span className="text-[#00d4aa]">→</span>Currently loads hardcoded data from lib/partners-data.ts</li>
              <li className="flex gap-2"><span className="text-[#00d4aa]">→</span>Copy JSON to integrate with backend / database</li>
              <li className="flex gap-2"><span className="text-[#00d4aa]">→</span>Future: Replace with dynamic admin interface + database persistence</li>
            </ul>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
