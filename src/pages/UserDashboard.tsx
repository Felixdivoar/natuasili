import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, 
  Download, 
  Heart, 
  MessageSquare, 
  Settings, 
  User, 
  CreditCard,
  Shield,
  HelpCircle,
  MapPin,
  Star,
  Eye,
  Ticket
} from 'lucide-react';

const UserDashboard = () => {
  const { user, userRole } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Account</h1>
              <p className="text-muted-foreground">Manage your conservation experiences and impact</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={userRole === 'user' ? 'default' : 'secondary'}>
                {userRole}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="bookings" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-8">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Bookings</h2>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Receipts
              </Button>
            </div>

            {/* Booking Status Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">2</div>
                  <p className="text-sm text-muted-foreground">experiences booked</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">8</div>
                  <p className="text-sm text-muted-foreground">experiences attended</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">KES 28,500</div>
                  <p className="text-sm text-muted-foreground">conservation contribution</p>
                </CardContent>
              </Card>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button variant={true ? "default" : "outline"} size="sm">Upcoming</Button>
                <Button variant={false ? "default" : "outline"} size="sm">Past</Button>
              </div>

              {/* Sample Upcoming Booking */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <img 
                        src="/images/placeholder-1.jpg" 
                        alt="Tree Walk Experience" 
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">Tree Walk Conservation Experience</h3>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4" />
                          <span>Karura Forest, Nairobi</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="secondary">
                            <Calendar className="h-3 w-3 mr-1" />
                            Jan 15, 2024
                          </Badge>
                          <span className="text-sm text-muted-foreground">2 people</span>
                          <span className="text-sm font-medium">KES 5,000</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className="text-green-600">Confirmed</Badge>
                      <Button variant="outline" size="sm">
                        <Ticket className="h-4 w-4 mr-1" />
                        View Ticket
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Empty State for when no bookings */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No upcoming bookings</h3>
                    <p className="text-muted-foreground mb-4">Discover amazing conservation experiences in Kenya</p>
                    <Button>Browse Experiences</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Impact Tab */}
          <TabsContent value="impact" className="space-y-6">
            <h2 className="text-2xl font-bold">My Conservation Impact</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Contribution</CardTitle>
                  <CardDescription>Your direct contribution to conservation efforts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">KES 28,500</div>
                  <p className="text-sm text-muted-foreground">Across 8 experiences</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Partner initiatives (90%)</span>
                      <span>KES 25,650</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Platform operations (10%)</span>
                      <span>KES 2,850</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impact Areas</CardTitle>
                  <CardDescription>Conservation themes you've supported</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Wildlife Conservation</span>
                      <Badge variant="secondary">4 experiences</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Community Development</span>
                      <Badge variant="secondary">2 experiences</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Marine Conservation</span>
                      <Badge variant="secondary">2 experiences</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Impact History */}
            <Card>
              <CardHeader>
                <CardTitle>Impact Receipts</CardTitle>
                <CardDescription>Detailed breakdown of your conservation contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Tree Walk Conservation Experience</h4>
                      <p className="text-sm text-muted-foreground">Completed on Dec 15, 2023</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">KES 4,500</p>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Receipt
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            <h2 className="text-2xl font-bold">My Wishlist</h2>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No saved experiences</h3>
                  <p className="text-muted-foreground mb-4">Save experiences you're interested in for later</p>
                  <Button>Browse Experiences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <h2 className="text-2xl font-bold">Messages</h2>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                  <p className="text-muted-foreground">Messages with conservation partners will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-2xl font-bold">Profile Settings</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <input 
                      className="w-full mt-1 px-3 py-2 border rounded-md" 
                      defaultValue={user?.user_metadata?.first_name || ''}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <input 
                      className="w-full mt-1 px-3 py-2 border rounded-md" 
                      defaultValue={user?.user_metadata?.last_name || ''}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input 
                    className="w-full mt-1 px-3 py-2 border rounded-md" 
                    defaultValue={user?.email || ''}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <input className="w-full mt-1 px-3 py-2 border rounded-md" placeholder="+254..." />
                </div>
                <div>
                  <label className="text-sm font-medium">Preferred Language</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-md">
                    <option>English</option>
                    <option>Swahili</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Preferred Currency</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-md">
                    <option>KES (Kenyan Shilling)</option>
                    <option>USD (US Dollar)</option>
                    <option>EUR (Euro)</option>
                    <option>GBP (British Pound)</option>
                  </select>
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <h2 className="text-2xl font-bold">Payment Methods</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Payment Methods</CardTitle>
                  <CardDescription>Manage your payment options</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No saved methods</h3>
                    <p className="text-muted-foreground mb-4">Add a payment method for faster checkout</p>
                    <Button variant="outline">Add Payment Method</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>View your payment history and invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Tree Walk Experience</p>
                        <p className="text-sm text-muted-foreground">Dec 15, 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">KES 5,000</p>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Invoice
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Account Settings</h2>
            
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Preferences</CardTitle>
                  <CardDescription>Choose what emails you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Booking Confirmations</h4>
                      <p className="text-sm text-muted-foreground">Essential booking updates and confirmations</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" defaultChecked disabled />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Conservation Updates</h4>
                      <p className="text-sm text-muted-foreground">Updates about your impact and conservation news</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Marketing Emails</h4>
                      <p className="text-sm text-muted-foreground">New experiences and special offers</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy & Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Download My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <User className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <h2 className="text-2xl font-bold">Help & Support</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">How do I cancel a booking?</h4>
                    <p className="text-xs text-muted-foreground mt-1">You can cancel up to 24 hours before...</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">What if weather affects my experience?</h4>
                    <p className="text-xs text-muted-foreground mt-1">Partners will contact you directly...</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    View All FAQs
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm">
                    <p className="font-medium">Email Support</p>
                    <p className="text-muted-foreground">support@natuasili.com</p>
                    <p className="text-muted-foreground">Response within 24 hours</p>
                  </div>
                  <Button className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;