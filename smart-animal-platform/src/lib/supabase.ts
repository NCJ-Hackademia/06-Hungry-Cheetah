import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  role: 'farmer' | 'buyer' | 'vet' | 'admin'
  name: string
  phone: string
  kyc_status: 'pending' | 'verified' | 'rejected'
  rating: number
  created_at: string
  updated_at: string
}

export interface Animal {
  id: string
  owner_id: string
  species: string
  breed: string
  name: string
  dob: string
  photos: string[]
  health_score: number
  vaccination_status: boolean
  weight: number
  location: string
  created_at: string
  updated_at: string
}

export interface AnimalMetric {
  id: string
  animal_id: string
  timestamp: string
  weight: number
  temperature: number
  activity_level: number
  feeding_amount: number
  climate_humidity: number
  climate_temperature: number
  mosquito_control_status: boolean
  notes: string
}

export interface Listing {
  id: string
  animal_id: string
  seller_id: string
  title: string
  description: string
  price: number
  status: 'active' | 'sold' | 'inactive'
  location: string
  created_at: string
  updated_at: string
}

export interface Offer {
  id: string
  listing_id: string
  buyer_id: string
  amount: number
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  message: string
  created_at: string
}

export interface Order {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  escrow_status: 'pending' | 'funded' | 'released' | 'refunded'
  payment_status: 'pending' | 'completed' | 'failed'
  handover_qr: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  thread_id: string
  sender_id: string
  body: string
  created_at: string
}

export interface Review {
  id: string
  order_id: string
  reviewer_id: string
  stars: number
  comment: string
  created_at: string
}
