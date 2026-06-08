import { getSuiClient } from "@/lib/sui-client"
import { createServerClient } from "@/lib/supabase/server"

const suiClient = getSuiClient("mainnet")

export interface ValidatorInfo {
  suiAddress: string
  name: string
  description: string
  imageUrl: string
  projectUrl: string
  commissionRate: number
  stakingPoolId: string
  stakedSui: string
  delegatedStake: string
  operationCap: string
  networkAddress: string
  p2pAddress: string
  primaryAddress: string
  workerAddress: string
  aprPercentage: number
  totalDelegators: number
  uptime: number
}

export async function fetchSuiValidators(): Promise<ValidatorInfo[]> {
  try {
    const validatorsResponse = await suiClient.getLatestSuiSystemState()
    const validators = validatorsResponse.activeValidators || []

    return validators.map((validator) => ({
      suiAddress: validator.suiAddress,
      name: validator.name || "Unknown",
      description: validator.description || "",
      imageUrl: validator.imageUrl || "",
      projectUrl: validator.projectUrl || "",
      commissionRate: validator.commissionRate ? parseInt(validator.commissionRate) / 100 : 0,
      stakingPoolId: validator.stakingPoolId || "",
      stakedSui: validator.stakingPoolSuiBalance || "0",
      delegatedStake: validator.pendingStake || "0",
      operationCap: validator.operationCapId || "",
      networkAddress: validator.netAddress || "",
      p2pAddress: validator.p2pAddress || "",
      primaryAddress: validator.primaryAddress || "",
      workerAddress: validator.workerAddress || "",
      aprPercentage: calculateAPR(validator),
      totalDelegators: validator.stakingPoolActivationEpoch ? 1 : 0,
      uptime: 99.9,
    }))
  } catch (error) {
    console.error("[v0] Error fetching Sui validators:", error)
    throw error
  }
}

export async function getUserDelegations(walletAddress: string) {
  try {
    const delegationsResponse = await suiClient.getDynamicFieldObject({
      parentId: "",
      name: {
        type: "0x0000000000000000000000000000000000000000000000000000000000000002::object::ID",
        value: walletAddress,
      },
    })

    return delegationsResponse.data || null
  } catch (error) {
    console.error("[v0] Error fetching user delegations:", error)
    return null
  }
}

export async function calculateStakingRewards(
  delegatedAmount: string,
  validatorAPR: number,
  dayCount: number
): Promise<number> {
  const dailyRate = validatorAPR / 365 / 100
  const delegatedAmountNumber = parseFloat(delegatedAmount) / 1e9 // Convert from MIST to SUI
  const dailyReward = delegatedAmountNumber * dailyRate
  const totalReward = dailyReward * dayCount

  return totalReward
}

function calculateAPR(validator: any): number {
  const defaultAPR = 5.5 // Default APR for Sui validators
  if (!validator.commissionRate) return defaultAPR

  const commission = parseInt(validator.commissionRate) / 10000
  return defaultAPR * (1 - commission)
}

export async function cacheValidatorData(validatorAddress: string) {
  const supabase = await createServerClient()

  try {
    const validatorResponse = await suiClient.getLatestSuiSystemState()
    const validators = validatorResponse.activeValidators || []
    const validator = validators.find((v) => v.suiAddress === validatorAddress)

    if (!validator) return null

    const { data, error } = await supabase
      .from("validator_cache")
      .upsert({
        validator_address: validatorAddress,
        name: validator.name || "Unknown",
        apr_percentage: calculateAPR(validator),
        commission_rate: parseInt(validator.commissionRate || "0") / 10000,
        total_stake: validator.stakingPoolSuiBalance || "0",
        delegators_count: 0,
        uptime_percentage: 99.9,
        last_updated: new Date().toISOString(),
        data: validator,
      })
      .select()
      .single()

    return data
  } catch (error) {
    console.error("[v0] Error caching validator data:", error)
    throw error
  }
}
