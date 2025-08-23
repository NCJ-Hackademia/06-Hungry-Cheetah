'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Heart, 
  TrendingUp, 
  Activity, 
  Thermometer, 
  Droplets, 
  Zap,
  Plus,
  Search,
  Filter
} from 'lucide-react'
import { formatPrice, getHealthStatus, calculateAge } from '@/lib/utils'

// Mock data for demo
const mockAnimals = [
  {
    id: '1',
    name: 'Bella',
    species: 'Cow',
    breed: 'Holstein',
    dob: '2022-03-15',
    health_score: 95,
    weight: 650,
    location: 'Barn A',
    photos: ['/api/placeholder/300/200'],
    vaccination_status: true,
    last_feeding: '2 hours ago',
    temperature: 38.5,
    humidity: 65,
    activity_level: 85
  },
  {
    id: '2',
    name: 'Max',
    species: 'Pig',
    breed: 'Yorkshire',
    dob: '2023-01-20',
    health_score: 78,
    weight: 120,
    location: 'Pen B',
    photos: ['/api/placeholder/300/200'],
    vaccination_status: false,
    last_feeding: '1 hour ago',
    temperature: 39.2,
    humidity: 70,
    activity_level: 72
  }
]

const mockMetrics = {
  total_animals: 24,
  healthy_animals: 20,
  alerts: 3,
  avg_health_score: 87,
  total_value: 450000,
  monthly_growth: 12.5
}

export default function Dashboard() {
  const [animals, setAnimals] = useState(mockAnimals)
  const [metrics, setMetrics] = useState(mockMetrics)
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null)

  const healthStatus = getHealthStatus(metrics.avg_health_score)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Smart Animal Dashboard</h1>
              <p className="text-gray-600">Real-time monitoring & management</p>
            </div>
            <Button className="bg-farm-green hover:bg-farm-green/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Animal
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Animals</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.total_animals}</p>
                </div>
                <div className="w-12 h-12 bg-farm-green/10 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-farm-green" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Health Score</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.avg_health_score}%</p>
                </div>
                <div className="w-12 h-12 bg-animal-healthy/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-animal-healthy" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                  <p className="text-2xl font-bold text-animal-warning">{metrics.alerts}</p>
                </div>
                <div className="w-12 h-12 bg-animal-warning/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-animal-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(metrics.total_value)}</p>
                </div>
                <div className="w-12 h-12 bg-farm-blue/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-farm-blue" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Animals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animals.map((animal) => {
            const animalHealth = getHealthStatus(animal.health_score)
            return (
              <motion.div
                key={animal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="animal-card"
              >
                <Card className="h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{animal.name}</CardTitle>
                        <CardDescription>
                          {animal.breed} {animal.species} • {calculateAge(animal.dob)}
                        </CardDescription>
                      </div>
                      <Badge variant={animalHealth.status as any}>
                        {animalHealth.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Animal Photo</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Health Score</span>
                        <span className={`font-semibold ${animalHealth.color}`}>
                          {animal.health_score}%
                        </span>
                      </div>
                      <Progress value={animal.health_score} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Thermometer className="w-4 h-4 text-gray-400" />
                          <span>{animal.temperature}°C</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Droplets className="w-4 h-4 text-gray-400" />
                          <span>{animal.humidity}%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-gray-400" />
                          <span>{animal.activity_level}%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">Weight:</span>
                          <span>{animal.weight}kg</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1 bg-farm-green hover:bg-farm-green/90">
                        Create Listing
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
