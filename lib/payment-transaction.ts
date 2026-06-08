import { Transaction } from "@mysten/sui/transactions"
import type { SuiJsonRpcClient } from "@mysten/sui/jsonRpc"
import { estimateGas } from "@/lib/gas-utils"
import { WalletError, ErrorCode } from "@/lib/errors"

type SuiClient = SuiJsonRpcClient

export interface PaymentConfig {
  treasuryAddress: string
  providerId: string
  tierName: string
  amount: string // in MIST (1 SUI = 1e9 MIST)
  token: "SUI" | "USDC"
}

export interface PaymentResult {
  digest: string
  amount: string
  tier: string
  providerId: string
  timestamp: number
}

export async function buildPaymentTransactionBlock(config: PaymentConfig): Promise<Transaction> {
  const txb = new Transaction()

  console.log("[v0] Building payment PTB for provider:", config.providerId)

  try {
    if (config.token === "SUI") {
      // Get the user's SUI coins
      // This would be called with user's coin objects in practice
      const [payment] = txb.splitCoins(txb.gas, [BigInt(config.amount)])

      // Transfer to treasury address
      txb.transferObjects([payment], config.treasuryAddress)

      console.log("[v0] PTB built: SUI transfer of", config.amount, "MIST to", config.treasuryAddress)
    }

    return txb
  } catch (error) {
    console.error("[v0] Error building payment PTB:", error)
    throw new WalletError(
      "Failed to build payment transaction",
      ErrorCode.TRANSACTION_FAILED,
      false,
      error instanceof Error ? error : undefined,
    )
  }
}

export async function estimatePaymentGas(txb: Transaction, client: SuiClient, token: string): Promise<string> {
  try {
    const gasEstimate = await estimateGas(txb, client)
    console.log("[v0] Payment gas estimate:", gasEstimate)
    return gasEstimate.totalGas
  } catch (error) {
    console.error("[v0] Gas estimation failed for payment:", error)
    throw error
  }
}

export function formatPaymentAmount(amount: number, token: string): string {
  if (token === "SUI") {
    return (amount / 1e9).toFixed(4)
  }
  return amount.toFixed(2)
}
