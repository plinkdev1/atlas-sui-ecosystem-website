"use client"

import { Button } from "@/components/ui/button"
import { Shield, ArrowRight, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export function ProviderDashboardBanner() {
  const router = useRouter()

  return (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 border border-blue-500/20 p-6 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Shield className="h-6 w-6 text-blue-500" />
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">Are you a Provider or Partner?</h3>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-sm text-muted-foreground">
            Access the Provider Dashboard to manage your infrastructure listings, track analytics, and collaborate with the ecosystem.
          </p>
        </div>
        <Button
          onClick={() => router.push("/provider-dashboard")}
          className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
        >
          Go to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
