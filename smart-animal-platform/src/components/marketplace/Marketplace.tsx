'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { 
  Search, 
  Filter, 
  Heart, 
  MapPin, 
  Star, 
  MessageCircle,
  Shield,
  TrendingUp
} from 'lucide-react'
import { formatPrice, getHealthStatus, calculateAge } from '@/lib/utils'

// Mock marketplace data
const mockListings = [
  {
    id: '1',
    animal: {
      name: 'Bella',
      species: 'Cow',
      breed: 'Holstein',
      dob: '2022-03-15',
      health_score: 95,
      weight: 650,
      photos: ['/api/placeholder/400/300'],
      vaccination_status: true,
    },
    seller: {
      name: 'John Farmer',
      rating: 4.8,
      location: 'Punjab, India',
      verified: true,
    },
    price: 85000,
    location: 'Punjab, India',
    description: 'Healthy Holstein cow with excellent milk production. All vaccinations up to date.',
    created_at: '2024-01-15',
    views: 45,
    offers: 3
  },
  {
    id: '2',
    animal: {
      name: 'Max',
      species: 'Pig',
      breed: 'Yorkshire',
      dob: '2023-01-20',
      health_score: 78,
      weight: 120,
      photos: ['/api/placeholder/400/300'],
      vaccination_status: false,
    },
    seller: {
      name: 'Sarah Livestock',
      rating: 4.5,
      location: 'Haryana, India',
      verified: true,
    },
    price: 25000,
    location: 'Haryana, India',
    description: 'Young Yorkshire pig ready for breeding. Good temperament and healthy.',
    created_at: '2024-01-10',
    views: 32,
    offers: 1
  },
  {
    id: '3',
    animal: {
      name: 'Luna',
      species: 'Goat',
      breed: 'Saanen',
      dob: '2023-06-10',
      health_score: 88,
      weight: 45,
      photos: ['/api/placeholder/400/300'],
      vaccination_status: true,
    },
    seller: {
      name: 'Raj Goat Farm',
      rating: 4.9,
      location: 'Rajasthan, India',
      verified: true,
    },
    price: 18000,
    location: 'Rajasthan, India',
    description: 'Pure Saanen goat with excellent milk yield. Perfect for dairy farming.',
    created_at: '2024-01-12',
    views: 28,
    offers: 2
  }
]

export default function Marketplace() {
  const [listings, setListings] = useState(mockListings)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecies, setSelectedSpecies] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 100000])

  const species = ['all', 'cow', 'pig', 'goat', 'sheep', 'buffalo']

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.animal.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSpecies = selectedSpecies === 'all' || 
                          listing.animal.species.toLowerCase() === selectedSpecies
    
    const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1]
    
    return matchesSearch && matchesSpecies && matchesPrice
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Animal Marketplace</h1>
              <p className="text-gray-600">Buy and sell livestock with verified health data</p>
            </div>
            <Button className="bg-farm-green hover:bg-farm-green/90">
              <Shield className="w-4 h-4 mr-2" />
              Create Listing
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search animals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-farm-green"
              aria-label="Select animal species"
            >
              {species.map(species => (
                <option key={species} value={species}>
                  {species === 'all' ? 'All Species' : species.charAt(0).toUpperCase() + species.slice(1)}
                </option>
              ))}
            </select>
            
            <Input
              type="number"
              placeholder="Min Price"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
            />
            
            <Input
              type="number"
              placeholder="Max Price"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000])}
            />
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => {
            const healthStatus = getHealthStatus(listing.animal.health_score)
            return (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="animal-card"
              >
                <Card className="h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{listing.animal.name}</CardTitle>
                        <CardDescription>
                          {listing.animal.breed} {listing.animal.species} • {calculateAge(listing.animal.dob)}
                        </CardDescription>
                      </div>
                      <Badge variant={healthStatus.status as any}>
                        {healthStatus.label}
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
                        <span className={`font-semibold ${healthStatus.color}`}>
                          {listing.animal.health_score}%
                        </span>
                      </div>
                      <Progress value={listing.animal.health_score} className="h-2" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Weight:</span>
                        <span>{listing.animal.weight}kg</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{listing.location}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">Seller:</span>
                        <span className="font-medium">{listing.seller.name}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{listing.seller.rating}</span>
                        </div>
                        {listing.seller.verified && (
                          <Badge variant="success" className="text-xs">Verified</Badge>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-farm-green">
                          {formatPrice(listing.price)}
                        </span>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{listing.views} views</span>
                          <span>{listing.offers} offers</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Chat
                        </Button>
                        <Button size="sm" className="flex-1 bg-farm-green hover:bg-farm-green/90">
                          Make Offer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No animals found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
