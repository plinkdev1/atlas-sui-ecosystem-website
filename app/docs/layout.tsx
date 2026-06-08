"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, BookOpen, ChevronRight } from "lucide-react"
import { useState, Suspense } from "react"
import { DocsSearch } from "@/components/docs-search"

const docs = [
  { title: "Overview", href: "/docs" },
  { title: "Architecture", href: "/docs/architecture" },
  { title: "Wallet Cleanup", href: "/docs/wallet-cleanup" },
  { title: "Transaction Explainer", href: "/docs/transaction-explainer" },
  { title: "Infra Discovery", href: "/docs/infra-discovery" },
  { title: "Blockchains", href: "/docs/blockchains" },
  { title: "Payments Guide", href: "/docs/payments" },
  { title: "Usage Tracking", href: "/docs/usage-tracking" },
  { title: "Admin & Partners", href: "/docs/admin-partners" },
  { title: "Network Testing", href: "/docs/network-testing" },
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen pt-20" style={{ background: "var(--background)" }}>
      {/* Mobile Hamburger */}
      <div className="fixed top-20 left-4 z-40 md:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2.5 rounded-xl transition-colors"
          style={{
            background: "rgba(43,127,255,0.10)",
            border: "1px solid rgba(43,127,255,0.18)",
          }}
          aria-label="Toggle docs navigation"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5 text-[#4d9fff]" />
          ) : (
            <Menu className="h-5 w-5 text-[#4d9fff]" />
          )}
        </button>
      </div>

      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside
          className={`fixed md:sticky md:top-20 w-64 h-[calc(100vh-80px)] overflow-y-auto z-30 p-5 flex flex-col gap-5 transition-transform duration-300 bg-card/90 backdrop-blur-xl border-r border-[rgba(43,127,255,0.10)] ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          {/* Sidebar header */}
          <div className="flex items-center gap-2.5 pt-2">
            <div
              className="icon-badge"
              style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", flexShrink: 0 }}
            >
              <BookOpen className="h-4 w-4 text-[#2B7FFF]" />
            </div>
            <span
              className="text-lg font-bold text-gradient font-[var(--font-display)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Documentation
            </span>
          </div>

          {/* Search */}
          <div>
            <DocsSearch />
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-0.5 flex-1">
            {docs.map((doc) => {
              const isActive = pathname === doc.href
              return (
                <Link
                  key={doc.href}
                  href={doc.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                    isActive
                      ? "docs-sidebar-link-active"
                      : "text-muted-foreground hover:bg-[#2B7FFF]/8 hover:text-foreground"
                  }`}
                >
                  <ChevronRight
                    className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isActive ? "rotate-90 text-[#2B7FFF]" : "text-muted-foreground"}`}
                  />
                  <span className="truncate">{doc.title}</span>
                </Link>
              )
            })}
          </nav>

          {/* Bottom hint */}
          <div
            className="rounded-xl p-3 text-xs text-muted-foreground"
            style={{ background: "rgba(43,127,255,0.06)", border: "1px solid rgba(43,127,255,0.10)" }}
          >
            <span className="text-[#4d9fff] font-medium">Atlas Protocol</span> developer docs. Open source on GitHub.
          </div>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0 p-6 md:p-10 max-w-4xl mx-auto">
          <Suspense fallback={<div className="text-muted-foreground text-sm">Loading...</div>}>
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  )
}
