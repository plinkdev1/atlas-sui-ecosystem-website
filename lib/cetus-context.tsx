"use client"

import { useContext } from "react"
import { CetusContext } from "./cetus-provider"

export function useCetus() {
  const context = useContext(CetusContext)
  if (!context) {
    throw new Error("useCetus must be used within CetusProvider")
  }
  return context
}
