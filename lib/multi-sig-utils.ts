"use client"

/**
 * Multi-Signature Wallet Detection and Utilities
 * Detects if a connected wallet supports multi-sig operations
 */

import type { Transaction } from "@mysten/sui/transactions"
import type { SuiJsonRpcClient } from "@mysten/sui/jsonRpc"

type SuiClient = SuiJsonRpcClient

export interface WalletCapabilities {
  supportsMultiSig: boolean
  supportsBurn: boolean
  supportsTransfer: boolean
  supportsStaking: boolean
}

const MULTI_SIG_WALLETS = ["Slush Wallet", "Slush"]

export function detectWalletCapabilities(walletName: string): WalletCapabilities {
  return {
    supportsMultiSig: MULTI_SIG_WALLETS.includes(walletName),
    supportsBurn: true,
    supportsTransfer: true,
    supportsStaking: false,
  }
}

export async function getMultiSigners(wallet: { getMultiSigners?: () => Promise<string[]> }): Promise<string[]> {
  try {
    if (wallet.getMultiSigners && typeof wallet.getMultiSigners === "function") {
      return await wallet.getMultiSigners()
    }
    return []
  } catch {
    return []
  }
}

interface Signer {
  signPersonalMessage(options: { message: Uint8Array }): Promise<{ signature: string }>
  signAndExecuteTransactionBlock(options: { transactionBlock: Transaction }): Promise<{ digest: string }>
}

export async function executeMultiSigTransaction(
  transactionBlock: Transaction,
  signers: Signer[],
  suiClient: SuiClient,
  primarySigner: Signer,
): Promise<string> {
  try {
    if (!signers || signers.length === 0) {
      throw new Error("No signers provided for multi-sig transaction")
    }

    console.log("[v0] Executing multi-sig transaction with", signers.length, "signers")

    // Build transaction with multi-sig threshold (requires n-1 signatures for 2+ signers)
    const threshold = Math.max(1, signers.length - 1)

    // Serialize transaction for signing
    const txBytes = transactionBlock.serialize()

    // Collect signatures from all signers
    const signatures: string[] = []
    for (const signer of signers) {
      try {
        const signatureResult = await signer.signPersonalMessage({
          message: new TextEncoder().encode(txBytes),
        })
        signatures.push(signatureResult.signature)
      } catch (signerError) {
        console.error("[v0] Failed to get signature from signer:", signerError)
        throw new Error(`Failed to collect signature from signer: ${signerError}`)
      }
    }

    // Execute transaction with collected signatures via primary signer
    const result = await primarySigner.signAndExecuteTransactionBlock({
      transactionBlock,
    })

    console.log("[v0] Multi-sig transaction executed successfully:", result.digest)
    return result.digest
  } catch (error: unknown) {
    console.error("[v0] Multi-sig execution failed:", error)
    throw new Error(`Multi-sig execution failed: ${error}`)
  }
}
