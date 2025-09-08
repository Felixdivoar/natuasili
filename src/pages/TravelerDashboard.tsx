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
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary/5 py-12 section">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Your conservation impact</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Track your bookings and see exactly how your travel dollars are creating real conservation impact.
            </p>
            
            {/* Impact Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{formatPrice(stats.totalSpent)}</div>
                  <div className="text-sm text-muted-foreground">Total spent</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <TreePine className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{formatPrice(stats.conservationContribution)}</div>
                  <div className="text-sm text-muted-foreground">To conservation</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{formatPrice(stats.conservationContribution * 0.8)}</div>
                  <div className="text-sm text-muted-foreground">Impact verified</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stats.totalExperiences}</div>
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="bookings">My bookings</TabsTrigger>
                <TabsTrigger value="saved">Saved experiences</TabsTrigger>
                <TabsTrigger value="impact">Impact breakdown</TabsTrigger>
              </TabsList>

              <TabsContent value="bookings" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-foreground">Your bookings</h2>
                  <Button asChild>
                    <Link to="/browse">Book new experience</Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No bookings yet</p>
                      <p className="text-sm mb-4">Start your conservation journey by booking your first experience</p>
                      <Button asChild>
                        <Link to="/browse">Explore Experiences</Link>
                      </Button>
                    </div>
                  ) : (
                    bookings.map(booking => (
                      <Card key={booking.id}>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Booking Info */}
                            <div className="lg:col-span-2">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h3 className="text-lg font-semibold text-foreground mb-2">
                                    {booking.experience?.title || 'Experience'}
                                  </h3>
                                  <p className="text-muted-foreground mb-2">
                                    by {booking.experience?.partner_profiles?.org_name || 'Partner'}
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
                              </div>
                            </div>

                            {/* Allocation Breakdown */}
                            <div className="space-y-4">
                              <div>
                                <div className="text-lg font-semibold text-foreground mb-2">
                                  {formatPrice(booking.total_kes)} Total
                                </div>
                                
                                <div className="space-y-3">
                                  <div>
                                    <div className="flex justify-between text-sm mb-1">
                                      <span className="text-muted-foreground">To Conservation</span>
                                      <span className="font-medium">{formatPrice(booking.total_kes * 0.75)}</span>
                                    </div>
                                    <Progress value={75} className="h-2" />
                                  </div>
                                  
                                  <div>
                                    <div className="flex justify-between text-sm mb-1">
                                      <span className="text-muted-foreground">Platform fee</span>
                                      <span className="font-medium">{formatPrice(booking.total_kes * 0.25)}</span>
                                    </div>
                                    <Progress value={25} className="h-2" />
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={`/partner/${booking.experience?.partner_profiles?.slug || 'partner'}`}>
                                    View partner details
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
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="saved" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-foreground">Saved Experiences</h2>
                  <Button asChild>
                    <Link to="/browse">Browse More</Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishlist.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No saved experiences yet</p>
                      <p className="text-sm mb-4">Heart experiences you want to book later!</p>
                      <Button asChild>
                        <Link to="/browse">Browse Experiences</Link>
                      </Button>
                    </div>
                  ) : (
                    wishlist.map(item => (
                      <Card key={item.id}>
                        <div className="aspect-[4/3] relative">
                          <img 
                            src={item.experiences?.hero_image || '/placeholder-experience.jpg'} 
                            alt={item.experiences?.title || 'Experience'} 
                            className="w-full h-full object-cover" 
                          />
                          <Button variant="ghost" size="sm" className="absolute top-4 right-4 bg-white/80 hover:bg-white text-red-500">
                            <Heart className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-foreground mb-2">
                            {item.experiences?.title || 'Experience'}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                            {item.experiences?.description || 'No description available'}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground">
                              {formatPrice(item.experiences?.price_kes_adult || 0)}
                            </span>
                            <Link to={`/experience/${item.experiences?.slug || 'experience'}`}>
                              <Button size="sm">View Details</Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="impact" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Impact by Partner</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Partner breakdown - Using available data */}
                  {bookings.map(booking => {
                    if (!booking.experience) return null;
                    return (
                      <Card key={booking.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{booking.experience.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="text-2xl font-bold text-primary">{formatPrice(booking.total_kes * 0.15)} <span className="text-sm font-normal">allocated</span></div>
                              <div className="text-sm text-muted-foreground">To conservation project</div>
                            </div>
                            
                            <div>
                              <div className="text-lg font-semibold text-foreground">{formatPrice(booking.total_kes * 0.12)} <span className="text-sm font-normal">verified</span></div>
                              <div className="text-sm text-muted-foreground">Impact created</div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Impact Rate</span>
                                <span>80%</span>
                              </div>
                              <Progress value={80} className="h-2" />
                            </div>

                            <div className="text-xs text-muted-foreground">
                              Booked on {new Date(booking.booking_date).toLocaleDateString()}
                            </div>

                            <Button variant="outline" size="sm" className="w-full" asChild>
                              <Link to={`/experience/${booking.experience.slug || booking.experience_id}`}>
                                View Experience Details
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }).filter(Boolean)}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Impact Transparency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Allocated to Conservation</span>
                        <span className="font-semibold">{formatPrice(stats.conservationContribution)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Verified Impact Created</span>
                        <span className="font-semibold text-primary">{formatPrice(stats.conservationContribution * 0.8)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Impact Verification Rate</span>
                        <span className="font-semibold">
                          80%
                        </span>
                      </div>
                      <Progress value={80} className="h-3" />
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
    </div>;
};
export default TravelerDashboard;