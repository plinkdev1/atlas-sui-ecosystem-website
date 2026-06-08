export interface FooterAd {
  id: string
  title: string
  tagline: string
  imageUrl: string
  linkUrl: string
  ctaText: string
  active: boolean
  createdAt: Date
}

export const INITIAL_ADS: FooterAd[] = [
  {
    id: "1",
    title: "Partner with Atlas",
    tagline: "Collaborate to advance Sui infrastructure",
    imageUrl: "/images/atlassymbolwhitepurple.png",
    linkUrl: "/contact/partnership",
    ctaText: "Learn More",
    active: true,
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "Discover Sui Tools",
    tagline: "Explore the complete ecosystem",
    imageUrl: "/images/atlassymbolwhitepurple.png",
    linkUrl: "/contact/partnership",
    ctaText: "Explore",
    active: true,
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Join the Community",
    tagline: "Be part of Sui's future",
    imageUrl: "/images/atlassymbolwhitepurple.png",
    linkUrl: "/contact/partnership",
    ctaText: "Join Now",
    active: true,
    createdAt: new Date(),
  },
]
