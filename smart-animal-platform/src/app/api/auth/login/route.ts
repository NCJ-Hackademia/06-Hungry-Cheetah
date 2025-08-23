import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Simulate database lookup
    const users = [
      {
        id: '1',
        email: 'demo@farmer.com',
        password: 'password',
        name: 'John Farmer',
        role: 'farmer',
        phone: '+91 98765 43210',
        kyc_status: 'verified',
        rating: 4.8,
      },
      {
        id: '2',
        email: 'buyer@example.com',
        password: 'password',
        name: 'Sarah Buyer',
        role: 'buyer',
        phone: '+91 98765 43211',
        kyc_status: 'verified',
        rating: 4.5,
      },
      {
        id: '3',
        email: 'vet@example.com',
        password: 'password',
        name: 'Dr. Smith',
        role: 'vet',
        phone: '+91 98765 43212',
        kyc_status: 'verified',
        rating: 4.9,
      },
    ]

    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token: `demo-token-${user.id}`,
      message: 'Login successful'
    })

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
