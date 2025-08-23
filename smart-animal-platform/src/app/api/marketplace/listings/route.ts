import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Mock database
let listings = [
  {
    id: '1',
    animal_id: '1',
    seller_id: '1',
    title: 'Healthy Gir Cow - Premium Quality',
    description: 'Beautiful Gir cow with excellent health records. Perfect for dairy farming.',
    price: 85000,
    status: 'active',
    location: 'Punjab, India',
    created_at: '2024-01-20T10:00:00Z',
    views: 45,
    offers: 3,
  },
  {
    id: '2',
    animal_id: '2',
    seller_id: '1',
    title: 'Sahiwal Cow - High Milk Yield',
    description: 'Sahiwal cow with proven milk production. Vaccinated and healthy.',
    price: 92000,
    status: 'active',
    location: 'Punjab, India',
    created_at: '2024-01-18T14:30:00Z',
    views: 32,
    offers: 2,
  },
  {
    id: '3',
    animal_id: '3',
    seller_id: '1',
    title: 'Murrah Buffalo - Excellent Breed',
    description: 'Pure Murrah buffalo with high fat content milk. Perfect for dairy business.',
    price: 120000,
    status: 'active',
    location: 'Punjab, India',
    created_at: '2024-01-15T09:15:00Z',
    views: 28,
    offers: 1,
  },
]

const listingSchema = z.object({
  animal_id: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  location: z.string().min(1),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('seller_id')
    const status = searchParams.get('status')
    const minPrice = searchParams.get('min_price')
    const maxPrice = searchParams.get('max_price')
    const species = searchParams.get('species')

    let filteredListings = listings

    if (sellerId) {
      filteredListings = filteredListings.filter(listing => listing.seller_id === sellerId)
    }

    if (status) {
      filteredListings = filteredListings.filter(listing => listing.status === status)
    }

    if (minPrice) {
      filteredListings = filteredListings.filter(listing => listing.price >= parseInt(minPrice))
    }

    if (maxPrice) {
      filteredListings = filteredListings.filter(listing => listing.price <= parseInt(maxPrice))
    }

    // Sort by created_at (newest first)
    filteredListings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json({
      listings: filteredListings,
      total: filteredListings.length,
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const listingData = listingSchema.parse(body)

    // Get user from authorization header (simplified)
    const authHeader = request.headers.get('authorization')
    const userId = authHeader?.replace('Bearer demo-token-', '') || '1'

    const newListing = {
      id: Date.now().toString(),
      seller_id: userId,
      ...listingData,
      status: 'active',
      created_at: new Date().toISOString(),
      views: 0,
      offers: 0,
    }

    listings.push(newListing)

    return NextResponse.json({
      listing: newListing,
      message: 'Listing created successfully'
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
