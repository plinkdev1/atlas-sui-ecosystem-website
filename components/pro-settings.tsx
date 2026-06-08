"use client"

import { useState, useEffect } from "react"
import { useProStatus } from "@/lib/pro-status-context"
import { ProUpgradeModal } from "@/components/pro-upgrade-modal"
import { AirpointsDisplay } from "@/components/airpoints-display"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ProTag, ProBadge } from "@/components/pro-lock"
import { formatDistanceToNow } from "date-fns"
import { useSupabaseUser } from "@/hooks/use-supabase-user"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function ProSettings() {
  const { status, downgradeToFree } = useProStatus()
  const { user } = useSupabaseUser()
  const supabase = createClient()
  const { toast } = useToast()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [txNotifications, setTxNotifications] = useState(true)
  const [priceAlerts, setPriceAlerts] = useState(false)

  useEffect(() => {
    if (user?.id) {
      loadPreferences()
    }
  }, [user?.id])

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("preferences")
        .eq("user_id", user?.id)
        .single()

      if (error) throw error

      if (data?.preferences) {
        setEmailNotifications(data.preferences.emailNotifications ?? true)
        setTxNotifications(data.preferences.txNotifications ?? true)
        setPriceAlerts(data.preferences.priceAlerts ?? false)
      }
    } catch (error) {
      console.error("[v0] Error loading preferences:", error)
    }
  }

  const savePreference = async (key: string, value: boolean) => {
    try {
      const { data: currentData } = await supabase
        .from("user_profiles")
        .select("preferences")
        .eq("user_id", user?.id)
        .single()

      const updatedPreferences = {
        ...(currentData?.preferences || {}),
        [key]: value,
      }

      const { error } = await supabase
        .from("user_profiles")
        .update({ preferences: updatedPreferences })
        .eq("user_id", user?.id)

      if (error) throw error

      toast({
        title: "Preferences updated",
        description: "Your settings have been saved",
      })
    } catch (error) {
      console.error("[v0] Error saving preference:", error)
      toast({
        title: "Error saving preferences",
        description: "Failed to update settings",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Pro Status</h3>
            <p className="text-sm text-foreground/70">Manage your Atlas Protocol Pro subscription</p>
          </div>
          {status.isPro && <ProTag tier={status.tier as "pro" | "pro+"} />}
        </div>

        <div className="space-y-4 pb-6 border-b border-border/30">
          <div className="flex justify-between items-center">
            <span className="text-sm">Tier</span>
            <span className="font-medium">
              {status.isPro ? (status.tier === "pro+" ? "Pro+" : "Pro") : "Free"}
            </span>
          </div>
          {status.expiry && (
            <div className="flex justify-between items-center">
              <span className="text-sm">Expires</span>
              <span className="font-medium">
                {formatDistanceToNow(new Date(status.expiry), { addSuffix: true })}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          <ProUpgradeModal
            trigger={
              <Button variant={status.isPro ? "outline" : "default"}>
                {status.isPro ? "Manage Plan" : "Upgrade to Pro"}
              </Button>
            }
          />
          {status.isPro && (
            <Button variant="ghost" onClick={() => downgradeToFree()}>
              Downgrade
            </Button>
          )}
        </div>
      </Card>

      {/* User Preferences Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={(checked) => {
                setEmailNotifications(checked)
                savePreference("emailNotifications", checked)
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="tx-notifications">Transaction Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified about your transactions</p>
            </div>
            <Switch
              id="tx-notifications"
              checked={txNotifications}
              onCheckedChange={(checked) => {
                setTxNotifications(checked)
                savePreference("txNotifications", checked)
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="price-alerts">Price Alerts</Label>
              <p className="text-sm text-muted-foreground">Watchlist price movement alerts</p>
            </div>
            <Switch
              id="price-alerts"
              checked={priceAlerts}
              onCheckedChange={(checked) => {
                setPriceAlerts(checked)
                savePreference("priceAlerts", checked)
              }}
            />
          </div>
        </div>
      </Card>

      {/* Airpoints Section */}
      <AirpointsDisplay showHistory={true} showRedemption={true} />

      {/* For testing: Quick upgrade buttons */}
      <Card className="p-6 bg-muted/30 border-dashed">
        <h4 className="text-sm font-semibold mb-3">Development: Quick Test</h4>
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              // This would normally trigger the upgrade flow
              console.log("[v0] Test Pro upgrade flow")
            }}
          >
            Test Pro Features
          </Button>
          <ProBadge />
        </div>
      </Card>
    </div>
  )
}
