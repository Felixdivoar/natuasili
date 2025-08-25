import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, DollarSign, Users, TrendingUp, Eye, Star, 
  Upload, FileText, Camera, MapPin, Clock, Plus 
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCurrency } from "@/contexts/CurrencyContext";

const PartnerDashboard = () => {
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Partner Dashboard</h1>
          <p className="text-muted-foreground">Manage your conservation experiences and track impact</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="experiences">Experiences</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">This Month</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-sm text-muted-foreground">Bookings</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Revenue</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold">{formatPrice(4890)}</div>
                    <p className="text-sm text-muted-foreground">+12% from last month</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Travelers</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold">89</div>
                    <p className="text-sm text-muted-foreground">Total served</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Rating</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold">4.8</div>
                    <p className="text-sm text-muted-foreground">Average rating</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bookings Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span>January 2024</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 h-2 rounded-full w-16"></div>
                        <span>8 bookings</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>February 2024</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/30 h-2 rounded-full w-20"></div>
                        <span>12 bookings</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>March 2024</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-primary h-2 rounded-full w-24"></div>
                        <span>24 bookings</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Conversion Rate</span>
                        <span className="font-semibold">12.4%</span>
                      </div>
                      <Progress value={12.4} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Visitors to bookings</p>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Average Booking Value</span>
                        <span className="font-semibold">{formatPrice(185)}</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Per experience booking</p>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Return Visitor Rate</span>
                        <span className="font-semibold">28%</span>
                      </div>
                      <Progress value={28} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Repeat bookings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">Elephant Tracking - Maasai Mara</p>
                          <p className="text-sm text-muted-foreground">2 guests • March 15, 2024</p>
                        </div>
                        <Badge variant="outline">Confirmed</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Experience Fees</span>
                      <span className="font-semibold">{formatPrice(4200)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Platform Fee (10%)</span>
                      <span className="text-muted-foreground">-{formatPrice(420)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Processing Fees</span>
                      <span className="text-muted-foreground">-{formatPrice(110)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center font-semibold">
                      <span>Net Revenue</span>
                      <span className="text-primary">{formatPrice(3670)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="experiences" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Experiences</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Experience
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="aspect-video bg-muted rounded-lg mb-4"></div>
                    <h3 className="font-semibold mb-2">Elephant Tracking - Maasai Mara</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Maasai Mara
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        3 hours
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{formatPrice(120)}/person</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-6">Verification & Documentation</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upload Verification Documents</CardTitle>
                  <p className="text-muted-foreground">
                    Help us verify your conservation project and build trust with travelers
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="business-license">Business License/Registration</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="permits">Conservation Permits & Certifications</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload multiple documents</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="impact-photos">Impact Documentation Photos</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Show your conservation work in action</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="testimonials">Community Testimonials</Label>
                    <Textarea
                      id="testimonials"
                      placeholder="Share testimonials from local community members about your impact..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="partnerships">Partnership Agreements</Label>
                    <Textarea
                      id="partnerships"
                      placeholder="List official partnerships with conservation organizations, government agencies, etc..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <Button className="w-full">Submit for Review</Button>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Verification Status</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Pending Review</Badge>
                      <span className="text-sm text-muted-foreground">
                        Review typically takes 3-5 business days
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <h2 className="text-2xl font-bold">Booking Management</h2>
            
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4 font-medium">Guest</th>
                        <th className="p-4 font-medium">Experience</th>
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Amount</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i} className="border-b">
                          <td className="p-4">
                            <div>
                              <p className="font-medium">John Smith</p>
                              <p className="text-sm text-muted-foreground">2 guests</p>
                            </div>
                          </td>
                          <td className="p-4">Elephant Tracking</td>
                          <td className="p-4">March 15, 2024</td>
                          <td className="p-4 font-medium">{formatPrice(240)}</td>
                          <td className="p-4">
                            <Badge variant="outline">Confirmed</Badge>
                          </td>
                          <td className="p-4">
                            <Button variant="outline" size="sm">View Details</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <h2 className="text-2xl font-bold">Earnings Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Total Earnings</span>
                  </div>
                  <div className="text-3xl font-bold">{formatPrice(12450)}</div>
                  <p className="text-sm text-muted-foreground">+18% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">This Month</span>
                  </div>
                  <div className="text-3xl font-bold">{formatPrice(4890)}</div>
                  <p className="text-sm text-muted-foreground">From 24 bookings</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Pending</span>
                  </div>
                  <div className="text-3xl font-bold">{formatPrice(1240)}</div>
                  <p className="text-sm text-muted-foreground">Available in 3 days</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            <h2 className="text-2xl font-bold">Conservation Impact</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Impact Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Trees Planted</span>
                      <span className="text-2xl font-bold text-primary">1,240</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Wildlife Monitored</span>
                      <span className="text-2xl font-bold text-primary">89</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Local Jobs Supported</span>
                      <span className="text-2xl font-bold text-primary">15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Hectares Protected</span>
                      <span className="text-2xl font-bold text-primary">450</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Impact Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border-l-4 border-primary pl-4">
                        <p className="font-medium">Tree planting completed</p>
                        <p className="text-sm text-muted-foreground">
                          50 indigenous trees planted in degraded habitat
                        </p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default PartnerDashboard;