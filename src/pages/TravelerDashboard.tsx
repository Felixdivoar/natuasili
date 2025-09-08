import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, MapPin, DollarSign, TreePine, Users, Droplets, GraduationCap, Eye, ExternalLink, User, Edit, Save, Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTravelerDashboard } from "@/hooks/useTravelerDashboard";

const TravelerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { formatPrice } = useCurrency();
  const { bookings, wishlist, stats, loading, error } = useTravelerDashboard();

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

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'Wildlife':
        return <TreePine className="h-4 w-4" />;
      case 'Education':
        return <GraduationCap className="h-4 w-4" />;
      case 'Habitat':
        return <Droplets className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'Wildlife':
        return 'bg-wildlife/10 text-wildlife border-wildlife/20';
      case 'Education':
        return 'bg-education/10 text-education border-education/20';
      case 'Habitat':
        return 'bg-habitat/10 text-habitat border-habitat/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Modern Full-Width Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent)] animate-fade-in"></div>
        <div className="relative w-full py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
                Your Dashboard
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Impact</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in">
                Track your bookings and see exactly how your travel dollars are creating real conservation impact across Kenya.
              </p>
            </div>
            
            {/* Enhanced Impact Summary Grid */}
            <div className="max-w-6xl mx-auto mt-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <DollarSign className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">{formatPrice(stats.totalSpent)}</div>
                    <div className="text-sm text-muted-foreground font-medium">Total Investment</div>
                  </CardContent>
                </Card>
                
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <TreePine className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">{formatPrice(stats.conservationContribution)}</div>
                    <div className="text-sm text-muted-foreground font-medium">To Conservation</div>
                  </CardContent>
                </Card>
                
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Eye className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">{formatPrice(stats.conservationContribution * 0.8)}</div>
                    <div className="text-sm text-muted-foreground font-medium">Impact Verified</div>
                  </CardContent>
                </Card>
                
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">{stats.totalExperiences}</div>
                    <div className="text-sm text-muted-foreground font-medium">Experiences</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Content Section */}
      <div className="w-full py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h2>
                  <p className="text-muted-foreground">Manage your conservation journey and track your impact</p>
                </div>
                <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-4 gap-1 bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
                  <TabsTrigger value="bookings" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Bookings</TabsTrigger>
                  <TabsTrigger value="wishlist" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Wishlist</TabsTrigger>
                  <TabsTrigger value="impact" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Impact</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-8 animate-fade-in">
                {/* Modern Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <Card className="col-span-1 md:col-span-2 xl:col-span-1 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-primary" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {bookings.slice(0, 3).map((booking, index) => (
                          <div key={booking.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{booking.experience?.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(booking.booking_date).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                              {booking.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        Wishlist
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground mb-2">{wishlist.length}</div>
                      <p className="text-sm text-muted-foreground mb-4">Saved experiences</p>
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <Link to="/browse">Explore More</Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <TreePine className="h-5 w-5 text-green-600" />
                        Impact Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground mb-2">
                        {Math.round((stats.conservationContribution / 1000) * 10) / 10}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">Conservation points</p>
                      <Progress value={65} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">65% to next milestone</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="bookings" className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Your Bookings</h3>
                    <p className="text-muted-foreground">Manage and track your conservation experiences</p>
                  </div>
                  <Button asChild className="w-fit">
                    <Link to="/browse">Book New Experience</Link>
                  </Button>
                </div>

                <div className="grid gap-6">
                  {bookings.length === 0 ? (
                    <Card className="text-center py-12">
                      <CardContent>
                        <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                        <p className="text-muted-foreground mb-6">Start your conservation journey by booking your first experience</p>
                        <Button asChild>
                          <Link to="/browse">Explore Experiences</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    bookings.map((booking) => (
                      <Card key={booking.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h4 className="text-xl font-semibold text-foreground mb-2">
                                    {booking.experience?.title}
                                  </h4>
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                                    <div className="flex items-center gap-1">
                                      <CalendarDays className="h-4 w-4" />
                                      {new Date(booking.booking_date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Users className="h-4 w-4" />
                                      {booking.adults} adults{booking.children ? `, ${booking.children} children` : ''}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <DollarSign className="h-4 w-4" />
                                      {formatPrice(booking.total_kes)}
                                    </div>
                                  </div>
                                </div>
                                <Badge 
                                  variant={booking.status === 'confirmed' ? 'default' : booking.status === 'pending' ? 'secondary' : 'outline'}
                                  className="capitalize"
                                >
                                  {booking.status}
                                </Badge>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-4">
                                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border bg-primary/10 text-primary border-primary/20">
                                  <TreePine className="h-4 w-4" />
                                  Conservation
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-3">
                                {booking.experience?.partner_profiles?.slug ? (
                                  <Button variant="outline" size="sm" asChild>
                                    <Link to={`/partner/${booking.experience.partner_profiles.slug}`}>
                                      <User className="h-4 w-4 mr-2" />
                                      View Partner
                                    </Link>
                                  </Button>
                                ) : (
                                  <Button variant="outline" size="sm" disabled>
                                    Partner details unavailable
                                  </Button>
                                )}
                                <Button variant="outline" size="sm" asChild>
                                  <Link to="/impact-ledger">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View Impact
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="wishlist" className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Your Wishlist</h2>
                  <Button asChild>
                    <Link to="/browse">Add More</Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No saved experiences yet</h3>
                      <p className="text-muted-foreground mb-4">Save experiences you're interested in to view them later</p>
                      <Button asChild>
                        <Link to="/browse">Browse Experiences</Link>
                      </Button>
                    </div>
                  ) : (
                    wishlist.map((item) => (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="aspect-video bg-muted rounded-lg mb-4"></div>
                          <h3 className="font-semibold mb-2">Conservation Experience</h3>
                          <p className="text-sm text-muted-foreground mb-4">Location details</p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold">{formatPrice(5000)}/person</span>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm">Book</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="impact" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Your Conservation Impact</h2>
                  <p className="text-muted-foreground">See the real-world difference your travel is making</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TreePine className="h-5 w-5" />
                        Trees Protected
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground mb-2">
                        {Math.round(stats.conservationContribution / 100)}
                      </div>
                      <p className="text-sm text-muted-foreground">Equivalent trees saved</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Droplets className="h-5 w-5" />
                        Water Conserved
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground mb-2">
                        {Math.round(stats.conservationContribution / 50)}L
                      </div>
                      <p className="text-sm text-muted-foreground">Clean water access</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>  
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Communities Supported
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground mb-2">
                        {Math.max(1, Math.floor(stats.totalExperiences / 2))}
                      </div>
                      <p className="text-sm text-muted-foreground">Local communities</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Impact Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {bookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <TreePine className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{booking.experience?.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(booking.total_kes * 0.1)} contributed to conservation
                            </p>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(booking.booking_date).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelerDashboard;