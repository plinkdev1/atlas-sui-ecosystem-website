"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Users, Shield, Database, DollarSign, FileSearch, CheckCircle, XCircle,
  Search, RefreshCw, TrendingUp, Activity, MessageSquare, Star
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function AdminDashboardContent() {
  const { toast } = useToast()
  const [roleFilter, setRoleFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [usersPage, setUsersPage] = useState(1)

  const { data: statsData, mutate: mutateStats } = useSWR("/api/admin/stats", fetcher, { refreshInterval: 30000 })
  const { data: usersData, mutate: mutateUsers } = useSWR(
    `/api/admin/users?role=${roleFilter}&search=${searchQuery}&page=${usersPage}`,
    fetcher
  )
  const { data: modData, mutate: mutateMod } = useSWR("/api/admin/moderation", fetcher)

  const stats = statsData?.stats || {}
  const users = usersData?.users || []
  const totalUsers = usersData?.total || 0

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole, action: "change_role" }),
      })
      if (!res.ok) throw new Error("Failed")
      toast({ title: "Role updated", description: `User role changed to ${newRole}` })
      mutateUsers()
      mutateStats()
    } catch {
      toast({ title: "Error", description: "Failed to update role", variant: "destructive" })
    }
  }

  const handleBanUser = async (userId: string) => {
    if (!confirm("Ban this user?")) return
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action: "ban" }),
      })
      if (!res.ok) throw new Error("Failed")
      toast({ title: "User banned" })
      mutateUsers()
    } catch {
      toast({ title: "Error", description: "Failed to ban user", variant: "destructive" })
    }
  }

  const handleModeration = async (targetId: string, targetType: string, action: string) => {
    try {
      const res = await fetch("/api/admin/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, targetId, targetType }),
      })
      if (!res.ok) throw new Error("Failed")
      toast({ title: `${targetType} ${action}d successfully` })
      mutateMod()
      mutateStats()
    } catch {
      toast({ title: "Error", description: `Failed to ${action} ${targetType}`, variant: "destructive" })
    }
  }

  const roleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "destructive"
      case "partner": return "default"
      case "banned": return "outline"
      default: return "secondary"
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Real-time platform management</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { mutateStats(); mutateUsers(); mutateMod() }} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users ({totalUsers})</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">{stats.adminUsers || 0} admins, {stats.partnerUsers || 0} partners</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Entitlements</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEntitlements || 0}</div>
                <p className="text-xs text-muted-foreground">Active subscriptions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue (USD)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(stats.totalRevenueUsd || 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{(stats.totalRevenueSui || 0).toFixed(2)} SUI total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stats.pendingProviders || 0) + (stats.pendingInquiries || 0)}</div>
                <p className="text-xs text-muted-foreground">{stats.pendingProviders || 0} providers, {stats.pendingInquiries || 0} inquiries</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Platform Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Providers</span><span className="font-medium">{stats.totalProviders || 0}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Bridge Transactions</span><span className="font-medium">{stats.totalBridgeLogs || 0}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">NFT Trades</span><span className="font-medium">{stats.totalNftTrades || 0}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Feedback</span><span className="font-medium">{stats.totalFeedback || 0}</span></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Recent Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(statsData?.recentFeedback || []).length === 0 && <p className="text-sm text-muted-foreground">No feedback yet</p>}
                {(statsData?.recentFeedback || []).map((fb: { id: string; rating: number; message: string; created_at: string }) => (
                  <div key={fb.id} className="flex items-start gap-2 text-sm">
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{fb.rating}</span>
                    </div>
                    <p className="text-muted-foreground truncate">{fb.message || "No message"}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Latest registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(statsData?.recentUsers || []).map((u: { id: string; wallet_address: string; role: string; created_at: string }) => (
                  <div key={u.id} className="flex items-center justify-between text-sm py-1 border-b border-border/30 last:border-0">
                    <span className="font-mono text-xs truncate max-w-[200px]">{u.wallet_address || "N/A"}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={roleBadgeColor(u.role) as any}>{u.role}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {(statsData?.recentUsers || []).length === 0 && <p className="text-sm text-muted-foreground">No users yet</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* USERS TAB */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Search, filter, and manage all registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by wallet address..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setUsersPage(1) }}
                    className="pl-9"
                  />
                </div>
                <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setUsersPage(1) }}>
                  <SelectTrigger className="w-[140px]"><SelectValue placeholder="Filter role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                {users.map((user: { id: string; wallet_address: string; role: string; auth_method: string; created_at: string }) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="min-w-0">
                        <p className="font-mono text-xs truncate max-w-[220px]">{user.wallet_address || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">{user.auth_method || "wallet"} - {new Date(user.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={roleBadgeColor(user.role) as any}>{user.role}</Badge>
                      <Select value={user.role} onValueChange={(v) => handleRoleChange(user.id, v)}>
                        <SelectTrigger className="w-[100px] h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="partner">Partner</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" className="h-8 text-xs text-destructive hover:bg-destructive/10" onClick={() => handleBanUser(user.id)}>
                        Ban
                      </Button>
                    </div>
                  </div>
                ))}
                {users.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No users found</p>}
              </div>

              {totalUsers > 20 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button variant="outline" size="sm" disabled={usersPage <= 1} onClick={() => setUsersPage((p) => p - 1)}>Previous</Button>
                  <span className="text-sm text-muted-foreground self-center">Page {usersPage} of {Math.ceil(totalUsers / 20)}</span>
                  <Button variant="outline" size="sm" disabled={usersPage >= Math.ceil(totalUsers / 20)} onClick={() => setUsersPage((p) => p + 1)}>Next</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PROVIDERS TAB */}
        <TabsContent value="providers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Provider Management</CardTitle>
              <CardDescription>Approve, reject, and manage provider listings</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-sm font-semibold mb-3">Pending Listings ({modData?.pendingListings?.length || 0})</h3>
              <div className="space-y-3">
                {(modData?.pendingListings || []).map((listing: { id: string; name: string; description: string; category: string; created_at: string }) => (
                  <div key={listing.id} className="flex items-start justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
                    <div>
                      <p className="font-semibold">{listing.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[300px]">{listing.description}</p>
                      <Badge variant="secondary" className="mt-1">{listing.category || "General"}</Badge>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="outline" className="gap-1 text-green-600 hover:bg-green-500/10" onClick={() => handleModeration(listing.id, "listing", "approve")}>
                        <CheckCircle className="h-3 w-3" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1 text-red-600 hover:bg-red-500/10" onClick={() => handleModeration(listing.id, "listing", "reject")}>
                        <XCircle className="h-3 w-3" /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
                {(modData?.pendingListings || []).length === 0 && <p className="text-sm text-muted-foreground">No pending listings</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MODERATION TAB */}
        <TabsContent value="moderation" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Partnership Inquiries</CardTitle>
                <CardDescription>Pending partnership requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(modData?.pendingInquiries || []).map((inq: { id: string; name: string; company: string; email: string; inquiry_type: string; message: string }) => (
                    <div key={inq.id} className="p-3 rounded-lg bg-muted/30 border border-border/30">
                      <div className="flex justify-between mb-2">
                        <div>
                          <p className="font-semibold text-sm">{inq.name} - {inq.company}</p>
                          <p className="text-xs text-muted-foreground">{inq.email}</p>
                        </div>
                        <Badge variant="secondary">{inq.inquiry_type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{inq.message}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-green-600" onClick={() => handleModeration(inq.id, "inquiry", "approve")}>Approve</Button>
                        <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleModeration(inq.id, "inquiry", "reject")}>Reject</Button>
                      </div>
                    </div>
                  ))}
                  {(modData?.pendingInquiries || []).length === 0 && <p className="text-sm text-muted-foreground">No pending inquiries</p>}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Moderation Log</CardTitle>
                <CardDescription>Recent moderation actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(modData?.moderationLogs || []).map((log: { id: string; action: string; reason: string; created_at: string }) => (
                    <div key={log.id} className="flex justify-between text-sm py-1 border-b border-border/30 last:border-0">
                      <span className="text-muted-foreground">{log.action}</span>
                      <span className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                  {(modData?.moderationLogs || []).length === 0 && <p className="text-sm text-muted-foreground">No moderation logs</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* REVENUE TAB */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue USD</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">${(stats.totalRevenueUsd || 0).toLocaleString()}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue SUI</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{(stats.totalRevenueSui || 0).toFixed(2)} SUI</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.totalEntitlements || 0}</div></CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Revenue Records</CardTitle>
              <CardDescription>Detailed revenue tracking from entitlements and subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Revenue records are populated as users purchase subscriptions and entitlements. Check the Supabase dashboard for detailed revenue_records table data.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
