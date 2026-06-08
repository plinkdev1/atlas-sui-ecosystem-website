"use client"

import { WalletError, getErrorGuidance, ErrorCode } from "@/lib/errors"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"

interface TransactionErrorDisplayProps {
  error: Error | WalletError | null
  onRetry?: () => void
  onDismiss?: () => void
}

export function TransactionErrorDisplay({ error, onRetry, onDismiss }: TransactionErrorDisplayProps) {
  if (!error) return null

  const isWalletError = error instanceof WalletError
  const code = isWalletError ? error.code : null
  const message = error.message
  const guidance = code ? getErrorGuidance(code) : "Please try again or contact support."
  const canRetry = isWalletError && error.retryable

  const getSeverity = () => {
    if (!isWalletError) return "error"
    if (error.code === ErrorCode.WALLET_REJECTION) return "warning"
    if (error.code === ErrorCode.WALLET_TIMEOUT) return "info"
    return "error"
  }

  const severity = getSeverity()
  const iconMap = {
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  }

  return (
    <div
      className={`p-4 rounded-lg border ${
        severity === "error"
          ? "bg-red-50 border-red-200"
          : severity === "warning"
            ? "bg-yellow-50 border-yellow-200"
            : "bg-blue-50 border-blue-200"
      }`}
    >
      <div className="flex gap-3">
        {iconMap[severity]}
        <div className="flex-1">
          <h4 className="font-semibold mb-1 text-foreground">
            {severity === "error" ? "Transaction Error" : severity === "warning" ? "Action Rejected" : "Please Review"}
          </h4>
          <p className="text-sm text-foreground/80 mb-2">{message}</p>
          <p className="text-xs text-foreground/60 mb-3">{guidance}</p>
          <div className="flex gap-2">
            {canRetry && onRetry && (
              <button
                onClick={onRetry}
                className="text-xs px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 transition"
              >
                Retry
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-xs px-3 py-1 bg-background border border-border rounded hover:bg-muted transition"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
