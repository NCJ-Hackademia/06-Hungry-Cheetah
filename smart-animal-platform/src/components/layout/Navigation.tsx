'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Home, 
  Heart, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Bell,
  Menu,
  X,
  User,
  LogOut
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Animals', href: '/animals', icon: Heart },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-farm-green rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SmartAnimal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-farm-green/10 text-farm-green'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center"
              >
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <div className="relative">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium">John Farmer</span>
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-farm-green/10 text-farm-green'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/api/placeholder/32/32" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">John Farmer</p>
                    <p className="text-xs text-gray-500">Farmer</p>
                  </div>
                </div>
                <Button variant="ghost" className="w-full justify-start mt-2">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
