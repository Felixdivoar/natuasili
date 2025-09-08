import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, DollarSign, Users, TrendingUp, Eye, Star, Upload, FileText, Camera, MapPin, Clock, Plus, Loader2 } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { usePartnerDashboard } from "@/hooks/usePartnerDashboard";
import { FileUpload } from "@/components/ui/file-upload";
import { uploadFile, validateFile } from "@/lib/fileUpload";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
const PartnerDashboard = () => {
  const { formatPrice } = useCurrency();
  const { stats, recentBookings, experiences, loading, error } = usePartnerDashboard();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const handleFileUpload = async (file: File, category: string) => {
    if (!user?.id) return;

    const validation = validateFile(file, 10);
    if (validation) {
      toast.error(validation);
      return;
    }

    setUploadingDoc(category);
    try {
      const result = await uploadFile(file, 'partner-files', category, user.id);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.url) {
        toast.success(`${category} uploaded successfully!`);
        // Here you would typically save the file URL to the partner profile
        console.log(`Uploaded ${category}:`, result.url);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error("An error occurred while uploading the file.");
    } finally {
      setUploadingDoc(null);
    }
  };

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
  return <div className="min-h-screen bg-background">
      <section className="hero-full section-padding-lg bg-primary/5">
        <div className="hero-inner">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-foreground mb-2">Partner dashboard</h1>
            <p className="text-muted-foreground">Manage your conservation experiences and track impact</p>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 py-8 section">

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
                    <span className="text-sm font-medium text-muted-foreground">This month</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold">{stats.monthlyBookings}</div>
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
                    <div className="text-2xl font-bold">{formatPrice(stats.monthlyRevenue)}</div>
                    <p className="text-sm text-muted-foreground">This month</p>
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
                    <div className="text-2xl font-bold">{stats.totalTravelers}</div>
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
                    <div className="text-2xl font-bold">{stats.averageRating}</div>
                    <p className="text-sm text-muted-foreground">Average rating</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bookings over time</CardTitle>
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
                  <CardTitle>Key performance metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Conversion rate</span>
                        <span className="font-semibold">12.4%</span>
                      </div>
                      <Progress value={12.4} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Visitors to bookings</p>
                    </div>
                    <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Average booking value</span>
                      <span className="font-semibold">{stats.totalEarnings > 0 && stats.monthlyBookings > 0 ? formatPrice(Math.round(stats.totalEarnings / stats.monthlyBookings)) : formatPrice(0)}</span>
                    </div>
                      <Progress value={75} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Per experience booking</p>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Return visitor rate</span>
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
                  <CardTitle>Recent bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No recent bookings</p>
                        <p className="text-sm">Bookings will appear here when travelers book your experiences</p>
                      </div>
                    ) : (
                      recentBookings.slice(0, 3).map(booking => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{booking.experience_title}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.adults + (booking.children || 0)} guests • {new Date(booking.booking_date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'outline'}>
                            {booking.status}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly revenue breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total earnings</span>
                      <span className="font-semibold">{formatPrice(stats.totalEarnings)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Platform fee (10%)</span>
                      <span className="text-muted-foreground">-{formatPrice(stats.totalEarnings * 0.1)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Processing fees (est.)</span>
                      <span className="text-muted-foreground">-{formatPrice(stats.totalEarnings * 0.03)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center font-semibold">
                      <span>Net revenue (est.)</span>
                      <span className="text-primary">{formatPrice(stats.totalEarnings * 0.87)}</span>
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
              {experiences.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No experiences yet</p>
                  <p className="text-sm mb-4">Create your first conservation experience to start welcoming travelers</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Experience
                  </Button>
                </div>
              ) : (
                experiences.map(experience => (
                  <Card key={experience.id}>
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                        {experience.hero_image ? (
                          <img 
                            src={experience.hero_image} 
                            alt={experience.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Camera className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <h3 className="font-semibold mb-2">{experience.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {experience.location_text || 'Location not set'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {experience.visible_on_marketplace ? 'Live' : 'Draft'}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{formatPrice(experience.price_kes_adult)}/person</span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
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
                    <FileUpload
                      variant="document"
                      onFileSelect={(file) => handleFileUpload(file, 'business-license')}
                      accept=".pdf,image/*"
                      maxSizeMB={10}
                      loading={uploadingDoc === 'business-license'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="permits">Conservation Permits & Certifications</Label>
                    <FileUpload
                      variant="document"
                      onFileSelect={(file) => handleFileUpload(file, 'permits')}
                      accept=".pdf,image/*"
                      maxSizeMB={10}
                      loading={uploadingDoc === 'permits'}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Upload multiple documents</p>
                      </div>
                    </FileUpload>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="impact-photos">Impact Documentation Photos</Label>
                    <FileUpload
                      variant="document"
                      onFileSelect={(file) => handleFileUpload(file, 'impact-photos')}
                      accept="image/*"
                      maxSizeMB={10}
                      loading={uploadingDoc === 'impact-photos'}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Show your conservation work in action</p>
                      </div>
                    </FileUpload>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="testimonials">Community Testimonials</Label>
                    <Textarea id="testimonials" placeholder="Share testimonials from local community members about your impact..." className="min-h-[100px]" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="partnerships">Partnership Agreements</Label>
                    <Textarea id="partnerships" placeholder="List official partnerships with conservation organizations, government agencies, etc..." className="min-h-[80px]" />
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
                      {recentBookings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground">
                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No bookings yet</p>
                            <p className="text-sm">Bookings will appear here when travelers book your experiences</p>
                          </td>
                        </tr>
                      ) : (
                        recentBookings.map(booking => (
                          <tr key={booking.id} className="border-b">
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{booking.customer_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {booking.adults + (booking.children || 0)} guests
                                </p>
                              </div>
                            </td>
                            <td className="p-4">{booking.experience_title}</td>
                            <td className="p-4">{new Date(booking.booking_date).toLocaleDateString()}</td>
                            <td className="p-4 font-medium">{formatPrice(booking.total_kes)}</td>
                            <td className="p-4">
                              <Badge variant={booking.status === 'confirmed' ? 'default' : 'outline'}>
                                {booking.status}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">View Details</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Booking Details</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Guest Name</Label>
                                        <p className="font-medium">{booking.customer_name}</p>
                                      </div>
                                      <div>
                                        <Label>Email</Label>
                                        <p>{booking.customer_email}</p>
                                      </div>
                                      <div>
                                        <Label>Phone</Label>
                                        <p>{booking.customer_phone || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <Label>Booking Date</Label>
                                        <p>{new Date(booking.booking_date).toLocaleDateString()}</p>
                                      </div>
                                      <div>
                                        <Label>Adults</Label>
                                        <p>{booking.adults}</p>
                                      </div>
                                      <div>
                                        <Label>Children</Label>
                                        <p>{booking.children || 0}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Total Amount</Label>
                                      <p className="text-2xl font-bold text-primary">
                                        {formatPrice(booking.total_kes)}
                                      </p>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </td>
                          </tr>
                        ))
                      )}
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
                    {[1, 2, 3].map(i => <div key={i} className="border-l-4 border-primary pl-4">
                        <p className="font-medium">Tree planting completed</p>
                        <p className="text-sm text-muted-foreground">
                          50 indigenous trees planted in degraded habitat
                        </p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default PartnerDashboard;