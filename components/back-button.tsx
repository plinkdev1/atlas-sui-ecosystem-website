"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
  label?: string
}

export function BackButton({ label = "Back" }: BackButtonProps) {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
    >
      <ChevronLeft className="w-4 h-4" />
      <span>{label}</span>
    </Button>
  )
}
