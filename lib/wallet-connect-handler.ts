import type { Transaction } from "@mysten/sui/transactions"
import type { SuiJsonRpcClient, DryRunTransactionBlockResponse } from "@mysten/sui/jsonRpc"
import { WalletError, ErrorCode, getErrorMessage } from "@/lib/errors"
import { retryAsync } from "@/lib/retry-logic"
import { estimateGas } from "@/lib/gas-utils"

// Use SuiJsonRpcClient type alias as SuiClient for backward compatibility
type SuiClient = SuiJsonRpcClient

interface WalletSigner {
  signTransactionBlock(options: { transactionBlock: Transaction }): Promise<any>
  signAndExecuteTransactionBlock(options: {
    transactionBlock: Transaction
    options?: { showEffects?: boolean }
  }): Promise<DryRunTransactionBlockResponse>
}

export async function signTransactionWithWalletConnect(
  transactionBlock: Transaction,
  signer: WalletSigner,
): Promise<string> {
  try {
    console.log("[v0] Signing with WalletConnect...")
    const signature = await retryAsync(
      () =>
        signer.signTransactionBlock({
          transactionBlock,
        }),
      { maxRetries: 2 },
    )
    return signature.signature
  } catch (error: unknown) {
    const message = getErrorMessage(error)
    let code = ErrorCode.SIGNATURE_REJECTED

    if (message.includes("rejected")) {
      code = ErrorCode.WALLET_REJECTION
    } else if (message.includes("timeout")) {
      code = ErrorCode.WALLET_TIMEOUT
    }

    console.error("[v0] WalletConnect signature failed:", message)
    throw new WalletError(message, code, code === ErrorCode.WALLET_TIMEOUT)
  }
}

export async function executeTransactionWithWalletConnect(
  client: SuiClient,
  transactionBlock: Transaction,
  signer: WalletSigner,
): Promise<string> {
  try {
    console.log("[v0] Executing transaction with WalletConnect...")

    try {
      const gasEstimate = await estimateGas(transactionBlock, client)
      console.log("[v0] Gas estimate:", gasEstimate)
    } catch (gasError: unknown) {
      console.warn("[v0] Gas estimation warning (continuing):", getErrorMessage(gasError))
    }

    const result = await retryAsync(
      () =>
        signer.signAndExecuteTransactionBlock({
          transactionBlock,
          options: { showEffects: true },
        }),
      { maxRetries: 2 },
    )

    // Extract digest from result - handle both direct property and nested structure
    const digest = (result as any).digest || (result as any).transactionDigest || ""
    console.log("[v0] Transaction executed successfully:", digest)
    
    if (!digest) {
      throw new Error("Transaction digest not found in response")
    }
    
    return digest
  } catch (error: unknown) {
    const message = getErrorMessage(error)
    let code = ErrorCode.TRANSACTION_FAILED
    let retryable = false

    if (message.includes("rejected")) {
      code = ErrorCode.SIGNATURE_REJECTED
    } else if (message.includes("timeout")) {
      code = ErrorCode.TRANSACTION_TIMEOUT
      retryable = true
    } else if (message.includes("insufficient")) {
      code = ErrorCode.INSUFFICIENT_BALANCE
    }

    console.error("[v0] WalletConnect execution failed:", message)
    throw new WalletError(message, code, retryable)
  }
}
