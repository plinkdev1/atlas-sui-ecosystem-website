"use client"

import { Button } from "@/components/ui/button"
import { getStableIdentifier, setPersistentCookie, STORAGE_KEYS } from "@/lib/consent-utils"
import { useWalletStore } from "@/lib/wallet-store"
import { AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"

export function RiskDisclaimerModal() {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { currentAccount } = useWalletStore()

  useEffect(() => {
    // Fast-path: check localStorage and cookies first
    const checkDisclaimer = () => {
      try {
        const localAccepted = localStorage.getItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED)
        const cookieAccepted = document.cookie.includes(`${STORAGE_KEYS.DISCLAIMER_ACCEPTED}=true`)

        if (localAccepted === "true" || cookieAccepted) {
          setIsVisible(false)
          return
        }
      } catch {
        // Continue to DB check
      }

      // If no local flag, check DB for persistent acceptance
      checkDisclaimerDB()
    }

    const checkDisclaimerDB = async () => {
      try {
        const identifier = getStableIdentifier(currentAccount)
        const response = await fetch(`/api/disclaimers/check?id=${identifier}`)
        const data = await response.json()

        if (!data.hasAccepted) {
          setIsVisible(true)
        } else {
          // Sync back to local storage if found in DB
          localStorage.setItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED, "true")
          setPersistentCookie(STORAGE_KEYS.DISCLAIMER_ACCEPTED, "true")
        }
      } catch (error) {
        console.error("Error checking disclaimer:", error)
        setIsVisible(true)
      }
    }

    checkDisclaimer()
  }, [currentAccount])

  const handleAccept = async () => {
    setIsLoading(true)
    try {
      const identifier = getStableIdentifier(currentAccount)

      // Save to DB
      await fetch("/api/disclaimers/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier,
          accepted: true,
        }),
      })

      // Save locally (storage + cookie)
      localStorage.setItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED, "true")
      setPersistentCookie(STORAGE_KEYS.DISCLAIMER_ACCEPTED, "true")
      setIsVisible(false)
    } catch (error) {
      console.error("Error saving disclaimer:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel rounded-2xl border border-[rgba(43,127,255,0.15)] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-card/50 backdrop-blur-md border-b border-[rgba(43,127,255,0.1)] px-6 py-4 flex items-center gap-3 rounded-t-2xl">
          <AlertCircle className="w-6 h-6 text-yellow-600" />
          <h2 className="text-xl font-bold text-foreground">Risk Disclaimer</h2>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="glass-panel border border-yellow-500/40 rounded-lg p-4 bg-yellow-500/5">
            <p className="text-yellow-600 font-semibold">
              ⚠️ IMPORTANT: Please read carefully before using Atlas Protocol
            </p>
          </div>

          <section className="space-y-3">
            <h3 className="font-semibold text-foreground">1. Risk of Loss</h3>
            <p className="text-muted-foreground">
              Cryptocurrency and blockchain assets are highly volatile and risky. You may lose your entire investment.
              Atlas Protocol is not responsible for any financial losses, whether through market fluctuations, smart
              contract bugs, user error, or other causes.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold text-foreground">2. Non-Custodial</h3>
            <p className="text-muted-foreground">
              Atlas Protocol does NOT hold your private keys or assets. You retain full control and responsibility for
              your wallet and transactions. We cannot recover lost or stolen funds.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold text-foreground">3. Beta Software</h3>
            <p className="text-muted-foreground">
              Atlas Protocol is in beta. Features may be incomplete, contain bugs, or change without notice. Use at your
              own risk and always test with small amounts first.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold text-foreground">4. Not Financial Advice</h3>
            <p className="text-muted-foreground">
              Atlas Protocol provides informational tools only and does NOT provide financial, investment, or legal
              advice. Always conduct your own research and consult professionals before making financial decisions.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold text-foreground">5. Smart Contract Risks</h3>
            <p className="text-muted-foreground">
              Blockchain transactions are irreversible. Smart contracts may contain bugs or vulnerabilities. Always
              verify transaction details before confirming. Atlas Protocol is not liable for losses caused by smart
              contract failures.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold text-foreground">6. Regulatory Compliance</h3>
            <p className="text-muted-foreground">
              Cryptocurrency regulations vary by jurisdiction. You are responsible for complying with local laws and
              reporting requirements. Atlas Protocol may be unavailable in certain regions.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold text-foreground">7. No Warranties</h3>
            <p className="text-muted-foreground">
              Atlas Protocol is provided "AS IS" without any warranties. We do not guarantee uptime, accuracy of data,
              or freedom from bugs. Use at your own risk.
            </p>
          </section>

          <div className="glass-panel border border-[rgba(43,127,255,0.2)] rounded-lg p-4 bg-[rgba(43,127,255,0.05)]">
            <p className="text-blue-400 text-sm">
              By clicking "I Understand & Accept", you acknowledge that you have read and understood these risks and
              agree to use Atlas Protocol at your own risk.
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-card/50 backdrop-blur-md border-t border-[rgba(43,127,255,0.1)] px-6 py-4 flex gap-3 justify-end rounded-b-2xl">
          <Button onClick={handleAccept} disabled={isLoading} className="bg-primary hover:bg-primary/90">
            {isLoading ? "Processing..." : "I Understand & Accept"}
          </Button>
        </div>
      </div>
    </div>
  )
}
