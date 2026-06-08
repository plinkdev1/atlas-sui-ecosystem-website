import { NextResponse } from "next/server"
import { calculateStakingRewards } from "@/lib/sui-staking"

export async function POST(request: Request) {
  try {
    const { delegatedAmount, validatorAPR, dayCount } = await request.json()

    if (!delegatedAmount || !validatorAPR || !dayCount) {
      return NextResponse.json(
        { error: "Missing required parameters: delegatedAmount, validatorAPR, dayCount" },
        { status: 400 },
      )
    }

    const estimatedRewards = await calculateStakingRewards(
      delegatedAmount.toString(),
      validatorAPR,
      dayCount,
    )

    return NextResponse.json({
      estimatedRewards: estimatedRewards.toFixed(6),
      estimatedRewardsPerDay: (estimatedRewards / dayCount).toFixed(6),
      apr: validatorAPR,
      dayCount,
      delegatedAmount: (parseFloat(delegatedAmount) / 1e9).toFixed(2),
    })
  } catch (error) {
    console.error("[v0] Error calculating rewards:", error)
    return NextResponse.json({ error: "Failed to calculate rewards" }, { status: 500 })
  }
}
