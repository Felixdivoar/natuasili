import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, MapPin, DollarSign, TreePine, Users, Droplets, GraduationCap, Eye, ExternalLink } from "lucide-react";
import { mockBookings, mockProjects, mockExperiences } from "@/data/mockData";
import { Link } from "react-router-dom";

const TravelerDashboard = () => {
  // Mock user bookings with impact allocation data
  const userBookings = [
    {
      id: '1',
      experience_title: 'Big Five Wildlife Tracking Experience',
      project_name: 'Maasai Mara Wildlife Conservancy',
      project_id: '1',
      booking_date: '2024-01-20',
      total_amount: 700,
      project_allocation: 525, // 75% of $700
      platform_allocation: 175, // 25% of $700
      impact_verified: true,
      impact_amount: 263, // Amount actually used for conservation
      impact_description: 'Successfully tracked 3 lion prides, contributing valuable data to conservation research.',
      theme: 'Wildlife',
      status: 'completed'
    },
    {
      id: '2', 
      experience_title: 'Traditional Beadwork Workshop',
      project_name: 'Samburu Education Initiative', 
      project_id: '2',
      booking_date: '2024-01-18',
      total_amount: 240,
      project_allocation: 192, // 80% of $240
      platform_allocation: 48, // 20% of $240
      impact_verified: true,
      impact_amount: 96,
      impact_description: 'Conducted workshop with 8 local women artisans, creating 15 traditional beadwork pieces.',
      theme: 'Education',
      status: 'completed'
    },
    {
      id: '3',
      experience_title: 'Mangrove Restoration Volunteer Day',
      project_name: 'Coastal Forest Restoration',
      project_id: '3', 
      booking_date: '2024-01-16',
      total_amount: 170,
      project_allocation: 119, // 70% of $170
      platform_allocation: 51, // 30% of $170
      impact_verified: true,
      impact_amount: 60,
      impact_description: 'Planted 45 mangrove seedlings and removed 2.3 tons of marine debris.',
      theme: 'Habitat',
      status: 'completed'
    }
  ];

  const totalSpent = userBookings.reduce((sum, booking) => sum + booking.total_amount, 0);
  const totalProjectAllocation = userBookings.reduce((sum, booking) => sum + booking.project_allocation, 0);
  const totalImpactVerified = userBookings.reduce((sum, booking) => sum + booking.impact_amount, 0);

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'Wildlife': return <TreePine className="h-4 w-4" />;
      case 'Education': return <GraduationCap className="h-4 w-4" />;
      case 'Habitat': return <Droplets className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'Wildlife': return 'bg-wildlife/10 text-wildlife border-wildlife/20';
      case 'Education': return 'bg-education/10 text-education border-education/20'; 
      case 'Habitat': return 'bg-habitat/10 text-habitat border-habitat/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Conservation Impact
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Track your bookings and see exactly how your travel dollars are creating real conservation impact.
            </p>
            
            {/* Impact Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">${totalSpent}</div>
                  <div className="text-sm text-muted-foreground">Total Spent</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <TreePine className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">${totalProjectAllocation}</div>
                  <div className="text-sm text-muted-foreground">To Conservation</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">${totalImpactVerified}</div>
                  <div className="text-sm text-muted-foreground">Impact Verified</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{userBookings.length}</div>
                  <div className="text-sm text-muted-foreground">Experiences</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="bookings" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bookings">My Bookings</TabsTrigger>
                <TabsTrigger value="impact">Impact Breakdown</TabsTrigger>
              </TabsList>

              <TabsContent value="bookings" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-foreground">Your Bookings</h2>
                  <Button asChild>
                    <Link to="/browse">Book New Experience</Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {userBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Booking Info */}
                          <div className="lg:col-span-2">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                  {booking.experience_title}
                                </h3>
                                <p className="text-muted-foreground mb-2">
                                  by {booking.project_name}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <CalendarDays className="h-4 w-4" />
                                    {new Date(booking.booking_date).toLocaleDateString()}
                                  </div>
                                  <Badge variant="outline" className="bg-primary/5 text-primary">
                                    {booking.status}
                                  </Badge>
                                </div>
                              </div>
                              <Badge className={getThemeColor(booking.theme)}>
                                {getThemeIcon(booking.theme)}
                                {booking.theme}
                              </Badge>
                            </div>

                            {booking.impact_verified && (
                              <div className="bg-muted/30 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <Eye className="h-4 w-4 text-primary" />
                                  <span className="text-sm font-medium text-foreground">Verified Impact</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {booking.impact_description}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Allocation Breakdown */}
                          <div className="space-y-4">
                            <div>
                              <div className="text-lg font-semibold text-foreground mb-2">
                                ${booking.total_amount} Total
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-muted-foreground">To Conservation</span>
                                    <span className="font-medium">${booking.project_allocation}</span>
                                  </div>
                                  <Progress 
                                    value={(booking.project_allocation / booking.total_amount) * 100} 
                                    className="h-2"
                                  />
                                </div>
                                
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-muted-foreground">Platform Fee</span>
                                    <span className="font-medium">${booking.platform_allocation}</span>
                                  </div>
                                  <Progress 
                                    value={(booking.platform_allocation / booking.total_amount) * 100} 
                                    className="h-2"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/projects/${booking.project_id}`}>
                                  View Partner
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <Link to="/impact-ledger">
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="impact" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Impact by Partner</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Partner breakdown */}
                  {mockProjects.map((project) => {
                    const partnerBookings = userBookings.filter(booking => booking.project_id === project.id);
                    const partnerTotal = partnerBookings.reduce((sum, booking) => sum + booking.project_allocation, 0);
                    const partnerImpact = partnerBookings.reduce((sum, booking) => sum + booking.impact_amount, 0);
                    
                    if (partnerTotal === 0) return null;

                    return (
                      <Card key={project.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="text-2xl font-bold text-primary">${partnerTotal}</div>
                              <div className="text-sm text-muted-foreground">Allocated to Partner</div>
                            </div>
                            
                            <div>
                              <div className="text-lg font-semibold text-foreground">${partnerImpact}</div>
                              <div className="text-sm text-muted-foreground">Verified Impact</div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Impact Rate</span>
                                <span>{partnerTotal > 0 ? Math.round((partnerImpact / partnerTotal) * 100) : 0}%</span>
                              </div>
                              <Progress 
                                value={partnerTotal > 0 ? (partnerImpact / partnerTotal) * 100 : 0}
                                className="h-2"
                              />
                            </div>

                            <div className="text-xs text-muted-foreground">
                              {partnerBookings.length} experience{partnerBookings.length !== 1 ? 's' : ''}
                            </div>

                            <Button variant="outline" size="sm" className="w-full" asChild>
                              <Link to={`/projects/${project.id}`}>
                                View Partner Details
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Impact Transparency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Allocated to Conservation</span>
                        <span className="font-semibold">${totalProjectAllocation}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Verified Impact Created</span>
                        <span className="font-semibold text-primary">${totalImpactVerified}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Impact Verification Rate</span>
                        <span className="font-semibold">
                          {totalProjectAllocation > 0 ? Math.round((totalImpactVerified / totalProjectAllocation) * 100) : 0}%
                        </span>
                      </div>
                      <Progress 
                        value={totalProjectAllocation > 0 ? (totalImpactVerified / totalProjectAllocation) * 100 : 0}
                        className="h-3"
                      />
                      <p className="text-sm text-muted-foreground">
                        Every dollar is tracked from booking to verified conservation impact. 
                        View the full transparency ledger for detailed proof of impact.
                      </p>
                      <Button variant="outline" asChild>
                        <Link to="/impact-ledger">
                          View Full Impact Ledger
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TravelerDashboard;