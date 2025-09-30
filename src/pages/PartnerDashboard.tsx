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
import { Calendar, DollarSign, Users, TrendingUp, Eye, Star, Upload, FileText, Camera, MapPin, Clock, Plus, Loader2, TreePine } from "lucide-react";
import MessageCenter from "@/components/MessageCenter";
import { useCurrency } from "@/contexts/CurrencyContext";
import { usePartnerDashboard } from "@/hooks/usePartnerDashboard";
import { FileUpload } from "@/components/ui/file-upload";
import { uploadFile, validateFile } from "@/lib/fileUpload";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ExperienceSubmissionForm from "@/components/ExperienceSubmissionForm";
import BookingsOverTimeChart from "@/components/BookingsOverTimeChart";
import PartnerImpactProofSubmission from "@/components/PartnerImpactProofSubmission";
import WithdrawalsTab from "@/components/WithdrawalsTab";

const PartnerDashboard = () => {
  const { formatPrice } = useCurrency();
  const { stats, recentBookings, experiences, loading, error } = usePartnerDashboard();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Modern Full-Width Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.2),transparent)] animate-fade-in"></div>
        <div className="relative w-full py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-scale-in">
                <TreePine className="h-4 w-4 mr-2" />
                Conservation Partner Portal
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
                Partner
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Dashboard</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl animate-fade-in">
                Manage your conservation experiences, track bookings, and measure your impact on wildlife and communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Content Section */}
      <div className="w-full py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between mb-8 gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h2>
                  <p className="text-muted-foreground">Monitor your conservation business and impact metrics</p>
                </div>
                <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                  <TabsList className="inline-flex min-w-full sm:min-w-0 bg-muted/50 p-1 rounded-xl gap-1">
                    <TabsTrigger value="overview" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">Overview</TabsTrigger>
                    <TabsTrigger value="experiences" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">Experiences</TabsTrigger>
                    <TabsTrigger value="bookings" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">Bookings</TabsTrigger>
                    <TabsTrigger value="earnings" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">Earnings</TabsTrigger>
                    <TabsTrigger value="withdrawals" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">Withdrawals</TabsTrigger>
                    <TabsTrigger value="impact" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">Impact</TabsTrigger>
                    <TabsTrigger value="verification" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">Verification</TabsTrigger>
                    <TabsTrigger value="messages" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-2 whitespace-nowrap">Messages</TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <TabsContent value="overview" className="space-y-8 animate-fade-in">
                {/* Enhanced Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/10 group-hover:scale-110 transition-transform duration-300">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">This Month</span>
                      </div>
                      <div className="text-3xl font-bold text-foreground mb-1">{stats.monthlyBookings}</div>
                      <p className="text-sm text-muted-foreground">Bookings</p>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/10 group-hover:scale-110 transition-transform duration-300">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Revenue</span>
                      </div>
                      <div className="text-3xl font-bold text-foreground mb-1">{formatPrice(stats.monthlyRevenue)}</div>
                      <p className="text-sm text-muted-foreground">This Month</p>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/10 group-hover:scale-110 transition-transform duration-300">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Travelers</span>
                      </div>
                      <div className="text-3xl font-bold text-foreground mb-1">{stats.totalTravelers}</div>
                      <p className="text-sm text-muted-foreground">Total Served</p>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 group-hover:scale-110 transition-transform duration-300">
                          <Star className="h-6 w-6 text-yellow-600" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Rating</span>
                      </div>
                      <div className="text-3xl font-bold text-foreground mb-1">{stats.averageRating}</div>
                      <p className="text-sm text-muted-foreground">Average Rating</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Donation Impact Cards - Highlighting Additional Impact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-teal-50 hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 group-hover:scale-110 transition-transform duration-300">
                          <TreePine className="h-6 w-6 text-emerald-600" />
                        </div>
                        <Badge variant="secondary" className="bg-foreground text-background">
                          Extra Impact
                        </Badge>
                      </div>
                      <div className="text-3xl font-bold text-emerald-700 mb-1">{formatPrice(stats.monthlyDonations)}</div>
                      <p className="text-sm text-emerald-600 font-medium">Voluntary Donations This Month</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Additional conservation funding from travelers who chose to donate
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-teal-50 hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-teal-500/20 to-teal-500/10 group-hover:scale-110 transition-transform duration-300">
                          <TrendingUp className="h-6 w-6 text-teal-600" />
                        </div>
                        <Badge variant="secondary" className="bg-foreground text-background">
                          Total Impact
                        </Badge>
                      </div>
                      <div className="text-3xl font-bold text-teal-700 mb-1">{formatPrice(stats.totalDonations)}</div>
                      <p className="text-sm text-teal-600 font-medium">Total Conservation Donations</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Total voluntary donations generated by your experiences
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Enhanced Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <BookingsOverTimeChart />

                  <Card className="hover:shadow-lg transition-shadow duration-300">
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
                               <div className="flex-1">
                                 <p className="font-medium">{booking.experience_title}</p>
                                 <p className="text-sm text-muted-foreground">
                                   {booking.adults + (booking.children || 0)} guests • {new Date(booking.booking_date).toLocaleDateString()}
                                 </p>
                                 <div className="flex items-center gap-4 mt-2">
                                   <span className="text-sm font-medium">
                                     {formatPrice(booking.total_kes - booking.donation_kes)}
                                   </span>
                                   {booking.donation_kes > 0 && (
                                     <span className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                                       <TreePine className="h-3 w-3" />
                                       +{formatPrice(booking.donation_kes)} donated
                                     </span>
                                   )}
                                 </div>
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
                </div>
              </TabsContent>

              <TabsContent value="experiences" className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Your Experiences</h2>
                  <Button onClick={() => setShowExperienceForm(true)}>
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Experience
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                          <ExperienceSubmissionForm 
                            isOpen={true}
                            onClose={() => {}} 
                            onSubmit={() => window.location.reload()} 
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    experiences.map(experience => (
                      <Card key={experience.id} className="hover:shadow-lg transition-shadow duration-300">
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
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/experience/${experience.slug}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setEditingExperience(experience)}
                              >
                                Edit
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="verification" className="space-y-6 animate-fade-in">
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold mb-6">Verification & Documentation</h2>
                  
                  <Card className="hover:shadow-lg transition-shadow duration-300">
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

              <TabsContent value="bookings" className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold">Bookings Management</h2>
                
                <div className="grid gap-6">
                  {recentBookings.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                        <p className="text-muted-foreground mb-4">Bookings will appear here when travelers book your experiences</p>
                      </CardContent>
                    </Card>
                  ) : (
                    recentBookings.map(booking => (
                      <Card key={booking.id} className="hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-foreground mb-2">
                                {booking.experience_title}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(booking.booking_date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {booking.adults + (booking.children || 0)} guests
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  {formatPrice(booking.total_kes)}
                                </div>
                              </div>
                            </div>
                            <Badge variant={booking.status === 'confirmed' ? 'default' : 'outline'}>
                              {booking.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="earnings" className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold">Earnings Overview</h2>
                
                <Card className="hover:shadow-lg transition-shadow duration-300">
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
              </TabsContent>

              <TabsContent value="impact" className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold">Conservation Impact</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TreePine className="h-5 w-5 text-green-600" />
                        Conservation Fund
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground mb-2">
                        {formatPrice(stats.totalEarnings * 0.1)}
                      </div>
                      <p className="text-sm text-muted-foreground">Generated for conservation</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        Travelers Served
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground mb-2">
                        {stats.totalTravelers}
                      </div>
                      <p className="text-sm text-muted-foreground">Conservation advocates</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-600" />
                        Impact Rating
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground mb-2">
                        {stats.averageRating}
                      </div>
                      <p className="text-sm text-muted-foreground">Average experience rating</p>
                    </CardContent>
                  </Card>
                </div>
                
                <PartnerImpactProofSubmission />
              </TabsContent>

              <TabsContent value="withdrawals" className="space-y-6 animate-fade-in">
                <WithdrawalsTab />
              </TabsContent>

              <TabsContent value="messages" className="space-y-6 animate-fade-in">
                <MessageCenter />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Experience Submission Form */}
      <ExperienceSubmissionForm
        isOpen={showExperienceForm}
        onClose={() => setShowExperienceForm(false)}
        onSubmit={() => {
          setShowExperienceForm(false);
          window.location.reload();
        }}
      />

      {/* Edit Experience Form */}
      <ExperienceSubmissionForm
        isOpen={!!editingExperience}
        experience={editingExperience}
        onClose={() => setEditingExperience(null)}
        onSubmit={() => {
          setEditingExperience(null);
          window.location.reload();
        }}
      />
    </div>
  );
};

export default PartnerDashboard;