import { NextRequest, NextResponse } from 'next/server'

// Mock IoT data
let iotMetrics = [
  {
    id: '1',
    animal_id: '1',
    timestamp: new Date().toISOString(),
    temperature: 38.5,
    humidity: 65,
    activity_level: 85,
    feeding_status: 'fed',
    water_level: 80,
    location: { lat: 30.7333, lng: 76.7794 },
    battery_level: 92,
    signal_strength: 'strong',
  },
  {
    id: '2',
    animal_id: '2',
    timestamp: new Date().toISOString(),
    temperature: 37.8,
    humidity: 62,
    activity_level: 78,
    feeding_status: 'hungry',
    water_level: 45,
    location: { lat: 30.7333, lng: 76.7794 },
    battery_level: 88,
    signal_strength: 'strong',
  },
  {
    id: '3',
    animal_id: '3',
    timestamp: new Date().toISOString(),
    temperature: 39.2,
    humidity: 68,
    activity_level: 92,
    feeding_status: 'fed',
    water_level: 95,
    location: { lat: 30.7333, lng: 76.7794 },
    battery_level: 95,
    signal_strength: 'strong',
  },
]

// Function to generate random IoT data
function generateRandomMetrics(animalId: string) {
  return {
    id: Date.now().toString(),
    animal_id: animalId,
    timestamp: new Date().toISOString(),
    temperature: 37 + Math.random() * 3, // 37-40°C
    humidity: 50 + Math.random() * 30, // 50-80%
    activity_level: 60 + Math.random() * 40, // 60-100%
    feeding_status: Math.random() > 0.5 ? 'fed' : 'hungry',
    water_level: 30 + Math.random() * 70, // 30-100%
    location: { lat: 30.7333, lng: 76.7794 },
    battery_level: 80 + Math.random() * 20, // 80-100%
    signal_strength: ['weak', 'medium', 'strong'][Math.floor(Math.random() * 3)],
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const animalId = searchParams.get('animal_id')
    const limit = parseInt(searchParams.get('limit') || '10')

    let filteredMetrics = iotMetrics

    if (animalId) {
      filteredMetrics = filteredMetrics.filter(metric => metric.animal_id === animalId)
    }

    // Sort by timestamp (newest first)
    filteredMetrics.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Limit results
    filteredMetrics = filteredMetrics.slice(0, limit)

    return NextResponse.json({
      metrics: filteredMetrics,
      total: filteredMetrics.length,
      last_updated: new Date().toISOString(),
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
    const { animal_id } = body

    if (!animal_id) {
      return NextResponse.json(
        { error: 'Animal ID is required' },
        { status: 400 }
      )
    }

    // Generate new metrics
    const newMetrics = generateRandomMetrics(animal_id)
    iotMetrics.push(newMetrics)

    // Keep only last 100 metrics per animal
    const animalMetrics = iotMetrics.filter(m => m.animal_id === animal_id)
    if (animalMetrics.length > 100) {
      const toRemove = animalMetrics.slice(0, animalMetrics.length - 100)
      iotMetrics = iotMetrics.filter(m => !toRemove.includes(m))
    }

    return NextResponse.json({
      metrics: newMetrics,
      message: 'IoT metrics recorded successfully'
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// WebSocket-like endpoint for real-time updates
export async function PUT(request: NextRequest) {
  try {
    // Simulate real-time data update
    const { searchParams } = new URL(request.url)
    const animalId = searchParams.get('animal_id')

    if (animalId) {
      // Update existing metrics with new data
      const existingMetric = iotMetrics.find(m => m.animal_id === animalId)
      if (existingMetric) {
        Object.assign(existingMetric, generateRandomMetrics(animalId))
        existingMetric.id = existingMetric.id // Keep original ID
      }
    }

    return NextResponse.json({
      message: 'Real-time data updated',
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
