import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock analytics data
    const analyticsData = {
      overview: {
        totalRevenue: 1250000,
        revenueGrowth: 12.5,
        totalAnimals: 2450,
        animalGrowth: 8.2,
        avgHealthScore: 87.3,
        healthGrowth: 5.1,
        activeUsers: 1250,
        userGrowth: 15.3,
      },
      monthlyData: [
        { month: 'Jan', revenue: 85000, animals: 180, health: 82 },
        { month: 'Feb', revenue: 92000, animals: 195, health: 84 },
        { month: 'Mar', revenue: 105000, animals: 210, health: 86 },
        { month: 'Apr', revenue: 98000, animals: 225, health: 85 },
        { month: 'May', revenue: 115000, animals: 240, health: 87 },
        { month: 'Jun', revenue: 125000, animals: 245, health: 88 },
      ],
      performance: {
        uptime: 99.8,
        responseTime: 245,
        userSatisfaction: 4.7,
        transactionSuccess: 98.5,
      },
      topAnimals: [
        { id: '1', name: 'Lakshmi', health: 92, revenue: 85000 },
        { id: '2', name: 'Ganga', health: 88, revenue: 92000 },
        { id: '3', name: 'Krishna', health: 95, revenue: 120000 },
      ],
      recentActivity: [
        { type: 'listing_created', message: 'New listing: Healthy Gir Cow', time: '2 hours ago' },
        { type: 'transaction', message: 'Sale completed: ₹92,000', time: '4 hours ago' },
        { type: 'health_alert', message: 'Health check: Krishna (95% score)', time: '6 hours ago' },
        { type: 'iot_update', message: 'IoT data updated for 3 animals', time: '8 hours ago' },
      ],
    }

    return NextResponse.json(analyticsData)

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
