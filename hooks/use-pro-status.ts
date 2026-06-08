"use client"

import { useContext } from "react"
import { ProContext } from "@/lib/pro-status-context"

export function useProStatus() {
  const context = useContext(ProContext)
  if (!context) {
    throw new Error("useProStatus must be used within ProProvider")
  }
  return context
}
