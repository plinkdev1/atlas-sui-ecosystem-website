"use client"

import useSWR from "swr"
import { useSupabaseUser } from "@/hooks/use-supabase-user"
import type { AirpointsBalance, AirpointsHistoryEvent } from "@/lib/supabase/airpoints"

interface UseAirpointsReturn {
  balance: number
  tier: string
  history: AirpointsHistoryEvent[]
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch airpoints")
  }
  return response.json()
}

export function useAirpoints(): UseAirpointsReturn {
  const { user } = useSupabaseUser()

  // Fetch balance
  const { data: balanceData, error: balanceError, isLoading: balanceLoading } = useSWR(
    user ? `/api/airpoints?action=balance&userId=${user.id}` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: true }
  )

  // Fetch history
  const { data: historyData, error: historyError, isLoading: historyLoading } = useSWR(
    user ? `/api/airpoints?action=history&userId=${user.id}` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: true }
  )

  const balance = balanceData?.balance ?? 0
  const tier = balanceData?.tier ?? "free"
  const history = historyData?.history ?? []

  const error = balanceError?.message || historyError?.message || null
  const loading = balanceLoading || historyLoading

  return {
    balance,
    tier,
    history,
    loading,
    error,
    isAuthenticated: !!user,
  }
}
