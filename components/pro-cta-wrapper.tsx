"use client"

import { ProCTABanner } from "@/components/pro-cta-banner"

interface ProCtaWrapperProps {
  title?: string
  description?: string
  variant?: "minimal" | "full" | "inline"
}

export function ProCtaWrapper({ title, description, variant }: ProCtaWrapperProps) {
  return (
    <ProCTABanner
      title={title}
      description={description}
      variant={variant}
    />
  )
}
