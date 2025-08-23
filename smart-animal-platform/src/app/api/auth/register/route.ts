import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['farmer', 'buyer', 'vet']),
  phone: z.string().min(10),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role, phone } = registerSchema.parse(body)

    // Simulate user creation
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In real app, this would be hashed
      name,
      role,
      phone,
      kyc_status: 'pending',
      rating: 0,
      created_at: new Date().toISOString(),
    }

    // Simulate database storage
    console.log('New user registered:', { ...newUser, password: '[HIDDEN]' })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      user: userWithoutPassword,
      token: `demo-token-${newUser.id}`,
      message: 'Account created successfully'
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
