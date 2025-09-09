import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, DollarSign, Users, TrendingUp, Eye, Star, Camera, MapPin, Plus, Loader2, TreePine, Shield, Settings } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useGlobalImpactMetrics } from "@/hooks/useGlobalImpactMetrics";
import { usePartnerDashboard } from "@/hooks/usePartnerDashboard";
import BookingsOverTimeChart from "@/components/BookingsOverTimeChart";
import ExperienceSubmissionForm from "@/components/ExperienceSubmissionForm";
import ImpactProofAdmin from "@/components/ImpactProofAdmin";

const AdminDashboard = () => {
  const { formatPrice } = useCurrency();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any>(null);

  // Use global impact metrics for admin view
  const { 
    getTotalConservationFunding,
    getTotalExperiences,
    getActivePartners,
    getTotalParticipants,
    getTotalDonations,
    getMonthlyDonations,
    loading: metricsLoading
  } = useGlobalImpactMetrics();

  // Use partner dashboard hook to get admin's experiences (since admin is also a partner)
  const { stats, recentBookings, experiences, loading } = usePartnerDashboard();

  // Redirect if not admin
  if (profile && profile.role !== 'admin') {
    toast.error('Access denied. Admin privileges required.');
    navigate('/');
    return null;
  }

  if (loading || metricsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Admin Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.2),transparent)] animate-fade-in"></div>
        <div className="relative w-full py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-scale-in">
                <Shield className="h-4 w-4 mr-2" />
                Administrator Portal
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
                Admin
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Dashboard</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl animate-fade-in">
                Monitor global conservation impact, manage experiences, and oversee platform operations in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="w-full py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between mb-8 gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Global Overview</h2>
                  <p className="text-muted-foreground">Real-time platform metrics and conservation impact</p>
                </div>
                <TabsList className="flex w-full overflow-x-auto scrollbar-hide bg-muted/50 p-1 rounded-xl gap-1 sm:grid sm:grid-cols-3 lg:grid-cols-5">
                  <TabsTrigger value="overview" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm px-3 py-2 whitespace-nowrap">Overview</TabsTrigger>
                  <TabsTrigger value="experiences" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm px-3 py-2 whitespace-nowrap">Experiences</TabsTrigger>
                  <TabsTrigger value="bookings" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm px-3 py-2 whitespace-nowrap">Bookings</TabsTrigger>
                  <TabsTrigger value="impact" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm px-3 py-2 whitespace-nowrap">Impact</TabsTrigger>
                  <TabsTrigger value="settings" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm px-3 py-2 whitespace-nowrap">Settings</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-8 animate-fade-in">
                {/* Global Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/10 group-hover:scale-110 transition-transform duration-300">
                          <DollarSign className="h-6 w-6 text-foreground" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Global</span>
                      </div>
                      <div className="text-3xl font-bold text-foreground mb-1">
                        {formatPrice(getTotalConservationFunding())}
                      </div>
                      <p className="text-sm text-muted-foreground">Conservation Funding</p>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/10 group-hover:scale-110 transition-transform duration-300">
                          <TreePine className="h-6 w-6 text-foreground" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Platform</span>
                      </div>
                      <div className="text-3xl font-bold text-foreground mb-1">
                        {getTotalExperiences()}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Experiences</p>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/10 group-hover:scale-110 transition-transform duration-300">
                          <Users className="h-6 w-6 text-foreground" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Partners</span>
                      </div>
                      <div className="text-3xl font-bold text-foreground mb-1">
                        {getActivePartners()}
                      </div>
                      <p className="text-sm text-muted-foreground">Active Partners</p>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 group-hover:scale-110 transition-transform duration-300">
                          <Star className="h-6 w-6 text-foreground" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Travelers</span>
                      </div>
                      <div className="text-3xl font-bold text-foreground mb-1">
                        {getTotalParticipants()}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Participants</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Donation Impact Cards - Global Platform Impact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-teal-50 hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 group-hover:scale-110 transition-transform duration-300">
                          <TreePine className="h-6 w-6 text-emerald-600" />
                        </div>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                          Platform Impact
                        </Badge>
                      </div>
                      <div className="text-3xl font-bold text-emerald-700 mb-1">
                        {formatPrice(getMonthlyDonations())}
                      </div>
                      <p className="text-sm text-emerald-600 font-medium">This Month's Donations</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Voluntary conservation donations from all travelers
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-teal-50 hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-teal-500/20 to-teal-500/10 group-hover:scale-110 transition-transform duration-300">
                          <TrendingUp className="h-6 w-6 text-teal-600" />
                        </div>
                        <Badge variant="secondary" className="bg-teal-100 text-teal-700 border-teal-200">
                          NatuAsili Impact
                        </Badge>
                      </div>
                      <div className="text-3xl font-bold text-teal-700 mb-1">
                        {formatPrice(getTotalDonations())}
                      </div>
                      <p className="text-sm text-teal-600 font-medium">Total Platform Donations</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Demonstrates how NatuAsili inspires conservation giving
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Analytics Charts */}
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
                            <p className="text-sm">Bookings will appear here when travelers make reservations</p>
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
                </div>
              </TabsContent>

              <TabsContent value="experiences" className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Manage Experiences</h2>
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
                      <p className="text-sm mb-4">Create your first conservation experience to start the platform</p>
                      <Button onClick={() => setShowExperienceForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Experience
                      </Button>
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

              <TabsContent value="impact" className="space-y-6 animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Global Impact Metrics</CardTitle>
                    <p className="text-muted-foreground">Real-time conservation impact across the platform</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                          {formatPrice(getTotalConservationFunding())}
                        </div>
                        <div className="text-sm text-muted-foreground">Conservation Funding Generated</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                          {getTotalExperiences()}
                        </div>
                        <div className="text-sm text-muted-foreground">Conservation Experiences</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                          {getActivePartners()}
                        </div>
                        <div className="text-sm text-muted-foreground">Conservation Partners</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                          {getTotalParticipants()}
                        </div>
                        <div className="text-sm text-muted-foreground">Travelers Served</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Admin Settings</CardTitle>
                    <p className="text-muted-foreground">Platform configuration and management tools</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ImpactProofAdmin />
                  </CardContent>
                </Card>
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

export default AdminDashboard;