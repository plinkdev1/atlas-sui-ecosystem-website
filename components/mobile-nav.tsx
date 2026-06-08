"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Sparkles, FileSearch, Network } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/wallet-cleanup",
      label: "Cleanup",
      icon: Sparkles,
    },
    {
      href: "/transaction-explainer",
      label: "Explainer",
      icon: FileSearch,
    },
    {
      href: "/infra-discovery",
      label: "Infra",
      icon: Network,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border backdrop-blur-xl md:hidden w-full overflow-x-hidden bg-background/80 dark:bg-[#080d14]/80">
      <div className="flex items-center justify-around w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-3 px-2 text-xs transition-colors min-w-0",
                isActive ? "text-[#2B7FFF]" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "fill-[#2B7FFF]/20")} />
              <span className="font-medium truncate text-center">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
