"use client"

import { RevealSection } from "@/components/reveal-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { getAdminAuthFromStorage, setAdminAuthToStorage, validateAdminCredentialsViaAPI } from "@/lib/admin-auth"
import type { AdvertisingPartner } from "@/types/advertising"
import { ArrowLeft, Edit2, GripVertical, Megaphone, Plus, Shield, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function AdvertisingPartnersPage() {
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [partners, setPartners] = useState<AdvertisingPartner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = partners.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tagline?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    const authenticated = getAdminAuthFromStorage()
    if (authenticated) {
      setIsAuthenticated(true)
    } else {
      setShowLoginForm(true)
    }
  }, [])

  const fetchPartners = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/advertising", { headers: { "Cache-Control": "no-store" } })
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setPartners(Array.isArray(data) ? data.sort((a: AdvertisingPartner, b: AdvertisingPartner) => a.slot_position - b.slot_position) : [])
    } catch (error) {
      console.error("[v0] Error:", error)
      toast({ title: "Error", description: "Failed to fetch partners", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchPartners()
    }
  }, [isAuthenticated])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return
    try {
      const res = await fetch(`/api/advertising/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      setPartners(partners.filter((p) => p.id !== id))
      toast({ title: "Deleted", description: "Partner removed" })
    } catch {
      toast({ title: "Error", description: "Failed to delete partner", variant: "destructive" })
    }
  }

  const handleToggleActive = async (partner: AdvertisingPartner) => {
    try {
      const res = await fetch(`/api/advertising/${partner.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !partner.active }),
      })
      if (!res.ok) throw new Error("Failed to update")
      const updated = await res.json()
      setPartners(partners.map((p) => (p.id === partner.id ? updated : p)))
      toast({ title: "Updated", description: `Partner ${updated.active ? "activated" : "deactivated"}` })
    } catch {
      toast({ title: "Error", description: "Failed to update partner", variant: "destructive" })
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setIsLoggingIn(true)
    try {
      const valid = await validateAdminCredentialsViaAPI(username, password)
      if (valid) {
        setAdminAuthToStorage(true)
        setIsAuthenticated(true)
        setShowLoginForm(false)
        setUsername("")
        setPassword("")
      } else {
        setLoginError("Invalid credentials. Please try again.")
      }
    } catch {
      setLoginError("Login failed. Please try again.")
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Login gate
  if (!isAuthenticated || showLoginForm) {
    return (
      <main className="bg-background min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
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
                <h1 className="heading-section !text-xl">Admin Login</h1>
                <p className="text-xs text-muted-foreground">Advertising Partners</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  disabled={isLoggingIn}
                  className="w-full bg-white/5 border-[rgba(43,127,255,0.2)] rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/30 border transition-colors text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoggingIn}
                  className="w-full bg-white/5 border-[rgba(43,127,255,0.2)] rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/30 border transition-colors text-sm"
                />
              </div>

              {loginError && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">{loginError}</div>}

              <Button
                type="submit"
                disabled={isLoggingIn}
                className="button-primary-modern w-full"
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  // Dashboard content (authenticated)
  return (
    <main className="bg-background min-h-screen">
      {/* Hero */}
      <section className="section-gradient-blue container-modern relative overflow-hidden py-8">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <RevealSection>
            <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Admin
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-badge">
                <Megaphone className="h-5 w-5 text-[#2B7FFF]" />
              </div>
              <div>
                <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Admin</p>
                <h1 className="heading-hero !text-2xl md:!text-3xl">Advertising Partners</h1>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">Manage partner ad slots and carousel positioning</p>
          </RevealSection>
        </div>
      </section>

      <section className="section-default container-modern max-w-6xl space-y-6">
        <RevealSection delay={80}>
          {/* Search + Add */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Search partners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-background/60 border-[rgba(43,127,255,0.2)] focus:border-[#2B7FFF]"
            />
            <Button className="button-primary-modern gap-2">
              <Plus className="h-4 w-4" /> Add Partner
            </Button>
          </div>
        </RevealSection>

        <RevealSection delay={120}>
          <div className="card-modern overflow-hidden">
            <div className="px-6 py-4 border-b border-[rgba(43,127,255,0.1)] flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Active Partners ({filtered.length})</h2>
              <p className="text-xs text-muted-foreground">Drag to reorder · click status to toggle</p>
            </div>

            {loading ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-background/40 border-b border-[rgba(43,127,255,0.08)]">
                      <th className="w-8 px-4 py-3"></th>
                      {["Partner", "Tagline", "Slot", "Status", "Actions"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#4d9fff] uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((partner) => (
                      <tr key={partner.id} className="border-b border-[rgba(43,127,255,0.06)] hover:bg-[rgba(43,127,255,0.04)] transition-colors">
                        <td className="px-4 py-3 cursor-grab">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">{partner.name}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{partner.tagline}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">#{partner.slot_position}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleActive(partner)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${partner.active
                                ? "bg-[#00d4aa]/10 text-[#00d4aa] border-[#00d4aa]/25"
                                : "bg-muted/50 text-muted-foreground border-border"
                              }`}
                          >
                            {partner.active ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-[rgba(43,127,255,0.1)]">
                              <Edit2 className="h-3.5 w-3.5 text-[#4d9fff]" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-red-500/10"
                              onClick={() => handleDelete(partner.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-400" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground text-sm">
                          No partners found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
