"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import type { FooterAd } from "@/lib/ads-data"
import { Lock, Trash2 } from "lucide-react"

interface AdManagementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdManagementModal({ open, onOpenChange }: AdManagementModalProps) {
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  const [ads, setAds] = useState<FooterAd[]>([])
  const [isLoadingAds, setIsLoadingAds] = useState(false)

  const [title, setTitle] = useState("")
  const [tagline, setTagline] = useState("")
  const [link, setLink] = useState("")
  const [ctaText, setCtaText] = useState("Learn More")
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-background/60 border border-[rgba(43,127,255,0.2)] text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#2B7FFF] text-sm transition-colors"

  const handlePasswordSubmit = async () => {
    setIsVerifying(true)
    setPasswordError("")
    try {
      const res = await fetch("/api/admin/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      })
      if (res.ok) {
        setIsAuthenticated(true)
        setPasswordInput("")
        fetchAds()
      } else {
        const data = await res.json()
        setPasswordError(data.error || "Incorrect password")
        setPasswordInput("")
      }
    } catch {
      setPasswordError("Verification failed. Please try again.")
      setPasswordInput("")
    } finally {
      setIsVerifying(false)
    }
  }

  const fetchAds = async () => {
    setIsLoadingAds(true)
    try {
      const res = await fetch("/api/ads?all=true")
      if (res.ok) {
        const data = await res.json()
        setAds(
          data.ads.map((ad: FooterAd) => ({
            id: ad.id,
            title: ad.title,
            tagline: ad.tagline,
            imageUrl: ad.imageUrl,
            linkUrl: ad.linkUrl,
            ctaText: ad.ctaText,
            active: ad.active,
            createdAt: new Date(ad.createdAt),
          }))
        )
      }
    } catch {
      toast({ title: "Error", description: "Failed to load ads", variant: "destructive" })
    } finally {
      setIsLoadingAds(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setIsAuthenticated(false)
      setPasswordInput("")
      setPasswordError("")
      setAds([])
    }
    onOpenChange(newOpen)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleAddAd = async () => {
    if (!title || !imagePreview) {
      toast({ title: "Error", description: "Title and banner image are required", variant: "destructive" })
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, tagline, image_url: imagePreview, link_url: link, cta_text: ctaText, active: true, position: ads.length }),
      })
      if (res.ok) {
        toast({ title: "Ad created", description: "New ad is now live" })
        setTitle(""); setTagline(""); setLink(""); setCtaText("Learn More"); setImagePreview("")
        await fetchAds()
      } else throw new Error("Failed to create ad")
    } catch {
      toast({ title: "Error", description: "Failed to create ad", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAd = async (adId: string) => {
    if (!confirm("Delete this ad?")) return
    try {
      const res = await fetch(`/api/ads/${adId}`, { method: "DELETE" })
      if (res.ok) {
        toast({ title: "Deleted", description: "Ad removed" })
        await fetchAds()
      } else throw new Error("Delete failed")
    } catch {
      toast({ title: "Error", description: "Failed to delete ad", variant: "destructive" })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden border border-[rgba(43,127,255,0.2)] bg-background/95 backdrop-blur-xl">
        <div className="p-6 space-y-5">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="icon-badge w-10 h-10">
                <Lock className="h-4 w-4 text-[#2B7FFF]" />
              </div>
              <div>
                <DialogTitle className="text-foreground">Manage Partner Ads</DialogTitle>
                <DialogDescription className="text-xs">Upload new banner ads (728x90 recommended)</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {!isAuthenticated ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Admin Password</label>
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setPasswordError("") }}
                  onKeyDown={(e) => { if (e.key === "Enter" && !isVerifying) handlePasswordSubmit() }}
                  disabled={isVerifying}
                  className={`${inputClass} ${passwordError ? "border-red-500/50" : ""}`}
                />
                {passwordError && <p className="text-xs text-red-400">{passwordError}</p>}
              </div>
              <div className="flex gap-2">
                <Button onClick={handlePasswordSubmit} disabled={isVerifying} className="flex-1 button-primary-modern">
                  {isVerifying ? "Verifying..." : "Unlock"}
                </Button>
                <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isVerifying} className="flex-1 bg-transparent border-[rgba(43,127,255,0.2)]">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Active ads */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-widest text-[#4d9fff]">Active Ads ({ads.length})</h4>
                <div className="max-h-32 overflow-y-auto space-y-1.5">
                  {isLoadingAds ? (
                    <p className="text-xs text-muted-foreground">Loading...</p>
                  ) : ads.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No ads yet</p>
                  ) : (
                    ads.map((ad) => (
                      <div key={ad.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-background/60 border border-[rgba(43,127,255,0.1)] text-sm">
                        <span className="truncate text-foreground text-xs">{ad.title}</span>
                        <button onClick={() => handleDeleteAd(ad.id)} className="text-red-400 hover:text-red-300 ml-2 shrink-0">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add new ad form */}
              <div className="space-y-3 pt-4 border-t border-[rgba(43,127,255,0.1)]">
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-widest text-[#4d9fff]">Add New Ad</h4>
                {[
                  { label: "Title *", placeholder: "e.g., Partner with Atlas", value: title, setter: setTitle, type: "text" },
                  { label: "Tagline", placeholder: "Brief description", value: tagline, setter: setTagline, type: "text" },
                  { label: "Link URL", placeholder: "https://example.com", value: link, setter: setLink, type: "url" },
                  { label: "CTA Button Text", placeholder: "Learn More", value: ctaText, setter: setCtaText, type: "text" },
                ].map((f) => (
                  <div key={f.label} className="space-y-1">
                    <label className="text-xs font-medium text-foreground">{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={f.value}
                      onChange={(e) => f.setter(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                ))}

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Banner Image * (728x90)</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-xs text-muted-foreground" />
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-full max-h-20 object-cover rounded-xl border border-[rgba(43,127,255,0.1)]" />
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <Button onClick={handleAddAd} disabled={isSubmitting} className="flex-1 button-primary-modern">
                    {isSubmitting ? "Adding..." : "Add Ad"}
                  </Button>
                  <Button variant="outline" onClick={() => handleOpenChange(false)} className="flex-1 bg-transparent border-[rgba(43,127,255,0.2)]">
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
