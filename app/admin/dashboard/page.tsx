import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { AdminDashboardContent } from "@/components/admin-dashboard-content"

export const metadata: Metadata = {
  title: "Admin Dashboard | Atlas Protocol",
  description: "Admin dashboard for managing users, providers, moderation, and revenue.",
}

export default function AdminDashboardPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <AdminDashboardContent />
      </main>
      <Footer />
      <MobileNav />
    </>
  )
}
