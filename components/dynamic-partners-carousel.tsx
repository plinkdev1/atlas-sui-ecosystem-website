"use client"

import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { BrandLogo } from "@/components/brand-logo"
import { getBrandLogo } from "@/lib/brand-logos-client"
import { ArrowRight, Shield } from "lucide-react"
import type { AdvertisingPartner } from "@/types/advertising"

export function DynamicPartnersCarousel() {
  const [isMounted, setIsMounted] = useState(false)
  const [partners, setPartners] = useState<AdvertisingPartner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      const response = await fetch("/api/advertising")
      const data = await response.json()
      setPartners(data || [])
    } catch (error) {
      console.error("[v0] Failed to fetch advertising partners:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isMounted || loading) return null

  return (
    <section className="py-16 md:py-20">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">Featured Partners</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">Trusted projects powering the Sui ecosystem</p>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {partners.map((partner) => (
            <CarouselItem key={partner.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
              <div
                onClick={() => window.open(partner.website, "_blank")}
                className="group relative h-full overflow-hidden rounded-xl cursor-pointer transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/15 dark:from-primary/30 dark:via-primary/15 dark:to-secondary/20 border border-primary/30 dark:border-primary/40 backdrop-blur-xl rounded-xl transition-all group-hover:border-primary/60 dark:group-hover:border-primary/70 group-hover:shadow-xl group-hover:shadow-primary/20 dark:group-hover:shadow-primary/30" />

                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:bg-gradient-to-br dark:from-primary/5 dark:via-transparent dark:to-transparent" />

                <div className="relative z-10 p-6 h-full flex flex-col">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <BrandLogo name={partner.name} logoUrl={getBrandLogo(partner.name)} size="md" />
                    </div>
                    {partner.badge && (
                      <div className="flex items-center gap-1 ml-2 px-2 py-1 rounded-full bg-primary/25 dark:bg-primary/40 border border-primary/40 dark:border-primary/60 text-xs font-semibold text-primary dark:text-primary-foreground whitespace-nowrap">
                        <Shield className="h-3 w-3" />
                        <span className="hidden sm:inline">Verified</span>
                      </div>
                    )}
                  </div>

                  <h3 className="mb-2 font-bold text-foreground text-lg">{partner.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">{partner.tagline}</p>

                  <button className="w-full py-2 rounded-lg bg-gradient-to-r from-primary/30 to-primary/20 hover:from-primary/40 hover:to-primary/30 dark:from-primary/50 dark:to-primary/40 dark:hover:from-primary/60 dark:hover:to-primary/50 text-primary dark:text-primary-foreground font-medium transition-all border border-primary/40 hover:border-primary/60 dark:border-primary/60 dark:hover:border-primary/80 flex items-center justify-center gap-2 text-sm hover:shadow-lg hover:shadow-primary/20 dark:hover:shadow-primary/30">
                    Visit
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {partners.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <CarouselPrevious className="relative static mx-0 h-10 w-10 bg-primary/20 hover:bg-primary/30 dark:bg-primary/40 dark:hover:bg-primary/50 border border-primary/30 dark:border-primary/50 text-primary dark:text-primary-foreground rounded-lg" />
            <CarouselNext className="relative static mx-0 h-10 w-10 bg-primary/20 hover:bg-primary/30 dark:bg-primary/40 dark:hover:bg-primary/50 border border-primary/30 dark:border-primary/50 text-primary dark:text-primary-foreground rounded-lg" />
          </div>
        )}
      </Carousel>
    </section>
  )
}
