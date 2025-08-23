'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, TrendingUp, Shield, ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const features = [
    {
      icon: Heart,
      title: 'Real-time Health Monitoring',
      description: 'IoT sensors track vital signs and environmental conditions 24/7',
      color: 'text-animal-healthy'
    },
    {
      icon: TrendingUp,
      title: 'Smart Analytics Dashboard',
      description: 'AI-powered insights help optimize animal care and predict health issues',
      color: 'text-farm-blue'
    },
    {
      icon: Shield,
      title: 'Secure Marketplace',
      description: 'Escrow-protected transactions with verified animal health data',
      color: 'text-farm-green'
    }
  ]

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-farm-green/20 via-farm-blue/20 to-farm-brown/20 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="success" className="mb-4">
                <Zap className="w-3 h-3 mr-1" />
                IoT-Powered Platform
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Smart Animal{' '}
                <span className="text-farm-green">Management</span>{' '}
                & Marketplace
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Revolutionize your livestock farming with real-time health monitoring, 
                automated care systems, and a secure marketplace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth">
                  <Button size="lg" className="bg-farm-green hover:bg-farm-green/90">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg">
                    View Demo
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 border">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Animal Health Dashboard</h3>
                    <Badge variant="healthy">Live</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="metric-card">
                      <div className="text-2xl font-bold text-animal-healthy">95%</div>
                      <div className="text-sm text-gray-600">Health Score</div>
                    </div>
                    <div className="metric-card">
                      <div className="text-2xl font-bold text-farm-blue">24°C</div>
                      <div className="text-sm text-gray-600">Temperature</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Smart Farming
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From health monitoring to secure transactions, our platform provides 
              comprehensive tools for modern livestock management.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
