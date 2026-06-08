import { SuiJsonRpcClient as SuiClient, getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc"

const NETWORK = (process.env.NEXT_PUBLIC_SUI_NETWORK as "mainnet" | "testnet") || "testnet"
const client = new SuiClient({
    url: getJsonRpcFullnodeUrl(NETWORK),
    network: NETWORK
})

export interface VerificationResult {
    success: boolean
    sender?: string
    amount?: string
    recipient?: string
    error?: string
}

/**
 * Verifies a Sui transaction digest on-chain
 * Checks if the transaction was successful and if it sent the correct amount to the treasury
 */
export async function verifySuiTransaction(
    digest: string,
    expectedRecipient: string,
    expectedAmountMist?: string
): Promise<VerificationResult> {
    try {
        const tx = await client.getTransactionBlock({
            digest,
            options: {
                showBalanceChanges: true,
                showEffects: true,
                showInput: true,
            },
        })

        if (tx.effects?.status.status !== "success") {
            return { success: false, error: "Transaction failed on-chain" }
        }

        const sender = tx.transaction?.data.sender

        // Check balance changes to verify amount and recipient
        // Balance changes show how much each address's balance changed for each coin type
        const suiChanges = tx.balanceChanges?.filter(change => change.coinType === "0x2::sui::SUI") || []

        const recipientChange = suiChanges.find(change => change.owner === `AddressOwner(${expectedRecipient})` || (typeof change.owner === 'object' && 'AddressOwner' in change.owner && change.owner.AddressOwner === expectedRecipient))

        if (!recipientChange) {
            // Some RPCs might return a different format for owner, fallback check
            const treasuryReceived = suiChanges.find(change => {
                const ownerStr = typeof change.owner === 'string' ? change.owner : JSON.stringify(change.owner);
                return ownerStr.includes(expectedRecipient);
            });

            if (!treasuryReceived) {
                return { success: false, error: `Recipient ${expectedRecipient} did not receive SUI in this transaction` }
            }
        }

        if (expectedAmountMist) {
            const amountReceived = suiChanges.find(change => {
                const ownerStr = typeof change.owner === 'string' ? change.owner : JSON.stringify(change.owner);
                return ownerStr.includes(expectedRecipient);
            })?.amount;

            if (!amountReceived || BigInt(amountReceived) < BigInt(expectedAmountMist)) {
                return { success: false, error: `Insufficient amount. Expected ${expectedAmountMist}, got ${amountReceived}` }
            }
        }

        return {
            success: true,
            sender,
        }
    } catch (error) {
        console.error("[v0] Sui verification error:", error)
        return { success: false, error: error instanceof Error ? error.message : "Unknown verification error" }
    }
}
