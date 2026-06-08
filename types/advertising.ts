export interface AdvertisingPartner {
  id: string
  partner_id: string
  name: string
  logo_url: string
  tagline: string
  website: string
  slot_position: number
  active: boolean
  verified: boolean
  badge?: string
  chains: string[]
  featured: boolean
  ad_type: string
  created_at: string
  updated_at: string
}
