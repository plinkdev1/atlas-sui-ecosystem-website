import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"
import { Suspense } from "react"
import { AdminModerationDashboard } from "@/components/admin-moderation-dashboard"
import { RevealSection } from "@/components/reveal-section"

function AdminLoading() {
  return (
    <main className="bg-background min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground text-sm">Loading admin panel...</p>
    </main>
  )
}

export default function AdminPage() {
  return (
    <main className="bg-background min-h-screen">
      {/* Hero strip */}
      <section className="section-gradient-blue container-modern relative overflow-hidden py-8">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <RevealSection>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-badge">
                <Shield className="h-5 w-5 text-[#2B7FFF]" />
              </div>
              <div>
                <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Admin</p>
                <h1 className="heading-hero !text-2xl md:!text-3xl">Moderation Dashboard</h1>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      <Suspense fallback={<AdminLoading />}>
        <AdminModerationDashboard />
      </Suspense>
    </main>
  )
}
