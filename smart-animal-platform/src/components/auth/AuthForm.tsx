'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Shield, Users, Stethoscope, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['farmer', 'buyer', 'vet']),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
})

type AuthFormData = z.infer<typeof authSchema>

const roles = [
  { value: 'farmer', label: 'Farmer', icon: User, color: 'farmer' },
  { value: 'buyer', label: 'Buyer', icon: Users, color: 'buyer' },
  { value: 'vet', label: 'Veterinarian', icon: Stethoscope, color: 'vet' },
]

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true)
    setError('')
    setSuccess(false)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const payload = isLogin 
        ? { email: data.email, password: data.password }
        : { email: data.email, password: data.password, name: data.name, role: data.role, phone: data.phone }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Authentication failed')
      }

      // Store user data and token
      localStorage.setItem('user', JSON.stringify(result.user))
      localStorage.setItem('token', result.token)

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)

    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-farm-green/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-farm-green" />
          </div>
          <CardTitle className="text-2xl">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Sign in to your Smart Animal Platform account'
              : 'Join thousands of farmers using smart technology'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Input
                    {...register('name')}
                    placeholder="Full Name"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Input
                    {...register('phone')}
                    placeholder="Phone Number"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Select Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {roles.map((role) => (
                      <label
                        key={role.value}
                        className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedRole === role.value
                            ? 'border-farm-green bg-farm-green/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          value={role.value}
                          {...register('role')}
                          className="sr-only"
                        />
                        <role.icon className={`w-5 h-5 mb-1 ${
                          selectedRole === role.value ? 'text-farm-green' : 'text-gray-400'
                        }`} />
                        <span className="text-xs font-medium">{role.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <Input
                {...register('email')}
                type="email"
                placeholder="Email Address"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Input
                {...register('password')}
                type="password"
                placeholder="Password"
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-green-600 text-sm">
                    {isLogin ? 'Login successful! Redirecting...' : 'Account created! Redirecting...'}
                  </p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-farm-green hover:bg-farm-green/90"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-farm-green hover:underline text-sm"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'
              }
            </button>
            
            {isLogin && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-600 text-sm">
                  <strong>Demo Credentials:</strong><br />
                  Email: demo@farmer.com<br />
                  Password: password
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
