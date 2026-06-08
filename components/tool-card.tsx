import type React from "react"
import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToolCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  gradient: string
}

export function ToolCard({ title, description, icon, href, gradient }: ToolCardProps) {
  return (
    <Link href={href} className="group">
      <Card
        className={cn(
          "relative overflow-hidden border-border bg-card/50 backdrop-blur-sm transition-all hover:border-primary/60 hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.02] duration-300",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            gradient,
          )}
        />

        <CardHeader className="relative space-y-4 p-8">
          <div className="flex items-start justify-between">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/20 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/30 group-hover:shadow-lg group-hover:shadow-primary/50">
              {icon}
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
          </div>

          <div className="space-y-3">
            <CardTitle className="text-2xl text-foreground font-bold">{title}</CardTitle>
            <CardDescription className="text-muted-foreground text-pretty leading-relaxed">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  )
}
