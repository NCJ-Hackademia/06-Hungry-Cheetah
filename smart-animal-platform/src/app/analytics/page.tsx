import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Navigation from '@/components/layout/Navigation'
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity, 
  Heart, 
  DollarSign,
  Users,
  Calendar
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function AnalyticsPage() {
  const analyticsData = {
    totalRevenue: 1250000,
    revenueGrowth: 12.5,
    totalAnimals: 2450,
    animalGrowth: 8.2,
    avgHealthScore: 87.3,
    healthGrowth: 5.1,
    activeUsers: 1250,
    userGrowth: 15.3
  }

  const monthlyData = [
    { month: 'Jan', revenue: 85000, animals: 180, health: 82 },
    { month: 'Feb', revenue: 92000, animals: 195, health: 84 },
    { month: 'Mar', revenue: 105000, animals: 210, health: 86 },
    { month: 'Apr', revenue: 115000, animals: 225, health: 87 },
    { month: 'May', revenue: 125000, animals: 240, health: 88 },
    { month: 'Jun', revenue: 135000, animals: 255, health: 89 }
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
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600">Comprehensive insights and performance metrics</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="success">Live Data</Badge>
                <span className="text-sm text-gray-500">Updated 2 minutes ago</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(analyticsData.totalRevenue)}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-animal-healthy mr-1" />
                      <span className="text-sm text-animal-healthy">
                        +{analyticsData.revenueGrowth}%
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Animals</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData.totalAnimals.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-animal-healthy mr-1" />
                      <span className="text-sm text-animal-healthy">
                        +{analyticsData.animalGrowth}%
                      </span>
                    </div>
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
                      {analyticsData.avgHealthScore}%
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-animal-healthy mr-1" />
                      <span className="text-sm text-animal-healthy">
                        +{analyticsData.healthGrowth}%
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData.activeUsers.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-animal-healthy mr-1" />
                      <span className="text-sm text-animal-healthy">
                        +{analyticsData.userGrowth}%
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Revenue Trend</span>
                </CardTitle>
                <CardDescription>
                  Monthly revenue growth over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((data, index) => (
                    <div key={data.month} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{data.month}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                          {formatPrice(data.revenue)}
                        </span>
                        <div className="w-32">
                          <Progress 
                            value={(data.revenue / 150000) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Score Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Health Score Trend</span>
                </CardTitle>
                <CardDescription>
                  Average health scores over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((data, index) => (
                    <div key={data.month} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{data.month}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                          {data.health}%
                        </span>
                        <div className="w-32">
                          <Progress 
                            value={data.health} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Performance Metrics</span>
                </CardTitle>
                <CardDescription>
                  Key performance indicators and benchmarks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-animal-healthy mb-2">
                      98.5%
                    </div>
                    <div className="text-sm text-gray-600">Platform Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-farm-blue mb-2">
                      2.3s
                    </div>
                    <div className="text-sm text-gray-600">Average Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-farm-green mb-2">
                      4.8★
                    </div>
                    <div className="text-sm text-gray-600">User Satisfaction</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
