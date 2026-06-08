"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Save, X, Edit, Trash2, Plus, LayoutDashboard, BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSupabaseUser } from "@/hooks/use-supabase-user"
import { ProviderAnalytics } from "@/components/provider-analytics"
import { RevealSection } from "@/components/reveal-section"

const FEATURE_OPTIONS = [
  "Staking", "NFT Support", "DeFi Integration", "24/7 Support",
  "API Access", "Custom RPC", "Load Balancing", "Backup Nodes",
]

interface Provider {
  id: string
  name: string
  description: string
  pricing: string
  features: string[]
  website: string
  logo: string
  category?: string
}

export default function ProviderDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading } = useSupabaseUser()

  const [providers, setProviders] = useState<Provider[]>([])
  const [isLoadingProviders, setIsLoadingProviders] = useState(true)
  const [isEditingId, setIsEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<Partial<Provider>>({ name: "", description: "", pricing: "", features: [], website: "", logo: "" })
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth")
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) fetchProviders()
  }, [user])

  const fetchProviders = async () => {
    try {
      setIsLoadingProviders(true)
      const res = await fetch("/api/providers")
      if (!res.ok) throw new Error("Failed to fetch providers")
      setProviders(await res.json())
    } catch (error) {
      toast({ title: "Error", description: "Failed to load providers", variant: "destructive" })
    } finally {
      setIsLoadingProviders(false)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) => prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature])
  }

  const handleSave = async () => {
    if (!formData.name || !formData.description) {
      toast({ title: "Error", description: "Name and description are required", variant: "destructive" })
      return
    }
    setIsSaving(true)
    try {
      const payload = { ...formData, features: selectedFeatures }
      if (isEditingId) {
        const res = await fetch(`/api/providers/${isEditingId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        if (!res.ok) throw new Error("Failed to update")
        toast({ title: "Updated", description: "Provider updated successfully" })
      } else {
        const res = await fetch("/api/providers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        if (!res.ok) throw new Error("Failed to create")
        toast({ title: "Created", description: "Provider created successfully" })
      }
      setFormData({ name: "", description: "", pricing: "", features: [], website: "", logo: "" })
      setSelectedFeatures([]); setIsEditingId(null); setIsCreating(false)
      fetchProviders()
    } catch (error: unknown) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Save failed", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (p: Provider) => { setFormData(p); setSelectedFeatures(p.features); setIsEditingId(p.id); setIsCreating(false) }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this provider?")) return
    try {
      const res = await fetch(`/api/providers/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")
      toast({ title: "Deleted", description: "Provider removed" })
      fetchProviders()
    } catch (error: unknown) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Delete failed", variant: "destructive" })
    }
  }

  const handleCancel = () => { setFormData({ name: "", description: "", pricing: "", features: [], website: "", logo: "" }); setSelectedFeatures([]); setIsEditingId(null); setIsCreating(false) }

  if (isLoading) {
    return (
      <main className="bg-background min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </main>
    )
  }

  return (
    <main className="bg-background min-h-screen">
      {/* Hero */}
      <section className="section-gradient-blue container-modern relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="relative z-10 flex items-start justify-between">
          <RevealSection>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Dashboard</p>
            <h1 className="heading-hero">Provider Dashboard</h1>
            <p className="text-subtitle max-w-xl">Manage listings, track performance, and update your service details.</p>
          </RevealSection>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/")}
            className="shrink-0 mt-2 bg-transparent border-[rgba(43,127,255,0.25)] hover:border-[#2B7FFF] flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Exit</span>
          </Button>
        </div>
      </section>

      <section className="section-default container-modern">
        <RevealSection delay={100}>
          <Tabs defaultValue="listings" className="space-y-6">
            <TabsList className="bg-card/60 border border-[rgba(43,127,255,0.12)]">
              <TabsTrigger value="listings" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" /> Listings
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics">
              <ProviderAnalytics providerId={user?.id || ""} />
            </TabsContent>

            <TabsContent value="listings">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Form sidebar */}
                <div className="md:col-span-1">
                  <div className="card-modern p-6 sticky top-8 space-y-4">
                    <div>
                      <h2 className="font-semibold text-foreground">
                        {isEditingId ? "Edit Provider" : isCreating ? "Create Provider" : "Listings"}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {isEditingId ? "Update details" : "Add a new service"}
                      </p>
                    </div>

                    {!isCreating && !isEditingId && (
                      <Button onClick={() => setIsCreating(true)} className="w-full button-primary-modern gap-2">
                        <Plus className="h-4 w-4" /> Create Provider
                      </Button>
                    )}

                    {(isCreating || isEditingId) && (
                      <>
                        {(["name", "description", "pricing", "website", "logo"] as const).map((field) => (
                          <div key={field} className="space-y-1.5">
                            <label className="text-xs font-medium text-foreground capitalize">{field}{field === "name" || field === "description" ? " *" : ""}</label>
                            {field === "description" ? (
                              <textarea
                                name={field}
                                value={(formData as Record<string, string>)[field] || ""}
                                onChange={handleFormChange}
                                placeholder={`Enter ${field}`}
                                rows={3}
                                className="w-full px-3 py-2 rounded-xl bg-background/60 border border-[rgba(43,127,255,0.2)] text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#2B7FFF] text-sm resize-none transition-colors"
                              />
                            ) : (
                              <Input
                                name={field}
                                type={field === "website" || field === "logo" ? "url" : "text"}
                                value={(formData as Record<string, string>)[field] || ""}
                                onChange={handleFormChange}
                                placeholder={field === "pricing" ? "e.g. Pro – $499/mo" : field === "website" ? "https://..." : `Enter ${field}`}
                                className="bg-background/60 border-[rgba(43,127,255,0.2)] focus:border-[#2B7FFF]"
                              />
                            )}
                          </div>
                        ))}

                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground">Features</label>
                          <div className="flex flex-wrap gap-1.5">
                            {FEATURE_OPTIONS.map((f) => (
                              <button
                                key={f}
                                onClick={() => toggleFeature(f)}
                                className={`px-2.5 py-1 rounded-lg text-xs border transition-all ${
                                  selectedFeatures.includes(f)
                                    ? "bg-[#2B7FFF] text-white border-[#2B7FFF]"
                                    : "bg-background/60 text-foreground border-[rgba(43,127,255,0.2)]"
                                }`}
                              >
                                {f}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" onClick={handleCancel} className="flex-1 bg-transparent border-[rgba(43,127,255,0.2)]">
                            <X className="h-4 w-4 mr-1" /> Cancel
                          </Button>
                          <Button onClick={handleSave} disabled={isSaving} className="flex-1 button-primary-modern">
                            <Save className="h-4 w-4 mr-1" />
                            {isSaving ? "Saving..." : "Save"}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Listings */}
                <div className="md:col-span-2 space-y-4">
                  {isLoadingProviders ? (
                    <div className="card-modern p-8 text-center text-muted-foreground text-sm">Loading providers...</div>
                  ) : providers.length === 0 ? (
                    <div className="card-modern p-8 text-center text-muted-foreground text-sm">No providers yet. Create one to get started.</div>
                  ) : (
                    providers.map((p) => (
                      <div key={p.id} className="card-modern p-6 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground">{p.name}</h3>
                            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{p.description}</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(p)} className="border-[rgba(43,127,255,0.25)] bg-transparent h-8 w-8 p-0">
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete(p.id)} className="border-red-500/25 hover:bg-red-500/10 bg-transparent h-8 w-8 p-0">
                              <Trash2 className="h-3.5 w-3.5 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        {p.pricing && <p className="text-xs text-muted-foreground">Pricing: <span className="text-foreground">{p.pricing}</span></p>}
                        {p.features.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {p.features.map((f) => (
                              <span key={f} className="px-2 py-0.5 rounded-full text-xs bg-[#2B7FFF]/10 text-[#4d9fff] border border-[#2B7FFF]/20">{f}</span>
                            ))}
                          </div>
                        )}
                        {p.website && (
                          <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[#2B7FFF] hover:text-[#00d4aa] transition-colors">
                            Visit Website →
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </RevealSection>
      </section>
    </main>
  )
}
