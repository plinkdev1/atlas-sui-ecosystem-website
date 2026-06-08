"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, XCircle, Star, Trash2, Search, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Provider {
  id: string
  name: string
  category: "RPC" | "Gateway" | "Indexing" | "Validator"
  verified: boolean
  status: "pending" | "approved" | "rejected"
  featured: boolean
}

export function AdminModerationDashboard() {
  const { toast } = useToast()
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")

  useEffect(() => {
    fetchAllProviders()
  }, [])

  const fetchAllProviders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/providers")
      if (!response.ok) throw new Error("Failed to fetch providers")
      const data = await response.json()
      setProviders(data || [])
    } catch (error) {
      console.error("[v0] Failed to fetch providers:", error)
      toast({ title: "Error", description: "Failed to fetch providers", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/providers/${id}/moderate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      })
      if (!response.ok) throw new Error("Failed to approve")

      setProviders(providers.map((p) => (p.id === id ? { ...p, status: "approved" as const } : p)))
      toast({ title: "Approved", description: "Provider approved successfully" })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error approving provider"
      toast({ title: "Error", description: message, variant: "destructive" })
    }
  }

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/providers/${id}/moderate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      })
      if (!response.ok) throw new Error("Failed to reject")

      setProviders(providers.map((p) => (p.id === id ? { ...p, status: "rejected" as const } : p)))
      toast({ title: "Rejected", description: "Provider rejected successfully", variant: "destructive" })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error rejecting provider"
      toast({ title: "Error", description: message, variant: "destructive" })
    }
  }

  const handleFeature = async (id: string) => {
    try {
      const provider = providers.find((p) => p.id === id)
      const response = await fetch(`/api/admin/providers/${id}/moderate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !provider?.featured }),
      })
      if (!response.ok) throw new Error("Failed to update featured status")

      const updated = await response.json()
      setProviders(providers.map((p) => (p.id === id ? updated : p)))
      toast({ title: updated.featured ? "Featured" : "Unfeatured", description: "Provider status updated" })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error updating featured status"
      toast({ title: "Error", description: message, variant: "destructive" })
    }
  }

  const handleRemove = async (id: string) => {
    try {
      const response = await fetch(`/api/providers/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to remove")

      setProviders(providers.filter((p) => p.id !== id))
      toast({ title: "Removed", description: "Provider removed from registry", variant: "destructive" })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error removing provider"
      toast({ title: "Error", description: message, variant: "destructive" })
    }
  }

  // Filter providers
  const filtered = providers.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: providers.length,
    pending: providers.filter((p) => p.status === "pending").length,
    approved: providers.filter((p) => p.status === "approved").length,
    rejected: providers.filter((p) => p.status === "rejected").length,
    featured: providers.filter((p) => p.featured).length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8 flex items-center justify-center">
        <div className="text-muted-foreground">Loading providers...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Admin Moderation</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <p>Admin panel – mock mode for demo</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-border/40 bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total Providers</p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/80 backdrop-blur-sm border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/80 backdrop-blur-sm border-green-500/20 bg-green-500/5">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/80 backdrop-blur-sm border-red-500/20 bg-red-500/5">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/80 backdrop-blur-sm border-blue-500/20 bg-blue-500/5">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.featured}</div>
              <p className="text-xs text-muted-foreground">Featured</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 border-border/40"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v: string) => setStatusFilter(v as "all" | "pending" | "approved" | "rejected")}>
            <SelectTrigger className="w-full sm:w-48 bg-background/50 border-border/40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card className="border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden">
          <CardHeader>
            <CardTitle>Providers Registry</CardTitle>
            <CardDescription>
              Showing {filtered.length} of {providers.length} providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((provider) => (
                    <TableRow key={provider.id} className="border-border/40 hover:bg-primary/5">
                      <TableCell className="font-medium">{provider.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-background/50 border-border/40">
                          {provider.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            provider.status === "approved"
                              ? "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30"
                              : provider.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30"
                                : "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30"
                          }
                          variant="outline"
                        >
                          {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {provider.featured && (
                          <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30 border">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            Featured
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          {provider.status !== "approved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(provider.id)}
                              className="bg-green-500/10 border-green-500/30 hover:bg-green-500/20"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                          {provider.status !== "rejected" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(provider.id)}
                              className="bg-red-500/10 border-red-500/30 hover:bg-red-500/20"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFeature(provider.id)}
                            className={
                              provider.featured
                                ? "bg-blue-500/20 border-blue-500/50"
                                : "bg-background/50 border-border/40"
                            }
                          >
                            <Star className="h-4 w-4" fill={provider.featured ? "currentColor" : "none"} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemove(provider.id)}
                            className="bg-red-500/10 border-red-500/30 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
