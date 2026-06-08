"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, Building2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface FormData {
  name: string
  email: string
  company: string
  contactType: "partnership" | "developer" | "brand" | "provider"
  message: string
  phone?: string
}

export function PartnershipContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    contactType: "partnership",
    message: "",
    phone: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact/partnership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Failed to submit form")

      toast({
        title: "Success!",
        description: "Thank you! We'll review your inquiry and get back to you within 24 hours.",
        variant: "default",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        contactType: "partnership",
        message: "",
        phone: "",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          placeholder="Your full name"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          placeholder="your.email@company.com"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <Phone className="h-4 w-4 text-primary" />
          Phone (Optional)
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          placeholder="+1 (555) 123-4567"
        />
      </div>

      {/* Company */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          Company/Organization *
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          placeholder="Your company name"
        />
      </div>

      {/* Contact Type */}
      <div>
        <label htmlFor="contactType" className="block text-sm font-medium text-foreground mb-2">
          Contact Type *
        </label>
        <select
          id="contactType"
          name="contactType"
          value={formData.contactType}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        >
          <option value="partnership">Partnership Inquiry</option>
          <option value="developer">Developer Integration</option>
          <option value="brand">Brand Collaboration</option>
          <option value="provider">Provider Registration</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
          placeholder="Tell us about your partnership or integration plans..."
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-3 rounded-lg transition-all"
      >
        {isSubmitting ? "Sending..." : "Send Inquiry"}
      </Button>
    </form>
  )
}
