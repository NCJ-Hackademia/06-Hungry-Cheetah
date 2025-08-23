import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/layout/Navigation'
import { 
  User, 
  Bell, 
  Shield, 
  Wifi, 
  CreditCard,
  Settings as SettingsIcon,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'

export default function SettingsPage() {
  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Manage your account and preferences</p>
              </div>
              <Button className="bg-farm-green hover:bg-farm-green/90">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Profile Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Full Name</label>
                      <Input placeholder="John Farmer" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input type="email" placeholder="john@farmer.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone</label>
                      <Input placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Location</label>
                      <Input placeholder="Punjab, India" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Bio</label>
                    <Input placeholder="Tell us about your farming experience..." />
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Notification Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Configure how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Alerts</p>
                      <p className="text-sm text-gray-600">Get urgent alerts via SMS</p>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-600">In-app notifications</p>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Security Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Manage your account security and privacy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Current Password</label>
                      <div className="relative">
                        <Input type="password" placeholder="Enter current password" />
                        <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">New Password</label>
                      <div className="relative">
                        <Input type="password" placeholder="Enter new password" />
                        <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" size="sm">Enable 2FA</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Verification Status</span>
                    <Badge variant="success">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Account Type</span>
                    <Badge variant="farmer">Farmer</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Member Since</span>
                    <span className="text-sm text-gray-600">Jan 2024</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Wifi className="w-4 h-4 mr-2" />
                    IoT Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payment Methods
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    Advanced Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    📧 Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    📖 Documentation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    🎥 Video Tutorials
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
