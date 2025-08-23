import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import Navigation from '@/components/layout/Navigation'
import { 
  Search, 
  Plus, 
  Filter, 
  Heart, 
  Activity, 
  Thermometer,
  Droplets,
  Calendar,
  MapPin,
  Eye
} from 'lucide-react'
import { formatPrice, getHealthStatus } from '@/lib/utils'

export default function AnimalsPage() {
  const animals = [
    {
      id: 1,
      name: "Lakshmi",
      species: "Cow",
      breed: "Gir",
      age: 3,
      healthScore: 92,
      weight: 450,
      location: "Punjab, India",
      lastCheck: "2 hours ago",
      temperature: 38.5,
      humidity: 65,
      activity: "Active",
      image: "/api/placeholder/200/200"
    },
    {
      id: 2,
      name: "Ganesh",
      species: "Buffalo",
      breed: "Murrah",
      age: 4,
      healthScore: 88,
      weight: 550,
      location: "Haryana, India",
      lastCheck: "1 hour ago",
      temperature: 38.2,
      humidity: 62,
      activity: "Resting",
      image: "/api/placeholder/200/200"
    },
    {
      id: 3,
      name: "Sita",
      species: "Cow",
      breed: "Sahiwal",
      age: 2,
      healthScore: 95,
      weight: 380,
      location: "Rajasthan, India",
      lastCheck: "30 minutes ago",
      temperature: 38.8,
      humidity: 58,
      activity: "Active",
      image: "/api/placeholder/200/200"
    },
    {
      id: 4,
      name: "Krishna",
      species: "Buffalo",
      breed: "Nili-Ravi",
      age: 5,
      healthScore: 85,
      weight: 600,
      location: "Punjab, India",
      lastCheck: "3 hours ago",
      temperature: 37.9,
      humidity: 70,
      activity: "Feeding",
      image: "/api/placeholder/200/200"
    }
  ]

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Animals</h1>
                <p className="text-gray-600">Monitor and manage your livestock</p>
              </div>
              <Button className="bg-farm-green hover:bg-farm-green/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Animal
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search animals by name, species, or breed..." 
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Animals</p>
                    <p className="text-2xl font-bold text-gray-900">{animals.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Health Score</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(animals.reduce((acc, animal) => acc + animal.healthScore, 0) / animals.length)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Weight</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {animals.reduce((acc, animal) => acc + animal.weight, 0)} kg
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Thermometer className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Animals</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {animals.filter(animal => animal.activity === "Active").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Animals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animals.map((animal) => (
              <Card key={animal.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                                         <div>
                       <CardTitle className="text-lg">{animal.name}</CardTitle>
                       <div className="flex items-center gap-2 text-sm text-muted-foreground">
                         <span>{animal.breed} {animal.species}</span>
                         <Badge variant={getHealthStatus(animal.healthScore).variant}>
                           {animal.healthScore}% Health
                         </Badge>
                       </div>
                     </div>
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Heart className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Health Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Health Score</span>
                      <span>{animal.healthScore}%</span>
                    </div>
                    <Progress value={animal.healthScore} className="h-2" />
                  </div>

                  {/* Animal Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{animal.age} years</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-gray-400" />
                      <span>{animal.weight} kg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{animal.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span>{animal.activity}</span>
                    </div>
                  </div>

                  {/* Real-time Metrics */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Live Metrics</h4>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-medium">{animal.temperature}°C</div>
                        <div className="text-gray-500">Temp</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{animal.humidity}%</div>
                        <div className="text-gray-500">Humidity</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-green-600">{animal.activity}</div>
                        <div className="text-gray-500">Status</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Activity className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 text-center">
                    Last updated: {animal.lastCheck}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
