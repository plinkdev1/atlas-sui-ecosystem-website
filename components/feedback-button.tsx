"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { HelpCircle, Send } from "lucide-react"
import { toast } from "react-toastify"

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState<number>(5)
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          message: message.trim(),
          email: email.trim() || null,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit feedback")

      toast.success("Thanks for your feedback!")
      setIsOpen(false)
      setMessage("")
      setEmail("")
      setRating(5)
    } catch (error) {
      console.error("[v0] Feedback submission error:", error)
      toast.error("Failed to submit feedback")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg transition-all duration-200 flex items-center justify-center group"
        title="Send feedback"
      >
        <HelpCircle size={24} />
        <span className="absolute right-full mr-3 px-3 py-1 bg-foreground text-background text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Feedback
        </span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Feedback</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Rating */}
            <div>
              <label className="text-sm font-medium">Rating (1-5 stars)</label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl transition-colors ${star <= rating ? "text-yellow-400" : "text-muted-foreground"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="text-sm font-medium">
                Message *
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you think..."
                className="w-full mt-2 p-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email (optional)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full mt-2 p-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              <Send size={16} className="mr-2" />
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
