import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTravelerDashboard } from '@/hooks/useTravelerDashboard';
import { useCurrency } from '@/contexts/CurrencyContext';
import { 
  Calendar,
  Download,
  Heart,
  MessageCircle,
  User,
  CreditCard,
  Settings,
  HelpCircle,
  FileText,
  Mail,
  Loader2
} from 'lucide-react';
import MessageCenter from "@/components/MessageCenter";

const UserDashboard: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const { formatPrice } = useCurrency();
  const { bookings, wishlist, stats, loading, error } = useTravelerDashboard();
  const [activeTab, setActiveTab] = useState('trips');

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading dashboard: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {profile ? `${profile.first_name || 'Traveler'}` : 'Traveler'}!
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Badge variant="secondary">{profile?.role || 'traveler'}</Badge>
            <Button onClick={signOut} variant="outline">Sign Out</Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide mb-8">
            <TabsList className="inline-flex min-w-full sm:min-w-0 bg-muted/50 p-1 rounded-xl gap-1">
              <TabsTrigger value="trips" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">Trips</TabsTrigger>
              <TabsTrigger value="impact" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">Impact</TabsTrigger>
              <TabsTrigger value="wishlist" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">Wishlist</TabsTrigger>
              <TabsTrigger value="messages" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">Messages</TabsTrigger>
              <TabsTrigger value="profile" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">Profile</TabsTrigger>
              <TabsTrigger value="payments" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">Payments</TabsTrigger>
              <TabsTrigger value="settings" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">Settings</TabsTrigger>
              <TabsTrigger value="support" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">Support</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="trips">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  My Bookings
                </CardTitle>
                <CardDescription>View and manage your conservation experience bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No bookings yet</p>
                      <p className="text-sm">Start exploring conservation experiences!</p>
                    </div>
                  ) : (
                    bookings.map((booking) => (
                      <Card key={booking.id} className="border-l-4 border-l-primary">
                        <CardContent className="pt-6">
                          <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">
                                {booking.experience?.title || 'Experience'}
                              </h4>
                              <p className="text-muted-foreground">
                                {booking.experience?.partner_profiles?.org_name || 'Partner'}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(booking.booking_date).toLocaleDateString()}
                                </span>
                                <span>{booking.adults} adults{booking.children ? `, ${booking.children} children` : ''}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                                {booking.status}
                              </Badge>
                              <p className="text-lg font-semibold mt-2">
                                {formatPrice(booking.total_kes)}
                              </p>
                              <Button size="sm" variant="outline" className="mt-2">
                                <Download className="h-4 w-4 mr-2" />
                                Receipt
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  My Conservation Impact
                </CardTitle>
                <CardDescription>See the conservation impact of your bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl font-bold">{formatPrice(stats.totalSpent)}</div>
                        <div className="text-sm text-muted-foreground">Total Spent</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl font-bold">{formatPrice(stats.conservationContribution)}</div>
                        <div className="text-sm text-muted-foreground">Conservation Impact</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl font-bold">{stats.totalExperiences}</div>
                        <div className="text-sm text-muted-foreground">Experiences</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {stats.totalBookings === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Complete a booking to see your conservation impact
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        You've contributed <span className="font-semibold text-primary">
                        {formatPrice(stats.conservationContribution)}</span> directly to conservation efforts 
                        through your {stats.totalBookings} booking{stats.totalBookings !== 1 ? 's' : ''}.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Saved Experiences
                </CardTitle>
                <CardDescription>Your wishlist of conservation experiences to book later</CardDescription>
              </CardHeader>
              <CardContent>
                {wishlist.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No saved experiences yet</p>
                    <p className="text-sm">Heart experiences you want to book later!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlist.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">
                              {item.experiences?.title || 'Experience'}
                            </h4>
                            <Button variant="ghost" size="sm" className="text-red-500">
                              <Heart className="h-4 w-4 fill-current" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {item.experiences?.description || 'No description available'}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold">
                              {formatPrice(item.experiences?.price_kes_adult || 0)}
                            </span>
                            <Button size="sm">View Details</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <MessageCenter />
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="text-lg">
                      {profile?.first_name && profile?.last_name ? 
                        `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase() : 
                        profile?.email?.[0].toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Change Photo</Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue={profile?.first_name || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue={profile?.last_name || ''} />
                  </div>
                </div>
                
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No saved payment methods</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-semibold">Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Email notifications</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                  </div>
                  <Separator />
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Help & Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;