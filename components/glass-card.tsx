"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "elevated" | "outlined"
}

export function GlassCard({ children, className, variant = "default" }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-panel bg-background border border-border rounded-lg transition-all",
        variant === "elevated" && "shadow-lg",
        variant === "outlined" && "border-2 border-primary/30",
        className,
      )}
    >
      {children}
    </div>
  )
}
