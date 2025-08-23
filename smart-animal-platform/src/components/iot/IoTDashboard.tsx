'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Thermometer, 
  Droplets, 
  Activity, 
  Wifi, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react'

// Mock IoT data
const mockIoTData = {
  temperature: 24.5,
  humidity: 65,
  activity_level: 85,
  feeding_amount: 2.5,
  mosquito_control: true,
  last_update: new Date().toISOString(),
  alerts: [
    { id: 1, type: 'warning', message: 'Temperature slightly high in Barn A', time: '5 min ago' },
    { id: 2, type: 'info', message: 'Feeding schedule completed', time: '1 hour ago' },
    { id: 3, type: 'success', message: 'Mosquito control system activated', time: '2 hours ago' }
  ],
  sensors: [
    { id: 1, name: 'Temperature Sensor', status: 'online', value: '24.5°C', location: 'Barn A' },
    { id: 2, name: 'Humidity Sensor', status: 'online', value: '65%', location: 'Barn A' },
    { id: 3, name: 'Activity Monitor', status: 'online', value: '85%', location: 'Barn A' },
    { id: 4, name: 'Feeding System', status: 'online', value: '2.5kg', location: 'Barn A' },
    { id: 5, name: 'Mosquito Control', status: 'online', value: 'Active', location: 'Barn A' }
  ]
}

export default function IoTDashboard() {
  const [iotData, setIoTData] = useState(mockIoTData)
  const [isConnected, setIsConnected] = useState(true)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIoTData(prev => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(50, Math.min(80, prev.humidity + (Math.random() - 0.5) * 5)),
        activity_level: Math.max(60, Math.min(95, prev.activity_level + (Math.random() - 0.5) * 10)),
        last_update: new Date().toISOString()
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-animal-warning" />
      case 'success': return <CheckCircle className="w-4 h-4 text-animal-healthy" />
      default: return <Clock className="w-4 h-4 text-farm-blue" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">IoT Dashboard</h1>
              <p className="text-gray-600">Real-time sensor monitoring & control</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-animal-healthy' : 'bg-animal-critical'}`} />
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <Button variant="outline" size="sm">
                <Wifi className="w-4 h-4 mr-2" />
                Configure Sensors
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Temperature</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {iotData.temperature.toFixed(1)}°C
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Thermometer className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="mt-2">
                <Progress 
                  value={((iotData.temperature - 15) / (35 - 15)) * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Humidity</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {iotData.humidity.toFixed(0)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2">
                <Progress value={iotData.humidity} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Activity Level</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {iotData.activity_level.toFixed(0)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2">
                <Progress value={iotData.activity_level} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Feeding Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {iotData.feeding_amount}kg
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-2">
                <Progress value={(iotData.feeding_amount / 5) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sensor Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wifi className="w-5 h-5" />
                <span>Sensor Status</span>
              </CardTitle>
              <CardDescription>
                Real-time status of all IoT sensors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {iotData.sensors.map((sensor) => (
                  <div key={sensor.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{sensor.name}</p>
                      <p className="text-sm text-gray-600">{sensor.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{sensor.value}</p>
                      <Badge 
                        variant={sensor.status === 'online' ? 'success' : 'destructive'}
                        className="text-xs"
                      >
                        {sensor.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Recent Alerts</span>
              </CardTitle>
              <CardDescription>
                Latest notifications from IoT sensors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {iotData.alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Last Update */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Last updated: {new Date(iotData.last_update).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  )
}
