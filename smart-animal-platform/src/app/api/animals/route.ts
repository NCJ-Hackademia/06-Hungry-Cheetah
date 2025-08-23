import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Mock database
let animals = [
  {
    id: '1',
    owner_id: '1',
    name: 'Lakshmi',
    species: 'Cow',
    breed: 'Gir',
    dob: '2021-03-15',
    photos: ['/api/placeholder/300/200'],
    health_score: 92,
    vaccination: ['BCG', 'FMD'],
    weight: 450,
    location: 'Punjab, India',
    status: 'active',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    owner_id: '1',
    name: 'Ganga',
    species: 'Cow',
    breed: 'Sahiwal',
    dob: '2020-08-22',
    photos: ['/api/placeholder/300/200'],
    health_score: 88,
    vaccination: ['BCG', 'FMD', 'Brucellosis'],
    weight: 480,
    location: 'Punjab, India',
    status: 'active',
    created_at: '2024-01-10T14:30:00Z',
  },
  {
    id: '3',
    owner_id: '1',
    name: 'Krishna',
    species: 'Buffalo',
    breed: 'Murrah',
    dob: '2019-12-05',
    photos: ['/api/placeholder/300/200'],
    health_score: 95,
    vaccination: ['BCG', 'FMD', 'Brucellosis', 'Anthrax'],
    weight: 520,
    location: 'Punjab, India',
    status: 'active',
    created_at: '2024-01-05T09:15:00Z',
  },
]

const animalSchema = z.object({
  name: z.string().min(1),
  species: z.string().min(1),
  breed: z.string().min(1),
  dob: z.string(),
  weight: z.number().positive(),
  location: z.string().min(1),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get('owner_id')
    const species = searchParams.get('species')
    const status = searchParams.get('status')

    let filteredAnimals = animals

    if (ownerId) {
      filteredAnimals = filteredAnimals.filter(animal => animal.owner_id === ownerId)
    }

    if (species) {
      filteredAnimals = filteredAnimals.filter(animal => animal.species === species)
    }

    if (status) {
      filteredAnimals = filteredAnimals.filter(animal => animal.status === status)
    }

    return NextResponse.json({
      animals: filteredAnimals,
      total: filteredAnimals.length,
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
    const animalData = animalSchema.parse(body)

    // Get user from authorization header (simplified)
    const authHeader = request.headers.get('authorization')
    const userId = authHeader?.replace('Bearer demo-token-', '') || '1'

    const newAnimal = {
      id: Date.now().toString(),
      owner_id: userId,
      ...animalData,
      photos: ['/api/placeholder/300/200'],
      health_score: Math.floor(Math.random() * 20) + 80, // Random health score 80-100
      vaccination: ['BCG'],
      status: 'active',
      created_at: new Date().toISOString(),
    }

    animals.push(newAnimal)

    return NextResponse.json({
      animal: newAnimal,
      message: 'Animal added successfully'
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
