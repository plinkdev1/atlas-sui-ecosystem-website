"use client"

import { useState, useEffect } from "react"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, TrendingUp, Users, ArrowRight, Zap } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Validator {
  suiAddress: string
  name: string
  commissionRate: number
  aprPercentage: number
  totalDelegators: number
  stakedSui: string
  uptime: number
}

interface UserDelegation {
  id: string
  validator_address: string
  amount: string
  delegated_at: string
  rewards_earned: string
}

export function StakeHubContent() {
  const account = useCurrentAccount()
  const currentAccount = account?.address ?? null
  const [validators, setValidators] = useState<Validator[]>([])
  const [userDelegations, setUserDelegations] = useState<UserDelegation[]>([])
  const [isLoadingValidators, setIsLoadingValidators] = useState(true)
  const [isLoadingDelegations, setIsLoadingDelegations] = useState(false)
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(null)
  const [delegateAmount, setDelegateAmount] = useState("")
  const [estimatedRewards, setEstimatedRewards] = useState<string | null>(null)
  const [rewardDays, setRewardDays] = useState(30)

  useEffect(() => {
    fetchValidators()
  }, [])

  useEffect(() => {
    if (currentAccount) {
      fetchUserDelegations()
    }
  }, [currentAccount])

  const fetchValidators = async () => {
    try {
      setIsLoadingValidators(true)
      const response = await fetch("/api/stake/validators")
      const data = await response.json()
      if (data.validators) {
        setValidators(data.validators.slice(0, 20))
      }
    } catch (error) {
      console.error("Error fetching validators:", error)
      toast({ title: "Error", description: "Failed to load validators", variant: "destructive" })
    } finally {
      setIsLoadingValidators(false)
    }
  }

  const fetchUserDelegations = async () => {
    if (!currentAccount) return
    try {
      setIsLoadingDelegations(true)
      const response = await fetch(`/api/stake/user-delegations?wallet=${currentAccount}`)
      const data = await response.json()
      if (data.delegations) {
        setUserDelegations(data.delegations)
        toast({ title: "Delegations Loaded", description: `Found ${data.delegationCount} active delegations. +2 Airpoints!` })
      }
    } catch (error) {
      console.error("Error fetching delegations:", error)
    } finally {
      setIsLoadingDelegations(false)
    }
  }

  const calculateRewards = async () => {
    if (!selectedValidator || !delegateAmount) {
      toast({ title: "Error", description: "Please select a validator and enter amount", variant: "destructive" })
      return
    }
    try {
      const response = await fetch("/api/stake/calculate-rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          delegatedAmount: (parseFloat(delegateAmount) * 1e9).toFixed(0),
          validatorAPR: selectedValidator.aprPercentage,
          dayCount: rewardDays,
        }),
      })
      const data = await response.json()
      setEstimatedRewards(data.estimatedRewards)
    } catch (error) {
      console.error("Error calculating rewards:", error)
      toast({ title: "Error", description: "Failed to calculate rewards", variant: "destructive" })
    }
  }

  const handleDelegate = async () => {
    if (!selectedValidator || !delegateAmount || !currentAccount) {
      toast({ title: "Error", description: "Missing required information", variant: "destructive" })
      return
    }
    toast({ title: "Delegation Initiated", description: "Please approve the transaction in your wallet to complete delegation" })
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">Stake Hub</h1>
        <p className="text-muted-foreground">Explore Sui validators, delegate your SUI tokens, and earn rewards</p>
      </div>

      <Tabs defaultValue="validators" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="validators">Validators</TabsTrigger>
          <TabsTrigger value="my-stakes">My Delegations</TabsTrigger>
        </TabsList>

        <TabsContent value="validators" className="space-y-6">
          {isLoadingValidators ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Top Validators</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {validators.map((validator) => (
                    <Card
                      key={validator.suiAddress}
                      className={`cursor-pointer transition ${selectedValidator?.suiAddress === validator.suiAddress ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setSelectedValidator(validator)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{validator.name}</CardTitle>
                            <CardDescription className="text-xs">{validator.suiAddress.slice(0, 10)}...</CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-500">{validator.aprPercentage.toFixed(2)}%</div>
                            <div className="text-xs text-muted-foreground">APR</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Commission:</span>
                          <span>{(validator.commissionRate * 100).toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Uptime:</span>
                          <span>{validator.uptime.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Delegators:</span>
                          <span>{validator.totalDelegators}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Delegate</h2>
                {selectedValidator ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedValidator.name}</CardTitle>
                      <CardDescription>Commission: {(selectedValidator.commissionRate * 100).toFixed(2)}%</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Amount to Delegate (SUI)</label>
                        <Input type="number" placeholder="Enter amount" value={delegateAmount} onChange={(e) => { setDelegateAmount(e.target.value); setEstimatedRewards(null) }} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Reward Period (Days)</label>
                        <Input type="number" placeholder="30" value={rewardDays} onChange={(e) => { setRewardDays(parseInt(e.target.value) || 30); setEstimatedRewards(null) }} />
                      </div>
                      <Button onClick={calculateRewards} className="w-full" variant="outline">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Calculate Rewards
                      </Button>
                      {estimatedRewards && (
                        <Card className="bg-primary/10 border-primary/20">
                          <CardContent className="pt-6">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Estimated Rewards:</span>
                                <span className="font-semibold">{estimatedRewards} SUI</span>
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>APR:</span>
                                <span>{selectedValidator.aprPercentage.toFixed(2)}%</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      <Button onClick={handleDelegate} className="w-full gap-2" disabled={!currentAccount}>
                        <Zap className="h-4 w-4" />
                        {currentAccount ? "Delegate Now" : "Connect Wallet"}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">Select a validator to delegate</CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-stakes" className="space-y-6">
          {!currentAccount ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">Connect your wallet to view delegations</p>
              </CardContent>
            </Card>
          ) : isLoadingDelegations ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : userDelegations.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">No active delegations found</CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userDelegations.map((delegation) => (
                <Card key={delegation.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-base">{(parseFloat(delegation.amount) / 1e9).toFixed(2)} SUI</CardTitle>
                        <CardDescription>Validator: {delegation.validator_address.slice(0, 10)}...</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-500">+{(parseFloat(delegation.rewards_earned) / 1e9).toFixed(4)} SUI</div>
                        <div className="text-xs text-muted-foreground">Rewards Earned</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Delegated: {new Date(delegation.delegated_at).toLocaleDateString()}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
