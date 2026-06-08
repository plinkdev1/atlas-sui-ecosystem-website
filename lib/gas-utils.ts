import type { SuiJsonRpcClient, DryRunTransactionBlockResponse } from "@mysten/sui/jsonRpc"
import type { Transaction } from "@mysten/sui/transactions"
import { WalletError, ErrorCode } from "@/lib/errors"

type SuiClient = SuiJsonRpcClient

export interface GasEstimate {
  gasLimit: string
  gasPrice: string
  totalGas: string
}

interface GasUsed {
  computationCost?: string
  storageCost?: string
}

export async function estimateGas(transactionBlock: Transaction, client: SuiClient): Promise<GasEstimate> {
  try {
    // Dry run to estimate gas
    console.log("[v0] Estimating gas for transaction...")

    // Serialize the transaction block for dry run
    const serializedTx = await transactionBlock.build({ client })

    const dryRunResult: DryRunTransactionBlockResponse = await client.dryRunTransactionBlock({
      transactionBlock: serializedTx,
    })

    if (!dryRunResult || !dryRunResult.effects) {
      throw new WalletError("Gas estimation failed - no effects returned", ErrorCode.GAS_ESTIMATION_FAILED, true)
    }

    const gasUsed: GasUsed = dryRunResult.effects.gasUsed || { computationCost: "0", storageCost: "0" }
    const computationCost = BigInt(gasUsed.computationCost || "0")
    const storageCost = BigInt(gasUsed.storageCost || "0")
    const totalGas = (computationCost + storageCost).toString()

    console.log("[v0] Gas estimated:", {
      computationCost: computationCost.toString(),
      storageCost: storageCost.toString(),
      totalGas,
    })

    return {
      gasLimit: totalGas,
      gasPrice: "1", // Sui uses fixed gas price
      totalGas,
    }
  } catch (error) {
    console.error("[v0] Gas estimation error:", error)
    throw new WalletError(
      "Failed to estimate gas. Please try again.",
      ErrorCode.GAS_ESTIMATION_FAILED,
      true,
      error instanceof Error ? error : undefined,
    )
  }
}

interface Coin {
  balance?: string
}

export async function validateBalance(address: string, requiredGas: string, client: SuiClient): Promise<boolean> {
  try {
    console.log("[v0] Validating balance for address:", address)

    const coins = await client.getCoins({ owner: address })
    const suiCoins: Coin[] = coins.data || []

    if (suiCoins.length === 0) {
      throw new WalletError("No SUI coins found in wallet", ErrorCode.INSUFFICIENT_BALANCE, false)
    }

    const totalBalance = suiCoins.reduce((sum: bigint, coin: Coin) => {
      return sum + BigInt(coin.balance || "0")
    }, BigInt(0))

    const requiredAmount = BigInt(requiredGas)

    if (totalBalance < requiredAmount) {
      const shortfall = (requiredAmount - totalBalance).toString()
      throw new WalletError(
        `Insufficient balance. Need ${requiredGas} but have ${totalBalance.toString()}. Short ${shortfall}.`,
        ErrorCode.INSUFFICIENT_BALANCE,
        false,
      )
    }

    console.log("[v0] Balance sufficient:", totalBalance.toString())
    return true
  } catch (error) {
    if (error instanceof WalletError) throw error
    throw new WalletError(
      "Failed to validate balance",
      ErrorCode.GAS_ESTIMATION_FAILED,
      true,
      error instanceof Error ? error : undefined,
    )
  }
}
